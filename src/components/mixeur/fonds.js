// 2 fonds for the Mixeur 3D Éducatif tab. Each fond defines 2 stems mapped to the
// center-channel (mid-side) separation outputs: "vocals" (center) and
// "instrumental" (stereo sides). The spatialization presets are educational defaults.
export const MIX_FONDS = [
  {
    id: "AP_001005",
    title: "Conte : Le Bûcheron et l'Enchanteur Merlin",
    source: "AP_001005_(EX01-REST1)_V1_1_A.wav · mono",
    stems: [
      { id: "v", name: "Voix Narrateur", color: "#E57373", icon: "mic", source: "vocals", az: 0, dist: 1, volume: 85 },
      { id: "i", name: "Ambiance & Effets", subtitle: "Instrumental (canal stéréo)", color: "#64B5F6", icon: "wind", source: "instrumental", az: 180, dist: 3, volume: 60 }
    ]
  },
  {
    id: "AP_000058",
    title: "Critique Littéraire : Élégie à la Lumière et à l'Univers Poétique",
    source: "AP_000058_(REST1)_V1_1_A.wav · mono",
    stems: [
      { id: "v", name: "Récitation Poétique", color: "#E57373", icon: "mic", source: "vocals", az: 0, dist: 1, volume: 85 },
      { id: "i", name: "Paysage Sonore", subtitle: "Instrumental (canal stéréo)", color: "#64B5F6", icon: "wind", source: "instrumental", az: 135, dist: 3, volume: 60 }
    ]
  }
];