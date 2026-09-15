import React, { useState, useRef } from "react";
import { MIX_FONDS } from "@/components/mixeur/fonds";
import FondSelector from "@/components/mixeur/FondSelector";
import SourceFileCard from "@/components/mixeur/SourceFileCard";
import GallicaAudioSearch from "@/components/mixeur/GallicaAudioSearch";
import StemTrack from "@/components/mixeur/StemTrack";
import SpatialMap3D from "@/components/mixeur/SpatialMap3D";
import { audioEngine } from "@/lib/audioEngine";
import { encodeWAV } from "@/lib/wavEncoder";
import { separateCenterChannel } from "@/lib/stemSeparator";

const ARIAL = { fontFamily: "Arial, sans-serif" };

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C4AA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

export default function Mixeur() {
  const [fondId, setFondId] = useState(MIX_FONDS[0].id);
  const fond = MIX_FONDS.find((f) => f.id === fondId);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioMeta, setAudioMeta] = useState(null);
  const [separated, setSeparated] = useState(false);
  const [separating, setSeparating] = useState(false);
  const [sepStatus, setSepStatus] = useState("");
  const [stems, setStems] = useState([]);
  const [mixing, setMixing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [showHeadphoneBanner, setShowHeadphoneBanner] = useState(false);
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState(0);
  const fondFileRef = useRef(null);

  async function loadFromArrayBuffer(ab, meta, blob) {
    try {
      setLoadError("");
      const buf = await audioEngine.loadFromArrayBuffer(ab);
      setAudioBuffer(buf);
      setAudioBlob(blob || new Blob([ab]));
      setAudioMeta(meta);
      setSeparated(false);
      setStems([]);
      audioEngine.clear();
      setDownloadUrl(null);
    } catch (e) {
      setLoadError("Format audio non décodable par le navigateur.");
    }
  }

  async function loadFromFile(file, meta) {
    const ab = await file.arrayBuffer();
    await loadFromArrayBuffer(ab, meta, file);
  }

  function selectFond(id) {
    setFondId(id);
    setSeparated(false);
    setStems([]);
    audioEngine.clear();
    setDownloadUrl(null);
    fondFileRef.current?.click();
  }

  async function onFondFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const f = MIX_FONDS.find((x) => x.id === fondId);
    await loadFromFile(file, { label: f.title, source: f.source });
    e.target.value = "";
  }

  async function separate() {
    if (!audioBuffer) return;
    setSeparating(true);
    setSepStatus("Séparation par canal central…");
    setLoadError("");
    setNotice("");
    setProgress(0);
    const t0 = Date.now();
    const iv = setInterval(() => {
      setProgress(Math.min(100, ((Date.now() - t0) / 1500) * 100));
    }, 40);
    try {
      await audioEngine.resume();
      const { vocals, instrumental, isMono } = separateCenterChannel(audioBuffer);
      const elapsed = Date.now() - t0;
      if (elapsed < 1500) await new Promise((r) => setTimeout(r, 1500 - elapsed));
      clearInterval(iv);
      setProgress(100);
      audioEngine.clear();
      const buffers = { vocals, instrumental };
      const built = [];
      for (const s of fond.stems) {
        const buf = buffers[s.source] || vocals;
        const waveform = audioEngine.computeWaveform(buf, 45);
        audioEngine.createStem(s.id, buf, s.volume);
        audioEngine.setPosition(s.id, s.az, 0, s.dist);
        built.push({ ...s, buffer: buf, waveform, playing: false });
      }
      setStems(built);
      setSeparated(true);
      if (isMono) {
        setNotice("Audio mono : la séparation par canal central nécessite un fichier stéréo. La piste instrumentale est silencieuse.");
      }
    } catch (e) {
      setLoadError("Échec de la séparation : " + (e.message || "erreur inconnue"));
    } finally {
      clearInterval(iv);
      setSeparating(false);
      setSepStatus("");
    }
  }

  function onVolumeChange(stemId, vol) {
    setStems((prev) => prev.map((s) => (s.id === stemId ? { ...s, volume: vol } : s)));
    audioEngine.setVolume(stemId, vol);
  }

  function onPositionChange(stemId, { az, dist }) {
    setStems((prev) => prev.map((s) => (s.id === stemId ? { ...s, az, dist } : s)));
    audioEngine.setPosition(stemId, az, 0, dist);
  }

  function onPlayToggle(stemId) {
    if (audioEngine.isPlaying(stemId)) {
      audioEngine.stop(stemId);
      setStems((prev) => prev.map((s) => (s.id === stemId ? { ...s, playing: false } : s)));
    } else {
      audioEngine.resume().then(() => {
        audioEngine.play(stemId);
        setShowHeadphoneBanner(true);
        setStems((prev) => prev.map((s) => (s.id === stemId ? { ...s, playing: true } : s)));
      });
    }
  }

  function playAll() {
    audioEngine.resume().then(() => {
      audioEngine.playAll();
      setShowHeadphoneBanner(true);
      setStems((prev) => prev.map((s) => ({ ...s, playing: true })));
    });
  }

  function stopAll() {
    audioEngine.stopAll();
    setStems((prev) => prev.map((s) => ({ ...s, playing: false })));
  }

  async function exportMix() {
    if (stems.length === 0) return;
    setMixing(true);
    setDownloadUrl(null);
    try {
      const stemsConfig = stems.map((s) => ({
        buffer: s.buffer,
        az: s.az,
        dist: s.dist,
        volume: s.volume
      }));
      const rendered = await audioEngine.renderMix(stemsConfig, stemsConfig[0].buffer.duration);
      const blob = encodeWAV(rendered);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (e) {
      setLoadError("Échec de la conversion binaurale.");
    } finally {
      setMixing(false);
    }
  }

  const anyPlaying = stems.some((s) => s.playing);

  return (
    <div className="h-full flex flex-col gap-3 overflow-auto">
      {/* page header */}
      <div>
        <h1 className="text-white text-[28px] font-bold leading-tight" style={ARIAL}>Mixeur 3D Éducatif</h1>
        <p className="text-[#9CA3AF] text-[13px] mt-0.5" style={ARIAL}>
          Séparez une oeuvre sonore en pistes distinctes, puis placez chaque élément dans l'espace pour une écoute immersive, idéale pour la médiation culturelle.
        </p>
      </div>

      {/* source loader: Gallica search + local import */}
      <GallicaAudioSearch
        onAudioArrayBuffer={(ab, meta) => loadFromArrayBuffer(ab, meta)}
        onLocalFile={(file, meta) => loadFromFile(file, meta)}
        disabled={separating || mixing}
      />

      {/* fond selector (pill tabs) */}
      <FondSelector fondId={fondId} onSelect={selectFond} />
      <input ref={fondFileRef} type="file" accept=".wav,.mp3,.ogg,.flac,audio/*" className="hidden" onChange={onFondFile} />

      {/* source file card */}
      <SourceFileCard audioMeta={audioMeta} separated={separated} separating={separating} onSeparate={separate} />

      {separating && (
        <div className="rounded-lg bg-[#00C4AA]/10 border border-[#00C4AA]/30 px-3 py-3 flex flex-col gap-2" style={ARIAL}>
          <div className="flex items-center justify-between text-[#00C4AA] text-xs">
            <span>{sepStatus || "Séparation en cours…"}</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-[#0A0D12] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00C4AA] rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {notice && (
        <div className="rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#FCD34D] text-xs px-3 py-2" style={ARIAL}>
          {notice}
        </div>
      )}

      {loadError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs px-3 py-2" style={ARIAL}>
          {loadError}
        </div>
      )}

      {/* headphone reminder */}
      {showHeadphoneBanner && (
        <div className="rounded-lg bg-[#1C1200] border-l-4 border-[#F59E0B] px-3 py-2 flex items-center gap-2">
          <span className="text-[#F59E0B] text-xs" style={ARIAL}>
            Utilisez un casque audio pour une spatialisation binaurale correcte.
          </span>
          <button onClick={() => setShowHeadphoneBanner(false)} className="ml-auto text-[#9CA3AF] text-xs hover:text-white" style={ARIAL}>
            Fermer
          </button>
        </div>
      )}

      {/* empty state or stems + map */}
      {!separated ? (
        <div className="rounded-xl bg-[#111827] p-10 text-center text-[#9CA3AF] text-sm" style={ARIAL}>
          {audioBuffer
            ? "Lancez la séparation par canal central pour isoler la voix de l'instrumental, puis spatialisez chaque piste."
            : "Chargez un fichier audio (Gallica ou local) pour commencer la séparation des pistes."}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-4">
          {/* left column: stem tracks */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MicIcon />
              <span className="text-white text-[13px] font-bold" style={ARIAL}>Séparateur de Pistes (Canal Central)</span>
            </div>
            {stems.map((s) => (
              <StemTrack
                key={s.id}
                stem={s}
                onVolumeChange={(v) => onVolumeChange(s.id, v)}
                onPlayToggle={() => onPlayToggle(s.id)}
                playing={s.playing}
              />
            ))}
            {/* mix + export controls */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {anyPlaying ? (
                <button
                  onClick={stopAll}
                  className="rounded bg-[#374151] text-white text-xs font-bold px-4 py-2 hover:bg-[#4B5563] transition-colors"
                  style={ARIAL}
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={playAll}
                  className="rounded bg-[#00C4AA] text-[#0A0D12] text-xs font-bold px-4 py-2 hover:bg-[#00B099] transition-colors"
                  style={ARIAL}
                >
                  Mixer toutes les pistes
                </button>
              )}
              <button
                onClick={exportMix}
                disabled={mixing}
                className="rounded bg-[#374151] text-white text-xs font-bold px-4 py-2 hover:bg-[#4B5563] transition-colors disabled:opacity-50"
                style={ARIAL}
              >
                {mixing ? "Rendu binaural…" : "Exporter le mix binaural (WAV)"}
              </button>
            </div>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download="mix-binaural.wav"
                className="inline-flex items-center gap-2 rounded bg-[#00C4AA] text-[#0A0D12] text-xs font-bold px-4 py-2 hover:bg-[#00B099] transition-colors w-fit"
                style={ARIAL}
              >
                Télécharger le WAV binaural
              </a>
            )}
          </div>

          {/* right column: 3D spatialization map */}
          <SpatialMap3D stems={stems} onChange={onPositionChange} />
        </div>
      )}

      {/* CORS limitation info */}
      <div className="bg-[#0D1117] text-[#4B5563] text-[9px] italic px-3 py-2" style={ARIAL}>
        Séparation par canal central (mid-side) effectuée dans le navigateur via Web Audio API, sans serveur ni clé. Fonctionne sur les fichiers stéréo ; les sources mono ne peuvent pas être séparées par cette technique. Certains enregistrements Gallica peuvent nécessiter un import local.
      </div>
    </div>
  );
}