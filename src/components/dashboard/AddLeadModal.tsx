"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LeadTier, BusinessType } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   Add Lead Modal — Form for creating new leads
   ═══════════════════════════════════════════════════════════════════ */

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "hotel", label: "Hotel" },
  { value: "rural", label: "Turismo Rural" },
  { value: "restaurante", label: "Restaurante" },
  { value: "apartamentos", label: "Apartamentos" },
  { value: "bar", label: "Bar / Café" },
  { value: "otro", label: "Otro" },
];

const PAIN_OPTIONS = [
  "SES.Hospedajes",
  "VeriFactu",
  "Web obsoleta",
  "Sin reservas online",
  "Comisiones OTAs",
  "Sin presencia digital",
  "Gestión manual",
];

export function AddLeadModal({ isOpen, onClose, onSubmit }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    contactRole: "",
    phone: "",
    email: "",
    businessType: "hotel" as BusinessType,
    tier: "B" as LeadTier,
    location: "Lleida",
    size: "",
    painPoints: [] as string[],
    estimatedTicket: 0,
    nextAction: "",
    nextActionDate: "",
    notes: "",
    assignedTo: "admin-socio",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: "nuevo",
    });
    setFormData({
      businessName: "",
      contactName: "",
      contactRole: "",
      phone: "",
      email: "",
      businessType: "hotel",
      tier: "B",
      location: "Lleida",
      size: "",
      painPoints: [],
      estimatedTicket: 0,
      nextAction: "",
      nextActionDate: "",
      notes: "",
      assignedTo: "admin-socio",
    });
    onClose();
  };

  const togglePain = (pain: string) => {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.includes(pain)
        ? prev.painPoints.filter((p) => p !== pain)
        : [...prev.painPoints, pain],
    }));
  };

  const inputClass = `
    w-full px-3 py-2.5 text-sm bg-[#0f1013] border border-brushed-steel/15
    text-titanium-white placeholder:text-machine-gray/30
    focus:outline-none focus:border-molten-copper/40 focus:ring-1 focus:ring-molten-copper/15
    transition-all duration-200
  `;

  const labelClass = "block text-[11px] font-medium text-machine-gray/60 uppercase tracking-wider mb-1.5";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141619] border border-brushed-steel/15 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-brushed-steel/10">
              <h2 className="text-base font-semibold text-titanium-white">
                Nuevo Lead
              </h2>
              <button
                onClick={onClose}
                className="text-machine-gray/50 hover:text-titanium-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Business Name */}
              <div>
                <label className={labelClass}>Nombre del negocio *</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Hotel La Garbinada"
                  className={inputClass}
                />
              </div>

              {/* Contact row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Contacto *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Pere López"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Cargo</label>
                  <input
                    type="text"
                    value={formData.contactRole}
                    onChange={(e) => setFormData({ ...formData, contactRole: e.target.value })}
                    placeholder="Director"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="973 XXX XXX"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contacto@hotel.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Business type & Tier */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Tipo de negocio</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                    className={inputClass}
                  >
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tier</label>
                  <div className="flex gap-2">
                    {(["A", "B", "C"] as LeadTier[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, tier: t })}
                        className={`
                          flex-1 py-2.5 text-sm font-medium border transition-all
                          ${formData.tier === t
                            ? t === "A"
                              ? "border-red-500/40 bg-red-500/10 text-red-400"
                              : t === "B"
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                : "border-blue-500/40 bg-blue-500/10 text-blue-400"
                            : "border-brushed-steel/15 bg-[#0f1013] text-machine-gray/50"
                          }
                        `}
                      >
                        {t === "A" ? "🔥 A" : t === "B" ? "🟡 B" : "🔵 C"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Lleida"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tamaño</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="12 habitaciones"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Pain Points */}
              <div>
                <label className={labelClass}>Puntos de dolor</label>
                <div className="flex flex-wrap gap-1.5">
                  {PAIN_OPTIONS.map((pain) => (
                    <button
                      key={pain}
                      type="button"
                      onClick={() => togglePain(pain)}
                      className={`
                        text-[11px] px-2.5 py-1 border transition-all
                        ${formData.painPoints.includes(pain)
                          ? "border-molten-copper/40 bg-molten-copper/10 text-molten-copper"
                          : "border-brushed-steel/15 bg-[#0f1013] text-machine-gray/50 hover:text-machine-gray"
                        }
                      `}
                    >
                      {pain}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ticket & Next Action */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Ticket estimado (€)</label>
                  <input
                    type="number"
                    value={formData.estimatedTicket || ""}
                    onChange={(e) => setFormData({ ...formData, estimatedTicket: Number(e.target.value) })}
                    placeholder="3000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Fecha próxima acción</label>
                  <input
                    type="date"
                    value={formData.nextActionDate}
                    onChange={(e) => setFormData({ ...formData, nextActionDate: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Próxima acción</label>
                <input
                  type="text"
                  value={formData.nextAction}
                  onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                  placeholder="Llamar para agendar reunión"
                  className={inputClass}
                />
              </div>

              {/* Notes */}
              <div>
                <label className={labelClass}>Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm border border-brushed-steel/15 text-machine-gray hover:text-titanium-white hover:border-brushed-steel/30 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-sm font-semibold bg-molten-copper text-white hover:bg-molten-copper/90 active:scale-[0.98] transition-all"
                >
                  Crear Lead
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
