import React from 'react';
import { useOfficeStore } from '../store/useOfficeStore';
import { UserCheck, ChevronRight, X } from 'lucide-react';

export const EmployeeSidebar: React.FC = () => {
  const employees = useOfficeStore((state) => state.employees);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const selectEmployee = useOfficeStore((state) => state.selectEmployee);
  const isMobileDrawerOpen = useOfficeStore((state) => state.isMobileDrawerOpen);
  const setIsMobileDrawerOpen = useOfficeStore((state) => state.setIsMobileDrawerOpen);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-emerald-500 animate-pulse';
      case 'thinking':
        return 'bg-amber-500 animate-pulse';
      case 'writing':
        return 'bg-blue-500 animate-pulse';
      case 'waiting_approval':
        return 'bg-purple-500';
      case 'failed':
        return 'bg-rose-500';
      default:
        return 'bg-slate-300';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 lg:hidden pointer-events-auto"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-16 left-3 sm:left-4 bottom-3 sm:bottom-4 w-[calc(100vw-1.5rem)] sm:w-72 z-30 flex flex-col bg-white/85 backdrop-blur-md border border-white/70 rounded-2xl shadow-xl transition-all duration-300 pointer-events-auto overflow-hidden ${
          isMobileDrawerOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-[calc(100%+2rem)] opacity-0 lg:translate-x-0 lg:opacity-100'
        }`}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              AI Team Roster (8)
            </h2>
          </div>
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close roster"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {employees.map((emp) => {
            const isSelected = emp.id === selectedEmployeeId;
            return (
              <button
                key={emp.id}
                onClick={() => {
                  selectEmployee(emp.id);
                  if (window.innerWidth < 1024) setIsMobileDrawerOpen(false);
                }}
                className={`w-full text-left p-2.5 sm:p-2.5 rounded-xl transition flex items-center gap-2.5 sm:gap-3 border cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/90 border-teal-200 shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-slate-50/80'
                }`}
              >
                {/* Avatar with status indicator */}
                <div className="relative shrink-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
                    style={{ backgroundColor: emp.avatarColor }}
                  >
                    {emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                      emp.status
                    )}`}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xs font-bold truncate ${
                        isSelected ? 'text-teal-900' : 'text-slate-800'
                      }`}
                    >
                      {emp.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{emp.role}</p>
                </div>

                {isSelected && <ChevronRight className="w-4 h-4 text-teal-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Orchestration</span>
            <span className="font-bold text-teal-700">Victoria Sterling (Chief)</span>
          </div>
        </div>
      </aside>
    </>
  );
};
