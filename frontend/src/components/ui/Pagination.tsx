type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`rounded-lg px-3 py-2 text-sm ${page === index + 1 ? 'bg-blue-600 text-white' : 'bg-slate-800/80 text-slate-300'}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
