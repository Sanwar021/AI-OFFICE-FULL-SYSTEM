import { create } from 'zustand';
import type { Employee, Task, CameraPreset, TimeOfDay } from '../types/office';

interface OfficeState {
  // Environment
  timeOfDay: TimeOfDay;
  toggleTimeOfDay: () => void;
  setTimeOfDay: (time: TimeOfDay) => void;

  // Camera
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  zoomDelta: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetCamera: () => void;

  // Selected Employee
  selectedEmployeeId: string | null;
  selectEmployee: (id: string | null) => void;

  // Employees
  employees: Employee[];
  updateEmployeeStatus: (id: string, status: Employee['status'], anim?: Employee['animationState']) => void;
  updateEmployeeMonitor: (id: string, content: string) => void;

  // Tasks
  tasks: Task[];
  activeTaskStream: string;
  setActiveTaskStream: (stream: string) => void;
  appendTaskStream: (chunk: string) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;

  // Prompt prefill
  newTaskInitialPrompt: string;
  setNewTaskInitialPrompt: (prompt: string) => void;

  // UI state & Modals
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isTasksModalOpen: boolean;
  setIsTasksModalOpen: (open: boolean) => void;
  isReportsModalOpen: boolean;
  setIsReportsModalOpen: (open: boolean) => void;
  isTaskDetailsModalOpen: boolean;
  setIsTaskDetailsModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  toggleNotifications: () => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  toggleInspector: () => void;
  isRosterCollapsed: boolean;
  toggleRosterCollapse: () => void;
  isTourActive: boolean;
  setIsTourActive: (active: boolean) => void;
  toggleTour: () => void;

  // Filter
  teamFilter: 'all' | 'working' | 'approval' | 'idle';
  setTeamFilter: (filter: 'all' | 'working' | 'approval' | 'idle') => void;
}

