export type AssetHealthStatus = 'Optimal' | 'Warning' | 'Critical' | 'Maintenance Required';

export type EquipmentItem = {
  id: string;
  name: string;
  category: string;
  plantLocation: string;
  healthScore: number; // 0 - 100
  rulHours: number; // Remaining Useful Life in operating hours
  status: AssetHealthStatus;
  failureProbability: number; // 0 - 1
  riskScore: number; // 0 - 100
  lastServicedDate: string;
  nextScheduledDate: string;
  vibrationMmS: number;
  temperatureC: number;
  oilQualityPct: number;
  serialNumber: string;
};

export type MaintenanceAlert = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  recommendedAction: string;
  isResolved?: boolean;
};

export type MaintenanceRecommendation = {
  id: string;
  equipmentId: string;
  priority: 'Immediate' | 'Upcoming' | 'Routine';
  actionTitle: string;
  reason: string;
  estimatedCost: string;
  estimatedDuration: string;
  requiredParts: string[];
};
