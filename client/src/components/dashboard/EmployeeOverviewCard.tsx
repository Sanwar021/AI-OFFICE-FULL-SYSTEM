import React, { useState } from 'react';
import { MoreHorizontal, FileText, ArrowRight } from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

interface EmployeeOverviewCardProps {
  onAssignTask?: () => void;
}

export const EmployeeOverviewCard: React.FC<EmployeeOverviewCardProps> = ({ onAssignTask }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'overview'>('live');
  const employees = useOfficeStore((state) => state.employees);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const activeTaskStream = useOfficeStore((state) => state.activeTaskStream);

  const selectedEmployee =
    employees.find((e) => e.id === selectedEmployeeId) || employees[0] || null;

  if (!selectedEmployee) return null;

  const progress = selectedEmployee.currentProgress || 68;
  const startedAt = selectedEmployee.startedAt || '9:15 AM';
  const taskTitle =
    selectedEmployee.currentTaskTitle || 'Develop Q3 go-to-market strategy';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between h-full select-none">
      <div className="flex flex-col gap-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Employee Overview
          </span>
          <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Center */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            {selectedEmployee.avatarUrl ? (
              <img
                src={selectedEmployee.avatarUrl}
                alt={selectedEmployee.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-xs"
              />
            ) : (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base text-white shadow-xs"
                style={{ backgroundColor: selectedEmployee.avatarColor }}
              >
                {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300" />
          </div>

          <h3 className="font-extrabold text-base text-slate-900 leading-tight">
            {selectedEmployee.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {selectedEmployee.role}
          </p>

          {/* Status Pill */}
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {selectedEmployee.status === 'working'
                ? 'Working'
                : selectedEmployee.status === 'writing'
                ? 'Writing'
                : selectedEmployee.status === 'thinking'
                ? 'Thinking'
                : 'Active'}
            </span>
          </div>
        </div>

        {/* Segmented Tabs: Live activity | Overview */}
        <div className="flex items-center justify-center border-b border-slate-100 pb-1">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('live')}
              className={`text-xs font-semibold pb-1.5 transition cursor-pointer border-b-2 ${
                activeTab === 'live'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Live activity
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-xs font-semibold pb-1.5 transition cursor-pointer border-b-2 ${
                activeTab === 'overview'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Overview
            </button>
          </div>
        </div>

        {/* Current Task Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Current Task
            </span>
            <FileText className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex flex-col">
            <h4 className="font-bold text-xs text-slate-900 leading-tight">
              {taskTitle}
            </h4>
            <span className="text-[11px] text-slate-400 font-normal mt-0.5">
              Started today at {startedAt}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Task progress</span>
              <span className="font-bold text-slate-700">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={onAssignTask}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer mt-0.5"
          >
            <span>View task details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Live Output Section */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Live Output
            </span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Live Terminal / Log output */}
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 font-mono text-[11px] text-slate-700 flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
            {activeTaskStream ? (
              <div className="whitespace-pre-wrap break-words leading-relaxed text-slate-800">
                {activeTaskStream}
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-400 text-[10px] shrink-0">10:42:08</span>
                  <span className="leading-snug">
                    Analyzing market trends and identifying opportunities for your business.
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-400 text-[10px] shrink-0">10:42:34</span>
                  <span className="leading-snug text-emerald-800">
                    Formulating go-to-market positioning matrix and competitor benchmarks...
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};