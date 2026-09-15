import React, { useRef } from "react";

// Circular spatial map: center = auditeur (listener).
// Each stem is a dot placed by azimuth (deg, 0 = front/up) and distance (M, max 5).
// Dots are draggable; dragging updates az + dist in real time.
const R = 120; // map radius in px
const MAX_D = 5;

function toXY(az, dist) {
  const rad = (az * Math.PI) / 180;
  const d = (dist / MAX_D) * R;
  return { x: d * Math.sin(rad), y: -d * Math.cos(rad) };
}

function fromXY(dx, dy) {
  const dpx = Math.sqrt(dx * dx + dy * dy);
  const dist = Math.max(0.5, Math.min(MAX_D, (dpx / R) * MAX_D));
  let az = Math.round((Math.atan2(dx, -dy) * 180) / Math.PI);
  if (az === -180) az = 180;
  return { az, dist: Math.round(dist * 10) / 10 };
}

export default function SpatialMap({ stems, onChange }) {
  const svgRef = useRef(null);
  const dragId = useRef(null);

  function pointerToCoords(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const scale = rect.width / 280; // viewBox 280x280
    return { dx: (e.clientX - rect.left) / scale - cx, dy: (e.clientY - rect.top) / scale - cy };
  }

  function onPointerDown(e, stem) {
    e.preventDefault();
    dragId.current = stem.id;
    e.target.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragId.current) return;
    const { dx, dy } = pointerToCoords(e);
    const { az, dist } = fromXY(dx, dy);
    const stem = stems.find((s) => s.id === dragId.current);
    if (!stem) return;
    const volume = Math.round(Math.max(20, stem.volume + (stem.dist - dist) * 5));
    onChange(stem.id, { az, dist, volume });
  }
  function onPointerUp() {
    dragId.current = null;
  }

  return (
    <div className="rounded-xl bg-[#0D1117] border border-white/10 p-4 flex flex-col items-center">
      <div className="text-[#9CA3AF] text-xs uppercase tracking-widest mb-2 self-start">
        Carte spatiale
      </div>
      <svg
        ref={svgRef}
        viewBox="-140 -140 280 280"
        className="w-full max-w-[300px] touch-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* rings */}
        {[R, R * 0.66, R * 0.33].map((r, i) => (
          <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="#ffffff14" strokeWidth="1" />
        ))}
        {/* axes */}
        <line x1="0" y1="-R" x2="0" y2={R} stroke="#ffffff10" strokeWidth="1" />
        <line x1={-R} y1="0" x2={R} y2="0" stroke="#ffffff10" strokeWidth="1" />
        {/* listener */}
        <circle cx="0" cy="0" r="6" fill="#00C4AA" />
        <text x="0" y="22" fill="#9CA3AF" fontSize="9" textAnchor="middle" fontFamily="ui-sans-serif, system-ui">
          Auditeur
        </text>
        {/* dots */}
        {stems.map((s) => {
          const { x, y } = toXY(s.az, s.dist);
          const size = 9 - (s.dist / MAX_D) * 3;
          return (
            <g
              key={s.id}
              transform={`translate(${x} ${y})`}
              onPointerDown={(e) => onPointerDown(e, s)}
              className="cursor-grab"
            >
              <circle r={size + 5} fill={s.color} opacity="0.18" />
              <circle r={size} fill={s.color} stroke="#0A0D12" strokeWidth="1.5" />
              <text
                y={size + 12}
                fill="#ffffff"
                fontSize="8"
                textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui"
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 text-[11px] text-[#9CA3AF] text-center">
        Glissez un point pour changer azimut et distance.
      </div>
    </div>
  );
}