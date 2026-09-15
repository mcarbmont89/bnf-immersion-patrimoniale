// 4 archive fonds for the Explorateur Sémantique tab.
// transcription: plain string with [keyword] markers rendered as clickable tokens.
// keywords: map of keyword -> array of contextual materials.
export const FONDS = [
  {
    id: "AP_000201",
    title: "Entretien Métropolitain",
    subtitle: "L'Artisanat de l'Ameublement à Paris",
    duration: "01:01",
    source: "AP_000201_(REST1)_V1_1_A.wav",
    defaultKeyword: "ameublement",
    transcription:
      "Vous êtes une véritable parisienne ! Comment vous appelez-vous ? Je m'appelle [Pauline]. J'habite [Paris] depuis longtemps. Vous devez monter au quatorzième étage pour votre atelier. Dans quelle rue étiez-vous naguère ? J'avais un petit atelier de [tapisserie] et d'[ameublement]. Mon parrain m'a aidé à m'établir pour constituer mon capital de départ. Je travaille sur commande et vous n'allez pas le regretter. J'ai de l'expérience, j'ai travaillé dans de grandes maisons avant de prendre ma propre petite entreprise. Vous travaillez directement pour la clientèle ? Oui, personnellement. La clientèle est exigeante, il faut de la rigueur et faire des [économies] pour la maintenir. J'ai une bonne clientèle dans la bourgeoisie qui passe régulièrement des commandes. C'est un métier de minutie, un vrai tour de main. Dans l'[ameublement], nous travaillons beaucoup et tous les jours.",
    keywords: {
      Pauline: [
        { title: "Registres d'état civil de Paris, 1900", score: 92, type: "CATALOGUE", source: "BnF-Archives-Civil" },
        { title: "Portraits de femmes artisanes parisiennes", score: 85, type: "PHOTOGRAPHIE", source: "BnF-Estampes-Portraits" }
      ],
      Paris: [
        { title: "Plan de Paris par arrondissements, 1900", score: 95, type: "CARTE", source: "BnF-Cartes-Paris" },
        { title: "Annuaire du commerce parisien, 1898", score: 87, type: "DOCUMENT", source: "BnF-Gallica-Commerce" }
      ],
      tapisserie: [
        { title: "Traité de la tapisserie française, 1887", score: 96, type: "CATALOGUE", source: "BnF-Arts-Decoratifs" },
        { title: "Manufacture des Gobelins, archives photographiques, 1895", score: 91, type: "PHOTOGRAPHIE", source: "BnF-Estampes-Industrie" }
      ],
      ameublement: [
        { title: "Catalogue d'ameublement parisien", score: 97, type: "CATALOGUE", source: "BnF-Gallica-ArtDeco" },
        { title: "Ateliers d'artisans à Paris, 1920", score: 90, type: "PHOTOGRAPHIE", source: "BnF-Estampes-Atelier" }
      ],
      économies: [
        { title: "Enquête sur les conditions ouvrières à Paris, 1904", score: 88, type: "DOCUMENT", source: "BnF-Sciences-Sociales" },
        { title: "Budget des ménages parisiens, 1901", score: 82, type: "STATISTIQUE", source: "BnF-Gallica-Economie" }
      ]
    }
  },
  {
    id: "AP_000069",
    title: "Réflexions sur la Vie Morale",
    subtitle: "et le Divin",
    duration: "00:48",
    source: "AP_000069_(REST1)_V1_1_A.wav",
    defaultKeyword: "foi",
    transcription:
      "La vertu ne se commande pas, elle se cultive. [L'homme] qui cherche à comprendre [Dieu] ne doit pas craindre les questions difficiles, au contraire, c'est dans le doute que naît la [foi] véritable. La [philosophie] nous enseigne à vivre, non pas à mourir. Ce que nous appelons [morale] est souvent le reflet de notre époque, de nos peurs, de nos espérances les plus profondes.",
    keywords: {
      "L'homme": [
        { title: "Dictionnaire de philosophie et théologie scolastique, 1856", score: 94, type: "OUVRAGE", source: "BnF-Philosophie" },
        { title: "Traités de morale chrétienne, XVIIe siècle", score: 89, type: "MANUSCRIT", source: "BnF-MSS-Theologie" }
      ],
      Dieu: [
        { title: "Dictionnaire de philosophie et théologie scolastique, 1856", score: 94, type: "OUVRAGE", source: "BnF-Philosophie" },
        { title: "Traités de morale chrétienne, XVIIe siècle", score: 89, type: "MANUSCRIT", source: "BnF-MSS-Theologie" }
      ],
      foi: [
        { title: "Dictionnaire de philosophie et théologie scolastique, 1856", score: 94, type: "OUVRAGE", source: "BnF-Philosophie" },
        { title: "Traités de morale chrétienne, XVIIe siècle", score: 89, type: "MANUSCRIT", source: "BnF-MSS-Theologie" }
      ],
      philosophie: [
        { title: "Dictionnaire de philosophie et théologie scolastique, 1856", score: 94, type: "OUVRAGE", source: "BnF-Philosophie" },
        { title: "Traités de morale chrétienne, XVIIe siècle", score: 89, type: "MANUSCRIT", source: "BnF-MSS-Theologie" }
      ],
      morale: [
        { title: "Dictionnaire de philosophie et théologie scolastique, 1856", score: 94, type: "OUVRAGE", source: "BnF-Philosophie" },
        { title: "Traités de morale chrétienne, XVIIe siècle", score: 89, type: "MANUSCRIT", source: "BnF-MSS-Theologie" }
      ]
    }
  },
  {
    id: "AP_000053",
    title: "Essai sur l'Ordre Social",
    subtitle: "Économie et Philanthropie",
    duration: "01:23",
    source: "AP_000053_(REST1)_V1_1_A.wav",
    defaultKeyword: "philanthropie",
    transcription:
      "La [société] ne peut prospérer que si chacun de ses membres contribue à l'[économie] commune. La [philanthropie] n'est pas une charité, c'est un devoir civique. Les grandes fortunes ont une [responsabilité] envers ceux que le [travail] n'a pas suffi à protéger de la misère. Réformer les [institutions], c'est d'abord réformer les esprits.",
    keywords: {
      société: [
        { title: "Enquête parlementaire sur les conditions ouvrières, 1884", score: 93, type: "DOCUMENT", source: "BnF-Histoire-Sociale" },
        { title: "Annales de la philanthropie française, 1892", score: 88, type: "PERIODIQUE", source: "BnF-Gallica-Social" }
      ],
      économie: [
        { title: "Enquête parlementaire sur les conditions ouvrières, 1884", score: 93, type: "DOCUMENT", source: "BnF-Histoire-Sociale" },
        { title: "Annales de la philanthropie française, 1892", score: 88, type: "PERIODIQUE", source: "BnF-Gallica-Social" }
      ],
      philanthropie: [
        { title: "Enquête parlementaire sur les conditions ouvrières, 1884", score: 93, type: "DOCUMENT", source: "BnF-Histoire-Sociale" },
        { title: "Annales de la philanthropie française, 1892", score: 88, type: "PERIODIQUE", source: "BnF-Gallica-Social" }
      ],
      responsabilité: [
        { title: "Enquête parlementaire sur les conditions ouvrières, 1884", score: 93, type: "DOCUMENT", source: "BnF-Histoire-Sociale" },
        { title: "Annales de la philanthropie française, 1892", score: 88, type: "PERIODIQUE", source: "BnF-Gallica-Social" }
      ],
      travail: [
        { title: "Enquête parlementaire sur les conditions ouvrières, 1884", score: 93, type: "DOCUMENT", source: "BnF-Histoire-Sociale" },
        { title: "Annales de la philanthropie française, 1892", score: 88, type: "PERIODIQUE", source: "BnF-Gallica-Social" }
      ],
      institutions: [
        { title: "Enquête parlementaire sur les conditions ouvrières, 1884", score: 93, type: "DOCUMENT", source: "BnF-Histoire-Sociale" },
        { title: "Annales de la philanthropie française, 1892", score: 88, type: "PERIODIQUE", source: "BnF-Gallica-Social" }
      ]
    }
  },
];