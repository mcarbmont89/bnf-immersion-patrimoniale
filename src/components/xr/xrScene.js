// Builds the A-Frame scene and keeps it in sync with a scene spec.
// Kept free of React so it can be tested on its own.

const AFRAME_SRC = "https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe-v1.5.0.min.js";

export function loadAFrame() {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.AFRAME) return Promise.resolve(window.AFRAME);
  if (window.__aframePromise) return window.__aframePromise;
  window.__aframePromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = AFRAME_SRC;
    s.async = true;
    s.onload = () => (window.AFRAME ? resolve(window.AFRAME) : reject(new Error("A-Frame not available")));
    s.onerror = () => {
      window.__aframePromise = null;
      reject(new Error("No se pudo cargar A-Frame"));
    };
    document.head.appendChild(s);
  });
  return window.__aframePromise;
}

// Draw a title and wrapped text on a canvas (no external fonts or textures needed).
function drawPanel(canvas, { title = "", text = "", size = 34, center = false, bg = "#0D1117", accent = "#00C4AA", fg = "#F3F4F6" }) {
  const w = canvas.width;
  const h = canvas.height;
  const x = canvas.getContext("2d");
  x.fillStyle = bg;
  x.fillRect(0, 0, w, h);
  x.strokeStyle = accent;
  x.lineWidth = 4;
  x.strokeRect(6, 6, w - 12, h - 12);
  const pad = 28;
  let y = pad + size * 0.9;
  x.textBaseline = "alphabetic";
  x.textAlign = center ? "center" : "left";
  const tx = center ? w / 2 : pad;
  if (title) {
    x.fillStyle = accent;
    x.font = `bold ${size}px Georgia, serif`;
    x.fillText(title, tx, y, w - pad * 2);
    y += size * 1.3;
  }
  x.fillStyle = fg;
  x.font = `${Math.round(size * 0.85)}px Georgia, serif`;
  const words = text.split(" ");
  let line = "";
  const lh = size * 1.2;
  for (const word of words) {
    const t = line ? `${line} ${word}` : word;
    if (x.measureText(t).width > w - pad * 2 && line) {
      x.fillText(line, tx, y);
      y += lh;
      line = word;
    } else {
      line = t;
    }
  }
  if (line) x.fillText(line, tx, y);
}

export function registerComponents(AFRAME) {
  if (AFRAME.components["quai-label"]) return;
  const THREE = AFRAME.THREE;

  AFRAME.registerComponent("quai-label", {
    schema: {
      title: { default: "" },
      text: { default: "" },
      w: { default: 768 },
      h: { default: 384 },
      size: { default: 34 },
      center: { default: false },
      bg: { default: "#0D1117" }
    },
    init() {
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.data.w;
      this.canvas.height = this.data.h;
      this.tex = null;
    },
    update() {
      const d = this.data;
      if (this.canvas.width !== d.w) this.canvas.width = d.w;
      if (this.canvas.height !== d.h) this.canvas.height = d.h;
      drawPanel(this.canvas, d);
      if (!this.tex) {
        this.tex = new THREE.CanvasTexture(this.canvas);
        if (THREE.SRGBColorSpace) this.tex.colorSpace = THREE.SRGBColorSpace;
        const apply = () => {
          const mesh = this.el.getObject3D("mesh");
          if (!mesh) return false;
          mesh.material.map = this.tex;
          mesh.material.transparent = true;
          mesh.material.needsUpdate = true;
          return true;
        };
        if (!apply()) this.el.addEventListener("object3dset", apply, { once: true });
      }
      this.tex.needsUpdate = true;
    }
  });

  AFRAME.registerComponent("quai-billboard", {
    init() {
      this.p = new THREE.Vector3();
    },
    tick() {
      const cam = this.el.sceneEl.camera;
      if (!cam) return;
      cam.getWorldPosition(this.p);
      this.el.object3D.lookAt(this.p);
    }
  });

  AFRAME.registerComponent("quai-listener", {
    init() {
      this.p = new THREE.Vector3();
      this.f = new THREE.Vector3();
      this.u = new THREE.Vector3();
      this.q = new THREE.Quaternion();
    },
    tick(time) {
      const sc = this.el;
      const sounds = sc.__quaiSounds;
      const cam = sc.camera;
      if (!sounds || !cam) return;
      cam.getWorldPosition(this.p);
      cam.getWorldDirection(this.f);
      cam.getWorldQuaternion(this.q);
      this.u.set(0, 1, 0).applyQuaternion(this.q);
      sounds.setListener(this.p, this.f, this.u);
      sounds.tick(time);
      const now = performance.now();
      sounds.sources.forEach((s) => {
        const m = sc.__quaiMarkers && sc.__quaiMarkers[s.id];
        if (!m) return;
        m.object3D.position.set(s.pos.x, s.pos.y, s.pos.z);
        const k = 1 + 0.9 * Math.exp(-((now - s.lastPulse) / 1000) * 4);
        m.object3D.scale.set(k, k, k);
      });
    }
  });
}

