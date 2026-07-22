import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  XCircle,
  RotateCcw,
  CheckCircle2,
  Tag,
  FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { formatFileSize } from '@/features/documents/services/documentService';
import type { DocumentCategory, UploadQueueItem } from '@/features/documents/types';

type DocumentUploadPanelProps = {
  onBatchUpload: (payload: {
    files: File[];
    tags?: string[];
    category?: DocumentCategory;
  }) => { errors: string[]; validFiles: File[] };
  uploadQueue: UploadQueueItem[];
  onCancelUpload: (id: string) => void;
  onRetryUpload: (item: UploadQueueItem) => void;
  onClearQueue?: () => void;
  isUploading?: boolean;
};

const CATEGORIES: DocumentCategory[] = [
  'Compliance',
  'Operations',
  'Engineering',
  'Finance',
  'HR',
  'Other',
  'General'
];

export function DocumentUploadPanel({
  onBatchUpload,
  uploadQueue,
  onCancelUpload,
  onRetryUpload,
  onClearQueue
}: DocumentUploadPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('General');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['sop', 'industrial']);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setValidationErrors([]);
      if (!acceptedFiles.length) return;

      const { errors } = onBatchUpload({
        files: acceptedFiles,
        tags,
        category: selectedCategory
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
      }
    },
    [onBatchUpload, tags, selectedCategory]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp']
    },
    multiple: true
  });

  return (
    <Card title="Document Ingestion & Upload" subtitle="Multi-file upload queue, automatic OCR & vector indexing">
      <div className="space-y-5">
        {/* Category & Tags Configuration bar */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-300">
              <FolderPlus className="h-3.5 w-3.5 text-cyan-400" /> Target Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DocumentCategory)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-100 outline-none focus:border-cyan-400"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-300">
              <Tag className="h-3.5 w-3.5 text-cyan-400" /> Default Tags
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag (e.g. turbine)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="py-1 text-xs"
              />
              <Button variant="secondary" onClick={handleAddTag} type="button" className="px-3 text-xs">
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Tag pills */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-medium text-cyan-300"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-slate-100"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        ) : null}

        {/* Drag & Drop Animated Target */}
        <div {...getRootProps()}>
          <motion.div
            animate={{
              scale: isDragActive ? 1.02 : 1,
              borderColor: isDragActive ? '#22d3ee' : '#334155'
            }}
            transition={{ duration: 0.15 }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition ${
              isDragActive ? 'border-cyan-400 bg-cyan-500/15 shadow-glow' : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ y: isDragActive ? -6 : 0 }}
              transition={{ repeat: isDragActive ? Infinity : 0, repeatType: 'reverse', duration: 0.6 }}
            >
              <UploadCloud className={`h-10 w-10 ${isDragActive ? 'text-cyan-300' : 'text-slate-400'}`} />
            </motion.div>
            <p className="mt-3 text-sm font-semibold text-slate-100">
              {isDragActive ? 'Drop documents to process' : 'Drag & drop multiple documents here'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Supports PDF, DOCX, TXT, CSV, PNG, JPG & WEBP up to <span className="font-semibold text-slate-200">25MB each</span>
            </p>
          </motion.div>
        </div>

        {/* Validation Errors Notice */}
        {validationErrors.length > 0 ? (
          <div className="space-y-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Upload Warnings / Errors:
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Active Upload Queue with Progress Bars */}
        {uploadQueue.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Upload Queue ({uploadQueue.length})</span>
              {onClearQueue ? (
                <button
                  type="button"
                  onClick={onClearQueue}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Clear Completed
                </button>
              ) : null}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              <AnimatePresence>
                {uploadQueue.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/90 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 shrink-0 text-cyan-400" />
                        <span className="truncate font-medium text-slate-200">{item.title}</span>
                        <span className="shrink-0 text-slate-400">({formatFileSize(item.file.size)})</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'completed' ? (
                          <span className="flex items-center gap-1 font-medium text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </span>
                        ) : item.status === 'uploading' ? (
                          <button
                            type="button"
                            onClick={() => onCancelUpload(item.id)}
                            className="flex items-center gap-1 text-slate-400 hover:text-amber-400"
                            title="Cancel Upload"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Cancel
                          </button>
                        ) : item.status === 'failed' || item.status === 'cancelled' ? (
                          <button
                            type="button"
                            onClick={() => onRetryUpload(item)}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 font-medium"
                            title="Retry Upload"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Retry
                          </button>
                        ) : (
                          <span className="text-slate-400">Queued</span>
                        )}
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    {item.status === 'uploading' || item.status === 'completed' ? (
                      <div className="mt-2.5">
                        <div className="flex justify-between pb-1 text-[10px] text-slate-400">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                          <motion.div
                            className={`h-full ${item.status === 'completed' ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {item.error ? (
                      <p className="mt-1.5 text-[11px] text-amber-400">{item.error}</p>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
