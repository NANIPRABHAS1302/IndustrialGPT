import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
};

export function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-glow backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
        </div>
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-cyan-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className={`mt-4 flex items-center gap-2 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}`}>
        {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
        <span>{change} vs last period</span>
      </div>
    </div>
  );
}
