import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { buildSceneSpec, TOURS } from "./sceneSpec";
import { SpatialSounds } from "./spatialSounds";
import { loadAFrame, createXRScene } from "./xrScene";

// Immersive viewer: builds a WebXR (VR/AR) scene from a scene spec, with positional audio.
export default function XRViewer({ tour = "richelieu", spaceId, onSpaceChange }) {
  const tourKey = TOURS[tour] ? tour : "richelieu";
  const spaces = TOURS[tourKey].spaces;
  const [current, setCurrent] = useState(spaceId && spaces.some((s) => s.id === spaceId) ? spaceId : spaces[0].id);
  const spec = useMemo(() => buildSceneSpec(tourKey, current), [tourKey, current]);

  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const soundsRef = useRef(new SpatialSounds());
  const imagesRef = useRef({});
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [audioOn, setAudioOn] = useState(false);
  const [muted, setMuted] = useState(false);
  const [mode, setMode] = useState("pano");
  const [generating, setGenerating] = useState(false);
  const [info, setInfo] = useState(null);

  const goTo = useCallback((id) => {
    setInfo(null);
    setCurrent(id);
    onSpaceChange && onSpaceChange(id);
  }, [onSpaceChange]);

  // Create the scene once.
  useEffect(() => {
    let cancelled = false;
    loadAFrame()
      .then((AFRAME) => {
        if (cancelled || !hostRef.current) return;
        sceneRef.current = createXRScene(AFRAME, hostRef.current, {
          onHotspot: (h) => {
            if (h.type === "nav") goTo(h.target);
            else {
              setInfo(h);
              sceneRef.current && sceneRef.current.showInfo(h);
            }
          }
        });
        setReady(true);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
      soundsRef.current.stop();
      sceneRef.current && sceneRef.current.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Rebuild the world when the space changes.
  useEffect(() => {
    if (!ready || !sceneRef.current) return;
    sceneRef.current.setWorld(spec, imagesRef.current[`${current}:${mode}`] || null);
    if (audioOn) {
      soundsRef.current.start(spec.sounds).then(() => {
        sceneRef.current && sceneRef.current.attachSounds(soundsRef.current);
      });
    }
  }, [ready, spec]);

  async function startAudio() {
    await soundsRef.current.start(spec.sounds);
    sceneRef.current.attachSounds(soundsRef.current);
    setAudioOn(true);
  }

  function toggleMute() {
    const m = !muted;
    setMuted(m);
    soundsRef.current.setMuted(m);
  }

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("generateImmersionPanorama", { prompt: spec.space.prompt, mode });
      const src = res?.data?.dataUrl || res?.data?.url;
      if (!src) throw new Error("Aucune image renvoyée");
      const img = await new Promise((resolve, reject) => {
        const i = new window.Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Image illisible"));
        i.src = src;
      });
      const entry = { src, aspect: img.width / img.height, mode };
      imagesRef.current[`${current}:${mode}`] = entry;
      sceneRef.current.setWorld(spec, entry);
      if (audioOn) sceneRef.current.attachSounds(soundsRef.current);
    } catch (e) {
      setError(e.message || "Erreur de génération");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden bg-[#0A0D12]">
      <div ref={hostRef} className="absolute inset-0" data-testid="xr-host" />

      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center gap-2 pointer-events-none">
        <select
          value={current}
          onChange={(e) => goTo(Number(e.target.value))}
          className="pointer-events-auto rounded-full bg-[#0A0D12]/80 border border-white/15 text-white text-xs px-3 py-1.5"
          aria-label="Espace"
        >
          {spaces.map((s) => (
            <option key={s.id} value={s.id}>{s.id}. {s.name}</option>
          ))}
        </select>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="pointer-events-auto rounded-full bg-[#0A0D12]/80 border border-white/15 text-white text-xs px-3 py-1.5"
          aria-label="Type de décor"
        >
          <option value="pano">Panorama 360°</option>
          <option value="flat">Image plane</option>
        </select>
        <button
          onClick={generate}
          disabled={!ready || generating}
          className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-[#00C4AA] px-3 py-1.5 text-xs font-semibold text-[#0A0D12] disabled:opacity-50"
        >
          <Sparkles size={12} /> {generating ? "Génération…" : "Générer le décor (IA)"}
        </button>
        {!audioOn ? (
          <button
            onClick={startAudio}
            disabled={!ready}
            className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-[#1F2937] border border-[#00C4AA]/50 px-3 py-1.5 text-xs text-[#00C4AA] disabled:opacity-50"
          >
            <Volume2 size={12} /> Activer le son spatial
          </button>
        ) : (
          <button
            onClick={toggleMute}
            className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-[#1F2937] border border-white/15 px-3 py-1.5 text-xs text-white"
          >
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />} {muted ? "Son coupé" : "Son actif"}
          </button>
        )}
        <button
          id="q-ar"
          className="pointer-events-auto rounded-full bg-[#1F2937] border border-white/15 px-3 py-1.5 text-xs text-white"
        >
          Entrer en AR
        </button>
      </div>

      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-[#00C4AA] text-xs uppercase tracking-widest">
          Chargement de la scène…
        </div>
      )}
      {error && (
        <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-red-950/80 border border-red-500/40 px-3 py-2 text-xs text-red-200">
          {error}
        </div>
      )}
      <div className="absolute bottom-3 left-3 rounded-lg bg-[#0A0D12]/70 px-3 py-1.5 border border-white/10 pointer-events-none">
        <div className="text-[10px] uppercase tracking-widest text-[#00C4AA]">Reconstruction illustrative générée par IA</div>
        <div className="text-white text-sm font-medium">{spec.space.name}</div>
        {info && <div className="text-[#9CA3AF] text-xs mt-1 max-w-xs">{info.label}</div>}
      </div>
    </div>
  );
}
