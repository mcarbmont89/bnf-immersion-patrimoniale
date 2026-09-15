// 2 fonds for the Mixeur 3D Éducatif tab. Each fond has 3 stems.
// shape drives the waveform look; color drives waveform + map dot.
export const MIX_FONDS = [
  {
    id: "AP_001005",
    title: "Le Bûcheron",
    source: "AP_001005_(EX01-REST1)_V1_1_A.wav · mono",
    stems: [
      {
        id: "v",
        name: "Voix Narrateur",
        color: "#E57373",
        az: 0,
        dist: 1,
        volume: 85,
        shape: "dense-middle"
      },
      {
        id: "f",
        name: "Ambiance Forêt",
        subtitle: "Vent, Oiseaux",
        color: "#64B5F6",
        az: 180,
        dist: 3,
        volume: 60,
        shape: "uniform"
      },
      {
        id: "e",
        name: "Effets Sonores",
        subtitle: "Coups de hache, Voix Magique",
        color: "#FFA726",
        az: -90,
        dist: 1.5,
        volume: 70,
        shape: "sharp-peaks"
      }
    ]
  },
  {
    id: "AP_000058",
    title: "Élégie",
    source: "AP_000058_(REST1)_V1_1_A.wav · mono",
    stems: [
      {
        id: "v",
        name: "Récitation Poétique",
        color: "#E57373",
        az: 0,
        dist: 1,
        volume: 85,
        shape: "rhythmic"
      },
      {
        id: "p",
        name: "Paysage Sonore",
        subtitle: "Vallée",
        color: "#64B5F6",
        az: 45,
        dist: 4,
        volume: 60,
        shape: "low"
      },
      {
        id: "m",
        name: "Musique",
        subtitle: "Harpe",
        color: "#FFA726",
        az: -45,
        dist: 2,
        volume: 70,
        shape: "flowing"
      }
    ]
  }
];