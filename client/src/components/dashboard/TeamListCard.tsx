import React from 'react';
import { SlidersHorizontal, ChevronRight, ArrowRight } from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

export const TeamListCard: React.FC = () => {
  const employees = useOfficeStore((state) => state.employees);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const selectEmployee = useOfficeStore((state) => state.selectEmployee);

  const getStatusLabel = (status: string, role: string) => {
    switch (status) {
      case 'working':
        return 'Working';
      case 'writing':
        return 'Writing';
      case 'thinking':
        return 'Thinking';
      case 'waiting_approval':
        return 'Needs approval';
      default:
        return role === 'Chief of Staff' ? 'Coordinating' : 'Active';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
      case 'writing':
        return 'bg-emerald-500';
      case 'thinking':
        return 'bg-amber-500';
      case 'waiting_approval':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between h-full select-none">
      <div className="flex flex-col">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-1">
          <h2 className="font-bold text-sm text-slate-900 font-sans">Your AI team</h2>
          <button
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="Filter team"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="flex items-center gap-1.5 pb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <p className="text-[11px] text-slate-500 font-normal">
            A little intelligence. A lot of possibility.
          </p>
        </div>

        {/* Employee List */}
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[460px] pr-1">
          {employees.map((emp) => {
            const isSelected = emp.id === selectedEmployeeId;
            const statusLabel = getStatusLabel(emp.status, emp.role);
            const statusDotColor = getStatusColor(emp.status);

            return (
              <div
                key={emp.id}
                onClick={() => selectEmployee(emp.id)}
                className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-between border ${
                  isSelected
                    ? 'bg-[#EAF3ED]/60 border-[#1E4E38]/20 shadow-2xs'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {emp.avatarUrl ? (
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200/80"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: emp.avatarColor }}
                      >
                        {emp.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {emp.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium truncate">
                      {emp.role}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotColor}`} />
                      <span className="text-[10px] text-slate-600 truncate">
                        <span className="font-semibold">{statusLabel}</span>
                        {emp.actionSnippet && (
                          <span className="text-slate-400 font-normal">
                            {' '}
                            | {emp.actionSnippet}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0 ml-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer">
          <span>Manage your team</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};