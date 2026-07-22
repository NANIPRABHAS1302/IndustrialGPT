import { useEffect, useState } from 'react';
import { getDashboardOverview } from '@/features/dashboard/services/dashboardService';
import type { ActivityItem, DashboardStats, EquipmentHealth } from '@/types';

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await getDashboardOverview();
        if (!isMounted) return;
        setStats(response.data.stats);
        setActivity(response.data.activity);
        setEquipment(response.data.equipment);
      } catch {
        if (isMounted) setError('Unable to load dashboard data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, activity, equipment, loading, error };
}
