// Declarative description of one XR scene ("scene spec").
// The AI (or any client) only has to produce this JSON; the viewer builds the world from it.
// Angles: azimuth 0 = straight ahead, +90 = right, 180 = behind; elevation 0 = ear level.
import { SPACES, SORBONNE_SPACES } from "@/components/immersion/spaces";
import { RICHELIEU_TIMELINE, SORBONNE_TIMELINE } from "@/components/immersion/timeline.js";
import { sphericalToCartesian } from "@/lib/audioEngine";

export const TOURS = {
  richelieu: { label: "Salle Ovale · Richelieu", spaces: SPACES, timeline: RICHELIEU_TIMELINE },
  sorbonne: { label: "Sorbonne · Quartier Latin", spaces: SORBONNE_SPACES, timeline: SORBONNE_TIMELINE }
};

// Sound sources per space. Every space gets room tone + page turns; some get extras.
const BASE_SOUNDS = [
  { id: "salle", label: "Murmure de la salle", kind: "ambience", az: 180, el: 5, dist: 4, cutoff: 520, gain: 0.07 },
  { id: "pages", label: "Pages", kind: "pages", az: 90, el: 0, dist: 3 }
];
const EXTRA_SOUNDS = {
  4: [{ id: "guide", label: "Voix guide (archive)", kind: "guide", az: 0, el: 5, dist: 2.5, intervalS: 4 }],
  6: [{ id: "musique", label: "Ambiance sonore", kind: "music", az: 0, el: 10, dist: 3, orbit: 0.26 }],
  8: [{ id: "bandes", label: "Bandes magnétiques", kind: "hum", az: 270, el: 0, dist: 2.5 }]
};

function planAzimuth(from, to) {
  // Plan x runs east, y runs south; azimuth 0 is north (the top of the plan).
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

export function buildSceneSpec(tourKey, spaceId) {
  const tour = TOURS[tourKey] || TOURS.richelieu;
  const space = tour.spaces.find((s) => s.id === spaceId) || tour.spaces[0];

  // Navigation hotspots: the three nearest other spaces, placed in the direction of the floor plan.
  const neighbours = tour.spaces
    .filter((s) => s.id !== space.id)
    .map((s) => ({ s, d: Math.hypot(s.x - space.x, s.y - space.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map(({ s }) => {
      const az = planAzimuth(space, s);
      return { id: `go-${s.id}`, type: "nav", target: s.id, label: s.name, az, el: -8, dist: 3.2 };
    });

  const events = (tour.timeline[space.id] || [])[0];
  const info = events
    ? [{
        id: "info",
        type: "info",
        label: `${events.year} · ${events.title}`,
        text: events.description,
        az: 25,
        el: 12,
        dist: 3
      }]
    : [];

  const toPos = (h) => sphericalToCartesian(h.az, h.el, h.dist);
  return {
    tour: tourKey,
    space: { id: space.id, name: space.name, prompt: space.prompt },
    hotspots: [...neighbours, ...info].map((h) => ({ ...h, pos: toPos(h) })),
    sounds: [...BASE_SOUNDS, ...(EXTRA_SOUNDS[space.id] || [])].map((d) => ({ ...d, pos: toPos(d) }))
  };
}
