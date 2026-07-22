import { apiClient } from '@/api/client';
import type { ApiResponse, DashboardStats, ActivityItem, EquipmentHealth } from '@/types';

export async function getDashboardOverview() {
  const response = await apiClient.get<ApiResponse<{ stats: DashboardStats[]; activity: ActivityItem[]; equipment: EquipmentHealth[] }>>('/dashboard');
  return response.data;
}
