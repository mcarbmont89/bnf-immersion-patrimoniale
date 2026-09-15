import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const ARIAL = { fontFamily: "Arial, sans-serif" };

// Build a Gallica document URL from a record's identifier or ARK.
function gallicaUrl(record) {
  if (record.identifier) return record.identifier;
  if (record.ark) return `https://gallica.bnf.fr/${record.ark}`;
  return null;
}

export default function KeywordMaterials({ keyword }) {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (!keyword) {
      setRecords([]);
      setTotal(0);
      setError(null);
      return;
    }
    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    base44.functions
      .invoke("gallicaSearch", { query: keyword, limit: 12 })
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
  }, [keyword]);

  if (!keyword) {
    return (
      <div className="text-[#9CA3AF] text-sm" style={ARIAL}>
        Cliquez sur un terme surligné pour afficher ses matériaux contextuels.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#00C4AA] text-xs uppercase tracking-widest font-semibold" style={ARIAL}>
          Matériaux contextuels
        </span>
        <span className="text-white text-sm font-medium" style={ARIAL}>[{keyword}]</span>
        <span className="ml-auto text-[#9CA3AF] text-[11px] font-mono" style={ARIAL}>
          {loading ? "Gallica…" : `${total} résultat(s) Gallica`}
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-7 h-7 border-2 border-[#00C4AA]/30 border-t-[#00C4AA] rounded-full animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs px-3 py-2" style={ARIAL}>
          {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="text-[#9CA3AF] text-sm py-6 text-center" style={ARIAL}>
          Aucun document trouvé dans Gallica pour ce terme.
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="space-y-2">
          {records.map((r, i) => {
            const url = gallicaUrl(r);
            const Card = url ? "a" : "div";
            const cardProps = url
              ? { href: url, target: "_blank", rel: "noreferrer" }
              : {};
            const meta = [r.creator, r.date].filter(Boolean).join(", ");
            return (
              <Card
                key={i}
                {...cardProps}
                className="block rounded-lg bg-[#111827] border border-white/10 p-3 hover:border-[#00C4AA]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-white text-sm leading-snug" style={ARIAL}>
                    {r.title || r.creator || r.ark || "Document Gallica"}
                  </span>
                  {r.date && (
                    <span className="text-[#00C4AA] text-xs font-mono shrink-0" style={ARIAL}>
                      {r.date}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#9CA3AF]" style={ARIAL}>
                  {r.type && (
                    <span className="rounded bg-[#00C4AA]/15 text-[#00C4AA] px-1.5 py-0.5 font-medium">
                      {r.type}
                    </span>
                  )}
                  <span className="font-mono truncate">{meta || r.source || "Gallica · BnF"}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}