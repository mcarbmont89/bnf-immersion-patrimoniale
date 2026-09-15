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

// The 8 numbered spaces of a Sorbonne heritage tour (Quartier Latin, Paris).
// x/y are positions on the 400x300 floor-plan SVG viewBox.
export const SORBONNE_SPACES = [
  {
    id: 1,
    name: "Cour d'honneur",
    x: 200, y: 258,
    prompt:
      "Grand entrance courtyard (cour d'honneur) of the Sorbonne university in Paris. View from inside the courtyard looking toward the monumental gated entrance. Classical limestone facade, symmetrical wings, cobblestones, a few students passing. Historic academic architecture, tall windows, slate roofs. Warm afternoon light. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 2,
    name: "Grand amphithéâtre",
    x: 70, y: 155,
    prompt:
      "Historic grand amphitheater of the Sorbonne. Tiered wooden benches curving around a rostrum, green velvet seats, large arched windows casting light. Busts of scholars on the walls. Ornate plaster ceiling. Solemn academic atmosphere. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 3,
    name: "Chapelle de la Sorbonne",
    x: 200, y: 70,
    prompt:
      "Baroque chapel of the Sorbonne, interior. White and gold stucco, ornate dome, marble floor, gilded altar. Cardinal Richelieu's tomb visible. Soft light from the dome oculus. Sacred, hushed atmosphere. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 4,
    name: "Bibliothèque",
    x: 330, y: 155,
    prompt:
      "Historic library of the Sorbonne. Tall wooden bookshelves, reading desks with green lamps, vaulted ceiling, stained glass. Scholars reading quietly. Warm golden light. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 5,
    name: "Escalier d'honneur",
    x: 200, y: 155,
    prompt:
      "Monumental staircase of honor in the Sorbonne. Marble steps, wrought-iron banister, stone balustrades, large arched window on the landing. Light streaming down from above. Grand Belle Époque academic architecture. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 6,
    name: "Salle Louis Liard",
    x: 110, y: 90,
    prompt:
      "Elegant conference room 'Salle Louis Liard' of the Sorbonne. Wood-paneled walls, portrait paintings of scholars, long central table, chandeliers, parquet floor. Formal academic setting. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 7,
    name: "Galerie des bustes",
    x: 290, y: 90,
    prompt:
      "Long gallery of the Sorbonne lined with marble busts of French intellectuals and scholars. Polished stone floor, arched ceiling, soft daylight from side windows. Quiet, dignified atmosphere. Photorealistic, cinematic, 4K quality."
  },
  {
    id: 8,
    name: "Jardin et cloître",
    x: 300, y: 225,
    prompt:
      "Inner garden and cloister of the Sorbonne. Lush green courtyard, arcaded gallery, linden trees, stone fountain, peaceful atmosphere. Historic academic architecture surrounding the garden. Photorealistic, cinematic, 4K quality."
  }
];

export const SOUND_ARCHIVE = {
  titre: "Entretien Métropolitain : L'Artisanat de l'Ameublement à Paris",
  fonds: "AP_000201 · 01:01 · mono"
};

export const TABS = [
  { id: "explorateur", label: "Explorateur" },
  { id: "cinema", label: "Cinéma" },
  { id: "mixeur", label: "Mixeur 3D" },
  { id: "studio", label: "Studio Spatialisation" },
  { id: "immersion", label: "Immersion Patrimoniale" },
  { id: "chat", label: "Chat · Gallica" }
];