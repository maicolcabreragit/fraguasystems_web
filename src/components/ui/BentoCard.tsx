"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════
   BentoCard — A single module in the Bento Grid
   
   PRD Spec (Section 6.3):
   - Background: Forged Slate (#1F232B)
   - Border: 1px solid Brushed Steel (#2E3542) at 50% opacity
   - Corner radius: 16–24px
   - Hover: Magnetic border glow + spring elevation (y:-4, scale:1.01)
   - Specular top-edge highlight
   ═══════════════════════════════════════════════════════════════════ */

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  /** Grid span classes, e.g. "col-span-2 row-span-2" */
  span?: string;
  delay?: number;
  /** Magnetic border glow CSS (passed from useMagneticBorder) */
  glowStyle?: string;
  borderGlowStyle?: string;
}

export function BentoCard({
  children,
  className = "",
  span = "",
  delay = 0,
  glowStyle,
  borderGlowStyle,
}: BentoCardProps) {
  return (
    <motion.div
      data-magnetic
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -4, scale: 1.008 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 22,
        delay,
      }}
      className={`
        relative group
        rounded-glass-lg
        border border-brushed-steel/30
        bg-forged-slate/60
        overflow-hidden
        transition-[border-color] duration-500
        hover:border-brushed-steel/50
        ${span}
        ${className}
      `}
      style={{
        "--mx": "50%",
        "--my": "50%",
        "--mi": "0",
      } as React.CSSProperties}
    >
      {/* ─── Magnetic border glow layer ───────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none rounded-glass-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowStyle }}
        aria-hidden="true"
      />

      {/* ─── Border glow (brighter, tighter) ──────────────── */}
      <div
        className="absolute inset-0 pointer-events-none rounded-glass-lg"
        style={{
          background: borderGlowStyle,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
          opacity: "var(--mi, 0)",
        } as React.CSSProperties}
        aria-hidden="true"
      />

      {/* ─── Top specular edge — glass refraction ─────────── */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.04) 50%, transparent 85%)",
        }}
        aria-hidden="true"
      />

      {/* ─── Content ──────────────────────────────────────── */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
