"use client";

import { motion } from "framer-motion";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   BottomFunnel — "The Luxury of Void"
   
   PRD Spec (Section 6.5):
   - Pure Abyss Black, no textures. Massive negative space.
   - Final value reminder H2
   - Replicated CTA: Molten Copper
   - Zero secondary links. Zero footer distraction.
   - Goal: Force the decision. No escape routes.
   ═══════════════════════════════════════════════════════════════════ */

export function BottomFunnel() {
  return (
    <section
      id="cierre"
      className="relative"
      style={{ background: "var(--color-abyss-black)" }}
    >
      {/* ─── Top gradient fade from previous section ─────── */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--color-abyss-black) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ─── Content — Maximum emptiness, maximum focus ──── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-40 md:py-52 lg:py-64">

        {/* Subtle copper line — visual anchor */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-16 h-px bg-molten-copper/50 mb-12 origin-center"
          aria-hidden="true"
        />

        {/* The question */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.15 }}
          className="font-display font-bold text-titanium-white max-w-3xl mb-6"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          ¿Listo para blindar la infraestructura
          <br className="hidden md:block" />
          {" "}de su negocio?
        </motion.h2>

        {/* Single supporting line */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.25 }}
          className="text-machine-gray text-lg max-w-xl mb-12 leading-relaxed"
        >
          Auditoría arquitectónica sin compromiso. Analizamos su infraestructura
          actual y le entregamos un plan de migración con ROI proyectado.
        </motion.p>

        {/* CTA — The only action */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.35 }}
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
        </motion.div>

        {/* Direct contact line — minimal, no distraction */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 text-sm text-machine-gray/40"
        >
          O contacte directamente:{" "}
          <a
            href="mailto:ingenieria@fraguasystems.com"
            className="text-machine-gray/60 hover:text-molten-copper transition-colors duration-300 underline underline-offset-4 decoration-brushed-steel/30"
          >
            ingenieria@fraguasystems.com
          </a>
        </motion.p>
      </div>

      {/* ─── Minimal footer — just copyright ─────────────── */}
      <div className="border-t border-brushed-steel/10 py-6 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <span className="text-xs text-machine-gray/30 font-mono tracking-wider">
            © 2026 FRAGUA SYSTEMS
          </span>
          <span className="text-xs text-machine-gray/20 font-mono">
            Lleida, Catalunya
          </span>
        </div>
      </div>
    </section>
  );
}
