import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Servicios HORECA | Fragua Systems",
  description:
    "100 servicios de ingeniería de software para hoteles y restaurantes: PMS, motor de reservas, VeriFactu, SES.Hospedajes, automatización IA, ciberseguridad y soporte técnico.",
};

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
