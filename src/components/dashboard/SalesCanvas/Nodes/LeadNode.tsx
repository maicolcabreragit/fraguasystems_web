"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

/* ═══════════════════════════════════════════════════════════════════
   LeadNode — "El Cliente"
   
   Glassmorphism dark card displaying lead info with a single
   source handle (right) in molten-copper. Magnetic border glow
   is handled via CSS custom props for zero-render performance.
   ═══════════════════════════════════════════════════════════════════ */

export interface LeadNodeData {
  businessName: string;
  tier: "A" | "B" | "C";
  estimatedTicket: number;
  contactName?: string;
  businessType?: string;
  status?: string;
  [key: string]: unknown;
}

const TIER_LABELS: Record<string, string> = {
  A: "HOT",
  B: "WARM",
  C: "COLD",
};

const BIZ_ICONS: Record<string, string> = {
  hotel: "🏨",
  rural: "🏡",
  restaurante: "🍽️",
  apartamentos: "🏢",
  bar: "☕",
  camping: "⛺",
  otro: "📍",
};

function LeadNodeComponent({ data }: NodeProps) {
  const d = data as LeadNodeData;
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dist = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    const maxDist = Math.sqrt(
      Math.pow(rect.width, 2) + Math.pow(rect.height, 2)
    );
    const proximity = Math.max(0, 1 - dist / maxDist);

    cardRef.current.style.setProperty("--mx", `${x}px`);
    cardRef.current.style.setProperty("--my", `${y}px`);
    cardRef.current.style.setProperty(
      "--mi",
      `${(proximity * 0.15).toFixed(4)}`
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--mi", "0");
    }
  }, []);

  const tierClass =
    d.tier === "A" ? "tier-a" : d.tier === "B" ? "tier-b" : "tier-c";
  const bizIcon = BIZ_ICONS[d.businessType || ""] || "📍";

  return (
    <div
      ref={cardRef}
      className="canvas-node-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: 240 }}
    >
      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg shrink-0">{bizIcon}</span>
            <h3 className="text-[13px] font-bold text-white truncate leading-tight">
              {d.businessName || "Lead"}
            </h3>
          </div>
          <span className={`tier-badge ${tierClass} shrink-0`}>
            {d.tier}
          </span>
        </div>

        {/* Tier Label */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">
            {TIER_LABELS[d.tier] || "LEAD"}
          </span>
        </div>

        {/* Contact */}
        {d.contactName && (
          <p className="text-[11px] text-gray-400 mb-2 truncate">
            👤 {d.contactName}
          </p>
        )}

        {/* Ticket */}
        <div className="flex items-end justify-between pt-2 border-t border-white/5">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            Ticket Est.
          </span>
          <span className="text-[15px] font-bold text-industrial-gold tabular-nums">
            €{d.estimatedTicket.toLocaleString("es-ES")}
          </span>
        </div>
      </div>

      {/* Source Handle — Top-Right — molten-copper visible dot */}
      <Handle
        type="source"
        position={Position.Top}
        className="source-copper"
        id="lead-out"
        style={{ left: "auto", right: 12, top: 12 }}
      />
    </div>
  );
}

export const LeadNode = memo(LeadNodeComponent);
