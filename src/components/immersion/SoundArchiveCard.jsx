import React from "react";
import { Volume2, ArrowRight } from "lucide-react";
import { SOUND_ARCHIVE } from "./spaces";

export default function SoundArchiveCard({ onOpenMixer }) {
  return (
    <div className="mt-4 rounded-xl border-2 border-[#00C4AA]/70 bg-[#0D1117] p-4">
      <div className="flex items-center gap-2 text-[#00C4AA] text-xs font-semibold uppercase tracking-wider">
        <Volume2 size={14} />
        Archive sonore associée
      </div>
      <div className="mt-2 text-white text-sm font-medium leading-snug">
        {SOUND_ARCHIVE.titre}
      </div>
      <div className="mt-1 text-[#9CA3AF] text-xs font-mono">
        Fonds : {SOUND_ARCHIVE.fonds}
      </div>
      <button
        onClick={onOpenMixer}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#00C4AA] px-3 py-1.5 text-xs font-semibold text-[#0A0D12] hover:bg-[#00B099] transition-colors"
      >
        → Ouvrir dans le Mixeur 3D
        <ArrowRight size={12} />
      </button>
    </div>
  );
}