"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lead, LeadTier, BusinessType } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   LeadSelectorModal — Search + Filter + Preview/Edit + Auto-Save
   ═══════════════════════════════════════════════════════════════════ */

interface LeadSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lead: Lead) => void;
  /** Called whenever a lead's data is saved — lets the parent sync nodes */
  onLeadUpdated?: (lead: Lead) => void;
}

type Tab = "select" | "create";
type SaveStatus = "idle" | "saving" | "saved" | "error";

const BIZ_ICONS: Record<string, string> = {
  hotel: "🏨", rural: "🏡", restaurante: "🍽️", apartamentos: "🏢",
  bar: "☕", camping: "⛺", otro: "📍",
};

const BIZ_LABELS: Record<string, string> = {
  hotel: "Hotel", rural: "Turismo Rural", restaurante: "Restaurante",
  apartamentos: "Apartamentos", bar: "Bar / Café", camping: "Camping", otro: "Otro",
};

const TIER_STYLES: Record<string, string> = {
  A: "bg-red-500/15 text-red-400 border-red-500/30",
  B: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  C: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  nuevo: { label: "Nuevo", color: "text-blue-400" },
  contactado: { label: "Contactado", color: "text-amber-400" },
  propuesta: { label: "Propuesta", color: "text-purple-400" },
  negociacion: { label: "Negociación", color: "text-orange-400" },
  cerrado_ganado: { label: "Cerrado ✓", color: "text-emerald-400" },
  cerrado_perdido: { label: "Perdido", color: "text-red-400" },
};

const ALL_STATUSES = Object.keys(STATUS_MAP);

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "hotel", label: "Hotel" },
  { value: "rural", label: "Rural" },
  { value: "restaurante", label: "Restaurante" },
  { value: "apartamentos", label: "Apartamentos" },
  { value: "bar", label: "Bar" },
  { value: "otro", label: "Otro" },
];

