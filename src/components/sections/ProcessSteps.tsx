"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   ProcessSteps — "Cómo Trabajamos"
   
   Builds trust by showing the CEO exactly what happens after contact.
   4 steps: Auditoría → Arquitectura → Implementación → Lanzamiento
   
   Design: Horizontal timeline on desktop, vertical on mobile.
   - Number markers with Industrial Gold accents
   - Connecting line between steps
   - Staggered entrance animations
   ═══════════════════════════════════════════════════════════════════ */

const steps = [
  {
    number: "01",
    title: "Auditoría Técnica",
    description:
      "Analizamos su infraestructura actual: PMS, canales de distribución, procesos operativos y compliance regulatorio.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Diseño Arquitectónico",
    description:
      "Le entregamos un blueprint detallado: stack tecnológico, diagrama de integraciones, plan de migración y ROI proyectado.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h18M9 3v18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Implementación",
    description:
      "Desarrollo iterativo con entregas semanales verificables. Cada módulo se despliega en producción y se valida con datos reales.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Lanzamiento & Soporte",
    description:
      "Migración asistida en vivo, formación de su equipo, y soporte técnico continuado con SLA garantizado.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 22 },
  },
};

export function ProcessSteps() {
  return (
    <section id="proceso" className="relative py-24 md:py-32 overflow-hidden">
      {/* ─── Section Header ──────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Proceso de Ejecución
          </span>
          <h2 className="font-display font-bold text-titanium-white mb-4">
            De diagnóstico a producción.{" "}
            <span className="text-gradient-copper">Sin fricciones.</span>
          </h2>
          <p className="text-lg text-machine-gray leading-relaxed">
            Un proceso de ingeniería estructurado que elimina la incertidumbre
            y le permite tomar decisiones informadas en cada fase.
          </p>
        </motion.div>
      </div>

      {/* ─── Steps Grid ──────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {/* Connecting line (desktop only) */}
          <div
            className="hidden lg:block absolute top-[72px] left-[calc(12.5%+12px)] right-[calc(12.5%+12px)] h-px"
            style={{
              background:
                "linear-gradient(90deg, var(--color-molten-copper) 0%, var(--color-brushed-steel) 30%, var(--color-brushed-steel) 70%, var(--color-molten-copper) 100%)",
              opacity: 0.25,
            }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative group"
            >
              {/* Step card */}
              <div className="
                relative
                rounded-glass-lg
                border border-brushed-steel/20
                bg-forged-slate/30
                p-7
                transition-all duration-500
                hover:border-brushed-steel/40
                hover:bg-forged-slate/50
                h-full flex flex-col
              ">
                {/* Top specular */}
                <div
                  className="absolute inset-x-0 top-0 h-px pointer-events-none rounded-t-glass-lg"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.03) 50%, transparent 85%)",
                  }}
                  aria-hidden="true"
                />

                {/* Number + Icon row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-molten-copper/10 border border-molten-copper/20">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-display font-bold text-brushed-steel/30 tabular-nums group-hover:text-brushed-steel/50 transition-colors duration-500">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg text-titanium-white mb-2 tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-machine-gray leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step connector dot (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-[72px] -right-3 w-1.5 h-1.5 rounded-full bg-brushed-steel/40 z-10"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