const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Alex Morgan',
    role: 'GTM Engineer',
    avatarColor: '#10b981', // Emerald
    hairColor: '#1e293b',
    suitColor: '#0f766e',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: 'Building your go-to-market strategy',
    currentTaskTitle: 'Develop Q3 go-to-market strategy',
    currentProgress: 68,
    startedAt: '9:15 AM',
    status: 'working',
    animationState: 'typing',
    deskIndex: 0,
    deskPosition: { x: -0.88, y: 0, z: 1.98, rotationY: 0 },
    position: [-0.88, 0, 2.6], // Seated in chair
    systemPrompt: 'You are Alex Morgan, the Go-To-Market (GTM) Engineer...',
  },
  {
    id: 'emp-2',
    name: 'Olivia Chen',
    role: 'SEO/AEO Specialist',
    avatarColor: '#2563eb', // Royal Blue
    hairColor: '#b45309',
    suitColor: '#1d4ed8',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: 'Writing your next high-ranking article',
    currentTaskTitle: 'Writing high-authority Answer Engine Optimization guide',
    currentProgress: 82,
    startedAt: '9:30 AM',
    status: 'writing',
    animationState: 'typing',
    deskIndex: 1,
    deskPosition: { x: 0.88, y: 0, z: 1.98, rotationY: 0 },
    position: [0.88, 0, 2.6],
    systemPrompt: 'You are Olivia Chen, the SEO and Answer Engine Optimization (AEO) Specialist...',
  },
  {
    id: 'emp-3',
    name: 'Ethan Brooks',
    role: 'Web Development Engineer',
    avatarColor: '#6366f1', // Indigo
    hairColor: '#0f172a',
    suitColor: '#4338ca',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: 'Optimizing the product landing page',
    currentTaskTitle: 'React 19 migration & landing page performance',
    currentProgress: 45,
    startedAt: '9:45 AM',
    status: 'working',
    animationState: 'typing',
    deskIndex: 2,
    deskPosition: { x: -0.88, y: 0, z: 1.02, rotationY: Math.PI },
    position: [-0.88, 0, 0.4],
    systemPrompt: 'You are Ethan Brooks, the Senior Web Development Engineer...',
  },
  {
    id: 'emp-4',
    name: 'Sophia Parker',
    role: 'Social Media Manager',
    avatarColor: '#f43f5e', // Rose / Coral
    hairColor: '#78350f',
    suitColor: '#be123c',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: "Preparing this week's social content",
    currentTaskTitle: 'Weekly multi-channel announcements & brand launch schedule',
    currentProgress: 90,
    startedAt: '10:00 AM',
    status: 'waiting_approval',
    animationState: 'waiting_approval',
    deskIndex: 3,
    deskPosition: { x: 0.88, y: 0, z: 1.02, rotationY: Math.PI },
    position: [0.88, 0, 0.4],
    systemPrompt: 'You are Sophia Parker, the Social Media & Brand Communications Manager...',
  },
  {
    id: 'emp-5',
    name: 'James Wilson',
    role: 'Advertisement Manager',
    avatarColor: '#f59e0b', // Amber
    hairColor: '#334155',
    suitColor: '#b45309',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: 'Analyzing campaign performance',
    currentTaskTitle: 'Cross-platform CPA attribution model & budget optimization',
    currentProgress: 35,
    startedAt: '10:15 AM',
    status: 'thinking',
    animationState: 'thinking',
    deskIndex: 4,
    deskPosition: { x: -0.88, y: 0, z: -2.02, rotationY: 0 },
    position: [-0.88, 0, -1.4],
    systemPrompt: 'You are James Wilson, the Performance Advertising and Paid Acquisition Manager...',
  },
  {
    id: 'emp-6',
    name: 'Isabella Reed',
    role: 'Sales Executive',
    avatarColor: '#0d9488', // Teal
    hairColor: '#854d0e',
    suitColor: '#0f766e',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: 'Researching high-intent prospects',
    currentTaskTitle: 'Inbound enterprise pipeline outreach & qualification',
    currentProgress: 55,
    startedAt: '10:20 AM',
    status: 'working',
    animationState: 'typing',
    deskIndex: 5,
    deskPosition: { x: 0.88, y: 0, z: -2.02, rotationY: 0 },
    position: [0.88, 0, -1.4],
    systemPrompt: 'You are Isabella Reed, the Enterprise Sales Executive and Business Development Lead...',
  },
  {
    id: 'emp-7',
    name: 'Noah Davis',
    role: 'Customer Satisfaction Specialist',
    avatarColor: '#14b8a6', // Mint
    hairColor: '#475569',
    suitColor: '#0d9488',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: 'Answering customer inquiries',
    currentTaskTitle: 'CSAT sentiment scoring & automated FAQ resolution',
    currentProgress: 75,
    startedAt: '10:30 AM',
    status: 'writing',
    animationState: 'typing',
    deskIndex: 6,
    deskPosition: { x: -0.88, y: 0, z: -2.98, rotationY: Math.PI },
    position: [-0.88, 0, -3.6],
    systemPrompt: 'You are Noah Davis, the Customer Satisfaction & Success Specialist...',
  },
  {
    id: 'emp-8',
    name: 'Emma Taylor',
    role: 'Chief of Staff',
    avatarColor: '#8b5cf6', // Violet
    hairColor: '#1e293b',
    suitColor: '#6d28d9',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    actionSnippet: 'Orchestrating daily workflows',
    currentTaskTitle: 'Multi-agent executive objective coordination',
    currentProgress: 88,
    startedAt: '8:45 AM',
    status: 'working',
    animationState: 'idle',
    deskIndex: 7,
    deskPosition: { x: 0.88, y: 0, z: -2.98, rotationY: Math.PI },
    position: [0.88, 0, -3.6],
    systemPrompt: 'You are Emma Taylor, the Chief of Staff orchestrating the company...',
  },
];

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Develop Q3 Go-To-Market Strategy',
    instructions: 'Analyze enterprise customer segments, map competitive positioning, and outline Q3 sales motion.',
    assignedEmployeeId: 'emp-1',
    status: 'running',
    priority: 'urgent',
    createdAt: 'Today at 9:15 AM',
    startedAt: '9:15 AM',
    outputSummary: 'GTM framework formulated with ICP matrix, outbound cadences, and pipeline targets.',
  },
  {
    id: 'task-2',
    title: 'Author High-Authority AEO Strategy Guide',
    instructions: 'Optimize brand citations and knowledge graph prominence for AI search engines (Perplexity, ChatGPT, Gemini).',
    assignedEmployeeId: 'emp-2',
    status: 'running',
    priority: 'high',
    createdAt: 'Today at 9:30 AM',
    startedAt: '9:30 AM',
    outputSummary: 'Complete authoritative guide with structured data markup and answer engine indexing.',
  },
  {
    id: 'task-3',
    title: 'React 19 & Tailwind 4 Performance Optimization',
    instructions: 'Refactor component bundle sizes, audit Core Web Vitals, and implement zero-layout-shift R3F canvas.',
    assignedEmployeeId: 'emp-3',
    status: 'running',
    priority: 'high',
    createdAt: 'Today at 9:45 AM',
    startedAt: '9:45 AM',
    outputSummary: 'Bundle size reduced by 34%, 60fps canvas render loop benchmarked.',
  },
  {
    id: 'task-4',
    title: 'Weekly Multi-Channel Brand Launch Drop',
    instructions: 'Draft scheduled posts for X/Twitter and LinkedIn highlighting virtual office features.',
    assignedEmployeeId: 'emp-4',
    status: 'needs_approval',
    priority: 'medium',
    createdAt: 'Today at 10:00 AM',
    startedAt: '10:00 AM',
    needsApprovalData: {
      actionType: 'social_post_publish',
      content: 'Excited to unveil our autonomous 3D office! Watch AI employees collaborate in real time with live monitor streams and automated document handoffs.',
      destination: 'LinkedIn & X/Twitter Corporate Feeds',
    },
  },
  {
    id: 'task-5',
    title: 'Cross-Platform Paid CPA Attribution Analysis',
    instructions: 'Audit blended CAC across Google Search and Meta Ads campaigns for Q2-Q3.',
    assignedEmployeeId: 'emp-5',
    status: 'running',
    priority: 'medium',
    createdAt: 'Today at 10:15 AM',
    startedAt: '10:15 AM',
    outputSummary: 'Identified 22% CPA reduction opportunity by scaling high-intent search exact matches.',
  },
  {
    id: 'task-6',
    title: 'Enterprise Pipeline Outreach Sequence',
    instructions: 'Qualify top 50 B2B SaaS target accounts and draft personalized multi-touch outbound cadences.',
    assignedEmployeeId: 'emp-6',
    status: 'running',
    priority: 'high',
    createdAt: 'Today at 10:20 AM',
    startedAt: '10:20 AM',
    outputSummary: 'Outbound sequence loaded with personalized pain-point hooks and demo scheduling triggers.',
  },
  {
    id: 'task-7',
    title: 'Tier-1 Customer Onboarding Ticket Diagnosis',
    instructions: 'Review resolution times, identify top 3 friction points in workspace setup, and craft FAQ response templates.',
    assignedEmployeeId: 'emp-7',
    status: 'running',
    priority: 'medium',
    createdAt: 'Today at 10:30 AM',
    startedAt: '10:30 AM',
    outputSummary: 'Drafted 8 automated resolution templates for common webhook and API key configuration questions.',
  },
  {
    id: 'task-8',
    title: 'Executive Multi-Agent Objective DAG Coordination',
    instructions: 'Orchestrate cross-functional priorities, manage dependency blocks, and compile standup briefing.',
    assignedEmployeeId: 'emp-8',
    status: 'running',
    priority: 'urgent',
    createdAt: 'Today at 8:45 AM',
    startedAt: '8:45 AM',
    outputSummary: 'Daily sprint plan synchronized across all 8 specialists. Critical paths unblocked.',
  },
];

