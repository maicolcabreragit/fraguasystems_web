"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  SelectionMode,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  BackgroundVariant,
  ConnectionLineType,
} from "@xyflow/react";

/* ─── Custom Nodes & Edges ──────────────────────────────────────── */
import { LeadNode } from "./Nodes/LeadNode";
import { AINode } from "./Nodes/AINode";
import { APINode } from "./Nodes/APINode";
import { EmailGeneratorNode } from "./Nodes/EmailGeneratorNode";
import { BusinessAuditNode } from "./Nodes/BusinessAuditNode";
import { GooglePlacesNode } from "./Nodes/GooglePlacesNode";
import { ChatNode } from "./Nodes/ChatNode";
import { AnimatedEdge } from "./edges/AnimatedEdge";
import type { Lead } from "@/lib/data";

/* ─── Canvas Styles (overrides React Flow defaults) ─────────────── */
import "./canvas.css";

/* ═══════════════════════════════════════════════════════════════════
   CanvasBoard — Sales Intelligence Canvas (UX Enhanced)
   
   Phase 1.5: Tool modes, hotkeys, context menu, performance opts.
   Interaction model inspired by Figma/Miro.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Types ────────────────────────────────────────────────────── */
type ToolMode = "select" | "pan";

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  canvasX: number;
  canvasY: number;
}

/* ─── Node & Edge Type Registries (stable ref — outside component) */
const nodeTypes: NodeTypes = {
  leadNode: LeadNode,
  aiNode: AINode,
  apiNode: APINode,
  emailGeneratorNode: EmailGeneratorNode,
  businessAuditNode: BusinessAuditNode,
  googlePlacesNode: GooglePlacesNode,
  chatNode: ChatNode,
};

type ActionNodeType = "aiNode" | "apiNode" | "emailGeneratorNode" | "businessAuditNode" | "googlePlacesNode" | "chatNode";

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

/* ═══════════════════════════════════════════════════════════════════
   Main Canvas (wrapped by ReactFlowProvider below)
   ═══════════════════════════════════════════════════════════════════ */
