"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddLeadModal } from "@/components/dashboard/AddLeadModal";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import type { Lead, LeadStatus, Activity } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   CRM Pipeline — Professional table view with filters & pagination
   ═══════════════════════════════════════════════════════════════════ */

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  nuevo:       { label: "Nuevo",       color: "text-emerald-400", bg: "bg-emerald-500/15 border-emerald-500/25" },
  contactado:  { label: "Contactado",  color: "text-blue-400",    bg: "bg-blue-500/15 border-blue-500/25" },
  reunion:     { label: "Reunión",     color: "text-purple-400",  bg: "bg-purple-500/15 border-purple-500/25" },
  propuesta:   { label: "Propuesta",   color: "text-amber-400",   bg: "bg-amber-500/15 border-amber-500/25" },
  negociacion: { label: "Negociación", color: "text-orange-400",  bg: "bg-orange-500/15 border-orange-500/25" },
  cerrado:     { label: "Cerrado",     color: "text-green-400",   bg: "bg-green-500/15 border-green-500/25" },
  perdido:     { label: "Perdido",     color: "text-red-400",     bg: "bg-red-500/15 border-red-500/25" },
};

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  A: { label: "A", color: "text-red-300",   bg: "bg-red-500/15 border-red-500/25" },
  B: { label: "B", color: "text-amber-300", bg: "bg-amber-500/15 border-amber-500/25" },
  C: { label: "C", color: "text-blue-300",  bg: "bg-blue-500/15 border-blue-500/25" },
};

const BIZ_ICONS: Record<string, string> = {
  hotel: "🏨", rural: "🏡", restaurante: "🍽️", apartamentos: "🏢",
  bar: "☕", camping: "⛺", otro: "📍",
};

const ITEMS_PER_PAGE = 25;

