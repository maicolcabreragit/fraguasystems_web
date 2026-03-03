"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   Navbar — Sticky Industrial Navigation
   
   - Transparent on top, glassmorphism on scroll
   - Dropdown submenu on "Servicios"
   - CTA always visible
   - Mobile hamburger menu
   ═══════════════════════════════════════════════════════════════════ */

interface NavChild {
  label: string;
  href: string;
  isPage?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

const navLinks: NavItem[] = [
  {
    label: "Servicios",
    href: "#servicios",
    children: [
      { label: "Nuestros Servicios", href: "/servicios", isPage: true },
      { label: "Casos de Ingeniería", href: "/casos", isPage: true },
    ],
  },
  { label: "Sobre Nosotros", href: "#nosotros" },
  { label: "Proceso", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
  { label: "Área de Clientes", href: "/area-clientes" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setOpenDropdown(null);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500
          ${scrolled
            ? "bg-abyss-black/80 backdrop-blur-xl border-b border-brushed-steel/10 shadow-2xl shadow-black/20"
            : "bg-transparent"
          }
        `}
      >
        <nav className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 h-16 md:h-[72px] flex items-center justify-between">
          {/* ─── Logo ──────────────────────────────────────── */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-molten-copper/15 border border-molten-copper/25 flex items-center justify-center transition-colors duration-300 group-hover:bg-molten-copper/25">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-display font-semibold text-titanium-white text-base tracking-tight">
              Fragua
              <span className="text-machine-gray/60 font-medium ml-0.5">Systems</span>
            </span>
          </a>

          {/* ─── Desktop links ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className="
                      px-4 py-2 rounded-lg
                      text-sm font-medium text-machine-gray
                      transition-colors duration-300
                      hover:text-titanium-white hover:bg-forged-slate/40
                      inline-flex items-center gap-1
                    "
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  >
                    {link.label}
                    <svg
                      width="10" height="10" viewBox="0 0 24 24" fill="none"
                      className={`transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="
                          absolute top-full left-0 mt-1
                          min-w-[200px]
                          rounded-xl
                          bg-abyss-black/90 backdrop-blur-xl
                          border border-brushed-steel/20
                          shadow-xl shadow-black/30
                          py-1.5 overflow-hidden
                        "
                      >
                        {link.children.map((child) =>
                          child.isPage ? (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="
                                block px-4 py-2.5
                                text-sm text-machine-gray
                                hover:text-titanium-white hover:bg-forged-slate/40
                                transition-colors duration-200
                              "
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          ) : (
                            <a
                              key={child.href}
                              href={child.href}
                              className="
                                block px-4 py-2.5
                                text-sm text-machine-gray
                                hover:text-titanium-white hover:bg-forged-slate/40
                                transition-colors duration-200
                              "
                              onClick={(e) => { e.preventDefault(); handleNavClick(child.href); }}
                            >
                              {child.label}
                            </a>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="
                    px-4 py-2 rounded-lg
                    text-sm font-medium text-machine-gray
                    transition-colors duration-300
                    hover:text-titanium-white hover:bg-forged-slate/40
                  "
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* ─── Desktop CTA ───────────────────────────────── */}
          <div className="hidden md:block">
            <IndustrialButton
              variant="primary"
              href="#contacto"
              onClick={() => handleNavClick("#contacto")}
              className="!px-5 !py-2.5 !text-sm"
            >
              Solicitar Auditoría
            </IndustrialButton>
          </div>

          {/* ─── Mobile hamburger ──────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-forged-slate/40 transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-5 h-px bg-titanium-white block mb-1.5"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-px bg-titanium-white block mb-1.5"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-5 h-px bg-titanium-white block"
            />
          </button>
        </nav>
      </motion.header>

      {/* ─── Mobile menu overlay ───────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-abyss-black/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => (
                <div key={link.label} className="text-center">
                  <motion.a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.08 }}
                    className="text-2xl font-display font-semibold text-titanium-white hover:text-molten-copper transition-colors"
                  >
                    {link.label}
                  </motion.a>
                  {link.children && (
                    <div className="mt-2 space-y-1">
                      {link.children.filter(c => c.isPage).map((child) => (
                        <motion.div
                          key={child.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 + 0.1 }}
                        >
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-base text-machine-gray hover:text-molten-copper transition-colors"
                          >
                            ↳ {child.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <IndustrialButton
                  variant="primary"
                  onClick={() => handleNavClick("#contacto")}
                >
                  Solicitar Auditoría
                </IndustrialButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
