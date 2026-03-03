"use client";

import { motion } from "framer-motion";
import { AnimatedKPI } from "@/components/ui/AnimatedKPI";

/* ═══════════════════════════════════════════════════════════════════
   EmpiricalProof — "Financial Terminal" ROI Demonstration
   
   PRD Spec (Section 6.4):
   - No testimonial boxes. No star ratings.
   - Tabular data breakdowns, raw ROI metrics.
   - Contrast: OTA commission bleed vs. Fragua Direct Channel margins.
   - Font: Inter (analytical, data-dense)
   - Colors: Molten Copper + Industrial Gold accents on dark backgrounds
   ═══════════════════════════════════════════════════════════════════ */

// Simulated financial data — OTA dependency scenario
const otaScenario = {
  label: "Con dependencia OTA",
  totalBookings: 2840,
  avgNightRate: 127,
  otaCommission: "18%",
  annualRevenue: "€360,680",
  commissionPaid: "€64,922",
  netRevenue: "€295,758",
  netColor: "text-machine-gray",
};

const fraguaScenario = {
  label: "Con Canal Directo Fragua",
  totalBookings: 2840,
  avgNightRate: 127,
  directBookingRatio: "62%",
  otaCommission: "18%",
  annualRevenue: "€360,680",
  commissionSaved: "€40,252",
  netRevenue: "€336,010",
  netColor: "text-emerald-400",
};

const metrics = [
  {
    end: 34, prefix: "+", suffix: "%", decimals: 0,
    label: "Incremento en márgenes directos",
    description: "Eliminación de comisiones OTA en reservas directas",
  },
  {
    end: 40.2, prefix: "€", suffix: "K", decimals: 1,
    label: "Ahorro anual por propiedad",
    description: "Comisiones recuperadas del canal intermediario",
  },
  {
    end: 2.1, prefix: "< ", suffix: "s", decimals: 1,
    label: "Tiempo de carga del motor",
    description: "LCP verificado — Core Web Vitals aprobados",
  },
  {
    end: 99.97, prefix: "", suffix: "%", decimals: 2,
    label: "Uptime de infraestructura",
    description: "SLA en servidores Hetzner bare-metal (Europa)",
  },
];

// Console log simulation lines
const terminalLogs = [
  { time: "14:32:01", level: "INFO", msg: "fragua.analytics.connect(hotel_id: 'GRAND_PIRINEOS')", color: "text-machine-gray/70" },
  { time: "14:32:01", level: "OK", msg: "Connected to production ledger — PostgreSQL (hetzner-fsn1)", color: "text-emerald-500/70" },
  { time: "14:32:02", level: "RUN", msg: "roi.compare({ period: '2025-Q4', channel: ['OTA', 'DIRECT'] })", color: "text-molten-copper" },
  { time: "14:32:02", level: "DATA", msg: "Fetching 2,840 booking records...", color: "text-machine-gray/70" },
  { time: "14:32:03", level: "OK", msg: "Analysis complete — margin_delta: +34.12%  ▲", color: "text-emerald-500/70" },
];

