import React, { useMemo } from "react";

// Deterministic 45-bar waveform heights shaped by the stem's "shape".
function buildBars(shape, seed) {
  const out = [];
  for (let i = 0; i < 45; i++) {
    const r = Math.abs(Math.sin((i + seed) * 1.7));
    let h;
    switch (shape) {
      case "dense-middle":
        h = 0.3 + 0.7 * Math.sin((i / 44) * Math.PI) * (0.5 + r * 0.5);
        break;
      case "uniform":
        h = 0.22 + r * 0.22;
        break;
      case "sharp-peaks":
        h = r > 0.82 ? 0.95 : r * 0.4;
        break;
      case "rhythmic":
        h = 0.3 + 0.5 * Math.abs(Math.sin(i / 3));
        break;
      case "low":
        h = 0.1 + r * 0.14;
        break;
      case "flowing":
        h = 0.25 + 0.4 * Math.sin(i / 4) + 0.2 * r;
        break;
      default:
        h = 0.3 + r * 0.4;
    }
    out.push(Math.max(0.06, Math.min(1, h)));
  }
  return out;
}

export default function Waveform({ color, shape, seed = 3, volume = 80 }) {
  const bars = useMemo(() => buildBars(shape, seed), [shape, seed]);
  const scale = volume / 100;
  return (
    <div className="flex items-end gap-[2px] h-12">
      {bars.map((b, i) => (
        <div
          key={i}
          style={{ height: `${b * scale * 100}%`, backgroundColor: color }}
          className="w-[3px] rounded-sm"
        />
      ))}
    </div>
  );
}