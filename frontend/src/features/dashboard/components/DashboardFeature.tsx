import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ArrowUpRight, Clock3, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { stats as fallbackStats, recentActivity as fallbackActivity, equipmentHealth as fallbackEquipment } from '@/constants/dashboard';

export function DashboardFeature() {
  const { stats, activity, equipment, loading, error } = useDashboardData();

  const dashboardStats = stats.length > 0 ? stats : fallbackStats;
  const dashboardActivity = activity.length > 0 ? activity : fallbackActivity;
  const dashboardEquipment = equipment.length > 0 ? equipment : fallbackEquipment;

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-8 text-center text-amber-200">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-blue-600/20 via-slate-900/70 to-cyan-500/20 p-6 shadow-glow"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Operations Command Center</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50">Industrial AI insights at a glance</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">Monitor equipment health, predict maintenance needs, and keep your plant operating with confidence.</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Streaming live telemetry connected
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon === 'Factory' ? Activity : stat.icon === 'AlertTriangle' ? AlertTriangle : stat.icon === 'TrendingUp' ? TrendingUp : Clock3}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card title="Recent activity" subtitle="Live updates from maintenance and document processing">
          <div className="space-y-3">
            {dashboardActivity.map((item) => (
              <div key={item.id} className="flex items-start justify-between rounded-2xl border border-slate-800/70 bg-slate-950/60 p-3">
                <div>
                  <p className="text-sm font-medium text-slate-100">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{item.time}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${item.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : item.status === 'Review' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Equipment health" subtitle="Critical assets under AI monitoring">
          <div className="space-y-4">
            {dashboardEquipment.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-100">{item.name}</p>
                  <span className="text-sm text-cyan-300">{item.uptime}</span>
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Health score</span>
                    <span className="text-slate-100">{item.health}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${item.health}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Risk score</span>
                    <span className="text-amber-300">{item.risk}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card title="Maintenance performance" subtitle="OEE and throughput trend over the last 7 days">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-slate-100">+14.8%</p>
                <p className="text-sm text-slate-400">Throughput uplift</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Stable output
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="AI recommendations" subtitle="Suggested next actions from the model">
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-3">Inspect vibration sensors on Boiler Unit 4 before the next shift.</li>
            <li className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-3">Reprioritize technician dispatch for CNC Line 2 to avoid unplanned downtime.</li>
            <li className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-3">Upload the latest safety inspection packet to refresh the knowledge base.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
