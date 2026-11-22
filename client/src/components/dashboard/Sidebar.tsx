import React from 'react';
import {
  Building2,
  CheckSquare,
  Users,
  ShieldCheck,
  RotateCcw,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  ChevronsUpDown,
  MoreHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

interface SidebarProps {
  onOpenApprovals?: () => void;
  onOpenRoutines?: () => void;
  onOpenSettings?: () => void;
  onOpenNewTask?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenApprovals,
  onOpenRoutines,
  onOpenSettings,
}) => {
  const employees = useOfficeStore((state) => state.employees);
  const activeCount = employees.filter((e) => e.status !== 'idle').length;
  const resetCamera = useOfficeStore((state) => state.resetCamera);
  const setIsTasksModalOpen = useOfficeStore((state) => state.setIsTasksModalOpen);
  const setIsReportsModalOpen = useOfficeStore((state) => state.setIsReportsModalOpen);
  const toggleTour = useOfficeStore((state) => state.toggleTour);
  const selectEmployee = useOfficeStore((state) => state.selectEmployee);

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0 select-none">
      {/* Top Branding & Workspace Selector */}
      <div className="flex flex-col gap-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <div className="w-8 h-8 rounded-lg bg-[#1E4E38] flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-5 h-5 text-emerald-200" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
            aioffice.
          </span>
        </div>

        {/* Workspace Card */}
        <div
          onClick={onOpenSettings}
          className="flex items-center justify-between p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          title="Open Workspace Settings"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-2xs">
              S
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Studio workspace
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-slate-500 font-medium">Pro plan</span>
                <span className="text-[9px] font-bold px-1 py-0.2 bg-slate-100 text-slate-600 rounded border border-slate-200">
                  PRO
                </span>
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col gap-1">
          <div className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Workspace
          </div>

          {/* Virtual Office (Active) */}
          <button
            onClick={resetCamera}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#EAF3ED] text-[#1E4E38] font-semibold text-xs transition cursor-pointer"
            title="Focus Virtual Office"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-[#1E4E38]" />
              <span>Virtual Office</span>
            </div>
          </button>

          {/* Tasks */}
          <button
            onClick={() => setIsTasksModalOpen(true)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
            title="View Workspace Tasks"
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span>Tasks</span>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              7
            </span>
          </button>

          {/* AI Employees */}
          <button
            onClick={() => selectEmployee(employees[0]?.id || null)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
            title="Focus AI Employees"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>AI Employees</span>
            </div>
          </button>

          {/* Approvals */}
          <button
            onClick={onOpenApprovals}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Approvals</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              3
            </span>
          </button>

          {/* Routines */}
          <button
            onClick={onOpenRoutines}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Routines</span>
            </div>
          </button>

          {/* Reports */}
          <button
            onClick={() => setIsReportsModalOpen(true)}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
            title="View Executive Reports"
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span>Reports</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Area: Status Card, Utilities & User Profile */}
      <div className="flex flex-col gap-3">
        {/* "Your office is in motion" Live Card */}
        <div
          onClick={() => setIsTasksModalOpen(true)}
          className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/70 transition cursor-pointer flex items-center justify-between shadow-2xs"
          title="Click to view all active tasks"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Your office is in motion
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-slate-500 font-medium">
                  {activeCount} employees active
                </span>
              </div>
            </div>
          </div>
          {/* Animated sound equalizer bars */}
          <div className="flex items-end gap-0.5 h-4 px-1">
            <span className="w-0.5 bg-emerald-500 rounded-full animate-pulse h-3" />
            <span className="w-0.5 bg-emerald-500 rounded-full animate-pulse h-4" />
            <span className="w-0.5 bg-emerald-500 rounded-full animate-pulse h-2" />
          </div>
        </div>

        {/* Settings & Help Links */}
        <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-100">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>
          <button
            onClick={toggleTour}
            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs transition cursor-pointer"
            title="Start Cinematic Office Tour"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help & getting started</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* User Profile */}
        <div
          onClick={onOpenSettings}
          className="flex items-center justify-between pt-2 border-t border-slate-100 px-1 cursor-pointer hover:bg-slate-50 rounded-xl p-1 transition"
          title="Account & Workspace Settings"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center font-bold text-amber-800 text-xs shadow-2xs">
              JD
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">Jamie Davis</span>
              <span className="text-[11px] text-slate-500 font-medium">Workspace owner</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSettings?.();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};