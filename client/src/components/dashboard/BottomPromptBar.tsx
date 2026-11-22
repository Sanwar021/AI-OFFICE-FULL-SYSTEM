import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Send,
  Sun,
  Moon,
  Settings,
  Bell,
  ArrowRight,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

interface BottomPromptBarProps {
  onOpenNewTask: () => void;
  onOpenSettings: () => void;
  onSubmitPrompt?: (prompt: string) => void;
}

export const BottomPromptBar: React.FC<BottomPromptBarProps> = ({
  onOpenNewTask,
  onOpenSettings,
  onSubmitPrompt,
}) => {
  const [promptText, setPromptText] = useState('');
  const timeOfDay = useOfficeStore((state) => state.timeOfDay);
  const toggleTimeOfDay = useOfficeStore((state) => state.toggleTimeOfDay);
  const toggleNotifications = useOfficeStore((state) => state.toggleNotifications);
  const setIsTasksModalOpen = useOfficeStore((state) => state.setIsTasksModalOpen);
  const toggleTour = useOfficeStore((state) => state.toggleTour);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    if (onSubmitPrompt) {
      onSubmitPrompt(promptText);
    } else {
      onOpenNewTask();
    }
    setPromptText('');
  };

  return (
    <div className="flex flex-col gap-2.5 pt-2 select-none">
      {/* Action & Prompt Input Row */}
      <div className="flex items-center gap-3">
        {/* + New task Button */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E4E38] hover:bg-[#163D2B] text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New task</span>
        </button>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center relative">
          <div className="w-full flex items-center bg-white border border-slate-200/90 rounded-xl px-3 py-2 shadow-2xs focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10 transition">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mr-2" />
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="What would you like your team to work on?"
              className="w-full bg-transparent border-none outline-hidden text-xs text-slate-800 placeholder:text-slate-400 font-normal"
            />
            <button
              type="submit"
              disabled={!promptText.trim()}
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 disabled:opacity-30 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Right Icon Actions: Day/Night, Settings, Bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Day / Night Toggle */}
          <button
            onClick={toggleTimeOfDay}
            className="p-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-2xs"
            title={`Switch to ${timeOfDay === 'day' ? 'evening' : 'day'} lighting`}
          >
            {timeOfDay === 'day' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-2xs"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer shadow-2xs relative"
            title="Notifications & Activity Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white" />
          </button>
        </div>
      </div>

      {/* Latest Activity Ticker */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div
          onClick={() => setIsTasksModalOpen(true)}
          className="flex items-center gap-2 cursor-pointer hover:text-slate-800 transition"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Latest activity
          </span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Olivia generated a new article draft</span>
            <span className="text-slate-400">• 2 hrs ago</span>
          </div>
        </div>

        <button
          onClick={() => setIsTasksModalOpen(true)}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <span>View all activity</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Subtle Bottom Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
        <span>Thoughtfully powered by AI. Always guided by you.</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Shield className="w-3 h-3 text-slate-400" />
            <span>Private by design</span>
          </span>
          <span>•</span>
          <button
            onClick={toggleTour}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            title="Start Cinematic 360 Tour"
          >
            <span>Interactive prototype</span>
            <HelpCircle className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};