export const useOfficeStore = create<OfficeState>((set) => ({
  timeOfDay: 'day',
  toggleTimeOfDay: () =>
    set((state) => ({ timeOfDay: state.timeOfDay === 'day' ? 'evening' : 'day' })),
  setTimeOfDay: (time) => set({ timeOfDay: time }),

  cameraPreset: 'overview',
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  zoomDelta: 0,
  zoomIn: () => set((state) => ({ zoomDelta: state.zoomDelta + 1 })),
  zoomOut: () => set((state) => ({ zoomDelta: state.zoomDelta - 1 })),
  resetCamera: () => set({ cameraPreset: 'overview', zoomDelta: 0 }),

  selectedEmployeeId: 'emp-1',
  selectEmployee: (id) =>
    set((state) => ({
      selectedEmployeeId: id,
      cameraPreset: id ? 'follow' : state.cameraPreset,
      isInspectorOpen: Boolean(id),
    })),

  employees: initialEmployees,
  updateEmployeeStatus: (id, status, anim) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status,
              animationState: anim || (status === 'working' ? 'typing' : status === 'thinking' ? 'thinking' : 'idle'),
            }
          : emp
      ),
    })),
  updateEmployeeMonitor: (id, content) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, monitorContent: content } : emp
      ),
    })),

  tasks: initialTasks,
  selectedTaskId: 'task-1',
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  activeTaskStream: '',
  setActiveTaskStream: (stream) => set({ activeTaskStream: stream }),
  appendTaskStream: (chunk) =>
    set((state) => ({ activeTaskStream: state.activeTaskStream + chunk })),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    })),

  newTaskInitialPrompt: '',
  setNewTaskInitialPrompt: (prompt) => set({ newTaskInitialPrompt: prompt }),

  isNewTaskModalOpen: false,
  setIsNewTaskModalOpen: (open) => set({ isNewTaskModalOpen: open }),
  isSettingsModalOpen: false,
  setIsSettingsModalOpen: (open) => set({ isSettingsModalOpen: open }),
  isTasksModalOpen: false,
  setIsTasksModalOpen: (open) => set({ isTasksModalOpen: open }),
  isReportsModalOpen: false,
  setIsReportsModalOpen: (open) => set({ isReportsModalOpen: open }),
  isTaskDetailsModalOpen: false,
  setIsTaskDetailsModalOpen: (open) => set({ isTaskDetailsModalOpen: open }),
  isNotificationsOpen: false,
  setIsNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  toggleNotifications: () => set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen })),
  isMobileDrawerOpen: false,
  setIsMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  isInspectorOpen: false,
  setIsInspectorOpen: (open) => set({ isInspectorOpen: open }),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
  isRosterCollapsed: false,
  toggleRosterCollapse: () => set((state) => ({ isRosterCollapsed: !state.isRosterCollapsed })),
  isTourActive: false,
  setIsTourActive: (active) => set({ isTourActive: active }),
  toggleTour: () => set((state) => ({ isTourActive: !state.isTourActive, cameraPreset: 'overview' })),

  teamFilter: 'all',
  setTeamFilter: (filter) => set({ teamFilter: filter }),
}));
