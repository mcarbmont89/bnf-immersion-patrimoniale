import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Generates a view for the WebXR viewer and returns it BOTH as a URL and as a data URL.
// WebGL can only use a texture from another origin when that host sends CORS headers,
// so the image is fetched here and handed back inline.
//   mode "pano" -> asks the model for a 2:1 equirectangular panorama (experimental)
//   mode "flat" -> same prompt as generateImmersionView
const PANO_SUFFIX =
  ' Equirectangular 360-degree spherical panorama, 2:1 aspect ratio, seamless left and right edges, ' +
  'full interior view with floor and ceiling, no people looking at the camera, no text overlays.';
const MAX_BYTES = 12 * 1024 * 1024;

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    const mode = body?.mode === 'pano' ? 'pano' : 'flat';
    if (!prompt || prompt.length > 1700) {
      return Response.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: mode === 'pano' ? prompt + PANO_SUFFIX : prompt
    });
    const url = result?.url;
    if (!url) return Response.json({ error: 'No image returned' }, { status: 502 });

    let dataUrl = null;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buf = new Uint8Array(await res.arrayBuffer());
        if (buf.length <= MAX_BYTES) {
          const type = res.headers.get('content-type') || 'image/png';
          dataUrl = `data:${type};base64,${toBase64(buf)}`;
        }
      }
    } catch (_e) {
      // keep dataUrl null: the client falls back to the plain URL
    }
    return Response.json({ url, dataUrl, mode });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
