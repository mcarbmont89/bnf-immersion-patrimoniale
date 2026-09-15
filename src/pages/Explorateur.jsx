import React, { useState } from "react";
import { FONDS } from "@/components/explorateur/fonds";
import TranscriptionView from "@/components/explorateur/TranscriptionView";
import KeywordMaterials from "@/components/explorateur/KeywordMaterials";

export default function Explorateur() {
  const [fondId, setFondId] = useState(FONDS[0].id);
  const fond = FONDS.find((f) => f.id === fondId);
  const [activeKeyword, setActiveKeyword] = useState(fond.defaultKeyword);

  function selectFond(id) {
    setFondId(id);
    const f = FONDS.find((x) => x.id === id);
    setActiveKeyword(f.defaultKeyword);
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4">
      {/* left: selector + transcription */}
      <div className="lg:w-1/2 flex flex-col gap-3 min-h-0">
        <div className="flex flex-wrap gap-2">
          {FONDS.map((f) => (
            <button
              key={f.id}
              onClick={() => selectFond(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                f.id === fondId
                  ? "bg-[#00C4AA] text-[#0A0D12] border-[#00C4AA]"
                  : "bg-[#111827] text-[#9CA3AF] border-white/10 hover:text-white"
              }`}
            >
              {f.id} · {f.title}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-[#111827] border border-white/10 p-4 flex-1 min-h-0 overflow-auto">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-white text-lg font-semibold">{fond.title}</h2>
              <p className="text-[#00C4AA] text-sm">{fond.subtitle}</p>
            </div>
            <span className="text-[#9CA3AF] text-xs font-mono">{fond.duration}</span>
          </div>
          <div className="mt-4">
            <TranscriptionView
              text={fond.transcription}
              activeKeyword={activeKeyword}
              onKeyword={setActiveKeyword}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#9CA3AF] italic">
            Source : {fond.source} · cliquez sur un terme surligné pour affiner la recherche.
          </div>
        </div>
      </div>

      {/* right: materials */}
      <div className="lg:w-1/2 rounded-xl bg-[#0D1117] border border-white/10 p-4 overflow-auto">
        <KeywordMaterials keyword={activeKeyword} />
      </div>
    </div>
  );
}