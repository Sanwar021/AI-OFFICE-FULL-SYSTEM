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
import { Video, Users, User, Sun, Moon, Plus, AlertTriangle, Clock, Terminal } from 'lucide-react';

export const App: React.FC = () => {
  // Real-time server-sent events synchronization
  useSSE();

  const cameraPreset = useOfficeStore((state) => state.cameraPreset);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const timeOfDay = useOfficeStore((state) => state.timeOfDay);
  const toggleTimeOfDay = useOfficeStore((state) => state.toggleTimeOfDay);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);
  const toggleInspector = useOfficeStore((state) => state.toggleInspector);
  const isInspectorOpen = useOfficeStore((state) => state.isInspectorOpen);

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

      {/* Desktop Bottom Status Pill (>= 1024px) */}
      <div className="hidden lg:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-20 items-center gap-3 px-5 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl rounded-full pointer-events-auto select-none text-xs text-slate-800">
        <span className="flex items-center gap-2 font-extrabold text-slate-900">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-300" />
          Chief of Staff Live
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-700 font-bold">8 AI Specialists Active</span>
        <span className="text-slate-300">•</span>
        <button
          onClick={() => setIsRoutinesOpen(true)}
          className="text-teal-700 hover:text-teal-900 font-extrabold flex items-center gap-1 transition cursor-pointer"
        >
          Morning Routine Brief →
        </button>
      </div>

      {/* Mobile / Tablet Bottom Quick Action Bar (< 1024px) */}
      <nav
        aria-label="Mobile Controls"
        className="lg:hidden fixed bottom-3 left-2 right-2 sm:left-4 sm:right-4 z-20 flex items-center justify-between bg-white/90 backdrop-blur-md border border-white/70 px-2 py-1.5 sm:px-3 sm:py-2 rounded-2xl shadow-xl pointer-events-auto select-none"
      >
        {/* Camera Preset Controls */}
        <div className="flex items-center gap-1">
          {/* Mobile Single Cycle Button (< 640px) */}
          <button
            onClick={() => {
              if (cameraPreset === 'overview') setCameraPreset('team');
              else if (cameraPreset === 'team') setCameraPreset('follow');
              else setCameraPreset('overview');
            }}
            className="sm:hidden min-h-[44px] px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 ring-1 ring-teal-300 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            title={`Camera: ${cameraPreset} (tap to cycle)`}
            aria-label="Cycle camera view"
          >
            {cameraPreset === 'overview' && <Video className="w-4 h-4 text-teal-600 shrink-0" />}
            {cameraPreset === 'team' && <Users className="w-4 h-4 text-teal-600 shrink-0" />}
            {cameraPreset === 'follow' && <User className="w-4 h-4 text-teal-600 shrink-0" />}
            <span className="capitalize text-[11px] font-bold">{cameraPreset}</span>
          </button>

          {/* Tablet Presets (>= 640px) */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setCameraPreset('overview')}
              className={`min-w-[44px] min-h-[44px] p-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                cameraPreset === 'overview'
                  ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Overview"
              aria-label="Camera Overview"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraPreset('team')}
              className={`min-w-[44px] min-h-[44px] p-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                cameraPreset === 'team'
                  ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Team View"
              aria-label="Camera Team View"
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCameraPreset('follow')}
              className={`min-w-[44px] min-h-[44px] p-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
                cameraPreset === 'follow'
                  ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Follow Desk"
              aria-label="Camera Follow Desk"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Inspector Drawer Toggle */}
          <button
            onClick={toggleInspector}
            className={`min-w-[44px] min-h-[44px] p-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center ${
              isInspectorOpen
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
            title="Toggle Live Monitor Inspector"
            aria-label="Toggle Monitor Inspector"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Approvals */}
          <button
            onClick={() => setIsApprovalsOpen(true)}
            className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 transition cursor-pointer flex items-center justify-center"
            title="Approvals"
            aria-label="Open Approvals"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>

          {/* Routines */}
          <button
            onClick={() => setIsRoutinesOpen(true)}
            className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 transition cursor-pointer flex items-center justify-center"
            title="Routines"
            aria-label="Open Routines"
          >
            <Clock className="w-4 h-4" />
          </button>

          {/* Day / Evening (Tablet only, as mobile has it in navbar) */}
          <button
            onClick={toggleTimeOfDay}
            className="hidden sm:flex min-w-[44px] min-h-[44px] p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer items-center justify-center"
            title="Toggle Day/Evening Mode"
            aria-label="Toggle Day/Evening"
          >
            {timeOfDay === 'day' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* New Task */}
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="min-h-[44px] px-3 sm:px-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
            aria-label="New Task"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Task</span>
          </button>
        </div>
      </nav>

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
