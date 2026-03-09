"use client";

import { memo, useCallback, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useConnectedLead } from "../useConnectedLead";

/* ═══════════════════════════════════════════════════════════════════
   EmailGeneratorNode — AI Email Composer
   
   Connected to a LeadNode, uses context to generate personalized
   sales emails. Mocked response for now.
   ═══════════════════════════════════════════════════════════════════ */

type GenStatus = "idle" | "loading" | "success" | "error";

function EmailGeneratorNodeComponent({ id }: NodeProps) {
  const lead = useConnectedLead(id);
  const cardRef = useRef<HTMLDivElement>(null);
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<GenStatus>("idle");
  const [expanded, setExpanded] = useState(false);

  const generate = useCallback(() => {
    if (!lead) return;
    setStatus("loading");
    setResult("");
    setTimeout(() => {
      setResult(
        `Estimado/a ${lead.contactName || "cliente"},\n\nLe escribo desde Fragua Systems en relación a ${lead.businessName}. ` +
        `Hemos analizado su sector (${lead.businessType}) y detectado oportunidades significativas ` +
        `para optimizar su operativa digital.\n\n` +
        `${context ? `Contexto adicional: ${context}\n\n` : ""}` +
        `Con un ticket estimado de €${lead.estimatedTicket.toLocaleString("es-ES")}, ` +
        `podemos ofrecerle una solución personalizada que maximice su ROI.\n\n` +
        `¿Le gustaría agendar una demo de 15 minutos esta semana?\n\nUn saludo cordial,\nEquipo Fragua Systems`
      );
      setStatus("success");
      setExpanded(true);
    }, 1500);
  }, [lead, context]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mx", `${x}px`);
    cardRef.current.style.setProperty("--my", `${y}px`);
    cardRef.current.style.setProperty("--mi", "0.1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--mi", "0");
  }, []);

  return (
    <div
      ref={cardRef}
      className="canvas-node-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: 280 }}
    >
      {/* Gold accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }}
      />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
            <span className="text-base">✉️</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-[12px] font-bold text-white leading-tight">Email Generator</h3>
            <p className="text-[9px] text-industrial-gold/70 font-medium uppercase tracking-wide">Gemini 3.1 Pro</p>
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

        {/* Context Input */}
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Contexto adicional (opcional)..."
          rows={2}
          className="nowheel nodrag w-full text-[11px] px-2.5 py-1.5 rounded-md bg-[#0a0a0a] border border-[#2a2d35] text-white placeholder:text-gray-600 focus:outline-none focus:border-industrial-gold/30 resize-none mb-2 transition-all"
        />

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={!lead || status === "loading"}
          className="w-full py-2 text-[11px] font-semibold rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: lead ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${lead ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.1)"}`, color: lead ? "#d4af37" : "#555" }}
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border border-industrial-gold/30 border-t-industrial-gold rounded-full animate-spin" />
              Generando...
            </span>
          ) : "✨ Generar Email"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-2">
            <button onClick={() => setExpanded(!expanded)} className="text-[9px] text-gray-500 hover:text-white mb-1 transition-colors">
              {expanded ? "▼ Ocultar" : "▶ Ver resultado"}
            </button>
            {expanded && (
              <div className="nowheel nodrag text-[10px] text-gray-300 leading-relaxed bg-[#0a0a0a] rounded-md p-2.5 border border-[#1e2028] max-h-[120px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                {result}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Bottom} className="handle-target" id="email-in" style={{ left: 12, bottom: 12, right: "auto" }} />
      <Handle type="source" position={Position.Top} className="handle-gold" id="email-out" style={{ left: "auto", right: 12, top: 12 }} />
    </div>
  );
}

export const EmailGeneratorNode = memo(EmailGeneratorNodeComponent);
