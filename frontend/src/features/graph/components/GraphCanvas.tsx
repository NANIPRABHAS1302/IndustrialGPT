import React, { useMemo, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Search,
  Filter,
  Download,
  Info,
  Layers,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { GraphFilter, GraphNode, KnowledgeGraphData, NodeType } from '@/features/graph/types';

type GraphCanvasProps = {
  data: KnowledgeGraphData;
  selectedNode: GraphNode | null;
  onSelectNode: (node: GraphNode | null) => void;
  filter: GraphFilter;
  onFilterChange: (f: GraphFilter) => void;
  onExport: () => void;
};

const ALL_TYPES: NodeType[] = ['Asset', 'SOP', 'MaintenanceLog', 'Anomaly', 'Sensor', 'Regulation'];

const TYPE_COLORS: Record<NodeType, { bg: string; border: string; text: string }> = {
  Asset: { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-300' },
  SOP: { bg: 'bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-300' },
  MaintenanceLog: { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' },
  Anomaly: { bg: 'bg-amber-500/20', border: 'border-amber-400', text: 'text-amber-300' },
  Sensor: { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' },
  Regulation: { bg: 'bg-rose-500/20', border: 'border-rose-400', text: 'text-rose-300' }
};

export function GraphCanvas({
  data,
  selectedNode,
  onSelectNode,
  filter,
  onFilterChange,
  onExport
}: GraphCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredNodes = useMemo(() => {
    return data.nodes.filter((node) => {
      const matchesSearch = !filter.search || node.label.toLowerCase().includes(filter.search.toLowerCase());
      const matchesType = filter.nodeTypes.includes(node.type);
      return matchesSearch && matchesType;
    });
  }, [data.nodes, filter]);

  const filteredRelationships = useMemo(() => {
    const validIds = new Set(filteredNodes.map((n) => n.id));
    return data.relationships.filter((r) => validIds.has(r.source) && validIds.has(r.target));
  }, [data.relationships, filteredNodes]);

  const getNodePos = (id: string) => {
    return data.nodes.find((n) => n.id === id);
  };

  const handleToggleType = (type: NodeType) => {
    if (filter.nodeTypes.includes(type)) {
      onFilterChange({ ...filter, nodeTypes: filter.nodeTypes.filter((t) => t !== type) });
    } else {
      onFilterChange({ ...filter, nodeTypes: [...filter.nodeTypes, type] });
    }
  };

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[650px]'}`}>
      {/* Top Filter & Toolbar Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/90 px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px]">
            <Input
              placeholder="Search graph nodes..."
              value={filter.search}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
              className="pl-8 text-xs py-1"
            />
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Node Type Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {ALL_TYPES.map((t) => {
              const active = filter.nodeTypes.includes(t);
              const color = TYPE_COLORS[t];
              return (
                <button
                  key={t}
                  onClick={() => handleToggleType(t)}
                  className={`rounded-lg border px-2 py-0.5 text-[10px] font-medium transition ${
                    active ? `${color.border} ${color.bg} ${color.text}` : 'border-slate-800 text-slate-500'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewport Zoom & Export Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2))}
            className="p-1.5 text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.5))}
            className="p-1.5 text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="secondary" onClick={onExport} className="text-xs px-2.5 py-1">
            <Download className="h-3.5 w-3.5 mr-1" /> Export
          </Button>
        </div>
      </div>

      {/* SVG Canvas Rendering Relationships & Nodes */}
      <div className="relative flex-1 overflow-auto bg-slate-950 flex items-center justify-center">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          className="relative h-[600px] w-[800px] transition-transform duration-200"
        >
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="18"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
            </defs>

            {/* Relationship Lines */}
            {filteredRelationships.map((rel) => {
              const src = getNodePos(rel.source);
              const tgt = getNodePos(rel.target);
              if (!src || !tgt) return null;

              const midX = (src.x + tgt.x) / 2;
              const midY = (src.y + tgt.y) / 2;

              return (
                <g key={rel.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="#334155"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={midX}
                    y={midY - 6}
                    fill="#94a3b8"
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono font-medium select-none"
                  >
                    {rel.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Graph Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const color = TYPE_COLORS[node.type];

            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => onSelectNode(node)}
                style={{ left: node.x - 60, top: node.y - 25 }}
                className={`absolute flex w-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-2.5 text-center shadow-lg transition ${
                  color.bg
                } ${color.border} ${isSelected ? 'ring-4 ring-cyan-400/50 shadow-glow' : ''}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${color.text}`}>
                  {node.type}
                </span>
                <span className="truncate text-xs font-semibold text-slate-100 max-w-full">
                  {node.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MiniMap Overlay */}
      <div className="absolute bottom-4 right-4 rounded-2xl border border-slate-800 bg-slate-950/90 p-2 shadow-xl backdrop-blur-sm pointer-events-none hidden sm:block">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
          <Database className="h-3 w-3 text-cyan-400" /> Graph MiniMap
        </div>
        <div className="relative h-16 w-24 rounded-lg bg-slate-900 border border-slate-800">
          {filteredNodes.map((n) => (
            <div
              key={n.id}
              style={{ left: `${(n.x / 800) * 100}%`, top: `${(n.y / 600) * 100}%` }}
              className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
