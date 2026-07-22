import React from 'react';
import { Info, Database, Link, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { GraphNode, KnowledgeGraphData } from '@/features/graph/types';

type NodeDetailsPanelProps = {
  node: GraphNode | null;
  graphData: KnowledgeGraphData;
  onClose: () => void;
  onSelectNode: (node: GraphNode) => void;
};

export function NodeDetailsPanel({
  node,
  graphData,
  onClose,
  onSelectNode
}: NodeDetailsPanelProps) {
  if (!node) {
    return (
      <Card title="Node Inspector" subtitle="Select a node in the graph">
        <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <Database className="h-8 w-8 text-slate-600 mb-2" />
          <p className="text-xs">Click on any Neo4j graph entity to view connected attributes and relationships.</p>
        </div>
      </Card>
    );
  }

  // Find connected relationships
  const connectedRels = graphData.relationships.filter(
    (r) => r.source === node.id || r.target === node.id
  );

  return (
    <Card
      title="Graph Entity Details"
      subtitle={`Node ID: ${node.id}`}
      action={
        <Button variant="ghost" onClick={onClose} className="text-xs px-2 py-1 text-slate-400 hover:text-white">
          Clear Selection
        </Button>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Node Header Card */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              {node.type}
            </span>
            <Badge tone="success">Neo4j Indexed</Badge>
          </div>
          <h3 className="mt-1 text-base font-bold text-slate-100">{node.label}</h3>
        </div>

        {/* Property Key-Value Pairs */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-cyan-400" /> Entity Properties
          </span>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5 font-mono text-[11px]">
            {Object.entries(node.properties || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b border-slate-900 pb-1 text-slate-300">
                <span className="text-slate-500">{key}:</span>
                <span className="text-slate-100 font-semibold">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Edges / Relationships */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-200 flex items-center gap-1">
            <Link className="h-3.5 w-3.5 text-cyan-400" /> Connected Graph Edges ({connectedRels.length})
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {connectedRels.map((rel) => {
              const isOutgoing = rel.source === node.id;
              const targetId = isOutgoing ? rel.target : rel.source;
              const targetNode = graphData.nodes.find((n) => n.id === targetId);

              return (
                <div
                  key={rel.id}
                  onClick={() => targetNode && onSelectNode(targetNode)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-[11px] hover:border-cyan-500/40 hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-slate-400 font-mono text-[10px]">
                      {isOutgoing ? 'OUT →' : 'IN ←'}
                    </span>
                    <span className="font-bold text-cyan-300 shrink-0">{rel.label}:</span>
                    <span className="truncate text-slate-200">{targetNode?.label || targetId}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-500 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
