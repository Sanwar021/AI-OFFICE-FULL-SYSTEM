import React, { useState } from 'react';
import { useOfficeStore } from '../store/useOfficeStore';
import { UserCheck, ChevronRight, ChevronLeft, X, Search, Sparkles } from 'lucide-react';

export const EmployeeSidebar: React.FC = () => {
  const employees = useOfficeStore((state) => state.employees);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const selectEmployee = useOfficeStore((state) => state.selectEmployee);
  const isMobileDrawerOpen = useOfficeStore((state) => state.isMobileDrawerOpen);
  const setIsMobileDrawerOpen = useOfficeStore((state) => state.setIsMobileDrawerOpen);
  const isRosterCollapsed = useOfficeStore((state) => state.isRosterCollapsed);
  const toggleRosterCollapse = useOfficeStore((state) => state.toggleRosterCollapse);

  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredEmployees = searchQuery.trim()
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employees;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 lg:hidden pointer-events-auto"
        />
      )}

      {/* 1. Desktop Minimal Rail (When Collapsed) */}
      {isRosterCollapsed && (
        <aside className="hidden lg:flex flex-col items-center py-3 px-1.5 w-16 bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl z-30 pointer-events-auto select-none transition-all duration-300 h-fit max-h-[calc(100vh-6rem)]">
          {/* Expand Button */}
          <button
            onClick={toggleRosterCollapse}
            className="w-10 h-10 mb-2 rounded-xl flex items-center justify-center text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition cursor-pointer"
            title="Expand AI Team Roster"
            aria-label="Expand roster"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Quick Avatar Stack */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-12rem)] p-1">
            {employees.map((emp) => {
              const isSelected = emp.id === selectedEmployeeId;
              return (
                <button
                  key={emp.id}
                  onClick={() => selectEmployee(emp.id)}
                  title={`${emp.name} — ${emp.role} (${emp.status})`}
                  className={`group relative w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-teal-500 scale-105' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: emp.avatarColor }}
                  aria-label={emp.name}
                >
                  {emp.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                      emp.status
                    )}`}
                  />
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* 2. Full Sidebar Container (When Expanded or on Mobile) */}
      <aside
        className={`fixed lg:static top-16 left-3 sm:left-4 bottom-3 sm:bottom-4 w-[calc(100vw-1.5rem)] sm:w-76 z-30 flex flex-col bg-white/85 backdrop-blur-xl border border-white/70 rounded-2xl shadow-2xl transition-all duration-300 pointer-events-auto overflow-hidden ${
          isRosterCollapsed ? 'lg:hidden' : ''
        } ${
          isMobileDrawerOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-[calc(100%+2rem)] opacity-0 lg:translate-x-0 lg:opacity-100'
        }`}
      >
        {/* Header with Title and Collapse Button */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                AI Team Roster
              </h2>
              <span className="text-[10px] text-teal-700 font-semibold">8 Autonomous Specialists</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Button */}
            <button
              onClick={toggleRosterCollapse}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Collapse to minimal rail"
              aria-label="Collapse roster"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close roster"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search / Filter agents */}
        <div className="px-3 pt-2.5 pb-1">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specialists or skills..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredEmployees.map((emp) => {
            const isSelected = emp.id === selectedEmployeeId;
            return (
              <button
                key={emp.id}
                onClick={() => {
                  selectEmployee(emp.id);
                  if (window.innerWidth < 1024) setIsMobileDrawerOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition flex items-center gap-2.5 border cursor-pointer ${
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

                {/* Details - Ultra Clear Readability */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      className={`text-[13px] font-bold truncate ${
                        isSelected ? 'text-teal-950 font-extrabold' : 'text-slate-900'
                      }`}
                    >
                      {emp.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 capitalize shrink-0">
                      {emp.status === 'working' ? (
                        <span className="text-emerald-700 font-extrabold">● Working</span>
                      ) : emp.status === 'thinking' ? (
                        <span className="text-amber-700 font-extrabold">● Thinking</span>
                      ) : (
                        <span>● Idle</span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate font-semibold">{emp.role}</p>
                </div>

                {isSelected && <ChevronRight className="w-4 h-4 text-teal-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Chief of Staff
            </span>
            <span className="font-extrabold text-teal-900">Victoria Sterling</span>
          </div>
        </div>
      </aside>
    </>
  );
};
