"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   ContactForm — Lead Capture for B2B High-Ticket
   
   Minimalist form for CEO-level prospects:
   - Name, Email, Hotel/Company, Message
   - Glassmorphism card (Liquid Glass)
   - Success state with confirmation
   - No unnecessary fields — reduce friction
   ═══════════════════════════════════════════════════════════════════ */

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

const inputClasses = `
  w-full px-4 py-3.5
  bg-abyss-black/60
  border border-brushed-steel/25
  rounded-button
  text-titanium-white text-sm
  placeholder:text-machine-gray/40
  focus:outline-none focus:border-molten-copper/50 focus:ring-1 focus:ring-molten-copper/20
  transition-all duration-300
  font-body
`;

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call — will be connected to a real endpoint
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSubmitted(true);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contacto" className="relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* ═══ LEFT: Copy ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
              <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
              Contacto Directo
            </span>
            <h2 className="font-display font-bold text-titanium-white mb-5">
              Solicite su{" "}
              <span className="text-gradient-copper">Auditoría Arquitectónica</span>
            </h2>
            <p className="text-lg text-machine-gray leading-relaxed mb-10">
              Analizamos su infraestructura tecnológica actual y le entregamos un
              plan detallado de migración con ROI proyectado. Sin compromiso,
              sin letra pequeña.
            </p>

            {/* What you get */}
            <div className="space-y-5">
              {[
                {
                  icon: "◆",
                  title: "Diagnóstico de infraestructura",
                  desc: "Auditoría completa de su PMS, canales de venta y compliance.",
                },
                {
                  icon: "◆",
                  title: "Plan de migración a medida",
                  desc: "Hoja de ruta técnica con fases, plazos y costes transparentes.",
                },
                {
                  icon: "◆",
                  title: "Proyección de ROI verificable",
                  desc: "Cifras concretas de ahorro en comisiones y reducción de OPEX.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-molten-copper text-xs mt-1 flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-titanium-white mb-0.5">{item.title}</p>
                    <p className="text-sm text-machine-gray">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ═══ RIGHT: Form ══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.15 }}
          >
            <div className="glass-lg p-8 md:p-10">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="cf-name" className="block text-xs font-medium text-machine-gray mb-2 uppercase tracking-wider">
                      Nombre completo
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Ej: Antonio García López"
                      className={inputClasses}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="cf-email" className="block text-xs font-medium text-machine-gray mb-2 uppercase tracking-wider">
                      Email corporativo
                    </label>
                    <input
                      id="cf-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Ej: a.garcia@granpirineos.com"
                      className={inputClasses}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="cf-company" className="block text-xs font-medium text-machine-gray mb-2 uppercase tracking-wider">
                      Hotel / Restaurante / Grupo
                    </label>
                    <input
                      id="cf-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Ej: Grand Pirineos Hotel & Spa / Restaurante Cal Xirlu"
                      className={inputClasses}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="cf-message" className="block text-xs font-medium text-machine-gray mb-2 uppercase tracking-wider">
                      ¿Cuál es su mayor desafío operativo?
                    </label>
                    <textarea
                      id="cf-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Ej: Necesitamos automatizar el envío a SES.Hospedajes y reducir la dependencia de Booking..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <IndustrialButton variant="primary" className="w-full !justify-center">
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block w-4 h-4 border-2 border-titanium-white/30 border-t-titanium-white rounded-full"
                          />
                          Procesando...
                        </span>
                      ) : (
                        "Solicitar Auditoría Gratuita"
                      )}
                    </IndustrialButton>
                  </div>

                  {/* Privacy note */}
                  <p className="text-[11px] text-machine-gray/40 text-center leading-relaxed pt-1">
                    Sus datos están protegidos bajo el RGPD.
                    Servidores en Europa (Hetzner, Alemania).
                    No compartimos información con terceros.
                  </p>
                </form>
              ) : (
                /* ─── Success state ──────────────────────────── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <h3 className="font-display font-semibold text-xl text-titanium-white mb-2">
                    Solicitud recibida
                  </h3>
                  <p className="text-machine-gray text-sm leading-relaxed max-w-xs mx-auto">
                    Nuestro equipo de ingeniería revisará su caso y le contactará
                    en un plazo máximo de 24 horas laborables.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
