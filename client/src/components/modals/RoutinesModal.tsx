import React, { useState, useEffect } from 'react';
import { X, Clock, Play, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useOfficeStore } from '../../store/useOfficeStore';

interface RoutinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoutinesModal: React.FC<RoutinesModalProps> = ({ isOpen, onClose }) => {
  const employees = useOfficeStore((state) => state.employees);
  const [routines, setRoutines] = useState<any[]>([]);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefResult, setBriefResult] = useState<string | null>(null);

  // New Routine Form state
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('emp-1');
  const [instructions, setInstructions] = useState('');
  const [cronExpression, setCronExpression] = useState('0 9 * * 1-5');

  const fetchRoutines = async () => {
    try {
      const res = await fetch('/api/routines');
      const data = await res.json();
      setRoutines(data.routines || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) fetchRoutines();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunNow = async (id: string) => {
    try {
      await fetch(`/api/routines/${id}/run`, { method: 'POST' });
      onClose();
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/routines/${id}`, { method: 'DELETE' });
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // ignore
    }
  };

  const handleCreateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, employeeId, instructions, cronExpression }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreating(false);
        setName('');
        setInstructions('');
        fetchRoutines();
      }
    } catch {
      // ignore
    }
  };

  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true);
    setBriefResult(null);
    try {
      const res = await fetch('/api/brief', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBriefResult(data.briefMarkdown);
      }
    } catch {
      // ignore
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Scheduled Routines & Morning Brief</h3>
              <p className="text-xs text-slate-500">Autonomous business routines executed on schedule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Morning Brief Card */}
          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Chief of Staff Morning Executive Brief
              </h4>
              <p className="text-xs text-teal-700 mt-0.5">
                Synthesize active team progress, pending approvals, and key wins.
              </p>
            </div>
            <button
              onClick={handleGenerateBrief}
              disabled={isGeneratingBrief}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition shrink-0"
            >
              {isGeneratingBrief ? 'Generating...' : 'Generate Now'}
            </button>
          </div>

          {briefResult && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-teal-400">Executive Brief Preview</span>
                <button
                  onClick={() => setBriefResult(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              <div className="text-xs whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto font-mono">
                {briefResult}
              </div>
            </div>
          )}

          {/* Routine List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Active Cron Routines ({routines.length})
              </h4>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-xs text-teal-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Routine
                </button>
              )}
            </div>

            {isCreating && (
              <form
                onSubmit={handleCreateRoutine}
                className="p-4 border border-teal-200 rounded-2xl bg-teal-50/20 mb-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900">New Scheduled Routine</span>
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Routine Name (e.g. Daily 9 AM SEO Draft)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Cron (e.g. 0 9 * * 1-5)"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-mono"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={2}
                    placeholder="Instructions for this routine..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Save Routine
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {routines.map((r) => (
                <div
                  key={r.id}
                  className="p-3 border border-slate-200 rounded-xl bg-white flex items-center justify-between hover:border-slate-300 transition"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h5 className="text-xs font-bold text-slate-900 truncate">{r.name}</h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {r.cronExpression}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">{r.instructions}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRunNow(r.id)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1 transition"
                    >
                      <Play className="w-3 h-3 text-teal-600" />
                      Run Now
                    </button>
                    {r.id !== 'routine-morning-brief' && (
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
