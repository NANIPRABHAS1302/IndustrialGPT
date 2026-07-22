import React, { useRef, useState } from 'react';
import { Send, Square, Paperclip, Sparkles, Image, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Attachment } from '@/features/chat/types';

type ChatInputProps = {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
};

const SUGGESTED_PROMPTS = [
  'How do I perform a fluid flush on Turbine B?',
  'What are the pressure limits for ISO VG 46 synthetic oils?',
  'Check plant 3 compliance against ISO 9001 standards.',
  'Summarize recent safety inspection anomalies.'
];

export function ChatInput({ onSendMessage, isGenerating, onStopGeneration }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((input.trim() || attachments.length > 0) && !isGenerating) {
      onSendMessage(input.trim(), attachments);
      setInput('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAtts: Attachment[] = files.map((f, i) => ({
      id: `att-${Date.now()}-${i}`,
      name: f.name,
      sizeBytes: f.size,
      type: f.type.includes('pdf') ? 'pdf' : f.type.includes('image') ? 'image' : 'text',
      url: URL.createObjectURL(f),
      file: f
    }));
    setAttachments((prev) => [...prev, ...newAtts]);
  };

  return (
    <div className="space-y-3 p-4 border-t border-slate-800/80 bg-slate-950/90">
      {/* Suggested Quick Prompts */}
      {!input && attachments.length === 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="flex items-center gap-1 font-semibold text-slate-400 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Prompts:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              className="shrink-0 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900 hover:text-cyan-200 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      {/* Attachment Previews */}
      {attachments.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {attachments.map((att) => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-300"
            >
              {att.type === 'pdf' ? (
                <FileText className="h-3.5 w-3.5" />
              ) : (
                <Image className="h-3.5 w-3.5" />
              )}
              {att.name}
              <button
                type="button"
                onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                className="hover:text-white ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {/* Main Input Textarea & Controls */}
      <div className="relative flex items-end gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-2 focus-within:border-cyan-500/50 shadow-inner">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-cyan-400 transition shrink-0"
          title="Attach PDF or Images"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask IndustrialGPT about manuals, SOPs, maintenance logs, or equipment..."
          className="w-full resize-none bg-transparent px-2 py-1.5 text-sm text-slate-100 placeholder-slate-500 outline-none max-h-32 min-h-[42px]"
          rows={1}
        />

        {isGenerating ? (
          <Button
            variant="ghost"
            onClick={onStopGeneration}
            className="p-2 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 shrink-0"
            title="Stop Response"
          >
            <Square className="h-4 w-4 fill-amber-400" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() && attachments.length === 0}
            className="p-2 text-xs shadow-glow shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
