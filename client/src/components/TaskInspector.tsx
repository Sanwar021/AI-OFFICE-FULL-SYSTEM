import React from 'react';
import { useOfficeStore } from '../store/useOfficeStore';
import { Terminal, Play, FileText, Sparkles } from 'lucide-react';

export const TaskInspector: React.FC = () => {
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const employees = useOfficeStore((state) => state.employees);
  const activeTaskStream = useOfficeStore((state) => state.activeTaskStream);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  if (!selectedEmployee) return null;

  return (
    <aside className="fixed lg:static top-16 right-4 bottom-4 w-80 z-20 flex flex-col bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg pointer-events-auto overflow-hidden hidden md:flex">
      {/* Header with Employee Role Badge */}
      <div className="p-4 border-b border-slate-100 bg-white/40">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
            style={{ backgroundColor: selectedEmployee.avatarColor }}
          >
            {selectedEmployee.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">{selectedEmployee.name}</h3>
            <p className="text-xs font-semibold text-teal-700 truncate">{selectedEmployee.role}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-3 flex items-center justify-between text-xs font-medium bg-slate-100/70 p-2 rounded-xl">
          <span className="text-slate-600">Current Status:</span>
          <span className="capitalize font-semibold text-slate-800 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedEmployee.status === 'working'
                  ? 'bg-emerald-500 animate-pulse'
                  : selectedEmployee.status === 'thinking'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            {selectedEmployee.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Main Content: Live Monitor & Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Live Computer Monitor Feed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Terminal className="w-3.5 h-3.5 text-teal-600" />
              Live Desktop Monitor
            </div>
            <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Active Stream
            </span>
          </div>

          <div className="w-full h-44 bg-slate-950 text-slate-100 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-y-auto border border-slate-800 shadow-inner">
            {activeTaskStream ? (
              <div className="whitespace-pre-wrap">{activeTaskStream}</div>
            ) : selectedEmployee.monitorContent ? (
              <div className="whitespace-pre-wrap">{selectedEmployee.monitorContent}</div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-1.5">
                <Sparkles className="w-5 h-5 text-slate-600" />
                <span>Station idle. Assign a task to begin.</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Responsibilities */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            Core Capabilities
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            {selectedEmployee.role === 'GTM Engineer' &&
              'Designs go-to-market strategies, product launch execution plans, target ICP personas, and outbound growth playbooks.'}
            {selectedEmployee.role === 'SEO/AEO Specialist' &&
              'Conducts high-intent keyword discovery, Answer Engine Optimization (AEO) briefs, search clustering, and comprehensive content drafts.'}
            {selectedEmployee.role === 'Web Development Engineer' &&
              'Performs architecture reviews, technical audit reports, code generation, bug fixing, and frontend/backend specifications.'}
            {selectedEmployee.role === 'Social Media Manager' &&
              'Develops viral hooks, high-converting social campaigns, thread sequences, and multi-week editorial calendars.'}
            {selectedEmployee.role === 'Advertisement Manager' &&
              'Creates high-ROAS paid ad variants, Google & Meta campaign setups, audience targeting blueprints, and copy tests.'}
            {selectedEmployee.role === 'Sales Executive' &&
              'Researches high-value enterprise leads, drafts personalized first-touch cold emails, and constructs objection-handling scripts.'}
            {selectedEmployee.role === 'Customer Satisfaction Specialist' &&
              'Analyzes ticket sentiment, drafts empathetic support responses, identifies churn indicators, and designs proactive help guides.'}
            {selectedEmployee.role === 'Chief of Staff' &&
              'Orchestrates the entire team, analyzes business objectives, delegates subtasks, routes cross-functional dependencies, and creates morning briefs.'}
          </p>
        </div>
      </div>

      {/* Footer Quick Action */}
      <div className="p-3 border-t border-slate-100 bg-white/40">
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition"
        >
          <Play className="w-3.5 h-3.5" />
          Assign Task to {selectedEmployee.name.split(' ')[0]}
        </button>
      </div>
    </aside>
  );
};
