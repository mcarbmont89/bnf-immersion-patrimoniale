import React, { useState } from "react";
import FloorPlan from "@/components/immersion/FloorPlan";
import ImmersiveView from "@/components/immersion/ImmersiveView";
import { SPACES } from "@/components/immersion/spaces";

export default function ImmersionTab({ onOpenMixer, carriedDoc }) {
  const [selected, setSelected] = useState(2); // default: Tables de lecture
  const current = SPACES.find((s) => s.id === selected);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
      {/* LEFT PANEL — 30% */}
      <aside className="lg:w-[30%] shrink-0 rounded-xl bg-[#0D1117] border border-white/10 p-4 flex flex-col">
        <div className="text-[11px] uppercase tracking-widest text-[#00C4AA] font-semibold">
          Par Dedans
        </div>
        <div className="text-white text-sm font-medium mt-0.5">
          Salle Ovale · Richelieu
        </div>

        {carriedDoc && carriedDoc.target === "immersion" && (
          <div className="mt-3 rounded-lg bg-[#00C4AA]/10 border border-[#00C4AA]/40 p-3">
            <div className="text-[#00C4AA] text-[10px] uppercase tracking-widest mb-1">
              Extrait sonore apporté · Gallica
            </div>
            <div className="text-white text-[13px] font-medium leading-snug line-clamp-2">
              {carriedDoc.label}
            </div>
            <div className="text-[#9CA3AF] text-[10px] font-mono mt-0.5 truncate">
              {carriedDoc.metadata}
            </div>
            <p className="text-[#9CA3AF] text-[11px] mt-2">
              Disponible pour l'alcôve sonore de cet espace.
            </p>
          </div>
        )}

        <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
          <FloorPlan
            spaces={SPACES}
            selectedId={selected}
            onSelect={setSelected}
          />
        </div>

        <div className="mt-3 text-[13px] text-[#9CA3AF]">
          Estás aquí: <span className="text-white">{current?.name}</span>
        </div>
        <div className="text-[12px] text-[#9CA3AF]">
          Toca un punto para ir a esa vista.
        </div>
        <div className="mt-1 text-[10px] text-[#9CA3AF]/70">
          Distribución de día · esquema orientativo.
        </div>
      </aside>

      {/* RIGHT PANEL — 70% */}
      <main className="lg:w-[70%] flex-1 min-w-0 flex flex-col min-h-0">
        <ImmersiveView
          spaces={SPACES}
          current={selected}
          onSelect={setSelected}
          onOpenMixer={onOpenMixer}
        />
      </main>
    </div>
  );
}