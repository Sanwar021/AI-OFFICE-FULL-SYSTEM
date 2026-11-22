import React, { useState } from 'react';
import {
  X,
  BarChart3,
  Sparkles,
  Download,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

const defaultReport = `# Daily Executive Office Briefing
**Author**: Emma Taylor, Chief of Staff
**Date**: Monday, June 16 • 10:42 AM
**Status**: All 8 Autonomous Specialists Synchronized (+12% Velocity)

---

## 1. Executive Summary
The AI Office team has completed **24 work cycles** today across product launch planning, Answer Engine Optimization (AEO), full-stack infrastructure performance, and outbound sales prospecting.

## 2. Departmental Status & Active Deliverables
- **Go-To-Market (Alex Morgan)**: Finalized Q3 enterprise market strategy; ICP matrix loaded.
- **Search & Answer Engine Optimization (Olivia Chen)**: Authored 2,400-word authoritative guide indexed for Perplexity & Gemini.
- **Fullstack Web Engineering (Ethan Brooks)**: React 19 & Tailwind 4 optimizations benchmarked; bundle size reduced by 34%.
- **Social Media & Community (Sophia Parker)**: Multi-channel launch campaign drafted; awaiting executive approval.
- **Paid Acquisition & Ads (James Wilson)**: Cross-platform blended CAC audit completed; CPA reduced by 22%.
- **Enterprise Sales (Isabella Reed)**: Top 50 B2B enterprise accounts mapped with multi-touch cadences.
- **Customer Success & CSAT (Noah Davis)**: Automated FAQ resolution workflows resolved 75% of onboarding friction points.

## 3. High-Priority Items for Human Leadership
1. **Approval Required**: Sophia Parker's multi-channel product announcement schedule.
2. **Action Item**: Review outbound enterprise prospect list before live dispatch.
`;

export const ReportsModal: React.FC = () => {
  const isReportsModalOpen = useOfficeStore((state) => state.isReportsModalOpen);
  const setIsReportsModalOpen = useOfficeStore((state) => state.setIsReportsModalOpen);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportContent, setReportContent] = useState(defaultReport);

  if (!isReportsModalOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/brief', { method: 'POST' });
      const data = await res.json();
      if (data.briefMarkdown) {
        setReportContent(data.briefMarkdown);
      }
    } catch {
      // ignore
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `executive_office_briefing_${new Date().toISOString().slice(0, 10)}.md`;
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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1E4E38] flex items-center justify-center text-white shrink-0 shadow-xs">
              <BarChart3 className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Executive Reports & Briefings
              </h3>
              <p className="text-xs text-slate-500">
                Compiled in real time by Emma Taylor (Chief of Staff)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-2xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isGenerating ? 'Generating...' : 'Refresh Brief'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsReportsModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-3 p-3 sm:px-5 border-b border-slate-100 bg-white text-xs">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-slate-900">8 Specialists</span>
              <p className="text-[11px] text-slate-500">100% active capacity</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-slate-900">24 Completed</span>
              <p className="text-[11px] text-slate-500">+12% vs yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-slate-900">Gemini 2.0 Flash</span>
              <p className="text-[11px] text-slate-500">Sub-second generation</p>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {reportContent}
          </div>
        </div>
      </div>
    </div>
  );
};