import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard | Fragua Systems",
  description: "Panel de gestión interno de Fragua Systems — CRM, proyectos y métricas.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0e0f12]" style={{ fontFamily: "var(--font-body), 'Inter', system-ui, sans-serif" }}>
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
