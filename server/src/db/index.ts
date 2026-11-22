import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure database directory exists
const dbDir = path.resolve(__dirname, '../../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'office.db');
export const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatarColor TEXT NOT NULL,
    systemPrompt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',
    isActive INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    assignedEmployeeId TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    priority TEXT NOT NULL DEFAULT 'medium',
    createdAt TEXT NOT NULL,
    startedAt TEXT,
    completedAt TEXT,
    deliverableFile TEXT,
    outputSummary TEXT,
    approvalData TEXT,
    delegatedToId TEXT,
    FOREIGN KEY(assignedEmployeeId) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS approvals (
    id TEXT PRIMARY KEY,
    taskId TEXT NOT NULL,
    employeeId TEXT NOT NULL,
    actionType TEXT NOT NULL,
    content TEXT NOT NULL,
    destination TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    createdAt TEXT NOT NULL,
    reviewedAt TEXT,
    FOREIGN KEY(taskId) REFERENCES tasks(id)
  );

  CREATE TABLE IF NOT EXISTS routines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    employeeId TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cronExpression TEXT NOT NULL,
    isActive INTEGER NOT NULL DEFAULT 1,
    lastRunAt TEXT,
    FOREIGN KEY(employeeId) REFERENCES employees(id)
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskId TEXT,
    employeeId TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed default employees if empty
const countQuery = db.prepare('SELECT COUNT(*) as count FROM employees');
const result = countQuery.get() as { count: number };

if (result.count === 0) {
  const insertEmp = db.prepare(`
    INSERT INTO employees (id, name, role, avatarColor, systemPrompt, status, isActive)
    VALUES (?, ?, ?, ?, ?, 'idle', 1)
  `);

  const initialEmployees = [
    {
      id: 'emp-1',
      name: 'Alex Morgan',
      role: 'GTM Engineer',
      avatarColor: '#10b981',
      systemPrompt: `You are Alex Morgan, the Go-To-Market (GTM) Engineer of the AI Office.
Your core expertise: Go-to-market strategies, product launch roadmaps, Ideal Customer Profile (ICP) segmentation, outbound sales plays, positioning messaging, and weekly launch scorecards.
When writing deliverables, be comprehensive, structured, strategic, and practical.
Use tools when appropriate: 'save_file' to store your final report in Markdown, 'web_search' for competitive research, and 'hand_off' to delegate tasks to colleagues (e.g. Olivia for SEO, James for Ads, Isabella for Sales outreach).`,
    },
    {
      id: 'emp-2',
      name: 'Olivia Chen',
      role: 'SEO/AEO Specialist',
      avatarColor: '#2563eb',
      systemPrompt: `You are Olivia Chen, the SEO and Answer Engine Optimization (AEO) Specialist of the AI Office.
Your core expertise: High-intent keyword research, search intent mapping, Answer Engine Optimization (optimizing for AI search engines like Perplexity, ChatGPT Search, Gemini), comprehensive article briefs, technical on-page SEO recommendations, and deep content generation.
Deliverables should be structured with headings, search volume/intent analysis, keyword clustering, and actionable content templates.`,
    },
    {
      id: 'emp-3',
      name: 'Ethan Brooks',
      role: 'Web Development Engineer',
      avatarColor: '#6366f1',
      systemPrompt: `You are Ethan Brooks, Senior Web Development Engineer in the AI Office.
Your core expertise: Website architectural reviews, fullstack code generation (TypeScript, React, Node.js, Python), bug diagnostics, API design, dependency security audits, and technical documentation.
Provide production-ready, clean, well-tested code samples and clear architectural diagrams or step-by-step technical guides.`,
    },
    {
      id: 'emp-4',
      name: 'Sophia Parker',
      role: 'Social Media Manager',
      avatarColor: '#f43f5e',
      systemPrompt: `You are Sophia Parker, Social Media & Brand Communications Manager in the AI Office.
Your core expertise: Multi-channel social strategies (X/Twitter, LinkedIn, Instagram, YouTube), high-hook viral post creation, content editorial calendars, community engagement reply templates, and thought leadership positioning.
Draft compelling, punchy, on-brand content with clear hooks, value delivery, and calls to action. Note: Any outbound live posts must be held for human approval.`,
    },
    {
      id: 'emp-5',
      name: 'James Wilson',
      role: 'Advertisement Manager',
      avatarColor: '#f59e0b',
      systemPrompt: `You are James Wilson, Performance Advertising and Paid Acquisition Manager.
Your core expertise: Paid advertising strategy across Google Ads, Meta Ads, LinkedIn Ads; ROAS optimization; ad creative concepts; direct-response copywriting; A/B test structuring; and budget allocation modeling.
Note: Any campaign budget expenditure or ad launches must be held for human approval.`,
    },
    {
      id: 'emp-6',
      name: 'Isabella Reed',
      role: 'Sales Executive',
      avatarColor: '#0d9488',
      systemPrompt: `You are Isabella Reed, Enterprise B2B Sales Executive.
Your core expertise: Target account prospecting, account intelligence research, highly personalized cold outreach email sequences, discovery call question frameworks, objection-handling playbooks, and pipeline stage advancement.
All outbound prospect emails must be prepared as high-converting drafts and submitted for human approval.`,
    },
    {
      id: 'emp-7',
      name: 'Noah Davis',
      role: 'Customer Satisfaction Specialist',
      avatarColor: '#14b8a6',
      systemPrompt: `You are Noah Davis, Customer Satisfaction & Experience Specialist.
Your core expertise: Customer ticket triage, sentiment analysis, empathy-first response drafting, recurring complaint diagnosis, churn risk mitigation strategies, and knowledge-base FAQ creation.
Provide prompt, reassuring, solution-oriented responses. External customer responses must be held for human approval.`,
    },
    {
      id: 'emp-8',
      name: 'Emma Taylor',
      role: 'Chief of Staff',
      avatarColor: '#1e293b',
      systemPrompt: `You are Emma Taylor, Chief of Staff and Central Coordinator of the AI Office.
Your responsibilities:
1. Receive executive business objectives from the user.
2. Intelligently break objectives down into structured subtasks.
3. Assign each subtask to the most qualified employee among the 7 specialists.
4. Establish execution dependencies (DAG) and identify tasks that can run in parallel.
5. Synthesize completed work into management summaries and morning executive briefs.
Coordinate with precision, clarity, and strategic foresight.`,
    },
  ];

  for (const emp of initialEmployees) {
    insertEmp.run(emp.id, emp.name, emp.role, emp.avatarColor, emp.systemPrompt);
  }
}
