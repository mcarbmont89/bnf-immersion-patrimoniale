import React from "react";
import { MIX_FONDS } from "@/components/mixeur/fonds";

const ARIAL = { fontFamily: "Arial, sans-serif" };

export default function FondSelector({ fondId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MIX_FONDS.map((f) => {
        const active = f.id === fondId;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`rounded-full px-4 py-2 text-left transition-colors ${
              active
                ? "bg-[#00C4AA] text-[#0A0D12] font-bold"
                : "bg-transparent border border-[#374151] text-[#9CA3AF] hover:text-white"
            }`}
            style={ARIAL}
          >
            <div className="text-[13px] leading-tight">{f.title}</div>
            <div className={`text-[10px] mt-0.5 ${active ? "text-[#0A0D12]/70" : "text-[#9CA3AF]/70"}`}>
              Fonds {f.id}
            </div>
          </button>
        );
      })}
    </div>
  );
}