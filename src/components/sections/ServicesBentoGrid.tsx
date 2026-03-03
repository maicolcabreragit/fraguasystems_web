"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   ServicesBentoGrid — "Nuestros Servicios"

   Horizontal-scroll compact service cards (10 highlights)
   + CTA button → /servicios for the full 100-service catalog
   ═══════════════════════════════════════════════════════════════════ */

interface ServiceCard {
  icon: string;
  title: string;
  desc: string;
  tier: string;
  tierColor: string;
}

const services: ServiceCard[] = [
  {
    icon: "🏗️",
    title: "Ecosistema PMS Unificado",
    desc: "Centraliza reservas, inventario y facturación en tiempo real.",
    tier: "ÉLITE",
    tierColor: "text-molten-copper border-molten-copper/25 bg-molten-copper/8",
  },
  {
    icon: "🌐",
    title: "Motor de Ventas Directas",
    desc: "Recupere hasta el 20% de márgenes cedidos a Booking.",
    tier: "ÉLITE",
    tierColor: "text-molten-copper border-molten-copper/25 bg-molten-copper/8",
  },
  {
    icon: "⚖️",
    title: "VeriFactu Compliance",
    desc: "Hashes encadenados + QR por factura para AEAT 2027.",
    tier: "ÉLITE",
    tierColor: "text-molten-copper border-molten-copper/25 bg-molten-copper/8",
  },
  {
    icon: "🛡️",
    title: "SES.Hospedajes API",
    desc: "Reporte automatizado al Ministerio del Interior. 0% manual.",
    tier: "AVANZADO",
    tierColor: "text-industrial-gold border-industrial-gold/25 bg-industrial-gold/8",
  },
  {
    icon: "🤖",
    title: "Conserjería IA 24/7",
    desc: "Bot NLP en WhatsApp que atiende y cierra reservas multilingüe.",
    tier: "TÁCTICO",
    tierColor: "text-emerald-400 border-emerald-400/25 bg-emerald-400/8",
  },
  {
    icon: "📊",
    title: "Yield Management IA",
    desc: "Algoritmo de precios dinámicos cruzando meteorología y demanda.",
    tier: "ÉLITE",
    tierColor: "text-molten-copper border-molten-copper/25 bg-molten-copper/8",
  },
  {
    icon: "⏱️",
    title: "Control Horario Digital",
    desc: "Sistema criptográfico inmutable para la ley 2026.",
    tier: "AVANZADO",
    tierColor: "text-industrial-gold border-industrial-gold/25 bg-industrial-gold/8",
  },
  {
    icon: "⚡",
    title: "IoT & Climatización",
    desc: "Apaga circuitos de habitaciones vacías sincronizado con el PMS.",
    tier: "ÉLITE",
    tierColor: "text-molten-copper border-molten-copper/25 bg-molten-copper/8",
  },
  {
    icon: "🔒",
    title: "Ciberseguridad Zero Trust",
    desc: "Encriptación de datos de pago y pasaportes contra ransomware.",
    tier: "ÉLITE",
    tierColor: "text-molten-copper border-molten-copper/25 bg-molten-copper/8",
  },
  {
    icon: "♻️",
    title: "Trazabilidad de Mermas",
    desc: "Compliance Ley 1/2025: pesaje IoT de residuos automatizado.",
    tier: "AVANZADO",
    tierColor: "text-industrial-gold border-industrial-gold/25 bg-industrial-gold/8",
  },
];

export function ServicesBentoGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="servicios" className="relative py-24 md:py-32">
      {/* ─── Section Header ──────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Nuestros Servicios
          </span>
          <h2 className="font-display font-bold text-titanium-white mb-4">
            Infraestructura que opera{" "}
            <span className="text-gradient-copper">mientras usted duerme.</span>
          </h2>
          <p className="text-lg text-machine-gray leading-relaxed">
            Cada módulo es una pieza de ingeniería pesada diseñada para resolver un dolor
            operativo específico del sector HORECA.
          </p>
        </motion.div>
      </div>

      {/* ─── Horizontal Scroll Carousel ───────────────────── */}
      <div className="relative">
        {/* Fade edge masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-20 z-10 bg-gradient-to-r from-abyss-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-20 z-10 bg-gradient-to-l from-abyss-black to-transparent" />

        <motion.div
          ref={scrollRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-16 lg:px-20 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {services.map((svc, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: 40 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 22 } },
              }}
              className="flex-shrink-0 w-[260px] md:w-[280px] snap-start"
            >
              <div className="h-full rounded-xl border border-brushed-steel/15 bg-forged-slate/30 backdrop-blur-sm p-5 flex flex-col transition-all duration-300 hover:border-molten-copper/30 hover:bg-forged-slate/50 group">
                {/* Icon + Tier */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl leading-none">{svc.icon}</span>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border ${svc.tierColor}`}>
                    {svc.tier}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-titanium-white text-sm tracking-tight mb-2 group-hover:text-molten-copper transition-colors">
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-machine-gray/70 leading-relaxed flex-1">
                  {svc.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ─── CTA → /servicios ────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <p className="text-machine-gray text-sm">
            Estos son solo <span className="text-titanium-white font-semibold">10 de los 100+ servicios</span> que ofrecemos.
          </p>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-titanium-white bg-forged-slate/50 border border-brushed-steel/20 hover:border-molten-copper/40 hover:bg-forged-slate/70 transition-all duration-300 group"
          >
            Ver todos los servicios
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
