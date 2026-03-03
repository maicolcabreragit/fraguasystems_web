"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════════════════════
   IndustrialButton — The "Herraje Digital" of Fragua Systems
   
   A CTA button that feels like forged metal:
   - Spring physics with high stiffness & heavy damping (industrial actuator)
   - Real-time shimmer gradient tracking cursor position (brushed titanium)
   - Magnetic hover glow (Molten Copper radiance)
   - Scale response calibrated for "weight" perception
   ═══════════════════════════════════════════════════════════════════ */

const SPRING_HOVER = { type: "spring" as const, stiffness: 400, damping: 25, mass: 0.5 };

interface IndustrialButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function IndustrialButton({
  children,
  variant = "primary",
  href,
  className = "",
  onClick,
}: IndustrialButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);

  // Smoothed spring values for the shimmer position
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 20 });

  // Subscribe to spring values and update shimmer via CSS vars (no re-renders)
  if (typeof window !== "undefined") {
    springX.on("change", (v) => {
      shimmerRef.current?.style.setProperty("--sx", `${(v * 100).toFixed(1)}%`);
    });
    springY.on("change", (v) => {
      shimmerRef.current?.style.setProperty("--sy", `${(v * 100).toFixed(1)}%`);
      // Glow peaks at center (0.5), fades at edges
      const glow = 0.06 + 0.12 * (1 - Math.abs(v - 0.5) * 2);
      shimmerRef.current?.style.setProperty("--glow", glow.toFixed(3));
    });
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width);
      rawY.set((e.clientY - rect.top) / rect.height);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.5);
  }, [rawX, rawY]);

  const isPrimary = variant === "primary";

  const innerClasses = `
    relative inline-flex items-center justify-center
    overflow-hidden w-full
    px-8 py-4
    font-display font-semibold text-base tracking-wide
    transition-colors duration-300
    focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-molten-copper
    cursor-pointer select-none
    ${isPrimary
      ? "bg-molten-copper text-titanium-white rounded-button"
      : "bg-transparent text-titanium-white border border-brushed-steel/60 rounded-button hover:border-machine-gray/80"
    }
    ${className}
  `;

  const shimmerLayer = (
    <div
      ref={shimmerRef}
      className="absolute inset-0 pointer-events-none rounded-button"
      style={
        isPrimary
          ? ({
              "--sx": "50%",
              "--sy": "50%",
              "--glow": "0.12",
              background: `radial-gradient(ellipse 80% 60% at var(--sx) var(--sy), rgba(255,255,255,var(--glow)), transparent 70%)`,
            } as React.CSSProperties)
          : ({
              "--sx": "50%",
              "--sy": "50%",
              background: `radial-gradient(ellipse 70% 50% at var(--sx) var(--sy), rgba(200,106,61,0.08), transparent 70%)`,
              opacity: 0,
              transition: "opacity 500ms",
            } as React.CSSProperties)
      }
      aria-hidden="true"
    />
  );

  const specularEdge = isPrimary && (
    <>
      {/* Top specular highlight — polished metal edge */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />
      {/* Bottom shadow recess */}
      <div
        className="absolute inset-x-2 -bottom-px h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,0,0,0.4) 50%, transparent)",
        }}
        aria-hidden="true"
      />
    </>
  );

  const content = (
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  );

  const inner = href ? (
    <a href={href} className={innerClasses} onClick={onClick}>
      {shimmerLayer}
      {specularEdge}
      {content}
    </a>
  ) : (
    <button className={innerClasses} onClick={onClick}>
      {shimmerLayer}
      {specularEdge}
      {content}
    </button>
  );

  return (
    <motion.div
      ref={containerRef}
      className="inline-block group"
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        handleMouseLeave();
        // Show/hide ghost shimmer
        if (!isPrimary && shimmerRef.current) {
          shimmerRef.current.style.opacity = "0";
        }
      }}
      onMouseEnter={() => {
        if (!isPrimary && shimmerRef.current) {
          shimmerRef.current.style.opacity = "1";
        }
      }}
      whileHover={{ scale: 1.025, y: -2 }}
      whileTap={{ scale: 0.965 }}
      transition={SPRING_HOVER}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {inner}
    </motion.div>
  );
}
