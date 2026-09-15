import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const ARIAL = { fontFamily: "Arial, sans-serif" };

// Build a Gallica document URL from a record's identifier or ARK.
function gallicaUrl(record) {
  if (record.identifier) return record.identifier;
  if (record.ark) return `https://gallica.bnf.fr/${record.ark}`;
  return null;
}

// Auto-fetches contextual materials from Gallica based on the current space query.
export default function SpaceMaterials({ query }) {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (!query) {
      setRecords([]);
      setTotal(0);
      setError(null);
      return;
    }
    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    base44.functions
      .invoke("gallicaSearch", { query, limit: 8 })
      .then((res) => {
        if (reqId !== reqIdRef.current) return;
        const data = res?.data || {};
        if (data.error) throw new Error(data.error);
        setRecords(data.records || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        if (reqId !== reqIdRef.current) return;
        setError(err?.message || "Erreur de recherche Gallica");
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="mt-3 flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#00C4AA] text-[10px] uppercase tracking-widest font-semibold" style={ARIAL}>
          Matériaux contextuels · Gallica
        </span>
        <span className="ml-auto text-[#9CA3AF] text-[10px] font-mono" style={ARIAL}>
          {loading ? "Gallica…" : `${total} résultat(s)`}
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-auto pr-1 space-y-1.5">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#00C4AA]/30 border-t-[#00C4AA] rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] px-2.5 py-2" style={ARIAL}>
            {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="text-[#9CA3AF] text-[11px] py-4 text-center" style={ARIAL}>
            Aucun document trouvé pour cet espace.
          </div>
        )}

        {!loading && !error && records.length > 0 &&
          records.map((r, i) => {
            const url = gallicaUrl(r);
            const Card = url ? "a" : "div";
            const cardProps = url ? { href: url, target: "_blank", rel: "noreferrer" } : {};
            const meta = [r.creator, r.date].filter(Boolean).join(", ");
            return (
              <Card
                key={i}
                {...cardProps}
                className="block rounded-lg bg-[#111827] border border-white/10 p-2 hover:border-[#00C4AA]/40 transition-colors"
              >
                <div className="text-white text-[12px] leading-snug line-clamp-2" style={ARIAL}>
                  {r.title || r.creator || r.ark || "Document Gallica"}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#9CA3AF]" style={ARIAL}>
                  {r.type && (
                    <span className="rounded bg-[#00C4AA]/15 text-[#00C4AA] px-1.5 py-0.5 font-medium">
                      {r.type}
                    </span>
                  )}
                  <span className="font-mono truncate">{meta || "Gallica · BnF"}</span>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}