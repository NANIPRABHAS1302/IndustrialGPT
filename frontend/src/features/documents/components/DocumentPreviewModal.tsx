import { X, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { DocumentItem } from '@/features/documents/types';
import { getPreviewType } from '@/features/documents/services/documentService';

type DocumentPreviewModalProps = {
  document: DocumentItem | null;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
};

export function DocumentPreviewModal({
  document,
  onClose,
  onDownload
}: DocumentPreviewModalProps) {
  if (!document) return null;

  const previewKind = getPreviewType(document.mimeType, document.title);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex h-[85vh] w-full max-w-5xl flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
            <div className="flex items-center gap-3">
              {previewKind === 'image' ? (
                <ImageIcon className="h-5 w-5 text-cyan-400" />
              ) : (
                <FileText className="h-5 w-5 text-cyan-400" />
              )}
              <div>
                <h3 className="font-bold text-slate-100">{document.title}</h3>
                <p className="text-xs text-slate-400">
                  {document.type} • {document.size} • Category: {document.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => onDownload(document)} className="text-xs">
                <Download className="h-4 w-4 mr-1.5" /> Download
              </Button>
              <Button variant="ghost" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-100">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Body Viewer */}
          <div className="flex-1 overflow-hidden bg-slate-950 flex items-center justify-center p-4">
            {previewKind === 'pdf' ? (
              <iframe
                src={document.previewUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                title={document.title}
                className="h-full w-full rounded-xl border border-slate-800"
              />
            ) : previewKind === 'image' ? (
              <div className="flex h-full w-full items-center justify-center overflow-auto">
                <img
                  src={document.previewUrl || 'https://picsum.photos/1200/800'}
                  alt={document.title}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-lg"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <FileText className="h-12 w-12 text-slate-600 mb-3" />
                <p className="text-base font-semibold text-slate-200">Text & Structured Data Preview</p>
                <p className="mt-1 text-sm max-w-md">
                  {document.metadata?.summary || 'Standard document text stream extracted and ready for vector RAG.'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
