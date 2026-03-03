"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   useCountUp — Animated Number Counter
   
   Counts from 0 to target value when element enters viewport.
   - Uses requestAnimationFrame for smooth 60fps animation
   - Easing: easeOutExpo for a satisfying deceleration
   - Triggers once via IntersectionObserver
   ═══════════════════════════════════════════════════════════════════ */

interface CountUpOptions {
  /** Target value to count to */
  end: number;
  /** Duration in ms (default 2000) */
  duration?: number;
  /** Decimal places (default 0) */
  decimals?: number;
  /** Prefix like "+" or "€" */
  prefix?: string;
  /** Suffix like "%" or "K" */
  suffix?: string;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useCountUp({
  end,
  duration = 2000,
  decimals = 0,
  prefix = "",
  suffix = "",
}: CountUpOptions) {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          observer.disconnect();

          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = easedProgress * end;

            setDisplay(
              `${prefix}${currentValue.toFixed(decimals)}${suffix}`
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, decimals, prefix, suffix]);

  return { ref, display };
}
