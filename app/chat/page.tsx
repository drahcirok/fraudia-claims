"use client";

import { useState } from "react";
import { MessageSquare, Bot, Send, Sparkles, ShieldAlert, TrendingUp, FileSearch, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_ACTIONS = [
  { label: "Top 10 riesgos", icon: TrendingUp },
  { label: "Alertas por proveedor", icon: BuildingIcon },
  { label: "Patrones sospechosos", icon: FileSearch },
  { label: "Explica mi score", icon: Sparkles },
  { label: "Siniestros borde vigencia", icon: ShieldAlert },
  { label: "Docs incompletos", icon: AlertTriangle },
];

function BuildingIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21V3h14v18" />
      <path d="M7 7h2v2H7z" />
      <path d="M11 7h2v2h-2z" />
      <path d="M7 13h2v2H7z" />
      <path d="M11 13h2v2h-2z" />
      <path d="M21 21H3" />
      <path d="M17 7h4v14h-4z" />
    </svg>
  );
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const hasMessages = messages.length > 0;

  // --- FUNCIÓN PARA FORMATEAR MARKDOWN ---
  const formatTexto = (texto: string) => {
    return texto.split('\n').map((linea, index) => {
      // Ignorar líneas completamente vacías para no hacer saltos dobles excesivos
      if (!linea.trim()) return <div key={index} className="h-2"></div>;

      let isList = false;
      let isHeader = false;
      let processedLine = linea;

      // Detectar y limpiar símbolos de listas y títulos
      if (processedLine.trim().startsWith('- ')) {
        isList = true;
        processedLine = processedLine.trim().substring(2);
      } else if (processedLine.trim().startsWith('### ')) {
        isHeader = true;
        processedLine = processedLine.trim().substring(4);
      }

      // Procesar negritas
      const partes = processedLine.split(/(\*\*.*?\*\*)/g);
      const lineaFormateada = partes.map((parte, i) => {
        if (parte.startsWith('**') && parte.endsWith('**')) {
          return <strong key={i} className="text-white font-bold">{parte.slice(2, -2)}</strong>;
        }
        return parte;
      });

      // Renderizar el bloque HTML correspondiente
      if (isList) {
        return (
          <li key={index} className="ml-5 mb-1 list-disc text-foreground/90">
            {lineaFormateada}
          </li>
        );
      } else if (isHeader) {
        return (
          <h3 key={index} className="font-bold text-lg mt-4 mb-2 text-white">
            {lineaFormateada}
          </h3>
        );
      }
      
      // Texto normal
      return <p key={index} className="mb-2 leading-relaxed">{lineaFormateada}</p>;
    });
  };

  // Llama al backend de FastAPI
  const askAI = async (messageText: string) => {
    setIsStreaming(true);
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.response || "No se pudo obtener respuesta." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Error de conexión con el servidor (FastAPI)." },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  async function handleSend() {
    if (!input.trim() || isStreaming) return;
    const textToSend = input;
    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setInput("");
    await askAI(textToSend);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="shrink-0 border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/30">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Agente FraudIA</h1>
            <p className="text-xs text-muted-foreground">
              Asistente de análisis de siniestros · Google Gemini / OpenAI
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08]">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">¿En qué puedo ayudarte?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pregunta sobre siniestros, scores de riesgo, patrones sospechosos o proveedores. El agente analiza los datos de Supabase y te responde.
            </p>

            {/* Quick action chips */}
            <div className="mt-8 w-full">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider font-medium mb-3">
                Acciones rápidas
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => {
                      setMessages([{ role: "user", content: action.label }]);
                      askAI(action.label); // Llama a la IA directamente
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "agent" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 shadow-sm">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "border border-white/[0.06] bg-white/[0.03] text-foreground"}`}>
                  {/* Se aplica el formateador solo a los mensajes del agente */}
                  {msg.role === "agent" ? formatTexto(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-3 justify-start">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-white/[0.06] px-6 py-4">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Pregunta sobre siniestros, alertas o scores..."
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-white/[0.05] transition-colors"
            disabled={isStreaming}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isStreaming} size="icon" className="h-10 w-10 shrink-0 rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}