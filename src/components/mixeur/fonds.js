// 2 fonds for the Mixeur 3D Éducatif tab. Each fond defines 3 stems mapped to
// real Demucs source-separation outputs (vocals / bass / drums / other).
// The spatialization presets (azimuth, distance, volume) are educational defaults.
export const MIX_FONDS = [
  {
    id: "AP_001005",
    title: "Conte : Le Bûcheron et l'Enchanteur Merlin",
    source: "AP_001005_(EX01-REST1)_V1_1_A.wav · mono",
    stems: [
      { id: "v", name: "Voix Narrateur", color: "#E57373", icon: "mic", source: "vocals", az: 0, dist: 1, volume: 85 },
      { id: "f", name: "Ambiance Forêt", subtitle: "Vent, Oiseaux", color: "#64B5F6", icon: "wind", source: "other", az: 180, dist: 3, volume: 60 },
      { id: "e", name: "Effets Sonores", subtitle: "Coups de hache, Voix Magique", color: "#FFA726", icon: "effects", source: "drums", az: -90, dist: 1.5, volume: 70 }
    ]
  },
  {
    id: "AP_000058",
    title: "Critique Littéraire : Élégie à la Lumière et à l'Univers Poétique",
    source: "AP_000058_(REST1)_V1_1_A.wav · mono",
    stems: [
      { id: "v", name: "Récitation Poétique", color: "#E57373", icon: "mic", source: "vocals", az: 0, dist: 1, volume: 85 },
      { id: "p", name: "Paysage Sonore", subtitle: "Vallée", color: "#64B5F6", icon: "wind", source: "other", az: 45, dist: 4, volume: 60 },
      { id: "m", name: "Musique", subtitle: "Harpe", color: "#FFA726", icon: "music", source: "bass", az: -45, dist: 2, volume: 70 }
    ]
  }
];