export type ThemeMode = 'light' | 'dark';

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type DashboardStats = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
};

export type ActivityItem = {
  id: number;
  title: string;
  detail: string;
  time: string;
  status: 'Healthy' | 'Review' | 'Critical';
};

export type EquipmentHealth = {
  id: number;
  name: string;
  health: number;
  risk: number;
  uptime: string;
};
