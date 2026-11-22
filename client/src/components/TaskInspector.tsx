import React from 'react';
import { useOfficeStore } from '../store/useOfficeStore';
import { Terminal, Play, FileText, Sparkles, X, Activity } from 'lucide-react';

export const TaskInspector: React.FC = () => {
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const employees = useOfficeStore((state) => state.employees);
  const activeTaskStream = useOfficeStore((state) => state.activeTaskStream);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);
  const isInspectorOpen = useOfficeStore((state) => state.isInspectorOpen);
  const setIsInspectorOpen = useOfficeStore((state) => state.setIsInspectorOpen);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  if (!selectedEmployee) return null;

  return (
    <>
      {/* Backdrop for mobile / tablet drawer */}
      {isInspectorOpen && (
        <div
          onClick={() => setIsInspectorOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 xl:hidden pointer-events-auto"
        />
      )}

      {/* Inspector Container */}
      <aside
        className={`fixed xl:static top-16 right-3 sm:right-4 bottom-3 sm:bottom-4 w-[calc(100vw-1.5rem)] sm:w-96 xl:w-84 z-30 flex flex-col bg-white/90 backdrop-blur-md border border-white/70 rounded-2xl shadow-xl pointer-events-auto overflow-hidden transition-all duration-300 ${
          isInspectorOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-[calc(100%+2rem)] opacity-0 xl:translate-x-0 xl:opacity-100'
        }`}
      >
        {/* Header with Employee Role Badge */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shadow-xs shrink-0"
              style={{ backgroundColor: selectedEmployee.avatarColor }}
            >
              {selectedEmployee.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {selectedEmployee.name}
              </h3>
              <p className="text-[11px] font-semibold text-teal-700 truncate">
                {selectedEmployee.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsInspectorOpen(false)}
              className="xl:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              aria-label="Close Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status Strip */}
        <div className="px-3.5 sm:px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Current Status
          </span>
          <span className="capitalize font-bold text-slate-800 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedEmployee.status === 'working'
                  ? 'bg-emerald-500 animate-pulse'
                  : selectedEmployee.status === 'thinking'
                  ? 'bg-amber-500 animate-pulse'
                  : selectedEmployee.status === 'waiting_approval'
                  ? 'bg-purple-500'
                  : 'bg-slate-400'
              }`}
            />
            {selectedEmployee.status.replace('_', ' ')}
          </span>
        </div>

        {/* Main Content: Live Monitor & Workspace */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 sm:space-y-4">
          {/* Live Computer Monitor Feed */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Terminal className="w-3.5 h-3.5 text-teal-600" />
                Live Desktop Terminal
              </div>
              <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Active Stream
              </span>
            </div>

            <div className="w-full h-40 sm:h-48 bg-slate-950 text-slate-100 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-y-auto border border-slate-800 shadow-inner">
              {activeTaskStream ? (
                <div className="whitespace-pre-wrap">{activeTaskStream}</div>
              ) : selectedEmployee.monitorContent ? (
                <div className="whitespace-pre-wrap">{selectedEmployee.monitorContent}</div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-1.5">
                  <Sparkles className="w-5 h-5 text-slate-600" />
                  <span>Station ready. Assign a task to begin stream.</span>
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
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/90 p-3 rounded-xl border border-slate-100">
              {selectedEmployee.role === 'GTM Engineer' &&
                'Designs go-to-market strategies, product launch roadmaps, Ideal Customer Profile (ICP) segmentation, outbound sales plays, and weekly launch scorecards.'}
              {selectedEmployee.role === 'SEO/AEO Specialist' &&
                'High-intent keyword research, search intent mapping, Answer Engine Optimization (optimizing for Perplexity, ChatGPT Search, Gemini), and structured article briefs.'}
              {selectedEmployee.role === 'Web Development Engineer' &&
                'Website architectural reviews, fullstack code generation (TypeScript, React, Node.js, Python), bug diagnostics, and dependency security audits.'}
              {selectedEmployee.role === 'Social Media Manager' &&
                'Multi-channel social strategies (X/Twitter, LinkedIn), viral hooks, content editorial calendars, and community engagement reply playbooks.'}
              {selectedEmployee.role === 'Advertisement Manager' &&
                'Paid advertising strategy across Google & Meta Ads, ROAS optimization, ad creative variants, and audience targeting models.'}
              {selectedEmployee.role === 'Sales Executive' &&
                'Target account prospecting, account intelligence research, personalized cold outreach email sequences, and objection-handling scripts.'}
              {selectedEmployee.role === 'Customer Satisfaction Specialist' &&
                'Ticket sentiment analysis, empathy-first response drafts, recurring complaint diagnosis, and churn risk mitigation playbooks.'}
              {selectedEmployee.role === 'Chief of Staff' &&
                'Central orchestrator of the entire office. Deconstructs objectives into subtasks, delegates to specialists, manages dependencies, and compiles morning briefs.'}
            </p>
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 sm:p-3.5 border-t border-slate-100 bg-white/50">
          <button
            onClick={() => {
              setIsNewTaskModalOpen(true);
              setIsInspectorOpen(false);
            }}
            className="w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            Assign Task to {selectedEmployee.name.split(' ')[0]}
          </button>
        </div>
      </aside>
    </>
  );
};