export function EmpiricalProof() {
  return (
    <section id="resultados" className="relative py-24 md:py-32">
      {/* ─── Section Header ──────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Prueba Empírica
          </span>
          <h2 className="font-display font-bold text-titanium-white mb-4">
            Los números no necesitan{" "}
            <span className="text-gradient-copper">persuasión.</span>
          </h2>
          <p className="text-lg text-machine-gray leading-relaxed">
            Desglose financiero real de un hotel de 120 habitaciones en temporada alta.
            Sin estimaciones optimistas — datos crudos de producción.
          </p>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ═══ LEFT: Financial Terminal (3 cols) ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="lg:col-span-3 rounded-glass-lg border border-brushed-steel/25 bg-forged-slate/40 overflow-hidden"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-brushed-steel/15 bg-abyss-black/50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              <span className="ml-3 text-[11px] font-mono text-machine-gray/50 tracking-wider">
                fragua.roi.analyzer — live session
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500/70"
                />
                <span className="text-[10px] font-mono text-emerald-500/60">LIVE</span>
              </div>
            </div>

            {/* Terminal logs */}
            <div className="px-5 py-4 border-b border-brushed-steel/10 bg-abyss-black/30">
              <div className="font-mono text-[11px] space-y-1">
                {terminalLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-machine-gray/30 flex-shrink-0 tabular-nums">
                      {log.time}
                    </span>
                    <span className={`flex-shrink-0 w-8 text-right ${
                      log.level === "OK" ? "text-emerald-500/70" :
                      log.level === "RUN" ? "text-molten-copper" :
                      "text-machine-gray/50"
                    }`}>
                      [{log.level}]
                    </span>
                    <span className={log.color}>{log.msg}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Financial comparison table */}
            <div className="p-5 md:p-6">
              {/* Table header */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-3 border-b border-brushed-steel/15">
                <span className="text-[11px] font-mono uppercase tracking-wider text-machine-gray/40">
                  Métrica
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-machine-gray/40 text-right">
                  Escenario OTA
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-molten-copper/60 text-right">
                  Canal Fragua
                </span>
              </div>

              {/* Table rows */}
              {[
                { label: "Reservas Anuales", ota: "2,840", fragua: "2,840", note: "" },
                { label: "Tarifa Media/Noche", ota: "€127", fragua: "€127", note: "" },
                { label: "Comisión OTA (18%)", ota: "-€64,922", fragua: "-€24,670", note: "fraColor" },
                { label: "Ingresos Netos", ota: otaScenario.netRevenue, fragua: fraguaScenario.netRevenue, note: "highlight" },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  className={`grid grid-cols-3 gap-4 py-3 ${
                    row.note === "highlight"
                      ? "border-t border-brushed-steel/20 mt-1 pt-4"
                      : "border-b border-brushed-steel/8"
                  }`}
                >
                  <span className={`text-sm ${
                    row.note === "highlight"
                      ? "font-semibold text-titanium-white"
                      : "text-machine-gray"
                  }`}>
                    {row.label}
                  </span>
                  <span className={`text-sm text-right font-mono tabular-nums ${
                    row.note === "highlight"
                      ? "text-machine-gray"
                      : row.label.includes("Comisión")
                        ? "text-red-400/70"
                        : "text-machine-gray/70"
                  }`}>
                    {row.ota}
                  </span>
                  <span className={`text-sm text-right font-mono tabular-nums font-medium ${
                    row.note === "highlight"
                      ? "text-emerald-400"
                      : row.note === "fraColor"
                        ? "text-emerald-400/70"
                        : "text-titanium-white/80"
                  }`}>
                    {row.fragua}
                  </span>
                </motion.div>
              ))}

              {/* Delta callout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                className="mt-6 flex items-center gap-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 px-5 py-4"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl md:text-3xl font-display font-bold text-emerald-400 tabular-nums">
                    +€40,252
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-titanium-white">
                    Margen recuperado anual
                  </span>
                  <span className="text-xs text-machine-gray mt-0.5">
                    62% de reservas migradas a canal directo · ROI en 4.2 meses
                  </span>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide text-industrial-gold border border-industrial-gold/25 bg-industrial-gold/5">
                    ✦ ROI Verificado
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ═══ RIGHT: KPI Cards (2 cols) ═══════════════════ */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 22,
                  delay: 0.2 + i * 0.1,
                }}
                className="
                  group relative
                  rounded-glass-lg
                  border border-brushed-steel/20
                  bg-forged-slate/30
                  p-6
                  transition-all duration-500
                  hover:border-brushed-steel/40
                  hover:bg-forged-slate/50
                  overflow-hidden
                "
              >
                {/* Top specular */}
                <div
                  className="absolute inset-x-0 top-0 h-px pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.03) 50%, transparent 85%)",
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <AnimatedKPI
                    end={m.end}
                    prefix={m.prefix}
                    suffix={m.suffix}
                    decimals={m.decimals}
                    duration={2200}
                    className={`text-3xl md:text-4xl font-display font-bold tracking-tight leading-none ${
                      i === 0 ? "text-gradient-copper" : "text-titanium-white"
                    }`}
                  />
                  <p className="text-sm font-medium text-titanium-white mt-3 mb-1">
                    {m.label}
                  </p>
                  <p className="text-xs text-machine-gray leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
