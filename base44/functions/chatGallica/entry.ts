import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Preconfigured documents (kept for the curated default list).
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

const OUT_OF_SCOPE =
  "Cette question dépasse le contenu du document sélectionné. Je vous invite à consulter les autres ressources disponibles dans les collections Gallica ou à sélectionner un autre document.";

// Fetch OCR plain text from the first N pages of a Gallica document by ARK.
// Endpoint: https://gallica.bnf.fr/ark:/12148/<ark>/f<page>.texteBrut
async function fetchOcrContext(ark, pages = 5) {
  const cleanArk = ark.replace(/^ark:\/12148\//, '');
  const chunks = [];
  let totalLen = 0;
  for (let p = 1; p <= pages; p++) {
    if (totalLen > 9000) break;
    try {
      const url = `https://gallica.bnf.fr/ark:/12148/${cleanArk}/f${p}.texteBrut`;
      const resp = await fetch(url, { headers: { 'Accept': 'text/plain' } });
      if (!resp.ok) continue;
      const text = await resp.text();
      if (text && text.length > 50) {
        chunks.push(`--- Page ${p} ---\n${text.slice(0, 3000)}`);
        totalLen += text.length;
      }
    } catch {
      // skip page on error
    }
  }
  return chunks.join('\n\n');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const question = String(body?.question || '').trim().slice(0, 1000);

    // Resolve the document: either a custom one passed from search, or a curated id.
    let label = '';
    let metadata = '';
    let ocrContext = '';

    if (body?.document && body.document.ark) {
      label = String(body.document.label || body.document.title || 'Document Gallica').slice(0, 200);
      metadata = String(body.document.metadata || body.document.ark).slice(0, 300);
      ocrContext = await fetchOcrContext(body.document.ark, 5);
    } else {
      const docId = String(body?.documentId || '');
      const doc = DOCS[docId];
      if (!doc) {
        return Response.json({ error: 'Missing document' }, { status: 400 });
      }
      label = doc.label;
      metadata = doc.metadata;
    }

    if (!question) {
      return Response.json({ error: 'Missing question' }, { status: 400 });
    }

    let prompt =
      "Tu es un assistant expert de la Bibliothèque nationale de France (BnF) travaillant sur les collections numérisées Gallica. " +
      "Le document sélectionné par l'utilisateur est : « " + label + " » (" + metadata + "). ";

    if (ocrContext) {
      prompt +=
        "Voici le contenu OCR réel des premières pages de ce document, utilise-le comme source principale :\n\n" +
        ocrContext + "\n\n";
    }

    prompt +=
      "Réponds en français à la question suivante en t'appuyant sur le contenu de ce document. " +
      "Quand c'est pertinent, cite des numéros de page et des chapitres sous la forme : *Source : p. XX, Chapitre X*. " +
      "Si la question ne concerne pas ce document, réponds exactement et uniquement : " +
      "\"" + OUT_OF_SCOPE + "\" " +
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