"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   TrustBar — Industrial Clean v2.0
   
   Light background, monochromatic badges, regulatory seals.
   ═══════════════════════════════════════════════════════════════════ */

const badges = [
  { label: "VeriFactu Ready", sublabel: "2026/2027" },
  { label: "SES.Hospedajes", sublabel: "Integración Oficial" },
  { label: "RGPD", sublabel: "Servidores EU" },
  { label: "SOC 2", sublabel: "Compliant" },
];

export function TrustBar() {
  return (
    <section className="section-light py-16 md:py-20 border-b border-border-light">
      <div className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Label */}
          <p className="text-xs uppercase tracking-[0.2em] text-soft-gray mb-10 font-medium">
            Certificaciones y cumplimiento
          </p>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-3xl">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 22 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-3 border border-border-light bg-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-display font-semibold text-ink-black">{badge.label}</p>
                <p className="text-xs text-soft-gray mt-0.5">{badge.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