type SortField = "businessName" | "estimatedTicket" | "tier" | "businessType" | "location" | "status";
type SortDir = "asc" | "desc";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Sort & Pagination
  const [sortField, setSortField] = useState<SortField>("businessName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [filterStatus, filterTier, filterType, searchQuery]);

  // Filtered + sorted leads
  const filteredLeads = useMemo(() => {
    let result = leads;
    if (filterStatus !== "all") result = result.filter(l => l.status === filterStatus);
    if (filterTier !== "all") result = result.filter(l => l.tier === filterTier);
    if (filterType !== "all") result = result.filter(l => l.businessType === filterType);

    result.sort((a, b) => {
      const valA = a[sortField] ?? "";
      const valB = b[sortField] ?? "";
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      return sortDir === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return result;
  }, [leads, filterStatus, filterTier, filterType, sortField, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats for filter badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
    return counts;
  }, [leads]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l)));
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

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 opacity-40">
      {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

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
          <h1 className="text-2xl font-bold text-white tracking-tight">
            CRM Pipeline
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {filteredLeads.length} de {leads.length} leads
            {filterStatus !== "all" || filterTier !== "all" || filterType !== "all" ? " (filtrados)" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar leads..."
              className="
                pl-9 pr-3 py-2.5 text-sm rounded-lg bg-[#141619] border border-[#2a2d35]
                text-white placeholder:text-gray-500
                focus:outline-none focus:border-molten-copper/50 focus:ring-1 focus:ring-molten-copper/20
                w-64 transition-all
              "
            />
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="
              flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg
              bg-molten-copper text-white hover:bg-molten-copper/90
              active:scale-[0.98] transition-all shadow-lg shadow-molten-copper/20
            "
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Lead
          </button>
        </div>
      </motion.div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
            filterStatus === "all"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-transparent border-[#2a2d35] text-gray-400 hover:border-gray-500"
          }`}
        >
          Todos ({leads.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              filterStatus === key
                ? `${cfg.bg} ${cfg.color}`
                : "bg-transparent border-[#2a2d35] text-gray-400 hover:border-gray-500"
            }`}
          >
            {cfg.label} ({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex gap-3">
        <select
          value={filterTier}
          onChange={e => setFilterTier(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-[#141619] border border-[#2a2d35] text-white focus:outline-none focus:border-molten-copper/50"
        >
          <option value="all">Todos los tiers</option>
          <option value="A">🔥 Tier A (Hot)</option>
          <option value="B">⭐ Tier B (Warm)</option>
          <option value="C">🔵 Tier C (Cold)</option>
        </select>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg bg-[#141619] border border-[#2a2d35] text-white focus:outline-none focus:border-molten-copper/50"
        >
          <option value="all">Todos los tipos</option>
          <option value="hotel">🏨 Hotel</option>
          <option value="rural">🏡 Rural</option>
          <option value="apartamentos">🏢 Apartamentos</option>
          <option value="restaurante">🍽️ Restaurante</option>
          <option value="bar">☕ Bar</option>
          <option value="camping">⛺ Camping</option>
        </select>

        {(filterStatus !== "all" || filterTier !== "all" || filterType !== "all") && (
          <button
            onClick={() => { setFilterStatus("all"); setFilterTier("all"); setFilterType("all"); }}
            className="px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#0f1013] border border-[#1e2028] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#1e2028]">
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("businessName")}
                >
                  Empresa <SortIcon field="businessName" />
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("businessType")}
                >
                  Tipo <SortIcon field="businessType" />
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("location")}
                >
                  Ciudad <SortIcon field="location" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Teléfono
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("tier")}
                >
                  Tier <SortIcon field="tier" />
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("estimatedTicket")}
                >
                  Ticket <SortIcon field="estimatedTicket" />
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Estado <SortIcon field="status" />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead, i) => {
                const tier = TIER_CONFIG[lead.tier] || TIER_CONFIG.C;
                const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.nuevo;
                const icon = BIZ_ICONS[lead.businessType] || "📍";

                return (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    onClick={() => setSelectedLead(lead)}
                    className="border-b border-[#1a1d22] hover:bg-[#151820] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="text-[13px] font-semibold text-white group-hover:text-molten-copper transition-colors block truncate">
                        {lead.businessName || "Sin nombre"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px] text-gray-300">
                        {icon} {lead.businessType}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px] text-gray-400">{lead.location || "—"}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[12px] text-gray-400 font-mono">{lead.phone || "—"}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-bold w-6 h-6 inline-flex items-center justify-center rounded-full border ${tier.bg} ${tier.color}`}>
                        {tier.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="text-[13px] font-bold text-industrial-gold">
                        €{lead.estimatedTicket.toLocaleString("es-ES")}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => { e.stopPropagation(); handleStatusChange(lead.id, e.target.value as LeadStatus); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-[11px] font-medium px-2 py-1 rounded-full border ${status.bg} ${status.color} bg-transparent cursor-pointer focus:outline-none`}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 max-w-[120px]">
                      <span className="text-[11px] text-gray-500 truncate block">
                        {lead.nextAction || "—"}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e2028]">
            <span className="text-xs text-gray-500">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} de {filteredLeads.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#2a2d35] text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                ← Anterior
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let page: number;
                if (totalPages <= 7) {
                  page = i + 1;
                } else if (currentPage <= 4) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i;
                } else {
                  page = currentPage - 3 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-xs rounded-lg border transition-all ${
                      currentPage === page
                        ? "bg-molten-copper border-molten-copper text-white font-bold"
                        : "border-[#2a2d35] text-gray-400 hover:text-white hover:border-gray-500"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#2a2d35] text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pipeline Value Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#0f1013] border border-[#1e2028] rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Pipeline</p>
          <p className="text-lg font-bold text-white">
            €{filteredLeads.reduce((s, l) => s + l.estimatedTicket, 0).toLocaleString("es-ES")}
          </p>
        </div>
        <div className="bg-[#0f1013] border border-[#1e2028] rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Ticket Medio</p>
          <p className="text-lg font-bold text-white">
            €{filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((s, l) => s + l.estimatedTicket, 0) / filteredLeads.length).toLocaleString("es-ES") : 0}
          </p>
        </div>
        <div className="bg-[#0f1013] border border-[#1e2028] rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Leads Filtrados</p>
          <p className="text-lg font-bold text-white">{filteredLeads.length}</p>
        </div>
        <div className="bg-[#0f1013] border border-[#1e2028] rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Tier A (Hot)</p>
          <p className="text-lg font-bold text-red-400">{leads.filter(l => l.tier === "A").length}</p>
        </div>
      </div>

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
    w-full px-3 py-2 text-sm rounded-lg bg-[#0f1013] border border-[#2a2d35]
    text-white focus:outline-none focus:border-molten-copper/50 transition-all
  `;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex justify-end bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#111316] border-l border-[#1e2028] h-full overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#111316] border-b border-[#1e2028] p-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">{lead.businessName}</h2>
              <p className="text-sm text-gray-400">
                {BIZ_ICONS[lead.businessType] || "📍"} {lead.businessType} · {lead.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 border border-[#2a2d35] rounded-lg"
                >
                  Editar
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="text-xs text-white bg-molten-copper px-3 py-1.5 rounded-lg"
                >
                  Guardar
                </button>
              )}
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Contact Info */}
            <div className="bg-[#0d0f12] rounded-lg p-4 space-y-3">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-molten-copper pl-2">Contacto</h3>
              {editing ? (
                <div className="space-y-2">
                  <input value={editData.contactName} onChange={(e) => setEditData({ ...editData, contactName: e.target.value })} placeholder="Nombre" className={inputClass} />
                  <input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} placeholder="Teléfono" className={inputClass} />
                  <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="Email" className={inputClass} />
                </div>
              ) : (
                <div className="space-y-1.5">
                  {lead.contactName && <p className="text-sm text-white">{lead.contactName} {lead.contactRole && <span className="text-gray-500">· {lead.contactRole}</span>}</p>}
                  {lead.phone && <p className="text-sm text-gray-300">📞 {lead.phone}</p>}
                  {lead.email && <p className="text-sm text-gray-300">✉️ {lead.email}</p>}
                  {!lead.contactName && !lead.phone && !lead.email && <p className="text-sm text-gray-500 italic">Sin datos de contacto</p>}
                </div>
              )}
            </div>

            {/* Status & Tier */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0d0f12] rounded-lg p-4">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-molten-copper pl-2 mb-2">Estado</h3>
                {editing ? (
                  <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value as Lead["status"] })} className={inputClass}>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`text-sm font-semibold ${STATUS_CONFIG[lead.status]?.color || "text-gray-400"}`}>
                    {STATUS_CONFIG[lead.status]?.label || lead.status}
                  </span>
                )}
              </div>
              <div className="bg-[#0d0f12] rounded-lg p-4">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-industrial-gold pl-2 mb-2">Ticket</h3>
                {editing ? (
                  <input type="number" value={editData.estimatedTicket} onChange={(e) => setEditData({ ...editData, estimatedTicket: Number(e.target.value) })} className={inputClass} />
                ) : (
                  <span className="text-lg font-bold text-industrial-gold">
                    €{lead.estimatedTicket.toLocaleString("es-ES")}
                  </span>
                )}
              </div>
            </div>

            {/* Notes */}
            {(lead.notes || editing) && (
              <div className="bg-[#0d0f12] rounded-lg p-4">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-blue-400 pl-2 mb-2">Notas</h3>
                {editing ? (
                  <textarea value={editData.notes} onChange={(e) => setEditData({ ...editData, notes: e.target.value })} rows={4} className={inputClass + " resize-none"} />
                ) : (
                  <p className="text-[13px] text-gray-300 leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
                )}
              </div>
            )}

            {/* Activity Section */}
            <div className="border-t border-[#1e2028] pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-bold text-white uppercase tracking-widest border-l-2 border-purple-400 pl-2">
                  Historial de actividad
                </h3>
                <button
                  onClick={() => setShowActivityForm(!showActivityForm)}
                  className="text-xs text-molten-copper hover:text-molten-copper/80 transition-colors"
                >
                  + Registrar actividad
                </button>
              </div>

              {showActivityForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="bg-[#0f1013] border border-[#2a2d35] rounded-lg p-3 mb-4 space-y-2"
                >
                  <select value={newActivity.type} onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })} className={inputClass}>
                    <option value="call">📞 Llamada</option>
                    <option value="email">✉️ Email</option>
                    <option value="meeting">🗓️ Reunión</option>
                    <option value="note">📝 Nota</option>
                    <option value="proposal">📋 Propuesta</option>
                    <option value="close">🤝 Cierre</option>
                  </select>
                  <input value={newActivity.title} onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} placeholder="Título" className={inputClass} />
                  <textarea value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} placeholder="Descripción..." rows={2} className={inputClass + " resize-none"} />
                  <input value={newActivity.outcome} onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })} placeholder="Resultado" className={inputClass} />
                  <button onClick={handleAddActivity} className="w-full py-2 text-xs font-semibold rounded-lg bg-molten-copper text-white hover:bg-molten-copper/90">
                    Guardar actividad
                  </button>
                </motion.div>
              )}

              <ActivityTimeline activities={activities} />
            </div>

            {/* Delete */}
            <div className="border-t border-[#1e2028] pt-4">
              <button onClick={handleDelete} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">
                Eliminar lead permanentemente
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

