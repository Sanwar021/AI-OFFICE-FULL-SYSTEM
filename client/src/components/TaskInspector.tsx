import React, { useState } from 'react';
import { useOfficeStore } from '../store/useOfficeStore';
import {
  Terminal,
  Play,
  FileText,
  Sparkles,
  Activity,
  Copy,
  Check,
  Download,
  ChevronRight,
  ChevronLeft,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

export const TaskInspector: React.FC = () => {
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const employees = useOfficeStore((state) => state.employees);
  const activeTaskStream = useOfficeStore((state) => state.activeTaskStream);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);
  const isInspectorOpen = useOfficeStore((state) => state.isInspectorOpen);
  const setIsInspectorOpen = useOfficeStore((state) => state.setIsInspectorOpen);

  const [activeTab, setActiveTab] = useState<'terminal' | 'deliverables' | 'profile'>('terminal');
  const [copied, setCopied] = useState(false);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  if (!selectedEmployee) return null;

  const handleCopyStream = () => {
    const textToCopy = activeTaskStream || selectedEmployee.monitorContent || '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDeliverable = () => {
    const content = activeTaskStream || selectedEmployee.monitorContent || 'Deliverable content';
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedEmployee.role.toLowerCase().replace(/[\s/]+/g, '_')}_deliverable.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop for mobile / tablet drawer */}
      {isInspectorOpen && (
        <div
          onClick={() => setIsInspectorOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 xl:hidden pointer-events-auto"
        />
      )}

      {/* Floating Minimized Pill on Desktop when Inspector is Closed */}
      {!isInspectorOpen && (
        <aside className="hidden xl:flex fixed top-20 right-4 z-20 pointer-events-auto">
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/70 shadow-xl hover:shadow-2xl hover:bg-white text-slate-800 transition-all cursor-pointer group"
            title="Open Specialist Inspector"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
              style={{ backgroundColor: selectedEmployee.avatarColor }}
            >
              {selectedEmployee.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight">{selectedEmployee.name}</div>
              <div className="text-[10px] text-teal-700 font-semibold">{selectedEmployee.role}</div>
            </div>
            <div className="flex items-center gap-1 pl-1 text-slate-400 group-hover:text-teal-600 transition">
              <span className="text-[10px] font-bold text-teal-600 hidden group-hover:inline">Inspect</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </button>
        </aside>
      )}

      {/* Inspector Main Container */}
      <aside
        className={`fixed xl:static top-16 right-3 sm:right-4 bottom-3 sm:bottom-4 w-[calc(100vw-1.5rem)] sm:w-96 xl:w-92 z-30 flex flex-col bg-white/85 backdrop-blur-xl border border-white/70 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden transition-all duration-300 ${
          isInspectorOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-[calc(100%+2rem)] opacity-0 xl:hidden'
        }`}
      >
        {/* Header with Employee Role Badge & Action Controls */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs shrink-0"
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
            {/* Desktop Minimize Toggle */}
            <button
              onClick={() => setIsInspectorOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Minimize Inspector"
              aria-label="Minimize inspector"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Status Strip */}
        <div className="px-3.5 sm:px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Live State
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

        {/* Inspector Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-3 pt-2 bg-white/40 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`pb-2 px-2.5 font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'terminal'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('deliverables')}
            className={`pb-2 px-2.5 font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'deliverables'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Deliverables
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-2.5 font-bold flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'profile'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Model Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5">
          {activeTab === 'terminal' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Terminal className="w-3.5 h-3.5 text-teal-600" />
                  Live Code & Token Stream
                </div>
                <button
                  onClick={handleCopyStream}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-teal-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Copy terminal output"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="w-full h-48 sm:h-56 bg-slate-950 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed overflow-y-auto border border-slate-800 shadow-inner">
                {activeTaskStream ? (
                  <div className="whitespace-pre-wrap">{activeTaskStream}</div>
                ) : selectedEmployee.monitorContent ? (
                  <div className="whitespace-pre-wrap">{selectedEmployee.monitorContent}</div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    <Sparkles className="w-5 h-5 text-teal-500 animate-pulse" />
                    <span>Station ready. Assign a business task to stream output.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'deliverables' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Generated Assets</span>
                <button
                  onClick={handleDownloadDeliverable}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .MD
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{selectedEmployee.role} Deliverable</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedEmployee.monitorContent ||
                    'All completed plans, strategies, code artifacts, and reports generated by this specialist are compiled here.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Specialist Intelligence Profile
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Powered by <strong>Google Gemini 2.0 Flash</strong> with specialized context, custom prompt constraints, and real-time tool orchestration.
                </p>
              </div>

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
          )}
        </div>

        {/* Footer Quick Action */}
        <div className="p-3 sm:p-3.5 border-t border-slate-100 bg-white/60">
          <button
            onClick={() => {
              setIsNewTaskModalOpen(true);
            }}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            Assign Task to {selectedEmployee.name.split(' ')[0]}
          </button>
        </div>
      </aside>
    </>
  );
};
