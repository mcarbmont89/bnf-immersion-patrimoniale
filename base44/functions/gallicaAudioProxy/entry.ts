// Server-side proxy for Gallica audio files.
// Bypasses browser CORS by fetching the audio binary server-side
// and streaming it back with permissive CORS headers.
// Only gallica.bnf.fr URLs are allowed.

const ALLOWED = /^https?:\/\/gallica\.bnf\.fr\//i;

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = String(body?.url || '').trim();
    if (!url || !ALLOWED.test(url)) {
      return Response.json({ error: 'URL Gallica invalide' }, { status: 400 });
    }
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Base44-Gallica-Proxy/1.0',
        'Accept': 'audio/*, application/octet-stream, */*'
      },
      redirect: 'follow'
    });
    if (!resp.ok) {
      return Response.json({ error: `Gallica renvoie ${resp.status}` }, { status: 502 });
    }
    const contentType = resp.headers.get('content-type') || 'application/octet-stream';
    const buf = await resp.arrayBuffer();
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}