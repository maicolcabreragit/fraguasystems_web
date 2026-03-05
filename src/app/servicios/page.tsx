"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IndustrialButton } from "@/components/ui/IndustrialButton";

/* ═══════════════════════════════════════════════════════════════════
   /servicios — Full Service Catalog (100+ services)
   
   Features:
   - Real-time search with fuzzy matching
   - Tier filter chips (Élite / Avanzado / Táctico / MRR)
   - Accordion categories with filtered counts
   - Individual service CTAs → pre-filled contact form
   ═══════════════════════════════════════════════════════════════════ */

type Tier = "elite" | "avanzado" | "tactico" | "mrr";

interface Service {
  id: number;
  name: string;
  desc: string;
  tier: Tier;
}

interface Category {
  icon: string;
  title: string;
  services: Service[];
}

const tierConfig: Record<Tier, { label: string; color: string; bg: string; border: string; activeBg: string }> = {
  elite:    { label: "ÉLITE",    color: "text-molten-copper",     bg: "bg-molten-copper/8",    border: "border-molten-copper/20",    activeBg: "bg-molten-copper/20" },
  avanzado: { label: "AVANZADO", color: "text-industrial-gold",   bg: "bg-industrial-gold/8",  border: "border-industrial-gold/20",  activeBg: "bg-industrial-gold/20" },
  tactico:  { label: "TÁCTICO",  color: "text-emerald-400",       bg: "bg-emerald-400/8",      border: "border-emerald-400/20",      activeBg: "bg-emerald-400/20" },
  mrr:      { label: "MRR",      color: "text-sky-400",           bg: "bg-sky-400/8",          border: "border-sky-400/20",          activeBg: "bg-sky-400/20" },
};

