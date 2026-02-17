export interface GraphNode {
  id: string;
  label: string;
  package: string | null;
  type: "root" | "caller" | "callee";
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type FunctionRow = {
  file: string | null;
  line: number | null;
  end_line: number | null;
};

export type SourceRow = {
  content: string;
};

export type RootRow = {
  id: string;
  name: string;
  package: string | null;
  complexity: number | null;
};

export type NeighborRow = {
  direction: GraphNode["type"];
  id: string;
  name: string;
  package: string | null;
  complexity: number | null;
};
