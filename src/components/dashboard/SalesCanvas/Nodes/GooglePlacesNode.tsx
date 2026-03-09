"use client";

import { memo, useCallback, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useConnectedLead } from "../useConnectedLead";

/* ═══════════════════════════════════════════════════════════════════
   GooglePlacesNode — Data Enrichment (Google Places API)
   
   Searches Google Places using the connected lead's name/location.
   Mocked results for now — will connect to real API later.
   ═══════════════════════════════════════════════════════════════════ */

type SearchStatus = "idle" | "loading" | "success" | "error";

interface PlaceResult {
  name: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  website: string;
}

function GooglePlacesNodeComponent({ id }: NodeProps) {
  const lead = useConnectedLead(id);
  const cardRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [result, setResult] = useState<PlaceResult | null>(null);

  // Auto-fill query when lead connects
  const effectiveQuery = query || (lead ? `${lead.businessName} ${lead.businessType || ""}` : "");

  const search = useCallback(() => {
    setStatus("loading");
    setResult(null);
    setTimeout(() => {
      setResult({
        name: lead?.businessName || effectiveQuery,
        rating: 3.8 + Math.random() * 1.2,
        reviews: Math.floor(50 + Math.random() * 200),
        address: "Carrer Major, 15 · Lleida, España",
        phone: "+34 973 XXX XXX",
        website: `www.${(lead?.businessName || "negocio").toLowerCase().replace(/\s/g, "")}.com`,
      });
      setStatus("success");
    }, 1200);
  }, [effectiveQuery, lead]);

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
    <div ref={cardRef} className="canvas-node-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ width: 270 }}>
      {/* Teal accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #14b8a6, transparent)" }} />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)" }}>
            <span className="text-base">📍</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-[12px] font-bold text-white leading-tight">Google Places</h3>
            <p className="text-[9px] text-teal-400/70 font-medium uppercase tracking-wide">Enriquecimiento</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md"
          style={{ background: lead ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${lead ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.08)"}` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: lead ? "#34d399" : "#888", boxShadow: `0 0 4px ${lead ? "rgba(52,211,153,0.5)" : "rgba(136,136,136,0.3)"}` }} />
          <span className="text-[9px] font-medium" style={{ color: lead ? "#34d399" : "#888" }}>
            {lead ? `Conectado: ${lead.businessName}` : "Sin conexión (búsqueda manual)"}
          </span>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lead ? `${lead.businessName}...` : "Buscar negocio..."}
          className="nowheel nodrag w-full text-[11px] px-2.5 py-1.5 rounded-md bg-[#0a0a0a] border border-[#2a2d35] text-white placeholder:text-gray-600 focus:outline-none focus:border-teal-500/30 mb-2 transition-all"
        />

        {/* Search Button */}
        <button onClick={search} disabled={status === "loading" && !effectiveQuery}
          className="w-full py-2 text-[11px] font-semibold rounded-lg transition-all"
          style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", color: "#14b8a6" }}>
          {status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
              Buscando...
            </span>
          ) : "🗺️ Buscar en Maps"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-2 rounded-md p-2.5 space-y-1.5" style={{ background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.12)" }}>
            <p className="text-[11px] font-semibold text-white">{result.name}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-yellow-400">{"★".repeat(Math.round(result.rating))}{"☆".repeat(5 - Math.round(result.rating))}</span>
              <span className="text-[9px] text-gray-500">{result.rating.toFixed(1)} ({result.reviews} reseñas)</span>
            </div>
            <p className="text-[9px] text-gray-400">📍 {result.address}</p>
            <p className="text-[9px] text-gray-400">📞 {result.phone}</p>
            <p className="text-[9px] text-teal-400">🌐 {result.website}</p>
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Bottom} className="handle-target" id="places-in" style={{ left: 12, bottom: 12, right: "auto" }} />
      <Handle type="source" position={Position.Top} className="handle-gold" id="places-out" style={{ left: "auto", right: 12, top: 12 }} />
    </div>
  );
}

export const GooglePlacesNode = memo(GooglePlacesNodeComponent);
