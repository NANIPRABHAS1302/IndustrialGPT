import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type {
  AssetHealthHeatmapPoint,
  DocumentCategoryDistribution,
  KPIMetric,
  TimeSeriesDataPoint
} from '@/features/analytics/types';

const fallbackKPIs: KPIMetric[] = [
  {
    id: 'kpi-1',
    title: 'Total RAG Queries',
    value: '42,890',
    changePct: 14.2,
    trend: 'up',
    description: 'Queries processed by AI Assistants across all plants.'
  },
  {
    id: 'kpi-2',
    title: 'Avg RAG Latency',
    value: 340,
    unit: 'ms',
    changePct: -8.4,
    trend: 'down', // lower is better
    description: 'Average end-to-end vector search & generation response time.'
  },
  {
    id: 'kpi-3',
    title: 'OCR Ingestion Success',
    value: '99.4%',
    changePct: 1.1,
    trend: 'up',
    description: 'Documents successfully parsed, indexed & chunked.'
  },
  {
    id: 'kpi-4',
    title: 'Prevented Equipment Failures',
    value: 18,
    changePct: 25.0,
    trend: 'up',
    description: 'Downtime events avoided via ML predictive RUL alerts.'
  }
];

const fallbackTimeSeries: TimeSeriesDataPoint[] = [
  { timestamp: 'Mon', queryVolume: 4200, avgResponseTimeMs: 380, ocrSuccessRate: 98.8, anomalyDetections: 2 },
  { timestamp: 'Tue', queryVolume: 5800, avgResponseTimeMs: 350, ocrSuccessRate: 99.2, anomalyDetections: 4 },
  { timestamp: 'Wed', queryVolume: 6100, avgResponseTimeMs: 320, ocrSuccessRate: 99.5, anomalyDetections: 1 },
  { timestamp: 'Thu', queryVolume: 7400, avgResponseTimeMs: 310, ocrSuccessRate: 99.6, anomalyDetections: 5 },
  { timestamp: 'Fri', queryVolume: 8900, avgResponseTimeMs: 340, ocrSuccessRate: 99.1, anomalyDetections: 3 },
  { timestamp: 'Sat', queryVolume: 4900, avgResponseTimeMs: 330, ocrSuccessRate: 99.7, anomalyDetections: 0 },
  { timestamp: 'Sun', queryVolume: 5590, avgResponseTimeMs: 325, ocrSuccessRate: 99.4, anomalyDetections: 1 }
];

const fallbackCategoryDistribution: DocumentCategoryDistribution[] = [
  { category: 'Compliance', count: 450, percentage: 35 },
  { category: 'Operations', count: 320, percentage: 25 },
  { category: 'Engineering', count: 260, percentage: 20 },
  { category: 'Maintenance', count: 180, percentage: 14 },
  { category: 'Other', count: 78, percentage: 6 }
];

const fallbackHeatmap: AssetHealthHeatmapPoint[] = [
  { plant: 'Plant 1', equipment: 'Hydraulic Press HP-400', healthScore: 92, riskCategory: 'Low' },
  { plant: 'Plant 1', equipment: 'Main Turbine B', healthScore: 68, riskCategory: 'Medium' },
  { plant: 'Plant 2', equipment: 'Cooling Compressor CC-09', healthScore: 41, riskCategory: 'Critical' },
  { plant: 'Plant 2', equipment: 'Conveyor Drive Motor M-12', healthScore: 84, riskCategory: 'Low' },
  { plant: 'Plant 3', equipment: 'Substation Transformer T-04', healthScore: 55, riskCategory: 'High' }
];

export async function getKPIMetrics(): Promise<KPIMetric[]> {
  try {
    const response = await apiClient.get<KPIMetric[]>(`${endpoints.analytics}/kpis`);
    return response.data;
  } catch {
    return fallbackKPIs;
  }
}

export async function getTimeSeriesData(): Promise<TimeSeriesDataPoint[]> {
  try {
    const response = await apiClient.get<TimeSeriesDataPoint[]>(`${endpoints.analytics}/timeseries`);
    return response.data;
  } catch {
    return fallbackTimeSeries;
  }
}

export async function getCategoryDistribution(): Promise<DocumentCategoryDistribution[]> {
  try {
    const response = await apiClient.get<DocumentCategoryDistribution[]>(`${endpoints.analytics}/categories`);
    return response.data;
  } catch {
    return fallbackCategoryDistribution;
  }
}

export async function getAssetHealthHeatmap(): Promise<AssetHealthHeatmapPoint[]> {
  try {
    const response = await apiClient.get<AssetHealthHeatmapPoint[]>(`${endpoints.analytics}/heatmap`);
    return response.data;
  } catch {
    return fallbackHeatmap;
  }
}

export function exportAnalyticsCSV(timeSeries: TimeSeriesDataPoint[]) {
  const headers = 'Timestamp,Query Volume,Avg Response Time (ms),OCR Success Rate (%),Anomaly Detections\n';
  const rows = timeSeries
    .map((d) => `${d.timestamp},${d.queryVolume},${d.avgResponseTimeMs},${d.ocrSuccessRate},${d.anomalyDetections}`)
    .join('\n');
  const csvContent = headers + rows;
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `IndustrialGPT-Analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
