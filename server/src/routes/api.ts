import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import { processQueue, cancelTask, getMaxConcurrentTasks, setMaxConcurrentTasks } from '../tasks/engine.js';
import { generateObjectivePlan, executePlan } from '../tasks/planner.js';
import { generateMorningBrief, runRoutine, registerRoutineJob } from '../scheduler/cron.js';
import { testConnection, setApiKey, setModel, getModel } from '../gemini/client.js';
import { listWorkspaceFiles, readFileTool } from '../tools/index.js';
import { TaskModel, EmployeeModel, RoutineModel } from '../types/index.js';

export const apiRouter = Router();

// =================== EMPLOYEES ===================
apiRouter.get('/employees', (_req: Request, res: Response) => {
  const employees = db.prepare('SELECT * FROM employees').all() as unknown as EmployeeModel[];
  res.json({ employees });
});

apiRouter.put('/employees/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { systemPrompt, name } = req.body;
  db.prepare('UPDATE employees SET systemPrompt = coalesce(?, systemPrompt), name = coalesce(?, name) WHERE id = ?').run(
    systemPrompt || null,
    name || null,
    id
  );
  res.json({ success: true });
});

// =================== TASKS ===================
apiRouter.get('/tasks', (_req: Request, res: Response) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY createdAt DESC').all() as unknown as TaskModel[];
  res.json({ tasks });
});

apiRouter.post('/tasks', (req: Request, res: Response) => {
  const { title, instructions, assignedEmployeeId, priority = 'medium' } = req.body;

  if (!title || !instructions || !assignedEmployeeId) {
    return res.status(400).json({ error: 'Missing required task fields.' });
  }

  const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO tasks (id, title, instructions, assignedEmployeeId, status, priority, createdAt)
    VALUES (?, ?, ?, ?, 'queued', ?, ?)
  `).run(taskId, title, instructions, assignedEmployeeId, priority, now);

  processQueue();
  res.json({ success: true, taskId });
});

apiRouter.post('/tasks/:id/cancel', (req: Request, res: Response) => {
  const success = cancelTask(String(req.params.id));
  res.json({ success });
});

apiRouter.post('/tasks/:id/retry', (req: Request, res: Response) => {
  const id = String(req.params.id);
  db.prepare("UPDATE tasks SET status = 'queued', startedAt = null, completedAt = null WHERE id = ?").run(id);
  processQueue();
  res.json({ success: true });
});

// =================== CHIEF OF STAFF PLANNING ===================
apiRouter.post('/plan', async (req: Request, res: Response) => {
  const { objective } = req.body;
  if (!objective) {
    return res.status(400).json({ error: 'Objective is required.' });
  }

  try {
    const plan = await generateObjectivePlan(objective);
    res.json({ success: true, plan });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate plan.' });
  }
});

apiRouter.post('/plan/execute', (req: Request, res: Response) => {
  const { plan } = req.body;
  if (!plan || !plan.subtasks) {
    return res.status(400).json({ error: 'Valid plan is required.' });
  }

  const result = executePlan(plan);
  res.json({ success: true, ...result });
});

apiRouter.post('/brief', async (_req: Request, res: Response) => {
  try {
    const brief = await generateMorningBrief();
    res.json({ success: true, ...brief });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate morning brief.' });
  }
});

// =================== HUMAN APPROVALS ===================
apiRouter.get('/approvals', (_req: Request, res: Response) => {
  const approvals = db.prepare('SELECT * FROM approvals ORDER BY createdAt DESC').all();
  res.json({ approvals });
});

apiRouter.post('/approvals/:id/approve', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const now = new Date().toISOString();

  const approval = db.prepare('SELECT * FROM approvals WHERE id = ?').get(id) as any;
  if (!approval) return res.status(404).json({ error: 'Approval request not found.' });

  db.prepare("UPDATE approvals SET status = 'approved', reviewedAt = ? WHERE id = ?").run(now, id);
  db.prepare("UPDATE tasks SET status = 'completed' WHERE id = ?").run(approval.taskId);
  db.prepare("UPDATE employees SET status = 'idle' WHERE id = ?").run(approval.employeeId);

  res.json({ success: true, status: 'approved' });
});

apiRouter.post('/approvals/:id/reject', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const now = new Date().toISOString();

  const approval = db.prepare('SELECT * FROM approvals WHERE id = ?').get(id) as any;
  if (!approval) return res.status(404).json({ error: 'Approval request not found.' });

  db.prepare("UPDATE approvals SET status = 'rejected', reviewedAt = ? WHERE id = ?").run(now, id);
  db.prepare("UPDATE tasks SET status = 'cancelled' WHERE id = ?").run(approval.taskId);
  db.prepare("UPDATE employees SET status = 'idle' WHERE id = ?").run(approval.employeeId);

  res.json({ success: true, status: 'rejected' });
});

// =================== SCHEDULED ROUTINES ===================
apiRouter.get('/routines', (_req: Request, res: Response) => {
  const routines = db.prepare('SELECT * FROM routines').all();
  res.json({ routines });
});

apiRouter.post('/routines', (req: Request, res: Response) => {
  const { name, employeeId, instructions, cronExpression } = req.body;
  const id = `routine-${Date.now()}`;
  db.prepare(`
    INSERT INTO routines (id, name, employeeId, instructions, cronExpression, isActive)
    VALUES (?, ?, ?, ?, ?, 1)
  `).run(id, name, employeeId, instructions, cronExpression);

  const routine: RoutineModel = { id, name, employeeId, instructions, cronExpression, isActive: 1 };
  registerRoutineJob(routine);
  res.json({ success: true, routine });
});

apiRouter.post('/routines/:id/run', async (req: Request, res: Response) => {
  await runRoutine(String(req.params.id));
  res.json({ success: true });
});

apiRouter.delete('/routines/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  db.prepare('DELETE FROM routines WHERE id = ?').run(id);
  res.json({ success: true });
});

// =================== WORKSPACE FILES ===================
apiRouter.get('/workspace', (_req: Request, res: Response) => {
  const files = listWorkspaceFiles();
  res.json({ files });
});

apiRouter.get('/workspace/:filename', (req: Request, res: Response) => {
  const filename = String(req.params.filename);
  const result = readFileTool(filename);
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result);
});

// =================== SETTINGS & GEMINI ===================
apiRouter.get('/settings', (_req: Request, res: Response) => {
  res.json({
    model: getModel(),
    maxConcurrentTasks: getMaxConcurrentTasks(),
    hasApiKey: true,
  });
});

apiRouter.post('/settings', (req: Request, res: Response) => {
  const { apiKey, model, maxConcurrentTasks: concurrency } = req.body;
  if (apiKey) setApiKey(apiKey);
  if (model) setModel(model);
  if (concurrency) setMaxConcurrentTasks(concurrency);
  res.json({ success: true });
});

apiRouter.post('/settings/test-gemini', async (_req: Request, res: Response) => {
  const result = await testConnection();
  res.json(result);
});
