import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDocuments } from './useDocuments';
import * as service from '../services/documentService';

vi.mock('../services/documentService', async () => {
  const actual = await vi.importActual<typeof import('../services/documentService')>('../services/documentService');
  return {
    ...actual,
    getDocuments: vi.fn().mockResolvedValue([]),
    createDocument: vi.fn().mockResolvedValue({ id: 'new-doc', title: 'Demo', status: 'processed' }),
    deleteDocument: vi.fn().mockResolvedValue({}),
    renameDocument: vi.fn().mockResolvedValue({ id: 'doc-1', title: 'Renamed' }),
    updateDocumentMetadata: vi.fn().mockResolvedValue({ id: 'doc-1', metadata: { owner: 'Ops' } }),
    downloadDocument: vi.fn().mockResolvedValue({ filename: 'demo.pdf' })
  };
});

describe('useDocuments', () => {
  it('submits uploads and tracks queue updates', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    const { result } = renderHook(() => useDocuments(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    const file = new File(['hello'], 'demo.pdf', { type: 'application/pdf' });
    const response = result.current.submitUploads({ files: [file] });

    expect(response.errors).toEqual([]);
    expect(result.current.uploadQueue).toHaveLength(1);

    await waitFor(() => {
      expect(result.current.uploadQueue[0]?.status).toBe('queued');
    });
  });

  it('renames a document optimistically', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useDocuments(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    await result.current.renameMutation.mutateAsync({ id: 'doc-1', title: 'Renamed' });
    expect(service.renameDocument).toHaveBeenCalled();
  });
});
