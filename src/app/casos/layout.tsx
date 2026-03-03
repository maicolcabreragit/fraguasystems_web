import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casos de Ingeniería",
  description:
    "Proyectos reales de automatización HORECA: PMS unificados, motores de venta directa, compliance VeriFactu y SES.Hospedajes. Resultados verificables.",
};

export default function CasosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
