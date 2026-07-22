import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { DocumentCategory, DocumentItem, DocumentMetadata } from '@/features/documents/types';

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB
export const ACCEPTED_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/webp'
]);

const fallbackDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Annual Compliance & Safety Report',
    type: 'PDF',
    size: '2.4 MB',
    sizeBytes: 2_400_000,
    uploadedAt: '2026-07-21 09:10',
    status: 'processed',
    mimeType: 'application/pdf',
    previewType: 'pdf',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tags: ['compliance', 'safety', 'audit'],
    category: 'Compliance',
    metadata: {
      owner: 'Sarah Jenkins',
      source: 'S3 Archive',
      department: 'Safety & EH&S',
      summary: 'Annual overview of plant compliance, environmental standards, and safety audits.',
      language: 'English',
      tags: ['compliance', 'safety', 'audit'],
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      pageCount: 42
    },
    processingTimeline: [
      { id: 'ocr', label: 'OCR & Layout Extraction', status: 'completed', at: '09:10:12' },
      { id: 'chunking', label: 'Semantic Chunking & Embedding', status: 'completed', at: '09:10:45' },
      { id: 'index', label: 'Vector & Knowledge Graph Indexing', status: 'completed', at: '09:11:05' }
    ],
    versionHistory: [
      { id: 'v2', version: '2.0', label: 'Annual Update', changedAt: '2026-07-21', changedBy: 'Sarah Jenkins', summary: 'Added Q4 audit stats.' },
      { id: 'v1', version: '1.0', label: 'Initial upload', changedAt: '2026-06-10', changedBy: 'System', summary: 'Initial ingestion.' }
    ]
  },
  {
    id: 'doc-2',
    title: 'Turbine Hydraulic Maintenance SOP',
    type: 'PDF',
    size: '4.8 MB',
    sizeBytes: 4_800_000,
    uploadedAt: '2026-07-22 10:15',
    status: 'processing',
    progress: 78,
    mimeType: 'application/pdf',
    previewType: 'pdf',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tags: ['maintenance', 'turbine', 'sop'],
    category: 'Engineering',
    metadata: {
      owner: 'Alex Rivera',
      source: 'Field Tablet',
      department: 'Mechanical Maintenance',
      summary: 'Step-by-step Standard Operating Procedure for hydraulic fluid flush and turbine seal replacement.',
      language: 'English',
      tags: ['maintenance', 'turbine', 'sop'],
      checksum: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      pageCount: 18
    },
    processingTimeline: [
      { id: 'upl', label: 'File Validation & Hash Check', status: 'completed', at: '10:15:02' },
      { id: 'ocr', label: 'Tesseract OCR Pipeline', status: 'active', at: '10:15:10' },
      { id: 'kg', label: 'Neo4j Asset Mapping', status: 'pending', at: '10:15:30' }
    ],
    versionHistory: [
      { id: 'v1', version: '1.0', label: 'Draft Release', changedAt: '2026-07-22', changedBy: 'Alex Rivera', summary: 'Uploaded from plant maintenance portal.' }
    ]
  },
  {
    id: 'doc-3',
    title: 'Factory Floor Inspection Blueprint',
    type: 'Image',
    size: '1.8 MB',
    sizeBytes: 1_800_000,
    uploadedAt: '2026-07-20 14:30',
    status: 'processed',
    mimeType: 'image/png',
    previewType: 'image',
    previewUrl: 'https://picsum.photos/1200/800',
    tags: ['blueprint', 'floor-plan', 'inspection'],
    category: 'Operations',
    metadata: {
      owner: 'David Chen',
      source: 'CAD Export',
      department: 'Facilities',
      summary: 'High resolution schematic blueprint of Substation B and conveyor lines.',
      language: 'N/A',
      tags: ['blueprint', 'floor-plan', 'inspection'],
      checksum: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
    },
    processingTimeline: [
      { id: 'ocr', label: 'PaddleOCR Feature Detection', status: 'completed', at: '14:30:05' },
      { id: 'vector', label: 'Multimodal Vector Embedding', status: 'completed', at: '14:30:22' }
    ],
    versionHistory: [
      { id: 'v1', version: '1.0', label: 'Final CAD Render', changedAt: '2026-07-20', changedBy: 'David Chen', summary: 'Uploaded blueprint map.' }
    ]
  }
];

export function formatFileSize(sizeBytes: number): string {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (sizeBytes >= 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }
  return `${sizeBytes} B`;
}

export function getDocumentTypeLabel(file: File): string {
  if (file.type.includes('pdf')) return 'PDF';
  if (file.type.includes('word') || file.name.endsWith('.docx')) return 'DOCX';
  if (file.type.includes('image')) return 'Image';
  if (file.type.includes('csv')) return 'CSV';
  if (file.type.includes('text')) return 'Text';
  return file.name.split('.').pop()?.toUpperCase() ?? 'File';
}

export function getPreviewType(mimeType?: string, fileName?: string): 'pdf' | 'image' | 'text' | 'unknown' {
  const type = mimeType || '';
  const name = (fileName || '').toLowerCase();
  if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
  if (type.includes('image') || /\.(png|jpe?g|webp|gif|svg)$/.test(name)) return 'image';
  if (type.includes('text') || type.includes('csv') || /\.(txt|csv|json|md)$/.test(name)) return 'text';
  return 'unknown';
}

