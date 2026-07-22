import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BarChart3, Download, TrendingUp, TrendingDown, Calendar, Filter, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { AnalyticsChartsPanel } from '@/features/analytics/components/AnalyticsChartsPanel';
import {
  exportAnalyticsCSV,
  getAssetHealthHeatmap,
  getCategoryDistribution,
  getKPIMetrics,
  getTimeSeriesData
} from '@/features/analytics/services/analyticsService';
import type { AnalyticsFilter, DateRange } from '@/features/analytics/types';

export function AnalyticsFeature() {
  const [filter, setFilter] = useState<AnalyticsFilter>({
    dateRange: '7d',
    plant: 'all',
    category: 'all'
  });

  const { data: kpisData, isLoading: isLoadingKPIs } = useQuery({
    queryKey: ['analyticsKPIs'],
    queryFn: getKPIMetrics
  });

  const { data: timeSeriesData } = useQuery({
    queryKey: ['analyticsTimeSeries'],
    queryFn: getTimeSeriesData
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['analyticsCategories'],
    queryFn: getCategoryDistribution
  });

  const { data: heatmapData } = useQuery({
    queryKey: ['analyticsHeatmap'],
    queryFn: getAssetHealthHeatmap
  });

  const kpis = kpisData || [];
  const timeSeries = timeSeriesData || [];
  const categories = categoriesData || [];
  const heatmap = heatmapData || [];

  if (isLoadingKPIs) {
    return (
      <Card title="Executive Analytics" subtitle="Fetching telemetry & metrics…">
        <div className="flex items-center gap-3 p-8 text-slate-300">
          <Spinner />
          <span>Aggregating RAG queries and asset telemetry...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-blue-600/20 via-slate-900/70 to-purple-500/20 p-6 shadow-glow"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Operational Intelligence</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">Executive Analytics & Telemetry</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Live AI RAG performance, query throughput, OCR ingestion metrics, and plant equipment health heatmaps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filter.dateRange}
              onChange={(e) => setFilter({ ...filter, dateRange: e.target.value as DateRange })}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>

            <Button
              variant="secondary"
              onClick={() => exportAnalyticsCSV(timeSeries)}
              className="text-xs px-3 py-2"
            >
              <Download className="h-4 w-4 mr-1.5" /> Export CSV
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 space-y-2">
            <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-100">
                {kpi.value} {kpi.unit ? <span className="text-xs text-slate-400">{kpi.unit}</span> : ''}
              </span>
              <span
                className={`flex items-center text-xs font-semibold ${
                  kpi.trend === 'up' ? 'text-emerald-400' : 'text-cyan-400'
                }`}
              >
                {kpi.changePct > 0 ? '+' : ''}
                {kpi.changePct}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{kpi.description}</p>
          </div>
        ))}
      </div>

      {/* Recharts Analytics Panel */}
      <AnalyticsChartsPanel timeSeries={timeSeries} categories={categories} />

      {/* Asset Health Heatmap Grid */}
      <Card title="Plant Asset Health Matrix" subtitle="Real-time risk scoring across operating lines">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {heatmap.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-4 text-xs space-y-2 ${
                item.riskCategory === 'Critical'
                  ? 'border-rose-500/40 bg-rose-500/10'
                  : item.riskCategory === 'High'
                  ? 'border-amber-500/40 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-950/70'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-100">
                <span>{item.equipment}</span>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                    item.riskCategory === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300'
                      : item.riskCategory === 'High'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {item.riskCategory} Risk
                </span>
              </div>
              <p className="text-slate-400">{item.plant}</p>
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Health Index:</span>
                <span className="text-cyan-300 font-bold">{item.healthScore}/100</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
