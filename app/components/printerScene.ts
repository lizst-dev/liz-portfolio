import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/**
 * Laser powder bed fusion, seen through the printer's viewing window.
 *
 * Per layer: four lasers fuse the cross-section, the build plate drops one layer, and the recoater arm
 * sweeps fresh powder across at the same height. Three thick layers are shown being built; the finished
 * part that is revealed is the full 40-layer impeller (the other layers "happen" under the powder).
 * Then the powder is blown off, the screen fades out, and the loop restarts.
 */

type PartMesh = THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshStandardMaterial>;
type Pt = { x: number; z: number; k: number };

export type PrinterScene = {
  /** Draws one frame at time `t` (seconds into the loop) without advancing. Used for the still frame. */
  renderAt: (t: number) => void;
  /** Starts the animation loop (resumes from where it stopped). */
  start: () => void;
  stop: () => void;
  resize: () => void;
  dispose: () => void;
  /** Time into the loop at which the finished part is on show. */
  stillTime: number;
  /** Where a first run should begin so the action starts immediately. */
  firstStart: number;
};

type Options = {
  /** Called every frame with the opacity (0-1) of the black overlay used to fade the loop in and out. */
  onFade: (opacity: number) => void;
  /** Debug: render a single frozen frame at this time. */
  freezeAt?: number | null;
  /** Where in the loop to begin (skips the opening fade so the lasers fire straight away). */
  startAt?: number;
};

// ---------- tunables ----------
const LAYERS = 3; // thick layers shown being built
const H = 0.9; // height of those 3 layers
const R = 1.75; // impeller radius
const BLADES = 8;
const LASERS = 4;
const L = 0.5; // powder surface height (constant: the plate moves down, not the arm)
const HF = 2.4; // finished part height
const NF = 40; // finished part layer count
const CRATER_R = 2.6; // build cylinder radius

const LASER_D = 2.5; // all four lasers finish a layer in this long
const LOWER_D = 0.5; // plate drops one layer
const SWEEP_D = 1.5; // arm sweep (LOWER_D + SWEEP_D = the 2 s recoat)
const T_BUILD0 = 1.2;
const T_LAYER = LASER_D + LOWER_D + SWEEP_D;
const T_BUILD1 = T_BUILD0 + LAYERS * T_LAYER;
const T_BLOW0 = T_BUILD1 + 0.8;
const T_BLOW1 = T_BLOW0 + 5.5;
const T_HOLD1 = T_BLOW1 + 2.5;
const T_FADE = 1.2;
const T_LOOP = T_HOLD1 + T_FADE;

// ---------- helpers ----------
const ease = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sstep = (a: number, b: number, x: number) => ease(clamp01((x - a) / (b - a)));
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const vnoise = (x: number, y: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return (hash(xi, yi) * (1 - u) + hash(xi + 1, yi) * u) * (1 - v) + (hash(xi, yi + 1) * (1 - u) + hash(xi + 1, yi + 1) * u) * v;
};
const fbm = (x: number, y: number) => {
  let a = 0.5, s = 0, f = 1;
  for (let i = 0; i < 4; i++) { s += a * vnoise(x * f, y * f); f *= 2.1; a *= 0.5; }
  return s;
};

