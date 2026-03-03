"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   AboutUs — "Sobre Nosotros"

   Replaces EmpiricalProof. Split layout:
   - Left: image placeholder (will be replaced with real photo)
   - Right: Compelling copy about the agency
   ═══════════════════════════════════════════════════════════════════ */

export function AboutUs() {
  return (
    <section id="nosotros" className="relative py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* ─── Section label ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Sobre Nosotros
          </span>
        </motion.div>

        {/* ─── Two-column layout ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── LEFT: Image placeholder ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-brushed-steel/20 bg-forged-slate/30">
              {/* Placeholder — will be replaced with a real team/office photo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {/* Abstract visual representing engineering */}
                <div className="relative w-32 h-32">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-2xl border border-molten-copper/20"
                      style={{
                        transform: `rotate(${i * 15}deg) scale(${1 - i * 0.12})`,
                      }}
                      animate={{ rotate: [i * 15, i * 15 + 360] }}
                      transition={{
                        duration: 40 + i * 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-display font-bold text-molten-copper/40">FS</span>
                  </div>
                </div>
                <span className="text-xs text-machine-gray/40 font-mono tracking-wider">
                  LLEIDA · ESPAÑA
                </span>
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

          {/* ── RIGHT: Copy ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.1 }}
          >
            <h2
              className="font-display font-bold text-titanium-white mb-6 leading-tight"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              Ingenieros que entienden{" "}
              <span className="text-gradient-copper">la cuenta de resultados</span>{" "}
              de su negocio.
            </h2>

            <div className="space-y-5 text-machine-gray leading-relaxed">
              <p>
                Somos un equipo de ingeniería de software especializado exclusivamente en el sector
                <strong className="text-titanium-white font-medium"> HORECA</strong>. No hacemos webs genéricas
                — construimos <strong className="text-titanium-white font-medium">infraestructuras digitales de misión crítica</strong> para
                hoteles, restaurantes y grupos de hostelería que necesitan resultados medibles.
              </p>

              <p>
                Conocemos de primera mano los dolores operativos del sector: las comisiones abusivas
                de las OTA, los plazos imposibles de{" "}
                <strong className="text-titanium-white font-medium">VeriFactu</strong> y{" "}
                <strong className="text-titanium-white font-medium">SES.Hospedajes</strong>,
                la gestión de temporeros, las multas por incumplimiento normativo y la necesidad de
                vender directo para sobrevivir.
              </p>

              <p>
                Cada proyecto que ejecutamos tiene un único KPI:{" "}
                <strong className="text-titanium-white font-medium">impacto en su cuenta de resultados</strong>.
                Ya sea recuperando márgenes cedidos a intermediarios, automatizando procesos que consumen
                decenas de horas semanales o blindando su negocio ante la regulación que ya está aquí.
              </p>
            </div>

            {/* ── Key differentiators ─────────────────────── */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  className="text-center p-4 rounded-xl border border-brushed-steel/15 bg-forged-slate/20"
                >
                  <div className="text-2xl font-display font-bold text-molten-copper mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs text-machine-gray/70">
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
