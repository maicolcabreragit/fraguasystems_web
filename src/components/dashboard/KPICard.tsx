"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   KPI Card — Animated stat card for dashboard overview
   ═══════════════════════════════════════════════════════════════════ */

interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  accentColor?: "copper" | "gold" | "default";
}

export function KPICard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon,
  trend,
  accentColor = "default",
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const borderClass =
    accentColor === "copper"
      ? "border-molten-copper/20 hover:border-molten-copper/40"
      : accentColor === "gold"
        ? "border-industrial-gold/20 hover:border-industrial-gold/40"
        : "border-brushed-steel/15 hover:border-brushed-steel/30";

  const iconBgClass =
    accentColor === "copper"
      ? "bg-molten-copper/10 text-molten-copper"
      : accentColor === "gold"
        ? "bg-industrial-gold/10 text-industrial-gold"
        : "bg-brushed-steel/20 text-machine-gray";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={`
        bg-[#141619] border ${borderClass}
        p-5 transition-all duration-300 group
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 flex items-center justify-center ${iconBgClass}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 ${
              trend.positive
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-white tracking-tight">
        {prefix}
        {displayValue.toLocaleString("es-ES")}
        {suffix}
      </p>
      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
        {title}
      </p>
    </motion.div>
  );
}
