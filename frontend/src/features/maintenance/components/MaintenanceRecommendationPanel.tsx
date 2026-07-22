import React from 'react';
import { ShieldAlert, Wrench, DollarSign, Clock, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { EquipmentItem, MaintenanceAlert, MaintenanceRecommendation } from '@/features/maintenance/types';

type MaintenanceRecommendationPanelProps = {
  selectedEquipment: EquipmentItem | null;
  alerts: MaintenanceAlert[];
  recommendations: MaintenanceRecommendation[];
};

export function MaintenanceRecommendationPanel({
  selectedEquipment,
  alerts,
  recommendations
}: MaintenanceRecommendationPanelProps) {
  if (!selectedEquipment) {
    return (
      <Card title="Predictive AI Recommendations" subtitle="Select an equipment to inspect predictions">
        <div className="p-8 text-center text-xs text-slate-400">
          Select an asset from the dashboard above to view AI recommendations and active sensor alerts.
        </div>
      </Card>
    );
  }

  const equipmentAlerts = alerts.filter((a) => a.equipmentId === selectedEquipment.id);
  const equipmentRecs = recommendations.filter((r) => r.equipmentId === selectedEquipment.id);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Active Sensor Alerts Card */}
      <Card
        title="Active Sensor Anomalies & Alerts"
        subtitle={`Asset: ${selectedEquipment.name}`}
      >
        <div className="space-y-3">
          {equipmentAlerts.length > 0 ? (
            equipmentAlerts.map((alt) => (
              <div
                key={alt.id}
                className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between font-bold text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" /> {alt.title}
                  </span>
                  <Badge tone="danger">{alt.severity.toUpperCase()}</Badge>
                </div>
                <p className="text-slate-300">{alt.description}</p>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-cyan-300 font-medium">
                  💡 Action: {alt.recommendedAction}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> No active sensor anomalies detected for this asset.
            </div>
          )}
        </div>
      </Card>

      {/* AI Prescriptive Maintenance Panel */}
      <Card
        title="AI Prescriptive Action Plan"
        subtitle="Optimized maintenance recommendations to prevent downtime"
      >
        <div className="space-y-4 text-xs">
          {equipmentRecs.length > 0 ? (
            equipmentRecs.map((rec) => (
              <div
                key={rec.id}
                className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <Wrench className="h-4 w-4 text-cyan-400" /> {rec.actionTitle}
                  </span>
                  <Badge tone={rec.priority === 'Immediate' ? 'danger' : 'warning'}>
                    {rec.priority} Priority
                  </Badge>
                </div>

                <p className="text-slate-300 italic">"{rec.reason}"</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-cyan-400" /> Est. Time: {rec.estimatedDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-400" /> Est. Cost: {rec.estimatedCost}
                  </span>
                </div>

                {rec.requiredParts.length > 0 ? (
                  <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-200">Required Parts:</span>{' '}
                    {rec.requiredParts.join(', ')}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-slate-400">
              No immediate prescriptive actions required. System operating normally.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
