import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';

interface PlanPreviewModalProps {
  plan: any;
  onClose: () => void;
  onPlanExecuted: () => void;
}

export const PlanPreviewModal: React.FC<PlanPreviewModalProps> = ({
  plan,
  onClose,
  onPlanExecuted,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState('');

  if (!plan) return null;

  const handleApprove = async () => {
    setIsExecuting(true);
    setError('');
    try {
      const res = await fetch('/api/plan/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to execute plan.');
      onPlanExecuted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Execution failed.');
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Chief of Staff — Execution Plan
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Victoria Sterling has analyzed your objective
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Objective Summary */}
          <div className="p-3.5 bg-teal-50/60 border border-teal-100 rounded-xl">
            <h4 className="text-xs font-bold text-teal-900 mb-1">Executive Summary</h4>
            <p className="text-xs text-teal-800 leading-relaxed">{plan.summary}</p>
          </div>

          {/* Subtasks List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Subtasks & Work Delegation ({plan.subtasks?.length || 0})
            </h4>
            <div className="space-y-2">
              {plan.subtasks?.map((st: any, idx: number) => (
                <div
                  key={st.id || idx}
                  className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-white transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900">{st.title}</h5>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {st.canRunInParallel && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-semibold border border-cyan-200">
                          Parallel
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold capitalize">
                        {st.priority}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">{st.instructions}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="font-semibold text-teal-700">
                      {st.employeeName || st.assignedEmployeeId}
                    </span>
                    <span>•</span>
                    <span>{st.employeeRole}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Reject Plan
          </button>
          <button
            type="button"
            disabled={isExecuting}
            onClick={handleApprove}
            className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isExecuting ? (
              <span>Starting Execution...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Approve & Start All Subtasks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
