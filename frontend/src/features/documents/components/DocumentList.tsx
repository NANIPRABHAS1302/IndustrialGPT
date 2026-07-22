import React, { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  Edit2,
  Check,
  X,
  Eye,
  CheckCircle2,
  Clock,
  Tag,
  Folder,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { DocumentItem } from '@/features/documents/types';
import { formatFileSize } from '@/features/documents/services/documentService';

type DocumentListProps = {
  documents: DocumentItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onPreview: (document: DocumentItem) => void;
  onDownload: (document: DocumentItem) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export function DocumentList({
  documents,
  selectedId,
  onSelect,
  onDelete,
  onRename,
  onPreview,
  onDownload,
  hasMore = false,
  onLoadMore
}: DocumentListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(doc.id);
    setEditingTitle(doc.title);
  };

  const handleConfirmRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRename(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const isSelected = selectedId === doc.id;

        return (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onClick={() => onSelect(doc.id)}
            className={`group cursor-pointer rounded-2xl border p-4 transition ${
              isSelected
                ? 'border-cyan-400/60 bg-slate-900/90 shadow-glow'
                : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              {/* Left Column: Title & Metadata */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {editingId === doc.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename(doc.id, e as any)}
                        className="py-1 text-sm font-medium"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleConfirmRename(doc.id, e)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                        title="Save Title"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="p-1 text-slate-400 hover:text-slate-200"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-400 shrink-0" />
                      <h4 className="font-semibold text-slate-100 group-hover:text-cyan-200">
                        {doc.title}
                      </h4>
                      <button
                        onClick={(e) => handleStartRename(doc, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-200 transition"
                        title="Rename document"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Status Badge */}
                  <Badge
                    tone={
                      doc.status === 'processed'
                        ? 'success'
                        : doc.status === 'processing' || doc.status === 'uploading'
                        ? 'warning'
                        : doc.status === 'failed'
                        ? 'danger'
                        : 'default'
                    }
                  >
                    {doc.status}
                  </Badge>

                  {/* Category Pill */}
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                    <Folder className="h-3 w-3 text-cyan-400" />
                    {doc.category}
                  </span>
                </div>

                {/* Subtitle / File details */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>{doc.type}</span>
                  <span>•</span>
                  <span>{formatFileSize(doc.sizeBytes || 0)}</span>
                  <span>•</span>
                  <span>Uploaded {doc.uploadedAt}</span>
                  {doc.metadata?.owner ? (
                    <>
                      <span>•</span>
                      <span>By {doc.metadata.owner}</span>
                    </>
                  ) : null}
                </div>

                {/* Tags List */}
                {doc.tags && doc.tags.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {doc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* OCR Processing Status Timeline */}
                {doc.processingTimeline && doc.processingTimeline.length > 0 ? (
                  <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/70 p-2.5 text-xs">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-300">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-cyan-400" /> OCR Processing Status Timeline
                      </span>
                      {doc.progress !== undefined && doc.status === 'processing' ? (
                        <span className="text-cyan-400">{doc.progress}%</span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {doc.processingTimeline.map((step, idx) => (
                        <React.Fragment key={step.id}>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {step.status === 'completed' ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            ) : step.status === 'active' ? (
                              <Clock className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-slate-700" />
                            )}
                            <span
                              className={`text-[11px] ${
                                step.status === 'completed'
                                  ? 'text-slate-300 font-medium'
                                  : step.status === 'active'
                                  ? 'text-cyan-300 font-semibold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                          {idx < doc.processingTimeline.length - 1 ? (
                            <span className="text-slate-400 text-[10px]">→</span>
                          ) : null}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Right Column: Actions */}
              <div
                className="flex items-center gap-2 shrink-0 pt-2 md:pt-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="secondary" onClick={() => onPreview(doc)} className="text-xs px-3 py-1.5">
                  <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                </Button>

                <Button variant="ghost" onClick={() => onDownload(doc)} className="text-xs px-2.5 py-1.5">
                  <Download className="h-3.5 w-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => onDelete(doc.id)}
                  className="text-xs px-2.5 py-1.5 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Infinite Scroll / Load More Trigger */}
      {hasMore && onLoadMore ? (
        <div className="pt-2 text-center">
          <Button variant="secondary" onClick={onLoadMore} className="w-full text-xs">
            Load More Documents...
          </Button>
        </div>
      ) : null}
    </div>
  );
}
