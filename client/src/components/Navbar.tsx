import React, { useState, useEffect } from 'react';
import { useOfficeStore } from '../../src/store/useOfficeStore';
import { Sun, Moon, Video, Users, User, Plus, Settings, Menu, Sparkles, AlertTriangle, Clock } from 'lucide-react';

interface NavbarProps {
  onOpenApprovals: () => void;
  onOpenRoutines: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApprovals, onOpenRoutines }) => {
  const timeOfDay = useOfficeStore((state) => state.timeOfDay);
  const toggleTimeOfDay = useOfficeStore((state) => state.toggleTimeOfDay);
  const cameraPreset = useOfficeStore((state) => state.cameraPreset);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);
  const setIsSettingsModalOpen = useOfficeStore((state) => state.setIsSettingsModalOpen);
  const isMobileDrawerOpen = useOfficeStore((state) => state.isMobileDrawerOpen);
  const setIsMobileDrawerOpen = useOfficeStore((state) => state.setIsMobileDrawerOpen);

  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  useEffect(() => {
    const checkApprovals = () => {
      fetch('/api/approvals')
        .then((res) => res.json())
        .then((data) => {
          const pending = (data.approvals || []).filter((a: any) => a.status === 'pending');
          setPendingApprovalsCount(pending.length);
        })
        .catch(() => {});
    };
    checkApprovals();
    const interval = setInterval(checkApprovals, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-white/75 backdrop-blur-md border-b border-white/60 shadow-xs pointer-events-auto">
      {/* Left: Brand & Team */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100/80 rounded-xl transition"
          aria-label="Toggle employee roster"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-xs font-bold text-base sm:text-lg">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
                AI OFFICE
              </h1>
              <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-teal-600 animate-pulse" />
                Gemini
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">
              8 Autonomous Specialists Coordinated by Chief of Staff
            </p>
          </div>
        </div>
      </div>

      {/* Center: Camera Presets */}
      <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shadow-inner">
        <button
          onClick={() => setCameraPreset('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
            cameraPreset === 'overview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-teal-600" />
          Overview
        </button>
        <button
          onClick={() => setCameraPreset('team')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
            cameraPreset === 'team'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-teal-600" />
          Team View
        </button>
        <button
          onClick={() => setCameraPreset('follow')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
            cameraPreset === 'follow'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5 text-teal-600" />
          Follow Desk
        </button>
      </div>

      {/* Right: Controls & Modals */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Human Approvals Gateway */}
        <button
          onClick={onOpenApprovals}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition relative ${
            pendingApprovalsCount > 0
              ? 'bg-purple-50 text-purple-800 border-purple-300 animate-pulse'
              : 'text-slate-700 hover:bg-slate-100/80 border-slate-200/60'
          }`}
          title="Human Approvals Gateway"
        >
          <AlertTriangle className="w-4 h-4 text-purple-600" />
          <span className="hidden xl:inline">Approvals</span>
          {pendingApprovalsCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        {/* Scheduled Routines */}
        <button
          onClick={onOpenRoutines}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100/80 border border-slate-200/60 transition flex items-center gap-1.5 text-xs font-semibold"
          title="Scheduled Routines & Morning Brief"
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="hidden xl:inline">Routines</span>
        </button>

        {/* Day / Evening Toggle */}
        <button
          onClick={toggleTimeOfDay}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100/80 border border-slate-200/60 transition flex items-center gap-1 text-xs font-medium"
          title={timeOfDay === 'day' ? 'Switch to Evening' : 'Switch to Day'}
        >
          {timeOfDay === 'day' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100/80 border border-slate-200/60 transition"
          title="Office Settings & Gemini Configuration"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Assign Task Button */}
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline sm:inline">Assign Task</span>
        </button>
      </div>
    </header>
  );
};
