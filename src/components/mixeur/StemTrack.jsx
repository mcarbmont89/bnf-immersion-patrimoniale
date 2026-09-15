import React from "react";

const ARIAL = { fontFamily: "Arial, sans-serif" };

function StemIcon({ type, color }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "mic") {
    return (
      <svg {...common}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    );
  }
  if (type === "wind") {
    return (
      <svg {...common}>
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
        <path d="M17.73 2.27A2.5 2.5 0 1 1 19.5 7H2" />
        <path d="M14.83 21.41A2 2 0 1 0 16.24 18H2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function PlayIcon({ color }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill={color}><polygon points="6 4 20 12 6 20 6 4" /></svg>;
}
function PauseIcon({ color }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill={color}><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>;
}
function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

export default function StemTrack({ stem, onVolumeChange, onPlayToggle, playing }) {
  return (
    <div className="rounded-xl bg-[#111827] p-4 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: stem.color }} />
      {/* Row 1: icon + name + play + AZ badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <StemIcon type={stem.icon} color={stem.color} />
          <div className="min-w-0">
            <div className="text-white text-xs font-bold truncate" style={ARIAL}>{stem.name}</div>
            {stem.subtitle && (
              <div className="text-[#9CA3AF] text-[10px] truncate" style={ARIAL}>{stem.subtitle}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPlayToggle}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            style={{ color: stem.color }}
          >
            {playing ? <PauseIcon color={stem.color} /> : <PlayIcon color={stem.color} />}
          </button>
          <span className="text-[#9CA3AF] text-[10px] font-mono">
            AZ {stem.az}° · {stem.dist.toFixed(1)}M
          </span>
        </div>
      </div>

      {/* Row 2: 45-bar waveform */}
      <div className="mt-3 flex items-end gap-[2px] h-12">
        {(stem.waveform || []).map((b, i) => (
          <div
            key={i}
            className="w-[2px] rounded-sm"
            style={{ height: `${Math.max(4, b * (stem.volume / 100) * 100)}%`, backgroundColor: stem.color }}
          />
        ))}
      </div>

      {/* Row 3: speaker + volume slider + percentage */}
      <div className="mt-3 flex items-center gap-2">
        <SpeakerIcon />
        <input
          type="range"
          min={0}
          max={100}
          value={stem.volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: stem.color }}
        />
        <span className="text-white text-[10px] font-mono w-10 text-right">{stem.volume}%</span>
      </div>
    </div>
  );
}