const categories: Category[] = [
  {
    icon: "🏗️",
    title: "Sistemas PMS & ERP Core",
    services: [
      { id: 1,  name: "ERP HORECA Multisede", desc: "Unifica contabilidad de múltiples locales para VeriFactu 2027", tier: "elite" },
      { id: 2,  name: "PMS Híbrido Cloud/Edge", desc: "Procesos críticos locales + sincronización cloud para zonas sin cobertura", tier: "elite" },
      { id: 3,  name: "Motor de Precios Dinámicos (Yield Management)", desc: "IA que ajusta tarifas cruzando meteorología y ocupación en tiempo real", tier: "elite" },
      { id: 9,  name: "Recepción y Conserjería Autónoma", desc: "Kiosco check-in con OCR de DNI y envío automático a SES.Hospedajes", tier: "elite" },
      { id: 20, name: "Migración de Bases de Datos Legacy a Cloud-Native", desc: "De Access/servidores locales a arquitectura segura y escalable", tier: "elite" },
      { id: 34, name: "Inventario Inteligente (Cocina, Bar y Bodega)", desc: "Escandallos conectados al TPV: descuenta por cada venta procesada", tier: "avanzado" },
      { id: 42, name: "Inventario Dinámico de Alquiler de Material (Ski/Snow)", desc: "Control RFID vinculado al PMS para cobro unificado al check-out", tier: "avanzado" },
      { id: 89, name: "TPV Cloud-Native (Licencia SaaS)", desc: "Reemplazo de cajas registradoras legacy por TPV táctil en navegador", tier: "mrr" },
    ],
  },
  {
    icon: "🌐",
    title: "Motor de Ventas Premium (Web + Reservas)",
    services: [
      { id: 5,  name: "Plataforma de Venta Directa (Bypass OTA)", desc: "Infraestructura propia de alta conversión: retén el 100% del pago", tier: "elite" },
      { id: 15, name: "Motor Multi-Espacio y Paquetización Cruzada", desc: "Un solo ticket digital para hotel + restaurante + spa + actividades", tier: "elite" },
      { id: 22, name: "Venta Directa Gastronómica (Bye TheFork)", desc: "Motor propio de reservas de mesas sin comisiones transaccionales", tier: "avanzado" },
      { id: 23, name: "Motor de Reservas Web con Up-Selling Pre-Llegada", desc: "Ofrece late check-out, desayunos premium durante el proceso de pago", tier: "avanzado" },
      { id: 36, name: "Channel Manager Propio (Anti-Overbooking)", desc: "Sincroniza calendario en Airbnb, Booking y VRBO con latencia casi nula", tier: "avanzado" },
      { id: 54, name: "WiFi de Invitados con Portal Cautivo y Captura de Leads", desc: "WiFi gratis a cambio de email: construye base First-Party Data", tier: "tactico" },
      { id: 56, name: "Pasarela de Pagos (Stripe / Redsys V2)", desc: "Cobro seguro de anticipos No-Refundable para eliminar no-shows", tier: "tactico" },
      { id: 57, name: "Frontend Web Headless (Next.js)", desc: "Web que carga al instante en 3G de montaña: +20% conversión directa", tier: "tactico" },
      { id: 63, name: "Pricing Bridge (Scraping + Paridad de Tarifas)", desc: "Robot que iguala tarifas web propia vs Booking automáticamente", tier: "tactico" },
      { id: 75, name: "Landing Page Transaccional para Eventos MICE", desc: "Páginas efímeras de alta conversión para teambuilding corporativo", tier: "tactico" },
      { id: 78, name: "Optimización WPO (Core Web Vitals)", desc: "Supera métricas de Google para posicionar por encima de las OTAs", tier: "tactico" },
      { id: 82, name: "Motor de Reservas B2C (Licencia SaaS)", desc: "Suscripción plana que reemplaza comisiones variables de Booking", tier: "mrr" },
    ],
  },
  {
    icon: "⚖️",
    title: "Compliance Normativo 2026-2027",
    services: [
      { id: 16, name: "Integración Nativa VeriFactu 2027", desc: "Reingeniería de BD para hashes encadenados y reporte AEAT en tiempo real", tier: "elite" },
      { id: 11, name: "Trazabilidad de Desperdicio Alimentario (Ley 1/2025)", desc: "Control documental automatizado y pesaje IoT de residuos", tier: "elite" },
      { id: 21, name: "API Directa SES.Hospedajes", desc: "Extrae datos del PMS/escáner DNI e inyecta JSON al Ministerio del Interior", tier: "avanzado" },
      { id: 25, name: "Control Horario Digital Inmutable", desc: "Sistema criptográfico anti-fraude para la ley 2026 (papel prohibido)", tier: "avanzado" },
      { id: 29, name: "Gestor Documental + Firma Digital Biométrica", desc: "Facturación VeriFactu-ready: PDF cifrado con retención ≥4 años", tier: "avanzado" },
      { id: 32, name: "Auditoría de Código y Software Legacy", desc: "Inspección de TPV/PMS para certificar cumplimiento RRSIF VeriFactu", tier: "avanzado" },
      { id: 50, name: "Auditoría de Cumplimiento Normativo Integral", desc: "Inspección técnica: SES, VeriFactu, plásticos, GDPR, todo en uno", tier: "avanzado" },
      { id: 53, name: "Saneamiento de BD de Huéspedes (Data Cleansing)", desc: "Limpieza algorítmica previa a migración VeriFactu", tier: "tactico" },
      { id: 55, name: "Informes VeriFactu-No (Modalidad Puente)", desc: "Guardado local seguro de hashes + QR en facturas para transición 2026", tier: "tactico" },
      { id: 72, name: "Etiquetado Nutricional y Auditoría de Alérgenos", desc: "Etiquetas buffet con trazabilidad automática desde albaranes", tier: "tactico" },
      { id: 83, name: "Mantenimiento API SES.Hospedajes (SaaS)", desc: "Actualizaciones continuas de certificados y protocolos del Gobierno", tier: "mrr" },
      { id: 87, name: "Conformidad Fiscal VeriFactu (SaaS)", desc: "Mantenimiento de hashes criptográficos y certificados electrónicos AEAT", tier: "mrr" },
      { id: 92, name: "Orquestador de Actualizaciones Legales (Legal Sync)", desc: "Actualización automática de SMI, IRPF, retenciones en tu ERP", tier: "mrr" },
      { id: 95, name: "Gestor Inteligente de Residuos (Ley 1/2025 SaaS)", desc: "Software cloud para trazabilidad de kg de comida destruida", tier: "mrr" },
    ],
  },
  {
    icon: "🤖",
    title: "Automatización Operativa & IA",
    services: [
      { id: 7,  name: "Optimización de Fuerza Laboral IA", desc: "Asignación algorítmica de turnos según ocupación proyectada", tier: "elite" },
      { id: 13, name: "Compras Automatizadas (Procurement IA)", desc: "Predicción de consumo + API con distribuidores para evitar roturas de stock", tier: "elite" },
      { id: 18, name: "Suite de Automatización Burocrática (RPA)", desc: "Contratos, nóminas y altas SS conectadas al reloj biométrico", tier: "elite" },
      { id: 27, name: "Plataforma Omnicanal (WhatsApp + Instagram + Email)", desc: "Un solo panel para gestionar picos de consultas con personal mínimo", tier: "avanzado" },
      { id: 30, name: "Onboarding Exprés de Temporeros", desc: "Alta SS, firma PRL y entrega EPIs desde el smartphone del empleado", tier: "avanzado" },
      { id: 31, name: "Predicción de Demanda y Órdenes de Compra Automáticas", desc: "Cruza reservas a 14 días con inventario y emite alertas de compra", tier: "avanzado" },
      { id: 38, name: "Análisis Semántico de Reseñas (NLP)", desc: "IA que agrupa opiniones y detecta fallos operativos subyacentes", tier: "avanzado" },
      { id: 47, name: "Orquestación de Limpieza en Tiempo Real", desc: "Alertas push a gobernanta al check-out según hora de llegada siguiente", tier: "avanzado" },
      { id: 51, name: "Conserjería Autónoma Multilingüe 24/7 (Bot NLP)", desc: "Agente IA en WhatsApp para reservas y dudas en CA/ES/EN/FR", tier: "tactico" },
      { id: 76, name: "Traducción Dinámica de Activos Digitales (LLM)", desc: "Cartas, web y correos traducidos por IA al francés, inglés, holandés", tier: "tactico" },
      { id: 77, name: "Alertas de Stock Operativo Crítico", desc: "Alerta Telegram al gerente cuando un producto baja del umbral mínimo", tier: "tactico" },
    ],
  },
  {
    icon: "📊",
    title: "Control Financiero & Analítica",
    services: [
      { id: 8,  name: "Data Lake de Inteligencia de Negocio", desc: "Cruza pernoctaciones con facturación para decisiones basadas en datos puros", tier: "elite" },
      { id: 24, name: "Cuadro de Mando de Costes Energéticos", desc: "Vincula factura eléctrica con ocupación PMS para optimizar tarifa 3.0TD", tier: "avanzado" },
      { id: 39, name: "Facturación B2B Automatizada (Eventos y Agencias)", desc: "Facturas desglosadas con retenciones, suplidos y tasas turísticas", tier: "avanzado" },
      { id: 46, name: "Integración TPV Físico ↔ ERP Central", desc: "Sincroniza cajas de bares a 2.000m con contabilidad del valle en tiempo real", tier: "avanzado" },
      { id: 49, name: "Reporting Financiero Automatizado (P&L, RevPAR, ADR)", desc: "Informes ejecutivos automáticos el día 1 de cada mes a inversores", tier: "avanzado" },
      { id: 59, name: "Propinas Digitales y Liquidación en Nómina", desc: "Añadir propina con tarjeta + liquidación legal porcentual en nómina", tier: "tactico" },
      { id: 65, name: "Panel de Inteligencia de Ocupación (PowerBI)", desc: "Visualización de datos del PMS para detectar baja ocupación y lanzar ofertas", tier: "tactico" },
      { id: 68, name: "Optimización Algorítmica de Factura Eléctrica", desc: "24 meses de datos horarios para demostrar ahorro de +5.000€/año", tier: "tactico" },
      { id: 70, name: "Conector a Contabilidad Local (A3, ContaPlus)", desc: "Exportación diaria automática de asientos contables desde el TPV", tier: "tactico" },
      { id: 100, name: "Dashboards C-Level en Tiempo Real (SaaS)", desc: "KPIs vitales adaptados al móvil del CEO: RevPAR, ADR, forecast", tier: "mrr" },
    ],
  },
  {
    icon: "👥",
    title: "Gestión de Personal & RRHH",
    services: [
      { id: 35, name: "Portal de Empleados y Autogestión de Turnos (PWA)", desc: "Solicitudes de cambio/vacaciones con aprobación automática", tier: "avanzado" },
      { id: 40, name: "Plataforma de Micro-Formación (LMS)", desc: "Vídeos interactivos para onboarding: cómo usar TPV VeriFactu, protocolos", tier: "avanzado" },
      { id: 64, name: "Tablero Kanban Operativo para Plantilla", desc: "Tarjetas de colores para cocina + mantenimiento sin software complejo", tier: "tactico" },
      { id: 84, name: "Control Horario Biométrico (SaaS Cloud)", desc: "Alojamiento cifrado + 4 años de retención legal de fichajes", tier: "mrr" },
    ],
  },
  {
    icon: "⚡",
    title: "IoT, Energía & Mantenimiento Predictivo",
    services: [
      { id: 4,  name: "Climatización Automatizada + Autoconsumo (IoT)", desc: "Apaga circuitos de habitaciones vacías al sincronizar con el PMS", tier: "elite" },
      { id: 17, name: "Gemelo Digital para Mantenimiento Predictivo", desc: "Modelo 3D de instalación térmica que detecta fallos antes de que ocurran", tier: "elite" },
      { id: 33, name: "Sensores IoT de Aforo y Ventilación Dinámica", desc: "Control CO2 y temperatura en bares aprés-ski para reducir HVAC", tier: "avanzado" },
      { id: 48, name: "Control de Cadena de Frío IoT", desc: "Sensores en congeladores + alerta SMS al chef si falla el suministro", tier: "avanzado" },
      { id: 58, name: "Telemetría IoT y Alertas Operativas Críticas", desc: "Aviso al conserje de guardia si alarma de incendios o piscina fallan", tier: "tactico" },
      { id: 62, name: "Partes de Trabajo de Mantenimiento Digitales", desc: "Tickets digitales para reparaciones: fin de los post-its perdidos", tier: "tactico" },
      { id: 66, name: "Trazabilidad Logística con Lavandería Industrial", desc: "Escaneo de códigos de barras + conciliación automática de facturas", tier: "tactico" },
      { id: 86, name: "Mantenimiento de Nodos Edge en Zonas Remotas", desc: "Actualización remota de hardware TPV/PMS en refugios sin conexión", tier: "mrr" },
      { id: 90, name: "Centro de Operaciones de Red (NOC) para IoT", desc: "Vigilancia 24/7 de sensores de climatización y sondas frigoríficas", tier: "mrr" },
      { id: 97, name: "Soporte L1/L2 de Hardware Kioscos/IoT", desc: "Mantenimiento preventivo de pantallas táctiles y escáneres MRZ", tier: "mrr" },
    ],
  },
  {
    icon: "🔒",
    title: "Ciberseguridad & Infraestructura Cloud",
    services: [
      { id: 12, name: "Ciberseguridad Zero Trust (HORECA)", desc: "Encriptación militar de datos de pago y pasaportes contra ransomware", tier: "elite" },
      { id: 14, name: "Control de Accesos Biométrico (Huella/Facial)", desc: "Adiós tarjetas RFID: acceso biométrico a spa, guardasquís, habitaciones", tier: "elite" },
      { id: 19, name: "Pago Desatendido 'Grab & Go' para Buffets", desc: "Visión artificial que detecta platos en bandeja y cobra sin cajero", tier: "elite" },
      { id: 28, name: "Pagos Tokenizados (PCI-DSS Compliance)", desc: "Token opaco en PMS para cobros automáticos de no-show sin datos sensibles", tier: "avanzado" },
      { id: 37, name: "Continuidad de Negocio y DRP en la Nube", desc: "BD transaccionales restauradas en minutos desde nodo redundante", tier: "avanzado" },
      { id: 44, name: "Comunicación Interna Encriptada End-to-End", desc: "Reemplaza grupos de WhatsApp del staff por app corporativa auditable", tier: "avanzado" },
      { id: 73, name: "Entorno Staging y Backup Pre-Actualizaciones", desc: "Sandbox para testear VeriFactu antes de aplicar en producción", tier: "tactico" },
      { id: 79, name: "VPN para Teletrabajo Ejecutivo", desc: "Acceso encriptado a facturación, PMS y cámaras desde el móvil del CEO", tier: "tactico" },
      { id: 85, name: "Infraestructura Cloud de Alta Disponibilidad", desc: "Servidores dedicados con SLA 99.9% para instancias PMS propias", tier: "mrr" },
      { id: 88, name: "Monitorización de Pasarelas de Pago (PSD2)", desc: "Actualización proactiva de 3D Secure + escaneos de vulnerabilidades", tier: "mrr" },
      { id: 93, name: "Custodia Inmutable y Backups Cifrados (Cold Storage)", desc: "Volcado diario off-site cifrado: seguro de vida contra ransomware", tier: "mrr" },
      { id: 98, name: "Gestión de Certificados SSL, Dominios y DNS", desc: "Externalización total del riesgo de caducidad de certificados", tier: "mrr" },
    ],
  },
  {
    icon: "⭐",
    title: "Experiencia del Cliente & Fidelización",
    services: [
      { id: 6,  name: "Integración API con Forfaits de Esquí", desc: "Sincroniza Baqueira/Boí Taüll con reserva de hotel + QR único", tier: "elite" },
      { id: 10, name: "Tokenización para Fidelización B2B", desc: "Tokens criptográficos propios para agencias y empresas de aventura", tier: "elite" },
      { id: 26, name: "Kiosco Self-Check-In + Llaves RFID", desc: "Totem para casas rurales: entrega llaves sin presencia del propietario", tier: "avanzado" },
      { id: 45, name: "Programa de Lealtad Blockchain-Based", desc: "Saldo digital seguro para turistas recurrentes de Toulouse/Barcelona", tier: "avanzado" },
      { id: 52, name: "Menús Digitales Interactivos + Control de Alérgenos", desc: "QR dinámico que oculta platos sin stock y muestra alertas de alérgenos", tier: "tactico" },
      { id: 60, name: "Contratos Inteligentes para Turismo Rural", desc: "PDF dinámico con firma digital: normas, mascotas, ruido nocturno", tier: "tactico" },
      { id: 61, name: "API Wrapper PMS ↔ Cerraduras Bluetooth/NFC", desc: "Credencial digital en el móvil del huésped al hacer check-in", tier: "tactico" },
      { id: 69, name: "Encuestas NPS + Interceptor de Reseñas", desc: "NPS alto → pide reseña Google; NPS bajo → intercepta queja privada", tier: "tactico" },
      { id: 71, name: "Deduplicación de Perfiles CRM", desc: "Fuzzy matching para unificar historiales de clientes duplicados", tier: "tactico" },
      { id: 74, name: "Motor de Alertas Meteorológicas de Negocio", desc: "Temporal de nieve → campaña automática de cadenas, parking y sopas", tier: "tactico" },
      { id: 94, name: "Mantenimiento de App Móvil del Hotel", desc: "Actualizaciones iOS/Android para que cerraduras digitales nunca fallen", tier: "mrr" },
      { id: 96, name: "Plataforma de Emailing HORECA (SMTP Dedicado)", desc: "50K emails/mes con SPF/DKIM/DMARC para evitar spam de confirmaciones", tier: "mrr" },
      { id: 99, name: "Mantenimiento de Integración con Estaciones de Esquí", desc: "Monitorización 24/7 del puente API de forfaits durante temporada alta", tier: "mrr" },
    ],
  },
  {
    icon: "♻️",
    title: "Sostenibilidad & Desperdicio",
    services: [
      { id: 41, name: "Control Criptográfico de Mermas (Ley 1/2025)", desc: "Báscula IoT + TPV: calcula euros perdidos por cada desecho de cocina", tier: "avanzado" },
      { id: 43, name: "Auditoría de Sostenibilidad y Huella de Carbono ESG", desc: "Cálculo algorítmico de CO2 por habitación para subvenciones Next Gen", tier: "avanzado" },
    ],
  },
  {
    icon: "🔧",
    title: "Consultoría & Soporte Técnico",
    services: [
      { id: 67, name: "Helpdesk HORECA Centralizado", desc: "Sistema de tickets para incidencias entre locales del grupo", tier: "tactico" },
      { id: 80, name: "Auditoría In-Situ de Transformación Digital", desc: "Escáner de 4h en sede: reporte de normativas incumplidas + cuantificación", tier: "tactico" },
      { id: 81, name: "Soporte L3 24/7 de Misión Crítica (Retainer)", desc: "Intervención remota en minutos si el servidor cae en Puente de Diciembre", tier: "mrr" },
      { id: 91, name: "Bolsa de Horas de Desarrollo Evolutivo", desc: "Retainer mensual con prioridad de desarrollo para nuevas funcionalidades", tier: "mrr" },
    ],
  },
];

