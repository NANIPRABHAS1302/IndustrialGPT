import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDocument,
  deleteDocument,
  downloadDocument,
  getDocuments,
  renameDocument,
  updateDocumentMetadata,
  validateUploadFiles
} from '@/features/documents/services/documentService';
import type { DocumentCategory, DocumentFilter, DocumentItem, DocumentMetadata, UploadQueueItem } from '@/features/documents/types';

const INITIAL_FILTER: DocumentFilter = {
  search: '',
  status: 'all',
  category: 'all',
  tag: 'all',
  sortBy: 'uploadedAt',
  sortOrder: 'desc'
};

const ITEMS_PER_PAGE = 5;

export function useDocuments() {
  const [filter, setFilter] = useState<DocumentFilter>(INITIAL_FILTER);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Fetch documents with React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
    staleTime: 30_000
  });

  const documents = useMemo(() => (data ?? []) as DocumentItem[], [data]);

  // Extract all unique tags across documents
  const allTags = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((doc) => {
      (doc.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [documents]);

  // Filtering & Sorting
  const filteredDocuments = useMemo(() => {
    const next = documents.filter((document) => {
      const searchLower = filter.search.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        document.title.toLowerCase().includes(searchLower) ||
        (document.metadata?.summary || '').toLowerCase().includes(searchLower) ||
        (document.metadata?.owner || '').toLowerCase().includes(searchLower) ||
        (document.metadata?.department || '').toLowerCase().includes(searchLower) ||
        document.tags.some((t) => t.toLowerCase().includes(searchLower));

      const matchesStatus = filter.status === 'all' || document.status === filter.status;
      const matchesCategory = filter.category === 'all' || document.category === filter.category;
      const matchesTag = filter.tag === 'all' || document.tags.includes(filter.tag);

      return matchesSearch && matchesStatus && matchesCategory && matchesTag;
    });

    next.sort((left, right) => {
      const direction = filter.sortOrder === 'asc' ? 1 : -1;
      let leftValue: string | number = '';
      let rightValue: string | number = '';

      if (filter.sortBy === 'size') {
        leftValue = left.sizeBytes || 0;
        rightValue = right.sizeBytes || 0;
      } else if (filter.sortBy === 'title') {
        leftValue = left.title.toLowerCase();
        rightValue = right.title.toLowerCase();
      } else if (filter.sortBy === 'status') {
        leftValue = left.status;
        rightValue = right.status;
      } else {
        leftValue = left.uploadedAt;
        rightValue = right.uploadedAt;
      }

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return (leftValue - rightValue) * direction;
      }
      return String(leftValue).localeCompare(String(rightValue)) * direction;
    });

    return next;
  }, [documents, filter]);

  // Paginated subset
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE) || 1;
  const paginatedDocuments = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(0, startIndex + ITEMS_PER_PAGE);
  }, [filteredDocuments, page]);

  const hasMorePages = paginatedDocuments.length < filteredDocuments.length;

  const loadMore = useCallback(() => {
    if (hasMorePages) {
      setPage((prev) => prev + 1);
    }
  }, [hasMorePages]);

  // Auto-select first document if none selected or invalid
  useEffect(() => {
    if (!documents.length) return;
    if (!selectedDocumentId || !documents.some((doc) => doc.id === selectedDocumentId)) {
      setSelectedDocumentId(documents[0].id);
    }
  }, [documents, selectedDocumentId]);

  // Currently selected document instance
  const selectedDocument = useMemo(() => {
    return documents.find((doc) => doc.id === selectedDocumentId) || null;
  }, [documents, selectedDocumentId]);

  // Upload Mutation with Optimistic Updates
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      title,
      tags,
      category,
      metadata,
      onProgress,
      signal
    }: {
      file: File;
      title: string;
      tags?: string[];
      category?: DocumentCategory;
      metadata?: DocumentMetadata;
      onProgress?: (progress: number) => void;
      signal?: AbortSignal;
    }) => {
      return createDocument(file, title, { tags, category, metadata, onProgress, signal });
    },
    onSuccess: (createdDocument) => {
      queryClient.setQueryData<DocumentItem[]>(['documents'], (current = []) => {
        const filtered = current.filter((doc) => doc.id !== createdDocument.id);
        return [createdDocument, ...filtered];
      });
      setSelectedDocumentId(createdDocument.id);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  // Delete Mutation with Optimistic Update
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      queryClient.setQueryData<DocumentItem[]>(['documents'], (current = []) =>
        current.filter((doc) => doc.id !== id)
      );
      return deleteDocument(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  // Rename Mutation with Optimistic Update
  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameDocument(id, title),
    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey: ['documents'] });
      const previousDocuments = queryClient.getQueryData<DocumentItem[]>(['documents']);

      queryClient.setQueryData<DocumentItem[]>(['documents'], (current = []) =>
        current.map((doc) => (doc.id === id ? { ...doc, title } : doc))
      );

      return { previousDocuments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(['documents'], context.previousDocuments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  // Metadata update mutation
  const metadataMutation = useMutation({
    mutationFn: ({ id, metadata }: { id: string; metadata: DocumentMetadata }) =>
      updateDocumentMetadata(id, metadata),
    onMutate: async ({ id, metadata }) => {
      await queryClient.cancelQueries({ queryKey: ['documents'] });
      const previousDocuments = queryClient.getQueryData<DocumentItem[]>(['documents']);

      queryClient.setQueryData<DocumentItem[]>(['documents'], (current = []) =>
        current.map((doc) =>
          doc.id === id ? { ...doc, metadata: { ...doc.metadata, ...metadata } } : doc
        )
      );
      return { previousDocuments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(['documents'], context.previousDocuments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: (doc: DocumentItem) => downloadDocument(doc)
  });

  // Queue-based Batch Upload Handler
  const submitUploads = ({
    files,
    tags,
    category,
    metadata
  }: {
    files: File[];
    tags?: string[];
    category?: DocumentCategory;
    metadata?: DocumentMetadata;
  }) => {
    const validation = validateUploadFiles(files, documents);

    if (validation.errors.length > 0 && validation.validFiles.length === 0) {
      return { errors: validation.errors, validFiles: [] };
    }

    const nextItems: UploadQueueItem[] = validation.validFiles.map((file, idx) => {
      const abortController = new AbortController();
      return {
        id: `queue-${Date.now()}-${idx}-${file.name}`,
        file,
        title: file.name.replace(/\.[^/.]+$/, ''),
        status: 'queued' as const,
        progress: 0,
        abortController,
        tags,
        category,
        metadata
      };
    });

    setUploadQueue((current) => [...current, ...nextItems]);

    // Process queued uploads asynchronously
    nextItems.forEach((item, index) => {
      setTimeout(() => {
        setUploadQueue((current) =>
          current.map((e) => (e.id === item.id ? { ...e, status: 'uploading', progress: 10 } : e))
        );

        uploadMutation.mutate(
          {
            file: item.file,
            title: item.title,
            tags: item.tags,
            category: item.category,
            metadata: item.metadata,
            signal: item.abortController?.signal,
            onProgress: (progress) => {
              setUploadQueue((current) =>
                current.map((e) => (e.id === item.id ? { ...e, progress } : e))
              );
            }
          },
          {
            onSuccess: () => {
              setUploadQueue((current) =>
                current.map((e) =>
                  e.id === item.id ? { ...e, status: 'completed', progress: 100 } : e
                )
              );
            },
            onError: (err) => {
              if (item.abortController?.signal.aborted) {
                setUploadQueue((current) =>
                  current.map((e) => (e.id === item.id ? { ...e, status: 'cancelled', progress: 0 } : e))
                );
              } else {
                setUploadQueue((current) =>
                  current.map((e) =>
                    e.id === item.id
                      ? { ...e, status: 'failed', error: err instanceof Error ? err.message : 'Upload failed' }
                      : e
                  )
                );
              }
            }
          }
        );
      }, index * 400);
    });

    return { errors: validation.errors, validFiles: validation.validFiles };
  };

  const cancelUpload = (id: string) => {
    setUploadQueue((current) =>
      current.map((item) => {
        if (item.id === id) {
          item.abortController?.abort();
          return { ...item, status: 'cancelled', progress: 0 };
        }
        return item;
      })
    );
  };

  const retryUpload = (item: UploadQueueItem) => {
    const newController = new AbortController();
    setUploadQueue((current) =>
      current.map((e) =>
        e.id === item.id
          ? { ...e, status: 'uploading', progress: 10, error: undefined, abortController: newController }
          : e
      )
    );

    uploadMutation.mutate(
      {
        file: item.file,
        title: item.title,
        tags: item.tags,
        category: item.category,
        metadata: item.metadata,
        signal: newController.signal,
        onProgress: (progress) => {
          setUploadQueue((current) =>
            current.map((e) => (e.id === item.id ? { ...e, progress } : e))
          );
        }
      },
      {
        onSuccess: () => {
          setUploadQueue((current) =>
            current.map((e) => (e.id === item.id ? { ...e, status: 'completed', progress: 100 } : e))
          );
        },
        onError: (err) => {
          setUploadQueue((current) =>
            current.map((e) =>
              e.id === item.id
                ? { ...e, status: 'failed', error: err instanceof Error ? err.message : 'Retry failed' }
                : e
            )
          );
        }
      }
    );
  };

  const clearQueue = () => {
    setUploadQueue((current) => current.filter((item) => item.status === 'uploading' || item.status === 'queued'));
  };

  return {
    documents: paginatedDocuments,
    allDocuments: filteredDocuments,
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
    page,
    totalPages,
    hasMorePages,
    loadMore,
    uploadMutation,
    deleteMutation,
    renameMutation,
    metadataMutation,
    downloadMutation
  };
}
