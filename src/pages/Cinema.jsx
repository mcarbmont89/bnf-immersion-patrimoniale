import React, { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";
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
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const archive = ARCHIVES.find((a) => a.id === archiveId);

  useEffect(() => {
    setPlaying(true);
  }, [archiveId]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

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

      {/* cinematic stage with video carousel */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0A0D12] aspect-video">
        <video
          key={archiveId}
          ref={videoRef}
          src={archive.video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D12]/90 via-[#0A0D12]/20 to-[#0A0D12]/70 pointer-events-none" />
        <div className="absolute top-3 left-3 rounded-full bg-[#00C4AA] px-3 py-1 text-[10px] font-bold tracking-wider text-[#0A0D12]">
          {DIAPORAMA_BADGE}
        </div>
        <div className="absolute left-6 bottom-6 max-w-[620px]">
          <p className="italic text-white text-2xl leading-tight mb-2">{archive.overlay}</p>
          <Typewriter text={archive.typewriter} />
        </div>
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Lecture"}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full border border-white/60 bg-white/10 grid place-items-center text-white hover:bg-[#00C4AA] hover:text-[#0A0D12] hover:shadow-[0_0_0_8px_rgba(0,196,170,0.2)] transition-all duration-200 active:scale-95"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      {/* selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ARCHIVES.map((a) => {
          const active = a.id === archiveId;
          return (
            <button
              key={a.id}
              onClick={() => setArchiveId(a.id)}
              className={`text-left rounded-xl p-4 border transition-all duration-200 ${
                active
                  ? "bg-[#00C4AA]/10 border-[#00C4AA] shadow-[inset_4px_0_0_0_#00C4AA]"
                  : "bg-[#111827] border-white/10 hover:border-[#00C4AA]/50 hover:-translate-y-0.5"
              }`}
            >
              <div className="text-[#00C4AA] text-[10px] font-bold uppercase tracking-widest mb-2">
                Archive
              </div>
              <div className="text-white text-sm font-semibold leading-snug mb-2">
                {a.label}
              </div>
              <p className="text-[#9CA3AF] text-[11px] font-mono leading-snug line-clamp-3">
                {a.typewriter}
              </p>
            </button>
          );
        })}
      </div>

      {/* ASR + Gold cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#111827] border border-white/10 p-4">
          <div className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-2">
            Archive brute (ASR)
          </div>
          <p className="text-white/70 text-sm font-mono leading-relaxed line-clamp-4">{archive.asr}</p>
        </div>
        <div className="rounded-xl bg-[#111827] border border-[#00C4AA]/40 p-4">
          <div className="text-[#00C4AA] text-xs uppercase tracking-widest mb-2">
            Restitution IA · Gold Standard
          </div>
          <p className="text-white text-sm leading-relaxed line-clamp-4">{archive.gold}</p>
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