import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Wrench, ShieldAlert, Activity, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EquipmentDashboard } from '@/features/maintenance/components/EquipmentDashboard';
import { MaintenanceRecommendationPanel } from '@/features/maintenance/components/MaintenanceRecommendationPanel';
import {
  getEquipmentList,
  getMaintenanceAlerts,
  getMaintenanceRecommendations
} from '@/features/maintenance/services/maintenanceService';

export function MaintenanceFeature() {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  const { data: equipmentData, isLoading: isLoadingEq } = useQuery({
    queryKey: ['equipmentList'],
    queryFn: getEquipmentList
  });

  const { data: alertsData } = useQuery({
    queryKey: ['maintenanceAlerts'],
    queryFn: getMaintenanceAlerts
  });

  const { data: recsData } = useQuery({
    queryKey: ['maintenanceRecs'],
    queryFn: getMaintenanceRecommendations
  });

  const equipment = equipmentData || [];
  const alerts = alertsData || [];
  const recommendations = recsData || [];

  const selectedEquipment =
    equipment.find((e) => e.id === selectedEquipmentId) || equipment[0] || null;

  if (isLoadingEq) {
    return (
      <Card title="Predictive Maintenance" subtitle="Calculating RUL and sensor diagnostics…">
        <div className="flex items-center gap-3 p-8 text-slate-300">
          <Spinner />
          <span>Executing failure prediction algorithms...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-amber-600/20 via-slate-900/70 to-cyan-500/20 p-6 shadow-glow"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Industrial Intelligence</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">Predictive Maintenance & Asset Health</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              ML-driven Remaining Useful Life (RUL) forecasting, sensor anomaly detection, and prescriptive repair action plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              {equipment.length} Assets Monitored • {alerts.length} Active Alerts
            </div>
          </div>
        </div>
      </motion.div>

      {/* Equipment List Grid */}
      <Card title="Equipment Health & RUL Dashboard" subtitle="Click an asset to inspect AI recommendations">
        <EquipmentDashboard
          equipment={equipment}
          selectedEquipmentId={selectedEquipment?.id || null}
          onSelectEquipment={setSelectedEquipmentId}
        />
      </Card>

      {/* Recommendations & Sensor Alerts Split Panel */}
      <MaintenanceRecommendationPanel
        selectedEquipment={selectedEquipment}
        alerts={alerts}
        recommendations={recommendations}
      />
    </div>
  );
}
