import { ActivityItem, EquipmentHealth, StatCard } from '@/types';

export const stats: StatCard[] = [
  { title: 'Active Assets', value: '248', change: '+12%', trend: 'up', icon: 'Factory' },
  { title: 'Predicted Failures', value: '14', change: '-8%', trend: 'down', icon: 'AlertTriangle' },
  { title: 'Maintenance ROI', value: '94%', change: '+6%', trend: 'up', icon: 'TrendingUp' },
  { title: 'Downtime Saved', value: '18.2h', change: '+24%', trend: 'up', icon: 'Clock3' }
];

export const recentActivity: ActivityItem[] = [
  { id: 1, title: 'Compressor A-17 anomaly detected', detail: 'AI model flagged vibration drift at 2.1σ', time: '8 min ago', status: 'Review' },
  { id: 2, title: 'Maintenance plan approved', detail: 'Three asset interventions scheduled for shift 3', time: '24 min ago', status: 'Healthy' },
  { id: 3, title: 'Inspection report uploaded', detail: 'OCR extraction completed for 184 pages', time: '1 hr ago', status: 'Critical' }
];

export const equipmentHealth: EquipmentHealth[] = [
  { id: 1, name: 'Boiler Unit 4', health: 92, risk: 18, uptime: '99.1%' },
  { id: 2, name: 'CNC Line 2', health: 84, risk: 37, uptime: '97.6%' },
  { id: 3, name: 'HVAC Plant A', health: 77, risk: 61, uptime: '94.4%' }
];
