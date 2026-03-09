"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════
   /area-trabajadores — Internal Staff Login
   
   Only admin users can log in here.
   Always redirects to /dashboard.
   ═══════════════════════════════════════════════════════════════════ */

export default function AreaTrabajadoresPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error de autenticación");
        setLoading(false);
        return;
      }

      if (data.user.role !== "admin") {
        setError("Acceso restringido a trabajadores. Si eres cliente, usa el Área de Clientes.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Error de conexión. Inténtelo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <main className="section-dark min-h-screen flex items-center justify-center px-6 py-24">
      {/* Background ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 50% at 50% 40%, rgba(78,130,220,0.06) 0%, transparent 70%)
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-2xl text-titanium-white mb-2">
              Área de Trabajadores
            </h1>
            <p className="text-sm text-machine-gray">
              Dashboard interno del equipo Fragua Systems
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="worker-email" className="block text-xs font-medium text-machine-gray/80 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <input
                id="worker-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@fraguasystems.com"
                className="
                  w-full px-4 py-3 rounded-lg text-sm
                  bg-abyss-black/60 border border-brushed-steel/20
                  text-titanium-white placeholder:text-machine-gray/40
                  focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20
                  transition-all duration-300
                "
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="worker-password" className="block text-xs font-medium text-machine-gray/80 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                id="worker-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full px-4 py-3 rounded-lg text-sm
                  bg-abyss-black/60 border border-brushed-steel/20
                  text-titanium-white placeholder:text-machine-gray/40
                  focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20
                  transition-all duration-300
                "
                required
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-lg text-sm font-semibold tracking-wide
                bg-blue-500 text-white
                hover:bg-blue-500/90 active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Acceder al Dashboard"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-machine-gray/50 mt-6">
            Acceso exclusivo para el equipo de Fragua Systems.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
