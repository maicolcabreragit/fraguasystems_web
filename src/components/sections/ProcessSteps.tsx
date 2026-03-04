"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   ProcessSteps — Industrial Clean v2.0 (Stimulo "Com ho fem?" inspired)
   
   Dark background section, 4 cards with copper gradient,
   sharp corners, numbered steps.
   ═══════════════════════════════════════════════════════════════════ */

const steps = [
  {
    number: "01",
    title: "Auditoría Técnica",
    description:
      "Analizamos su infraestructura actual: PMS, canales de distribución, procesos operativos y compliance regulatorio.",
  },
  {
    number: "02",
    title: "Diseño Arquitectónico",
    description:
      "Le entregamos un blueprint detallado: stack tecnológico, diagrama de integraciones, plan de migración y ROI proyectado.",
  },
  {
    number: "03",
    title: "Implementación",
    description:
      "Desarrollo iterativo con entregas semanales verificables. Cada módulo se despliega en producción y se valida con datos reales.",
  },
  {
    number: "04",
    title: "Lanzamiento & Soporte",
    description:
      "Migración asistida en vivo, formación de su equipo, y soporte técnico continuado con SLA garantizado.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
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
    <section id="proceso" className="section-dark relative py-24 md:py-32 overflow-hidden">
      {/* ─── Section Header ──────────────────────────────── */}
      <div className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px] mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Proceso de Ejecución
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
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
      <div className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group"
            >
              <div
                className="
                  relative h-full p-8
                  border border-brushed-steel/20
                  transition-all duration-500
                  hover:border-molten-copper/30
                "
                style={{
                  background: `linear-gradient(135deg, rgba(200,106,61,0.04) 0%, rgba(200,106,61,0.10) 100%)`,
                }}
              >
                {/* Number */}
                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-industrial-gold/40 tabular-nums group-hover:text-industrial-gold/70 transition-colors duration-500">
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg text-titanium-white mb-3 tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-machine-gray leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
