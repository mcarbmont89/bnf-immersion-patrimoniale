import React from "react";

export default function KeywordMaterials({ keyword, materials }) {
  if (!keyword) {
    return (
      <div className="text-[#9CA3AF] text-sm">
        Cliquez sur un terme surligné pour afficher ses matériaux contextuels.
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#00C4AA] text-xs uppercase tracking-widest font-semibold">
          Matériaux contextuels
        </span>
        <span className="text-white text-sm font-medium">[{keyword}]</span>
      </div>
      <div className="space-y-2">
        {materials.map((m, i) => (
          <div
            key={i}
            className="rounded-lg bg-[#111827] border border-white/10 p-3 hover:border-[#00C4AA]/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-white text-sm leading-snug">{m.title}</span>
              <span className="text-[#00C4AA] text-sm font-mono font-semibold shrink-0">
                {m.score}%
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#9CA3AF]">
              <span className="rounded bg-[#00C4AA]/15 text-[#00C4AA] px-1.5 py-0.5 font-medium">
                {m.type}
              </span>
              <span className="font-mono">{m.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}