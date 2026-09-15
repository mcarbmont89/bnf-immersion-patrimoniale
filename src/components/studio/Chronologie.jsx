import React, { useState, useRef, useEffect } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { encodeWAV } from "@/lib/wavEncoder";

const ARIAL = { fontFamily: "Arial, sans-serif" };

export default function Chronologie({ sources, maxDuration, setMaxDuration, onUpdate, goToControles }) {
  const [mixing, setMixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [width, setWidth] = useState(800);
  const areaRef = useRef(null);

  useEffect(() => {
    if (!areaRef.current) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(areaRef.current);
    setWidth(areaRef.current.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const pxPerSec = width / maxDuration;
  const hasSources = sources.length > 0;

  function startDrag(e, source) {
    e.preventDefault();
    const startX = e.clientX;
    const origStart = source.startTime;
    const move = (ev) => {
      const delta = (ev.clientX - startX) / pxPerSec;
      let ns = Math.max(0, Math.min(maxDuration, origStart + delta));
      onUpdate(source.id, { startTime: Math.round(ns * 10) / 10 });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  async function mix() {
    if (!hasSources) return;
    setMixing(true);
    setProgress(0);
    setDownloadUrl(null);
    const t0 = Date.now();
    const iv = setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - t0) / 2000) * 100));
    }, 50);
    await new Promise((r) => setTimeout(r, 2000));
    clearInterval(iv);
    setProgress(100);
    try {
      const rendered = await audioEngine.renderTimeline(sources, maxDuration);
      setDownloadUrl(URL.createObjectURL(encodeWAV(rendered)));
    } catch (e) {
      /* ignore */
    } finally {
      setMixing(false);
    }
  }

  const ticks = [];
  for (let t = 0; t <= maxDuration; t += 5) ticks.push(t);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-white text-sm font-bold" style={ARIAL}>Chronologie audio</div>
        <div className="flex items-center gap-2">
          <span className="text-[#9CA3AF] text-xs" style={ARIAL}>Durée max :</span>
          <select
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="rounded bg-[#1F2937] text-white text-xs px-2 py-1.5 border border-[#374151]"
            style={ARIAL}
          >
            <option value={10}>10s</option>
            <option value={20}>20s</option>
            <option value={30}>30s</option>
          </select>
          <button
            onClick={mix}
            disabled={!hasSources || mixing}
            className="rounded text-xs font-bold px-3 py-1.5 transition-colors"
            style={{
              ...ARIAL,
              background: !hasSources || mixing ? "#1F2937" : "#374151",
              color: !hasSources || mixing ? "#4B5563" : "#FFFFFF",
              cursor: !hasSources || mixing ? "not-allowed" : "pointer"
            }}
          >
            {`Mixer la chronologie (${sources.length} source${sources.length > 1 ? "s" : ""})`}
          </button>
        </div>
      </div>

      <div className="bg-[#091A14] p-3" style={{ borderLeft: "4px solid #00C4AA" }}>
        <div className="text-[11px] font-bold text-[#00C4AA] mb-2" style={ARIAL}>Contrôles de la chronologie :</div>
        <ul className="space-y-1">
          {[
            "Faites glisser les blocs pour changer l'heure de début — comportement amélioré avec arrêt fixe",
            "Les sections rayées en rouge indiquent l'audio qui sera coupé à la limite de la chronologie",
            "Boutons Rogner/Restaurer pour couper l'audio à la limite ou restaurer la longueur d'origine",
            "La chronologie s'étend automatiquement si l'audio dépasse la durée définie"
          ].map((item, i) => (
            <li key={i} className="flex gap-2 text-[10px] text-[#00C4AA]" style={ARIAL}>
              <span>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div ref={areaRef} className="bg-black rounded-lg flex-1 min-h-[200px] flex flex-col overflow-hidden">
        <div className="relative h-6 border-b border-[#111827]">
          {ticks.map((t) => (
            <div key={t} className="absolute top-0 flex flex-col items-center" style={{ left: `${(t / maxDuration) * 100}%` }}>
              <div className="w-px h-2 bg-[#374151]" />
              <div className="text-[8px] text-[#374151] mt-0.5" style={ARIAL}>{t}s</div>
            </div>
          ))}
        </div>

        <div className="flex-1 relative p-2">
          {!hasSources ? (
            <div className="absolute inset-0 flex items-center justify-center text-center" style={ARIAL}>
              <div>
                <div className="text-[12px] text-[#4B5563]">Aucune source audio ajoutée</div>
                <div className="text-[11px] text-[#4B5563] mt-1">
                  Allez dans « Contrôles audio » pour importer des fichiers, puis « Carte de spatialisation » pour les positionner
                </div>
                <button onClick={goToControles} className="mt-2 rounded bg-[#374151] text-white text-xs px-3 py-1.5" style={ARIAL}>
                  Aller aux Contrôles audio
                </button>
              </div>
            </div>
          ) : (
            sources.map((s, i) => {
              const playLen = s.trim ?? s.buffer.duration;
              const visibleLen = Math.min(playLen, maxDuration - s.startTime);
              if (visibleLen <= 0) return null;
              const leftPct = (s.startTime / maxDuration) * 100;
              const widthPct = (visibleLen / maxDuration) * 100;
              const overflow = Math.max(0, s.startTime + playLen - maxDuration);
              const cutLen = Math.min(overflow, visibleLen);
              const stripePct = visibleLen > 0 ? (cutLen / visibleLen) * 100 : 0;
              const trimmed = s.trim !== null;
              return (
                <div
                  key={s.id}
                  className="group relative h-7 mb-1.5 rounded overflow-hidden cursor-grab active:cursor-grabbing"
                  style={{ width: `${widthPct}%`, marginLeft: `${leftPct}%`, background: "#1F2937" }}
                  onPointerDown={(e) => startDrag(e, s)}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: i % 2 === 0 ? "#00C4AA" : "#64B5F6" }} />
                  <div className="pl-3 pr-2 h-full flex items-center text-[10px] text-white truncate" style={ARIAL}>
                    {s.name}
                  </div>
                  {stripePct > 0 && (
                    <div
                      className="absolute top-0 bottom-0 right-0 opacity-70"
                      style={{
                        width: `${stripePct}%`,
                        background: "repeating-linear-gradient(45deg, #EF4444, #EF4444 4px, #7F1D1D 4px, #7F1D1D 8px)"
                      }}
                    />
                  )}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdate(s.id, { trim: Math.max(0, maxDuration - s.startTime) }); }}
                      className="rounded bg-[#EF4444] text-white text-[9px] px-1.5 py-0.5"
                      style={ARIAL}
                    >
                      Rogner
                    </button>
                    {trimmed && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdate(s.id, { trim: null }); }}
                        className="rounded bg-[#374151] text-white text-[9px] px-1.5 py-0.5"
                        style={ARIAL}
                      >
                        Restaurer
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {mixing && (
        <div className="flex flex-col gap-2">
          <div className="w-full h-2 bg-[#1F2937] rounded overflow-hidden">
            <div className="h-full bg-[#00C4AA] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[#9CA3AF] text-xs" style={ARIAL}>Rendu binaural en cours…</div>
        </div>
      )}

      {!mixing && downloadUrl && (
        <div className="bg-[#111827] p-3 flex items-center justify-between" style={{ borderLeft: "4px solid #00C4AA" }}>
          <div className="text-white text-xs font-bold" style={ARIAL}>Audio binaural généré</div>
          <a href={downloadUrl} download="chronologie-binaural.wav" className="rounded bg-[#00C4AA] text-[#0A0D12] text-xs font-bold px-4 py-2 hover:bg-[#00B099]" style={ARIAL}>
            Télécharger le WAV binaural
          </a>
        </div>
      )}
    </div>
  );
}