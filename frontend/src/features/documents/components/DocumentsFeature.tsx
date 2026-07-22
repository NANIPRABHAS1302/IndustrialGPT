import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DocumentUploadPanel } from '@/features/documents/components/DocumentUploadPanel';
import { DocumentFilters } from '@/features/documents/components/DocumentFilters';
import { DocumentList } from '@/features/documents/components/DocumentList';
import { DocumentMetadataPanel } from '@/features/documents/components/DocumentMetadataPanel';
import { DocumentPreviewModal } from '@/features/documents/components/DocumentPreviewModal';
import { useDocuments } from '@/features/documents/hooks/useDocuments';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import type { DocumentItem } from '@/features/documents/types';

export function DocumentsFeature() {
  const {
    documents,
    allDocuments,
    allTags,
    filter,
    setFilter,
    uploadQueue,
    submitUploads,
    cancelUpload,
    retryUpload,
    clearQueue,
    selectedDocumentId,
    selectedDocument,
    setSelectedDocumentId,
    isLoading,
    isError,
    error,
    refetch,
    hasMorePages,
    loadMore,
    uploadMutation,
    deleteMutation,
    renameMutation,
    metadataMutation,
    downloadMutation
  } = useDocuments();

  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);

  const summary = useMemo(() => {
    const processed = allDocuments.filter((doc) => doc.status === 'processed').length;
    const processing = allDocuments.filter((doc) => doc.status === 'processing').length;
    return { total: allDocuments.length, processed, processing };
  }, [allDocuments]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card title="Document Library" subtitle="Loading enterprise knowledge base…">
          <div className="flex items-center gap-3 p-6 text-slate-300">
            <Spinner />
            <span>Preparing vector indexes and document workspace</span>
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Card title="Document Library" subtitle="Could not connect to document index">
          <div className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <span>{error instanceof Error ? error.message : 'Unable to load documents at this time.'}</span>
            </div>
            <Button variant="secondary" onClick={() => refetch()} className="text-xs">
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-blue-600/20 via-slate-900/70 to-cyan-500/20 p-6 shadow-glow"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Document Operations</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">Knowledge Base & Ingestion Workflows</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Upload SOPs, inspection logs, and technical manuals. Real-time OCR processing, metadata tagging, vector chunking, and PDF/Image previewing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
              <div className="flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4 text-cyan-400" />
                {summary.total} Documents • {summary.processed} Processed
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        {/* Left Column: Upload Panel & Library List */}
        <div className="space-y-6">
          <DocumentUploadPanel
            onBatchUpload={submitUploads}
            uploadQueue={uploadQueue}
            onCancelUpload={cancelUpload}
            onRetryUpload={retryUpload}
            onClearQueue={clearQueue}
            isUploading={uploadMutation.isPending}
          />

          <Card title="Document Library" subtitle="Search, filter, and inspect ingested assets">
            <div className="space-y-4">
              <DocumentFilters
                filter={filter}
                onFilterChange={setFilter}
                availableTags={allTags}
                totalResults={documents.length}
              />

              {documents.length > 0 ? (
                <DocumentList
                  documents={documents}
                  selectedId={selectedDocumentId}
                  onSelect={setSelectedDocumentId}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onRename={(id, title) => renameMutation.mutate({ id, title })}
                  onPreview={(doc) => setPreviewDocument(doc)}
                  onDownload={(doc) => downloadMutation.mutate(doc)}
                  hasMore={hasMorePages}
                  onLoadMore={loadMore}
                />
              ) : (
                <EmptyState
                  title="No matching documents found"
                  description="Try adjusting your keywords, selecting a different category, or uploading new material."
                  action={
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setFilter({
                          search: '',
                          status: 'all',
                          category: 'all',
                          tag: 'all',
                          sortBy: 'uploadedAt',
                          sortOrder: 'desc'
                        })
                      }
                    >
                      Reset Filters
                    </Button>
                  }
                />
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Metadata Panel & Version History */}
        <div>
          <DocumentMetadataPanel
            document={selectedDocument}
            onUpdateMetadata={(id, metadata) => metadataMutation.mutate({ id, metadata })}
            onPreview={(doc) => setPreviewDocument(doc)}
            onDownload={(doc) => downloadMutation.mutate(doc)}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        </div>
      </div>

      {/* Interactive PDF & Image Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        onClose={() => setPreviewDocument(null)}
        onDownload={(doc) => downloadMutation.mutate(doc)}
      />
    </div>
  );
}
