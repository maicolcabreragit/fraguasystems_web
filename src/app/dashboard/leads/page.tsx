"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { AddLeadModal } from "@/components/dashboard/AddLeadModal";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import type { Lead, LeadStatus, Activity } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   CRM Pipeline — Kanban board view for lead management
   ═══════════════════════════════════════════════════════════════════ */

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
      const res = await fetch(`/api/dashboard/leads${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      console.error("Error fetching leads");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    await fetch(`/api/dashboard/leads/${leadId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const handleAddLead = async (data: Record<string, unknown>) => {
    await fetch("/api/dashboard/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchLeads();
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-molten-copper/30 border-t-molten-copper rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-titanium-white tracking-tight">
            CRM Pipeline
          </h1>
          <p className="text-xs text-machine-gray/50 mt-0.5">
            {leads.length} leads en el pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-machine-gray/40"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar leads..."
              className="
                pl-9 pr-3 py-2 text-sm bg-[#141619] border border-brushed-steel/15
                text-titanium-white placeholder:text-machine-gray/30
                focus:outline-none focus:border-molten-copper/40
                w-56 transition-all
              "
            />
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="
              flex items-center gap-2 px-4 py-2 text-sm font-medium
              bg-molten-copper text-white hover:bg-molten-copper/90
              active:scale-[0.98] transition-all
            "
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Lead
          </button>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <KanbanBoard
        leads={leads}
        onLeadClick={handleLeadClick}
        onStatusChange={handleStatusChange}
      />

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLead}
      />

      {/* Lead Detail Slide-over */}
      {selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={() => { setSelectedLead(null); fetchLeads(); }}
        />
      )}
    </div>
  );
}

/* ─── Lead Detail Panel (slide-over) ──────────────────────────────── */

function LeadDetailPanel({
  lead,
  onClose,
  onUpdate,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(lead);
  const [newActivity, setNewActivity] = useState({ type: "call", title: "", description: "", outcome: "" });
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    fetch(`/api/dashboard/activities?leadId=${lead.id}`)
      .then((r) => r.json())
      .then((d) => setActivities(d.activities || []));
  }, [lead.id]);

  const handleSave = async () => {
    await fetch(`/api/dashboard/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditing(false);
    onUpdate();
  };

  const handleAddActivity = async () => {
    await fetch("/api/dashboard/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newActivity,
        leadId: lead.id,
        userId: "admin-maicol",
        userName: "Maicol",
      }),
    });
    setShowActivityForm(false);
    setNewActivity({ type: "call", title: "", description: "", outcome: "" });
    // Refresh activities
    const res = await fetch(`/api/dashboard/activities?leadId=${lead.id}`);
    const data = await res.json();
    setActivities(data.activities || []);
  };

  const handleDelete = async () => {
    if (confirm("¿Eliminar este lead permanentemente?")) {
      await fetch(`/api/dashboard/leads/${lead.id}`, { method: "DELETE" });
      onUpdate();
    }
  };

  const inputClass = `
    w-full px-3 py-2 text-sm bg-[#0f1013] border border-brushed-steel/15
    text-titanium-white focus:outline-none focus:border-molten-copper/40 transition-all
  `;

  const BIZ_LABELS: Record<string, string> = {
    hotel: "Hotel", rural: "Rural", restaurante: "Restaurante",
    apartamentos: "Apartamentos", bar: "Bar / Café", otro: "Otro",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#111316] border-l border-brushed-steel/10 h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#111316] border-b border-brushed-steel/10 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-titanium-white">
              {lead.businessName}
            </h2>
            <p className="text-xs text-machine-gray/50">
              {BIZ_LABELS[lead.businessType]} · {lead.location}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-machine-gray hover:text-titanium-white transition-colors px-2 py-1 border border-brushed-steel/15"
              >
                Editar
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="text-xs text-white bg-molten-copper px-3 py-1"
              >
                Guardar
              </button>
            )}
            <button onClick={onClose} className="text-machine-gray/50 hover:text-titanium-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider">Contacto</h3>
            {editing ? (
              <div className="space-y-2">
                <input value={editData.contactName} onChange={(e) => setEditData({ ...editData, contactName: e.target.value })} placeholder="Nombre" className={inputClass} />
                <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} placeholder="Teléfono" className={inputClass} />
                <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="Email" className={inputClass} />
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm text-titanium-white">{lead.contactName} <span className="text-machine-gray/50">· {lead.contactRole}</span></p>
                {lead.phone && <p className="text-xs text-machine-gray/70">📞 {lead.phone}</p>}
                {lead.email && <p className="text-xs text-machine-gray/70">✉️ {lead.email}</p>}
              </div>
            )}
          </div>

          {/* Status & Tier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider mb-1.5">Estado</h3>
              {editing ? (
                <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value as Lead["status"] })} className={inputClass}>
                  <option value="nuevo">🟢 Nuevo</option>
                  <option value="contactado">📞 Contactado</option>
                  <option value="reunion">🗓️ Reunión</option>
                  <option value="propuesta">📋 Propuesta</option>
                  <option value="negociacion">🤝 Negociación</option>
                  <option value="cerrado">✅ Cerrado</option>
                  <option value="perdido">❌ Perdido</option>
                </select>
              ) : (
                <span className="text-sm text-titanium-white capitalize">{lead.status}</span>
              )}
            </div>
            <div>
              <h3 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider mb-1.5">Ticket</h3>
              {editing ? (
                <input type="number" value={editData.estimatedTicket} onChange={(e) => setEditData({ ...editData, estimatedTicket: Number(e.target.value) })} className={inputClass} />
              ) : (
                <span className="text-sm font-medium text-industrial-gold">
                  €{lead.estimatedTicket.toLocaleString("es-ES")}
                </span>
              )}
            </div>
          </div>

          {/* Next Action */}
          <div>
            <h3 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider mb-1.5">Próxima acción</h3>
            {editing ? (
              <div className="space-y-2">
                <input value={editData.nextAction} onChange={(e) => setEditData({ ...editData, nextAction: e.target.value })} placeholder="Acción" className={inputClass} />
                <input type="date" value={editData.nextActionDate} onChange={(e) => setEditData({ ...editData, nextActionDate: e.target.value })} className={inputClass} />
              </div>
            ) : (
              <div>
                <p className="text-sm text-titanium-white/80">{lead.nextAction || "Sin definir"}</p>
                {lead.nextActionDate && <p className="text-xs text-machine-gray/50 mt-0.5">{new Date(lead.nextActionDate).toLocaleDateString("es-ES")}</p>}
              </div>
            )}
          </div>

          {/* Notes */}
          {(lead.notes || editing) && (
            <div>
              <h3 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider mb-1.5">Notas</h3>
              {editing ? (
                <textarea value={editData.notes} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} rows={3} className={inputClass + " resize-none"} />
              ) : (
                <p className="text-xs text-machine-gray/60 leading-relaxed">{lead.notes}</p>
              )}
            </div>
          )}

          {/* Activity Section */}
          <div className="border-t border-brushed-steel/10 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider">
                Historial de actividad
              </h3>
              <button
                onClick={() => setShowActivityForm(!showActivityForm)}
                className="text-[11px] text-molten-copper hover:text-molten-copper/80 transition-colors"
              >
                + Registrar actividad
              </button>
            </div>

            {showActivityForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-[#0f1013] border border-brushed-steel/10 p-3 mb-4 space-y-2"
              >
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  className={inputClass}
                >
                  <option value="call">📞 Llamada</option>
                  <option value="email">✉️ Email</option>
                  <option value="meeting">🗓️ Reunión</option>
                  <option value="note">📝 Nota</option>
                  <option value="proposal">📋 Propuesta</option>
                  <option value="close">🤝 Cierre</option>
                </select>
                <input
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="Título (ej: Primera llamada)"
                  className={inputClass}
                />
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  placeholder="Descripción..."
                  rows={2}
                  className={inputClass + " resize-none"}
                />
                <input
                  value={newActivity.outcome}
                  onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })}
                  placeholder="Resultado (ej: Interesado, agendó reunión)"
                  className={inputClass}
                />
                <button
                  onClick={handleAddActivity}
                  className="w-full py-2 text-xs font-medium bg-molten-copper text-white hover:bg-molten-copper/90 transition-all"
                >
                  Guardar actividad
                </button>
              </motion.div>
            )}

            <ActivityTimeline activities={activities} />
          </div>

          {/* Delete */}
          <div className="border-t border-brushed-steel/10 pt-4">
            <button
              onClick={handleDelete}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            >
              Eliminar lead permanentemente
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
