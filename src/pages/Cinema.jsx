import React, { useState, useEffect, useRef } from "react";
import { ARCHIVES, RAG_VALIDATION, DIAPORAMA_BADGE } from "@/components/cinema/archives";

function Typewriter({ text }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span className="font-mono text-white/90 text-sm">
      {text.slice(0, n)}
      <span className="inline-block w-2 h-4 bg-[#00C4AA] ml-0.5 align-middle animate-pulse" />
    </span>
  );
}

export default function Cinema({ carriedDoc }) {
  const [archiveId, setArchiveId] = useState(ARCHIVES[0].id);
  const archive = ARCHIVES.find((a) => a.id === archiveId);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* carried extract from chat */}
      {carriedDoc && carriedDoc.target === "cinema" && (
        <div className="rounded-xl bg-[#00C4AA]/10 border border-[#00C4AA]/40 p-4">
          <div className="text-[#00C4AA] text-xs uppercase tracking-widest mb-1">
            Extrait sonore apporté depuis le Chat · Gallica
          </div>
          <div className="text-white text-sm font-medium">{carriedDoc.label}</div>
          <div className="text-[#9CA3AF] text-[11px] font-mono mt-0.5">
            {carriedDoc.metadata}
          </div>
          <p className="text-[#9CA3AF] text-xs mt-2">
            Prêt pour restitution cinématographique IA : l'OCR des premières pages alimentera le Gold Standard et le diaporama.
          </p>
        </div>
      )}

      {/* selector */}
      <div className="flex items-center gap-3">
        <label className="text-[#9CA3AF] text-xs uppercase tracking-widest">Archive</label>
        <select
          value={archiveId}
          onChange={(e) => setArchiveId(e.target.value)}
          className="bg-[#111827] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#00C4AA] outline-none"
        >
          {ARCHIVES.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ASR card */}
        <div className="rounded-xl bg-[#111827] border border-white/10 p-4">
          <div className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-2">
            Archive brute (ASR)
          </div>
          <p className="text-white/70 text-sm font-mono leading-relaxed line-clamp-4">{archive.asr}</p>
        </div>
        {/* Gold standard card */}
        <div className="rounded-xl bg-[#111827] border border-[#00C4AA]/40 p-4">
          <div className="text-[#00C4AA] text-xs uppercase tracking-widest mb-2">
            Restitution IA · Gold Standard
          </div>
          <p className="text-white text-sm leading-relaxed line-clamp-4">{archive.gold}</p>
        </div>
      </div>

      {/* cinematic stage */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#1a1410] to-[#0A0D12] aspect-video flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_#3a2a1a,_transparent_70%)]" />
        <div className="relative text-center px-6">
          <p className="italic text-white/90 text-xl line-clamp-4">{archive.overlay}</p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 px-6 text-center">
          <Typewriter text={archive.typewriter} />
        </div>
        <div className="absolute top-3 left-3 rounded-full bg-[#00C4AA] px-3 py-1 text-[10px] font-bold tracking-wider text-[#0A0D12]">
          {DIAPORAMA_BADGE}
        </div>
      </div>

      {/* RAG validation */}
      <div className="rounded-xl bg-[#0d2a25] border border-[#00C4AA]/50 p-4">
        <p className="text-[#00C4AA] text-sm">
          {RAG_VALIDATION}
        </p>
      </div>
    </div>
  );
}