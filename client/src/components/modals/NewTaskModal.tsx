import React, { useState, useEffect } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { X, Play, Sparkles, Send } from 'lucide-react';

interface NewTaskModalProps {
  onPlanGenerated: (plan: any) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ onPlanGenerated }) => {
  const isNewTaskModalOpen = useOfficeStore((state) => state.isNewTaskModalOpen);
  const setIsNewTaskModalOpen = useOfficeStore((state) => state.setIsNewTaskModalOpen);
  const employees = useOfficeStore((state) => state.employees);
  const selectedEmployeeId = useOfficeStore((state) => state.selectedEmployeeId);
  const newTaskInitialPrompt = useOfficeStore((state) => state.newTaskInitialPrompt);
  const setNewTaskInitialPrompt = useOfficeStore((state) => state.setNewTaskInitialPrompt);
  const updateEmployeeStatus = useOfficeStore((state) => state.updateEmployeeStatus);

  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState(selectedEmployeeId || 'emp-1');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [mode, setMode] = useState<'manual' | 'chief_plan'>('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNewTaskModalOpen) {
      if (selectedEmployeeId) {
        setAssignedEmployeeId(selectedEmployeeId);
      }
      if (newTaskInitialPrompt) {
        setTitle(newTaskInitialPrompt);
        setInstructions(newTaskInitialPrompt);
        setMode('chief_plan');
        setNewTaskInitialPrompt('');
      }
    }
  }, [isNewTaskModalOpen, newTaskInitialPrompt, selectedEmployeeId, setNewTaskInitialPrompt]);

  if (!isNewTaskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim()) {
      setError('Please provide both a title and instructions.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'chief_plan') {
        // Chief of Staff AI planning
        const res = await fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ objective: `${title}: ${instructions}` }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to generate plan.');
        setIsNewTaskModalOpen(false);
        onPlanGenerated(data.plan);
      } else {
        // Direct task creation
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            instructions,
            assignedEmployeeId,
            priority,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to create task.');
        updateEmployeeStatus(assignedEmployeeId, 'working', 'typing');
        setIsNewTaskModalOpen(false);
        setTitle('');
        setInstructions('');
      }
    } catch (err: any) {
      setError(err.message || 'Error submitting task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Assign New Task</h3>
              <p className="text-[11px] sm:text-xs text-slate-500">Dispatch work to the AI Office team</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewTaskModalOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Mode Switcher: Manual vs Chief of Staff Auto-Plan */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center ${
                mode === 'manual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Direct Specialist
            </button>
            <button
              type="button"
              onClick={() => setMode('chief_plan')}
              className={`min-h-[44px] py-2 px-3 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'chief_plan'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Chief of Staff Plan
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mode === 'chief_plan' ? 'Business Objective' : 'Task Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                mode === 'chief_plan'
                  ? 'e.g., Q1 Product Launch & Outbound Campaign'
                  : 'e.g., Draft SEO Article on AI Office Workspaces'
              }
              className="w-full min-h-[42px] px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 bg-slate-50/50"
            />
          </div>

          {/* Specialist Selection (Only in manual mode) */}
          {mode === 'manual' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Specialist
              </label>
              <select
                value={assignedEmployeeId}
                onChange={(e) => setAssignedEmployeeId(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 bg-slate-50/50 cursor-pointer"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mode === 'chief_plan' ? 'Context & Goals' : 'Detailed Instructions'}
            </label>
            <textarea
              required
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={
                mode === 'chief_plan'
                  ? 'Describe the overarching business goals, key target audience, and expected deliverables...'
                  : 'Specific instructions, deliverables format, constraints, and research sources...'
              }
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 bg-slate-50/50 resize-none font-sans"
            />
          </div>

          {/* Priority */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700">Priority Level:</span>
            <div className="flex items-center gap-1.5">
              {(['low', 'medium', 'high', 'urgent'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition cursor-pointer ${
                    priority === p
                      ? p === 'urgent'
                        ? 'bg-rose-500 text-white'
                        : p === 'high'
                        ? 'bg-amber-500 text-white'
                        : 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewTaskModalOpen(false)}
              className="min-h-[44px] px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : mode === 'chief_plan' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Plan</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
