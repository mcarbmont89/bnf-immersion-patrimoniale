import React from "react";

// Splits a transcription string with [keyword] markers into clickable tokens.
export default function TranscriptionView({ text, activeKeyword, onKeyword }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <p className="text-white/90 text-[15px] leading-relaxed">
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]$/);
        if (m) {
          const kw = m[1];
          const active = kw === activeKeyword;
          return (
            <button
              key={i}
              onClick={() => onKeyword(kw)}
              className={`underline decoration-2 underline-offset-2 font-medium transition-colors ${
                active ? "text-[#00C4AA]" : "text-[#00C4AA]/80 hover:text-[#00C4AA]"
              }`}
            >
              {kw}
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}