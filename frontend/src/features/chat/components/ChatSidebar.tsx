import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Pin,
  Bot,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { ChatSession, ChatSettings, LLMModel } from '@/features/chat/types';

type ChatSidebarProps = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onRenameSession: (id: string, title: string) => void;
  onDeleteSession: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
};

const MODELS: Array<{ id: LLMModel; label: string; desc: string }> = [
  { id: 'gpt-4o', label: 'GPT-4o Enterprise', desc: 'High intelligence & reasoning' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', desc: 'Fast & efficient' },
  { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', desc: 'Advanced analysis' },
  { id: 'industrial-llama-3', label: 'Industrial Llama 3 (On-Prem)', desc: 'Privacy & offline' }
];

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession,
  searchQuery,
  onSearchChange,
  settings,
  onSettingsChange
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex h-full flex-col justify-between border-r border-slate-800/80 bg-slate-950/80 p-4">
      <div className="space-y-4 overflow-hidden flex flex-col flex-1">
        {/* Top bar with New Chat & Settings */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={onCreateSession}
            className="flex-1 text-xs py-2 shadow-glow"
          >
            <Plus className="h-4 w-4 mr-1.5" /> New Chat
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowSettingsModal(!showSettingsModal)}
            className="p-2 text-slate-300 hover:text-white"
            title="Model & Prompt Settings"
          >
            <Sliders className="h-4 w-4" />
          </Button>
        </div>

        {/* Model & Parameter Drawer */}
        {showSettingsModal ? (
          <div className="space-y-3 rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-3 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-200">
              <span className="flex items-center gap-1">
                <Bot className="h-3.5 w-3.5 text-cyan-400" /> AI Parameters
              </span>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400">LLM Model</label>
              <select
                value={settings.model}
                onChange={(e) => onSettingsChange({ ...settings, model: e.target.value as LLMModel })}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Temperature</span>
                <span>{settings.temperature}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.temperature}
                onChange={(e) =>
                  onSettingsChange({ ...settings, temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        ) : null}

        {/* Search Input */}
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 text-xs py-1.5"
          />
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;

            return (
              <div
                key={s.id}
                onClick={() => onSelectSession(s.id)}
                className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs transition ${
                  isActive
                    ? 'border border-cyan-500/40 bg-slate-900 font-semibold text-slate-100'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <MessageSquare
                    className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}
                  />

                  {editingId === s.id ? (
                    <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="py-0.5 px-1.5 text-xs"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleSaveRename(s.id, e)}
                        className="text-emerald-400 p-0.5"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-hidden truncate">
                      <p className="truncate text-slate-200">{s.title}</p>
                      <p className="truncate text-[10px] text-slate-400">{s.previewText}</p>
                    </div>
                  )}
                </div>

                {/* Session Hover Actions */}
                {editingId !== s.id ? (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={(e) => handleStartRename(s, e)}
                      className="p-1 hover:text-slate-200"
                      title="Rename"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      className="p-1 hover:text-amber-400"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI System Footer Status */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          RAG Engine Online
        </span>
        <span className="text-cyan-400 font-mono text-[10px]">v2.6-AI</span>
      </div>
    </div>
  );
}
