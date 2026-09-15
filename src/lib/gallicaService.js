import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';

// Search Gallica SRU for sound documents (reuses the gallicaSearch backend function).
export async function searchGallicaAudio(query, limit = 12) {
  const res = await base44.functions.invoke('gallicaSearch', {
    query,
    type: 'sonore',
    limit
  });
  const data = res?.data || {};
  return { total: data.total || 0, records: data.records || [] };
}

// Build the direct audio URL for a Gallica ARK.
export function gallicaAudioUrl(ark) {
  const id = ark.replace(/^ark:\/\d+\//, '');
  return `https://gallica.bnf.fr/ark:/${id}/f1.highres`;
}

function proxyEndpoint() {
  const base = appParams.appBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/functions/gallicaAudioProxy`;
}

// Load a Gallica audio file as an ArrayBuffer.
// Tries a direct CORS fetch first, then falls back to the backend proxy.
export async function fetchGallicaAudioArrayBuffer(ark) {
  const url = gallicaAudioUrl(ark);
  try {
    const r = await fetch(url, { mode: 'cors' });
    if (r.ok) {
      const ct = (r.headers.get('content-type') || '').toLowerCase();
      if (ct.startsWith('audio') || ct.includes('mpeg') || ct.includes('octet-stream')) {
        return await r.arrayBuffer();
      }
    }
  } catch (e) {
    // fall through to proxy
  }
  const headers = { 'Content-Type': 'application/json' };
  if (appParams.token) headers['Authorization'] = `Bearer ${appParams.token}`;
  const r2 = await fetch(proxyEndpoint(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ url })
  });
  if (!r2.ok) throw new Error('Proxy Gallica ' + r2.status);
  return await r2.arrayBuffer();
}