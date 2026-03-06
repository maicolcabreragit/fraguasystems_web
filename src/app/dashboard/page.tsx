"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KPICard } from "@/components/dashboard/KPICard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import type { CRMStats } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   Dashboard Overview — KPIs, pipeline summary, recent activity
   ═══════════════════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d.stats); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-molten-copper/30 border-t-molten-copper rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen text-machine-gray/50 text-sm">
        Error cargando datos
      </div>
    );
  }

  const STATUS_LABELS: Record<string, string> = {
    nuevo: "🟢 Nuevo",
    contactado: "📞 Contactado",
    reunion: "🗓️ Reunión",
    propuesta: "📋 Propuesta",
    negociacion: "🤝 Negociación",
    cerrado: "✅ Cerrado",
    perdido: "❌ Perdido",
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-titanium-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-machine-gray/50 mt-0.5">
            Fragua Systems — Panel de control interno
          </p>
        </div>
        <div className="text-[11px] text-machine-gray/40">
          {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard
          title="Total Leads"
          value={stats.totalLeads}
          accentColor="default"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          }
        />
        <KPICard
          title="Pipeline estimado"
          value={stats.pipelineRevenue}
          prefix="€"
          accentColor="copper"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
        <KPICard
          title="Revenue cerrado"
          value={stats.closedRevenue}
          prefix="€"
          accentColor="gold"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
        <KPICard
          title="Acciones hoy"
          value={stats.todayActions}
          accentColor="default"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Pipeline breakdown */}
        <div className="xl:col-span-2 bg-[#141619] border border-brushed-steel/10 p-5">
          <h2 className="text-sm font-semibold text-titanium-white/90 mb-4">
            Pipeline por estado
          </h2>
          <div className="space-y-2.5">
            {Object.entries(stats.leadsByStatus).map(([status, count]) => {
              const pct = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-xs text-machine-gray/70 w-28 shrink-0">
                    {STATUS_LABELS[status] || status}
                  </span>
                  <div className="flex-1 h-2 bg-brushed-steel/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${
                        status === "cerrado"
                          ? "bg-emerald-500/60"
                          : status === "perdido"
                            ? "bg-red-500/40"
                            : "bg-molten-copper/40"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-machine-gray/50 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tier breakdown */}
          <div className="mt-6 pt-4 border-t border-brushed-steel/10">
            <h3 className="text-xs font-medium text-machine-gray/60 uppercase tracking-wider mb-3">
              Por Tier
            </h3>
            <div className="flex gap-4">
              {Object.entries(stats.leadsByTier).map(([tier, count]) => (
                <div key={tier} className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 ${
                    tier === "A"
                      ? "bg-red-500/10 text-red-400"
                      : tier === "B"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {tier === "A" ? "🔥 Tier A" : tier === "B" ? "🟡 Tier B" : "🔵 Tier C"}
                  </span>
                  <span className="text-sm font-medium text-titanium-white/80">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion */}
          <div className="mt-6 pt-4 border-t border-brushed-steel/10 flex items-center gap-4">
            <div>
              <span className="text-xs text-machine-gray/50 uppercase tracking-wider">Tasa de conversión</span>
              <span className="block text-2xl font-bold text-industrial-gold mt-1">
                {stats.conversionRate}%
              </span>
            </div>
            <div>
              <span className="text-xs text-machine-gray/50 uppercase tracking-wider">Proyectos activos</span>
              <span className="block text-2xl font-bold text-titanium-white mt-1">
                {stats.activeProjects}
              </span>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-[#141619] border border-brushed-steel/10 p-5">
          <h2 className="text-sm font-semibold text-titanium-white/90 mb-4">
            Actividad reciente
          </h2>
          <ActivityTimeline activities={stats.recentActivities} />
        </div>
      </div>
    </div>
  );
}
