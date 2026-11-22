import React from 'react';
import { Users, CheckSquare, ShieldCheck, CheckCircle2, Sun, ChevronRight } from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

interface DashboardHeaderProps {
  onOpenApprovals?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenApprovals }) => {
  const employees = useOfficeStore((state) => state.employees);
  const activeCount = employees.filter((e) => e.status !== 'idle').length;
  const resetCamera = useOfficeStore((state) => state.resetCamera);
  const setIsTasksModalOpen = useOfficeStore((state) => state.setIsTasksModalOpen);
  const setIsReportsModalOpen = useOfficeStore((state) => state.setIsReportsModalOpen);

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Top Title & Subtitle + Date Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Your office. In motion.
          </h1>
          <p className="text-xs lg:text-sm text-slate-500 font-normal mt-0.5">
            Great work happens when the right minds come together.
          </p>
        </div>

        {/* Date / Time */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 self-start md:self-auto">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Monday, June 16 • 10:42 AM</span>
        </div>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Card 1: AI Employees */}
        <div
          onClick={resetCamera}
          className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition cursor-pointer"
          title="Focus all 8 specialists in 3D"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg lg:text-xl font-extrabold text-slate-900 leading-tight">
                {employees.length}
              </span>
              <span className="text-xs font-semibold text-slate-700">AI employees</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              • {activeCount} active now
            </span>
          </div>
        </div>

        {/* Card 2: Tasks in progress */}
        <div
          onClick={() => setIsTasksModalOpen(true)}
          className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3 shadow-2xs hover:border-slate-300 transition cursor-pointer"
          title="View 6 tasks in progress"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg lg:text-xl font-extrabold text-slate-900 leading-tight">
              6
            </span>
            <span className="text-xs text-slate-600 font-medium">Tasks in progress</span>
          </div>
        </div>

        {/* Card 3: Awaiting your approval */}
        <div
          onClick={onOpenApprovals}
          className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between shadow-2xs hover:border-amber-300 transition cursor-pointer group"
          title="Review 3 pending approvals"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-extrabold text-slate-900 leading-tight">
                3
              </span>
              <span className="text-xs text-slate-600 font-medium">Awaiting your approval</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition" />
        </div>

        {/* Card 4: Completed today */}
        <div
          onClick={() => setIsReportsModalOpen(true)}
          className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center justify-between shadow-2xs hover:border-slate-300 transition cursor-pointer"
          title="View 24 completed deliverables and executive report"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-extrabold text-slate-900 leading-tight">
                24
              </span>
              <span className="text-xs text-slate-600 font-medium">Completed today</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            +12%
          </span>
        </div>
      </div>
    </div>
  );
};