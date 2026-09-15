import React, { useState } from "react";

const ARIAL = { fontFamily: "Arial, sans-serif" };

// Interactive timeline of historical events related to the selected space.
export default function Timeline({ events, spaceName }) {
  const [active, setActive] = useState(0);

  if (!events || events.length === 0) {
    return (
      <div className="text-[#9CA3AF] text-[11px] italic" style={ARIAL}>
        Aucun événement historique pour cet espace.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#0D1117] border border-white/10 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#00C4AA] text-[10px] uppercase tracking-widest font-semibold" style={ARIAL}>
          Ligne du temps
        </span>
        <span className="text-white text-[12px] font-medium" style={ARIAL}>{spaceName}</span>
      </div>

      {/* horizontal track */}
      <div className="relative flex items-center justify-between px-2 pb-1">
        <div className="absolute left-2 right-2 top-1/2 h-px bg-white/15" />
        {events.map((e, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative z-10 flex flex-col items-center"
            title={e.title}
          >
            <span
              className={`block rounded-full border-2 transition-all ${
                i === active
                  ? "w-4 h-4 bg-[#00C4AA] border-[#00C4AA] scale-110"
                  : "w-3 h-3 bg-[#0D1117] border-[#00C4AA]/50 hover:border-[#00C4AA]"
              }`}
            />
            <span
              className={`mt-1 text-[10px] font-mono ${
                i === active ? "text-[#00C4AA]" : "text-[#9CA3AF]"
              }`}
              style={ARIAL}
            >
              {e.year}
            </span>
          </button>
        ))}
      </div>

      {/* active event detail */}
      <div className="mt-2 rounded-lg bg-[#111827] border border-white/10 p-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[#00C4AA] text-sm font-mono font-bold" style={ARIAL}>
            {events[active].year}
          </span>
          <span className="text-white text-[13px] font-semibold" style={ARIAL}>
            {events[active].title}
          </span>
        </div>
        <p className="mt-1 text-[#9CA3AF] text-[12px] leading-snug" style={ARIAL}>
          {events[active].description}
        </p>
      </div>
    </div>
  );
}