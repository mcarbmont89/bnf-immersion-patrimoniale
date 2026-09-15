import React, { useRef } from "react";

const ARIAL = { fontFamily: "Arial, sans-serif" };

function HeadphonesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function Slider({ label, value, min, max, step, disabled, minLabel, maxLabel, centerLabel, midLabel, onChange }) {
  return (
    <div className={disabled ? "opacity-50" : ""}>
      <div className="text-white text-xs mb-1" style={ARIAL}>{label}</div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: "#00C4AA" }}
      />
      <div className="flex justify-between text-[9px] text-[#9CA3AF] mt-0.5" style={ARIAL}>
        <span>{minLabel}</span>
        {centerLabel && <span>{centerLabel}</span>}
        {midLabel && <span>{midLabel}</span>}
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default function ControlesAudio({
  sources, selected, onSelect, onAddFiles, onCreateTest,
  onUpdate, onConvert, onReset, converting, binauralBuffer,
  downloadUrl, previewMode, onPlayOriginal, onPlayBinaural, onStop
}) {
  const fileRef = useRef(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[55fr_43fr] gap-4 h-full">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]" style={ARIAL}>
          Importer des fichiers audio
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded bg-[#00C4AA] text-[#0A0D12] text-xs font-bold px-4 py-2 hover:bg-[#00B099] transition-colors"
            style={ARIAL}
          >
            Choisir des fichiers
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            multiple
            className="hidden"
            onChange={(e) => { onAddFiles(e.target.files); e.target.value = ""; }}
          />
          <div className="flex-1 rounded bg-[#1F2937] text-[#9CA3AF] text-xs px-3 py-2 flex items-center truncate" style={ARIAL}>
            {selected ? `${sources.length} fichier(s) · ${selected.name}` : "Aucun fichier sélectionné"}
          </div>
        </div>
        <div className="text-[10px] text-[#00C4AA]" style={ARIAL}>
          Sélectionnez plusieurs fichiers pour les positionner automatiquement autour de l'auditeur
        </div>
        <button
          onClick={onCreateTest}
          className="self-start rounded bg-[#374151] text-white text-xs px-4 py-2 hover:bg-[#4B5563] transition-colors"
          style={ARIAL}
        >
          Créer un audio de test
        </button>
        <div className="text-[10px] text-[#9CA3AF]" style={ARIAL}>
          Aucun fichier audio ? Créez un fichier audio de test de 3 secondes.
        </div>

        <div className="border-t border-[#1F2937] my-2" />

        <div className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]" style={ARIAL}>
          Contrôles de position 3D
        </div>

        <Slider
          label={`Azimut : ${selected ? selected.az : 0}° (Gauche/Droite)`}
          value={selected ? selected.az : 0}
          min={-180} max={180} step={1}
          disabled={!selected}
          minLabel="-180° (Arrière gauche)" centerLabel="0° (Avant)" maxLabel="+180° (Arrière droit)"
          onChange={(v) => onUpdate(selected.id, { az: v })}
        />
        <Slider
          label={`Élévation : ${selected ? selected.el : 0}° (Haut/Bas)`}
          value={selected ? selected.el : 0}
          min={-90} max={90} step={1}
          disabled={!selected}
          minLabel="-90° (En dessous)" centerLabel="0° (Niveau)" maxLabel="+90° (Au-dessus)"
          onChange={(v) => onUpdate(selected.id, { el: v })}
        />
        <Slider
          label={`Distance : ${selected ? selected.dist.toFixed(1) : 1}m`}
          value={selected ? selected.dist : 1}
          min={0.1} max={10} step={0.1}
          disabled={!selected}
          minLabel="0.1m (Très proche)" midLabel="5m (Moyen)" maxLabel="10m (Lointain)"
          onChange={(v) => onUpdate(selected.id, { dist: v })}
        />

        <div className="flex gap-2">
          <button
            onClick={onConvert}
            disabled={!selected || converting}
            className="flex-1 rounded bg-[#374151] text-white text-xs font-bold px-4 py-2 hover:bg-[#4B5563] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={ARIAL}
          >
            {converting ? "Conversion…" : "Convertir en binaural 3D"}
          </button>
          <button
            onClick={onReset}
            disabled={!selected}
            className="flex-1 rounded bg-[#1F2937] text-[#9CA3AF] text-xs px-4 py-2 hover:bg-[#374151] hover:text-white transition-colors disabled:opacity-40"
            style={ARIAL}
          >
            Réinitialiser
          </button>
        </div>

        {binauralBuffer && (
          <div className="rounded-lg bg-[#111827] p-3 flex flex-col gap-2" style={{ borderLeft: "4px solid #00C4AA" }}>
            <div className="text-white text-xs font-bold" style={ARIAL}>Aperçu binaural généré</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onPlayOriginal}
                className={`rounded px-3 py-1.5 text-xs ${previewMode === "original" ? "bg-[#00C4AA] text-[#0A0D12]" : "bg-[#1F2937] text-white"} hover:opacity-90`}
                style={ARIAL}
              >
                {previewMode === "original" ? "■ Original" : "▶ Original"}
              </button>
              <button
                onClick={onPlayBinaural}
                className={`rounded px-3 py-1.5 text-xs ${previewMode === "binaural" ? "bg-[#00C4AA] text-[#0A0D12]" : "bg-[#1F2937] text-white"} hover:opacity-90`}
                style={ARIAL}
              >
                {previewMode === "binaural" ? "■ Binaural 3D" : "▶ Binaural 3D"}
              </button>
              {previewMode && (
                <button onClick={onStop} className="rounded px-3 py-1.5 text-xs bg-[#1F2937] text-[#9CA3AF] hover:text-white" style={ARIAL}>
                  Stop
                </button>
              )}
            </div>
            {downloadUrl && (
              <a href={downloadUrl} download="binaural-3d.wav" className="self-start rounded bg-[#00C4AA] text-[#0A0D12] text-xs font-bold px-3 py-1.5 hover:bg-[#00B099]" style={ARIAL}>
                Télécharger le WAV binaural
              </a>
            )}
          </div>
        )}

        {sources.length > 1 && (
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-[#9CA3AF] uppercase tracking-widest" style={ARIAL}>Sources importées</div>
            {sources.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="text-left rounded px-2 py-1.5 text-xs truncate transition-colors"
                style={{
                  ...ARIAL,
                  background: s.id === selected?.id ? "rgba(0,196,170,0.12)" : "#111827",
                  color: s.id === selected?.id ? "#00C4AA" : "#9CA3AF"
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-3">
        <div className="bg-[#1C1200] p-3 flex items-start gap-3" style={{ borderLeft: "4px solid #F59E0B" }}>
          <HeadphonesIcon />
          <div>
            <div className="text-white text-xs font-bold" style={ARIAL}>Utilisez un casque audio</div>
            <div className="text-[#9CA3AF] text-[11px] mt-0.5" style={ARIAL}>
              Pour une expérience audio 3D correcte, un casque est requis
            </div>
          </div>
        </div>

        <div className="bg-[#111827] p-4" style={{ borderLeft: "4px solid #00C4AA" }}>
          <div className="text-white text-xs font-bold mb-3" style={ARIAL}>Guide de démarrage</div>
          <ol className="space-y-2">
            {[
              "Importez un fichier audio (MP3, WAV, etc.)",
              "Ajustez les curseurs de position 3D",
              'Cliquez sur "Convertir en binaural 3D"',
              "Comparez l'original et le binaural avec un casque",
              "Téléchargez votre audio spatial"
            ].map((step, i) => (
              <li key={i} className="flex gap-2 text-[11px] text-[#9CA3AF]" style={ARIAL}>
                <span className="text-[#00C4AA] font-bold">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}