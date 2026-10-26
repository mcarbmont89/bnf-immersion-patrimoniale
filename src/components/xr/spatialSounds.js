// Positional (HRTF) sound sources for the XR viewer.
// Same Web Audio technique as the Mixeur (PannerNode with the HRTF model), but each source is
// placed from a scene spec and the listener follows the headset or camera.
import { audioEngine, sphericalToCartesian } from "@/lib/audioEngine";

function noiseBuffer(ctx, seconds) {
  const n = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

const EYE = 1.6; // sources are described relative to ear height; the camera sits at this height

function setPos(p, x, y0, z) {
  const y = y0 + EYE;
  if (p.positionX) {
    p.positionX.value = x;
    p.positionY.value = y;
    p.positionZ.value = z;
  } else if (typeof p.setPosition === "function") {
    p.setPosition(x, y, z);
  }
}

export class SpatialSounds {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sources = []; // { id, label, panner, pos:{x,y,z}, orbit, lastPulse }
    this.stoppables = [];
    this.timers = [];
    this.muted = false;
  }

  async start(defs) {
    await audioEngine.resume();
    this.ctx = audioEngine.ensureContext();
    this.stop();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);
    defs.forEach((d) => this._add(d));
  }

  stop() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    this.stoppables.forEach((n) => {
      try { n.stop(); } catch { /* already stopped */ }
    });
    this.stoppables = [];
    if (this.master) {
      try { this.master.disconnect(); } catch { /* ignore */ }
      this.master = null;
    }
    this.sources = [];
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.9;
  }

  _panner(def) {
    const p = this.ctx.createPanner();
    p.panningModel = "HRTF";
    p.distanceModel = "inverse";
    p.refDistance = 1;
    p.maxDistance = 25;
    p.rolloffFactor = 1.1;
    p.connect(this.master);
    setPos(p, def.pos.x, def.pos.y, def.pos.z);
    return p;
  }

  _register(def, panner) {
    const src = {
      id: def.id,
      label: def.label,
      panner,
      pos: { ...def.pos },
      orbit: def.orbit ? { speed: def.orbit, r: Math.hypot(def.pos.x, def.pos.z) || 3, y: def.pos.y } : null,
      lastPulse: -1e9
    };
    this.sources.push(src);
    return src;
  }

  _loop(fn, minMs, maxMs) {
    const run = () => {
      fn();
      this.timers.push(setTimeout(run, minMs + Math.random() * (maxMs - minMs)));
    };
    run();
  }

  _add(def) {
    const ctx = this.ctx;
    const panner = this._panner(def);
    const src = this._register(def, panner);
    const pulse = () => { src.lastPulse = performance.now(); };

    if (def.kind === "ambience") {
      const s = ctx.createBufferSource();
      s.buffer = noiseBuffer(ctx, 3);
      s.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = def.cutoff || 520;
      const g = ctx.createGain();
      g.gain.value = def.gain || 0.07;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lg = ctx.createGain();
      lg.gain.value = (def.gain || 0.07) * 0.4;
      lfo.connect(lg);
      lg.connect(g.gain);
      s.connect(lp); lp.connect(g); g.connect(panner);
      s.start(); lfo.start();
      this.stoppables.push(s, lfo);
    } else if (def.kind === "pages") {
      this._loop(() => {
        if (!this.master) return;
        const t = ctx.currentTime;
        const b = ctx.createBufferSource();
        b.buffer = noiseBuffer(ctx, 0.4);
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass"; bp.frequency.value = 2800; bp.Q.value = 0.8;
        const e = ctx.createGain();
        e.gain.setValueAtTime(0, t);
        e.gain.linearRampToValueAtTime(0.22, t + 0.04);
        e.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        b.connect(bp); bp.connect(e); e.connect(panner);
        b.start(t); b.stop(t + 0.4);
        pulse();
      }, 2000, 4500);
    } else if (def.kind === "guide") {
      // Placeholder tone. Replace with a Gallica extract through setBuffer().
      this._loop(() => {
        if (!this.master) return;
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        o.type = "sine"; o.frequency.value = 660;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.25, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
        o.connect(g); g.connect(panner);
        o.start(t); o.stop(t + 1.5);
        pulse();
      }, (def.intervalS || 4) * 1000, (def.intervalS || 4) * 1000);
    } else if (def.kind === "music") {
      [220, 277.18, 329.63].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "sine"; o.frequency.value = f * (1 + i * 0.0007);
        const og = ctx.createGain();
        og.gain.value = 0.05;
        const l2 = ctx.createOscillator();
        l2.frequency.value = 0.1 + i * 0.04;
        const lg2 = ctx.createGain();
        lg2.gain.value = 0.025;
        l2.connect(lg2); lg2.connect(og.gain);
        o.connect(og); og.connect(panner);
        o.start(); l2.start();
        this.stoppables.push(o, l2);
      });
      pulse();
    } else if (def.kind === "hum") {
      const o = ctx.createOscillator();
      o.type = "sawtooth"; o.frequency.value = 55;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 180;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      o.connect(lp); lp.connect(g); g.connect(panner);
      o.start();
      this.stoppables.push(o);
      pulse();
    }
  }

  // p, f, u are plain {x,y,z} objects: listener position, forward and up vectors.
  setListener(p, f, u) {
    if (!this.ctx) return;
    const L = this.ctx.listener;
    if (L.positionX) {
      L.positionX.value = p.x; L.positionY.value = p.y; L.positionZ.value = p.z;
      L.forwardX.value = f.x; L.forwardY.value = f.y; L.forwardZ.value = f.z;
      L.upX.value = u.x; L.upY.value = u.y; L.upZ.value = u.z;
    } else {
      L.setPosition(p.x, p.y, p.z);
      L.setOrientation(f.x, f.y, f.z, u.x, u.y, u.z);
    }
  }

  tick(timeMs) {
    this.sources.forEach((s) => {
      if (!s.orbit) return;
      const a = (timeMs / 1000) * s.orbit.speed;
      s.pos.x = s.orbit.r * Math.cos(a);
      s.pos.z = s.orbit.r * Math.sin(a);
      s.pos.y = s.orbit.y;
      setPos(s.panner, s.pos.x, s.pos.y, s.pos.z);
    });
  }

  // Replace the placeholder tone of a source with a real recording (an AudioBuffer).
  setBuffer(id, buffer) {
    const s = this.sources.find((x) => x.id === id);
    if (!s || !this.ctx) return false;
    const n = this.ctx.createBufferSource();
    n.buffer = buffer;
    n.loop = true;
    n.connect(s.panner);
    n.start();
    this.stoppables.push(n);
    return true;
  }
}

export { sphericalToCartesian };
