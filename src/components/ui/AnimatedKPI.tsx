"use client";

import { useCountUp } from "@/hooks/useCountUp";

/* ═══════════════════════════════════════════════════════════════════
   AnimatedKPI — Counter that animates from 0 to target on scroll
   
   Wraps useCountUp hook with proper ref forwarding.
   Used in EmpiricalProof KPI cards.
   ═══════════════════════════════════════════════════════════════════ */

interface AnimatedKPIProps {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedKPI({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2000,
  className = "",
}: AnimatedKPIProps) {
  const { ref, display } = useCountUp({ end, prefix, suffix, decimals, duration });

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {display}
    </span>
  );
}
