import React, { useRef } from "react";

const ARIAL = { fontFamily: "Arial, sans-serif" };
const R = 130;
const MAX_D = 5;

function toXY(az, dist) {
  const rad = (az * Math.PI) / 180;
  const d = (dist / MAX_D) * R;
  return { x: d * Math.sin(rad), y: -d * Math.cos(rad) };
}

function fromXY(dx, dy) {
  const dpx = Math.sqrt(dx * dx + dy * dy);
  const dist = Math.max(0.1, Math.min(MAX_D, (dpx / R) * MAX_D));
  let az = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
  if (az === -180) az = 180;
  return { az, dist: Math.round(dist * 10) / 10 };
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C4AA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

export default function SpatialMap3D({ stems, onChange }) {
  const svgRef = useRef(null);
  const dragId = useRef(null);

  function toCoords(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const scale = rect.width / 300;
    const cx = rect.width / 2 / scale;
    const cy = rect.height / 2 / scale;
    return { dx: (e.clientX - rect.left) / scale - cx, dy: (e.clientY - rect.top) / scale - cy };
  }

  function down(e, s) {
    e.preventDefault();
    dragId.current = s.id;
    e.target.setPointerCapture(e.pointerId);
  }

  function move(e) {
    if (!dragId.current) return;
    const { dx, dy } = toCoords(e);
    const { az, dist } = fromXY(dx, dy);
    onChange(dragId.current, { az, dist });
  }

  function up() {
    dragId.current = null;
  }

  function dotSize(s) {
    const base = 10 + (s.volume / 100) * 8;
    const distFactor = 1 + ((MAX_D - s.dist) / MAX_D) * 0.25;
    return base * distFactor;
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <SpeakerIcon />
        <span className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-widest" style={ARIAL}>
          Carte de spatialisation 3D
        </span>
      </div>
      <div className="rounded-xl bg-black p-2">
        <svg
          ref={svgRef}
          viewBox="-150 -150 300 300"
          className="w-full touch-none"
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
        >
          {/* concentric distance rings */}
          {[R, R * 0.66, R * 0.33].map((r, i) => (
            <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="#1F2937" strokeWidth="1" />
          ))}
          {/* azimuth cross guides */}
          <line x1="0" y1={-R} x2="0" y2={R} stroke="#1F2937" strokeWidth="0.5" />
          <line x1={-R} y1="0" x2={R} y2="0" stroke="#1F2937" strokeWidth="0.5" />
          {/* listener */}
          <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
          <text x="0" y="22" fill="#9CA3AF" fontSize="10" textAnchor="middle" fontFamily="Arial, sans-serif">Auditeur</text>
          {/* track dots */}
          {stems.map((s) => {
            const { x, y } = toXY(s.az, s.dist);
            const size = dotSize(s);
            return (
              <g key={s.id} transform={`translate(${x} ${y})`} onPointerDown={(e) => down(e, s)} className="cursor-grab">
                <circle r={size + 5} fill={s.color} opacity="0.2" />
                <circle r={size} fill={s.color} stroke="#0A0D12" strokeWidth="1.5" />
                <text y={size + 12} fill="#FFFFFF" fontSize="9" textAnchor="middle" fontFamily="Arial, sans-serif">{s.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-[#4B5563] text-[9px] italic" style={ARIAL}>
        Chaque piste extraite est positionnée dans l'espace sonore. Le volume influe sur la taille du marqueur.
      </p>
    </div>
  );
}