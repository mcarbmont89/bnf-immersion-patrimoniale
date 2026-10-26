import React, { useState } from "react";
import FloorPlan from "@/components/immersion/FloorPlan";
import FloorPlanSorbonne from "@/components/immersion/FloorPlanSorbonne";
import ImmersiveView from "@/components/immersion/ImmersiveView";
import SpaceMaterials from "@/components/immersion/SpaceMaterials";
import Timeline from "@/components/immersion/Timeline";
import { SPACES, SORBONNE_SPACES } from "@/components/immersion/spaces";
import { RICHELIEU_TIMELINE, SORBONNE_TIMELINE } from "@/components/immersion/timeline";

export default function ImmersionTab({ onOpenMixer, carriedDoc }) {
  const [tour, setTour] = useState("richelieu");
  const spaces = tour === "sorbonne" ? SORBONNE_SPACES : SPACES;
  const [selected, setSelected] = useState(2); // default: Tables de lecture
  const current = spaces.find((s) => s.id === selected);
  const materialsQuery = current
    ? `${tour === "sorbonne" ? "Sorbonne" : "Bibliothèque nationale France"} ${current.name}`
    : "";
  const timelineEvents = (tour === "sorbonne" ? SORBONNE_TIMELINE : RICHELIEU_TIMELINE)[selected] || [];

  function switchTour(t) {
    if (t === tour) return;
    setTour(t);
    setSelected(t === "sorbonne" ? 1 : 2);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full min-h-0">
      {/* LEFT PANEL — 30% */}
      <aside className="lg:w-[30%] shrink-0 rounded-xl bg-[#0D1117] border border-white/10 p-4 flex flex-col">
        <div className="text-[11px] uppercase tracking-widest text-[#00C4AA] font-semibold">
          Par Dedans
        </div>
        <div className="flex gap-1.5 mt-1.5">
          <button
            onClick={() => switchTour("richelieu")}
            className="rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors"
            style={{ background: tour === "richelieu" ? "#00C4AA" : "#1F2937", color: tour === "richelieu" ? "#0A0D12" : "#9CA3AF" }}
          >
            Richelieu
          </button>
          <button
            onClick={() => switchTour("sorbonne")}
            className="rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors"
            style={{ background: tour === "sorbonne" ? "#00C4AA" : "#1F2937", color: tour === "sorbonne" ? "#0A0D12" : "#9CA3AF" }}
          >
            Sorbonne
          </button>
        </div>
        <div className="text-white text-sm font-medium mt-1.5">
          {tour === "sorbonne" ? "Sorbonne · Quartier Latin" : "Salle Ovale · Richelieu"}
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
          {tour === "sorbonne" ? (
            <FloorPlanSorbonne
              spaces={SORBONNE_SPACES}
              selectedId={selected}
              onSelect={setSelected}
            />
          ) : (
            <FloorPlan
              spaces={SPACES}
              selectedId={selected}
              onSelect={setSelected}
            />
          )}
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

        <div className="mt-2 flex-1 min-h-0 flex flex-col">
          <SpaceMaterials query={materialsQuery} />
        </div>
      </aside>

      {/* RIGHT PANEL — 70% */}
      <main className="lg:w-[70%] flex-1 min-w-0 flex flex-col min-h-0">
        <ImmersiveView
          spaces={spaces}
          current={selected}
          onSelect={setSelected}
          onOpenMixer={onOpenMixer}
          archiveIds={tour === "richelieu" ? [4, 6] : []}
          tour={tour}
        />
        <div className="mt-3 shrink-0">
          <Timeline events={timelineEvents} spaceName={current?.name} />
        </div>
      </main>
    </div>
  );
}