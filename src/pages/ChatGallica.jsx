import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DOCUMENTS, OUT_OF_SCOPE } from "@/components/chat/documents";
import MessageBubble, { TypingIndicator } from "@/components/chat/MessageBubble";

export default function ChatGallica() {
  const [docId, setDocId] = useState(DOCUMENTS[0].id);
  const doc = DOCUMENTS.find((d) => d.id === docId);
  const [messages, setMessages] = useState(() => DOCUMENTS[0].conversation.map((m) => ({ ...m })));
  const [chips, setChips] = useState(DOCUMENTS[0].chips);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function selectDoc(id) {
    setDocId(id);
    const d = DOCUMENTS.find((x) => x.id === id);
    setMessages(d.conversation.map((m) => ({ ...m })));
    setChips(d.chips);
  }

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setChips([]);
    setTyping(true);
    try {
      const res = await base44.functions.invoke("chatGallica", {
        documentId: docId,
        question: q
      });
      const answer = res?.data?.answer || OUT_OF_SCOPE;
      const newChips = Array.isArray(res?.data?.chips) ? res.data.chips : [];
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
      setChips(newChips);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Une erreur est survenue. Veuillez réessayer." }
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* document selector */}
      <aside className="lg:w-64 shrink-0 flex flex-col gap-2">
        <div className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-1">
          Documents Gallica
        </div>
        {DOCUMENTS.map((d) => (
          <button
            key={d.id}
            onClick={() => selectDoc(d.id)}
            className={`text-left rounded-lg p-3 border transition-colors ${
              d.id === docId
                ? "bg-[#00C4AA]/10 border-[#00C4AA]/50"
                : "bg-[#111827] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-white text-sm font-medium">{d.label}</div>
            <div className="text-[#9CA3AF] text-[11px] font-mono mt-0.5">{d.metadata}</div>
          </button>
        ))}
      </aside>

      {/* conversation */}
      <div className="flex-1 flex flex-col min-h-0 rounded-xl bg-[#0D1117] border border-white/10">
        <div className="px-4 py-3 border-b border-white/10">
          <div className="text-white text-sm font-medium">{doc.label}</div>
          <div className="text-[#9CA3AF] text-[11px] font-mono">{doc.metadata}</div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3 min-h-0">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} text={m.text} />
          ))}
          {typing && <TypingIndicator />}
          <div ref={scrollRef} />
        </div>

        {chips.length > 0 && !typing && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <button
                key={i}
                onClick={() => send(c)}
                className="rounded-full bg-[#111827] border border-white/10 px-3 py-1 text-xs text-[#9CA3AF] hover:text-[#00C4AA] hover:border-[#00C4AA]/40 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="p-3 border-t border-white/10 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question sur ce document…"
            className="flex-1 bg-[#111827] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#00C4AA] outline-none"
          />
          <button
            type="submit"
            disabled={typing || !input.trim()}
            className="rounded-lg bg-[#00C4AA] text-[#0A0D12] text-sm font-semibold px-4 py-2 hover:bg-[#00B099] transition-colors disabled:opacity-50"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}