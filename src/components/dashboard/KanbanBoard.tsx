"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LeadCard } from "./LeadCard";
import type { Lead, LeadStatus } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   Kanban Board — Drag-and-drop CRM pipeline
   ═══════════════════════════════════════════════════════════════════ */

const COLUMNS: { status: LeadStatus; label: string; color: string }[] = [
  { status: "nuevo", label: "🟢 Nuevo", color: "border-emerald-500/30" },
  { status: "contactado", label: "📞 Contactado", color: "border-blue-500/30" },
  { status: "reunion", label: "🗓️ Reunión", color: "border-purple-500/30" },
  { status: "propuesta", label: "📋 Propuesta", color: "border-amber-500/30" },
  { status: "negociacion", label: "🤝 Negociación", color: "border-orange-500/30" },
  { status: "cerrado", label: "✅ Cerrado", color: "border-emerald-400/30" },
  { status: "perdido", label: "❌ Perdido", color: "border-red-500/30" },
];

interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

export function KanbanBoard({ leads, onLeadClick, onStatusChange }: KanbanBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, newStatus: LeadStatus) => {
      e.preventDefault();
      const leadId = e.dataTransfer.getData("leadId");
      if (leadId) {
        onStatusChange(leadId, newStatus);
      }
      setDragOverColumn(null);
    },
    [onStatusChange]
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
      {COLUMNS.map((column) => {
        const columnLeads = leads.filter((l) => l.status === column.status);
        const isOver = dragOverColumn === column.status;

        return (
          <div
            key={column.status}
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.status)}
            className={`
              flex-shrink-0 w-[260px] flex flex-col
              bg-[#0f1013] border ${isOver ? "border-molten-copper/40 bg-molten-copper/5" : "border-brushed-steel/8"}
              transition-colors duration-200
            `}
          >
            {/* Column Header */}
            <div className={`px-3 py-2.5 border-b ${column.color} bg-[#111316]`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-titanium-white/80">
                  {column.label}
                </span>
                <span className="text-[10px] text-machine-gray/50 bg-brushed-steel/10 px-1.5 py-0.5 rounded-sm">
                  {columnLeads.length}
                </span>
              </div>
            </div>

            {/* Cards Container */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {columnLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={onLeadClick} />
                ))}
              </AnimatePresence>

              {columnLeads.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-20 text-[11px] text-machine-gray/30 border border-dashed border-brushed-steel/10"
                >
                  Arrastra leads aquí
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
