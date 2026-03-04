import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";

/* ═══════════════════════════════════════════════════════════════════
   Fragua Systems — Dual Typography System
   
   Display (H1/H2/H3): IBM Plex Sans
   → "Man-Machine" super-family. Geometric stability that imposes
     engineering authority. Used by deep-tech corporations.
   
   Body (paragraphs, UI, data): Inter
   → Screen-first font optimized for high-density displays.
     Internal ink traps ensure perfect resolution at ≤14px.
   ═══════════════════════════════════════════════════════════════════ */

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* ─── SEO & Meta ────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Fragua Systems — Ingeniería de Software Pesada para el Sector HORECA",
    template: "%s | Fragua Systems",
  },
  description:
    "Automatización integral de PMS, canales de venta directa y cumplimiento garantizado de normativas VeriFactu y SES.Hospedajes para hoteles y restaurantes. Construimos infraestructuras para escalar sus márgenes sin fricción operativa.",
  keywords: [
    "PMS hotelero",
    "software HORECA",
    "VeriFactu",
    "SES.Hospedajes",
    "automatización hotelera",
    "software restaurante",
    "canal de venta directa hotel",
    "gestión restaurante",
    "Fragua Systems",
  ],
  authors: [{ name: "Fragua Systems" }],
  creator: "Fragua Systems",
  metadataBase: new URL("https://fraguasystems.com"),
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Fragua Systems",
    title: "Fragua Systems — Ingeniería de Software Pesada para el Sector HORECA",
    description:
      "Automatización integral de PMS, canales de venta directa y cumplimiento VeriFactu y SES.Hospedajes para hoteles y restaurantes.",
    images: [{ url: "/brand/icon-512.png", width: 512, height: 512, alt: "Fragua Systems" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f5",
  width: "device-width",
  initialScale: 1,
};

/* ─── Root Layout ───────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${ibmPlexSans.variable} ${inter.variable} scroll-smooth`}>
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
