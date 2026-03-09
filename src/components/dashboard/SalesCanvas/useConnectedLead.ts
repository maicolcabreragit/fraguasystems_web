"use client";

import { useEdges, useNodes } from "@xyflow/react";
import { useMemo } from "react";
import type { LeadNodeData } from "./Nodes/LeadNode";

/* ═══════════════════════════════════════════════════════════════════
   useConnectedLead — Data Flow Hook
   
   Given the current node's ID, walks the edges backwards to find
   a connected LeadNode and returns its data. This enables Action
   Nodes to "read" the client context they're wired to.
   ═══════════════════════════════════════════════════════════════════ */

export function useConnectedLead(nodeId: string): LeadNodeData | null {
  const edges = useEdges();
  const nodes = useNodes();

  return useMemo(() => {
    // Find any edge where this node is the target
    const incomingEdge = edges.find((e) => e.target === nodeId);
    if (!incomingEdge) return null;

    // Walk the chain until we hit a LeadNode (max 5 hops)
    let currentSourceId = incomingEdge.source;
    for (let i = 0; i < 5; i++) {
      const sourceNode = nodes.find((n) => n.id === currentSourceId);
      if (!sourceNode) return null;
      if (sourceNode.type === "leadNode") {
        return sourceNode.data as LeadNodeData;
      }
      // Try walking further backwards
      const nextEdge = edges.find((e) => e.target === currentSourceId);
      if (!nextEdge) return null;
      currentSourceId = nextEdge.source;
    }
    return null;
  }, [edges, nodes, nodeId]);
}
