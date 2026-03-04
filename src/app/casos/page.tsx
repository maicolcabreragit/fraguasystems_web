"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   /casos — Engineering Case Studies
   
   Fast-loading page showcasing real HORECA projects.
   Design: Dark, minimal, data-first. Each case = a "project card"
   with challenge, solution, and measurable results.
   ═══════════════════════════════════════════════════════════════════ */

const cases = [
  {
    id: "hotel-la-garbinada",
    tag: "Web + Motor de Reservas + PMS + Contenido IA",
    title: "Hotel-Restaurante La Garbinada",
    subtitle: "16 habitaciones · 1 establecimiento · Granyena de les Garrigues, Lleida",
    challenge:
      "Web obsoleta sin reservas online. Dependencia total de portales de turismo rural con baja conversión y nula presencia en buscadores. Gestión de huéspedes manual sin compliance. Contenido visual de platos y experiencia gastronómica inexistente.",
    solution:
      "Diseño web premium con motor de reservas nativo, SEO local optimizado, campañas estacionales automatizadas, sistema multilingüe (CA/ES/EN/FR), PMS integrado con Stripe, reporting automatizado a Mossos d'Esquadra, y producción de contenido visual con tecnología IA para platos y experiencia gastronómica — manteniendo consistencia de marca y maximizando impacto visual.",
    results: [
      { metric: "+156%", label: "Tráfico orgánico" },
      { metric: "4.2x", label: "Ratio de conversión" },
      { metric: "< 1.8s", label: "LCP (Core Web Vitals)" },
    ],
    stack: ["Next.js", "Vercel", "Stripe", "i18n", "IA Gen."],
    featured: true,
    liveUrl: "https://hotellagarbinada.com",
    confidential: false,
  },
  {
    id: "cadena-regional-pms",
    tag: "PMS + Canal Directo",
    title: "Cadena Regional · Pirineo Aragonés",
    redactedName: "Hotel Gr███ Pir██eos",
    subtitle: "3 establecimientos · 120+ habitaciones",
    challenge:
      "Dependencia del 78% en OTAs (Booking/Expedia) con comisiones del 18-22%. PMS legacy sin integración con canales de venta directa ni compliance automático.",
    solution:
      "Ecosistema PMS unificado con motor de reservas directas, sincronización en tiempo real de inventario y pricing dinámico. Migración zero-downtime en 3 fases.",
    results: [
      { metric: "+34%", label: "Reservas directas" },
      { metric: "-€64K", label: "Comisiones anuales" },
      { metric: "99.97%", label: "Uptime" },
    ],
    stack: ["Next.js", "PostgreSQL", "Hetzner", "Stripe"],
    featured: false,
    liveUrl: null,
    confidential: true,
  },
  {
    id: "grupo-compliance",
    tag: "SES.Hospedajes + VeriFactu",
    title: "Grupo Hotelero · Costa Brava",
    redactedName: "Grup M████rrani",
    subtitle: "3 establecimientos · 85 habitaciones",
    challenge:
      "Registro manual de huéspedes en SES.Hospedajes con errores frecuentes. Facturación no adaptada al sistema VeriFactu obligatorio en 2026.",
    solution:
      "Automatización completa del flujo de registro (check-in → SES.Hospedajes) y motor de facturación electrónica VeriFactu con QR verificable e inmutabilidad garantizada.",
    results: [
      { metric: "100%", label: "Automatización SES" },
      { metric: "0", label: "Errores de registro" },
      { metric: "< 3s", label: "Emisión de factura" },
    ],
    stack: ["Node.js", "AEAT API", "PostgreSQL", "Redis"],
    featured: false,
    liveUrl: null,
    confidential: true,
  },
  {
    id: "restaurante-reservas",
    tag: "Motor de Reservas",
    title: "Restaurante Gastronómico · Lleida",
    redactedName: "Rest. C██ Xi███",
    subtitle: "Alta cocina · 45 comensales",
    challenge:
      "Gestión de reservas por teléfono y WhatsApp sin confirmación automática. Pérdida de un 15% de reservas por no-shows y dobles asignaciones.",
    solution:
      "Motor de reservas integrado con confirmación automática, recordatorios SMS/email, gestión de lista de espera y dashboard de ocupación en tiempo real.",
    results: [
      { metric: "-82%", label: "No-shows" },
      { metric: "+23%", label: "Ocupación media" },
      { metric: "24/7", label: "Reservas online" },
    ],
    stack: ["Next.js", "Twilio", "PostgreSQL", "Vercel"],
    featured: false,
    liveUrl: null,
    confidential: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 22 },
  },
};

