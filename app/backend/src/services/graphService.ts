import { db } from "../db";
import { GraphResponse } from "../types";
import { config } from "../config";
import type { RootRow, NeighborRow, GraphNode } from "../types";

export class GraphService {
  getFunctionNeighborhood(functionId: string): GraphResponse {
    const root = db
      .prepare(
        `
          SELECT 
            n.id,
            n.name,
            n.package,
            n.file,
            fs.complexity
          FROM nodes n
          LEFT JOIN v_function_summary fs ON fs.id = n.id
          WHERE n.id = ?
          AND n.kind = 'function'
      `,
      )
      .get(functionId) as RootRow;

    if (!root) {
      throw new Error("Function not found");
    }

    const neighbors = db
      .prepare(
        `
          SELECT direction, id, name, package, complexity
          FROM (
            SELECT 
              'caller' AS direction,
              n.id,
              n.name,
              n.package,
              fs.complexity
            FROM edges e
            JOIN nodes n ON n.id = e.source
            LEFT JOIN v_function_summary fs ON fs.id = n.id
            WHERE e.target = ? 
              AND e.kind = 'call' 
              AND n.kind = 'function'

            UNION ALL

            SELECT 
              'callee' AS direction,
              n.id,
              n.name,
              n.package,
              fs.complexity
            FROM edges e
            JOIN nodes n ON n.id = e.target
            LEFT JOIN v_function_summary fs ON fs.id = n.id
            WHERE e.source = ? 
              AND e.kind = 'call' 
              AND n.kind = 'function'
          )
          LIMIT ?
          `,
      )
      .all(functionId, functionId, config.maxGraphNodes) as NeighborRow[];

    const nodes = [
      {
        id: root.id,
        label: root.name,
        package: root.package,
        type: "root" as GraphNode["type"],
        complexity: root.complexity ?? 1,
      },
    ];

    const edges = [];

    for (const n of neighbors) {
      nodes.push({
        id: n.id,
        label: n.name,
        package: n.package,
        type: n.direction,
        complexity: n.complexity ?? 1,
      });

      if (n.direction === "caller") {
        edges.push({ source: n.id, target: root.id });
      } else {
        edges.push({ source: root.id, target: n.id });
      }
    }

    return { nodes, edges };
  }
}
