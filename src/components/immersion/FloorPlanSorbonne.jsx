import React from "react";

/**
 * Architectural top-down plan of the Sorbonne (Quartier Latin, Paris).
 * Rectangular building around a central courtyard, on a parchment surface.
 * Lets the 8 numbered points sit at precise coordinates over the plan.
 */
export default function FloorPlanSorbonne({ spaces, selectedId, onSelect }) {
  return (
    <div className="relative w-full">
      <svg viewBox="0 0 400 300" className="w-full h-auto block">
        {/* parchment background */}
        <rect x="0" y="0" width="400" height="300" fill="#F4F1EC" />

        {/* faint grid for architectural feel */}
        <g stroke="#D9D2C6" strokeWidth="0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
          ))}
        </g>

        {/* outer building footprint */}
        <rect x="40" y="50" width="320" height="210" rx="6" fill="none" stroke="#2A2620" strokeWidth="2.5" />
        {/* inner courtyard */}
        <rect x="130" y="110" width="140" height="90" rx="3" fill="#EDE7DC" stroke="#2A2620" strokeWidth="1.2" strokeDasharray="4 4" />

        {/* entrance arch (bottom, south wall) */}
        <path d="M 184 260 Q 200 246 216 260" fill="#F4F1EC" stroke="#2A2620" strokeWidth="2" />

        {/* a few interior hints: rooms around the courtyard */}
        <g stroke="#6B6358" strokeWidth="0.8" fill="none">
          <rect x="55" y="65" width="60" height="35" rx="2" />
          <rect x="285" y="65" width="60" height="35" rx="2" />
          <rect x="55" y="210" width="60" height="35" rx="2" />
          <line x1="200" y1="110" x2="200" y2="200" />
        </g>

        {/* compass / north mark */}
        <g stroke="#2A2620" strokeWidth="0.8" fill="#2A2620">
          <text x="372" y="22" fontSize="9" fontFamily="ui-sans-serif, system-ui" textAnchor="middle">N</text>
          <line x1="372" y1="28" x2="372" y2="40" />
          <polygon points="372,26 369,32 375,32" />
        </g>

        {/* numbered points */}
        {spaces.map((s) => {
          const active = s.id === selectedId;
          return (
            <g
              key={s.id}
              transform={`translate(${s.x} ${s.y})`}
              className="cursor-pointer"
              onClick={() => onSelect(s.id)}
            >
              {active && <circle r="13" fill="#00C4AA" opacity="0.18" />}
              <circle
                r={active ? 10 : 8}
                fill={active ? "#00C4AA" : "#1A1F26"}
                stroke="#F4F1EC"
                strokeWidth="2"
              />
              <text
                y="3.2"
                fontSize={active ? "9" : "8"}
                fontWeight="700"
                fill={active ? "#0A0D12" : "#F4F1EC"}
                textAnchor="middle"
                fontFamily="ui-sans-serif, system-ui"
              >
                {s.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}