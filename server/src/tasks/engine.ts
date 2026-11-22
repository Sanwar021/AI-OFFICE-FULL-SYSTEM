import { Response } from 'express';
import { db } from '../db/index.js';
import { getGeminiClient, getModel } from '../gemini/client.js';
import { saveFileTool, readFileTool, geminiToolDeclarations } from '../tools/index.js';
import { TaskModel, EmployeeModel } from '../types/index.js';

// Server-Sent Events (SSE) Client Hub
const sseClients = new Set<Response>();

export function registerSSEClient(res: Response) {
  sseClients.add(res);
  res.on('close', () => {
    sseClients.delete(res);
  });
}

export function broadcastSSE(type: string, payload: any) {
  const data = JSON.stringify({ type, data: payload, timestamp: new Date().toISOString() });
  const message = `data: ${data}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Concurrency & Queue Management
let maxConcurrentTasks = 3;
let activeTaskCount = 0;
const runningTasks = new Map<string, AbortController>();

export function getMaxConcurrentTasks(): number {
  return maxConcurrentTasks;
}

export function setMaxConcurrentTasks(val: number) {
  maxConcurrentTasks = Math.max(1, Math.min(10, val));
}

// Record an activity log
export function logActivity(taskId: string | null, employeeId: string, action: string, details?: string) {
  const stmt = db.prepare(`
    INSERT INTO activity_logs (taskId, employeeId, action, details, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(taskId, employeeId, action, details || '', new Date().toISOString());
  broadcastSSE('activity_log', { taskId, employeeId, action, details, timestamp: new Date().toISOString() });
}

// Check and pump the task execution queue
export async function processQueue() {
  if (activeTaskCount >= maxConcurrentTasks) return;

  const nextTaskStmt = db.prepare(`
    SELECT * FROM tasks
    WHERE status = 'queued'
    ORDER BY
      CASE priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        ELSE 5
      END,
      createdAt ASC
    LIMIT 1
  `);

  const task = nextTaskStmt.get() as TaskModel | undefined;
  if (!task) return;

  activeTaskCount++;
  executeTask(task).finally(() => {
    activeTaskCount--;
    processQueue();
  });
}

// Execute a single task with Gemini
async function executeTask(task: TaskModel) {
  const taskId = task.id;
  const abortController = new AbortController();
  runningTasks.set(taskId, abortController);

  const empStmt = db.prepare('SELECT * FROM employees WHERE id = ?');
  const employee = empStmt.get(task.assignedEmployeeId) as EmployeeModel | undefined;

  if (!employee) {
    db.prepare('UPDATE tasks SET status = ?, outputSummary = ? WHERE id = ?').run(
      'failed',
      `Assigned employee ${task.assignedEmployeeId} not found`,
      taskId
    );
    runningTasks.delete(taskId);
    return;
  }

  // Update status: running
  const startedAt = new Date().toISOString();
  db.prepare('UPDATE tasks SET status = ?, startedAt = ? WHERE id = ?').run('running', startedAt, taskId);
  db.prepare('UPDATE employees SET status = ? WHERE id = ?').run('working', employee.id);

  broadcastSSE('task_update', { id: taskId, status: 'running', startedAt });
  broadcastSSE('employee_update', { id: employee.id, status: 'working', animationState: 'typing', currentTaskTitle: task.title });
  logActivity(taskId, employee.id, 'started_task', `Began execution of: ${task.title}`);

  let accumulatedText = '';
  let deliverableFile: string | undefined;

  try {
    const ai = getGeminiClient();
    const model = getModel();

    // Check if task involves sensitive outbound actions that require human approval
    const isExternalAction =
      employee.role === 'Social Media Manager' ||
      employee.role === 'Advertisement Manager' ||
      employee.role === 'Sales Executive' ||
      employee.role === 'Customer Satisfaction Specialist' ||
      task.instructions.toLowerCase().includes('email') ||
      task.instructions.toLowerCase().includes('publish') ||
      task.instructions.toLowerCase().includes('send');

    // Build system instruction
    const systemInstruction = `${employee.systemPrompt}
You are operating in the AI Office system.
Current task title: "${task.title}".
Instructions: "${task.instructions}".
Always format your response clearly using markdown.
If generating a major strategy, code, article, or plan, call the 'save_file' tool to persist it in /workspace.
If another employee's skillset is needed (e.g. SEO, code, ads, outbound), call 'hand_off' to delegate a subtask.
${isExternalAction ? 'IMPORTANT: This task produces an outbound action (e.g. email, ad, post, response). Prepare a complete draft and clearly specify the target audience or destination.' : ''}`;

    // Request stream from Gemini
    const stream = await ai.models.generateContentStream({
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: `Please execute this task thoroughly and professionally:\n\n${task.instructions}` }],
        },
      ],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        // @ts-ignore
        tools: [{ functionDeclarations: geminiToolDeclarations }],
        temperature: 0.7,
      },
    });

    for await (const chunk of stream) {
      if (abortController.signal.aborted) {
        throw new Error('Task was cancelled by user.');
      }

      const text = chunk.text;
      if (text) {
        accumulatedText += text;
        broadcastSSE('task_chunk', { taskId, chunk: text, employeeId: employee.id });
      }

      // Check for function calls in chunk
      const functionCalls = chunk.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          const { name, args } = call;
          logActivity(taskId, employee.id, 'tool_call', `Called tool: ${name}`);

          if (name === 'save_file') {
            const { filename, content } = args as { filename: string; content: string };
            const saved = saveFileTool(filename, content);
            deliverableFile = saved.filename;
            logActivity(taskId, employee.id, 'file_saved', `Saved file: ${saved.filename} (${saved.sizeBytes} bytes)`);
            broadcastSSE('file_saved', { taskId, filename: saved.filename, size: saved.sizeBytes });
          } else if (name === 'read_file') {
            const { filename } = args as { filename: string };
            const res = readFileTool(filename);
            logActivity(taskId, employee.id, 'file_read', `Read file: ${filename}`);
          } else if (name === 'hand_off') {
            const { targetEmployeeId, subtaskTitle, instructions } = args as {
              targetEmployeeId: string;
              subtaskTitle: string;
              instructions: string;
            };

            // Trigger physical visual handoff in 3D scene!
            broadcastSSE('handoff_start', {
              sourceEmployeeId: employee.id,
              targetEmployeeId,
              subtaskTitle,
              taskId,
            });

            logActivity(
              taskId,
              employee.id,
              'handoff',
              `Delegated '${subtaskTitle}' to employee ${targetEmployeeId}`
            );

            // Create subtask in database
            const subtaskId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            db.prepare(`
              INSERT INTO tasks (id, title, instructions, assignedEmployeeId, status, priority, createdAt, delegatedToId)
              VALUES (?, ?, ?, ?, 'queued', 'high', ?, ?)
            `).run(subtaskId, subtaskTitle, instructions, targetEmployeeId, new Date().toISOString(), targetEmployeeId);

            broadcastSSE('task_created', {
              id: subtaskId,
              title: subtaskTitle,
              assignedEmployeeId: targetEmployeeId,
              status: 'queued',
            });
          }
        }
      }
    }

    // Check if task needs human approval
    const completedAt = new Date().toISOString();
    if (isExternalAction) {
      const approvalId = `appr-${Date.now()}`;
      const actionType = employee.role === 'Sales Executive' ? 'Cold Outreach Email' :
                         employee.role === 'Social Media Manager' ? 'Social Post Broadcast' :
                         employee.role === 'Advertisement Manager' ? 'Ad Campaign Launch' : 'Customer Support Reply';

      db.prepare(`
        INSERT INTO approvals (id, taskId, employeeId, actionType, content, status, createdAt)
        VALUES (?, ?, ?, ?, ?, 'pending', ?)
      `).run(approvalId, taskId, employee.id, actionType, accumulatedText.slice(0, 4000), completedAt);

      db.prepare('UPDATE tasks SET status = ?, completedAt = ?, deliverableFile = ?, outputSummary = ? WHERE id = ?').run(
        'needs_approval',
        completedAt,
        deliverableFile || null,
        accumulatedText.slice(0, 500),
        taskId
      );
      db.prepare('UPDATE employees SET status = ? WHERE id = ?').run('waiting_approval', employee.id);

      broadcastSSE('task_update', { id: taskId, status: 'needs_approval', completedAt, deliverableFile });
      broadcastSSE('employee_update', { id: employee.id, status: 'waiting_approval', animationState: 'waiting_approval' });
      broadcastSSE('approval_created', { id: approvalId, taskId, employeeId: employee.id, actionType });
      logActivity(taskId, employee.id, 'needs_approval', `Task held for human review: ${actionType}`);
    } else {
      // Completed normally
      db.prepare('UPDATE tasks SET status = ?, completedAt = ?, deliverableFile = ?, outputSummary = ? WHERE id = ?').run(
        'completed',
        completedAt,
        deliverableFile || null,
        accumulatedText.slice(0, 500),
        taskId
      );
      db.prepare('UPDATE employees SET status = ? WHERE id = ?').run('completed', employee.id);

      broadcastSSE('task_update', { id: taskId, status: 'completed', completedAt, deliverableFile });
      broadcastSSE('employee_update', { id: employee.id, status: 'completed', animationState: 'completed' });
      logActivity(taskId, employee.id, 'task_completed', `Completed task: ${task.title}`);

      // Return employee to idle after brief celebratory posture
      setTimeout(() => {
        db.prepare('UPDATE employees SET status = ? WHERE id = ?').run('idle', employee.id);
        broadcastSSE('employee_update', { id: employee.id, status: 'idle', animationState: 'idle' });
      }, 5000);
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Execution error';
    db.prepare('UPDATE tasks SET status = ?, outputSummary = ? WHERE id = ?').run('failed', errorMsg, taskId);
    db.prepare('UPDATE employees SET status = ? WHERE id = ?').run('failed', employee.id);

    broadcastSSE('task_update', { id: taskId, status: 'failed', error: errorMsg });
    broadcastSSE('employee_update', { id: employee.id, status: 'failed', animationState: 'error' });
    logActivity(taskId, employee.id, 'task_failed', errorMsg);

    setTimeout(() => {
      db.prepare('UPDATE employees SET status = ? WHERE id = ?').run('idle', employee.id);
      broadcastSSE('employee_update', { id: employee.id, status: 'idle', animationState: 'idle' });
    }, 4000);
  } finally {
    runningTasks.delete(taskId);
  }
}

// Cancel a running task
export function cancelTask(taskId: string): boolean {
  const controller = runningTasks.get(taskId);
  if (controller) {
    controller.abort();
    db.prepare("UPDATE tasks SET status = 'cancelled' WHERE id = ?").run(taskId);
    broadcastSSE('task_update', { id: taskId, status: 'cancelled' });
    return true;
  }
  return false;
}