// ---------- impeller geometry (one cross-section per layer) ----------
const rHub = (t: number) => 0.62 * (1 - 0.32 * t);
const rOut = (t: number) => R * (1 - 0.52 * Math.pow(t, 1.25));
const twist = (t: number) => 1.35 * t;
const bladeAngle = (i: number, s: number, t: number) => (i / BLADES) * Math.PI * 2 + twist(t) + 1.15 * Math.pow(s, 1.35) * (1 - 0.25 * t);
function bladeCenter(i: number, s: number, t: number): [number, number] {
  const r = rHub(t) * 0.8 + (rOut(t) - rHub(t) * 0.8) * s, a = bladeAngle(i, s, t);
  return [r * Math.cos(a), r * Math.sin(a)];
}
function layerShapes(t: number): THREE.Shape[] {
  const shapes: THREE.Shape[] = [];
  const hub = new THREE.Shape();
  hub.absarc(0, 0, rHub(t), 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.15, 0, Math.PI * 2, true);
  hub.holes.push(hole);
  const S = 14;
  // blade order matters: lasers fuse blades [0,2,4,6] first, then [1,3,5,7]; the hub ring is last
  for (const i of [0, 2, 4, 6, 1, 3, 5, 7]) {
    const left: [number, number][] = [], right: [number, number][] = [];
    for (let k = 0; k <= S; k++) {
      const s = k / S;
      const [x, y] = bladeCenter(i, s, t), [x2, y2] = bladeCenter(i, Math.min(1, s + 0.02), t), [x1, y1] = bladeCenter(i, Math.max(0, s - 0.02), t);
      let tx = x2 - x1, ty = y2 - y1;
      const m = Math.hypot(tx, ty) || 1;
      tx /= m; ty /= m;
      const w = 0.075 * (1.25 - 0.75 * s) * (1 - 0.25 * t);
      left.push([x - ty * w, y + tx * w]);
      right.push([x + ty * w, y - tx * w]);
    }
    const sh = new THREE.Shape();
    sh.moveTo(left[0][0], left[0][1]);
    left.slice(1).forEach((p) => sh.lineTo(p[0], p[1]));
    right.reverse().forEach((p) => sh.lineTo(p[0], p[1]));
    sh.closePath();
    shapes.push(sh);
  }
  shapes.push(hub);
  return shapes;
}

/** Laser j owns blades 2j and 2j+1, then a quarter of the hub ring. u runs 0..1 over that path. */
function laserPoint(layer: number, u: number, j: number): Pt {
  const t = (layer + 0.5) / LAYERS, seg = u * 3, k = Math.min(2, Math.floor(seg)), f = seg - k;
  let x: number, y: number;
  if (k < 2) [x, y] = bladeCenter(2 * j + k, f, t);
  else {
    const a = ((j + f) * Math.PI) / 2, r = rHub(t) * 0.85;
    x = r * Math.cos(a); y = r * Math.sin(a);
  }
  return { x, z: -y, k }; // z flipped to match rotateX(-90deg)
}

// ---------- terrain ----------
function bedHeight(x: number, z: number, withCrater: boolean) {
  const d = Math.hypot(x, z);
  const heaps = fbm(x * 0.35 + 3, z * 0.35 + 7) * 1.8 * sstep(2.0, 7, d) + fbm(x * 0.9, z * 0.9) * 0.35;
  const back = sstep(-3.5, -10, z) * (3.2 + 2.2 * fbm(x * 0.5 + 11, z * 0.5)) + sstep(4.5, 10, Math.abs(x)) * 2.4 * (0.6 + fbm(x * 0.4, z * 0.4));
  const h = L + (heaps + back) * sstep(CRATER_R + 0.15, CRATER_R + 3.2, d);
  return withCrater ? h * sstep(CRATER_R - 0.04, CRATER_R + 0.04, d) : h; // vertical-walled build cylinder
}
function makeBed() {
  const g = new THREE.PlaneGeometry(30, 20, 240, 160);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) p.setY(i, bedHeight(p.getX(i), p.getZ(i), true));
  g.computeVertexNormals();
  for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / 26, p.getZ(i) / 26); // world-space grain
  return g;
}
function makeDisc() {
  const g = new THREE.CircleGeometry(CRATER_R - 0.03, 120);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / 26, p.getZ(i) / 26);
  return g;
}
function powderTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 120 + Math.random() * 110;
    img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v * 1.03; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  g.globalAlpha = 0.35; g.filter = "blur(1px)"; g.drawImage(c, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 10);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
