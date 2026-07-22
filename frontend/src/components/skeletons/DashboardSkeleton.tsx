export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-40 animate-pulse rounded-3xl border border-slate-800/80 bg-slate-900/70" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/70" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="h-64 animate-pulse rounded-3xl border border-slate-800/80 bg-slate-900/70" />
        <div className="h-64 animate-pulse rounded-3xl border border-slate-800/80 bg-slate-900/70" />
      </div>
    </div>
  );
}
