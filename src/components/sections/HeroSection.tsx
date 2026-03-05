"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   HeroSection — Industrial Clean v3.0
   
   Full-viewport dark section with:
   - Background video rotation (if videos exist)
   - Crossfade transitions between clips
   - Dark overlay for text legibility
   - Fallback to ambient glow if no videos
   ═══════════════════════════════════════════════════════════════════ */

// Videos in public/hero-videos/ — add or remove as needed.
// The component auto-detects which ones exist.
const HERO_VIDEOS = [
  "/hero-videos/hero_hotel_lobby.mp4",
  "/hero-videos/hero_kitchen_copper.mp4",
  "/hero-videos/hero_server_corridor.mp4",
  "/hero-videos/hero_restaurant_evening.mp4",
  "/hero-videos/hero_copper_abstract.mp4",
  "/hero-videos/hero_startup_planning.mp4",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 22,
    },
  },
};

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const activeRef = useRef(0);

  // Handle video end: pause it immediately, then advance
  const handleVideoEnded = useCallback((videoIndex: number) => {
    const video = videoRefs.current[videoIndex];
    if (video) {
      video.pause(); // Prevent any restart flicker
    }
    // Only advance if this was the active video
    if (videoIndex === activeRef.current) {
      const next = (videoIndex + 1) % HERO_VIDEOS.length;
      activeRef.current = next;
      setActiveIndex(next);
    }
  }, []);

  // Play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  const setVideoRef = useCallback((el: HTMLVideoElement | null, i: number) => {
    videoRefs.current[i] = el;
    if (el && i === 0 && el.paused) {
      el.play().catch(() => {});
    }
  }, []);

  const hasVideos = HERO_VIDEOS.length > 0;

  return (
    <section
      id="hero"
      className="section-dark relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ─── Video Background (if videos exist) ──────────── */}
      {hasVideos && (
        <div className="absolute inset-0 z-0">
          {HERO_VIDEOS.map((src, i) => (
            <video
              key={src}
              ref={(el) => setVideoRef(el, i)}
              src={src}
              muted
              playsInline
              preload="auto"
              onEnded={() => handleVideoEnded(i)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />
          ))}
          {/* Dark overlay for text legibility */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: `
                linear-gradient(180deg, 
                  rgba(14,15,18,0.80) 0%, 
                  rgba(14,15,18,0.65) 35%, 
                  rgba(14,15,18,0.70) 65%, 
                  rgba(14,15,18,0.90) 100%
                )
              `,
            }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* ─── Fallback: Subtle ambient glow (no videos) ──── */}
      {!hasVideos && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,106,61,0.06) 0%, transparent 70%)
            `,
          }}
          aria-hidden="true"
        />
      )}

      {/* ─── Content — Centered ──────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 pt-20 text-center"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-machine-gray">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Fragua Systems · Ingeniería HORECA
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
          </span>
        </motion.div>

        {/* H1 — Massive Impact */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-bold leading-[1.05] tracking-tight mb-8 text-titanium-white"
          style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)" }}
        >
          Ingeniería de{" "}
          <span className="text-gradient-copper">Software Pesada</span>
          <br />
          para el Sector HORECA.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl leading-relaxed text-machine-gray max-w-2xl mx-auto mb-12"
        >
          Diseñamos webs de alta conversión, motores de reservas directas,
          automatización con IA, y cumplimiento normativo (VeriFactu, SES.Hospedajes)
          para hoteles y restaurantes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <IndustrialButton variant="primary" onDark href="#contacto">
            Solicitar Auditoría
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </IndustrialButton>

          <IndustrialButton variant="ghost" onDark href="/casos">
            Ver Casos de Ingeniería
          </IndustrialButton>
        </motion.div>

        {/* Micro-trust */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 text-sm text-machine-gray"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 flex-shrink-0" aria-hidden="true" />
          <span className="text-machine-gray/80">
            Resultados verificables ·{" "}
            <a
              href="https://www.hotellagarbinada.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-molten-copper/80 hover:text-molten-copper transition-colors underline underline-offset-2"
            >
              hotellagarbinada.com
            </a>
            {" "}en producción
          </span>
        </motion.div>
      </motion.div>

      {/* ─── Scroll indicator (below all content) ────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-machine-gray/30">
            <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
