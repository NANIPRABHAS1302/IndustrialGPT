export type DashboardViewModel = {
  stats: Array<{
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
  }>;
  activity: Array<{
    id: number;
    title: string;
    detail: string;
    time: string;
    status: 'Healthy' | 'Review' | 'Critical';
  }>;
  equipment: Array<{
    id: number;
    name: string;
    health: number;
    risk: number;
    uptime: string;
  }>;
};