/* ─── Helper: normalize text for search ─────────────────────────── */
function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ─── Tier Badge ────────────────────────────────────────────────── */
function TierBadge({ tier }: { tier: Tier }) {
  const cfg = tierConfig[tier];
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${cfg.color} ${cfg.bg} border ${cfg.border} whitespace-nowrap`}
    >
      {cfg.label}
    </span>
  );
}

/* ─── Category Accordion ────────────────────────────────────────── */
function CategoryAccordion({ 
  cat, 
  filteredServices, 
  defaultOpen,
  searchQuery,
}: { 
  cat: Category; 
  filteredServices: Service[];
  defaultOpen?: boolean;
  searchQuery: string;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  if (filteredServices.length === 0) return null;

  return (
    <motion.div
      layout
      className="border border-brushed-steel/15 overflow-hidden transition-colors hover:border-brushed-steel/30"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-forged-slate/40"
      >
        <span className="text-xl leading-none" aria-hidden="true">{cat.icon}</span>
        <span className="flex-1 font-display font-semibold text-titanium-white text-sm md:text-base tracking-tight">
          {cat.title}
        </span>
        <span className="text-[11px] text-machine-gray/50 font-mono tabular-nums mr-2">
          {filteredServices.length}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          className={`text-machine-gray/40 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-0.5">
              <div className="h-px bg-brushed-steel/10 mb-3" />
              {filteredServices.map((s) => (
                <ServiceRow key={s.id} service={s} searchQuery={searchQuery} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Service Row with CTA ──────────────────────────────────────── */
function ServiceRow({ service, searchQuery }: { service: Service; searchQuery: string }) {
  const [expanded, setExpanded] = useState(false);

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!searchQuery.trim()) return text;
    const normalizedQuery = normalize(searchQuery);
    const normalizedText = normalize(text);
    const idx = normalizedText.indexOf(normalizedQuery);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + searchQuery.length);
    const after = text.slice(idx + searchQuery.length);
    return (
      <>
        {before}
        <mark className="bg-molten-copper/25 text-molten-copper rounded-sm px-0.5">{match}</mark>
        {after}
      </>
    );
  };

  return (
    <div className="group">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-2.5 py-2 text-left transition-colors hover:bg-forged-slate/20 px-2 -mx-2"
      >
        <TierBadge tier={service.tier} />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-titanium-white/90">
            {highlightMatch(service.name)}
          </span>
          <span className="text-sm text-machine-gray/50 ml-1.5">
            · {highlightMatch(service.desc)}
          </span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          className={`text-machine-gray/30 flex-shrink-0 mt-1 transition-all duration-200 
            ${expanded ? "rotate-180 text-molten-copper/60" : "opacity-0 group-hover:opacity-100"}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-12 pr-4 pb-3 flex items-center gap-3">
              <p className="text-sm text-machine-gray/70 flex-1">
                {service.desc}
              </p>
              <Link
                href={`/#contacto?servicio=${encodeURIComponent(service.name)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-molten-copper 
                  border border-molten-copper/30 hover:bg-molten-copper/10 hover:border-molten-copper/50
                  transition-all duration-200 whitespace-nowrap flex-shrink-0"
              >
                Solicitar info
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════════════════ */
export default function ServiciosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTiers, setActiveTiers] = useState<Set<Tier>>(new Set());

  const totalServices = categories.reduce((acc, c) => acc + c.services.length, 0);

  const toggleTier = useCallback((tier: Tier) => {
    setActiveTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  }, []);

  // Filter categories and services
  const filteredCategories = useMemo(() => {
    const normalizedQuery = normalize(searchQuery.trim());

    return categories.map((cat) => {
      const filtered = cat.services.filter((s) => {
        // Tier filter
        if (activeTiers.size > 0 && !activeTiers.has(s.tier)) return false;
        // Search filter
        if (normalizedQuery) {
          const haystack = normalize(`${s.name} ${s.desc}`);
          return haystack.includes(normalizedQuery);
        }
        return true;
      });
      return { ...cat, filteredServices: filtered };
    });
  }, [searchQuery, activeTiers]);

  const filteredCount = filteredCategories.reduce((acc, c) => acc + c.filteredServices.length, 0);
  const isFiltering = searchQuery.trim() !== "" || activeTiers.size > 0;

  return (
    <main className="section-dark min-h-screen pt-24 md:pt-32 pb-20">
      {/* ─── Header ──────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-8">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-molten-copper mb-4">
            <span className="inline-block w-8 h-px bg-molten-copper" aria-hidden="true" />
            Catálogo Completo
          </span>
          <h1 className="font-display font-bold text-titanium-white mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            {totalServices} Servicios de{" "}
            <span className="text-gradient-copper">Ingeniería HORECA.</span>
          </h1>
          <p className="text-lg text-machine-gray leading-relaxed max-w-2xl mb-8">
            Desde arquitecturas PMS de misión crítica hasta automatizaciones
            tácticas de alto impacto. Cada servicio resuelve un dolor operativo
            específico del sector.
          </p>
        </motion.div>
      </div>

      {/* ─── Search + Filters Bar ─────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 22 }}
          className="space-y-4"
        >
          {/* Search input */}
          <div className="relative">
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-machine-gray/40 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar servicios... ej: VeriFactu, PMS, IoT, reservas"
              className="w-full pl-12 pr-4 py-3.5 
                bg-forged-slate/40 border border-brushed-steel/20
                text-titanium-white text-sm
                placeholder:text-machine-gray/40
                focus:outline-none focus:border-molten-copper/50 focus:ring-1 focus:ring-molten-copper/15
                transition-all duration-300 font-body"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-machine-gray/40 hover:text-titanium-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Tier filter chips + results counter */}
          <div className="flex flex-wrap items-center gap-2">
            {(Object.entries(tierConfig) as [Tier, typeof tierConfig[Tier]][]).map(([key, cfg]) => {
              const isActive = activeTiers.has(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleTier(key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase
                    border transition-all duration-200
                    ${isActive 
                      ? `${cfg.color} ${cfg.activeBg} ${cfg.border}` 
                      : `text-machine-gray/50 bg-transparent border-brushed-steel/15 hover:border-brushed-steel/30 hover:text-machine-gray`
                    }`}
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isActive ? cfg.activeBg : "bg-machine-gray/20"} border ${cfg.border}`} />
                  {cfg.label}
                </button>
              );
            })}

            {/* Results counter */}
            <div className="ml-auto text-[11px] text-machine-gray/50 font-mono tabular-nums">
              {isFiltering ? (
                <motion.span
                  key={filteredCount}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {filteredCount} de {totalServices} servicios
                </motion.span>
              ) : (
                <span>{totalServices} servicios</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Accordion Grid ──────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((cat, i) => (
              cat.filteredServices.length > 0 && (
                <motion.div
                  key={cat.title}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 22, delay: i * 0.03 } }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                >
                  <CategoryAccordion
                    cat={cat}
                    filteredServices={cat.filteredServices}
                    defaultOpen={isFiltering || i === 0}
                    searchQuery={searchQuery}
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* No results state */}
          {filteredCount === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border border-brushed-steel/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-machine-gray/30">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-machine-gray/50 text-sm mb-2">
                No se encontraron servicios para esta búsqueda.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveTiers(new Set()); }}
                className="text-sm text-molten-copper hover:text-molten-copper/80 transition-colors"
              >
                Limpiar filtros
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* ─── Bottom CTA ──────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="text-center"
        >
          <p className="text-machine-gray mb-6">
            ¿No sabe por dónde empezar? Le hacemos una auditoría gratuita de su negocio.
          </p>
          <IndustrialButton variant="primary" href="/#contacto">
            Solicitar Auditoría Arquitectónica
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </IndustrialButton>
        </motion.div>
      </div>
    </main>
  );
}
