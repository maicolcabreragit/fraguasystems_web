"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   Settings Page — User management and configuration
   ═══════════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-titanium-white tracking-tight">
          Configuración
        </h1>
        <p className="text-xs text-machine-gray/50 mt-0.5">
          Gestión de la plataforma interna
        </p>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#141619] border border-brushed-steel/10 p-5"
      >
        <h2 className="text-sm font-semibold text-titanium-white/90 mb-4">
          Equipo
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2.5 border-b border-brushed-steel/8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-molten-copper/15 border border-molten-copper/30 flex items-center justify-center text-molten-copper text-xs font-bold">
                MC
              </div>
              <div>
                <p className="text-sm text-titanium-white">Maicol Cabrera</p>
                <p className="text-[11px] text-machine-gray/50">maicolcabreraferreira@gmail.com</p>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-molten-copper/10 text-molten-copper uppercase tracking-wider">
              CEO / Dev
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-industrial-gold/15 border border-industrial-gold/30 flex items-center justify-center text-industrial-gold text-xs font-bold">
                SV
              </div>
              <div>
                <p className="text-sm text-titanium-white">Socio Ventas</p>
                <p className="text-[11px] text-machine-gray/50">socio@fraguasystems.com</p>
              </div>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-industrial-gold/10 text-industrial-gold uppercase tracking-wider">
              Sales / Closer
            </span>
          </div>
        </div>
      </motion.div>

      {/* Credentials */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#141619] border border-brushed-steel/10 p-5"
      >
        <h2 className="text-sm font-semibold text-titanium-white/90 mb-2">
          Credenciales de acceso
        </h2>
        <p className="text-xs text-machine-gray/50 mb-4">
          Credenciales actuales para el login del dashboard.
        </p>
        <div className="bg-[#0f1013] border border-brushed-steel/10 p-4 font-mono text-xs space-y-1.5">
          <p className="text-machine-gray/60">
            <span className="text-machine-gray/30">Email:</span>{" "}
            <span className="text-titanium-white/70">maicolcabreraferreira@gmail.com</span>
          </p>
          <p className="text-machine-gray/60">
            <span className="text-machine-gray/30">Pass:</span>{" "}
            <span className="text-titanium-white/70">fragua2026</span>
          </p>
          <div className="border-t border-brushed-steel/10 my-2 pt-2" />
          <p className="text-machine-gray/60">
            <span className="text-machine-gray/30">Email:</span>{" "}
            <span className="text-titanium-white/70">socio@fraguasystems.com</span>
          </p>
          <p className="text-machine-gray/60">
            <span className="text-machine-gray/30">Pass:</span>{" "}
            <span className="text-titanium-white/70">fragua2026</span>
          </p>
        </div>
        <p className="text-[10px] text-amber-500/60 mt-3">
          ⚠️ Cambiar estas credenciales en producción editando src/lib/auth.ts
        </p>
      </motion.div>

      {/* Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#141619] border border-brushed-steel/10 p-5"
      >
        <h2 className="text-sm font-semibold text-titanium-white/90 mb-4">
          Sistema
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-machine-gray/40 block mb-0.5">Storage</span>
            <span className="text-titanium-white/70">JSON File (Phase 1)</span>
          </div>
          <div>
            <span className="text-machine-gray/40 block mb-0.5">Framework</span>
            <span className="text-titanium-white/70">Next.js 16 + React 19</span>
          </div>
          <div>
            <span className="text-machine-gray/40 block mb-0.5">Auth</span>
            <span className="text-titanium-white/70">JWT (jose)</span>
          </div>
          <div>
            <span className="text-machine-gray/40 block mb-0.5">Design System</span>
            <span className="text-titanium-white/70">Industrial Luxe v2.0</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
