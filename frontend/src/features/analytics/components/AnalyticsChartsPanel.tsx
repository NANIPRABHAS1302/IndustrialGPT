import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Card } from '@/components/ui/Card';
import type { DocumentCategoryDistribution, TimeSeriesDataPoint } from '@/features/analytics/types';

type AnalyticsChartsPanelProps = {
  timeSeries: TimeSeriesDataPoint[];
  categories: DocumentCategoryDistribution[];
};

const PIE_COLORS = ['#22d3ee', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

export function AnalyticsChartsPanel({ timeSeries, categories }: AnalyticsChartsPanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Area Chart: Query Volume & Latency Trend */}
      <Card title="RAG Query Volume & Latency" subtitle="Weekly volume vs response latency (ms)">
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="queryVolume" stroke="#22d3ee" fillOpacity={1} fill="url(#colorVolume)" name="Query Volume" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Pie Chart: Document Ingestion Distribution */}
      <Card title="Document Category Ingestion" subtitle="Distribution of ingested manuals & SOPs">
        <div className="h-72 w-full pt-2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="count"
                nameKey="category"
                label={({ category, percentage }) => `${category} (${percentage}%)`}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
