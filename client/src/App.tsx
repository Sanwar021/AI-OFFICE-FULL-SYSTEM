import React, { useState } from 'react';
import { OfficeScene } from './scene/OfficeScene';
import { Navbar } from './components/Navbar';
import { EmployeeSidebar } from './components/EmployeeSidebar';
import { TaskInspector } from './components/TaskInspector';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { PlanPreviewModal } from './components/modals/PlanPreviewModal';
import { ApprovalModal } from './components/modals/ApprovalModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { RoutinesModal } from './components/modals/RoutinesModal';
import { useOfficeStore } from './store/useOfficeStore';
import { useSSE } from './hooks/useSSE';
import { Video, Users, User, Sun, Moon, Plus, AlertTriangle, Clock } from 'lucide-react';

export const App: React.FC = () => {
  // Real-time server-sent events synchronization
  useSSE();

  const cameraPreset = useOfficeStore((state) => state.cameraPreset);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const timeOfDay = useOfficeStore((state) => state.timeOfDay);
  const toggleTimeOfDay = useOfficeStore((state) => state.toggleTimeOfDay);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);

  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isRoutinesOpen, setIsRoutinesOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 3D Office Scene */}
      <main className="absolute inset-0 z-0">
        <OfficeScene />
      </main>

      {/* Top Navbar */}
      <Navbar
        onOpenApprovals={() => setIsApprovalsOpen(true)}
        onOpenRoutines={() => setIsRoutinesOpen(true)}
      />

      {/* Responsive Work Area Overlay */}
      <div className="absolute inset-0 pointer-events-none flex justify-between p-3 sm:p-4 pt-16 sm:pt-20">
        {/* Left Employee Roster */}
        <EmployeeSidebar />

        {/* Right Task & Monitor Inspector */}
        <TaskInspector />
      </div>

      {/* Mobile Bottom Quick Action Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-20 flex items-center justify-between bg-white/85 backdrop-blur-md border border-white/60 p-2 rounded-2xl shadow-lg pointer-events-auto">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCameraPreset('overview')}
            className={`p-2 rounded-xl text-xs font-medium transition ${
              cameraPreset === 'overview' ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
            }`}
            title="Overview"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCameraPreset('team')}
            className={`p-2 rounded-xl text-xs font-medium transition ${
              cameraPreset === 'team' ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
            }`}
            title="Team View"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCameraPreset('follow')}
            className={`p-2 rounded-xl text-xs font-medium transition ${
              cameraPreset === 'follow' ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
            }`}
            title="Follow Desk"
          >
            <User className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsApprovalsOpen(true)}
            className="p-2 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
            title="Approvals"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRoutinesOpen(true)}
            className="p-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
            title="Routines"
          >
            <Clock className="w-4 h-4" />
          </button>

          <button
            onClick={toggleTimeOfDay}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
          >
            {timeOfDay === 'day' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Task</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <NewTaskModal onPlanGenerated={(plan) => setActivePlan(plan)} />
      <PlanPreviewModal
        plan={activePlan}
        onClose={() => setActivePlan(null)}
        onPlanExecuted={() => setActivePlan(null)}
      />
      <ApprovalModal isOpen={isApprovalsOpen} onClose={() => setIsApprovalsOpen(false)} />
      <SettingsModal />
      <RoutinesModal isOpen={isRoutinesOpen} onClose={() => setIsRoutinesOpen(false)} />
    </div>
  );
};

export default App;
