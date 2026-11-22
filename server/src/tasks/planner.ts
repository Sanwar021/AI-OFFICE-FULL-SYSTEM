import { getGeminiClient, getModel } from '../gemini/client.js';
import { db } from '../db/index.js';
import { broadcastSSE, processQueue } from './engine.js';

export interface PlannedSubtask {
  id: string;
  title: string;
  assignedEmployeeId: string;
  employeeRole: string;
  employeeName: string;
  instructions: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dependsOn?: string[];
  canRunInParallel: boolean;
}

export interface ExecutionPlan {
  objective: string;
  summary: string;
  subtasks: PlannedSubtask[];
  estimatedStages: number;
}

const employeeDirectory: Record<string, { name: string; role: string }> = {
  'emp-1': { name: 'Alex Morgan', role: 'GTM Engineer' },
  'emp-2': { name: 'Olivia Chen', role: 'SEO/AEO Specialist' },
  'emp-3': { name: 'Ethan Brooks', role: 'Web Development Engineer' },
  'emp-4': { name: 'Sophia Parker', role: 'Social Media Manager' },
  'emp-5': { name: 'James Wilson', role: 'Advertisement Manager' },
  'emp-6': { name: 'Isabella Reed', role: 'Sales Executive' },
  'emp-7': { name: 'Noah Davis', role: 'Customer Satisfaction Specialist' },
};

export async function generateObjectivePlan(objective: string): Promise<ExecutionPlan> {
  const ai = getGeminiClient();
  const model = getModel();

  const prompt = `You are Emma Taylor, Chief of Staff of the AI Office.
Your role is to analyze executive business objectives, break them down into structured subtasks, assign the most suitable specialist employees, identify dependencies, and produce an optimal execution plan.

The 7 Specialist AI Employees in your team are:
- emp-1: Alex Morgan (GTM Engineer) - Strategy, positioning, product launches, ICP targeting
- emp-2: Olivia Chen (SEO/AEO Specialist) - Keyword research, search intent, article outlines & content
- emp-3: Ethan Brooks (Web Development Engineer) - Architecture, technical analysis, code generation, bugs
- emp-4: Sophia Parker (Social Media Manager) - Social campaigns, viral hooks, 30-day content calendar
- emp-5: James Wilson (Advertisement Manager) - Paid ad copy, ROAS, campaign structure, ad variants
- emp-6: Isabella Reed (Sales Executive) - Prospect research, lead qualification, cold email sequences
- emp-7: Noah Davis (Customer Satisfaction Specialist) - Support responses, churn analysis, customer FAQs

User Objective:
"${objective}"

Analyze the objective carefully. Deconstruct it into 3 to 6 focused, actionable subtasks.
Respond ONLY with a valid JSON object matching this exact schema:
{
  "objective": "${objective.replace(/"/g, '\\"')}",
  "summary": "Brief executive summary of how the team will tackle this objective",
  "estimatedStages": 2,
  "subtasks": [
    {
      "id": "st-1",
      "title": "Subtask Title",
      "assignedEmployeeId": "emp-1",
      "instructions": "Specific, actionable briefing and instructions for this employee",
      "priority": "high",
      "dependsOn": [],
      "canRunInParallel": true
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
  });

  const rawJson = response.text || '{}';
  const parsed = JSON.parse(rawJson);

  // Enrich subtasks with employee display info
  const enrichedSubtasks: PlannedSubtask[] = (parsed.subtasks || []).map((st: any, idx: number) => {
    const empInfo = employeeDirectory[st.assignedEmployeeId] || { name: 'Specialist', role: 'AI Employee' };
    return {
      id: st.id || `st-${idx + 1}`,
      title: st.title || `Subtask ${idx + 1}`,
      assignedEmployeeId: st.assignedEmployeeId,
      employeeRole: empInfo.role,
      employeeName: empInfo.name,
      instructions: st.instructions || '',
      priority: st.priority || 'medium',
      dependsOn: st.dependsOn || [],
      canRunInParallel: Boolean(st.canRunInParallel),
    };
  });

  return {
    objective,
    summary: parsed.summary || 'Strategic execution plan prepared by Chief of Staff.',
    estimatedStages: parsed.estimatedStages || 2,
    subtasks: enrichedSubtasks,
  };
}

export function executePlan(plan: ExecutionPlan): { createdTaskIds: string[] } {
  const insertStmt = db.prepare(`
    INSERT INTO tasks (id, title, instructions, assignedEmployeeId, status, priority, createdAt)
    VALUES (?, ?, ?, ?, 'queued', ?, ?)
  `);

  const createdTaskIds: string[] = [];
  const now = new Date().toISOString();

  for (const st of plan.subtasks) {
    const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    insertStmt.run(taskId, st.title, st.instructions, st.assignedEmployeeId, st.priority, now);
    createdTaskIds.push(taskId);

    broadcastSSE('task_created', {
      id: taskId,
      title: st.title,
      assignedEmployeeId: st.assignedEmployeeId,
      status: 'queued',
      priority: st.priority,
    });
  }

  // Trigger queue processing
  processQueue();

  return { createdTaskIds };
}
