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

export type AnimationState =
  | 'idle'
  | 'thinking'
  | 'typing'
  | 'working'
  | 'walking'
  | 'delivering'
  | 'waiting_approval'
  | 'completed'
  | 'error';

export interface DeskPosition {
  x: number;
  y: number;
  z: number;
  rotationY: number; // facing direction
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  avatarColor: string;
  hairColor: string;
  suitColor: string;
  avatarUrl?: string;
  actionSnippet?: string;
  startedAt?: string;
  status: EmployeeStatus;
  animationState: AnimationState;
  currentTaskTitle?: string;
  currentProgress?: number;
  deskIndex: number;
  deskPosition: DeskPosition;
  position: [number, number, number]; // current 3D position
  targetPosition?: [number, number, number]; // walking target
  monitorContent?: string;
  systemPrompt: string;
}

export type TaskStatus =
  | 'queued'
  | 'running'
  | 'needs_approval'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Task {
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
  needsApprovalData?: {
    actionType: string;
    content: string;
    destination?: string;
  };
  delegatedToEmployeeId?: string;
}

export type CameraPreset = 'overview' | 'team' | 'follow';
export type TimeOfDay = 'day' | 'evening';
