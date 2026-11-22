import React from 'react';
import {
  Bell,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

interface NotificationsDropdownProps {
  onOpenApprovals: () => void;
  onOpenTaskDetails: () => void;
  onClose: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  onOpenApprovals,
  onOpenTaskDetails,
  onClose,
}) => {
  const isNotificationsOpen = useOfficeStore((state) => state.isNotificationsOpen);

  if (!isNotificationsOpen) return null;

  return (
    <div className="absolute bottom-16 right-4 z-40 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Header */}
      <div className="p-3 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-extrabold text-xs text-slate-900">Notifications</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
            3 New
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {/* Item 1: Approval */}
        <div className="p-3 hover:bg-amber-50/40 transition flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Approval Required</span>
              <span className="text-[10px] text-slate-400">10m ago</span>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
              Sophia Parker submitted product announcement post for scheduled publication.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenApprovals();
              }}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 mt-1 cursor-pointer self-start"
            >
              <span>Review in Approvals</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Item 2: Completed Deliverable */}
        <div className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Deliverable Verified</span>
              <span className="text-[10px] text-slate-400">25m ago</span>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
              Olivia Chen generated high-authority AEO strategy guide.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenTaskDetails();
              }}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 mt-1 cursor-pointer self-start"
            >
              <span>Inspect Deliverable</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Item 3: Standup Sync */}
        <div className="p-3 hover:bg-slate-50 transition flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Morning Brief Synced</span>
              <span className="text-[10px] text-slate-400">1h ago</span>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
              Emma Taylor synchronized task dependencies across all 8 specialists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};