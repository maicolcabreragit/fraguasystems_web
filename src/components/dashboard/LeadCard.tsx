"use client";

import { motion } from "framer-motion";
import type { Lead } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   Lead Card — Draggable Kanban card for CRM pipeline
   ═══════════════════════════════════════════════════════════════════ */

const TIER_STYLES = {
  A: { bg: "bg-red-500/10", text: "text-red-400", label: "🔥 A" },
  B: { bg: "bg-amber-500/10", text: "text-amber-400", label: "🟡 B" },
  C: { bg: "bg-blue-500/10", text: "text-blue-400", label: "🔵 C" },
};

const BIZ_LABELS: Record<string, string> = {
  hotel: "Hotel",
  rural: "Rural",
  restaurante: "Restaurante",
  apartamentos: "Apartamentos",
  bar: "Bar / Café",
  otro: "Otro",
};

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const tier = TIER_STYLES[lead.tier];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(lead)}
      draggable
      onDragStart={(e) => {
        const event = e as unknown as React.DragEvent;
        event.dataTransfer?.setData("leadId", lead.id);
      }}
      className="
        bg-[#1a1d22] border border-brushed-steel/10 p-3.5
        cursor-pointer hover:border-brushed-steel/25
        transition-colors duration-200 group
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-titanium-white leading-tight line-clamp-1 flex-1 mr-2">
          {lead.businessName}
        </h4>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${tier.bg} ${tier.text} shrink-0`}>
          {tier.label}
        </span>
      </div>

      {/* Contact */}
      <p className="text-xs text-machine-gray/70 mb-2 line-clamp-1">
        {lead.contactName} · {BIZ_LABELS[lead.businessType] || lead.businessType}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {lead.estimatedTicket > 0 && (
          <span className="text-xs font-medium text-industrial-gold/80">
            €{lead.estimatedTicket.toLocaleString("es-ES")}
          </span>
        )}
        {lead.nextAction && (
          <span className="text-[10px] text-machine-gray/50 line-clamp-1 ml-auto max-w-[60%] text-right">
            {lead.nextAction}
          </span>
        )}
      </div>

      {/* Pain points */}
      {lead.painPoints.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {lead.painPoints.slice(0, 2).map((pain) => (
            <span
              key={pain}
              className="text-[9px] px-1.5 py-0.5 bg-brushed-steel/10 text-machine-gray/60 rounded-sm"
            >
              {pain}
            </span>
          ))}
          {lead.painPoints.length > 2 && (
            <span className="text-[9px] text-machine-gray/40">
              +{lead.painPoints.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
