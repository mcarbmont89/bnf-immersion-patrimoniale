import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DOCUMENTS, OUT_OF_SCOPE } from "@/components/chat/documents";
import MessageBubble, { TypingIndicator } from "@/components/chat/MessageBubble";
import SearchPanel from "@/components/chat/SearchPanel";

export default function ChatGallica({ onCarryToCinema, onCarryToImmersion }) {
  const [customDocs, setCustomDocs] = useState([]);
  const [activeId, setActiveId] = useState(DOCUMENTS[0].id);
  const [messages, setMessages] = useState(() =>
    DOCUMENTS[0].conversation.map((m) => ({ ...m }))
  );
  const [chips, setChips] = useState(DOCUMENTS[0].chips);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  const allDocs = [...DOCUMENTS, ...customDocs];
  const activeDoc = allDocs.find((d) => d.id === activeId);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function addCustomDoc(doc) {
    setCustomDocs((prev) =>
      prev.some((d) => d.id === doc.id) ? prev : [...prev, doc]
    );
  }

  function selectDoc(id) {
    setActiveId(id);
    const d = allDocs.find((x) => x.id === id);
    if (d?.custom) {
      // New document: start a fresh conversation with a welcome message.
      const isSonore = d.type === "sonore";
      const intro = isSonore
        ? `Extrait sonore chargé depuis Gallica : « ${d.label} ».\nPosez vos questions, je m'appuierai sur le contenu OCR des premières pages. Cet extrait peut aussi alimenter le Cinéma Historique IA ou l'Immersion Patrimoniale.`
        : `Document chargé depuis Gallica : « ${d.label} ».\nPosez vos questions, je m'appuierai sur le contenu OCR des premières pages.`;
      setMessages([{ role: "assistant", text: intro }]);
      setChips([]);
    } else {
      setMessages(d.conversation.map((m) => ({ ...m })));
      setChips(d.chips);
    }
  }

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || typing) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setChips([]);
    setTyping(true);
    try {
      const payload = { question: q };
      if (activeDoc?.custom) {
        payload.document = {
          label: activeDoc.label,
          metadata: activeDoc.metadata,
          ark: activeDoc.ark
        };
      } else {
        payload.documentId = activeId;
      }
      const res = await base44.functions.invoke("chatGallica", payload);
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
      {/* sidebar: search + documents */}
      <aside className="lg:w-72 shrink-0 flex flex-col gap-3 overflow-auto">
        <SearchPanel onAdd={addCustomDoc} />

        <div className="text-[#9CA3AF] text-xs uppercase tracking-widest">
          Documents
        </div>
        <div className="flex flex-col gap-2">
          {DOCUMENTS.map((d) => (
            <button
              key={d.id}
              onClick={() => selectDoc(d.id)}
              className={`text-left rounded-lg p-3 border transition-colors ${
                d.id === activeId
                  ? "bg-[#00C4AA]/10 border-[#00C4AA]/50"
                  : "bg-[#111827] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="text-white text-sm font-medium">{d.label}</div>
              <div className="text-[#9CA3AF] text-[11px] font-mono mt-0.5">
                {d.metadata}
              </div>
            </button>
          ))}
        </div>

        {customDocs.length > 0 && (
          <>
            <div className="text-[#00C4AA] text-xs uppercase tracking-widest mt-1">
              Ajoutés de Gallica
            </div>
            <div className="flex flex-col gap-2">
              {customDocs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => selectDoc(d.id)}
                  className={`text-left rounded-lg p-3 border transition-colors ${
                    d.id === activeId
                      ? "bg-[#00C4AA]/10 border-[#00C4AA]/50"
                      : "bg-[#111827] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="text-white text-[13px] font-medium leading-snug line-clamp-2">
                    {d.label}
                  </div>
                  <div className="text-[#9CA3AF] text-[11px] font-mono mt-0.5 truncate">
                    {d.metadata}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* conversation */}
      <div className="flex-1 flex flex-col min-h-0 rounded-xl bg-[#0D1117] border border-white/10">
        <div className="px-4 py-3 border-b border-white/10">
          <div className="text-white text-sm font-medium line-clamp-1">
            {activeDoc?.label}
          </div>
          <div className="text-[#9CA3AF] text-[11px] font-mono truncate">
            {activeDoc?.metadata}
          </div>
          {activeDoc?.custom && activeDoc?.type === "sonore" && (
            <div className="mt-2 rounded-lg bg-[#00C4AA]/10 border border-[#00C4AA]/30 p-2.5">
              <div className="text-[#00C4AA] text-[11px] uppercase tracking-widest mb-1.5">
                Extrait sonore · propulsé depuis Gallica
              </div>
              <div className="text-[#9CA3AF] text-xs mb-2">
                Cet extrait peut alimenter une restitution cinématographique ou une immersion patrimoniale.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onCarryToCinema?.(activeDoc)}
                  className="rounded-lg bg-[#00C4AA] text-[#0A0D12] text-xs font-semibold px-3 py-1.5 hover:bg-[#00B099] transition-colors"
                >
                  L'emporter au Cinéma
                </button>
                <button
                  onClick={() => onCarryToImmersion?.(activeDoc)}
                  className="rounded-lg bg-[#111827] border border-[#00C4AA]/40 text-[#00C4AA] text-xs font-semibold px-3 py-1.5 hover:bg-[#00C4AA]/10 transition-colors"
                >
                  L'emporter en Immersion
                </button>
              </div>
            </div>
          )}
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