export function isSupportedDocumentType(file: File): boolean {
  return ACCEPTED_TYPES.has(file.type) || file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.csv');
}

export function validateUploadFiles(files: File[], existingDocuments: Array<Pick<DocumentItem, 'title' | 'sizeBytes'>> = []) {
  const errors: string[] = [];
  const validFiles: File[] = [];
  const duplicates: string[] = [];

  const seenInBatch = new Set<string>();

  files.forEach((file) => {
    const normalizedName = file.name.toLowerCase();
    const isDuplicateInDb = existingDocuments.some((doc) => doc.title.toLowerCase() === normalizedName);
    const isDuplicateInBatch = seenInBatch.has(normalizedName);

    if (isDuplicateInDb || isDuplicateInBatch) {
      duplicates.push(file.name);
      errors.push(`Duplicate file detected: "${file.name}" already exists.`);
      return;
    }

    if (!isSupportedDocumentType(file)) {
      errors.push(`Unsupported file type for "${file.name}". Supported: PDF, DOCX, TXT, CSV, PNG, JPG, WEBP.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`File "${file.name}" exceeds maximum allowed size of 25MB.`);
      return;
    }

    seenInBatch.add(normalizedName);
    validFiles.push(file);
  });

  return { validFiles, errors, duplicates };
}

export async function getDocuments(): Promise<DocumentItem[]> {
  try {
    const response = await apiClient.get<DocumentItem[]>(endpoints.documents);
    return response.data;
  } catch (error) {
    console.warn('Falling back to seeded document library.', error);
    return fallbackDocuments;
  }
}

export async function createDocument(
  file: File,
  title: string,
  options?: {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
    tags?: string[];
    category?: DocumentCategory;
    metadata?: DocumentMetadata;
  }
): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('category', options?.category ?? 'General');
  formData.append('tags', JSON.stringify(options?.tags ?? []));
  formData.append('metadata', JSON.stringify(options?.metadata ?? {}));

  try {
    const response = await apiClient.post<DocumentItem>(endpoints.documents, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal: options?.signal,
      onUploadProgress: (event) => {
        if (event.total) {
          const progress = Math.round((event.loaded / event.total) * 100);
          options?.onProgress?.(progress);
        }
      }
    });
    return response.data;
  } catch (error) {
    console.warn('API mock fallback for createDocument', error);
    // Simulating server processing delay and returning complete DocumentItem
    await new Promise((res) => setTimeout(res, 800));
    return {
      id: `doc-${Date.now()}`,
      title,
      type: getDocumentTypeLabel(file),
      size: formatFileSize(file.size),
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'processed',
      mimeType: file.type,
      previewType: getPreviewType(file.type, file.name),
      previewUrl: file.type.includes('image')
        ? URL.createObjectURL(file)
        : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tags: options?.tags?.length ? options.tags : ['manual', 'uploaded'],
      category: options?.category ?? 'General',
      metadata: {
        owner: 'Current User',
        source: 'Direct Upload',
        summary: `Extracted content from ${file.name}`,
        tags: options?.tags ?? [],
        category: options?.category ?? 'General',
        ...options?.metadata
      },
      processingTimeline: [
        { id: 'upl', label: 'File Upload & Security Scan', status: 'completed', at: 'Just now' },
        { id: 'ocr', label: 'OCR & Text Extraction', status: 'completed', at: 'Just now' },
        { id: 'vec', label: 'Vector Indexing', status: 'completed', at: 'Just now' }
      ],
      versionHistory: [
        { id: 'v1', version: '1.0', label: 'Initial upload', changedAt: new Date().toISOString().slice(0, 10), changedBy: 'Current User', summary: 'Original uploaded version.' }
      ]
    };
  }
}

export async function renameDocument(id: string, title: string): Promise<DocumentItem> {
  try {
    const response = await apiClient.patch<DocumentItem>(`${endpoints.documents}/${id}`, { title });
    return response.data;
  } catch (error) {
    console.warn('Fallback rename execution', error);
    return { id, title } as DocumentItem;
  }
}

export async function updateDocumentMetadata(id: string, metadata: DocumentMetadata): Promise<DocumentItem> {
  try {
    const response = await apiClient.patch<DocumentItem>(`${endpoints.documents}/${id}`, { metadata });
    return response.data;
  } catch (error) {
    console.warn('Fallback metadata update execution', error);
    return { id, metadata } as DocumentItem;
  }
}

export async function deleteDocument(id: string): Promise<{ success: boolean; id: string }> {
  try {
    const response = await apiClient.delete(`${endpoints.documents}/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Fallback delete execution', error);
    return { success: true, id };
  }
}

export async function downloadDocument(document: DocumentItem) {
  try {
    const response = await apiClient.get(`${endpoints.documents}/${document.id}/download`, {
      responseType: 'blob'
    });
    const blob = response.data as Blob;
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title}.${document.type.toLowerCase()}`;
    link.click();
    window.URL.revokeObjectURL(url);
    return { blob, filename: link.download };
  } catch (error) {
    console.warn('Fallback dummy file download trigger', error);
    const dummyContent = `IndustrialGPT Document Content\nTitle: ${document.title}\nID: ${document.id}\nCategory: ${document.category}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    return { blob, filename: `${document.title}.txt` };
  }
}
