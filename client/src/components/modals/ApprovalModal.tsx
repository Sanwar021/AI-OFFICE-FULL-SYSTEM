import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose }) => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/approvals');
      const data = await res.json();
      setApprovals(data.approvals || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchApprovals();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await fetch(`/api/approvals/${id}/${action}`, { method: 'POST' });
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Human Approval Gateway</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Review sensitive external business actions before they execute
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {loading && <p className="text-xs text-slate-500">Loading approvals...</p>}

          {!loading && approvals.filter((a) => a.status === 'pending').length === 0 && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
              <p className="text-sm font-semibold text-slate-700">All clear!</p>
              <p className="text-xs text-slate-500">No actions currently pending human review.</p>
            </div>
          )}

          {approvals
            .filter((a) => a.status === 'pending')
            .map((appr) => (
              <div
                key={appr.id}
                className="p-3.5 sm:p-4 border border-purple-200 rounded-2xl bg-purple-50/20 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                      {appr.actionType}
                    </span>
                    <span className="text-xs text-slate-500">
                      Prepared by employee: <strong className="text-slate-800">{appr.employeeId}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(appr.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                {/* Content draft */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {appr.content}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleAction(appr.id, 'reject')}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(appr.id, 'approve')}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Action
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
