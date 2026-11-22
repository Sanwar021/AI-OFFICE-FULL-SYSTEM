import React, { useState, useEffect } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import { X, Key, Users, Folder, Check, AlertCircle, RefreshCw } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const isSettingsModalOpen = useOfficeStore((state) => state.isSettingsModalOpen);
  const setIsSettingsModalOpen = useOfficeStore((state) => state.setIsSettingsModalOpen);
  const employees = useOfficeStore((state) => state.employees);

  const [activeTab, setActiveTab] = useState<'gemini' | 'employees' | 'workspace'>('gemini');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [maxConcurrency, setMaxConcurrency] = useState(3);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [workspaceFiles, setWorkspaceFiles] = useState<any[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isSettingsModalOpen) {
      fetchSettings();
      fetchFiles();
    }
  }, [isSettingsModalOpen]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.model) setSelectedModel(data.model);
      if (data.maxConcurrentTasks) setMaxConcurrency(data.maxConcurrentTasks);
    } catch {
      // ignore
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/workspace');
      const data = await res.json();
      setWorkspaceFiles(data.files || []);
    } catch {
      // ignore
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/settings/test-gemini', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Network error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKeyInput.trim() || undefined,
          model: selectedModel,
          maxConcurrentTasks: maxConcurrency,
        }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  const viewFile = async (name: string) => {
    try {
      const res = await fetch(`/api/workspace/${name}`);
      const data = await res.json();
      setSelectedFileName(name);
      setSelectedFileContent(data.content || '');
    } catch {
      // ignore
    }
  };

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Office Settings & Configuration</h3>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-100 px-3 sm:px-4 bg-white shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('gemini')}
            className={`min-h-[44px] px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeTab === 'gemini'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Gemini & Engine
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`min-h-[44px] px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeTab === 'employees'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Team System Prompts
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`min-h-[44px] px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeTab === 'workspace'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            Workspace Deliverables ({workspaceFiles.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'gemini' && (
            <div className="space-y-4">
              {/* API Key */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gemini API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter new API key (or leave blank to keep server-side key)"
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 bg-slate-50/50"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    Test Connection
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Key is stored exclusively in server memory / .env and never sent to the browser.
                </p>
              </div>

              {testResult && (
                <div
                  className={`p-3 text-xs rounded-xl border flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {testResult.success ? 'Gemini Connected' : 'Connection Error'}
                    </div>
                    <div className="text-[11px] mt-0.5 whitespace-pre-wrap">
                      {testResult.message}
                    </div>
                  </div>
                </div>
              )}

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gemini Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 bg-slate-50/50"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended, High Speed)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                  <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                </select>
              </div>

              {/* Max Concurrency */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Max Concurrent AI Tasks:
                  </label>
                  <span className="text-xs font-bold text-teal-700">{maxConcurrency} tasks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxConcurrency}
                  onChange={(e) => setMaxConcurrency(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Custom system instructions for each of the 8 AI employees:
              </p>
              {employees.map((emp) => (
                <div key={emp.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/40">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: emp.avatarColor }}
                    />
                    <strong className="text-xs text-slate-800">{emp.name}</strong>
                    <span className="text-[11px] text-teal-700 font-semibold">({emp.role})</span>
                  </div>
                  <textarea
                    rows={3}
                    defaultValue={emp.systemPrompt}
                    onBlur={(e) => {
                      fetch(`/api/employees/${emp.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ systemPrompt: e.target.value }),
                      });
                    }}
                    className="w-full px-2.5 py-1.5 text-[11px] border border-slate-200 rounded-lg font-mono bg-white resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-3">
              {selectedFileContent ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{selectedFileName}</span>
                    <button
                      onClick={() => setSelectedFileContent(null)}
                      className="text-xs text-teal-600 hover:underline"
                    >
                      Back to file list
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
                    {selectedFileContent}
                  </pre>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {workspaceFiles.length === 0 && (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      No files generated yet. When employees use 'save_file', deliverables appear here.
                    </p>
                  )}
                  {workspaceFiles.map((file) => (
                    <div
                      key={file.name}
                      onClick={() => viewFile(file.name)}
                      className="p-2.5 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-semibold text-slate-800">{file.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <span className="text-xs text-emerald-600 font-semibold truncate">
            {saveSuccess && 'Settings saved successfully!'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="min-h-[44px] px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSaveSettings}
              className="min-h-[44px] px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
