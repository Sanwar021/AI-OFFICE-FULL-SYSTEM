import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Plus,
  Search,
  ExternalLink,
  User,
} from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

export const TasksModal: React.FC = () => {
  const isTasksModalOpen = useOfficeStore((state) => state.isTasksModalOpen);
  const setIsTasksModalOpen = useOfficeStore((state) => state.setIsTasksModalOpen);
  const tasks = useOfficeStore((state) => state.tasks);
  const employees = useOfficeStore((state) => state.employees);
  const selectEmployee = useOfficeStore((state) => state.selectEmployee);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);
  const setIsTaskDetailsModalOpen = useOfficeStore((state) => state.setIsTaskDetailsModalOpen);
  const setSelectedTaskId = useOfficeStore((state) => state.setSelectedTaskId);

  const [filter, setFilter] = useState<'all' | 'running' | 'needs_approval' | 'completed'>('all');
  const [search, setSearch] = useState('');

  if (!isTasksModalOpen) return null;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'running' && t.status !== 'running') return false;
    if (filter === 'needs_approval' && t.status !== 'needs_approval') return false;
    if (filter === 'completed' && t.status !== 'completed') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const emp = employees.find((e) => e.id === t.assignedEmployeeId);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchEmp = emp?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchEmp) return false;
    }
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto select-none">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Workspace Tasks</h3>
              <p className="text-xs text-slate-500">
                {tasks.length} total tasks managed across 8 autonomous specialists
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsTasksModalOpen(false);
                setIsNewTaskModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E4E38] hover:bg-[#163D2B] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>

            <button
              onClick={() => setIsTasksModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-3 sm:px-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tasks by title or specialist..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-emerald-600"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1">
            {(['all', 'running', 'needs_approval', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  filter === tab
                    ? 'bg-[#EAF3ED] text-[#1E4E38]'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tasks found matching your filter.
            </div>
          ) : (
            filteredTasks.map((t) => {
              const emp = employees.find((e) => e.id === t.assignedEmployeeId);
              return (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs transition flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Avatar */}
                      {emp?.avatarUrl ? (
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 mt-0.5"
                          style={{ backgroundColor: emp?.avatarColor || '#10b981' }}
                        >
                          {emp?.name.split(' ').map((n) => n[0]).join('') || 'AI'}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">
                            {t.title}
                          </h4>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${getPriorityBadge(
                              t.priority
                            )}`}
                          >
                            {t.priority}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Assigned to {emp?.name} ({emp?.role}) • {t.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                        t.status === 'running'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'needs_approval'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'running'
                            ? 'bg-emerald-500 animate-pulse'
                            : t.status === 'needs_approval'
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-slate-400'
                        }`}
                      />
                      {t.status === 'running'
                        ? 'Running'
                        : t.status === 'needs_approval'
                        ? 'Needs Approval'
                        : 'Completed'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 pl-11">
                    {t.instructions}
                  </p>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 pl-11 text-xs">
                    <button
                      onClick={() => {
                        if (emp) {
                          selectEmployee(emp.id);
                          setIsTasksModalOpen(false);
                        }
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition cursor-pointer"
                    >
                      <User className="w-3 h-3" />
                      <span>View in 3D Office</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTaskId(t.id);
                        if (emp) selectEmployee(emp.id);
                        setIsTasksModalOpen(false);
                        setIsTaskDetailsModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
                    >
                      <span>Inspect Deliverable</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};