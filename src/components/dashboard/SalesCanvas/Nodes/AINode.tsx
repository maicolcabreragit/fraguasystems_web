"use client";

import { memo, useCallback, useRef } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

/* ═══════════════════════════════════════════════════════════════════
   AINode — "Gemini 3.1 Pro"
   
   Represents the AI reasoning engine. Gold-glowing card with
   brain/sparkle iconography. Input handle (left) receives lead
   data, output handle (right) emits results.
   ═══════════════════════════════════════════════════════════════════ */

export interface AINodeData {
  label?: string;
  model?: string;
  mode?: "email" | "audit" | "research" | "strategy";
  [key: string]: unknown;
}

const MODE_CONFIG: Record<
  string,
  { icon: string; label: string; desc: string }
> = {
  email: {
    icon: "✉️",
    label: "Email Composer",
    desc: "Redacción inteligente de email personalizado",
  },
  audit: {
    icon: "🔍",
    label: "Business Audit",
    desc: "Auditoría digital del negocio objetivo",
  },
  research: {
    icon: "📊",
    label: "Market Research",
    desc: "Investigación de mercado y competencia",
  },
  strategy: {
    icon: "🎯",
    label: "Sales Strategy",
    desc: "Estrategia de venta personalizada",
  },
};

function AINodeComponent({ data }: NodeProps) {
  const d = data as AINodeData;
  const cardRef = useRef<HTMLDivElement>(null);
  const mode = MODE_CONFIG[d.mode || "email"] || MODE_CONFIG.email;

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
      `${(proximity * 0.12).toFixed(4)}`
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
      className="canvas-node-card ai-glow"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: 260 }}
    >
      {/* Gold accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #d4af37, transparent)",
        }}
      />

      {/* Pulse Ring (decorative) */}
      <div className="absolute top-3 right-3 ai-pulse-ring">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#d4af37",
            boxShadow: "0 0 8px rgba(212, 175, 55, 0.6)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          {/* AI Brain Icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
              <path d="M8 7v1a4 4 0 0 0 8 0V7" />
              <path d="M6.5 11.5A4.5 4.5 0 0 0 8 20" />
              <path d="M17.5 11.5A4.5 4.5 0 0 1 16 20" />
              <path d="M8 20h8" />
              <path d="M12 16v4" />
              <circle cx="7" cy="14" r="1" />
              <circle cx="17" cy="14" r="1" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-white leading-tight">
              {d.label || "Gemini 3.1 Pro"}
            </h3>
            <p className="text-[10px] text-industrial-gold/70 font-medium tracking-wide uppercase">
              {d.model || "AI Reasoning Engine"}
            </p>
          </div>
        </div>

        {/* Mode Badge */}
        <div
          className="rounded-lg p-2.5 mb-2"
          style={{
            background: "rgba(212, 175, 55, 0.05)",
            border: "1px solid rgba(212, 175, 55, 0.1)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">{mode.icon}</span>
            <span className="text-[11px] font-semibold text-white">
              {mode.label}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            {mode.desc}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#d4af37",
              boxShadow: "0 0 4px rgba(212, 175, 55, 0.5)",
            }}
          />
          <span className="text-[10px] text-gray-500">
            Listo para procesar
          </span>
        </div>
      </div>

      {/* Target Handle — Bottom-Left */}
      <Handle
        type="target"
        position={Position.Bottom}
        className="handle-target"
        id="ai-in"
        style={{ left: 12, bottom: 12, right: "auto" }}
      />

      {/* Source Handle — Top-Right */}
      <Handle
        type="source"
        position={Position.Top}
        className="handle-gold"
        id="ai-out"
        style={{ left: "auto", right: 12, top: 12 }}
      />
    </div>
  );
}

export const AINode = memo(AINodeComponent);
