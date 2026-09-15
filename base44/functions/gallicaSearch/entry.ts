import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Public Gallica SRU search API (no auth required, Etalab open licence).
// Docs: https://api.bnf.fr/fr/api-gallica-de-recherche
// Endpoint: https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=<CQL>

const SRU_BASE = 'https://gallica.bnf.fr/SRU';

// Extract text content of the first <ns:tag>...</ns:tag> within a record fragment.
function pickTag(xml, tag) {
  const re = new RegExp(`<(?:[a-zA-Z]+:)?${tag}[^>]*>([^<]*)</(?:[a-zA-Z]+:)?${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

// Parse the SRU XML response into a list of records using simple regex.
function parseRecords(xml) {
  const records = [];
  const blocks = xml.split(/<srw:record>/i).slice(1);
  for (const block of blocks) {
    const title = pickTag(block, 'title');
    const creator = pickTag(block, 'creator');
    const date = pickTag(block, 'date');
    const type = pickTag(block, 'type');
    const identifier = pickTag(block, 'identifier');
    const source = pickTag(block, 'source');
    const arkMatch = identifier.match(/(ark:\/12148\/[A-Za-z0-9]+)/);
    const ark = arkMatch ? arkMatch[1] : '';
    if (!title && !creator && !ark) continue;
    records.push({ title, creator, date, type, ark, identifier, source });
  }
  return records;
}

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body?.query || '').trim().slice(0, 200);
    const docType = String(body?.type || '').trim().slice(0, 30); // monographie, sonore, carte, image, manuscrit, partition, vidéo, fascicule, objet
    const maxRecords = Math.min(20, Math.max(1, Number(body?.limit) || 10));

    if (!query) {
      return Response.json({ error: 'Missing query' }, { status: 400 });
    }

    // Build a CQL query. Default searches across all Gallica metadata + OCR text.
    const escaped = query.replace(/"/g, '\\"');
    let cql = `gallica all "${escaped}"`;
    if (docType) {
      cql += ` and dc.type adj "${docType}"`;
    }

    const url = `${SRU_BASE}?version=1.2&operation=searchRetrieve&query=${encodeURIComponent(cql)}&maximumRecords=${maxRecords}&startRecord=1`;

    const resp = await fetch(url, {
      headers: { 'Accept': 'application/xml' }
    });
    if (!resp.ok) {
      return Response.json({ error: `Gallica returned ${resp.status}` }, { status: 502 });
    }
    const xml = await resp.text();

    const totalMatch = xml.match(/<srw:numberOfRecords[^>]*>(\d+)</i);
    const total = totalMatch ? Number(totalMatch[1]) : 0;
    const records = parseRecords(xml);

    return Response.json({
      query: cql,
      total,
      count: records.length,
      records
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}