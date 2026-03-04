"use client";

import { useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════
   useMagneticBorder — Reactive Illumination Engine
   
   PRD Spec (Section 5.3 — Iluminación Reactiva Condicional):
   Captures pointer coordinates continuously and injects a radial 
   gradient of marginal opacity (#C86A3D at 10%) beneath card 
   backgrounds. As the cursor transits near card intersections, 
   "virtual light appears to seep tangentially through the gaps."
   
   Implementation:
   - Single event listener on the grid container (event delegation)
   - Updates CSS custom properties on each card via requestAnimationFrame
   - Zero React re-renders — pure DOM mutation for 60fps performance
   ═══════════════════════════════════════════════════════════════════ */

interface MagneticConfig {
  /** Radius of the glow effect in pixels */
  radius?: number;
  /** Color of the glow (CSS color string) */
  color?: string;
  /** Max opacity of the glow at cursor center */
  intensity?: number;
}

export function useMagneticBorder(config: MagneticConfig = {}) {
  const {
    radius = 350,
    color = "200, 106, 61", // Molten Copper RGB
    intensity = 0.12,
  } = config;

  const containerRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);


  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      // Cancel any pending frame to avoid queueing
      cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const cards = container.querySelectorAll<HTMLElement>("[data-magnetic]");
        
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);

          // Calculate distance from cursor to card center for intensity falloff
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const dist = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );
          const maxDist = Math.sqrt(
            Math.pow(rect.width, 2) + Math.pow(rect.height, 2)
          );
          const proximity = Math.max(0, 1 - dist / maxDist);
          card.style.setProperty("--mi", `${(proximity * intensity).toFixed(4)}`);
        });
      });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll<HTMLElement>("[data-magnetic]");
    cards.forEach((card) => {
      card.style.setProperty("--mi", "0");
    });
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const glowStyle = `
    radial-gradient(
      ${radius}px circle at var(--mx, 50%) var(--my, 50%),
      rgba(${color}, var(--mi, 0)),
      transparent 70%
    )
  `;

  const borderGlowStyle = `
    radial-gradient(
      ${radius}px circle at var(--mx, 50%) var(--my, 50%),
      rgba(${color}, calc(var(--mi, 0) * 2.5)),
      transparent 70%
    )
  `;

  return {
    containerRef,
    containerProps: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
    glowStyle,
    borderGlowStyle,
  };
}
