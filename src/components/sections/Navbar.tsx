"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   Navbar — Industrial Clean v2.1
   
   - Scroll-adaptive colors (white on dark hero, dark on scroll)
   - Servicios dropdown submenu (homepage section + full catalog)
   - Anchor links work from any page via /#hash routing
   ═══════════════════════════════════════════════════════════════════ */

const serviciosSubmenu = [
  { label: "Resumen", desc: "Visión general de nuestras capacidades", href: "/#servicios" },
  { label: "Catálogo Completo", desc: "Los 100+ servicios de ingeniería HORECA", href: "/servicios" },
];

const navLinks = [
  { label: "Sobre Nosotros", href: "/#nosotros" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Contacto", href: "/#contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviciosOpen, setServiciosOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServiciosOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setServiciosOpen(false);
    
    // Handle /#hash links — navigate to home first if needed
    if (href.startsWith("/#")) {
      const hash = href.slice(1); // e.g. "#proceso"
      if (pathname === "/") {
        // Already on homepage, just scroll
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // On a sub-page, navigate to homepage with hash
        router.push(href);
      }
      return;
    }
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setServiciosOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setServiciosOpen(false), 150);
  };

  const linkClasses = `
    px-4 py-2
    text-sm font-medium transition-colors duration-300
  `;

  const linkColorClasses = scrolled
    ? "text-soft-gray hover:text-ink-black"
    : "text-machine-gray hover:text-titanium-white";

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
            ? "bg-white/90 backdrop-blur-xl border-b border-border-light shadow-sm"
            : "bg-transparent"
          }
        `}
      >
        <nav className="max-w-[1860px] mx-auto px-6 md:px-12 lg:px-[30px] h-16 md:h-[72px] flex items-center justify-between">
          {/* ─── Logo — Image + Text ────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/brand/logo.png"
              alt="Fragua Systems"
              width={36}
              height={36}
              className="transition-all duration-500"
              priority
              unoptimized
            />
            <div className="flex items-baseline gap-1">
              <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-500 ${scrolled ? "text-ink-black" : "text-titanium-white"}`}>
                Fragua
              </span>
              <span className={`font-display font-light text-sm tracking-normal transition-colors duration-500 ${scrolled ? "text-soft-gray" : "text-machine-gray"}`}>
                Systems
              </span>
            </div>
          </Link>

          {/* ─── Desktop links ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {/* Servicios dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                onClick={() => setServiciosOpen(!serviciosOpen)}
                className={`${linkClasses} ${linkColorClasses} inline-flex items-center gap-1 cursor-pointer`}
              >
                Servicios
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  className={`transition-transform duration-200 ${serviciosOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {serviciosOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white border border-border-light shadow-lg overflow-hidden"
                  >
                    {serviciosSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          handleNavClick(item.href);
                          setServiciosOpen(false);
                        }}
                        className="block px-4 py-3 hover:bg-cloud-gray transition-colors group"
                      >
                        <span className="block text-sm font-medium text-ink-black group-hover:text-molten-copper transition-colors">
                          {item.label}
                        </span>
                        <span className="block text-xs text-soft-gray mt-0.5">
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Regular nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className={`${linkClasses} ${linkColorClasses}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ─── Desktop CTA ───────────────────────────────── */}
          <div className="hidden md:block">
            <IndustrialButton
              variant="ghost"
              onDark={!scrolled}
              href="/#contacto"
              className="!px-5 !py-2.5 !text-sm"
            >
              Contactar
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </IndustrialButton>
          </div>

          {/* ─── Mobile hamburger ──────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 transition-colors"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className={`w-5 h-px block mb-1.5 transition-colors duration-500 ${scrolled ? "bg-ink-black" : "bg-titanium-white"}`}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`w-5 h-px block mb-1.5 transition-colors duration-500 ${scrolled ? "bg-ink-black" : "bg-titanium-white"}`}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className={`w-5 h-px block transition-colors duration-500 ${scrolled ? "bg-ink-black" : "bg-titanium-white"}`}
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
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {/* Servicios group */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-soft-gray mb-1">
                  Servicios
                </span>
                {serviciosSubmenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      handleNavClick(item.href);
                      setMobileOpen(false);
                    }}
                    className="text-xl font-display font-semibold text-ink-black hover:text-molten-copper transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </motion.div>

              {/* Divider */}
              <div className="w-12 h-px bg-border-light" />

              {/* Other nav links */}
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: (i + 1) * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith("/#")) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }
                      setMobileOpen(false);
                    }}
                    className="text-2xl font-display font-semibold text-ink-black hover:text-molten-copper transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <IndustrialButton
                  variant="primary"
                  href="/#contacto"
                  onClick={() => {
                    handleNavClick("/#contacto");
                    setMobileOpen(false);
                  }}
                >
                  Contactar →
                </IndustrialButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
