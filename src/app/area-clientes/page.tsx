"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   /area-clientes — Client Login Portal

   Placeholder login page. Backend authentication will be
   implemented later.
   ═══════════════════════════════════════════════════════════════════ */

export default function AreaClientesPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="section-dark min-h-screen flex items-center justify-center px-6 py-24">
      {/* Background ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 50% at 50% 40%, rgba(200,106,61,0.04) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative w-full max-w-md"
      >
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

        {/* Login Card */}
        <div className="rounded-2xl border border-brushed-steel/20 bg-forged-slate/30 backdrop-blur-sm p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-molten-copper/10 border border-molten-copper/20 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-2xl text-titanium-white mb-2">
              Área de Clientes
            </h1>
            <p className="text-sm text-machine-gray">
              Acceda a su panel de seguimiento de proyectos
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Auth will be implemented later
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label htmlFor="client-email" className="block text-xs font-medium text-machine-gray/80 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="su@empresa.com"
                className="
                  w-full px-4 py-3 rounded-lg text-sm
                  bg-abyss-black/60 border border-brushed-steel/20
                  text-titanium-white placeholder:text-machine-gray/40
                  focus:outline-none focus:border-molten-copper/50 focus:ring-1 focus:ring-molten-copper/20
                  transition-all duration-300
                "
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="client-password" className="block text-xs font-medium text-machine-gray/80 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                id="client-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full px-4 py-3 rounded-lg text-sm
                  bg-abyss-black/60 border border-brushed-steel/20
                  text-titanium-white placeholder:text-machine-gray/40
                  focus:outline-none focus:border-molten-copper/50 focus:ring-1 focus:ring-molten-copper/20
                  transition-all duration-300
                "
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full py-3 rounded-lg text-sm font-semibold tracking-wide
                bg-molten-copper text-abyss-black
                hover:bg-molten-copper/90 active:scale-[0.98]
                transition-all duration-200
              "
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-machine-gray/50 mt-6">
            Las credenciales de acceso son proporcionadas por su gestor de proyecto.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
