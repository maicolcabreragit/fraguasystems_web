"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════════
   Client Portal Layout — /area-clientes/portal
   
   Clean, light-themed layout for clients to view their project.
   Includes header with branding and logout, main content area.
   ═══════════════════════════════════════════════════════════════════ */

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/area-clientes");
  };

  return (
    <div className="min-h-screen bg-[#0e0f12]">
      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-[#111316]/80 backdrop-blur-md border-b border-brushed-steel/10"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-molten-copper/10 border border-molten-copper/20 rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-molten-copper text-sm">FS</span>
            </div>
            <div>
              <span className="font-display font-bold text-titanium-white text-sm tracking-tight">
                Fragua Systems
              </span>
              <span className="block text-[10px] text-machine-gray/50 uppercase tracking-widest">
                Portal de cliente
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-machine-gray/60 hover:text-titanium-white transition-colors flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Web principal
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-machine-gray/50 hover:text-red-400 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
