"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   BottomFunnel + Footer — Industrial Clean v2.0 (Stimulo-inspired)
   
   Dark CTA section + expanded footer with WhatsApp/Phone/Email CTAs.
   ═══════════════════════════════════════════════════════════════════ */

const footerLinks = [
  { label: "Servicios", href: "/servicios" },
  { label: "Casos", href: "/casos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
];

const legalLinks = [
  { label: "Política de Privacidad", href: "/privacidad" },
  { label: "Aviso Legal", href: "/aviso-legal" },
  { label: "Cookies", href: "/cookies" },
];

export function BottomFunnel() {
  return (
    <section id="cierre" className="section-dark">
      {/* ═══ CTA Zone — The Luxury of Void ═══════════════════ */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-32 md:py-44 lg:py-52">
        {/* Copper line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-16 h-px bg-molten-copper/50 mb-12 origin-center"
          aria-hidden="true"
        />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.15 }}
          className="font-display font-bold text-titanium-white max-w-3xl mb-6"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          ¿Listo para blindar la infraestructura
          <br className="hidden md:block" />
          {" "}de su negocio?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.25 }}
          className="text-machine-gray text-lg max-w-xl mb-12 leading-relaxed"
        >
          Auditoría arquitectónica sin compromiso. Analizamos su infraestructura
          actual y le entregamos un plan de migración con ROI proyectado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.35 }}
        >
          <IndustrialButton variant="primary" onDark href="#contacto">
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

      {/* ═══ Expanded Footer (Stimulo-style) ═══════════════════ */}
      <footer className="border-t border-brushed-steel/15">
        {/* ─── Contact CTAs — Prominent (Stimulo footer style) ─ */}
        <div className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px] py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/34614916049"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center justify-between
                px-8 py-6
                border border-brushed-steel/20
                text-titanium-white
                hover:border-emerald-500/40 hover:bg-emerald-500/5
                transition-all duration-300
                group
              "
            >
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-400">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-xs text-machine-gray">Respuesta inmediata</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-machine-gray group-hover:text-titanium-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>

            {/* Phone */}
            <a
              href="tel:+34614916049"
              className="
                flex items-center justify-between
                px-8 py-6
                border border-brushed-steel/20
                text-titanium-white
                hover:border-molten-copper/40 hover:bg-molten-copper/5
                transition-all duration-300
                group
              "
            >
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm font-medium">Teléfono</p>
                  <p className="text-xs text-machine-gray">+34 614 916 049</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-machine-gray group-hover:text-titanium-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>

            {/* Email */}
            <a
              href="mailto:ingenieria@fraguasystems.com"
              className="
                flex items-center justify-between
                px-8 py-6
                border border-brushed-steel/20
                text-titanium-white
                hover:border-industrial-gold/40 hover:bg-industrial-gold/5
                transition-all duration-300
                group
              "
            >
              <div className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-industrial-gold">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-machine-gray">ingenieria@fraguasystems.com</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-machine-gray group-hover:text-titanium-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* ─── Footer bottom ──────────────────────────────── */}
        <div className="border-t border-brushed-steel/10 py-8 px-6 md:px-12 lg:px-[30px]">
          <div className="max-w-[1860px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Logo + location */}
            <div className="flex items-center gap-6">
              <span className="font-display font-bold text-titanium-white text-sm tracking-tight">
                Fragua<span className="font-light text-machine-gray/60 ml-0.5">Systems</span>
              </span>
              <span className="text-xs text-machine-gray/40">
                Lleida, Catalunya
              </span>
            </div>

            {/* Center: Nav links */}
            <div className="flex items-center gap-6">
              {footerLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs text-machine-gray/60 hover:text-titanium-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-xs text-machine-gray/60 hover:text-titanium-white transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* Right: Copyright + legal */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-machine-gray/30 font-mono">
                © 2026 FRAGUA SYSTEMS
              </span>
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[10px] text-machine-gray/30 hover:text-machine-gray/60 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
