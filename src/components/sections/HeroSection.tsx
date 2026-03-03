"use client";

import { motion } from "framer-motion";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   HeroSection — "The Critical 3-Second Impact"
   
   PRD Spec (Section 6.1):
   - Abyss Black background with WebGL placeholder (right)
   - H1: Frontal, no ambiguity → IBM Plex Sans Bold
   - H2: Concrete, focused on pain + legal risk mitigation
   - CTA: Molten Copper, "Solicitar Auditoría Arquitectónica"
   - Secondary CTA: Ghost variant
   ═══════════════════════════════════════════════════════════════════ */

// Stagger orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 22,
    },
  },
};

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ─── Background ambient glow ──────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 75% 40%, rgba(200,106,61,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 20% 80%, rgba(46,53,66,0.4) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ─── Content Grid ──────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* ═══ LEFT: Copy + CTAs ═══════════════════════════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Eyebrow / Category Label */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper">
                <span
                  className="inline-block w-8 h-px bg-molten-copper"
                  aria-hidden="true"
                />
                Ingeniería de Software HORECA
              </span>
            </motion.div>

            {/* H1 — The Statement */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.25rem)" }}
            >
              <span className="text-titanium-white">
                Ingeniería de{" "}
              </span>
              <span className="text-gradient-copper">
                Software Pesada
              </span>
              <br />
              <span className="text-titanium-white">
                para el Sector
              </span>
              <br />
              <span className="inline-block mt-2 px-4 py-1.5 rounded-button bg-forged-slate/60 border border-brushed-steel/30 text-titanium-white">
                HORECA<span className="text-machine-gray/50">.</span>
              </span>
            </motion.h1>

            {/* H2 — The Pain + Solution */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl leading-relaxed text-machine-gray max-w-xl mb-10"
            >
              Diseñamos{" "}
              <span className="text-titanium-white font-medium">webs de alta conversión</span>,{" "}
              motores de reservas directas, automatización con{" "}
              <span className="text-titanium-white font-medium">IA</span>,{" "}
              cumplimiento normativo{" "}
              (<span className="text-titanium-white font-medium">VeriFactu</span>,{" "}
              <span className="text-titanium-white font-medium">SES.Hospedajes</span>){" "}
              y contenido visual profesional para hoteles y restaurantes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <IndustrialButton variant="primary" href="#contacto">
                Solicitar Auditoría Arquitectónica
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </IndustrialButton>

              <IndustrialButton variant="ghost" href="/casos">
                Ver Casos de Ingeniería
              </IndustrialButton>
            </motion.div>

            {/* Micro-trust line */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-3 text-sm text-machine-gray"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 flex-shrink-0" aria-hidden="true" />
              <span className="text-machine-gray/80">
                Resultados verificables ·{" "}
                <a href="https://www.hotellagarbinada.com" target="_blank" rel="noopener noreferrer" className="text-molten-copper/80 hover:text-molten-copper transition-colors underline underline-offset-2">hotellagarbinada.com</a>
                {" "}en producción
              </span>
            </motion.div>
          </motion.div>

          {/* ═══ RIGHT: WebGL Placeholder ════════════════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.4,
            }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div
              className="
                relative w-full aspect-square max-w-[560px]
                rounded-3xl
                bg-forged-slate/30
                border border-brushed-steel/30
                backdrop-blur-sm
                overflow-hidden
              "
            >
              {/* Animated data mesh placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Concentric rings */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-brushed-steel/20"
                    style={{
                      width: `${55 + i * 20}%`,
                      height: `${55 + i * 20}%`,
                    }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                    transition={{
                      duration: 30 + i * 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {/* Node dots on ring */}
                    {[...Array(3 + i)].map((_, j) => (
                      <motion.div
                        key={j}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            j === 0
                              ? "var(--color-molten-copper)"
                              : "var(--color-brushed-steel)",
                          top: "0%",
                          left: "50%",
                          transform: `rotate(${(360 / (3 + i)) * j}deg) translateY(-50%)`,
                          transformOrigin: `0 ${(55 + i * 20) / 2}%`,
                          boxShadow:
                            j === 0
                              ? "0 0 8px rgba(200,106,61,0.4)"
                              : "none",
                        }}
                        animate={{
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 3 + j,
                          repeat: Infinity,
                          delay: j * 0.5,
                        }}
                      />
                    ))}
                  </motion.div>
                ))}

                {/* Central icon */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-forged-slate/80 border border-brushed-steel/40 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
                      <path
                        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Corner label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-xs text-machine-gray/60 font-mono tracking-wider">
                  FRAGUA.ENGINE v3.2
                </span>
                <motion.div
                  className="flex items-center gap-1.5"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-emerald-500/80 font-mono">
                    ONLINE
                  </span>
                </motion.div>
              </div>

              {/* Top specular edge */}
              <div
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.04) 50%, transparent 90%)",
                }}
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
