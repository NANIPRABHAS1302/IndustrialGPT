import React, { useState } from 'react';
import {
  Bot,
  User,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Sparkles,
  Paperclip,
  Code2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { ChatMessage, Citation } from '@/features/chat/types';

type ChatMessageItemProps = {
  message: ChatMessage;
  onCopy: (content: string) => void;
};

export function ChatMessageItem({ message, onCopy }: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [showCitations, setShowCitations] = useState(true);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    onCopy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 py-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
          <Bot className="h-4 w-4" />
        </div>
      ) : null}

      <div className={`space-y-2 max-w-3xl ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Container */}
        <div
          className={`rounded-2xl p-4 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
              : 'border border-slate-800/80 bg-slate-900/90 text-slate-100'
          }`}
        >
          {/* Formatted Content Rendering */}
          <div className="whitespace-pre-wrap font-sans text-slate-100">
            {message.content}
          </div>

          {/* Attachments if any */}
          {message.attachments && message.attachments.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-800/80 pt-2">
              {message.attachments.map((att) => (
                <span
                  key={att.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
                >
                  <Paperclip className="h-3 w-3 text-cyan-400" />
                  {att.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Footer Meta & RAG Citations */}
        {!isUser ? (
          <div className="space-y-2">
            {/* Meta Actions Bar */}
            <div className="flex items-center gap-3 text-xs text-slate-400 pl-1">
              <span>{message.timestamp}</span>
              {message.modelUsed ? (
                <>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-cyan-400">{message.modelUsed}</span>
                </>
              ) : null}
              {message.tokensUsed ? (
                <>
                  <span>•</span>
                  <span>{message.tokensUsed} tokens</span>
                </>
              ) : null}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-slate-200 transition"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>

              {message.citations && message.citations.length > 0 ? (
                <button
                  onClick={() => setShowCitations(!showCitations)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {message.citations.length} Source Citations
                  {showCitations ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              ) : null}
            </div>

            {/* Citations Accordion Panel */}
            {showCitations && message.citations && message.citations.length > 0 ? (
              <div className="space-y-1.5 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-300 text-[11px] mb-1">
                  <Sparkles className="h-3 w-3 text-cyan-400" /> Grounded Ingested Sources:
                </div>
                {message.citations.map((cit) => (
                  <div
                    key={cit.id}
                    className="flex flex-col gap-0.5 rounded-lg border border-slate-800 bg-slate-900/90 p-2 text-slate-300"
                  >
                    <div className="flex items-center justify-between font-medium text-cyan-300">
                      <span>
                        {cit.documentTitle} {cit.pageNumber ? `(Page ${cit.pageNumber})` : ''}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(cit.confidence * 100).toFixed(0)}% match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">"{cit.snippet}"</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/20 text-blue-300">
          <User className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}
