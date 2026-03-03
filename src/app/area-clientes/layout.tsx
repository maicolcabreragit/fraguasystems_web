import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Área de Clientes | Fragua Systems",
  description:
    "Acceda a su panel de cliente para consultar el estado de sus proyectos, servicios contratados y seguimiento en tiempo real.",
};

export default function AreaClientesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
