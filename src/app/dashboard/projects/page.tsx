"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";

/* ═══════════════════════════════════════════════════════════════════
   Projects Page — Active project management
   ═══════════════════════════════════════════════════════════════════ */

const PHASE_LABELS: Record<string, string> = {
  discovery: "🔍 Discovery",
  design: "🎨 Diseño",
  development: "⚙️ Desarrollo",
  testing: "🧪 Testing",
  deployment: "🚀 Despliegue",
  maintenance: "🔧 Mantenimiento",
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
  paused: { bg: "bg-amber-500/10", text: "text-amber-400" },
  completed: { bg: "bg-blue-500/10", text: "text-blue-400" },
  cancelled: { bg: "bg-red-500/10", text: "text-red-400" },
};

const PACKAGE_LABELS: Record<string, { label: string; color: string }> = {
  starter: { label: "Starter", color: "text-blue-400" },
  professional: { label: "Professional", color: "text-molten-copper" },
  enterprise: { label: "Enterprise", color: "text-industrial-gold" },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    clientName: "",
    description: "",
    packageType: "starter" as "starter" | "professional" | "enterprise",
    totalBudget: 0,
    deadline: "",
  });

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateProject = async () => {
    const phases = [
      { phase: "discovery" as const, label: "Discovery", completed: false, completedAt: null },
      { phase: "design" as const, label: "Diseño", completed: false, completedAt: null },
      { phase: "development" as const, label: "Desarrollo", completed: false, completedAt: null },
      { phase: "testing" as const, label: "Testing", completed: false, completedAt: null },
      { phase: "deployment" as const, label: "Despliegue", completed: false, completedAt: null },
      { phase: "maintenance" as const, label: "Mantenimiento", completed: false, completedAt: null },
    ];

    await fetch("/api/dashboard/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProject,
        status: "active",
        currentPhase: "discovery",
        phases,
        paidAmount: 0,
        leadId: null,
      }),
    });

    const res = await fetch("/api/dashboard/projects");
    const data = await res.json();
    setProjects(data.projects || []);
    setShowNewForm(false);
    setNewProject({ name: "", clientName: "", description: "", packageType: "starter", totalBudget: 0, deadline: "" });
  };

  const inputClass = `
    w-full px-3 py-2.5 text-sm bg-[#0f1013] border border-brushed-steel/15
    text-titanium-white placeholder:text-machine-gray/30
    focus:outline-none focus:border-molten-copper/40 transition-all
  `;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-6 h-6 border-2 border-molten-copper/30 border-t-molten-copper rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold text-titanium-white tracking-tight">
            Proyectos
          </h1>
          <p className="text-xs text-machine-gray/50 mt-0.5">
            {projects.length} proyectos registrados
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-molten-copper text-white hover:bg-molten-copper/90 active:scale-[0.98] transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo Proyecto
        </button>
      </motion.div>

      {/* New project form */}
      {showNewForm && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-[#141619] border border-brushed-steel/10 p-5 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-machine-gray/60 uppercase tracking-wider mb-1">Nombre proyecto</label>
              <input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="Web Hotel Example" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-machine-gray/60 uppercase tracking-wider mb-1">Cliente</label>
              <input value={newProject.clientName} onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })} placeholder="Hotel La Garbinada" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-machine-gray/60 uppercase tracking-wider mb-1">Paquete</label>
              <select value={newProject.packageType} onChange={(e) => setNewProject({ ...newProject, packageType: e.target.value as "starter" | "professional" | "enterprise" })} className={inputClass}>
                <option value="starter">Starter (€1.5-3K)</option>
                <option value="professional">Professional (€3-8K)</option>
                <option value="enterprise">Enterprise (€8-20K+)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-machine-gray/60 uppercase tracking-wider mb-1">Presupuesto (€)</label>
              <input type="number" value={newProject.totalBudget || ""} onChange={(e) => setNewProject({ ...newProject, totalBudget: Number(e.target.value) })} placeholder="5000" className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-machine-gray/60 uppercase tracking-wider mb-1">Deadline</label>
              <input type="date" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setShowNewForm(false)} className="px-4 py-2 text-sm border border-brushed-steel/15 text-machine-gray hover:text-titanium-white transition-all">Cancelar</button>
            <button onClick={handleCreateProject} className="px-4 py-2 text-sm font-medium bg-molten-copper text-white hover:bg-molten-copper/90 transition-all">Crear proyecto</button>
          </div>
        </motion.div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="bg-[#141619] border border-brushed-steel/10 p-12 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 text-machine-gray/20">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            <p className="text-sm text-machine-gray/40">No hay proyectos todavía</p>
            <p className="text-xs text-machine-gray/25 mt-1">Crea tu primer proyecto para empezar a trackear entregas</p>
          </div>
        ) : (
          projects.map((project, i) => {
            const completedPhases = project.phases.filter((p) => p.completed).length;
            const progress = Math.round((completedPhases / project.phases.length) * 100);
            const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES.active;
            const pkgStyle = PACKAGE_LABELS[project.packageType] || PACKAGE_LABELS.starter;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#141619] border border-brushed-steel/10 p-5 hover:border-brushed-steel/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-titanium-white">{project.name}</h3>
                    <p className="text-xs text-machine-gray/50 mt-0.5">{project.clientName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text}`}>
                      {project.status.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-medium ${pkgStyle.color}`}>
                      {pkgStyle.label}
                    </span>
                  </div>
                </div>

                {/* Phase Progress */}
                <div className="flex items-center gap-1.5 mb-3">
                  {project.phases.map((phase) => (
                    <div
                      key={phase.phase}
                      className={`flex-1 h-1.5 ${
                        phase.completed
                          ? "bg-molten-copper/60"
                          : phase.phase === project.currentPhase
                            ? "bg-molten-copper/25 animate-pulse"
                            : "bg-brushed-steel/15"
                      }`}
                      title={PHASE_LABELS[phase.phase]}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-machine-gray/50">
                    {PHASE_LABELS[project.currentPhase]} — {progress}% completado
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-industrial-gold/70">
                      €{project.paidAmount.toLocaleString("es-ES")} / €{project.totalBudget.toLocaleString("es-ES")}
                    </span>
                    {project.deadline && (
                      <span className="text-machine-gray/40">
                        📅 {new Date(project.deadline).toLocaleDateString("es-ES")}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
