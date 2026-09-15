import React from "react";

const ARIAL = { fontFamily: "Arial, sans-serif" };

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00C4AA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0D12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0D12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function SourceFileCard({ audioMeta, separated, separating, onSeparate }) {
  return (
    <div className="rounded-xl bg-[#111827] p-4 flex items-center gap-4 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00C4AA]" />
      <div className="flex items-center gap-2 shrink-0">
        <MicIcon />
        <span className="text-[9px] uppercase tracking-widest text-[#9CA3AF]" style={ARIAL}>
          Fichier source
        </span>
      </div>
      <div className="flex-1 min-w-0">
        {audioMeta ? (
          <>
            <div className="text-white text-sm font-bold truncate" style={ARIAL}>
              {audioMeta.label}
            </div>
            <div className="text-[#9CA3AF] text-[11px] truncate" style={ARIAL}>
              {audioMeta.source}
            </div>
          </>
        ) : (
          <div className="text-[#9CA3AF] text-sm" style={ARIAL}>
            Aucun fichier audio chargé. Recherchez dans Gallica ou importez un fichier local.
          </div>
        )}
      </div>
      <button
        onClick={onSeparate}
        disabled={!audioMeta || separating || separated}
        className="shrink-0 inline-flex items-center gap-2 rounded bg-[#00C4AA] text-[#0A0D12] text-xs font-bold px-4 py-2 hover:bg-[#00B099] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={ARIAL}
      >
        {separated ? (
          <><CheckIcon /> Pistes séparées</>
        ) : separating ? (
          "Séparation IA…"
        ) : (
          <><LayersIcon /> Séparer les pistes (IA)</>
        )}
      </button>
    </div>
  );
}