const SCENE_HTML = `
<a-scene embedded vr-mode-ui="enterARButton: #q-ar" renderer="antialias:true" loading-screen="enabled:false"
  background="color:#0A0D12" quai-listener style="width:100%;height:100%">
  <a-circle id="q-floor" radius="1.2" rotation="-90 0 0" material="color:#10151c;shader:flat"></a-circle>
  <a-entity id="q-world"></a-entity>
  <a-entity id="q-rig">
    <a-entity id="q-cam" camera look-controls position="0 1.6 0" cursor="rayOrigin:mouse" raycaster="objects:.q-click"></a-entity>
    <a-entity laser-controls="hand:right" raycaster="objects:.q-click;far:12"></a-entity>
    <a-entity laser-controls="hand:left" raycaster="objects:.q-click;far:12"></a-entity>
  </a-entity>
</a-scene>`;

function el(tag, attrs = {}) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

export function createXRScene(AFRAME, container, handlers = {}) {
  registerComponents(AFRAME);
  container.innerHTML = SCENE_HTML;
  const sceneEl = container.querySelector("a-scene");
  const world = sceneEl.querySelector("#q-world");
  const floor = sceneEl.querySelector("#q-floor");
  sceneEl.__quaiMarkers = {};

  const inAR = () => sceneEl.is("ar-mode");
  sceneEl.addEventListener("enter-vr", () => {
    if (inAR()) {
      world.querySelectorAll(".q-bg").forEach((n) => n.setAttribute("visible", "false"));
      floor.setAttribute("visible", "false");
    }
    handlers.onEnterXR && handlers.onEnterXR();
  });
  sceneEl.addEventListener("exit-vr", () => {
    world.querySelectorAll(".q-bg").forEach((n) => n.setAttribute("visible", "true"));
    floor.setAttribute("visible", "true");
  });

  function clear() {
    while (world.firstChild) world.removeChild(world.firstChild);
    sceneEl.__quaiMarkers = {};
  }

  // image: { src, aspect, mode: "pano" | "flat" }
  function setWorld(spec, image) {
    clear();
    if (image && image.src) {
      if (image.mode === "pano") {
        world.appendChild(el("a-sky", { class: "q-bg", src: image.src, radius: "60", rotation: "0 -90 0", material: "shader:flat" }));
      } else {
        const h = 3.2;
        const w = Math.min(7, h * (image.aspect || 1.5));
        world.appendChild(el("a-plane", { class: "q-bg", position: "0 1.7 -4.2", width: String(w), height: String(h), material: `src:${image.src};shader:flat` }));
      }
    }
    // caption on the floor: always says what the image is
    world.appendChild(el("a-plane", {
      position: "0 0.05 -1.6", rotation: "-70 0 0", width: "1.8", height: "0.5",
      "quai-label": `title:${spec.space.name};text:Reconstruction illustrative générée par IA;w:900;h:250;size:44;center:true`
    }));
    spec.hotspots.forEach((h) => {
      const g = el("a-entity", { class: "q-click", position: `${h.pos.x} ${h.pos.y + 1.6} ${h.pos.z}`, "quai-billboard": "" });
      g.appendChild(el("a-sphere", { radius: h.type === "nav" ? "0.14" : "0.11", material: `shader:flat;color:${h.type === "nav" ? "#00C4AA" : "#F5C84B"}` }));
      const label = el("a-plane", { position: "0 0.3 0", width: "1.1", height: "0.28", "quai-label": `text:${h.label};w:640;h:160;size:40;center:true` });
      g.appendChild(label);
      g.addEventListener("click", () => handlers.onHotspot && handlers.onHotspot(h, g));
      world.appendChild(g);
    });
  }

  function showInfo(h) {
    const old = world.querySelector("#q-info");
    if (old) world.removeChild(old);
    const p = el("a-plane", {
      id: "q-info", position: `${h.pos.x} ${h.pos.y + 1.6 + 0.9} ${h.pos.z}`, width: "1.8", height: "0.9",
      "quai-billboard": "", "quai-label": `title:${h.label};text:${h.text};w:900;h:450;size:38`
    });
    world.appendChild(p);
  }

  function attachSounds(sounds) {
    sceneEl.__quaiSounds = sounds;
    sceneEl.__quaiMarkers = {};
    const holder = el("a-entity", { id: "q-sources" });
    sounds.sources.forEach((s) => {
      const m = el("a-sphere", { radius: "0.09", material: "shader:flat;color:#4fb3a5;opacity:0.85;transparent:true" });
      m.setAttribute("position", `${s.pos.x} ${s.pos.y + 1.6} ${s.pos.z}`);
      sceneEl.__quaiMarkers[s.id] = m;
      holder.appendChild(m);
    });
    const prev = world.querySelector("#q-sources");
    if (prev) world.removeChild(prev);
    world.appendChild(holder);
  }

  return { sceneEl, setWorld, showInfo, attachSounds, dispose: () => { container.innerHTML = ""; } };
}
