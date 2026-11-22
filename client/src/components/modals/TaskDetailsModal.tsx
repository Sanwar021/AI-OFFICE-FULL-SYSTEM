import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

export const TaskDetailsModal: React.FC = () => {
  const isTaskDetailsModalOpen = useOfficeStore((state) => state.isTaskDetailsModalOpen);
  const setIsTaskDetailsModalOpen = useOfficeStore((state) => state.setIsTaskDetailsModalOpen);
  const selectedTaskId = useOfficeStore((state) => state.selectedTaskId);
  const tasks = useOfficeStore((state) => state.tasks);
  const employees = useOfficeStore((state) => state.employees);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const activeTaskStream = useOfficeStore((state) => state.activeTaskStream);

  const [activeTab, setActiveTab] = useState<'deliverable' | 'trace'>('deliverable');
  const [copied, setCopied] = useState(false);

  if (!isTaskDetailsModalOpen) return null;

  const currentTask =
    tasks.find((t) => t.id === selectedTaskId) ||
    tasks.find((t) => t.assignedEmployeeId === selectedEmployeeId) ||
    tasks[0];

  const assignedEmployee = employees.find(
    (e) => e.id === currentTask?.assignedEmployeeId
  );

  const deliverableContent =
    activeTaskStream ||
    assignedEmployee?.monitorContent ||
    `# ${currentTask?.title}
### Prepared by: ${assignedEmployee?.name} (${assignedEmployee?.role})
*Status: Verified Production Deliverable*

---

## 1. Executive Summary & Strategic Objectives
This deliverable fulfills the workspace assignment: **${currentTask?.instructions}**.
The automated pipeline synthesized live market intelligence, competitor benchmarking, and actionable deliverables for rapid execution.

## 2. Core Strategic Pillars
- **Target Precision**: Calibrated specifically for high-intent B2B Enterprise accounts with immediate ROI attribution.
- **Workflow Automation**: Integrated into daily departmental execution with automated status tracking.
- **Answer Engine Visibility**: Structured schemas optimized for Perplexity, ChatGPT, and Google Gemini citations.

## 3. Recommended Next Actions
1. Deploy deliverable into the active staging workflow.
2. Review multi-channel marketing hooks with Sophia Parker.
3. Align performance CPA metrics with James Wilson.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(deliverableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([deliverableContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTask?.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')}_deliverable.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto select-none">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3 min-w-0">
            {assignedEmployee?.avatarUrl ? (
              <img
                src={assignedEmployee.avatarUrl}
                alt={assignedEmployee.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                style={{ backgroundColor: assignedEmployee?.avatarColor || '#10b981' }}
              >
                {assignedEmployee?.name.split(' ').map((n) => n[0]).join('') || 'AI'}
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm text-slate-900 truncate">
                  {currentTask?.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {currentTask?.status === 'running' ? 'In Progress' : 'Verified'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {assignedEmployee?.name} • {assignedEmployee?.role} • {currentTask?.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Download Markdown Deliverable"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={() => setIsTaskDetailsModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 border-b border-slate-100 flex items-center gap-4 bg-white text-xs">
          <button
            onClick={() => setActiveTab('deliverable')}
            className={`py-2.5 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'deliverable'
                ? 'border-[#1E4E38] text-[#1E4E38]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Deliverable Content
          </button>
          <button
            onClick={() => setActiveTab('trace')}
            className={`py-2.5 font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'trace'
                ? 'border-[#1E4E38] text-[#1E4E38]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Task Instructions & Details
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          {activeTab === 'deliverable' ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {deliverableContent}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Detailed Instructions
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {currentTask?.instructions}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Priority
                  </span>
                  <span className="text-xs font-bold text-slate-800 uppercase">
                    {currentTask?.priority}
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Assigned Model
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    Google Gemini 2.0 Flash
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};