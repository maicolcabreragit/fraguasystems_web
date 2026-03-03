"use client";

import { motion } from "framer-motion";
import { TrustBadge } from "@/components/ui/TrustBadge";

/* ═══════════════════════════════════════════════════════════════════
   TrustBar — Institutional Validation Layer

   Certifications and compliance badges ONLY.
   No fake client logos — real credibility only.
   ═══════════════════════════════════════════════════════════════════ */

const certifications = [
  {
    icon: "⬡",
    label: "VeriFactu Ready",
    sublabel: "Certificado 2026/2027",
  },
  {
    icon: "◈",
    label: "SES.Hospedajes",
    sublabel: "Integración Oficial",
  },
  {
    icon: "◇",
    label: "GDPR Europa",
    sublabel: "Servidores en Alemania",
  },
  {
    icon: "⬢",
    label: "PCI-DSS",
    sublabel: "Pagos Tokenizados",
  },
];

const techStack = [
  "Next.js",
  "React",
  "Node.js",
  "PostgreSQL",
  "Stripe API",
  "Hetzner Cloud",
  "Vercel",
  "OpenAI",
];

export function TrustBar() {
  return (
    <section
      id="trust"
      className="relative py-16 md:py-20 border-t border-b border-brushed-steel/15"
    >
      {/* Subtle top/bottom gradient fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, rgba(14,15,18,0.8) 0%, transparent 20%, transparent 80%, rgba(14,15,18,0.8) 100%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        {/* ─── Certification Badges ────────────────────────── */}
        <div className="flex flex-col items-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.25em] text-machine-gray/60 mb-6"
          >
            Certificaciones y Cumplimiento Normativo
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {certifications.map((cert, i) => (
              <TrustBadge
                key={cert.label}
                icon={cert.icon}
                label={cert.label}
                sublabel={cert.sublabel}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>

        {/* ─── Divider ─────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brushed-steel/30 to-transparent" />
          <span className="text-xs text-machine-gray/40 uppercase tracking-[0.2em]">
            Stack Tecnológico
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-brushed-steel/30 to-transparent" />
        </div>

        {/* ─── Tech Stack Tags ─────────────────────────────── */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          {techStack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 22,
                delay: 0.3 + i * 0.05,
              }}
              className="
                px-4 py-2 rounded-lg text-xs font-medium tracking-wide
                text-machine-gray/70 border border-brushed-steel/15
                bg-forged-slate/20 hover:border-molten-copper/30
                hover:text-titanium-white transition-all duration-300
              "
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
