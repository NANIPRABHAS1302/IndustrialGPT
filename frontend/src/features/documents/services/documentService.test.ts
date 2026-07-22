import { describe, it, expect } from 'vitest';
import {
  validateUploadFiles,
  formatFileSize,
  getDocumentTypeLabel,
  getPreviewType
} from '../services/documentService';

describe('Document Service Utility Tests', () => {
  it('formats file sizes accurately', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1500)).toBe('1.5 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('determines document type labels correctly', () => {
    const pdfFile = new File([''], 'sop.pdf', { type: 'application/pdf' });
    const docxFile = new File([''], 'manual.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const imgFile = new File([''], 'blueprint.png', { type: 'image/png' });

    expect(getDocumentTypeLabel(pdfFile)).toBe('PDF');
    expect(getDocumentTypeLabel(docxFile)).toBe('DOCX');
    expect(getDocumentTypeLabel(imgFile)).toBe('Image');
  });

  it('detects preview kinds accurately', () => {
    expect(getPreviewType('application/pdf', 'file.pdf')).toBe('pdf');
    expect(getPreviewType('image/png', 'photo.png')).toBe('image');
    expect(getPreviewType('text/plain', 'notes.txt')).toBe('text');
  });

  it('validates upload files for duplicates, types, and max size limits', () => {
    const validPdf = new File(['dummy content'], 'report.pdf', { type: 'application/pdf' });
    const duplicatePdf = new File(['dummy content'], 'report.pdf', { type: 'application/pdf' });
    const unsupportedExe = new File(['dummy'], 'malware.exe', { type: 'application/x-msdownload' });

    const existingDocs = [{ title: 'report.pdf', sizeBytes: 100 }];

    const result = validateUploadFiles([validPdf, duplicatePdf, unsupportedExe], existingDocs);

    expect(result.validFiles).toHaveLength(0);
    expect(result.duplicates).toContain('report.pdf');
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Duplicate file detected'),
        expect.stringContaining('Unsupported file type')
      ])
    );
  });
});
