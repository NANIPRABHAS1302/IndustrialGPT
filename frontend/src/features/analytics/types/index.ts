export type DateRange = '7d' | '30d' | '90d' | '1y' | 'all';

export type KPIMetric = {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
};

export type TimeSeriesDataPoint = {
  timestamp: string;
  queryVolume: number;
  avgResponseTimeMs: number;
  ocrSuccessRate: number;
  anomalyDetections: number;
};

export type DocumentCategoryDistribution = {
  category: string;
  count: number;
  percentage: number;
};

export type AssetHealthHeatmapPoint = {
  plant: string;
  equipment: string;
  healthScore: number;
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
};

export type AnalyticsFilter = {
  dateRange: DateRange;
  plant: string;
  category: string;
};
