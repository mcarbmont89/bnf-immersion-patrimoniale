import React, { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function SearchPanel({ onAdd }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [addedArks, setAddedArks] = useState(new Set());

  async function search(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await base44.functions.invoke("gallicaSearch", {
        query: q,
        type: type || undefined,
        limit: 10
      });
      const data = res?.data || {};
      setResults(data.records || []);
      setTotal(data.total || 0);
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function add(rec) {
    const doc = {
      id: "gallica_" + rec.ark.replace(/[^a-zA-Z0-9]/g, ""),
      label: rec.title,
      metadata: `Gallica · ${rec.ark} · ${rec.date || ""} · ${rec.creator || ""}`.trim(),
      ark: rec.ark,
      custom: true
    };
    onAdd(doc);
    setAddedArks((prev) => new Set(prev).add(rec.ark));
  }

  return (
    <div className="rounded-xl bg-[#0D1117] border border-white/10 p-3">
      <form onSubmit={search} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher dans Gallica…"
          className="flex-1 bg-[#111827] border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#00C4AA] outline-none"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-[#111827] border border-white/10 text-[#9CA3AF] text-sm rounded-lg px-2 py-2 focus:border-[#00C4AA] outline-none"
        >
          <option value="">Tous types</option>
          <option value="monographie">Monographie</option>
          <option value="sonore">Sonore</option>
          <option value="manuscrit">Manuscrit</option>
          <option value="carte">Carte</option>
          <option value="image">Image</option>
          <option value="partition">Partition</option>
          <option value="fascicule">Périodique</option>
        </select>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="rounded-lg bg-[#00C4AA] text-[#0A0D12] text-sm font-semibold px-4 py-2 hover:bg-[#00B099] transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "OK"}
        </button>
      </form>

      {loading && (
        <div className="mt-3 flex items-center gap-2 text-[#9CA3AF] text-xs">
          <div className="w-4 h-4 border-2 border-[#00C4AA]/30 border-t-[#00C4AA] rounded-full animate-spin" />
          Recherche dans Gallica…
        </div>
      )}

      {searched && !loading && (
        <div className="mt-3">
          <div className="text-[#9CA3AF] text-[11px] mb-2">
            {results.length} résultat(s) · {total.toLocaleString("fr-FR")} au total dans Gallica
          </div>
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {results.length === 0 && (
              <div className="text-[#9CA3AF] text-xs">Aucun résultat.</div>
            )}
            {results.map((r, i) => (
              <div
                key={i}
                className="rounded-lg bg-[#111827] border border-white/10 p-2.5"
              >
                <div className="text-white text-[13px] leading-snug line-clamp-2">
                  {r.title}
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-[#9CA3AF] text-[11px] font-mono truncate">
                    {r.date || "s.d."} · {r.creator || "anonyme"}
                  </span>
                  <button
                    onClick={() => add(r)}
                    disabled={addedArks.has(r.ark) || !r.ark}
                    className="shrink-0 rounded-md bg-[#00C4AA]/15 text-[#00C4AA] text-[11px] font-medium px-2 py-1 hover:bg-[#00C4AA]/25 transition-colors disabled:opacity-40"
                  >
                    {addedArks.has(r.ark) ? "Ajouté" : "Ajouter"}
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