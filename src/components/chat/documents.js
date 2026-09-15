// 4 Gallica documents for the Chat · Gallica tab.
// Each has metadata and a pre-loaded conversation (array of {role, text}).
export const DOCUMENTS = [
  {
    id: "napoleon",
    label: "Napoléon et l'Empire",
    metadata: "Gallica · ark:/12148/bpt6k5406710v · 1847 · 423 pages",
    conversation: [
      {
        role: "user",
        text: "Parlez-moi des campagnes militaires de Napoléon en Égypte."
      },
      {
        role: "assistant",
        text: "D'après le document « Napoléon et l'Empire » (BnF, 1847), la campagne d'Égypte débuta en 1798 avec l'objectif d'établir une présence française en Orient et de couper la route des Indes à l'Angleterre. Napoléon débarqua à Alexandrie avec une armée de 38 000 hommes accompagnée d'une Commission des Sciences et des Arts, 167 savants chargés d'étudier l'Égypte ancienne et moderne. La bataille des Pyramides (21 juillet 1798) vit la défaite des Mamelouks, mais la destruction de la flotte française par Nelson à Aboukir isola l'expédition.\n*Source : p. 134-156, Chapitre VII, Campagnes d'Orient*"
      },
      {
        role: "user",
        text: "Combien de soldats ont participé ?"
      },
      {
        role: "assistant",
        text: "Le document précise une armée initiale de 38 000 hommes, dont 2 000 officiers et les 167 membres de la Commission scientifique. Après les pertes à Aboukir et les épidémies de peste, l'effectif fut réduit à environ 28 000 hommes au moment du départ de Napoléon pour Paris en août 1799.\n*Source : p. 141, note de bas de page 23*"
      }
    ],
    chips: ["Quel rôle a joué Joséphine ?", "Quelles batailles ont été décisives ?", "Qu'est-ce que le Code Napoléon ?"]
  },
  {
    id: "revolution",
    label: "Mémoires de la Révolution",
    metadata: "Gallica · ark:/12148/bpt6k5765898 · 1823 · 287 pages",
    conversation: [
      {
        role: "user",
        text: "Décrivez la prise de la Bastille."
      },
      {
        role: "assistant",
        text: "Selon les « Mémoires de la Révolution » (BnF, 1823), la prise de la Bastille le 14 juillet 1789 fut moins une bataille organisée qu'un mouvement spontané de la population parisienne. Le gouverneur de Launay négocia d'abord, puis ouvrit le feu, faisant 98 morts parmi les assaillants. La forteresse tomba en fin d'après-midi. Le mémorialiste note que seulement 7 prisonniers y étaient enfermés au moment de l'assaut, dont 4 faussaires et 2 aliénés.\n*Source : p. 67-84, Chapitre IV, Le Peuple en armes*"
      }
    ],
    chips: ["Qui était Robespierre ?", "Qu'est-il arrivé au Roi ?", "La Déclaration des droits de l'Homme"]
  },
  {
    id: "tapisserie",
    label: "L'Art de la Tapisserie",
    metadata: "Gallica · ark:/12148/bpt6k5772341 · 1891 · 156 pages",
    conversation: [
      {
        role: "user",
        text: "Quelles sont les principales techniques de tissage décrites ?"
      },
      {
        role: "assistant",
        text: "D'après « L'Art de la Tapisserie » (BnF, 1891), l'ouvrage distingue trois grandes familles de techniques : la haute lisse (chaîne verticale, méthode traditionnelle des Gobelins), la basse lisse (chaîne horizontale, plus rapide mais moins précise), et le point noué (velours noué, d'origine orientale). L'auteur recommande la haute lisse pour les œuvres figuratives et la basse lisse pour les motifs géométriques.\n*Source : p. 23-41, Chapitre II, Techniques et matériaux*"
      }
    ],
    chips: ["Quels matériaux sont recommandés ?", "La Manufacture des Gobelins", "Entretien et restauration"]
  },
  {
    id: "paris",
    label: "Paris à travers les âges",
    metadata: "Gallica · ark:/12148/bpt6k5783921 · 1875 · 512 pages",
    conversation: [
      {
        role: "user",
        text: "Comment Paris a-t-il évolué sous Haussmann ?"
      },
      {
        role: "assistant",
        text: "Selon « Paris à travers les âges » (BnF, 1875), les travaux du baron Haussmann (1853-1870) ont transformé radicalement la capitale : 60 % du bâti médiéval fut démoli pour créer les grands boulevards. Le Paris moderne hérite de 165 km de nouvelles rues, d'un système d'égouts souterrain, et des parcs du Bois de Boulogne et de Vincennes. L'auteur note que 350 000 Parisiens furent déplacés vers les quartiers périphériques.\n*Source : p. 312-367, Chapitre XI, La Transformation du XIXe siècle*"
      }
    ],
    chips: ["Les grands boulevards", "Le système des égouts", "L'architecture haussmannienne"]
  }
];

export const OUT_OF_SCOPE =
  "Cette question dépasse le contenu du document sélectionné. Je vous invite à consulter les autres ressources disponibles dans les collections Gallica ou à sélectionner un autre document.";