export default function CasosPage() {
  return (
    <main className="section-dark min-h-screen pt-24 md:pt-32 pb-20">
      {/* ─── Header ──────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-machine-gray hover:text-molten-copper transition-colors mb-8 group"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver al inicio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Portfolio de Ingeniería
          </span>
          <h1 className="font-display font-bold text-titanium-white mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Casos de{" "}
            <span className="text-gradient-copper">Ingeniería Real.</span>
          </h1>
          <p className="text-lg text-machine-gray leading-relaxed max-w-2xl">
            Cada proyecto es una pieza de infraestructura en producción.
            Sin mockups — datos reales de negocios HORECA operativos.
          </p>
        </motion.div>
      </div>

      {/* ─── Case Cards Grid ─────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {cases.map((c) => (
            <motion.article
              key={c.id}
              variants={cardVariants}
              className={`
                group relative
                rounded-glass-lg
                overflow-hidden
                transition-all duration-500
                hover:bg-forged-slate/45
                ${c.featured
                  ? "border-2 border-molten-copper/40 bg-forged-slate/40 lg:col-span-2 hover:border-molten-copper/60"
                  : "border border-brushed-steel/20 bg-forged-slate/30 hover:border-brushed-steel/40"
                }
              `}
            >
              {/* Featured glow */}
              {c.featured && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, rgba(200,106,61,0.06) 0%, transparent 50%)",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Top specular */}
              <div
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                style={{
                  background: c.featured
                    ? "linear-gradient(90deg, transparent 5%, rgba(200,106,61,0.15) 30%, rgba(200,106,61,0.15) 70%, transparent 95%)"
                    : "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.03) 50%, transparent 85%)",
                }}
                aria-hidden="true"
              />

              <div className={`p-7 md:p-8 ${c.featured ? "lg:flex lg:gap-10" : ""}`}>
                <div className={c.featured ? "lg:flex-1" : ""}>
                  {/* Tag + NDA badge row */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide text-industrial-gold border border-industrial-gold/25 bg-industrial-gold/5">
                        {c.tag}
                      </span>
                      {c.confidential && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wider text-machine-gray/50 border border-brushed-steel/15 bg-forged-slate/40">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-machine-gray/40">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          CLIENTE BAJO NDA
                        </span>
                      )}
                      {c.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wider text-emerald-400/80 border border-emerald-400/20 bg-emerald-400/5">
                          ● EN PRODUCCIÓN
                        </span>
                      )}
                    </div>
                    <h2 className="font-display font-semibold text-xl text-titanium-white tracking-tight">
                      {c.title}
                    </h2>
                    {c.confidential && "redactedName" in c && (
                      <p className="flex items-center gap-2 mt-1.5 mb-0.5">
                        <span
                          className="font-mono text-sm text-machine-gray/40 select-none"
                          style={{ filter: "blur(4px)" }}
                          aria-hidden="true"
                        >
                          {(c as { redactedName: string }).redactedName}
                        </span>
                        <span className="text-[9px] text-machine-gray/30 uppercase tracking-wider">
                          — nombre protegido
                        </span>
                      </p>
                    )}
                    <p className="text-sm text-machine-gray mt-1">{c.subtitle}</p>
                  </div>

                  {/* Challenge + Solution */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-red-400/70 mb-1 block">
                        Desafío
                      </span>
                      <p className="text-sm text-machine-gray leading-relaxed">
                        {c.challenge}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400/70 mb-1 block">
                        Solución Fragua
                      </span>
                      <p className="text-sm text-machine-gray leading-relaxed">
                        {c.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={c.featured ? "lg:w-[320px] lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center" : ""}>
                  {/* Results metrics */}
                  <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-abyss-black/40 border border-brushed-steel/10 mb-5">
                    {c.results.map((r) => (
                      <div key={r.label} className="text-center">
                        <span className="block text-xl font-display font-bold text-titanium-white tabular-nums">
                          {r.metric}
                        </span>
                        <span className="block text-[10px] text-machine-gray/70 mt-1 uppercase tracking-wide">
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className="text-[10px] text-machine-gray/40 uppercase tracking-wider mr-1">
                      Stack:
                    </span>
                    {c.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono text-machine-gray/60 bg-forged-slate/50 border border-brushed-steel/15"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Live URL for featured */}
                  {c.liveUrl && (
                    <a
                      href={c.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-molten-copper hover:text-industrial-gold transition-colors"
                    >
                      Ver proyecto en vivo
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="translate-y-px">
                        <path d="M7 17L17 7m0 0H7m10 0v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* ─── Bottom CTA ──────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="text-center"
        >
          <p className="text-machine-gray mb-6">
            ¿Su negocio HORECA necesita una solución similar?
          </p>
          <IndustrialButton variant="primary" href="/#contacto">
            Solicitar Auditoría Arquitectónica
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </IndustrialButton>
        </motion.div>
      </div>
    </main>
  );
}
