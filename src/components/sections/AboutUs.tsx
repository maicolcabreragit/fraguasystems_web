"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   AboutUs — Industrial Clean v2.0 (Stimulo Team-inspired)
   
   Light background, 50/50 layout, giant stats.
   ═══════════════════════════════════════════════════════════════════ */

export function AboutUs() {
  return (
    <section id="nosotros" className="section-dark py-24 md:py-32 border-t border-brushed-steel/30">
      <div className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px]">
        {/* ─── Two-column layout ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── LEFT: Visual ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-forged-slate">
              {/* Placeholder — professional visual */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-forged-slate to-abyss-black">
                <span className="font-display font-bold text-6xl text-titanium-white/10 tracking-tight">
                  FS
                </span>
                <span className="text-xs text-machine-gray/40 font-medium uppercase tracking-[0.2em]">
                  Lleida · Catalunya · España
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Copy ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-6">
              <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
              Sobre Nosotros
            </span>

            <h2
              className="font-display font-bold text-titanium-white mb-8 leading-tight"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
            >
              Ingenieros que entienden{" "}
              <span className="text-gradient-copper">la cuenta de resultados</span>{" "}
              de su negocio.
            </h2>

            <div className="space-y-5 text-soft-gray leading-relaxed">
              <p>
                Somos un equipo de ingeniería de software especializado exclusivamente en el sector{" "}
                <strong className="text-titanium-white font-medium">HORECA</strong>. No hacemos webs genéricas
                — construimos <strong className="text-titanium-white font-medium">infraestructuras digitales de misión crítica</strong>{" "}
                para hoteles, restaurantes y grupos de hostelería que necesitan resultados medibles.
              </p>

              <p>
                Conocemos de primera mano los dolores operativos del sector: las comisiones abusivas
                de las OTA, los plazos imposibles de{" "}
                <strong className="text-ink-black font-medium">VeriFactu</strong> y{" "}
                <strong className="text-ink-black font-medium">SES.Hospedajes</strong>,
                la gestión de temporeros, y la necesidad de vender directo para sobrevivir.
              </p>
            </div>

            {/* ── Stats — Giant numbers (Stimulo-style) ─────── */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-brushed-steel/30 pt-10">
              {[
                { value: "100+", label: "Servicios especializados" },
                { value: "100%", label: "Sector HORECA" },
                { value: "24/7", label: "Soporte de misión crítica" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200, damping: 22 }}
                >
                  <div
                    className="font-display font-bold text-titanium-white mb-1"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs text-soft-gray leading-snug">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
