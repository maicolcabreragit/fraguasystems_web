"use client";

import { motion } from "framer-motion";
import Link from "next/link";


/* ═══════════════════════════════════════════════════════════════════
   ServicesBentoGrid — Industrial Clean v2.0 (Stimulo Projects-style)
   
   Light background, 3-column grid, clean cards with icons,
   sharp corners, centered header.
   ═══════════════════════════════════════════════════════════════════ */

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tier: string;
}

const services: ServiceCard[] = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="0"/><path d="M3 9h18M9 3v18"/></svg>,
    title: "Ecosistema PMS Unificado",
    desc: "Centraliza reservas, inventario y facturación en un único sistema en tiempo real. Elimina la fragmentación operativa.",
    tier: "ÉLITE",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    title: "Motor de Ventas Directas",
    desc: "Recupere hasta el 20% de márgenes cedidos a Booking y Expedia. Canal propio con conversión optimizada.",
    tier: "ÉLITE",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: "VeriFactu Compliance",
    desc: "Hashes encadenados + QR por factura. Preparado para la normativa AEAT 2026/2027.",
    tier: "ÉLITE",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
    title: "SES.Hospedajes API",
    desc: "Reporte automatizado al Ministerio del Interior. 0% intervención manual. 100% compliance.",
    tier: "AVANZADO",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: "Conserjería IA 24/7",
    desc: "Bot NLP en WhatsApp que atiende consultas y cierra reservas en cualquier idioma, sin intervención humana.",
    tier: "TÁCTICO",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    title: "Yield Management IA",
    desc: "Algoritmo de precios dinámicos cruzando meteorología, eventos locales y demanda histórica.",
    tier: "ÉLITE",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 22 } },
};

export function ServicesBentoGrid() {
  return (
    <section id="servicios" className="section-light py-24 md:py-32">
      {/* ─── Section Header — Centered ──────────────────── */}
      <div className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px] mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Nuestros Servicios
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
          </span>
          <h2 className="font-display font-bold text-ink-black mb-4">
            Infraestructura que opera{" "}
            <span className="text-gradient-copper">mientras usted duerme.</span>
          </h2>
          <p className="text-lg text-soft-gray leading-relaxed">
            Cada módulo es una pieza de ingeniería pesada diseñada para resolver un dolor
            operativo específico del sector HORECA.
          </p>
        </motion.div>
      </div>

      {/* ─── 3-Column Grid ──────────────────────────────── */}
      <div className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((svc, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
            >
              <div className="
                h-full
                bg-white border border-border-light
                p-8
                transition-all duration-300
                hover:border-ink-black/20
                hover:shadow-md
                group
              ">
                {/* Icon */}
                <div className="mb-6 text-ink-black group-hover:text-molten-copper transition-colors duration-300">
                  {svc.icon}
                </div>

                {/* Tier label */}
                <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase text-molten-copper mb-3">
                  {svc.tier}
                </span>

                {/* Title */}
                <h3 className="font-display font-semibold text-lg text-ink-black tracking-tight mb-3">
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-soft-gray leading-relaxed">
                  {svc.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── CTA ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14"
        >
          <p className="text-soft-gray text-sm">
            Estos son solo <span className="text-ink-black font-semibold">6 de los 100+ servicios</span> que ofrecemos.
          </p>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-ink-black border-[1.5px] border-ink-black hover:bg-ink-black hover:text-white transition-all duration-300 group"
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
