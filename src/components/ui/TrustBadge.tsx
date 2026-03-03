"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   TrustBadge — "Liquid Glass" Certification Insignia
   
   Glassmorphism badge with:
   - Reflective 1px top border (specular highlight)
   - Industrial Gold border glow
   - Subtle backdrop blur
   - Spring entrance animation
   ═══════════════════════════════════════════════════════════════════ */

interface TrustBadgeProps {
  icon: string;
  label: string;
  sublabel?: string;
  delay?: number;
}

export function TrustBadge({ icon, label, sublabel, delay = 0 }: TrustBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay,
      }}
      className="
        group relative
        inline-flex items-center gap-3
        px-5 py-3
        rounded-full
        bg-forged-slate/50
        backdrop-blur-md
        border border-industrial-gold/20
        transition-all duration-500
        hover:border-industrial-gold/40
        hover:bg-forged-slate/70
      "
    >
      {/* Top specular highlight — simulates glass edge refraction */}
      <div
        className="absolute inset-x-3 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.15) 30%, rgba(255,255,255,0.08) 50%, rgba(212,175,55,0.15) 70%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Icon */}
      <span className="text-industrial-gold text-sm flex-shrink-0" aria-hidden="true">
        {icon}
      </span>

      {/* Label stack */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-titanium-white leading-tight tracking-wide">
          {label}
        </span>
        {sublabel && (
          <span className="text-xs text-machine-gray leading-tight mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}