function radialTexture(size: number, stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export function createPrinterScene(container: HTMLElement, opts: Options): PrinterScene {
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  let pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; // reflections for the silver (part only)
  scene.background = new THREE.Color(0x0b0c0e);
  scene.fog = new THREE.FogExp2(0x0b0c0e, 0.03);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);

  scene.add(new THREE.HemisphereLight(0xaab3bf, 0x2a2d33, 1.9));
  const rim = new THREE.DirectionalLight(0xc9d3df, 1.5);
  rim.position.set(-4, 5, -3);
  scene.add(rim);

  // ---------- powder ----------
  const powderTex = powderTexture();
  const sweepPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -20);
  const powderMat = new THREE.MeshStandardMaterial({ map: powderTex, bumpMap: powderTex, bumpScale: 3.2, color: 0x80858c, roughness: 1, metalness: 0 });
  const coverMat = powderMat.clone();
  coverMat.clippingPlanes = [sweepPlane];
  const bed = new THREE.Mesh(makeBed(), powderMat);
  scene.add(bed);
  // powder inside the build cylinder rides on the plate; the second copy is what the arm lays down
  const discA = new THREE.Mesh(makeDisc(), powderMat);
  discA.position.y = L;
  scene.add(discA);
  const discC = new THREE.Mesh(makeDisc(), coverMat);
  discC.position.y = L;
  scene.add(discC);

  // ---------- recoater arm ----------
  const recoater = new THREE.Group();
  const armBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 5.4), new THREE.MeshStandardMaterial({ color: 0x5d636b, roughness: 0.45, metalness: 0.6 }));
  armBody.position.set(0.06, 0.16, 0);
  const armBlade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 5.4), new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.3, metalness: 0.9 }));
  armBlade.position.set(-0.01, 0.02, 0);
  const mound = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 5.0, 14), powderMat);
  mound.rotation.x = Math.PI / 2;
  mound.position.set(-0.16, 0.1, 0);
  recoater.add(armBody, armBlade, mound);
  recoater.visible = false;
  scene.add(recoater);
  let armHalf = CRATER_R + 0.5; // widened in resize() so the sweep crosses the whole banner

  // ---------- parts ----------
  function buildPart(n: number, height: number) {
    const grp = new THREE.Group();
    scene.add(grp);
    const d = height / n, arr: PartMesh[] = [];
    for (let i = 0; i < n; i++) {
      const g = new THREE.ExtrudeGeometry(layerShapes((i + 0.5) / n), { depth: d * 1.02, bevelEnabled: false, curveSegments: 24 });
      g.rotateX(-Math.PI / 2);
      g.translate(0, i * d, 0);
      const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 1, envMap: envTex, envMapIntensity: 0.55, emissive: 0xff7a1f, emissiveIntensity: 0 });
      const ends: number[] = [];
      for (let j = 0; j + 1 < g.groups.length; j += 2) ends.push(g.groups[j + 1].start + g.groups[j + 1].count);
      const mesh = new THREE.Mesh(g, m) as PartMesh;
      mesh.userData.ends = ends;
      mesh.visible = false;
      grp.add(mesh);
      arr.push(mesh);
    }
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(CRATER_R - 0.06, CRATER_R - 0.06, 0.14, 72),
      new THREE.MeshStandardMaterial({ color: 0xb8bec6, roughness: 0.3, metalness: 1, envMap: envTex, envMapIntensity: 0.4 }),
    );
    plate.position.y = -0.07;
    grp.add(plate);
    return { grp, arr, d };
  }
  const build = buildPart(LAYERS, H);
  const full = buildPart(NF, HF);
  const dh = build.d;
  full.grp.visible = false;
  full.arr.forEach((m) => (m.visible = true));
  const GROUP_Y_FULL = L - 0.02 - HF; // finished part: top just under the powder surface

  // ---------- blown powder ----------
  const DUST = 2000;
  const dPos = new Float32Array(DUST * 3), dCol = new Float32Array(DUST * 3), dVel = new Float32Array(DUST * 3);
  const dLife = new Float32Array(DUST), dMax = new Float32Array(DUST);
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  dGeo.setAttribute("color", new THREE.BufferAttribute(dCol, 3));
  const dustTex = radialTexture(64, [[0, "rgba(255,255,255,1)"], [1, "rgba(255,255,255,0)"]]);
  const dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ size: 0.085, map: dustTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  dust.frustumCulled = false;
  scene.add(dust);
  let dHead = 0;
  const emitDust = (y: number) => {
    const i = dHead++ % DUST, a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * (CRATER_R + 0.8);
    dPos.set([Math.cos(a) * r, y + 0.02, Math.sin(a) * r], i * 3);
    dVel[i * 3] = 2.5 + Math.random() * 4; dVel[i * 3 + 1] = 0.2 + Math.random() * 1.6; dVel[i * 3 + 2] = -1.4 + Math.random() * 1.8;
    dMax[i] = dLife[i] = 1.2 + Math.random() * 1.8;
  };

  // ---------- laser trail, glows, sparks ----------
  const TRAIL_MAX = 5000;
  const trailPos = new Float32Array(TRAIL_MAX * 6), trailCol = new Float32Array(TRAIL_MAX * 6), trailBirth = new Float32Array(TRAIL_MAX).fill(-1e9);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));
  const trail = new THREE.LineSegments(trailGeo, new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  trail.frustumCulled = false;
  scene.add(trail);
  let trailHead = 0;

  const glowTex = radialTexture(128, [[0, "rgba(255,250,235,1)"], [0.18, "rgba(255,200,120,.85)"], [0.5, "rgba(255,120,30,.25)"], [1, "rgba(255,90,10,0)"]]);
  const glows = Array.from({ length: LASERS }, () => {
    const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(2, 2, 2), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    g.scale.set(0.46, 0.46, 1);
    scene.add(g);
    return g;
  });
  const laserLights = Array.from({ length: 2 }, () => {
    const l = new THREE.PointLight(0xff9a3c, 0, 5, 2);
    scene.add(l);
    return l;
  });

  const SP = 700;
  const spPos = new Float32Array(SP * 6), spCol = new Float32Array(SP * 6), spVel = new Float32Array(SP * 3);
  const spLife = new Float32Array(SP), spMax = new Float32Array(SP);
  const spGeo = new THREE.BufferGeometry();
  spGeo.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
  spGeo.setAttribute("color", new THREE.BufferAttribute(spCol, 3));
  const sparks = new THREE.LineSegments(spGeo, new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  sparks.frustumCulled = false;
  scene.add(sparks);
  let spHead = 0;
  const emitSpark = (x: number, y: number, z: number) => {
    const i = spHead++ % SP, a = Math.random() * Math.PI * 2, sp = 1.2 + Math.random() * 3.4, up = 1.5 + Math.random() * 3.6;
    spPos[i * 6] = x; spPos[i * 6 + 1] = y; spPos[i * 6 + 2] = z; spPos[i * 6 + 3] = x; spPos[i * 6 + 4] = y; spPos[i * 6 + 5] = z;
    spVel[i * 3] = Math.cos(a) * sp * 0.8; spVel[i * 3 + 1] = up; spVel[i * 3 + 2] = Math.sin(a) * sp * 0.8;
    spMax[i] = spLife[i] = 0.35 + Math.random() * 0.8;
  };

  // ---------- post-processing ----------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.4, 1.2);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let camBaseY = 2.5, camBaseZ = 5.8;
  function resize() {
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight), a = w / h;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.setSize(w, h);
    camera.aspect = a;
    // keep the part framed at every aspect: pull back on tall/narrow screens
    const dist = a >= 1.5 ? 5.8 : 5.8 * Math.min(2.4, (1.5 / a) * 0.85 + 0.15);
    camBaseY = 2.5 * (dist / 5.4);
    camBaseZ = dist;
    camera.position.set(0, camBaseY, camBaseZ);
    camera.lookAt(0, 1.0, 0);
    camera.updateProjectionMatrix();
    // the arm crosses the full visible width (plus a margin) so the sweep uses the whole banner
    const halfVisible = Math.tan((camera.fov * Math.PI) / 360) * a * Math.hypot(camBaseZ, camBaseY - L);
    armHalf = Math.max(CRATER_R + 0.5, halfVisible + 0.8);
  }

  // ---------- state across frames ----------
  let lastU = 0, lastLayer = -1, prevT = 0, lastTrailT = -1e9;
  let loopT = opts.startAt ?? 0;

  function renderAt(t: number, dtIn?: number) {
    let dt = dtIn ?? Math.min(0.05, Math.max(0, t - prevT));
    if (t < prevT && dtIn === undefined) dt = 1 / 60;
    prevT = t;

    recoater.visible = false; discC.visible = false;
    let laserOn = false, laserU = 0, activeLayer = -1, groupY = 0, aY = 0, bedY = 0, blowP = 0, fade = 0;
    const topY = L + 0.016;
    const base = (k: number) => L + 0.004 - (k + 1) * dh;
    build.arr.forEach((m) => { m.visible = false; m.material.emissiveIntensity = 0; m.geometry.setDrawRange(0, Infinity); });
    build.grp.visible = true; full.grp.visible = false;

    if (t < T_BUILD0) {
      groupY = base(0);
      fade = 1 - ease(clamp01(t / (T_BUILD0 * 0.8)));
    } else if (t < T_BUILD1) {
      const k = Math.min(LAYERS - 1, Math.floor((t - T_BUILD0) / T_LAYER)), tc = t - T_BUILD0 - k * T_LAYER;
      activeLayer = k;
      for (let i = 0; i < k; i++) build.arr[i].visible = true;
      laserOn = tc < LASER_D;
      laserU = clamp01(tc / LASER_D);
      const lowered = tc < LASER_D ? 0 : ease(clamp01((tc - LASER_D) / LOWER_D)) * dh;
      groupY = base(k) - lowered;
      aY = -lowered;
      const m = build.arr[k];
      // fuse in steps: each laser's first blade, then second blades, then (nearly done) the hub ring
      const stage = laserU * 3 >= 2.9 ? 3 : Math.floor(laserU * 3);
      m.visible = stage >= 1;
      const ends = m.userData.ends as number[];
      if (stage === 1) m.geometry.setDrawRange(0, ends[3]);
      else if (stage === 2) m.geometry.setDrawRange(0, ends[7]);
      m.material.emissiveIntensity = tc < LASER_D ? 0.07 : 0.07 * Math.exp(-(tc - LASER_D) * 2);
      if (tc >= LASER_D + LOWER_D * 0.5) {
        // arm sweep: fresh powder laid at the constant height
        const sw = clamp01((tc - LASER_D - LOWER_D) / SWEEP_D), ex = -armHalf + sw * 2 * armHalf;
        discC.visible = true;
        sweepPlane.constant = ex;
        recoater.visible = sw > 0 && sw < 1;
        recoater.position.set(ex, L, 0);
      }
    } else {
      // the other 37 layers happened under the powder: swap in the full 40-layer part while it is buried
      build.grp.visible = false;
      full.grp.visible = true;
      full.grp.position.y = GROUP_Y_FULL;
      blowP = clamp01((t - T_BLOW0) / (T_BLOW1 - T_BLOW0));
      bedY = -(L - GROUP_Y_FULL + 0.136) * ease(clamp01((blowP - 0.1) / 0.85));
      if (t > T_HOLD1) fade = clamp01((t - T_HOLD1) / T_FADE);
    }
    build.grp.position.y = groupY;
    discA.position.y = L + aY + bedY;
    bed.position.y = bedY;
    opts.onFade(fade);

    // lasers: four, each on its own part of the layer
    const heads: (Pt | undefined)[] = [];
    if (laserOn) {
      if (lastLayer !== activeLayer || opts.freezeAt != null) { lastU = opts.freezeAt != null ? 0 : laserU; lastLayer = activeLayer; }
      const sub = Math.max(2, Math.min(40, Math.ceil(Math.abs(laserU - lastU) * 500)));
      for (let j = 0; j < LASERS; j++) {
        for (let s = 0; s < sub; s++) {
          const u0 = lastU + (laserU - lastU) * (s / sub), u1 = lastU + (laserU - lastU) * ((s + 1) / sub);
          const p = laserPoint(activeLayer, Math.min(0.9999, u0), j), q = laserPoint(activeLayer, Math.min(0.9999, u1), j);
          if (p.k === q.k) {
            const i = trailHead++ % TRAIL_MAX;
            trailBirth[i] = t; lastTrailT = t;
            trailPos[i * 6] = p.x; trailPos[i * 6 + 1] = topY; trailPos[i * 6 + 2] = p.z;
            trailPos[i * 6 + 3] = q.x; trailPos[i * 6 + 4] = topY; trailPos[i * 6 + 5] = q.z;
          }
          if (s === sub - 1) heads[j] = q;
          if (s === 0) for (let n = 0; n < 2; n++) emitSpark(p.x, topY + 0.02, p.z);
        }
      }
      lastU = laserU;
    } else lastLayer = -1;

    // blown powder
    if (blowP > 0.02 && blowP < 0.93) for (let n = 0; n < 40; n++) emitDust(L + bedY);
    if (t >= T_BLOW0 - 0.1 && t < T_BLOW1 + 3.6) for (let i = 0; i < DUST; i++) {
      if (dLife[i] > 0) {
        dLife[i] -= dt; dVel[i * 3] += 2.2 * dt; dVel[i * 3 + 1] -= 0.35 * dt;
        dPos[i * 3] += dVel[i * 3] * dt; dPos[i * 3 + 1] += dVel[i * 3 + 1] * dt; dPos[i * 3 + 2] += dVel[i * 3 + 2] * dt;
        const a = Math.max(0, dLife[i] / dMax[i]) * 0.2;
        dCol[i * 3] = a * 0.9; dCol[i * 3 + 1] = a * 0.92; dCol[i * 3 + 2] = a;
      } else dCol[i * 3] = dCol[i * 3 + 1] = dCol[i * 3 + 2] = 0;
    }
    if (t >= T_BLOW0 - 0.1 && t < T_BLOW1 + 3.6) { dGeo.attributes.position.needsUpdate = true; dGeo.attributes.color.needsUpdate = true; }

    // trail fade
    const LIFE = 0.5;
    const trailLive = laserOn || (t >= lastTrailT && t - lastTrailT <= LIFE + 0.1);
    if (trailLive) for (let i = 0; i < TRAIL_MAX; i++) {
      const age = t - trailBirth[i] + (t < trailBirth[i] ? T_LOOP : 0);
      const a = age < 0 || age > LIFE ? 0 : 1 - age / LIFE;
      const r = a * 1.8, g = Math.pow(a, 1.6) * 1.3, b = Math.pow(a, 4) * 0.8;
      for (let v = 0; v < 2; v++) { trailCol[i * 6 + v * 3] = r; trailCol[i * 6 + v * 3 + 1] = g; trailCol[i * 6 + v * 3 + 2] = b; }
    }
    if (trailLive) { trailGeo.attributes.position.needsUpdate = true; trailGeo.attributes.color.needsUpdate = true; }

    // sparks
    const sparksLive = t >= T_BUILD0 && t < T_BUILD1 + 2.2;
    if (sparksLive) for (let i = 0; i < SP; i++) {
      if (spLife[i] > 0) {
        spLife[i] -= dt; spVel[i * 3 + 1] -= 7.5 * dt;
        const x = spPos[i * 6 + 3] + spVel[i * 3] * dt, y = spPos[i * 6 + 4] + spVel[i * 3 + 1] * dt, z = spPos[i * 6 + 5] + spVel[i * 3 + 2] * dt;
        spPos[i * 6] = x - spVel[i * 3] * 0.022; spPos[i * 6 + 1] = y - spVel[i * 3 + 1] * 0.022; spPos[i * 6 + 2] = z - spVel[i * 3 + 2] * 0.022;
        spPos[i * 6 + 3] = x; spPos[i * 6 + 4] = y; spPos[i * 6 + 5] = z;
        const a = Math.max(0, spLife[i] / spMax[i]);
        const c0 = 1.6 * a, c1 = a * a, c2 = 0.35 * a * a * a;
        spCol[i * 6] = c0; spCol[i * 6 + 1] = c1; spCol[i * 6 + 2] = c2; spCol[i * 6 + 3] = c0; spCol[i * 6 + 4] = c1; spCol[i * 6 + 5] = c2;
      } else spCol.fill(0, i * 6, i * 6 + 6);
    }
    if (sparksLive) { spGeo.attributes.position.needsUpdate = true; spGeo.attributes.color.needsUpdate = true; }

    // laser lights and glows (two shared lights, one per pair of lasers: cheaper than four)
    const flick = 0.85 + Math.random() * 0.3;
    for (let k = 0; k < 2; k++) {
      const h1 = heads[2 * k], h2 = heads[2 * k + 1];
      laserLights[k].intensity = laserOn && h1 && h2 ? 1.3 * flick : 0;
      if (h1 && h2) laserLights[k].position.set(((h1.x + h2.x) / 2) * 0.8, L + 0.8, ((h1.z + h2.z) / 2) * 0.8);
    }
    for (let j = 0; j < LASERS; j++) {
      const h = heads[j];
      if (h) glows[j].position.set(h.x, topY + 0.05, h.z);
      glows[j].visible = laserOn && !!h;
      glows[j].material.opacity = flick;
    }

    // camera: a slow breathing drift, then a pull-back and tilt-down to frame the finished part
    const sway = Math.sin((t / T_LOOP) * Math.PI * 2) * 0.06, cp = ease(blowP);
    camera.position.set(sway, camBaseY - 1.0 * cp, camBaseZ + 2.2 * cp);
    camera.lookAt(0, 1.0 - 1.55 * cp, 0);

    composer.render();
  }

  // ---------- loop control ----------
  let raf = 0, last = 0, running = false, slow = 0, cooldown = 0;
  const tick = (now: number) => {
    if (!running) return;
    const raw = (now - last) / 1000;
    const dt = Math.min(0.1, raw);
    last = now;
    // adaptive quality: if frames keep taking too long, render fewer pixels, then drop the bloom
    if (cooldown > 0) cooldown--;
    else if (raw > 0.032) { if (++slow >= 20) { slow = 0; cooldown = 40; if (pixelRatio > 0.8) { pixelRatio = Math.max(0.75, pixelRatio - 0.25); renderer.setPixelRatio(pixelRatio); composer.setPixelRatio(pixelRatio); resize(); } else bloom.enabled = false; } }
    else slow = Math.max(0, slow - 1);
    loopT = (loopT + dt) % T_LOOP;
    renderAt(loopT, dt);
    raf = requestAnimationFrame(tick);
  };
  resize();

  return {
    stillTime: T_BLOW1 + 0.5,
    firstStart: T_BUILD0 * 0.8,
    renderAt: (t: number) => renderAt(t, 1 / 60),
    start() {
      if (running || opts.freezeAt != null) { if (opts.freezeAt != null) renderAt(opts.freezeAt, 1 / 60); return; }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
      });
      [powderTex, dustTex, glowTex, envTex].forEach((t) => t.dispose());
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
