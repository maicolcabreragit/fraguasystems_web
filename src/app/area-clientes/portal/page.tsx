"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   Client Portal — Main Dashboard
   
   Shows the client's project status, phase progress, deliverables,
   and recent activity from the team.
   ═══════════════════════════════════════════════════════════════════ */

interface Phase {
  phase: string;
  label: string;
  completed: boolean;
  completedAt: string | null;
}

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  current_phase: string;
  phases: Phase[];
  package_type: string;
  total_budget: number;
  paid_amount: number;
  deadline: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  outcome: string;
  user_name: string;
  created_at: string;
}

export default function ClientPortalPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; projectId?: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Get current user session
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        
        if (!meData.user) {
          setError("No autenticado");
          setLoading(false);
          return;
        }
        
        setUser(meData.user);
        
        // If user has a projectId, fetch that project
        if (meData.user.projectId) {
          const projRes = await fetch(`/api/client/project?projectId=${meData.user.projectId}`);
          const projData = await projRes.json();
          if (projData.project) {
            setProject(projData.project);
            setActivities(projData.activities || []);
          }
        }
      } catch {
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-6 h-6 border-2 border-molten-copper/30 border-t-molten-copper rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-machine-gray/60">{error}</p>
      </div>
    );
  }

  // If no project assigned, show welcome message
  if (!project) {
    return <WelcomeState userName={user?.name || "Cliente"} />;
  }

  // Calculate progress
  const completedPhases = project.phases.filter((p) => p.completed).length;
  const totalPhases = project.phases.length;
  const progressPercent = Math.round((completedPhases / totalPhases) * 100);
  const paidPercent = project.total_budget > 0 ? Math.round((project.paid_amount / project.total_budget) * 100) : 0;

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active: { label: "En curso", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    paused: { label: "Pausado", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    completed: { label: "Completado", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    cancelled: { label: "Cancelado", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  };

  const PHASE_ICONS: Record<string, string> = {
    discovery: "🔍",
    design: "🎨",
    development: "⚙️",
    testing: "🧪",
    deployment: "🚀",
    maintenance: "🛠️",
  };

  const ACTIVITY_ICONS: Record<string, string> = {
    call: "📞",
    email: "✉️",
    meeting: "🗓️",
    note: "📝",
    proposal: "📋",
    close: "🤝",
  };

  const statusInfo = STATUS_LABELS[project.status] || STATUS_LABELS.active;

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-bold text-titanium-white tracking-tight">
            {project.name}
          </h1>
          <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wider ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded border border-molten-copper/20 text-molten-copper/80 font-medium uppercase tracking-wider">
            {project.package_type}
          </span>
        </div>
        <p className="text-xs text-machine-gray/50">
          {project.description}
        </p>
      </motion.div>

      {/* KPI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Progress */}
        <div className="bg-[#141619] border border-brushed-steel/10 p-5 rounded-lg">
          <p className="text-[10px] text-machine-gray/50 uppercase tracking-wider mb-3">Progreso general</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-bold text-titanium-white">{progressPercent}%</span>
            <span className="text-xs text-machine-gray/40 pb-0.5">{completedPhases}/{totalPhases} fases</span>
          </div>
          <div className="w-full h-1.5 bg-brushed-steel/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-molten-copper rounded-full"
            />
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-[#141619] border border-brushed-steel/10 p-5 rounded-lg">
          <p className="text-[10px] text-machine-gray/50 uppercase tracking-wider mb-3">Fase actual</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{PHASE_ICONS[project.current_phase] || "📦"}</span>
            <span className="text-lg font-semibold text-titanium-white capitalize">{project.current_phase}</span>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-[#141619] border border-brushed-steel/10 p-5 rounded-lg">
          <p className="text-[10px] text-machine-gray/50 uppercase tracking-wider mb-3">Inversión</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-bold text-industrial-gold">
              €{project.paid_amount.toLocaleString("es-ES")}
            </span>
            <span className="text-xs text-machine-gray/40 pb-0.5">
              / €{project.total_budget.toLocaleString("es-ES")}
            </span>
          </div>
          <div className="w-full h-1.5 bg-brushed-steel/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${paidPercent}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-industrial-gold rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Phase Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#141619] border border-brushed-steel/10 p-6 rounded-lg"
      >
        <h2 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider mb-5">
          Hoja de ruta del proyecto
        </h2>
        
        <div className="space-y-0">
          {project.phases.map((phase, i) => {
            const isCurrent = phase.phase === project.current_phase;
            const isCompleted = phase.completed;
            
            return (
              <div key={phase.phase} className="flex items-start gap-4">
                {/* Timeline dot & line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all ${
                      isCompleted
                        ? "bg-molten-copper/20 border-molten-copper text-molten-copper"
                        : isCurrent
                        ? "bg-industrial-gold/20 border-industrial-gold text-industrial-gold animate-pulse"
                        : "bg-[#0e0f12] border-brushed-steel/20 text-machine-gray/30"
                    }`}
                  >
                    {isCompleted ? "✓" : PHASE_ICONS[phase.phase] || "·"}
                  </div>
                  {i < project.phases.length - 1 && (
                    <div
                      className={`w-px h-8 ${
                        isCompleted ? "bg-molten-copper/30" : "bg-brushed-steel/10"
                      }`}
                    />
                  )}
                </div>

                {/* Phase details */}
                <div className="pb-6 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        isCompleted
                          ? "text-titanium-white"
                          : isCurrent
                          ? "text-industrial-gold"
                          : "text-machine-gray/40"
                      }`}
                    >
                      {phase.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-industrial-gold/10 text-industrial-gold border border-industrial-gold/20 rounded uppercase tracking-wider">
                        actual
                      </span>
                    )}
                  </div>
                  {phase.completedAt && (
                    <p className="text-[10px] text-machine-gray/40 mt-0.5">
                      Completado: {new Date(phase.completedAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141619] border border-brushed-steel/10 p-6 rounded-lg"
        >
          <h2 className="text-[11px] font-medium text-machine-gray/50 uppercase tracking-wider mb-5">
            Actividad reciente del equipo
          </h2>

          <div className="space-y-4">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{ACTIVITY_ICONS[activity.type] || "📝"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-titanium-white">{activity.title}</span>
                    <span className="text-[10px] text-machine-gray/40">
                      {new Date(activity.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-xs text-machine-gray/50 mt-0.5">{activity.description}</p>
                  )}
                  {activity.outcome && (
                    <p className="text-xs text-molten-copper/60 mt-0.5 italic">→ {activity.outcome}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center py-3"
      >
        <p className="text-xs text-machine-gray/40">
          ¿Tienes alguna duda? Contacta con tu gestor de proyecto en{" "}
          <a href="mailto:maicolcabreraferreira@gmail.com" className="text-molten-copper hover:underline">
            maicolcabreraferreira@gmail.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Welcome State (No Project Assigned) ──────────────────────── */

function WelcomeState({ userName }: { userName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20 space-y-4"
    >
      <div className="w-16 h-16 mx-auto bg-molten-copper/10 border border-molten-copper/20 rounded-2xl flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-molten-copper">
          <path d="M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2m-6 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-titanium-white">
        Bienvenido, {userName}
      </h1>
      <p className="text-sm text-machine-gray/50 max-w-md mx-auto leading-relaxed">
        Tu portal de seguimiento de proyectos está listo. Una vez que tu proyecto 
        sea asignado, aquí verás el estado en tiempo real, las fases completadas 
        y la actividad de nuestro equipo.
      </p>
      <p className="text-xs text-machine-gray/30 mt-8">
        Si ya tienes un proyecto en marcha, contacta con{" "}
        <a href="mailto:maicolcabreraferreira@gmail.com" className="text-molten-copper hover:underline">
          tu gestor
        </a>{" "}
        para vincular tu cuenta.
      </p>
    </motion.div>
  );
}
