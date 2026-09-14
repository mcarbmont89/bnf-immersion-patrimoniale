import React, { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import SoundArchiveCard from "./SoundArchiveCard";
import SpaceNavigator from "./SpaceNavigator";

export default function ImmersiveView({ spaces, current, onSelect, onOpenMixer }) {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const reqIdRef = useRef(0);

  const space = spaces.find((s) => s.id === current);
  const total = spaces.length;
  const idx = spaces.findIndex((s) => s.id === current);
  const hasArchive = [4, 6].includes(current);

  // Generate the view whenever the selected space changes (and not cached).
  useEffect(() => {
    if (!space) return;
    if (cache[space.id]) return;

    const reqId = ++reqIdRef.current;
    setLoading(true);
    setError(null);
    base44.functions
      .invoke("generateImmersionView", { prompt: space.prompt })
      .then((res) => {
        if (reqId !== reqIdRef.current) return;
        const url = res?.data?.url;
        if (!url) throw new Error("Aucune image renvoyée");
        setCache((c) => ({ ...c, [space.id]: url }));
        setLoading(false);
      })
      .catch((err) => {
        if (reqId !== reqIdRef.current) return;
        setError(err?.message || "Erreur de génération");
        setLoading(false);
      });
  }, [space, cache]);

  const url = cache[current];
  const showArchive = hasArchive && url && !loading;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* image area */}
      <div className="relative flex-1 min-h-0 overflow-hidden rounded-xl bg-[#0D1117]">
        {url && !loading && (
          <Image
            src={url}
            alt={space?.name}
            className="w-full h-full"
            fittingType="fill"
          />
        )}

        {/* loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0D12]/85 backdrop-blur-sm">
            <div className="w-10 h-10 border-2 border-[#00C4AA]/30 border-t-[#00C4AA] rounded-full animate-spin" />
            <div className="mt-3 text-[#00C4AA] text-xs uppercase tracking-widest">
              Astra génère la vue…
            </div>
            <div className="mt-1 text-[#9CA3AF] text-xs">{space?.name}</div>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="text-red-400 text-sm">{error}</div>
            <button
              onClick={() => setCache((c) => ({ ...c }))}
              className="mt-3 text-xs text-[#00C4AA] underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* top-right controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="rounded-full bg-[#0A0D12]/70 px-2.5 py-1 text-xs font-mono text-white border border-white/10">
            {idx + 1} / {total}
          </span>
          <button
            onClick={() => setFullscreen((f) => !f)}
            className="inline-flex items-center gap-1 rounded-full bg-[#00C4AA] px-3 py-1 text-xs font-semibold text-[#0A0D12] hover:bg-[#00B099] transition-colors"
          >
            {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            Vista inmersiva
          </button>
        </div>

        {/* space name caption */}
        {url && !loading && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-[#0A0D12]/70 px-3 py-1.5 border border-white/10">
            <div className="text-[10px] uppercase tracking-widest text-[#00C4AA]">
              Point {space.id}
            </div>
            <div className="text-white text-sm font-medium">{space.name}</div>
          </div>
        )}
      </div>

      {/* bottom navigation */}
      <div className="mt-3 shrink-0">
        <SpaceNavigator spaces={spaces} current={current} onSelect={onSelect} />
        <div className="mt-2 text-[11px] italic text-[#9CA3AF]">
          Flechas: elige una vista · + para acercarte, arrastra para mirar · Recorrido fotográfico
        </div>
      </div>

      {/* sound archive card */}
      {showArchive && <SoundArchiveCard onOpenMixer={onOpenMixer} />}

      {/* fullscreen overlay */}
      {fullscreen && url && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <Image
            src={url}
            alt={space?.name}
            className="w-full h-full"
            fittingType="fit"
          />
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-[#00C4AA] px-3 py-1.5 text-xs font-semibold text-[#0A0D12]"
          >
            <Minimize2 size={14} /> Fermer
          </button>
          <div className="absolute bottom-4 left-4 text-white text-sm font-medium drop-shadow">
            {space.name}
          </div>
        </div>
      )}
    </div>
  );
}