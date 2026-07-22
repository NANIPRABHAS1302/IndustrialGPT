import { Search, Tag, ArrowUpDown, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { DocumentCategory, DocumentFilter, DocumentStatus } from '@/features/documents/types';

type DocumentFiltersProps = {
  filter: DocumentFilter;
  onFilterChange: (filter: DocumentFilter) => void;
  availableTags?: string[];
  totalResults?: number;
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

const STATUSES: Array<{ label: string; value: DocumentStatus | 'all' }> = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Processed', value: 'processed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Queued', value: 'queued' },
  { label: 'Failed', value: 'failed' }
];

export function DocumentFilters({
  filter,
  onFilterChange,
  availableTags = [],
  totalResults
}: DocumentFiltersProps) {
  const isFiltered =
    filter.search !== '' ||
    filter.status !== 'all' ||
    filter.category !== 'all' ||
    filter.tag !== 'all' ||
    filter.sortBy !== 'uploadedAt';

  const resetFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      category: 'all',
      tag: 'all',
      sortBy: 'uploadedAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Input
            placeholder="Search by title, owner, summary, department, or tags..."
            value={filter.search}
            onChange={(event) => onFilterChange({ ...filter, search: event.target.value })}
            className="pl-10 text-sm"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          {filter.search ? (
            <button
              onClick={() => onFilterChange({ ...filter, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Select */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200">
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <select
              className="bg-transparent font-medium text-slate-200 outline-none"
              value={filter.category}
              onChange={(e) =>
                onFilterChange({ ...filter, category: e.target.value as DocumentCategory | 'all' })
              }
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200">
            <Filter className="h-3.5 w-3.5 text-cyan-400" />
            <select
              className="bg-transparent font-medium text-slate-200 outline-none"
              value={filter.status}
              onChange={(e) =>
                onFilterChange({ ...filter, status: e.target.value as DocumentStatus | 'all' })
              }
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value} className="bg-slate-900 text-slate-200">
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200">
              <Tag className="h-3.5 w-3.5 text-cyan-400" />
              <select
                className="bg-transparent font-medium text-slate-200 outline-none"
                value={filter.tag}
                onChange={(e) => onFilterChange({ ...filter, tag: e.target.value })}
              >
                <option value="all" className="bg-slate-900 text-slate-200">All Tags</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag} className="bg-slate-900 text-slate-200">
                    #{tag}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {/* Sort By */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-200">
            <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
            <select
              className="bg-transparent font-medium text-slate-200 outline-none"
              value={filter.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  sortBy: e.target.value as DocumentFilter['sortBy']
                })
              }
            >
              <option value="uploadedAt" className="bg-slate-900 text-slate-200">Date Uploaded</option>
              <option value="title" className="bg-slate-900 text-slate-200">Name / Title</option>
              <option value="size" className="bg-slate-900 text-slate-200">File Size</option>
              <option value="status" className="bg-slate-900 text-slate-200">Processing Status</option>
            </select>
            <button
              onClick={() =>
                onFilterChange({
                  ...filter,
                  sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc'
                })
              }
              title={`Sort ${filter.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              className="ml-1 font-bold text-cyan-400 hover:text-cyan-200"
            >
              {filter.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Reset button */}
          {isFiltered ? (
            <Button variant="ghost" onClick={resetFilters} className="text-xs text-slate-400 hover:text-slate-100">
              Reset Filters
            </Button>
          ) : null}
        </div>
      </div>

      {totalResults !== undefined ? (
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-slate-200">{totalResults}</span> matching documents
        </div>
      ) : null}
    </div>
  );
}
