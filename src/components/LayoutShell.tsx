"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { ChatWidget } from "@/components/ChatWidget";

/* ═══════════════════════════════════════════════════════════════════
   Layout Shell — Conditionally renders Navbar/ChatWidget
   Hides them on /dashboard routes (dashboard has its own Sidebar)
   ═══════════════════════════════════════════════════════════════════ */

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isPortal = pathname.startsWith("/area-clientes/portal");

  return (
    <>
      {!isDashboard && !isPortal && <Navbar />}
      {children}
      {!isDashboard && !isPortal && <ChatWidget />}
    </>
  );
}
