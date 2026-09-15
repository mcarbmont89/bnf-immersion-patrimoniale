// Lightweight client-side stem separation via center-channel (mid-side) extraction.
// No backend, no API keys, no model download. Works on STEREO sources only:
//   - vocals     = (L + R) / 2  -> center-panned content (lead voice + center instruments)
//   - instrumental = (L - R) / 2 -> stereo difference (panned instruments, center cancelled)
// Mono sources cannot be separated this way: vocals gets the full mix, instrumental is silent.

import { audioEngine } from "./audioEngine";

export function separateCenterChannel(audioBuffer) {
  const ctx = audioEngine.ensureContext();
  const sr = audioBuffer.sampleRate;
  const len = audioBuffer.length;
  const nch = audioBuffer.numberOfChannels;

  const vocalsBuf = ctx.createBuffer(1, len, sr);
  const instrBuf = ctx.createBuffer(1, len, sr);
  const vData = vocalsBuf.getChannelData(0);
  const iData = instrBuf.getChannelData(0);

  if (nch >= 2) {
    const L = audioBuffer.getChannelData(0);
    const R = audioBuffer.getChannelData(1);
    for (let i = 0; i < len; i++) {
      const l = L[i], r = R[i];
      vData[i] = (l + r) * 0.5;
      iData[i] = (l - r) * 0.5;
    }
    return { vocals: vocalsBuf, instrumental: instrBuf, isMono: false };
  }

  // Mono fallback: no spatial separation possible.
  const M = audioBuffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    vData[i] = M[i];
    iData[i] = 0;
  }
  return { vocals: vocalsBuf, instrumental: instrBuf, isMono: true };
}