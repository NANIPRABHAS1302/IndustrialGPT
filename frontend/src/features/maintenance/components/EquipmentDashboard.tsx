import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Zap, Clock, Wrench, Thermometer, Activity } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { EquipmentItem } from '@/features/maintenance/types';

type EquipmentDashboardProps = {
  equipment: EquipmentItem[];
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
};

export function EquipmentDashboard({
  equipment,
  selectedEquipmentId,
  onSelectEquipment
}: EquipmentDashboardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {equipment.map((item) => {
        const isSelected = item.id === selectedEquipmentId;

        return (
          <div
            key={item.id}
            onClick={() => onSelectEquipment(item.id)}
            className={`cursor-pointer rounded-2xl border p-5 transition ${
              isSelected
                ? 'border-cyan-400 bg-slate-900 shadow-glow'
                : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/40'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                <h4 className="font-bold text-slate-100">{item.name}</h4>
              </div>
              <Badge
                tone={
                  item.status === 'Optimal'
                    ? 'success'
                    : item.status === 'Warning'
                    ? 'warning'
                    : 'danger'
                }
              >
                {item.status}
              </Badge>
            </div>

            <p className="mt-1 text-xs text-slate-400">{item.plantLocation}</p>

            {/* Metrics Gauge Row */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-800/80 bg-slate-950 p-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-cyan-400" /> Health Score
                </span>
                <span
                  className={`text-base font-bold ${
                    item.healthScore > 80
                      ? 'text-emerald-400'
                      : item.healthScore > 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {item.healthScore}%
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-cyan-400" /> RUL Hours
                </span>
                <span className="text-base font-bold text-slate-100">{item.rulHours} hrs</span>
              </div>
            </div>

            {/* Additional Sensors Summary */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-amber-400" /> {item.temperatureC}°C
              </span>
              <span>Vib: {item.vibrationMmS} mm/s</span>
              <span>Oil: {item.oilQualityPct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
