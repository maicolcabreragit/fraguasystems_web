"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   ChatWidget — Floating AI assistant (Gemini 2.5 Pro)
   
   Fixed bottom-right bubble → opens chat panel with streaming
   Industrial Luxe design, matches Fragua Systems branding
   ═══════════════════════════════════════════════════════════════════ */

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "¡Bienvenido! Soy del equipo de Fragua Systems. ¿En qué puedo ayudarle con su proyecto HORECA?",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setShowPulse(false);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    // Add empty assistant message for streaming
    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages([...updatedMessages, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: "Disculpe, ha ocurrido un error. Puede contactarnos directamente al +34 614 916 049." };
          return copy;
        });
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages((prev) => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { role: "assistant", content: fullText };
                    return copy;
                  });
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: "Error de conexión. Inténtelo de nuevo o llámenos al +34 614 916 049." };
        return copy;
      });
    }

    setIsStreaming(false);
  }, [input, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ─── Chat Panel ───────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] shadow-2xl"
            style={{ maxHeight: "calc(100vh - 140px)" }}
          >
            {/* Header */}
            <div className="bg-[#0e0f12] px-5 py-4 flex items-center justify-between rounded-t-lg border-b-2 border-[#c86a3d]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 bg-[#1a1b1f] rounded-full flex items-center justify-center border border-[#c86a3d]/30">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#c86a3d]">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0e0f12]" />
                </div>
                <div>
                  <p className="text-[#f0ece6] text-sm font-semibold">Fragua Systems</p>
                  <p className="text-emerald-400 text-[10px] font-medium tracking-wide">● Online ahora</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#6b6b6b] hover:text-[#f0ece6] transition-colors p-1"
                aria-label="Cerrar chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              className="bg-[#f8f7f5] overflow-y-auto p-4 space-y-3"
              style={{ height: "380px" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-[13.5px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#0e0f12] text-[#f0ece6] rounded-2xl rounded-br-md"
                        : "bg-white text-[#2d2d2d] rounded-2xl rounded-bl-md border border-[#eae8e3] shadow-sm"
                    }`}
                  >
                    {msg.content}
                    {isStreaming && i === messages.length - 1 && msg.role === "assistant" && (
                      <span className="inline-block w-1.5 h-4 bg-[#c86a3d] ml-0.5 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-[#eae8e3] px-4 py-3 rounded-b-lg">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escriba su mensaje..."
                  disabled={isStreaming}
                  className="flex-1 text-sm text-[#1a1b1f] placeholder:text-[#bbb] bg-transparent outline-none disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isStreaming}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
                    input.trim() && !isStreaming
                      ? "bg-[#c86a3d] text-white hover:bg-[#a85530] active:scale-95"
                      : "bg-[#eae8e3] text-[#bbb] cursor-default"
                  }`}
                  aria-label="Enviar mensaje"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
              <p className="text-[9px] text-[#ccc] mt-2 text-center">
                Fragua Systems · Respuesta asistida por IA
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating Bubble ──────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0e0f12] text-[#c86a3d] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow group border border-[#c86a3d]/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Notification pulse */}
        {showPulse && !isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3">
            <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
            <span className="absolute inset-0 bg-emerald-400 rounded-full" />
          </span>
        )}
      </motion.button>
    </>
  );
}