export function LeadSelectorModal({
  isOpen,
  onClose,
  onSelect,
  onLeadUpdated,
}: LeadSelectorModalProps) {
  const [tab, setTab] = useState<Tab>("select");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  /* ─── Filters ──────────────────────────────────────────────────── */
  const [filterTier, setFilterTier] = useState<LeadTier | null>(null);
  const [filterBiz, setFilterBiz] = useState<BusinessType | null>(null);

  /* ─── Fetch leads ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen || tab !== "select") return;
    const controller = new AbortController();
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (search) p.set("search", search);
        if (filterTier) p.set("tier", filterTier);
        if (filterBiz) p.set("businessType", filterBiz);
        const qs = p.toString() ? `?${p.toString()}` : "";
        const res = await fetch(`/api/dashboard/leads${qs}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setLeads(data.leads || []);
      } catch (err) {
        if ((err as Error).name !== "AbortError")
          console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchLeads, 200);
    return () => { clearTimeout(t); controller.abort(); };
  }, [isOpen, search, tab, filterTier, filterBiz]);

  useEffect(() => {
    if (isOpen && tab === "select")
      setTimeout(() => searchRef.current?.focus(), 100);
  }, [isOpen, tab]);

  useEffect(() => {
    if (!isOpen) {
      setSearch(""); setTab("select"); setSelectedLead(null);
      setFilterTier(null); setFilterBiz(null);
    }
  }, [isOpen]);

  /* ─── When a lead is updated in the preview, sync it back ──────── */
  const handleLeadSaved = useCallback(
    (updated: Lead) => {
      setSelectedLead(updated);
      setLeads((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
      onLeadUpdated?.(updated);
    },
    [onLeadUpdated]
  );

  /* ─── Create form ──────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    businessName: "", contactName: "", contactRole: "", phone: "", email: "",
    businessType: "hotel" as BusinessType, tier: "B" as LeadTier,
    location: "Lleida", size: "", painPoints: [] as string[],
    estimatedTicket: 0, nextAction: "", nextActionDate: "", notes: "",
    assignedTo: "admin-socio",
  });

  const resetForm = useCallback(() => {
    setFormData({
      businessName: "", contactName: "", contactRole: "", phone: "", email: "",
      businessType: "hotel", tier: "B", location: "Lleida", size: "",
      painPoints: [], estimatedTicket: 0, nextAction: "", nextActionDate: "",
      notes: "", assignedTo: "admin-socio",
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/dashboard/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "nuevo" }),
      });
      const data = await res.json();
      if (data.lead) { onSelect(data.lead); resetForm(); }
    } catch (err) {
      console.error("Error creating lead:", err);
    } finally {
      setCreating(false);
    }
  };

  const inputClass = `
    w-full px-3 py-2 text-sm bg-[#0a0a0a] border border-[#2a2d35]
    text-white placeholder:text-gray-600 rounded-lg
    focus:outline-none focus:border-molten-copper/40 focus:ring-1 focus:ring-molten-copper/15
    transition-all duration-200
  `;
  const labelClass = "block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[5vh] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl bg-[#111316] border border-[#2a2d35] rounded-xl shadow-2xl shadow-black/60 overflow-hidden"
        >
          {/* ─── Header ──────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 pt-4 pb-0">
            <h2 className="text-sm font-bold text-white">Lead para el Canvas</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ─── Tabs ────────────────────────────────────────────── */}
          <div className="flex gap-0 px-5 mt-3 border-b border-[#1e2028]">
            <TabBtn active={tab === "select"} onClick={() => { setTab("select"); setSelectedLead(null); }} label="Seleccionar Existente" />
            <TabBtn active={tab === "create"} onClick={() => setTab("create")} label="Crear Nuevo" />
          </div>

          {/* ─── Select Tab ──────────────────────────────────────── */}
          {tab === "select" ? (
            <div className="flex" style={{ height: 480 }}>
              {/* LEFT — Search + List */}
              <div className="flex-1 flex flex-col border-r border-[#1e2028] min-w-0">
                {/* Search */}
                <div className="p-3 pb-0">
                  <div className="relative">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      ref={searchRef} type="text" value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por nombre, email, teléfono..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#0a0a0a] border border-[#2a2d35] text-white placeholder:text-gray-600 focus:outline-none focus:border-molten-copper/40 transition-all"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5">
                  {(["A", "B", "C"] as LeadTier[]).map((t) => (
                    <button key={t} onClick={() => setFilterTier(filterTier === t ? null : t)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${filterTier === t ? TIER_STYLES[t] : "border-[#2a2d35] text-gray-600 hover:text-gray-400"}`}
                    >Tier {t}</button>
                  ))}
                  <span className="w-px h-4 bg-[#2a2d35] self-center mx-0.5" />
                  {BUSINESS_TYPES.map((bt) => (
                    <button key={bt.value} onClick={() => setFilterBiz(filterBiz === bt.value ? null : bt.value)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-all ${filterBiz === bt.value ? "border-molten-copper/40 bg-molten-copper/10 text-molten-copper" : "border-[#2a2d35] text-gray-600 hover:text-gray-400"}`}
                    >{bt.label}</button>
                  ))}
                  {(filterTier || filterBiz) && (
                    <button onClick={() => { setFilterTier(null); setFilterBiz(null); }}
                      className="text-[10px] px-2 py-0.5 text-gray-500 hover:text-white transition-colors"
                    >✕ Limpiar</button>
                  )}
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 custom-scrollbar">
                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-5 h-5 border-2 border-molten-copper/30 border-t-molten-copper rounded-full animate-spin" />
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-xs text-gray-500">
                        {search || filterTier || filterBiz ? "Sin resultados" : "No hay leads"}
                      </p>
                      <button onClick={() => setTab("create")}
                        className="mt-2 text-[11px] text-molten-copper hover:text-molten-copper/80 transition-colors"
                      >Crear un nuevo lead →</button>
                    </div>
                  ) : (
                    leads.map((lead) => (
                      <LeadRow key={lead.id} lead={lead} isSelected={selectedLead?.id === lead.id} onSelect={setSelectedLead} />
                    ))
                  )}
                </div>

                {/* Count */}
                {!loading && leads.length > 0 && (
                  <div className="px-3 py-1.5 border-t border-[#1e2028] text-[10px] text-gray-600">
                    {leads.length} lead{leads.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>

              {/* RIGHT — Preview / Edit */}
              <div className="w-[320px] shrink-0 flex flex-col">
                {selectedLead ? (
                  <LeadPreviewEditor
                    lead={selectedLead}
                    onConfirm={() => onSelect(selectedLead)}
                    onSaved={handleLeadSaved}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                    <div className="w-12 h-12 rounded-xl bg-[#1a1d22] flex items-center justify-center mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Selecciona un lead para ver y editar sus datos
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ─── Create Tab ─────────────────────────────────────── */
            <form onSubmit={handleCreate} className="p-4 space-y-3 max-h-[65vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className={labelClass}>Nombre del negocio *</label>
                <input type="text" required value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Hotel La Garbinada" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Contacto *</label>
                  <input type="text" required value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Pere López" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input type="tel" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="973 XXX XXX" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Tipo de negocio</label>
                  <select value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                    className={inputClass}
                  >
                    {BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tier</label>
                  <div className="flex gap-1.5">
                    {(["A", "B", "C"] as LeadTier[]).map((t) => (
                      <button key={t} type="button" onClick={() => setFormData({ ...formData, tier: t })}
                        className={`flex-1 py-2 text-xs font-bold border rounded-lg transition-all ${formData.tier === t ? TIER_STYLES[t] : "border-[#2a2d35] bg-[#0a0a0a] text-gray-600"}`}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Ubicación</label>
                  <input type="text" value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Lleida" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Ticket estimado (€)</label>
                  <input type="number" value={formData.estimatedTicket || ""}
                    onChange={(e) => setFormData({ ...formData, estimatedTicket: Number(e.target.value) })}
                    placeholder="5000" className={inputClass} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-medium border border-[#2a2d35] text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-all"
                >Cancelar</button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 text-xs font-semibold bg-molten-copper text-white hover:bg-molten-copper/90 active:scale-[0.98] rounded-lg transition-all disabled:opacity-50"
                >{creating ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creando...</span> : "Crear y Cargar al Canvas"}</button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════════════════════════ */

function TabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${active ? "text-white border-molten-copper" : "text-gray-500 border-transparent hover:text-gray-300"}`}
    >{label}</button>
  );
}

/* ─── Lead Row ────────────────────────────────────────────────── */
function LeadRow({ lead, isSelected, onSelect }: { lead: Lead; isSelected: boolean; onSelect: (l: Lead) => void }) {
  const icon = BIZ_ICONS[lead.businessType] || "📍";
  const tierStyle = TIER_STYLES[lead.tier] || TIER_STYLES.C;
  return (
    <button onClick={() => onSelect(lead)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left group ${
        isSelected ? "bg-molten-copper/8 border border-molten-copper/20" : "border border-transparent hover:bg-[#1a1d22]"
      }`}
    >
      <span className="text-sm shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-semibold truncate transition-colors ${isSelected ? "text-molten-copper" : "text-white group-hover:text-molten-copper"}`}>{lead.businessName}</p>
        <p className="text-[10px] text-gray-500 truncate">{lead.contactName || lead.location || lead.businessType}</p>
      </div>
      <span className={`text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded border shrink-0 ${tierStyle}`}>{lead.tier}</span>
      <span className="text-[10px] font-bold text-industrial-gold shrink-0 tabular-nums">€{lead.estimatedTicket.toLocaleString("es-ES")}</span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LeadPreviewEditor — Inline editing with debounced auto-save
   ═══════════════════════════════════════════════════════════════════ */
function LeadPreviewEditor({
  lead,
  onConfirm,
  onSaved,
}: {
  lead: Lead;
  onConfirm: () => void;
  onSaved: (updated: Lead) => void;
}) {
  /* Local draft state — initialised from the lead prop */
  const [draft, setDraft] = useState<Lead>(lead);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDraft = useRef(draft);
  latestDraft.current = draft;

  /* Reset draft when a different lead is selected */
  useEffect(() => {
    setDraft(lead);
    setSaveStatus("idle");
  }, [lead.id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Debounced auto-save via PUT ──────────────────────────────── */
  const scheduleAutoSave = useCallback(() => {
    setSaveStatus("idle");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/dashboard/leads/${latestDraft.current.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(latestDraft.current),
        });
        const data = await res.json();
        if (data.lead) {
          onSaved(data.lead);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    }, 800);
  }, [onSaved]);

  /* Cleanup timer on unmount */
  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  /* ─── Field updater ────────────────────────────────────────────── */
  const updateField = useCallback(
    <K extends keyof Lead>(key: K, value: Lead[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
      scheduleAutoSave();
    },
    [scheduleAutoSave]
  );

  const icon = BIZ_ICONS[draft.businessType] || "📍";
  const tierStyle = TIER_STYLES[draft.tier] || TIER_STYLES.C;
  const status = STATUS_MAP[draft.status] || { label: draft.status, color: "text-gray-400" };

  const fieldInputClass =
    "w-full bg-transparent text-[12px] text-white px-2 py-1 rounded border border-transparent hover:border-[#2a2d35] focus:border-molten-copper/40 focus:bg-[#0a0a0a] focus:outline-none transition-all";

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-[#1e2028]">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">{icon}</span>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={draft.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-white border border-transparent hover:border-[#2a2d35] focus:border-molten-copper/40 focus:bg-[#0a0a0a] focus:outline-none rounded px-1 py-0.5 transition-all -ml-1"
            />
            <p className="text-[10px] text-gray-500 mt-0.5 px-1">
              {BIZ_LABELS[draft.businessType] || draft.businessType}
            </p>
          </div>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${tierStyle}`}>
            Tier {draft.tier}
          </span>
        </div>
        {/* Save indicator */}
        <div className="flex items-center justify-end mt-1.5 h-3">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className="w-2.5 h-2.5 border border-gray-500 border-t-gray-300 rounded-full animate-spin" />
              Guardando...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-[10px] text-emerald-500">✓ Guardado</span>
          )}
          {saveStatus === "error" && (
            <span className="text-[10px] text-red-400">✕ Error al guardar</span>
          )}
        </div>
      </div>

      {/* ─── Editable Fields ─────────────────────────────────────── */}
      <div className="flex-1 p-4 space-y-2.5 overflow-y-auto custom-scrollbar">
        {/* Status */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Estado</p>
          <select
            value={draft.status}
            onChange={(e) => updateField("status", e.target.value as Lead["status"])}
            className="w-full bg-transparent text-[12px] px-2 py-1 rounded border border-transparent hover:border-[#2a2d35] focus:border-molten-copper/40 focus:bg-[#0a0a0a] focus:outline-none transition-all cursor-pointer"
            style={{ color: status.color === "text-blue-400" ? "#60a5fa" : status.color === "text-amber-400" ? "#fbbf24" : status.color === "text-purple-400" ? "#c084fc" : status.color === "text-orange-400" ? "#fb923c" : status.color === "text-emerald-400" ? "#34d399" : "#f87171" }}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_MAP[s].label}</option>
            ))}
          </select>
        </div>

        {/* Tier */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Tier</p>
          <div className="flex gap-1 px-1">
            {(["A", "B", "C"] as LeadTier[]).map((t) => (
              <button key={t} onClick={() => updateField("tier", t)}
                className={`flex-1 py-1 text-[10px] font-bold rounded border transition-all ${draft.tier === t ? TIER_STYLES[t] : "border-[#2a2d35] text-gray-600 hover:text-gray-400"}`}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Ticket */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Ticket Estimado (€)</p>
          <input
            type="number"
            value={draft.estimatedTicket || ""}
            onChange={(e) => updateField("estimatedTicket", Number(e.target.value))}
            className={fieldInputClass + " font-bold text-industrial-gold"}
          />
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Contacto</p>
          <input type="text" value={draft.contactName || ""}
            onChange={(e) => updateField("contactName", e.target.value)}
            placeholder="Nombre del contacto"
            className={fieldInputClass} />
        </div>

        {/* Phone */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Teléfono</p>
          <input type="tel" value={draft.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="973 XXX XXX"
            className={fieldInputClass} />
        </div>

        {/* Email */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Email</p>
          <input type="email" value={draft.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="contacto@email.com"
            className={fieldInputClass} />
        </div>

        {/* Location */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Ubicación</p>
          <input type="text" value={draft.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Ciudad"
            className={fieldInputClass} />
        </div>

        {/* Business Type */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Tipo de negocio</p>
          <select
            value={draft.businessType}
            onChange={(e) => updateField("businessType", e.target.value as BusinessType)}
            className="w-full bg-transparent text-[12px] text-white px-2 py-1 rounded border border-transparent hover:border-[#2a2d35] focus:border-molten-copper/40 focus:bg-[#0a0a0a] focus:outline-none transition-all cursor-pointer"
          >
            {BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 px-2">Notas</p>
          <textarea
            value={draft.notes || ""}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Observaciones..."
            rows={3}
            className={fieldInputClass + " resize-none"}
          />
        </div>
      </div>

      {/* ─── Confirm Button ──────────────────────────────────────── */}
      <div className="p-3 border-t border-[#1e2028]">
        <button onClick={onConfirm}
          className="w-full py-2.5 text-xs font-semibold bg-molten-copper text-white rounded-lg hover:bg-molten-copper/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Cargar al Canvas
        </button>
      </div>
    </div>
  );
}
