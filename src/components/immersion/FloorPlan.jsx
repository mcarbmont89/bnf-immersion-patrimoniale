import React from "react";

/**
 * Architectural top-down plan of the BnF Salle Ovale de Richelieu.
 * Hand-drawn SVG on a parchment/cream surface — crisp, deterministic, and
 * lets the 8 numbered points sit at precise coordinates over the plan.
 */
export default function FloorPlan({ spaces, selectedId, onSelect }) {
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

        {/* outer oval wall */}
        <ellipse cx="200" cy="150" rx="165" ry="115" fill="none" stroke="#2A2620" strokeWidth="2.5" />
        {/* inner gallery ring */}
        <ellipse cx="200" cy="150" rx="135" ry="88" fill="none" stroke="#2A2620" strokeWidth="1.2" strokeDasharray="4 4" />
        {/* central reading area */}
        <ellipse cx="200" cy="150" rx="70" ry="42" fill="none" stroke="#2A2620" strokeWidth="1" />

        {/* entrance arch (bottom) */}
        <path d="M 180 264 Q 200 250 220 264" fill="#F4F1EC" stroke="#2A2620" strokeWidth="2" />

        {/* a few interior details: tables + shelves hints */}
        <g stroke="#6B6358" strokeWidth="0.8" fill="none">
          <rect x="170" y="135" width="60" height="30" rx="3" />
          <line x1="200" y1="135" x2="200" y2="165" />
          <line x1="170" y1="150" x2="230" y2="150" />
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