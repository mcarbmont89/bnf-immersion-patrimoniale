// The 8 numbered spaces of the BnF Salle Ovale de Richelieu.
// x/y are positions on the 400x300 floor-plan SVG viewBox.
export const SPACES = [
  {
    id: 1,
    name: "Entrée principale",
    x: 200, y: 268,
    prompt:
      "Grand entrance of the Salle Ovale de Richieu BnF. View from inside looking toward the ornate entrance doors. Visitors entering, security desk, printed catalog cards visible. Belle Époque architecture. Tall wooden bookshelves, ornate iron railings on upper galleries, warm golden light from tall arched windows, parquet floors, painted ceiling with allegorical figures. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 2,
    name: "Tables de lecture",
    x: 200, y: 150,
    prompt:
      "Long mahogany reading tables at the BnF Salle Ovale. Researchers working with books and laptops. Green brass reading lamps. Morning light through tall arched windows. Quiet, focused atmosphere. Belle Époque architecture, tall wooden bookshelves reaching the ceiling, ornate iron railings on upper galleries, painted ceiling with allegorical figures, parquet floors. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 3,
    name: "Rayonnages historiques",
    x: 72, y: 150,
    prompt:
      "Towering historic bookshelves of the BnF Salle Ovale reaching 10 meters high. Leather-bound volumes, iron spiral staircase to upper gallery. Warm amber light. A librarian on the upper level retrieving a volume. Belle Époque architecture, ornate iron railings, parquet floors. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 4,
    name: "Alcôve sonore",
    x: 128, y: 74,
    prompt:
      "Intimate listening alcove in the BnF. Padded booth with vintage headphones and modern audio interface. Small monitor showing transcription text. Warm wood paneling. A printed label reads: Artisanat de l'Ameublement à Paris — Fonds AP_000201 · 1923. Belle Époque architecture, warm golden light. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 5,
    name: "Cabinet des manuscrits",
    x: 200, y: 60,
    prompt:
      "Glass display cases showing open manuscripts in the BnF. White gloved conservator examining a handwritten document under magnification. Controlled lighting. Climate-controlled room visible through glass. Belle Époque architecture, warm wood paneling, parquet floors. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 6,
    name: "Station d'écoute immersive",
    x: 272, y: 74,
    prompt:
      "Modern immersive audio installation in the BnF. Visitor wearing binaural headphones, eyes closed, surrounded by subtle speaker array. Dark room with projection showing sepia 1896 Paris street scene. A printed label reads: Discours d'inauguration de la Sorbonne · 1896. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 7,
    name: "Galerie des portraits",
    x: 328, y: 150,
    prompt:
      "Long corridor of painted portraits of French writers and intellectuals in the BnF. Oil paintings in gilded frames. Molière, Victor Hugo, Voltaire visible. Polished parquet floor, afternoon light. Belle Époque architecture, ornate iron railings on upper gallery. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 8,
    name: "Salle des archives sonores",
    x: 300, y: 230,
    prompt:
      "Conservation room for the BnF sound archives. Metal shelving units with orange Nagra tape boxes and acetate cylinders in archival sleeves. Technicians at digitization workstations. Labels and catalog numbers visible. Professional, quiet, precise. Photorealistic, cinematic, 4K quality."
  }
];

export const SOUND_ARCHIVE = {
  titre: "Entretien Métropolitain : L'Artisanat de l'Ameublement à Paris",
  fonds: "AP_000201 · 01:01 · mono"
};

export const TABS = [
  { id: "explorateur", label: "Explorateur", icon: "🔍" },
  { id: "cinema", label: "Cinéma", icon: "🎬" },
  { id: "mixeur", label: "Mixeur 3D", icon: "🎚️" },
  { id: "studio", label: "Studio Spatialisation", icon: "🎛️" },
  { id: "immersion", label: "Immersion Patrimoniale", icon: "🏛" },
  { id: "chat", label: "Chat · Gallica", icon: "💬" }
];