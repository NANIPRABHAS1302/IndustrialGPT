import { useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, RefreshCw, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChatSidebar } from '@/features/chat/components/ChatSidebar';
import { ChatMessageItem } from '@/features/chat/components/ChatMessageItem';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { useChat } from '@/features/chat/hooks/useChat';

export function ChatFeature() {
  const {
    sessions,
    activeSessionId,
    activeSession,
    setActiveSessionId,
    messages,
    isLoadingSessions,
    isLoadingMessages,
    settings,
    setSettings,
    searchQuery,
    setSearchQuery,
    sendMessage,
    isGenerating,
    streamingContent,
    stopGeneration,
    regenerateResponse,
    createSession,
    renameSession,
    deleteSession
  } = useChat();

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleExportChat = () => {
    const chatText = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IndustrialGPT-Chat-${activeSession?.title || 'export'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid h-[calc(100vh-7rem)] grid-cols-1 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 shadow-2xl lg:grid-cols-[280px_1fr]">
      {/* Sidebar Navigation */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onCreateSession={createSession}
        onRenameSession={renameSession}
        onDeleteSession={deleteSession}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Main Conversation Canvas */}
      <div className="flex h-full flex-col overflow-hidden bg-slate-900/40">
        {/* Header Control Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                {activeSession ? activeSession.title : 'Industrial AI Assistant'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Model: <span className="text-cyan-400 font-mono">{settings.model}</span> • Grounded in Plant SOPs & Knowledge Graph
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={regenerateResponse}
              disabled={isGenerating || messages.length === 0}
              className="text-xs px-2.5 py-1.5 text-slate-300 hover:text-slate-100"
              title="Regenerate Last Response"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" /> Regenerate
            </Button>

            <Button
              variant="secondary"
              onClick={handleExportChat}
              disabled={messages.length === 0}
              className="text-xs px-3 py-1.5"
            >
              <Download className="h-3.5 w-3.5 mr-1" /> Export Chat
            </Button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              onCopy={(text) => navigator.clipboard.writeText(text)}
            />
          ))}

          {/* Active Live Streaming Indicator */}
          {isGenerating && streamingContent ? (
            <ChatMessageItem
              message={{
                id: 'streaming-active',
                sessionId: activeSessionId || '',
                role: 'assistant',
                content: streamingContent,
                timestamp: 'Now',
                modelUsed: settings.model,
                isStreaming: true
              }}
              onCopy={() => {}}
            />
          ) : isGenerating ? (
            <div className="flex items-center gap-2 py-4 text-xs text-cyan-300">
              <Bot className="h-4 w-4 animate-bounce" />
              <span>Analyzing manuals & knowledge graph...</span>
            </div>
          ) : null}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <ChatInput
          onSendMessage={sendMessage}
          isGenerating={isGenerating}
          onStopGeneration={stopGeneration}
        />
      </div>
    </div>
  );
}
