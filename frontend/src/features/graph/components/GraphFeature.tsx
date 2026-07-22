import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Database, Network, RefreshCw, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { GraphCanvas } from '@/features/graph/components/GraphCanvas';
import { NodeDetailsPanel } from '@/features/graph/components/NodeDetailsPanel';
import { getKnowledgeGraph } from '@/features/graph/services/graphService';
import type { GraphFilter, GraphNode, NodeType } from '@/features/graph/types';

const INITIAL_FILTER: GraphFilter = {
  search: '',
  nodeTypes: ['Asset', 'SOP', 'MaintenanceLog', 'Anomaly', 'Sensor', 'Regulation'],
  minConnections: 0
};

export function GraphFeature() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filter, setFilter] = useState<GraphFilter>(INITIAL_FILTER);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['knowledgeGraph'],
    queryFn: getKnowledgeGraph,
    staleTime: 60_000
  });

  const graphData = useMemo(() => data || { nodes: [], relationships: [] }, [data]);

  const handleExport = () => {
    const jsonStr = JSON.stringify(graphData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IndustrialGPT-KnowledgeGraph-Export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card title="Knowledge Graph Explorer" subtitle="Connecting to Neo4j graph cluster…">
        <div className="flex items-center gap-3 p-8 text-slate-300">
          <Spinner />
          <span>Building entity & relationship topology...</span>
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
        className="rounded-3xl border border-slate-800/80 bg-gradient-to-br from-cyan-600/20 via-slate-900/70 to-blue-500/20 p-6 shadow-glow"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Enterprise Knowledge Graph</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-50">Industrial Asset & SOP Topology</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Interactive visualization of Neo4j graph nodes. Traverses relationships between physical machinery, maintenance SOPs, sensor telemetry, and regulatory compliance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200 font-medium flex items-center gap-2">
              <Network className="h-4 w-4 text-cyan-400" />
              {graphData.nodes.length} Nodes • {graphData.relationships.length} Relationships
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Canvas & Details Split */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <GraphCanvas
          data={graphData}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
          filter={filter}
          onFilterChange={setFilter}
          onExport={handleExport}
        />

        <div>
          <NodeDetailsPanel
            node={selectedNode}
            graphData={graphData}
            onClose={() => setSelectedNode(null)}
            onSelectNode={setSelectedNode}
          />
        </div>
      </div>
    </div>
  );
}
