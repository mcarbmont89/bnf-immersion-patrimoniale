import React, { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, Plus, Minus, Glasses } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import SoundArchiveCard from "./SoundArchiveCard";
import SpaceNavigator from "./SpaceNavigator";

// "+" markers spread across the image; each zooms into its own region.
const ZOOM_POINTS = [
  { x: 20, y: 25 },
  { x: 80, y: 30 },
  { x: 50, y: 55 },
  { x: 25, y: 78 },
  { x: 82, y: 75 }
];

export default function ImmersiveView({ spaces, current, onSelect, onOpenMixer, archiveIds, tour = "richelieu" }) {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState("center center");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [showPoints, setShowPoints] = useState(false);
  const dragStart = useRef(null);
  const reqIdRef = useRef(0);

  // Reset zoom/pan when the selected space changes.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setZoomOrigin("center center");
    setShowPoints(false);
  }, [current]);

  function zoomTo(origin) {
    if (zoom > 1 && zoomOrigin === origin) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2);
      setZoomOrigin(origin);
      setPan({ x: 0, y: 0 });
    }
  }
  function resetZoom() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }
  function onPointerDown(e) {
    if (zoom <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }
  function onPointerMove(e) {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  }
  function onPointerUp() {
    setDragging(false);
  }

  const space = spaces.find((s) => s.id === current);
  const total = spaces.length;
  const idx = spaces.findIndex((s) => s.id === current);
  const hasArchive = (archiveIds || [4, 6]).includes(current);

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
          <div
            className="w-full h-full select-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: zoomOrigin,
              cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
              transition: dragging ? "none" : "transform 0.2s ease-out"
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <Image
              src={url}
              alt={space?.name}
              className="w-full h-full pointer-events-none"
              fittingType="fill"
            />
          </div>
        )}

        {/* toggle to reveal the zoom markers */}
        {url && !loading && zoom <= 1 && (
          <button
            onClick={() => setShowPoints((s) => !s)}
            className="absolute bottom-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0A0D12]/70 border border-[#00C4AA]/50 text-[#00C4AA] hover:bg-[#00C4AA] hover:text-[#0A0D12] transition-colors"
            title={showPoints ? "Masquer les points" : "Afficher les points de zoom"}
          >
            <Plus size={16} />
          </button>
        )}

        {/* zoom markers spread across the image — shown only when toggled on */}
        {url && !loading && zoom <= 1 && showPoints && (
          <>
            {ZOOM_POINTS.map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  zoomTo(`${p.x}% ${p.y}%`);
                  setShowPoints(false);
                }}
                className="absolute inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0A0D12]/70 border border-[#00C4AA]/50 text-[#00C4AA] hover:bg-[#00C4AA] hover:text-[#0A0D12] transition-colors"
                style={{ left: `calc(${p.x}% - 16px)`, top: `calc(${p.y}% - 16px)` }}
                title="Acercarse"
              >
                <Plus size={16} />
              </button>
            ))}
          </>
        )}
        {url && !loading && zoom > 1 && (
          <button
            onClick={resetZoom}
            className="absolute bottom-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0A0D12]/70 border border-white/20 text-white hover:bg-[#00C4AA] hover:text-[#0A0D12] transition-colors"
            title="Alejarse"
          >
            <Minus size={16} />
          </button>
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
          <Link
            to={`/xr?tour=${tour}&space=${current}`}
            className="inline-flex items-center gap-1 rounded-full bg-[#0A0D12]/70 px-3 py-1 text-xs font-semibold text-[#00C4AA] border border-[#00C4AA]/50 hover:bg-[#00C4AA] hover:text-[#0A0D12] transition-colors"
          >
            <Glasses size={12} /> Voir en VR
          </Link>
          <button
            onClick={() => setFullscreen((f) => !f)}
            className="inline-flex items-center gap-1 rounded-full bg-[#00C4AA] px-3 py-1 text-xs font-semibold text-[#0A0D12] hover:bg-[#00B099] transition-colors"
          >
            {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            Vue immersive
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
          Flèches : choisissez une vue · + pour vous rapprocher, glissez pour regarder · Parcours photographique
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