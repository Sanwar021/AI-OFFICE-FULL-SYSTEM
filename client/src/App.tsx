import React, { useState } from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { TeamListCard } from './components/dashboard/TeamListCard';
import { CenterOfficeCard } from './components/dashboard/CenterOfficeCard';
import { EmployeeOverviewCard } from './components/dashboard/EmployeeOverviewCard';
import { BottomPromptBar } from './components/dashboard/BottomPromptBar';
import { NotificationsDropdown } from './components/dashboard/NotificationsDropdown';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { PlanPreviewModal } from './components/modals/PlanPreviewModal';
import { ApprovalModal } from './components/modals/ApprovalModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { RoutinesModal } from './components/modals/RoutinesModal';
import { TasksModal } from './components/modals/TasksModal';
import { TaskDetailsModal } from './components/modals/TaskDetailsModal';
import { ReportsModal } from './components/modals/ReportsModal';
import { useOfficeStore } from './store/useOfficeStore';
import { useSSE } from './hooks/useSSE';
import { Menu, X } from 'lucide-react';

export const App: React.FC = () => {
  // Real-time server-sent events synchronization
  useSSE();

  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);
  const setIsSettingsModalOpen = useOfficeStore((state) => state.setIsSettingsModalOpen);
  const setNewTaskInitialPrompt = useOfficeStore((state) => state.setNewTaskInitialPrompt);
  const setIsNotificationsOpen = useOfficeStore((state) => state.setIsNotificationsOpen);
  const setIsTaskDetailsModalOpen = useOfficeStore((state) => state.setIsTaskDetailsModalOpen);

  const [activePlan, setActivePlan] = useState<any | null>(null);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [isRoutinesOpen, setIsRoutinesOpen] = useState(false);

  // Mobile drawer states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'office' | 'team' | 'employee'>('office');

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#F8F9FA] flex font-sans text-slate-800 antialiased select-none relative">
      {/* Desktop Left Sidebar (>= 1024px) */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          onOpenApprovals={() => setIsApprovalsOpen(true)}
          onOpenRoutines={() => setIsRoutinesOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay (< 1024px) */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">Menu</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                onOpenApprovals={() => {
                  setIsApprovalsOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenRoutines={() => {
                  setIsRoutinesOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenSettings={() => {
                  setIsSettingsModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onOpenNewTask={() => {
                  setIsNewTaskModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 h-full flex flex-col justify-between overflow-y-auto p-3 sm:p-5 lg:p-6 gap-3 sm:gap-4 bg-[#F8F9FA] relative">
        {/* Top Header Row with Mobile Menu Button */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between lg:hidden pb-1 border-b border-slate-200">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-2 text-xs font-semibold cursor-pointer"
            >
              <Menu className="w-4 h-4 text-emerald-800" />
              <span>aioffice.</span>
            </button>

            {/* Mobile View Toggle Pills (< 1024px) */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setMobileTab('office')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  mobileTab === 'office'
                    ? 'bg-[#EAF3ED] text-[#1E4E38]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Office
              </button>
              <button
                onClick={() => setMobileTab('team')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  mobileTab === 'team'
                    ? 'bg-[#EAF3ED] text-[#1E4E38]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Team
              </button>
              <button
                onClick={() => setMobileTab('employee')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  mobileTab === 'employee'
                    ? 'bg-[#EAF3ED] text-[#1E4E38]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Employee
              </button>
            </div>
          </div>

          {/* Standard Header & KPI Metrics */}
          <DashboardHeader onOpenApprovals={() => setIsApprovalsOpen(true)} />
        </div>

        {/* Central Workspace (Desktop 3-Column Layout & Mobile Adaptive) */}
        <div className="flex-1 min-h-[460px] flex gap-3 sm:gap-4 overflow-hidden">
          {/* Column 1: AI Team Roster (Visible on desktop >= 1200px or when mobileTab === 'team') */}
          <div
            className={`w-72 xl:w-80 shrink-0 h-full ${
              mobileTab === 'team' ? 'block w-full' : 'hidden xl:block'
            }`}
          >
            <TeamListCard />
          </div>

          {/* Column 2: 3D Virtual Office Canvas (Visible on desktop or when mobileTab === 'office') */}
          <div
            className={`flex-1 h-full min-w-0 ${
              mobileTab === 'office' ? 'block' : 'hidden xl:block'
            }`}
          >
            <CenterOfficeCard />
          </div>

          {/* Column 3: Employee Overview (Visible on desktop >= 1024px or when mobileTab === 'employee') */}
          <div
            className={`w-80 xl:w-88 shrink-0 h-full ${
              mobileTab === 'employee' ? 'block w-full' : 'hidden lg:block'
            }`}
          >
            <EmployeeOverviewCard onAssignTask={() => setIsNewTaskModalOpen(true)} />
          </div>
        </div>

        {/* Bottom Command Prompt Bar & Footer */}
        <BottomPromptBar
          onOpenNewTask={() => setIsNewTaskModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onSubmitPrompt={(prompt) => {
            setNewTaskInitialPrompt(prompt);
            setIsNewTaskModalOpen(true);
          }}
        />

        {/* Floating Notifications Popover */}
        <NotificationsDropdown
          onOpenApprovals={() => setIsApprovalsOpen(true)}
          onOpenTaskDetails={() => setIsTaskDetailsModalOpen(true)}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </main>

      {/* Modals & Dialogs */}
      <NewTaskModal onPlanGenerated={(plan) => setActivePlan(plan)} />
      <PlanPreviewModal
        plan={activePlan}
        onClose={() => setActivePlan(null)}
        onPlanExecuted={() => setActivePlan(null)}
      />
      <ApprovalModal isOpen={isApprovalsOpen} onClose={() => setIsApprovalsOpen(false)} />
      <SettingsModal />
      <RoutinesModal isOpen={isRoutinesOpen} onClose={() => setIsRoutinesOpen(false)} />
      <TasksModal />
      <TaskDetailsModal />
      <ReportsModal />
    </div>
  );
};

export default App;