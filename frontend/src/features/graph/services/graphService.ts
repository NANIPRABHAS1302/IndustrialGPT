import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { KnowledgeGraphData } from '@/features/graph/types';

const fallbackGraphData: KnowledgeGraphData = {
  nodes: [
    {
      id: 'node-asset-1',
      label: 'Main Turbine B',
      type: 'Asset',
      x: 350,
      y: 200,
      properties: { model: 'TX-900', plant: 'Plant 1', status: 'Optimal', installationDate: '2024-03-15' }
    },
    {
      id: 'node-sop-1',
      label: 'Hydraulic Flush SOP-HYD-04',
      type: 'SOP',
      x: 180,
      y: 100,
      properties: { category: 'Maintenance', lastUpdated: '2026-05-10', version: '2.1' }
    },
    {
      id: 'node-maint-1',
      label: 'Hydraulic Pressure Inspection #882',
      type: 'MaintenanceLog',
      x: 520,
      y: 110,
      properties: { technician: 'Alex Rivera', date: '2026-07-20', status: 'Completed' }
    },
    {
      id: 'node-sensor-1',
      label: 'Pressure Sensor PS-102',
      type: 'Sensor',
      x: 350,
      y: 360,
      properties: { telemetryRate: '1s', unit: 'BAR', maxLimit: '6.0' }
    },
    {
      id: 'node-anomaly-1',
      label: 'High Fluid Temp Spike Alert',
      type: 'Anomaly',
      x: 550,
      y: 300,
      properties: { severity: 'High', detectedAt: '2026-07-22 08:30', thresholdExceeded: '86.4°C' }
    },
    {
      id: 'node-reg-1',
      label: 'ISO 9001 Compliance Directive',
      type: 'Regulation',
      x: 150,
      y: 280,
      properties: { jurisdiction: 'Global', auditFrequency: 'Annual' }
    }
  ],
  relationships: [
    { id: 'rel-1', source: 'node-sop-1', target: 'node-asset-1', label: 'GOVERNS_MAINTENANCE' },
    { id: 'rel-2', source: 'node-maint-1', target: 'node-asset-1', label: 'PERFORMED_ON' },
    { id: 'rel-3', source: 'node-sensor-1', target: 'node-asset-1', label: 'MONITORS' },
    { id: 'rel-4', source: 'node-anomaly-1', target: 'node-sensor-1', label: 'TRIGGERED_BY' },
    { id: 'rel-5', source: 'node-sop-1', target: 'node-reg-1', label: 'COMPLIES_WITH' }
  ]
};

export async function getKnowledgeGraph(): Promise<KnowledgeGraphData> {
  try {
    const response = await apiClient.get<KnowledgeGraphData>(endpoints.graph.nodes);
    return response.data;
  } catch {
    return fallbackGraphData;
  }
}

export async function searchCypherGraph(query: string): Promise<KnowledgeGraphData> {
  try {
    const response = await apiClient.post<KnowledgeGraphData>(endpoints.graph.query, { query });
    return response.data;
  } catch {
    return fallbackGraphData;
  }
}
