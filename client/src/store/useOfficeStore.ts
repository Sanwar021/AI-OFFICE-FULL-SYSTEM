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

  // UI state
  isNewTaskModalOpen: boolean;
  setIsNewTaskModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  toggleInspector: () => void;
}

const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Marcus Vance',
    role: 'GTM Engineer',
    avatarColor: '#10b981', // Emerald
    hairColor: '#1e293b',
    suitColor: '#0f766e',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 0,
    deskPosition: { x: -0.88, y: 0, z: 1.98, rotationY: 0 },
    position: [-0.88, 0, 2.6], // Seated in chair
    systemPrompt: 'You are the Go-To-Market (GTM) Engineer...',
  },
  {
    id: 'emp-2',
    name: 'Elena Rostova',
    role: 'SEO/AEO Specialist',
    avatarColor: '#2563eb', // Royal Blue
    hairColor: '#b45309',
    suitColor: '#1d4ed8',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 1,
    deskPosition: { x: 0.88, y: 0, z: 1.98, rotationY: 0 },
    position: [0.88, 0, 2.6],
    systemPrompt: 'You are the SEO and Answer Engine Optimization (AEO) Specialist...',
  },
  {
    id: 'emp-3',
    name: 'Liam Chen',
    role: 'Web Development Engineer',
    avatarColor: '#6366f1', // Indigo
    hairColor: '#0f172a',
    suitColor: '#4338ca',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 2,
    deskPosition: { x: -0.88, y: 0, z: 1.02, rotationY: Math.PI },
    position: [-0.88, 0, 0.4],
    systemPrompt: 'You are the Senior Web Development Engineer...',
  },
  {
    id: 'emp-4',
    name: 'Chloe Bennett',
    role: 'Social Media Manager',
    avatarColor: '#f43f5e', // Rose / Coral
    hairColor: '#78350f',
    suitColor: '#be123c',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 3,
    deskPosition: { x: 0.88, y: 0, z: 1.02, rotationY: Math.PI },
    position: [0.88, 0, 0.4],
    systemPrompt: 'You are the Social Media & Brand Communications Manager...',
  },
  {
    id: 'emp-5',
    name: 'Alexander Wright',
    role: 'Advertisement Manager',
    avatarColor: '#f59e0b', // Amber
    hairColor: '#334155',
    suitColor: '#b45309',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 4,
    deskPosition: { x: -0.88, y: 0, z: -2.02, rotationY: 0 },
    position: [-0.88, 0, -1.4],
    systemPrompt: 'You are the Performance Advertising and Paid Acquisition Manager...',
  },
  {
    id: 'emp-6',
    name: 'Sarah Jenkins',
    role: 'Sales Executive',
    avatarColor: '#0d9488', // Teal
    hairColor: '#854d0e',
    suitColor: '#0f766e',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 5,
    deskPosition: { x: 0.88, y: 0, z: -2.02, rotationY: 0 },
    position: [0.88, 0, -1.4],
    systemPrompt: 'You are the Enterprise Sales Executive and Business Development Lead...',
  },
  {
    id: 'emp-7',
    name: 'David O\'Connor',
    role: 'Customer Satisfaction Specialist',
    avatarColor: '#14b8a6', // Mint
    hairColor: '#475569',
    suitColor: '#0d9488',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 6,
    deskPosition: { x: -0.88, y: 0, z: -2.98, rotationY: Math.PI },
    position: [-0.88, 0, -3.6],
    systemPrompt: 'You are the Customer Satisfaction & Success Specialist...',
  },
  {
    id: 'emp-8',
    name: 'Victoria Sterling',
    role: 'Chief of Staff',
    avatarColor: '#1e293b', // Deep Corporate Navy
    hairColor: '#1e293b',
    suitColor: '#0f172a',
    status: 'idle',
    animationState: 'idle',
    deskIndex: 7,
    deskPosition: { x: 0.88, y: 0, z: -2.98, rotationY: Math.PI },
    position: [0.88, 0, -3.6],
    systemPrompt: 'You are the Chief of Staff orchestrating the company...',
  },
];

export const useOfficeStore = create<OfficeState>((set) => ({
  timeOfDay: 'day',
  toggleTimeOfDay: () =>
    set((state) => ({ timeOfDay: state.timeOfDay === 'day' ? 'evening' : 'day' })),
  setTimeOfDay: (time) => set({ timeOfDay: time }),

  cameraPreset: 'overview',
  setCameraPreset: (preset) => set({ cameraPreset: preset }),

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

  tasks: [],
  activeTaskStream: '',
  setActiveTaskStream: (stream) => set({ activeTaskStream: stream }),
  appendTaskStream: (chunk) =>
    set((state) => ({ activeTaskStream: state.activeTaskStream + chunk })),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    })),

  isNewTaskModalOpen: false,
  setIsNewTaskModalOpen: (open) => set({ isNewTaskModalOpen: open }),
  isSettingsModalOpen: false,
  setIsSettingsModalOpen: (open) => set({ isSettingsModalOpen: open }),
  isMobileDrawerOpen: false,
  setIsMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  isInspectorOpen: false,
  setIsInspectorOpen: (open) => set({ isInspectorOpen: open }),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
}));
