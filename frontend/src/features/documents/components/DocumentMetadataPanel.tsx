import { useState } from 'react';
import {
  FileText,
  Tag,
  Folder,
  History,
  Info,
  User,
  Globe,
  FileCheck,
  Download,
  Eye,
  Edit3,
  X,
  Check,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { DocumentItem, DocumentMetadata } from '@/features/documents/types';
import { formatFileSize } from '@/features/documents/services/documentService';

type DocumentMetadataPanelProps = {
  document: DocumentItem | null;
  onUpdateMetadata: (id: string, metadata: DocumentMetadata) => void;
  onPreview: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
};

export function DocumentMetadataPanel({
  document,
  onUpdateMetadata,
  onPreview,
  onDownload
}: DocumentMetadataPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState<DocumentMetadata>({});

  if (!document) {
    return (
      <Card title="Document Metadata & Details" subtitle="Inspect metadata and version history">
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <Info className="h-8 w-8 text-slate-600 mb-2" />
          <p className="text-sm">Select a document from the list to view metadata and version history.</p>
        </div>
      </Card>
    );
  }

  const handleStartEdit = () => {
    setFormData(document.metadata || {});
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateMetadata(document.id, formData);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    const tag = newTag.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (tag) {
      const currentTags = formData.tags || document.tags || [];
      if (!currentTags.includes(tag)) {
        setFormData({ ...formData, tags: [...currentTags, tag] });
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.tags || document.tags || [];
    setFormData({
      ...formData,
      tags: currentTags.filter((t) => t !== tagToRemove)
    });
  };

  return (
    <Card
      title="Document Details & Metadata"
      subtitle={`ID: ${document.id}`}
    >
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => onPreview(document)} className="text-xs px-2.5 py-1">
          <Eye className="h-3.5 w-3.5 mr-1" /> Preview
        </Button>
        <Button variant="ghost" onClick={() => onDownload(document)} className="text-xs px-2 py-1">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="space-y-6">
        {/* Document Header Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400 shrink-0" />
                <h3 className="text-base font-bold text-slate-100">{document.title}</h3>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {document.type} • {formatFileSize(document.sizeBytes)} • Uploaded {document.uploadedAt}
              </p>
            </div>
            <Badge tone={document.status === 'processed' ? 'success' : 'warning'}>
              {document.status}
            </Badge>
          </div>
        </div>

        {/* Editable Metadata Panel */}
        <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-cyan-400" /> Document Attributes
            </span>
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <Button variant="primary" onClick={handleSaveEdit} className="text-xs px-2.5 py-1">
                  <Check className="h-3.5 w-3.5 mr-1" /> Save
                </Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-xs px-2 py-1">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" onClick={handleStartEdit} className="text-xs px-2 py-1 text-cyan-400">
                <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit Metadata
              </Button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] text-slate-400 flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" /> Document Owner
              </label>
              {isEditing ? (
                <Input
                  value={formData.owner || ''}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="mt-1 py-1 text-xs"
                />
              ) : (
                <p className="mt-0.5 font-medium text-slate-200">{document.metadata?.owner || 'Unassigned'}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] text-slate-400 flex items-center gap-1">
                <Folder className="h-3 w-3 text-slate-400" /> Department
              </label>
              {isEditing ? (
                <Input
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1 py-1 text-xs"
                />
              ) : (
                <p className="mt-0.5 font-medium text-slate-200">{document.metadata?.department || 'General'}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] text-slate-400 flex items-center gap-1">
                <Globe className="h-3 w-3 text-slate-400" /> Language
              </label>
              {isEditing ? (
                <Input
                  value={formData.language || ''}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="mt-1 py-1 text-xs"
                />
              ) : (
                <p className="mt-0.5 font-medium text-slate-200">{document.metadata?.language || 'English'}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] text-slate-400 flex items-center gap-1">
                <FileCheck className="h-3 w-3 text-slate-400" /> Page Count
              </label>
              <p className="mt-0.5 font-medium text-slate-200">{document.metadata?.pageCount || 'N/A'}</p>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400">AI Summary</label>
            {isEditing ? (
              <textarea
                value={formData.summary || ''}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
                rows={2}
              />
            ) : (
              <p className="mt-0.5 text-slate-300 italic">{document.metadata?.summary || 'No summary available.'}</p>
            )}
          </div>

          {/* Tags editing */}
          <div>
            <label className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Tag className="h-3 w-3 text-cyan-400" /> Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {(isEditing ? formData.tags || [] : document.tags || []).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 font-medium"
                >
                  #{t}
                  {isEditing ? (
                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-slate-100">
                      &times;
                    </button>
                  ) : null}
                </span>
              ))}

              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="py-0.5 px-2 text-[10px] w-24"
                  />
                  <Button variant="ghost" onClick={handleAddTag} className="p-1 text-[10px]">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Version History List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <History className="h-4 w-4 text-cyan-400" /> Document Version History
            </span>
            <span className="text-slate-400">{(document.versionHistory || []).length} versions</span>
          </div>

          <div className="space-y-2">
            {(document.versionHistory || []).map((ver) => (
              <div
                key={ver.id}
                className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 text-xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300">Version {ver.version} - {ver.label}</span>
                  <span className="text-[10px] text-slate-400">{ver.changedAt} by {ver.changedBy}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{ver.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
