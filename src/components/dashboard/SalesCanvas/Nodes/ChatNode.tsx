"use client";

import { memo, useCallback, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useConnectedLead } from "../useConnectedLead";

/* ═══════════════════════════════════════════════════════════════════
   ChatNode — Contextual AI Chat
   
   ChatGPT-style interface within a node. Reads context from the
   connected LeadNode. Mocked responses for now.
   ═══════════════════════════════════════════════════════════════════ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function ChatNodeComponent({ id }: NodeProps) {
  const lead = useConnectedLead(id);
  const cardRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(() => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const ctx = lead ? `[Contexto: ${lead.businessName}, ${lead.businessType}, Tier ${lead.tier}, €${lead.estimatedTicket.toLocaleString("es-ES")}]` : "";
      const responses = [
        `${ctx}\n\nBasándome en los datos del cliente, te recomiendo enfocar la propuesta en la digitalización de su canal directo. Un motor de reservas propio podría reducir la dependencia de OTAs en un 30%.`,
        `${ctx}\n\nPara este tipo de negocio, la estrategia más efectiva es demostrar ROI en los primeros 90 días. Sugiero empezar con un PMS básico y escalar progresivamente.`,
        `${ctx}\n\nHe analizado el perfil y detecto tres oportunidades inmediatas: (1) check-in digital, (2) automatización de comunicaciones pre-estancia, (3) revenue management básico.`,
      ];
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 1500);
  }, [input, loading, lead]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }, [sendMessage]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
    cardRef.current.style.setProperty("--mi", "0.1");
  }, []);

  const handleMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--mi", "0");
  }, []);

  return (
    <div ref={cardRef} className="canvas-node-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ width: 300 }}>
      {/* Blue accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }} />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <span className="text-base">💬</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-[12px] font-bold text-white leading-tight">Chat Contextual</h3>
            <p className="text-[9px] text-blue-400/70 font-medium uppercase tracking-wide">Gemini 3.1 Pro</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-md"
          style={{ background: lead ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${lead ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.08)"}` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: lead ? "#34d399" : "#888" }} />
          <span className="text-[9px] font-medium" style={{ color: lead ? "#34d399" : "#888" }}>
            {lead ? `Contexto: ${lead.businessName}` : "Sin contexto de Lead"}
          </span>
        </div>

        {/* Chat Messages */}
        <div className="nowheel nodrag bg-[#0a0a0a] rounded-lg border border-[#1e2028] mb-2 overflow-hidden">
          <div className="max-h-[180px] overflow-y-auto custom-scrollbar p-2 space-y-2">
            {messages.length === 0 && (
              <p className="text-[10px] text-gray-600 text-center py-4">
                {lead ? `Pregunta sobre ${lead.businessName}...` : "Conecta un Lead para dar contexto"}
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-[10px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-500/15 border border-blue-500/20 text-blue-100"
                    : "bg-[#141619] border border-[#2a2d35] text-gray-300"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#141619] border border-[#2a2d35] rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="nowheel nodrag flex-1 text-[11px] px-2.5 py-1.5 rounded-md bg-[#0a0a0a] border border-[#2a2d35] text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/30 transition-all"
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}
            className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all disabled:opacity-30"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#3b82f6" }}>
            ↑
          </button>
        </div>
      </div>

      <Handle type="target" position={Position.Bottom} className="handle-target" id="chat-in" style={{ left: 12, bottom: 12, right: "auto" }} />
    </div>
  );
}

export const ChatNode = memo(ChatNodeComponent);
