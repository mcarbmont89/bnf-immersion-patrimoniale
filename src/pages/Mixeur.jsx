import React, { useState } from "react";
import { MIX_FONDS } from "@/components/mixeur/fonds";
import StemCard from "@/components/mixeur/StemCard";
import SpatialMap from "@/components/mixeur/SpatialMap";

export default function Mixeur() {
  const [fondId, setFondId] = useState(MIX_FONDS[0].id);
  const fond = MIX_FONDS.find((f) => f.id === fondId);
  const [stems, setStems] = useState(() =>
    MIX_FONDS[0].stems.map((s) => ({ ...s }))
  );
  const [separated, setSeparated] = useState(false);
  const [loading, setLoading] = useState(false);

  function selectFond(id) {
    setFondId(id);
    const f = MIX_FONDS.find((x) => x.id === id);
    setStems(f.stems.map((s) => ({ ...s })));
    setSeparated(false);
  }

  function separate() {
    setLoading(true);
    setSeparated(false);
    setTimeout(() => {
      setLoading(false);
      setSeparated(true);
    }, 1200);
  }

  function updateStem(id, patch) {
    setStems((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* header */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={fondId}
          onChange={(e) => selectFond(e.target.value)}
          className="bg-[#111827] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#00C4AA] outline-none"
        >
          {MIX_FONDS.map((f) => (
            <option key={f.id} value={f.id}>{f.id} · {f.title}</option>
          ))}
        </select>
        <span className="text-[#9CA3AF] text-xs font-mono">{fond.source}</span>
        <button
          onClick={separate}
          disabled={loading}
          className="ml-auto rounded-lg bg-[#00C4AA] text-[#0A0D12] text-sm font-semibold px-4 py-2 hover:bg-[#00B099] transition-colors disabled:opacity-60"
        >
          {loading ? "Séparation IA…" : separated ? "Re-séparer les pistes (IA)" : "Séparer les pistes (IA)"}
        </button>
      </div>

      {!separated && !loading && (
        <div className="rounded-xl bg-[#111827] border border-dashed border-white/15 p-10 text-center text-[#9CA3AF]">
          Cliquez sur « Séparer les pistes (IA) » pour générer les stems spatialisés.
        </div>
      )}

      {loading && (
        <div className="rounded-xl bg-[#111827] border border-white/10 p-10 flex flex-col items-center">
          <div className="w-9 h-9 border-2 border-[#00C4AA]/30 border-t-[#00C4AA] rounded-full animate-spin" />
          <div className="mt-3 text-[#00C4AA] text-xs uppercase tracking-widest">
            Séparation des pistes en cours…
          </div>
        </div>
      )}

      {separated && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 content-start">
            {stems.map((s) => (
              <StemCard key={s.id} stem={s} onChange={(patch) => updateStem(s.id, patch)} />
            ))}
          </div>
          <SpatialMap stems={stems} onChange={updateStem} />
        </div>
      )}
    </div>
  );
}