function CanvasInner({ leadId }: { leadId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [loadingLead, setLoadingLead] = useState(true);

  /* ─── Fetch lead + create initial central node ─────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/dashboard/leads/${leadId}`);
        const data = await res.json();
        if (data.lead) {
          const lead: Lead = data.lead;
          setActiveLead(lead);
          setNodes([
            {
              id: `lead-${lead.id}`,
              type: "leadNode",
              position: { x: 100, y: 200 },
              data: {
                leadId: lead.id,
                businessName: lead.businessName,
                tier: lead.tier,
                estimatedTicket: lead.estimatedTicket,
                contactName: lead.contactName,
                businessType: lead.businessType,
                status: lead.status,
              },
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching lead:", err);
      } finally {
        setLoadingLead(false);
      }
    })();
  }, [leadId, setNodes]);
  const { screenToFlowPosition } = useReactFlow();

  /* ─── Tool Mode State ──────────────────────────────────────────── */
  const [toolMode, setToolMode] = useState<ToolMode>("select");
  const [spaceHeld, setSpaceHeld] = useState(false);
  const lockedMode = useRef<ToolMode>("select");

  /* ─── Context Menu State ───────────────────────────────────────── */
  const [ctxMenu, setCtxMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    canvasX: 0,
    canvasY: 0,
  });

  /* (Lead Modal removed — workspace is per-client) */

  /* Effective mode: spacebar overrides locked mode temporarily */
  const effectiveMode = spaceHeld ? "pan" : lockedMode.current;

  /* ─── Keyboard Shortcuts ────────────────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      /* Ignore when typing in inputs */
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setSpaceHeld(true);
        setToolMode("pan");
      }
      if (e.key === "v" || e.key === "V") {
        lockedMode.current = "select";
        setToolMode("select");
      }
      if (e.key === "b" || e.key === "B") {
        lockedMode.current = "pan";
        setToolMode("pan");
      }
      /* Escape closes context menu */
      if (e.key === "Escape") {
        setCtxMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpaceHeld(false);
        setToolMode(lockedMode.current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  /* ─── Connection Handler ────────────────────────────────────────── */
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: "animated" }, eds));
    },
    [setEdges]
  );

  /* ─── Context Menu Handlers ─────────────────────────────────────── */
  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      event.preventDefault();
      const flowPos = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setCtxMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        canvasX: flowPos.x,
        canvasY: flowPos.y,
      });
    },
    [screenToFlowPosition]
  );

  const closeCtxMenu = useCallback(() => {
    setCtxMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  const onPaneClick = useCallback(() => {
    closeCtxMenu();
  }, [closeCtxMenu]);

  /* (Lead creation & sync removed — workspace is per-client) */

  /* ─── Node Factory (All Action Nodes) ────────────────────────────── */
  const addNode = useCallback(
    (type: ActionNodeType, position?: { x: number; y: number }) => {
      const pos = position || {
        x: 400 + Math.random() * 200,
        y: 200 + Math.random() * 200,
      };

      const dataMap: Record<string, Record<string, unknown>> = {
        aiNode: { label: "Gemini 3.1 Pro", model: "Reasoning", mode: "strategy" },
        apiNode: { label: "Google Places", api: "places", endpoint: "/api/gcloud/places" },
        emailGeneratorNode: {},
        businessAuditNode: {},
        googlePlacesNode: {},
        chatNode: {},
      };

      const newNode: Node = {
        id: `${type.replace("Node", "")}-${Date.now()}`,
        type,
        position: pos,
        data: dataMap[type] || {},
      };
      setNodes((nds) => [...nds, newNode]);
      closeCtxMenu();
    },
    [setNodes, closeCtxMenu]
  );

  /* ─── Align Nodes (simple grid snap) ────────────────────────────── */
  const alignNodes = useCallback(() => {
    setNodes((nds) => {
      const GRID = 40;
      return nds.map((n) => ({
        ...n,
        position: {
          x: Math.round(n.position.x / GRID) * GRID,
          y: Math.round(n.position.y / GRID) * GRID,
        },
      }));
    });
    closeCtxMenu();
  }, [setNodes, closeCtxMenu]);

  /* ─── MiniMap color mapper ──────────────────────────────────────── */
  const nodeColor = useCallback((node: Node) => {
    switch (node.type) {
      case "leadNode": return "#c86a3d";
      case "aiNode": return "#d4af37";
      case "apiNode": return "#8a9197";
      case "emailGeneratorNode": return "#d4af37";
      case "businessAuditNode": return "#a855f7";
      case "googlePlacesNode": return "#14b8a6";
      case "chatNode": return "#3b82f6";
      default: return "#2e3542";
    }
  }, []);

  /* ─── Cursor class based on tool mode ──────────────────────────── */
  const cursorClass =
    effectiveMode === "pan"
      ? spaceHeld
        ? "canvas-cursor-grabbing"
        : "canvas-cursor-grab"
      : "";

  if (loadingLead) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="w-6 h-6 border-2 border-molten-copper/30 border-t-molten-copper rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`w-full h-screen relative ${cursorClass}`}
      style={{ background: "#0a0a0a" }}
    >
      {/* ─── Workspace Header ─────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-2.5 bg-[#111316]/80 backdrop-blur-xl border-b border-[#1e2028]/60"
      >
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/leads"
            className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-0.5 transition-transform">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Pipeline
          </Link>
          <div className="w-px h-5 bg-[#2a2d35]" />
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              {activeLead?.businessName || "Workspace"}
            </h1>
            <p className="text-[10px] text-gray-500">
              {nodes.length} nodos · {edges.length} conexiones
            </p>
          </div>
        </div>

        {/* Node Creation Toolbar (top-right — no Lead button) */}
        <div className="flex items-center gap-2">
          <NodeToolbarButton label="AI" icon="🧠" onClick={() => addNode("aiNode")} />
          <NodeToolbarButton label="API" icon="⚡" onClick={() => addNode("apiNode")} />
        </div>
      </div>

      {/* ─── React Flow Canvas ──────────────────────────────────── */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{
          stroke: "#c86a3d",
          strokeWidth: 2,
          strokeDasharray: "6 6",
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={3}
        defaultEdgeOptions={{ type: "animated" }}
        proOptions={{ hideAttribution: true }}
        /* ─── Tool Mode Integration ─────────────────────────────── */
        panOnDrag={effectiveMode === "pan" ? true : [1]}
        panOnScroll={effectiveMode === "pan"}
        selectionOnDrag={effectiveMode === "select"}
        selectionMode={SelectionMode.Partial}
        selectNodesOnDrag={effectiveMode === "select"}
        /* ─── Context Menu ──────────────────────────────────────── */
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#2e3542"
          gap={24}
          size={1}
        />
        <Controls showInteractive={false} position="bottom-left" />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={2}
          position="bottom-right"
          style={{ width: 160, height: 100 }}
          maskColor="rgba(10, 10, 10, 0.85)"
        />
      </ReactFlow>

      {/* ─── Bottom Tool Mode Bar ───────────────────────────────── */}
      <ToolModeBar
        activeMode={effectiveMode}
        onModeChange={(mode) => {
          lockedMode.current = mode;
          setToolMode(mode);
        }}
      />

      {/* ─── Context Menu ───────────────────────────────────────── */}
      {ctxMenu.visible && (
        <CanvasContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          onAdd={(type: ActionNodeType) => addNode(type, { x: ctxMenu.canvasX, y: ctxMenu.canvasY })}
          onAlign={alignNodes}
          onClose={closeCtxMenu}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Exported wrapper with ReactFlowProvider
   ═══════════════════════════════════════════════════════════════════ */
export function CanvasBoard({ leadId }: { leadId: string }) {
  return (
    <ReactFlowProvider>
      <CanvasInner leadId={leadId} />
    </ReactFlowProvider>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   UI Sub-Components
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Node Creation Button (top toolbar) ──────────────────────── */
function NodeToolbarButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium
        rounded-lg border transition-all duration-150
        bg-[#141619]/80 border-[#2a2d35] text-gray-300
        hover:border-molten-copper/40 hover:text-white hover:bg-[#1a1d22]
        active:scale-[0.97]
      "
    >
      <span className="text-sm">{icon}</span>
      {label}
    </button>
  );
}

/* ─── Tool Mode Floating Bar (bottom center) ──────────────────── */
function ToolModeBar({
  activeMode,
  onModeChange,
}: {
  activeMode: ToolMode;
  onModeChange: (mode: ToolMode) => void;
}) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 tool-mode-bar">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#141619]/90 backdrop-blur-xl border border-[#2a2d35]/80 shadow-2xl shadow-black/40">
        {/* Selection Mode */}
        <button
          onClick={() => onModeChange("select")}
          className={`
            tool-mode-btn
            ${activeMode === "select" ? "tool-mode-btn-active" : ""}
          `}
          title="Selection Mode (V)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            <path d="M13 13l6 6" />
          </svg>
          <span className="text-[10px]">V</span>
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-[#2a2d35]" />

        {/* Pan Mode */}
        <button
          onClick={() => onModeChange("pan")}
          className={`
            tool-mode-btn
            ${activeMode === "pan" ? "tool-mode-btn-active" : ""}
          `}
          title="Hand Tool (B) / Hold Space"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 13" />
          </svg>
          <span className="text-[10px]">B</span>
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-[#2a2d35]" />

        {/* Hint */}
        <div className="px-2 flex items-center gap-1.5">
          <span className="text-[9px] text-gray-500 whitespace-nowrap">
            Hold
          </span>
          <kbd className="kbd-key">Space</kbd>
          <span className="text-[9px] text-gray-500 whitespace-nowrap">
            to pan
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Context Menu (Categorized Catalogue) ───────────────────── */
function CanvasContextMenu({
  x,
  y,
  onAdd,
  onAlign,
  onClose,
}: {
  x: number;
  y: number;
  onAdd: (type: ActionNodeType) => void;
  onAlign: () => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const menuStyle: React.CSSProperties = { position: "fixed", left: x, top: y, zIndex: 50 };

  return (
    <div ref={menuRef} style={menuStyle} className="ctx-menu">
      {/* IA Category */}
      <div className="ctx-menu-section">
        <span className="ctx-menu-label">🤖 IA (Gemini 3.1 Pro)</span>
        <CtxMenuItem icon="✉️" label="Generador de Emails" shortcut="" onClick={() => onAdd("emailGeneratorNode")} />
        <CtxMenuItem icon="🔍" label="Auditor de Negocio" shortcut="" onClick={() => onAdd("businessAuditNode")} />
        <CtxMenuItem icon="🧠" label="Nodo Gemini (Legacy)" shortcut="" onClick={() => onAdd("aiNode")} />
      </div>
      <div className="ctx-menu-divider" />
      {/* APIs Category */}
      <div className="ctx-menu-section">
        <span className="ctx-menu-label">🌐 APIs (Data)</span>
        <CtxMenuItem icon="📍" label="Google Places" shortcut="" onClick={() => onAdd("googlePlacesNode")} />
        <CtxMenuItem icon="⚡" label="PageSpeed Insights" shortcut="" onClick={() => onAdd("apiNode")} />
      </div>
      <div className="ctx-menu-divider" />
      {/* Utilities Category */}
      <div className="ctx-menu-section">
        <span className="ctx-menu-label">🛠️ Utilidades</span>
        <CtxMenuItem icon="💬" label="Chat Contextual" shortcut="" onClick={() => onAdd("chatNode")} />
      </div>
      <div className="ctx-menu-divider" />
      <div className="ctx-menu-section">
        <CtxMenuItem icon="⊞" label="Alinear Nodos" shortcut="" onClick={onAlign} />
      </div>
    </div>
  );
}

function CtxMenuItem({
  icon,
  label,
  shortcut,
  onClick,
}: {
  icon: string;
  label: string;
  shortcut: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="ctx-menu-item">
      <span className="text-sm w-5 text-center shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {shortcut && (
        <span className="text-[10px] text-gray-600 ml-4 font-mono">
          {shortcut}
        </span>
      )}
    </button>
  );
}
