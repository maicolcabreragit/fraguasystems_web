"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

/* ═══════════════════════════════════════════════════════════════════
   APINode — "Google Cloud Integration"
   
   Represents data extraction endpoints (Google Places, PageSpeed).
   Technical/structured UI with brushed-steel aesthetic. Scanline
   decoration to reinforce the "data processing" metaphor.
   ═══════════════════════════════════════════════════════════════════ */

export interface APINodeData {
  label?: string;
  api?: "places" | "pagespeed" | "maps" | "analytics";
  endpoint?: string;
  [key: string]: unknown;
}

const API_CONFIG: Record<
  string,
  { icon: string; label: string; color: string; desc: string }
> = {
  places: {
    icon: "📍",
    label: "Google Places",
    color: "#4285f4",
    desc: "Datos del negocio, reseñas, horarios",
  },
  pagespeed: {
    icon: "⚡",
    label: "PageSpeed Insights",
    color: "#34a853",
    desc: "Rendimiento web, Core Web Vitals",
  },
  maps: {
    icon: "🗺️",
    label: "Google Maps",
    color: "#ea4335",
    desc: "Geolocalización y presencia en Maps",
  },
  analytics: {
    icon: "📈",
    label: "Analytics",
    color: "#fbbc04",
    desc: "Métricas de tráfico y conversión",
  },
};

function APINodeComponent({ data }: NodeProps) {
  const d = data as APINodeData;
  const cardRef = useRef<HTMLDivElement>(null);
  const api = API_CONFIG[d.api || "places"] || API_CONFIG.places;

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
      `${(proximity * 0.1).toFixed(4)}`
    );
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--mi", "0");
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="canvas-node-card api-tech api-scanline"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: 230 }}
    >
      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center shrink-0 text-sm"
            style={{
              background: `${api.color}15`,
              border: `1px solid ${api.color}30`,
            }}
          >
            {api.icon}
          </div>
          <div className="min-w-0">
            <h3 className="text-[12px] font-bold text-white leading-tight font-mono">
              {d.label || api.label}
            </h3>
            <p className="text-[10px] text-machine-gray font-mono">
              Google Cloud
            </p>
          </div>
        </div>

        {/* Endpoint Display */}
        <div
          className="rounded p-2 mb-2 font-mono"
          style={{
            background: "rgba(10, 10, 10, 0.6)",
            border: "1px solid rgba(46, 53, 66, 0.5)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: `${api.color}20`,
                color: api.color,
              }}
            >
              GET
            </span>
            <span className="text-[9px] text-gray-500 truncate">
              {d.endpoint || `/api/v1/${d.api || "places"}`}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            {api.desc}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#34a853" }}
            />
            <span className="text-[10px] text-gray-500">Endpoint activo</span>
          </div>
          <span className="text-[9px] text-gray-600 font-mono">REST</span>
        </div>
      </div>

      {/* Target Handle — Bottom-Left */}
      <Handle
        type="target"
        position={Position.Bottom}
        className="handle-target"
        id="api-in"
        style={{ left: 12, bottom: 12, right: "auto" }}
      />

      {/* Source Handle — Top-Right */}
      <Handle
        type="source"
        position={Position.Top}
        className="handle-gold"
        id="api-out"
        style={{ left: "auto", right: 12, top: 12 }}
      />
    </div>
  );
}

export const APINode = memo(APINodeComponent);
