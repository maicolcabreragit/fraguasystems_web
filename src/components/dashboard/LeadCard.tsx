"use client";

import { motion } from "framer-motion";
import type { Lead } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   Lead Card — Kanban card for CRM pipeline (v2 — improved visibility)
   ═══════════════════════════════════════════════════════════════════ */

const TIER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  A: { bg: "bg-red-500/20 border-red-500/30", text: "text-red-300", label: "🔥 A" },
  B: { bg: "bg-amber-500/20 border-amber-500/30", text: "text-amber-300", label: "⭐ B" },
  C: { bg: "bg-blue-500/20 border-blue-500/30", text: "text-blue-300", label: "🔵 C" },
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

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const tier = TIER_STYLES[lead.tier] || TIER_STYLES.C;
  const bizIcon = BIZ_ICONS[lead.businessType] || "📍";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(lead)}
      draggable
      onDragStart={(e) => {
        const event = e as unknown as React.DragEvent;
        event.dataTransfer?.setData("leadId", lead.id);
      }}
      className="
        bg-[#1c1f26] border border-[#2a2d35] rounded-lg p-4
        cursor-pointer hover:border-molten-copper/40
        transition-all duration-200 group
      "
    >
      {/* Header: Name + Tier */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-[16px] font-extrabold text-[#ffffff] leading-snug line-clamp-2 drop-shadow-sm">
          {lead.businessName || "Sin nombre"}
        </h4>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border shrink-0 ${tier.bg} ${tier.text}`}>
          {tier.label}
        </span>
      </div>

      {/* Type + Location */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">{bizIcon}</span>
        <span className="text-[13px] text-gray-300 capitalize">
          {lead.businessType}
        </span>
        {lead.location && lead.location !== "Lleida" && (
          <>
            <span className="text-gray-600">·</span>
            <span className="text-[12px] text-gray-400">{lead.location}</span>
          </>
        )}
      </div>

      {/* Ticket + Next Action */}
      <div className="flex items-center justify-between mb-2">
        {lead.estimatedTicket > 0 && (
          <span className="text-[14px] font-bold text-industrial-gold">
            €{lead.estimatedTicket.toLocaleString("es-ES")}
          </span>
        )}
        {lead.phone && (
          <span className="text-[12px] text-gray-400 font-mono">
            {lead.phone}
          </span>
        )}
      </div>

      {/* Pain points */}
      {lead.painPoints && lead.painPoints.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[#2a2d35]">
          {lead.painPoints.slice(0, 3).map((pain) => (
            <span
              key={pain}
              className="text-[11px] px-2 py-0.5 rounded-full bg-[#2a2d35] text-gray-300 border border-[#363940]"
            >
              {pain}
            </span>
          ))}
          {lead.painPoints.length > 3 && (
            <span className="text-[11px] text-gray-500 self-center">
              +{lead.painPoints.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Next action */}
      {lead.nextAction && (
        <div className="mt-2 pt-2 border-t border-[#2a2d35]">
          <span className="text-[11px] text-molten-copper/80">
            → {lead.nextAction}
          </span>
        </div>
      )}
    </motion.div>
  );
}
