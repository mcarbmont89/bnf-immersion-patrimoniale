import React, { useRef, useEffect } from "react";

const ARIAL = { fontFamily: "Arial, sans-serif" };

const TRAJECTORIES = [
  { id: "cercle", label: "Cercle" },
  { id: "figure8", label: "Figure-8" },
  { id: "spirale", label: "Spirale" },
  { id: "survol", label: "Survol" }
];

export default function CarteSpatialisation({
  sources, selectedId, onSelect, onUpdate, trajectory, setTrajectory, goToControles
}) {
  const mapRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function posToPercent(az, dist) {
    const r = (dist / 10) * 45;
    const azRad = (az * Math.PI) / 180;
    return {
      left: 50 + r * Math.sin(azRad),
      top: 50 - r * Math.cos(azRad)
    };
  }

  function handleDrag(e, source) {
    e.preventDefault();
    const rect = mapRef.current.getBoundingClientRect();
    const move = (ev) => {
      const px = ev.clientX - rect.left - rect.width / 2;
      const py = ev.clientY - rect.top - rect.height / 2;
      const maxR = rect.width * 0.45;
      let dist = (Math.hypot(px, py) / maxR) * 10;
      dist = Math.max(0.1, Math.min(10, dist));
      let az = (Math.atan2(px, -py) * 180) / Math.PI;
      if (az > 180) az -= 360;
      if (az < -180) az += 360;
      onUpdate(source.id, { az: Math.round(az), dist: Math.round(dist * 10) / 10 });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startPreview() {
    const s = sources.find((x) => x.id === selectedId);
    if (!s) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const orig = { az: s.az, dist: s.dist };
    const t0 = performance.now();
    const dur = 6000;
    const tick = (now) => {
      if (now - t0 >= dur) {
        onUpdate(s.id, orig);
        rafRef.current = null;
        return;
      }
      const t = (now - t0) / 1000;
      let az, dist;
      switch (trajectory) {
        case "cercle":
          az = Math.round((t * 90) % 360 - 180);
          dist = orig.dist;
          break;
        case "figure8":
          az = Math.round(120 * Math.sin(t * 1.2));
          dist = Math.round((orig.dist + 1.2 * Math.sin(t * 2.4)) * 10) / 10;
          break;
        case "spirale":
          az = Math.round((t * 200) % 360 - 180);
          dist = Math.round((1 + (t / 6) * 7) * 10) / 10;
          break;
        case "survol": {
          const p = t / 6;
          az = Math.round(-90 + p * 180);
          dist = orig.dist;
          break;
        }
        default:
          az = orig.az;
          dist = orig.dist;
      }
      onUpdate(s.id, { az, dist });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  const hasSources = sources.length > 0;

  return (
    <div className="flex flex-col gap-3 h-full">
      {!hasSources && (
        <div className="bg-[#1C0D00] p-4 flex items-start gap-3" style={{ borderLeft: "4px solid #F59E0B" }}>
          <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-[#0A0D12] text-xs font-bold flex items-center justify-center shrink-0" style={ARIAL}>
            1
          </div>
          <div>
            <div className="text-white text-xs font-bold" style={ARIAL}>Étape 1 : Importez un fichier audio</div>
            <div className="text-[#9CA3AF] text-[11px] mt-0.5" style={ARIAL}>
              Allez dans l'onglet « Contrôles audio » et importez un fichier audio, puis revenez ici pour le positionner sur la carte.
            </div>
            <button onClick={goToControles} className="mt-2 rounded bg-[#374151] text-white text-xs px-3 py-1.5 hover:bg-[#4B5563]" style={ARIAL}>
              Aller aux Contrôles audio
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-white text-xs font-bold mb-2" style={ARIAL}>Système de trajectoires</div>
          <div className="text-[10px] text-[#9CA3AF] mb-2" style={ARIAL}>Schémas rapides</div>
          <div className="flex flex-wrap gap-2">
            {TRAJECTORIES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrajectory(t.id)}
                className="rounded px-3 py-1.5 text-[10px] transition-colors"
                style={{
                  ...ARIAL,
                  background: trajectory === t.id ? "#374151" : "#1F2937",
                  color: trajectory === t.id ? "#FFFFFF" : "#9CA3AF"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#9CA3AF] mb-2" style={ARIAL}>Fonctions avancées</div>
          <ul className="space-y-1.5">
            {[
              "Mode manuel : Cliquez pour créer des points de passage",
              "Trajectoire fluide : Courbes de Bézier pour un mouvement fluide",
              "Copier/Coller : Dupliquer les trajectoires entre les sources",
              "Inverser : Changer instantanément la direction du mouvement"
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-[10px] text-[#9CA3AF]" style={ARIAL}>
                <span className="text-[#00C4AA]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={startPreview}
        disabled={!hasSources}
        className="self-start rounded bg-[#374151] text-white text-xs px-4 py-2 hover:bg-[#4B5563] disabled:opacity-40 transition-colors"
        style={ARIAL}
      >
        Aperçu du mouvement
      </button>

      <div
        ref={mapRef}
        className="relative w-full max-w-[600px] aspect-square bg-black rounded-lg overflow-hidden mx-auto"
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-[#4B5563]" style={ARIAL}>Avant (0°)</div>
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-[#4B5563]" style={ARIAL}>Gauche (-90°)</div>
        <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-[#4B5563]" style={ARIAL}>Droite (+90°)</div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="15" fill="none" stroke="#111827" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#111827" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#111827" strokeWidth="0.5" />
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[8px] font-bold text-[#0A0D12]" style={ARIAL}>
          Auditeur
        </div>

        {hasSources && sources.map((s) => {
          const p = posToPercent(s.az, s.dist);
          const isSel = s.id === selectedId;
          return (
            <div
              key={s.id}
              onPointerDown={(e) => { onSelect(s.id); handleDrag(e, s); }}
              className="absolute w-4 h-4 rounded-full cursor-grab active:cursor-grabbing"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                transform: "translate(-50%, -50%)",
                background: isSel ? "#00C4AA" : "#FCD34D",
                boxShadow: isSel ? "0 0 0 3px rgba(0,196,170,0.3)" : "none"
              }}
              title={s.name}
            >
              <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-white/80" style={ARIAL}>
                {s.name.length > 16 ? s.name.slice(0, 14) + "…" : s.name}
              </span>
            </div>
          );
        })}

        {!hasSources && (
          <div className="absolute inset-0 flex items-center justify-center text-center" style={ARIAL}>
            <div>
              <div className="text-[12px] text-[#4B5563]">Importez d'abord un fichier audio</div>
              <div className="text-[11px] text-[#4B5563] mt-1">Allez dans l'onglet « Contrôles audio »</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}