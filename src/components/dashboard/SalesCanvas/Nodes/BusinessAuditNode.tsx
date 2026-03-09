"use client";

import { memo, useCallback, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useConnectedLead } from "../useConnectedLead";

/* ═══════════════════════════════════════════════════════════════════
   BusinessAuditNode — AI Pain Point Analyzer
   
   Audits the connected lead's pain points and generates selling
   arguments. Uses mocked data for now.
   ═══════════════════════════════════════════════════════════════════ */

type AuditStatus = "idle" | "loading" | "success" | "error";

interface AuditResult {
  pain: string;
  argument: string;
  impact: "high" | "medium" | "low";
}

const IMPACT_COLORS = {
  high: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#f87171" },
  medium: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", text: "#fbbf24" },
  low: { bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)", text: "#60a5fa" },
};

function BusinessAuditNodeComponent({ id }: NodeProps) {
  const lead = useConnectedLead(id);
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<AuditStatus>("idle");
  const [results, setResults] = useState<AuditResult[]>([]);

  const audit = useCallback(() => {
    if (!lead) return;
    setStatus("loading");
    setResults([]);
    setTimeout(() => {
      const mockResults: AuditResult[] = [
        {
          pain: "Sin presencia digital optimizada",
          argument: `${lead.businessName} pierde un 40% de reservas directas por no tener un motor de reservas propio.`,
          impact: "high",
        },
        {
          pain: "Gestión manual de disponibilidad",
          argument: "La sincronización manual con OTAs genera overbookings. Un channel manager automatizado reduciría errores un 95%.",
          impact: "high",
        },
        {
          pain: "Falta de análisis de datos",
          argument: `Con un ticket estimado de €${lead.estimatedTicket.toLocaleString("es-ES")}, un dashboard analítico podría aumentar el revenue un 15-20%.`,
          impact: "medium",
        },
        {
          pain: "Comunicación no automatizada",
          argument: "Emails pre-estancia, check-in digital y encuestas post-estancia automatizados mejoran el NPS en +20 puntos.",
          impact: "low",
        },
      ];
      setResults(mockResults);
      setStatus("success");
    }, 2000);
  }, [lead]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
    cardRef.current.style.setProperty("--mi", "0.1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--mi", "0");
  }, []);

  return (
    <div ref={cardRef} className="canvas-node-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ width: 280 }}>
      {/* Purple accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #a855f7, transparent)" }} />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <span className="text-base">🔍</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-[12px] font-bold text-white leading-tight">Business Audit</h3>
            <p className="text-[9px] text-purple-400/70 font-medium uppercase tracking-wide">Análisis de Dolor</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md"
          style={{ background: lead ? "rgba(52,211,153,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${lead ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)"}` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: lead ? "#34d399" : "#ef4444", boxShadow: `0 0 4px ${lead ? "rgba(52,211,153,0.5)" : "rgba(239,68,68,0.5)"}` }} />
          <span className="text-[9px] font-medium" style={{ color: lead ? "#34d399" : "#ef4444" }}>
            {lead ? `Conectado: ${lead.businessName}` : "Sin conexión a Lead"}
          </span>
        </div>

        {/* Audit Button */}
        <button onClick={audit} disabled={!lead || status === "loading"}
          className="w-full py-2 text-[11px] font-semibold rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: lead ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${lead ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.1)"}`, color: lead ? "#a855f7" : "#555" }}>
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              Analizando...
            </span>
          ) : "🎯 Auditar Puntos de Dolor"}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="nowheel nodrag mt-2 space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
            {results.map((r, i) => {
              const color = IMPACT_COLORS[r.impact];
              return (
                <div key={i} className="rounded-md p-2" style={{ background: color.bg, border: `1px solid ${color.border}` }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: color.text }}>
                      {r.impact === "high" ? "🔴" : r.impact === "medium" ? "🟡" : "🔵"} {r.impact}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-white mb-0.5">{r.pain}</p>
                  <p className="text-[9px] text-gray-400 leading-relaxed">{r.argument}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Bottom} className="handle-target" id="audit-in" style={{ left: 12, bottom: 12, right: "auto" }} />
      <Handle type="source" position={Position.Top} className="handle-gold" id="audit-out" style={{ left: "auto", right: 12, top: 12 }} />
    </div>
  );
}

export const BusinessAuditNode = memo(BusinessAuditNodeComponent);
