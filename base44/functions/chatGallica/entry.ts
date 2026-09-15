import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const DOCS = {
  napoleon: {
    label: "Napoléon et l'Empire",
    metadata: "Gallica · ark:/12148/bpt6k5406710v · 1847 · 423 pages"
  },
  revolution: {
    label: "Mémoires de la Révolution",
    metadata: "Gallica · ark:/12148/bpt6k5765898 · 1823 · 287 pages"
  },
  tapisserie: {
    label: "L'Art de la Tapisserie",
    metadata: "Gallica · ark:/12148/bpt6k5772341 · 1891 · 156 pages"
  },
  paris: {
    label: "Paris à travers les âges",
    metadata: "Gallica · ark:/12148/bpt6k5783921 · 1875 · 512 pages"
  }
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const docId = String(body?.documentId || '');
    const question = String(body?.question || '').trim().slice(0, 1000);
    const doc = DOCS[docId];
    if (!doc || !question) {
      return Response.json({ error: 'Missing document or question' }, { status: 400 });
    }
    const prompt =
      "Tu es un assistant expert de la Bibliothèque nationale de France (BnF) travaillant sur les collections numérisées Gallica. " +
      "Le document sélectionné par l'utilisateur est : « " + doc.label + " » (" + doc.metadata + "). " +
      "Réponds en français à la question suivante en t'appuyant sur le contenu de ce document. " +
      "Quand c'est pertinent, cite des numéros de page et des chapitres sous la forme : *Source : p. XX, Chapitre X*. " +
      "Si la question ne concerne pas ce document, réponds exactement et uniquement : " +
      "\"Cette question dépasse le contenu du document sélectionné. Je vous invite à consulter les autres ressources disponibles dans les collections Gallica ou à sélectionner un autre document.\" " +
      "Réponds obligatoirement en JSON avec la forme {\"answer\": string, \"chips\": [string, string, string]}. " +
      "Le champ chips contient 3 questions de suivi pertinentes liées au document (tableau vide si la question était hors sujet). " +
      "Question de l'utilisateur : " + question;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          answer: { type: "string" },
          chips: { type: "array", items: { type: "string" } }
        },
        required: ["answer", "chips"]
      }
    });
    return Response.json({
      answer: result.answer || "",
      chips: Array.isArray(result.chips) ? result.chips.slice(0, 3) : []
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}