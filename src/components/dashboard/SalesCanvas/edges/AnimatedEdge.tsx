"use client";

import { memo } from "react";
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

/* ═══════════════════════════════════════════════════════════════════
   AnimatedEdge — "Data Flow" Connection
   
   Smooth-step edge with animated stroke-dasharray flowing L→R,
   using the brushed-steel color. Includes a subtle glow layer
   beneath the main stroke for depth.
   ═══════════════════════════════════════════════════════════════════ */

function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  return (
    <>
      {/* Glow layer */}
      <path
        d={edgePath}
        className="animated-edge-glow"
        fill="none"
        markerEnd={markerEnd}
      />
      {/* Main edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        className="animated-edge-path"
        style={style}
      />
    </>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeComponent);
