export type NodeType = 'Asset' | 'SOP' | 'MaintenanceLog' | 'Anomaly' | 'Sensor' | 'Regulation';

export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  properties: Record<string, any>;
  degree?: number;
};

export type GraphRelationship = {
  id: string;
  source: string;
  target: string;
  label: string;
  properties?: Record<string, any>;
};

export type KnowledgeGraphData = {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
};

export type GraphFilter = {
  search: string;
  nodeTypes: NodeType[];
  minConnections: number;
};
