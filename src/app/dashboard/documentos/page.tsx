"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   /dashboard/documentos — Document Library
   
   Central repository of proposal templates, contracts, and
   reference documents for the Fragua Systems team.
   ═══════════════════════════════════════════════════════════════════ */

interface DocItem {
  title: string;
  description: string;
  filename: string;
  href: string;
  date: string;
  category: string;
  sizeLabel: string;
}

const DOCUMENTS: DocItem[] = [
  {
    title: "Propuesta Estratégica — Cal Benito",
    description:
      "Propuesta comercial premium para Restaurante Cal Benito (Lleida). Ecosistema digital integral: identidad, web, menú engineering, canal WhatsApp Business. Referencia de estructura para futuras propuestas HORECA.",
    filename: "Propuesta_CalBenito_FraguaSystems.pdf",
    href: "/docs/Propuesta_CalBenito_FraguaSystems.pdf",
    date: "11 Mar 2026",
    category: "Propuesta Comercial",
    sizeLabel: "3 páginas · PDF",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const RECIBOS: DocItem[] = [
  {
    title: "Recibo Nº FS-2026-0012 — Cal Benito",
    description:
      "Primer pago (50%) del Ecosistema Digital Integral. Importe recibido: 900,00 €. Pendiente: 900,00 € a la entrega del proyecto.",
    filename: "Recibo_CalBenito_FS-2026-0012.pdf",
    href: "/docs/recibos/Recibo_CalBenito_FS-2026-0012.pdf",
    date: "13 Mar 2026",
    category: "Recibo de Pago",
    sizeLabel: "1 página · PDF",
  },
];

function DocCard({ doc, index }: { doc: DocItem; index: number }) {
  return (
    <motion.div
      key={doc.filename}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="group relative bg-[#141619] border border-brushed-steel/10 rounded-lg overflow-hidden hover:border-brushed-steel/25 transition-colors duration-300"
    >
      <div className="h-[2px] bg-gradient-to-r from-molten-copper/60 via-molten-copper/20 to-transparent" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-molten-copper/80 bg-molten-copper/10 px-2 py-0.5 rounded">
            {doc.category}
          </span>
          <span className="text-[10px] text-gray-500">{doc.date}</span>
        </div>
        <h3 className="text-sm font-semibold text-white mb-2 leading-snug">
          {doc.title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          {doc.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-brushed-steel/10">
          <span className="text-[10px] text-gray-500 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {doc.sizeLabel}
          </span>
          <div className="flex items-center gap-2">
            <a href={doc.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-300 bg-brushed-steel/10 hover:bg-brushed-steel/20 rounded transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Ver
            </a>
            <a href={doc.href} download={doc.filename} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white bg-molten-copper/80 hover:bg-molten-copper rounded transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DocumentosPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Documentos
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Propuestas, contratos y recibos del equipo
          </p>
        </div>
      </motion.div>

      {/* ── Propuestas y Contratos ── */}
      <div className="flex items-center gap-2 pt-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Propuestas y Contratos
        </span>
        <div className="flex-1 h-px bg-brushed-steel/10" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DOCUMENTS.map((doc, i) => (
          <DocCard key={doc.filename} doc={doc} index={i} />
        ))}
      </div>

      {/* ── Recibos ── */}
      <div className="flex items-center gap-2 pt-4">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
          Recibos
        </span>
        <div className="flex-1 h-px bg-brushed-steel/10" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {RECIBOS.map((doc, i) => (
          <DocCard key={doc.filename} doc={doc} index={i} />
        ))}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 bg-[#141619] border border-brushed-steel/10 rounded-lg p-4 mt-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-blue-400/60 mt-0.5 shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          Estos documentos son plantillas de referencia del equipo. Para crear
          una nueva propuesta, duplica la plantilla y adapta los datos del
          cliente. Contacta con Dirección si necesitas añadir nuevos documentos.
        </p>
      </div>
    </div>
  );
}
