import React, { useState, useRef, useEffect } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { encodeWAV } from "@/lib/wavEncoder";
import ControlesAudio from "@/components/studio/ControlesAudio";
import CarteSpatialisation from "@/components/studio/CarteSpatialisation";
import Chronologie from "@/components/studio/Chronologie";

const ARIAL = { fontFamily: "Arial, sans-serif" };

export default function Studio() {
  const [subtab, setSubtab] = useState("controles");
  const [sources, setSources] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [maxDuration, setMaxDuration] = useState(30);
  const [trajectory, setTrajectory] = useState("cercle");

  const [converting, setConverting] = useState(false);
  const [binauralBuffer, setBinauralBuffer] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [previewMode, setPreviewMode] = useState(null);
  const previewRef = useRef(null);

  function stopPreview() {
    if (previewRef.current) {
      try { previewRef.current.stop(); } catch (e) {}
      try { previewRef.current.disconnect(); } catch (e) {}
      previewRef.current = null;
    }
    setPreviewMode(null);
  }

  useEffect(() => {
    return () => {
      audioEngine.clear();
      stopPreview();
    };
  }, []);

  const selected = sources.find((s) => s.id === selectedId) || null;

  function playBuffer(buffer, mode) {
    stopPreview();
    const ctx = audioEngine.ensureContext();
    if (ctx.state === "suspended") ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = false;
    src.connect(ctx.destination);
    src.onended = () => {
      if (previewRef.current === src) {
        previewRef.current = null;
        setPreviewMode(null);
      }
    };
    src.start(0);
    previewRef.current = src;
    setPreviewMode(mode);
  }

  async function addFiles(fileList) {
    const files = Array.from(fileList);
    if (!files.length) return;
    const created = [];
    for (const file of files) {
      try {
        const ab = await file.arrayBuffer();
        const buf = await audioEngine.loadFromArrayBuffer(ab);
        created.push({
          id: `s${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          buffer: buf,
          az: 0, el: 0, dist: 2, volume: 80,
          startTime: 0, trim: null
        });
      } catch (e) { /* skip undecodable file */ }
    }
    if (created.length > 1) {
      created.forEach((s, i) => {
        s.az = Math.round((i / created.length) * 360 - 180);
        s.dist = 2;
      });
    }
    setSources((prev) => [...prev, ...created]);
    if (!selectedId && created[0]) setSelectedId(created[0].id);
  }

  function createTestAudio() {
    const ctx = audioEngine.ensureContext();
    const sr = ctx.sampleRate;
    const len = Math.floor(3 * sr);
    const buf = ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        const env = Math.min(1, t * 5) * Math.min(1, (3 - t) * 2);
        const freq = 220 + 660 * (t / 3);
        const wobble = ch === 0 ? 1 : 1.01;
        data[i] = Math.sin(2 * Math.PI * freq * wobble * t) * 0.25 * env;
      }
    }
    const src = {
      id: `s${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: "audio-test-3s.wav",
      buffer: buf,
      az: 0, el: 0, dist: 2, volume: 80,
      startTime: 0, trim: null
    };
    setSources((prev) => [...prev, src]);
    if (!selectedId) setSelectedId(src.id);
  }

  function updateSource(id, patch) {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function selectSource(id) {
    setSelectedId(id);
  }

  async function convertBinaural() {
    if (!selected) return;
    stopPreview();
    setConverting(true);
    try {
      const rendered = await audioEngine.renderTimeline(
        [{ ...selected, startTime: 0, trim: selected.buffer.duration }],
        selected.buffer.duration
      );
      setBinauralBuffer(rendered);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(URL.createObjectURL(encodeWAV(rendered)));
    } catch (e) {
      /* ignore */
    } finally {
      setConverting(false);
    }
  }

  function resetPosition() {
    if (!selected) return;
    updateSource(selectedId, { az: 0, el: 0, dist: 1 });
  }

  const subtabs = [
    { id: "controles", label: "Contrôles audio" },
    { id: "carte", label: "Carte de spatialisation" },
    { id: "chrono", label: "Chronologie" }
  ];

  return (
    <div className="h-full flex flex-col gap-3">
      <div>
        <h1 className="text-white text-[28px] font-bold leading-tight" style={ARIAL}>
          Binaural 3D Audio Studio
        </h1>
        <p className="text-[#9CA3AF] text-[13px] mt-0.5" style={ARIAL}>
          Transformez vos audio en expériences spatiales immersives
        </p>
      </div>

      <div className="flex gap-2">
        {subtabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubtab(t.id)}
            className="rounded-full px-4 py-1.5 text-xs font-bold transition-colors"
            style={{
              ...ARIAL,
              background: subtab === t.id ? "#FFFFFF" : "transparent",
              color: subtab === t.id ? "#0A0D12" : "#9CA3AF"
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        {subtab === "controles" && (
          <ControlesAudio
            sources={sources}
            selected={selected}
            onSelect={selectSource}
            onAddFiles={addFiles}
            onCreateTest={createTestAudio}
            onUpdate={updateSource}
            onConvert={convertBinaural}
            onReset={resetPosition}
            converting={converting}
            binauralBuffer={binauralBuffer}
            downloadUrl={downloadUrl}
            previewMode={previewMode}
            onPlayOriginal={() => selected && playBuffer(selected.buffer, "original")}
            onPlayBinaural={() => binauralBuffer && playBuffer(binauralBuffer, "binaural")}
            onStop={stopPreview}
          />
        )}
        {subtab === "carte" && (
          <CarteSpatialisation
            sources={sources}
            selectedId={selectedId}
            onSelect={selectSource}
            onUpdate={updateSource}
            trajectory={trajectory}
            setTrajectory={setTrajectory}
            goToControles={() => setSubtab("controles")}
          />
        )}
        {subtab === "chrono" && (
          <Chronologie
            sources={sources}
            maxDuration={maxDuration}
            setMaxDuration={setMaxDuration}
            onUpdate={updateSource}
            goToControles={() => setSubtab("controles")}
          />
        )}
      </div>
    </div>
  );
}