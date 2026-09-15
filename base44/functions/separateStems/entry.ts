import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

// Real audio source separation via the Demucs model hosted on Replicate (GPU).
// Two modes in one endpoint:
//   1) { audioUrl }        -> creates a prediction, returns { id, status }
//   2) { predictionId }    -> polls the prediction, returns { status, stems } when done
// stems: [{ name: "vocals"|"bass"|"drums"|"other", url }]

const REPLICATE_BASE = 'https://api.replicate.com/v1';
const MODEL = 'cjwbw/demucs';

function normalizeOutput(output) {
  const stems = [];
  if (!output) return stems;
  if (Array.isArray(output)) {
    output.forEach((url, i) => {
      if (typeof url === 'string' && /^https?:\/\//i.test(url)) stems.push({ name: `stem_${i}`, url });
    });
  } else if (typeof output === 'object') {
    for (const [k, v] of Object.entries(output)) {
      if (typeof v === 'string' && /^https?:\/\//i.test(v)) stems.push({ name: k, url: v });
    }
  } else if (typeof output === 'string' && /^https?:\/\//i.test(output)) {
    stems.push({ name: 'output', url: output });
  }
  return stems;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const token = secrets.get('REPLICATE_API_TOKEN');
    if (!token) return Response.json({ error: 'REPLICATE_API_TOKEN manquant' }, { status: 500 });

    const body = await req.json().catch(() => ({}));

    // Mode 1: create prediction
    if (body?.audioUrl) {
      const audioUrl = String(body.audioUrl).slice(0, 2000);
      if (!/^https?:\/\//i.test(audioUrl)) {
        return Response.json({ error: 'audioUrl invalide' }, { status: 400 });
      }

      // Resolve the latest model version SHA (community models need a pinned version).
      let version = '25a173108cff36ef9f80f854c162d01df9e6528be175794b81158fa03836d953';
      try {
        const vResp = await fetch(`${REPLICATE_BASE}/models/${MODEL}/versions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (vResp.ok) {
          const vData = await vResp.json();
          if (Array.isArray(vData?.results) && vData.results[0]?.id) {
            version = vData.results[0].id;
          }
        }
      } catch (e) { /* fall back to pinned version */ }

      const resp = await fetch(`${REPLICATE_BASE}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait=0'
        },
        body: JSON.stringify({ version, input: { audio: audioUrl } })
      });
      if (!resp.ok) {
        const t = await resp.text().catch(() => '');
        return Response.json({ error: `Replicate create ${resp.status}: ${t.slice(0, 300)}` }, { status: 502 });
      }
      const data = await resp.json();
      return Response.json({ id: data.id, status: data.status });
    }

    // Mode 2: poll prediction
    if (body?.predictionId) {
      const id = String(body.predictionId).slice(0, 200);
      const resp = await fetch(`${REPLICATE_BASE}/predictions/${encodeURIComponent(id)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) {
        return Response.json({ error: `Replicate poll ${resp.status}` }, { status: 502 });
      }
      const data = await resp.json();
      if (data.status === 'succeeded' || data.status === 'successful') {
        return Response.json({ status: 'succeeded', stems: normalizeOutput(data.output) });
      }
      if (data.status === 'failed' || data.status === 'canceled') {
        return Response.json({ status: data.status, error: data.error || 'Échec Replicate' });
      }
      return Response.json({ status: data.status });
    }

    return Response.json({ error: 'Paramètre audioUrl ou predictionId requis' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}