import React from "react";
import Waveform from "./Waveform";

export default function StemCard({ stem, onChange }) {
  function setAz(v) {
    onChange({ ...stem, az: v });
  }
  function setDist(v) {
    const dist = Math.max(0.5, Math.min(5, v));
    // farther = slightly lower volume
    const volume = Math.round(Math.max(20, stem.volume + (stem.dist - dist) * 5));
    onChange({ ...stem, dist, volume });
  }
  function setVolume(v) {
    onChange({ ...stem, volume: v });
  }

  return (
    <div className="rounded-xl bg-[#111827] border border-white/10 p-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white text-sm font-medium">{stem.name}</div>
          {stem.subtitle && (
            <div className="text-[#9CA3AF] text-xs">{stem.subtitle}</div>
          )}
        </div>
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: stem.color }}
        />
      </div>

      <div className="mt-3">
        <Waveform color={stem.color} shape={stem.shape} seed={stem.id.charCodeAt(0)} volume={stem.volume} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <label className="flex flex-col gap-1">
          <span className="text-[#9CA3AF]">Azimuth</span>
          <input
            type="range"
            min={-180}
            max={180}
            value={stem.az}
            onChange={(e) => setAz(Number(e.target.value))}
            className="accent-[#00C4AA]"
          />
          <span className="font-mono text-white">AZ {stem.az}°</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[#9CA3AF]">Distance</span>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={stem.dist}
            onChange={(e) => setDist(Number(e.target.value))}
            className="accent-[#00C4AA]"
          />
          <span className="font-mono text-white">{stem.dist.toFixed(1)} M</span>
        </label>
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs">
        <span className="text-[#9CA3AF] w-16">Volume</span>
        <input
          type="range"
          min={0}
          max={100}
          value={stem.volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-[#00C4AA]"
        />
        <span className="font-mono text-white w-10 text-right">{stem.volume}%</span>
      </label>
    </div>
  );
}