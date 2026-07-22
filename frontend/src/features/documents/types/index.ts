export type DocumentStatus = 'processed' | 'processing' | 'failed' | 'queued' | 'uploading' | 'cancelled';

export type DocumentCategory = 'Compliance' | 'Operations' | 'Engineering' | 'Finance' | 'HR' | 'Other' | 'General';

export type DocumentMetadata = {
  owner?: string;
  source?: string;
  department?: string;
  summary?: string;
  language?: string;
  tags?: string[];
  category?: DocumentCategory;
  checksum?: string;
  pageCount?: number;
};

export type DocumentTimelineEntry = {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
  at: string;
};

export type DocumentVersion = {
  id: string;
  version: string;
  label: string;
  changedAt: string;
  changedBy: string;
  summary: string;
};

export type DocumentFilter = {
  search: string;
  status: DocumentStatus | 'all';
  category: DocumentCategory | 'all';
  tag: string | 'all';
  sortBy: 'uploadedAt' | 'title' | 'status' | 'size';
  sortOrder: 'asc' | 'desc';
};

export type DocumentItem = {
  id: string;
  title: string;
  type: string;
  size: string;
  sizeBytes: number;
  uploadedAt: string;
  status: DocumentStatus;
  progress?: number;
  mimeType?: string;
  previewType?: 'pdf' | 'image' | 'text' | 'unknown';
  previewUrl?: string;
  downloadUrl?: string;
  tags: string[];
  category: DocumentCategory;
  metadata: DocumentMetadata;
  processingTimeline: DocumentTimelineEntry[];
  versionHistory: DocumentVersion[];
};

export type UploadQueueItem = {
  id: string;
  file: File;
  title: string;
  status: 'queued' | 'uploading' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  error?: string;
  abortController?: AbortController;
  tags?: string[];
  category?: DocumentCategory;
  metadata?: DocumentMetadata;
};
