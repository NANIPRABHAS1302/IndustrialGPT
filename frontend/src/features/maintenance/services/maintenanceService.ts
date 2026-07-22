import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { EquipmentItem, MaintenanceAlert, MaintenanceRecommendation } from '@/features/maintenance/types';

const fallbackEquipment: EquipmentItem[] = [
  {
    id: 'eq-1',
    name: 'Hydraulic Press HP-400',
    category: 'Stamping Press',
    plantLocation: 'Plant 1 - Line A',
    healthScore: 92,
    rulHours: 1420,
    status: 'Optimal',
    failureProbability: 0.08,
    riskScore: 12,
    lastServicedDate: '2026-06-15',
    nextScheduledDate: '2026-09-15',
    vibrationMmS: 1.2,
    temperatureC: 62.4,
    oilQualityPct: 98,
    serialNumber: 'HP-400-2024-991'
  },
  {
    id: 'eq-2',
    name: 'Main Turbine B Generator',
    category: 'Turbine Generator',
    plantLocation: 'Plant 1 - Substation B',
    healthScore: 68,
    rulHours: 240,
    status: 'Warning',
    failureProbability: 0.35,
    riskScore: 64,
    lastServicedDate: '2026-04-10',
    nextScheduledDate: '2026-07-28',
    vibrationMmS: 4.8,
    temperatureC: 84.1,
    oilQualityPct: 76,
    serialNumber: 'TB-GEN-2023-402'
  },
  {
    id: 'eq-3',
    name: 'Cooling Compressor CC-09',
    category: 'HVAC Compressor',
    plantLocation: 'Plant 2 - Utility Bay',
    healthScore: 41,
    rulHours: 48,
    status: 'Critical',
    failureProbability: 0.78,
    riskScore: 88,
    lastServicedDate: '2026-02-12',
    nextScheduledDate: '2026-07-24',
    vibrationMmS: 8.9,
    temperatureC: 98.6,
    oilQualityPct: 42,
    serialNumber: 'CC-09-2021-118'
  }
];

const fallbackAlerts: MaintenanceAlert[] = [
  {
    id: 'alt-1',
    equipmentId: 'eq-3',
    equipmentName: 'Cooling Compressor CC-09',
    severity: 'high',
    title: 'High Bearing Vibration & Overheating Threshold',
    description: 'Vibration reached 8.9 mm/s exceeding ISO 10816 Class II threshold limits.',
    timestamp: '2026-07-22 08:15',
    recommendedAction: 'Immediate bearing lubrication and seal inspection required.',
    isResolved: false
  },
  {
    id: 'alt-2',
    equipmentId: 'eq-2',
    equipmentName: 'Main Turbine B Generator',
    severity: 'medium',
    title: 'Fluid Viscosity Degradation Alert',
    description: 'Synthetic hydraulic oil viscosity dropped below 78% purity rating.',
    timestamp: '2026-07-21 16:40',
    recommendedAction: 'Schedule fluid replacement during upcoming shift window.',
    isResolved: false
  }
];

const fallbackRecommendations: MaintenanceRecommendation[] = [
  {
    id: 'rec-1',
    equipmentId: 'eq-3',
    priority: 'Immediate',
    actionTitle: 'Replace Compressor Primary Bearing',
    reason: 'ML failure prediction estimates high failure risk within 48 operating hours.',
    estimatedCost: '$2,400',
    estimatedDuration: '4 Hours',
    requiredParts: ['Bearing Kit BK-99', 'O-Ring Set OS-12']
  },
  {
    id: 'rec-2',
    equipmentId: 'eq-2',
    priority: 'Upcoming',
    actionTitle: 'Perform Turbine Hydraulic Flush',
    reason: 'RUL model recommends flush to extend turbine life by +800 hours.',
    estimatedCost: '$1,100',
    estimatedDuration: '2.5 Hours',
    requiredParts: ['ISO VG 46 Fluid (200L)', 'Filter Cartridges']
  }
];

export async function getEquipmentList(): Promise<EquipmentItem[]> {
  try {
    const response = await apiClient.get<EquipmentItem[]>(endpoints.assets);
    return response.data;
  } catch {
    return fallbackEquipment;
  }
}

export async function getMaintenanceAlerts(): Promise<MaintenanceAlert[]> {
  try {
    const response = await apiClient.get<MaintenanceAlert[]>(endpoints.maintenance.logs);
    return response.data;
  } catch {
    return fallbackAlerts;
  }
}

export async function getMaintenanceRecommendations(): Promise<MaintenanceRecommendation[]> {
  try {
    const response = await apiClient.get<MaintenanceRecommendation[]>(endpoints.maintenance.predict);
    return response.data;
  } catch {
    return fallbackRecommendations;
  }
}
