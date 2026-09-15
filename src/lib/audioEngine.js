// Real Web Audio API HRTF binaural engine for the Mixeur 3D tab.
// Each stem now plays its OWN separated AudioBuffer (Demucs output) — no EQ filter.
// Singleton imported across components. AudioContext is created lazily
// on the first user gesture (browser autoplay policy).

function setPannerPosition(panner, x, y, z, t) {
  if (panner.positionX) {
    panner.positionX.setValueAtTime(x, t);
    panner.positionY.setValueAtTime(y, t);
    panner.positionZ.setValueAtTime(z, t);
  } else if (typeof panner.setPosition === 'function') {
    panner.setPosition(x, y, z);
  }
}

function makePanner(ctx) {
  const panner = ctx.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'exponential';
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;
  return panner;
}

export function sphericalToCartesian(azDeg, elDeg, dist) {
  const az = (azDeg * Math.PI) / 180;
  const el = (elDeg * Math.PI) / 180;
  return {
    x: dist * Math.sin(az) * Math.cos(el),
    y: dist * Math.sin(el),
    z: -dist * Math.cos(az) * Math.cos(el)
  };
}

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.stems = new Map(); // trackId -> { buffer, panner, gain, inputNode, source, playing }
  }

  ensureContext() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctor();
    }
    return this.ctx;
  }

  async resume() {
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (e) { /* ignore */ }
    }
  }

  async loadFromArrayBuffer(arrayBuffer) {
    const ctx = this.ensureContext();
    return await ctx.decodeAudioData(arrayBuffer.slice(0));
  }

  // 45 peak-amplitude bars normalized 0..1 from a buffer's first channel.
  computeWaveform(buffer, bars = 45) {
    const ch = buffer.getChannelData(0);
    const bucket = Math.max(1, Math.floor(ch.length / bars));
    const out = [];
    for (let i = 0; i < bars; i++) {
      let peak = 0;
      const start = i * bucket;
      for (let j = 0; j < bucket; j++) {
        const v = Math.abs(ch[start + j] || 0);
        if (v > peak) peak = v;
      }
      out.push(peak);
    }
    const max = Math.max(...out, 0.0001);
    return out.map((v) => Math.max(0.06, Math.min(1, v / max)));
  }

  // Create a persistent stem graph: source -> [filter?] -> HRTF panner -> gain -> out.
  // filterType is optional; when omitted the stem plays its raw separated buffer.
  createStem(trackId, buffer, volume, filterType, filterFreq) {
    const ctx = this.ensureContext();
    const panner = makePanner(ctx);
    const gain = ctx.createGain();
    gain.gain.value = (volume ?? 80) / 100;
    let inputNode;
    if (filterType) {
      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = filterFreq ?? 1000;
      filter.Q.value = 0.7;
      filter.connect(panner);
      inputNode = filter;
    } else {
      inputNode = panner;
    }
    panner.connect(gain);
    gain.connect(ctx.destination);
    this.stems.set(trackId, { buffer, panner, gain, inputNode, source: null, playing: false });
    return this.stems.get(trackId);
  }

  setPosition(trackId, az, el, dist) {
    const n = this.stems.get(trackId);
    if (!n) return;
    const { x, y, z } = sphericalToCartesian(az, el, dist);
    setPannerPosition(n.panner, x, y, z, this.ctx.currentTime);
  }

  setVolume(trackId, pct) {
    const n = this.stems.get(trackId);
    if (!n) return;
    n.gain.gain.setValueAtTime(pct / 100, this.ctx.currentTime);
  }

  play(trackId) {
    const n = this.stems.get(trackId);
    if (!n || n.playing) return;
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = n.buffer;
    src.loop = true;
    src.connect(n.inputNode);
    src.start(0);
    n.source = src;
    n.playing = true;
  }

  stop(trackId) {
    const n = this.stems.get(trackId);
    if (!n || !n.playing) return;
    try { n.source.stop(); } catch (e) { /* already stopped */ }
    try { n.source.disconnect(); } catch (e) { /* ignore */ }
    n.source = null;
    n.playing = false;
  }

  isPlaying(trackId) {
    return this.stems.get(trackId)?.playing || false;
  }

  playAll() {
    this.stems.forEach((_, id) => this.play(id));
  }

  stopAll() {
    this.stems.forEach((_, id) => this.stop(id));
  }

  clear() {
    this.stopAll();
    this.stems.clear();
  }

  // Render the full binaural mix offline for WAV export. Each stem uses its own buffer.
  async renderMix(stemsConfig, durationSec) {
    const sampleRate = stemsConfig[0].buffer.sampleRate;
    const length = Math.ceil(Math.min(durationSec, stemsConfig[0].buffer.duration) * sampleRate);
    const OfflineCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const offline = new OfflineCtor(2, length, sampleRate);
    for (const s of stemsConfig) {
      const src = offline.createBufferSource();
      src.buffer = s.buffer;
      src.loop = true;
      let node = src;
      if (s.filterType) {
        const filter = offline.createBiquadFilter();
        filter.type = s.filterType;
        filter.frequency.value = s.filterFreq;
        filter.Q.value = 0.7;
        src.connect(filter);
        node = filter;
      }
      const panner = makePanner(offline);
      const gain = offline.createGain();
      gain.gain.value = (s.volume ?? 80) / 100;
      const { x, y, z } = sphericalToCartesian(s.az, 0, s.dist);
      setPannerPosition(panner, x, y, z, 0);
      node.connect(panner);
      panner.connect(gain);
      gain.connect(offline.destination);
      src.start(0);
    }
    return await offline.startRendering();
  }
}

export const audioEngine = new AudioEngine();