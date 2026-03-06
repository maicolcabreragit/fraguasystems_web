"use client";

import { motion } from "framer-motion";
import type { Activity } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   Activity Timeline — Vertical timeline of CRM activities
   ═══════════════════════════════════════════════════════════════════ */

const ACTIVITY_ICONS: Record<string, { icon: string; color: string }> = {
  call: { icon: "📞", color: "bg-blue-500/15 border-blue-500/30" },
  email: { icon: "✉️", color: "bg-purple-500/15 border-purple-500/30" },
  meeting: { icon: "🗓️", color: "bg-emerald-500/15 border-emerald-500/30" },
  note: { icon: "📝", color: "bg-machine-gray/15 border-machine-gray/30" },
  proposal: { icon: "📋", color: "bg-amber-500/15 border-amber-500/30" },
  close: { icon: "🤝", color: "bg-industrial-gold/15 border-industrial-gold/30" },
};

const TYPE_LABELS: Record<string, string> = {
  call: "Llamada",
  email: "Email",
  meeting: "Reunión",
  note: "Nota",
  proposal: "Propuesta",
  close: "Cierre",
};

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-machine-gray/40">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-3 opacity-50">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <p className="text-xs">Sin actividad registrada</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-0">
      {/* Timeline line */}
      <div className="absolute left-[17px] top-2 bottom-2 w-px bg-brushed-steel/10" />

      {activities.map((activity, i) => {
        const style = ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.note;
        const date = new Date(activity.createdAt);
        const timeStr = date.toLocaleString("es-ES", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative flex gap-3 py-3 pl-0"
          >
            {/* Icon */}
            <div
              className={`
                relative z-10 w-[34px] h-[34px] flex items-center justify-center
                border text-sm shrink-0 ${style.color}
              `}
            >
              {style.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-xs font-medium text-titanium-white/90">
                  {activity.title || TYPE_LABELS[activity.type]}
                </span>
                <span className="text-[10px] text-machine-gray/40">
                  {timeStr}
                </span>
              </div>
              {activity.description && (
                <p className="text-xs text-machine-gray/60 leading-relaxed">
                  {activity.description}
                </p>
              )}
              {activity.outcome && (
                <p className="text-[11px] text-molten-copper/70 mt-1">
                  → {activity.outcome}
                </p>
              )}
              <p className="text-[10px] text-machine-gray/30 mt-1">
                {activity.userName}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
