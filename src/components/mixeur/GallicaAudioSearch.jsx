import React, { useState, useRef } from "react";
import { searchGallicaAudio, fetchGallicaAudioArrayBuffer } from "@/lib/gallicaService";

const ARIAL = { fontFamily: "Arial, sans-serif" };

export default function GallicaAudioSearch({ onAudioArrayBuffer, onLocalFile, disabled }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [loadingArk, setLoadingArk] = useState(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const fileRef = useRef(null);

  async function search(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q || searching) return;
    setSearching(true);
    setError("");
    setSearched(false);
    try {
      const { records, total: t } = await searchGallicaAudio(q, 12);
      setResults(records);
      setTotal(t);
    } catch (err) {
      setError("Échec de la recherche Gallica.");
      setResults([]);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }

  async function loadRecord(rec) {
    if (!rec.ark || loadingArk) return;
    setLoadingArk(rec.ark);
    setError("");
    try {
      const ab = await fetchGallicaAudioArrayBuffer(rec.ark);
      onAudioArrayBuffer(ab, { label: rec.title, source: `Gallica · ${rec.ark}` });
    } catch (err) {
      setError("Audio Gallica inaccessible. Essayez un import local.");
    } finally {
      setLoadingArk(null);
    }
  }

  function onFilePicked(e) {
    const file = e.target.files?.[0];
    if (file) onLocalFile(file, { label: file.name, source: `${file.name} · local` });
    e.target.value = "";
  }

  return (
    <div className="rounded-xl bg-[#0D1117] border border-white/10 p-3 flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={search} className="flex gap-2 flex-1 min-w-[220px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher des archives sonores dans Gallica..."
            className="flex-1 bg-[#1F2937] border border-[#374151] text-white text-sm rounded-lg px-3 py-2 focus:border-[#00C4AA] outline-none"
            style={ARIAL}
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={searching || !query.trim() || disabled}
            className="rounded-lg bg-[#00C4AA] text-[#0A0D12] text-sm font-bold px-4 py-2 hover:bg-[#00B099] transition-colors disabled:opacity-50"
            style={ARIAL}
          >
            {searching ? "…" : "Rechercher"}
          </button>
        </form>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="rounded-lg bg-[#374151] text-white text-sm px-4 py-2 hover:bg-[#4B5563] transition-colors disabled:opacity-50"
          style={ARIAL}
        >
          Importer un fichier local
        </button>
        <input ref={fileRef} type="file" accept=".wav,.mp3,.ogg,.flac,audio/*" className="hidden" onChange={onFilePicked} />
      </div>

      {error && <div className="text-red-300 text-xs" style={ARIAL}>{error}</div>}

      {searched && !searching && (
        <div>
          <div className="text-[#9CA3AF] text-[11px] mb-2" style={ARIAL}>
            {results.length} résultat(s) · {total.toLocaleString("fr-FR")} au total dans Gallica
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-auto pr-1">
            {results.length === 0 && (
              <div className="text-[#9CA3AF] text-xs" style={ARIAL}>Aucun résultat.</div>
            )}
            {results.map((r, i) => (
              <div key={i} className="rounded-lg bg-[#111827] p-2.5">
                <div className="text-white text-[13px] leading-snug line-clamp-2" style={ARIAL}>{r.title}</div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-[#9CA3AF] text-[11px] font-mono truncate">
                    {r.date || "s.d."} · {r.creator || "anonyme"}
                  </span>
                  <button
                    onClick={() => loadRecord(r)}
                    disabled={!r.ark || loadingArk === r.ark}
                    className="shrink-0 rounded bg-[#00C4AA]/15 text-[#00C4AA] text-[11px] font-medium px-2 py-1 hover:bg-[#00C4AA]/25 transition-colors disabled:opacity-40"
                    style={ARIAL}
                  >
                    {loadingArk === r.ark ? "…" : "Charger"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}