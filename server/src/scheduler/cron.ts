import cron, { ScheduledTask } from 'node-cron';
import { db } from '../db/index.js';
import { broadcastSSE, processQueue } from '../tasks/engine.js';
import { getGeminiClient, getModel } from '../gemini/client.js';
import { RoutineModel } from '../types/index.js';

const activeJobs = new Map<string, ScheduledTask>();

export function initScheduler() {
  // Clear any existing active jobs on restart
  for (const [, job] of activeJobs) {
    job.stop();
  }
  activeJobs.clear();

  // Load all active routines from database
  const stmt = db.prepare('SELECT * FROM routines WHERE isActive = 1');
  const routines = stmt.all() as unknown as RoutineModel[];

  for (const routine of routines) {
    registerRoutineJob(routine);
  }

  // Ensure default morning brief routine exists
  const existingBrief = db.prepare("SELECT * FROM routines WHERE id = 'routine-morning-brief'").get();
  if (!existingBrief) {
    const briefRoutine: RoutineModel = {
      id: 'routine-morning-brief',
      name: 'Daily Executive Morning Brief',
      employeeId: 'emp-8',
      instructions: 'Synthesize all active tasks, pending approvals, completed deliverables, and produce a high-level executive morning brief for leadership.',
      cronExpression: '0 9 * * 1-5', // Weekdays at 9:00 AM
      isActive: 1,
    };
    db.prepare(`
      INSERT INTO routines (id, name, employeeId, instructions, cronExpression, isActive)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(briefRoutine.id, briefRoutine.name, briefRoutine.employeeId, briefRoutine.instructions, briefRoutine.cronExpression);
    registerRoutineJob(briefRoutine);
  }
}

export function registerRoutineJob(routine: RoutineModel) {
  if (!cron.validate(routine.cronExpression)) {
    console.error(`Invalid cron expression for routine ${routine.id}: ${routine.cronExpression}`);
    return;
  }

  const job = cron.schedule(routine.cronExpression, () => {
    runRoutine(routine.id);
  });

  activeJobs.set(routine.id, job);
}

export async function runRoutine(routineId: string) {
  const stmt = db.prepare('SELECT * FROM routines WHERE id = ?');
  const routine = stmt.get(routineId) as RoutineModel | undefined;
  if (!routine) return;

  const taskId = `routine-task-${Date.now()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO tasks (id, title, instructions, assignedEmployeeId, status, priority, createdAt)
    VALUES (?, ?, ?, ?, 'queued', 'medium', ?)
  `).run(taskId, `[Scheduled] ${routine.name}`, routine.instructions, routine.employeeId, now);

  db.prepare('UPDATE routines SET lastRunAt = ? WHERE id = ?').run(now, routineId);

  broadcastSSE('task_created', {
    id: taskId,
    title: `[Scheduled] ${routine.name}`,
    assignedEmployeeId: routine.employeeId,
    status: 'queued',
  });

  processQueue();
}

// Generate Chief of Staff Morning Executive Brief on demand
export async function generateMorningBrief(): Promise<{ briefMarkdown: string; timestamp: string }> {
  const completedTasks = db.prepare("SELECT * FROM tasks WHERE status = 'completed' ORDER BY completedAt DESC LIMIT 5").all() as any[];
  const pendingApprovals = db.prepare("SELECT * FROM approvals WHERE status = 'pending'").all() as any[];
  const activeTasks = db.prepare("SELECT * FROM tasks WHERE status = 'running' OR status = 'queued'").all() as any[];

  const ai = getGeminiClient();
  const model = getModel();

  const prompt = `You are Victoria Sterling, Chief of Staff.
Prepare a concise, professional Morning Executive Brief for the user / CEO.

Current Office Status:
- Active/Queued Tasks: ${JSON.stringify(activeTasks.map((t) => ({ title: t.title, status: t.status, employee: t.assignedEmployeeId })))}
- Tasks Waiting for Human Approval: ${JSON.stringify(pendingApprovals.map((a) => ({ action: a.actionType, employee: a.employeeId })))}
- Recent Completed Deliverables: ${JSON.stringify(completedTasks.map((t) => ({ title: t.title, summary: t.outputSummary })))}

Format your brief clearly with:
1. Executive Summary & Team Morale
2. Key Wins & Completed Deliverables
3. Critical Decisions Requiring CEO Approval
4. Today's Strategic Focus Areas`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { temperature: 0.5 },
  });

  const briefMarkdown = response.text || 'Morning brief generated.';
  const timestamp = new Date().toISOString();

  // Save morning brief to workspace
  const filename = `morning_brief_${new Date().toISOString().split('T')[0]}.md`;
  db.prepare(`
    INSERT INTO tasks (id, title, instructions, assignedEmployeeId, status, priority, createdAt, completedAt, deliverableFile, outputSummary)
    VALUES (?, ?, ?, 'emp-8', 'completed', 'high', ?, ?, ?, ?)
  `).run(
    `brief-${Date.now()}`,
    `Executive Morning Brief (${new Date().toLocaleDateString()})`,
    'Generate daily morning executive brief.',
    timestamp,
    timestamp,
    filename,
    briefMarkdown.slice(0, 300)
  );

  return { briefMarkdown, timestamp };
}
