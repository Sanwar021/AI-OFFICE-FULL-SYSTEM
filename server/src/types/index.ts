export type EmployeeRole =
  | 'GTM Engineer'
  | 'SEO/AEO Specialist'
  | 'Web Development Engineer'
  | 'Social Media Manager'
  | 'Advertisement Manager'
  | 'Sales Executive'
  | 'Customer Satisfaction Specialist'
  | 'Chief of Staff';

export type EmployeeStatus =
  | 'idle'
  | 'thinking'
  | 'writing'
  | 'working'
  | 'waiting_approval'
  | 'completed'
  | 'failed';

export interface EmployeeModel {
  id: string;
  name: string;
  role: EmployeeRole;
  avatarColor: string;
  systemPrompt: string;
  status: EmployeeStatus;
  isActive: number;
}

export type TaskStatus =
  | 'queued'
  | 'running'
  | 'needs_approval'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface TaskModel {
  id: string;
  title: string;
  instructions: string;
  assignedEmployeeId: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  deliverableFile?: string;
  outputSummary?: string;
  approvalData?: string; // JSON
  delegatedToId?: string;
}

export interface ApprovalRecord {
  id: string;
  taskId: string;
  employeeId: string;
  actionType: string;
  content: string;
  destination?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

export interface RoutineModel {
  id: string;
  name: string;
  employeeId: string;
  instructions: string;
  cronExpression: string;
  isActive: number;
  lastRunAt?: string;
}
