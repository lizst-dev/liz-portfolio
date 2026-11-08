"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type SceneKey = "seattle" | "michigan";

/** Both scenes are 1257x832 with the same art-pixel size (~3.85px in the source), so they display identically. */
const SCENES: Record<SceneKey, { src: string; alt: string; className: string; focus: { mobile: number; desktop: number }; shift?: { svh: number; svhDesktop: number; fill: string } }> = {
  michigan: {
    src: "/images/hero.jpg",
    alt: "Pixel-art scene of a red lighthouse on a pier at sunset, waves rolling toward a dune with beach grass.",
    className: "object-[72%_50%] md:object-[50%_50%]",
    focus: { mobile: 0.72, desktop: 0.5 },
  },
  seattle: {
    src: "/images/seattle-hero-v2.jpg",
    alt: "Pixel-art skyline of Seattle at sunset: the Space Needle, downtown towers, and Mount Rainier behind green trees.",
    // Nudged down so the name (kept at the same height as in the Michigan scene) mostly clears the Space Needle's spire; the gap on top is filled with the
    // picture's own navy, and the (solid teal) bottom edge is cropped.
    className: "object-[30%_50%] md:object-[50%_50%] translate-y-[7svh] md:translate-y-[11svh]",
    focus: { mobile: 0.3, desktop: 0.5 },
    shift: { svh: 0.07, svhDesktop: 0.11, fill: "#0f1745" },
  },
};

const CELL = 48; // target flap size in CSS px (the grid is rounded so tiles fill the hero evenly)

// Split-flap timing (ms): every tile flips once, in a steady wave
const FLAP = 200; // each half of a flap
const WAVE = 900; // delay spread left to right
const ROW = 250; // extra delay top to bottom
const JITTER = 120; // a little per-tile randomness

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uOld;
uniform sampler2D uNew;
uniform vec2 uRes;
uniform vec2 uTile;
uniform float uTime;
uniform float uCols;
uniform float uRows;
uniform float uWave;
uniform float uRow;
uniform float uJit;
uniform float uA;
uniform float uSeam;

const float HALF_PI = 1.5707963;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Card j of a tile: 0 is the old picture, F (the last one) is the new picture, and the cards in
// between are shuffled pieces borrowed from elsewhere in either picture, like the letters a
// split-flap board cycles through before it lands on the right one.
vec3 card(float j, float F, vec2 tid, vec2 local) {
  if (j <= 0.0) return texture2D(uOld, (tid * uTile + local) / uRes).rgb;
  if (j >= F) return texture2D(uNew, (tid * uTile + local) / uRes).rgb;
  vec2 src = floor(vec2(hash(tid + j * 7.31), hash(tid + j * 3.17 + 9.1)) * vec2(uCols, uRows));
  vec2 uvv = (src * uTile + local) / uRes;
  return mix(texture2D(uOld, uvv).rgb, texture2D(uNew, uvv).rgb, step(0.5, hash(tid + j * 1.9 + 4.4)));
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 tid = floor(px / uTile);
  vec2 local = px - tid * uTile;
  float fy = local.y / uTile.y;

  float d = tid.x / uCols * uWave + tid.y / uRows * uRow + hash(tid) * uJit;
  float t = uTime - d;

  // each tile flips once, from the old picture to the new one
  float F = 1.0;
  float flipT = 2.0 * uA;

  vec3 col;
  if (t <= 0.0) {
    col = card(0.0, F, tid, local);
  } else if (t >= F * flipT) {
    col = card(F, F, tid, local);
  } else {
    float j = floor(t / flipT);
    float u = t - j * flipT;
    if (fy < 0.5) {
      if (u >= uA) {
        col = card(j + 1.0, F, tid, local);
      } else {
        // top half of the current card falls forward, revealing the next card beneath
        float s = max(cos(u / uA * HALF_PI), 0.001);
        float edge = 0.5 - 0.5 * s;
        if (fy < edge) {
          col = card(j + 1.0, F, tid, local);
        } else {
          float v = (fy - edge) / (0.5 * s);
          col = card(j, F, tid, vec2(local.x, v * 0.5 * uTile.y)) * (0.55 + 0.45 * s);
        }
      }
    } else {
      if (u <= uA) {
        col = card(j, F, tid, local);
      } else {
        // bottom half of the next card swings down from the hinge
        float s = max(sin((u - uA) / uA * HALF_PI), 0.001);
        float edge = 0.5 + 0.5 * s;
        if (fy >= edge) {
          col = card(j, F, tid, local);
        } else {
          float v = (fy - 0.5) / (0.5 * s);
          col = card(j + 1.0, F, tid, vec2(local.x, (0.5 + v * 0.5) * uTile.y)) * (0.55 + 0.45 * s);
        }
      }
    }
    // thin seam where the two halves of a flap meet
    if (abs(local.y - 0.5 * uTile.y) < uSeam) col *= 0.8;
  }
  gl_FragColor = vec4(col, 1.0);
}
`;

type Flip = { from: SceneKey; to: SceneKey };

/** Draw an image into a canvas the way `object-fit: cover; object-position: p% 50%` would, optionally nudged down. */
function coverCanvas(img: HTMLImageElement, w: number, h: number, p: number, shift?: { px: number; fill: string }) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const k = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * k;
  const dh = img.naturalHeight * k;
  if (shift) {
    ctx.fillStyle = shift.fill;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, (w - dw) * p, (h - dh) * 0.5 + (shift?.px ?? 0), dw, dh);
  return c;
}

/**
 * Hero background with a "Seattle based / Michigan grown" toggle. Switching scenes plays a split-flap
 * transition drawn in WebGL: the picture is cut into small flaps (about 48px); each tile flips once. On each flip the top
 * half of the old picture falls forward to reveal the new one, then the new bottom half swings into
 * place. It ripples across the hero in a steady left-to-right wave.
 */
export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<Partial<Record<SceneKey, HTMLImageElement>>>({});
  const [scene, setScene] = useState<SceneKey>("michigan");
  const [flip, setFlip] = useState<Flip | null>(null);

  useEffect(() => {
    // Lets CSS adapt to the scene (e.g. the name's color over the Seattle skyline).
    document.documentElement.dataset.scene = scene;
  }, [scene]);

  useEffect(() => {
    // Warm the cache and keep the decoded images for the transition.
    for (const key of Object.keys(SCENES) as SceneKey[]) {
      const img = new window.Image();
      img.src = SCENES[key].src;
      imgs.current[key] = img;
    }
  }, []);

  const choose = (next: SceneKey) => {
    if (next === scene || flip) return;
    const ready = (Object.keys(SCENES) as SceneKey[]).every((k) => imgs.current[k]?.complete && imgs.current[k]?.naturalWidth);
    if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setScene(next);
      return;
    }
    setFlip({ from: scene, to: next });
    setScene(next); // the new scene sits underneath while the old picture flips away
  };

  useLayoutEffect(() => {
    if (!flip) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const done = () => setFlip(null);
    if (!wrap || !canvas) return done();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width: cw, height: ch } = wrap.getBoundingClientRect();
    const W = Math.round(cw * dpr);
    const H = Math.round(ch * dpr);
    const mobile = window.innerWidth < 768;
    const oldImg = imgs.current[flip.from];
    const newImg = imgs.current[flip.to];
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!oldImg || !newImg || !gl) return done();

    canvas.width = W;
    canvas.height = H;
    gl.viewport(0, 0, W, H);

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return done();
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const makeTexture = (unit: number, source: HTMLCanvasElement) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    };
    const shiftOf = (key: SceneKey) => {
      const sh = SCENES[key].shift;
      return sh ? { px: (mobile ? sh.svh : sh.svhDesktop) * window.innerHeight * dpr, fill: sh.fill } : undefined;
    };
    const oldTex = makeTexture(0, coverCanvas(oldImg, W, H, mobile ? SCENES[flip.from].focus.mobile : SCENES[flip.from].focus.desktop, shiftOf(flip.from)));
    const newTex = makeTexture(1, coverCanvas(newImg, W, H, mobile ? SCENES[flip.to].focus.mobile : SCENES[flip.to].focus.desktop, shiftOf(flip.to)));

    // Flaps are about CELL px; round the grid so tiles fill the hero evenly.
    const cols = Math.max(4, Math.round(cw / CELL));
    const rows = Math.max(4, Math.round(ch / CELL));
    const tileW = W / cols;
    const tileH = H / rows;
    const u = (name: string) => gl.getUniformLocation(prog, name);
    gl.uniform1i(u("uOld"), 0);
    gl.uniform1i(u("uNew"), 1);
    gl.uniform2f(u("uRes"), W, H);
    gl.uniform2f(u("uTile"), tileW, tileH);
    gl.uniform1f(u("uCols"), cols);
    gl.uniform1f(u("uRows"), rows);
    gl.uniform1f(u("uWave"), WAVE);
    gl.uniform1f(u("uRow"), ROW);
    gl.uniform1f(u("uJit"), JITTER);
    gl.uniform1f(u("uA"), FLAP);
    gl.uniform1f(u("uSeam"), 0.75 * dpr);
    const uTime = u("uTime");

    const total = WAVE + ROW + JITTER + FLAP * 2 + 50;
    const start = performance.now();
    let raf = 0;
    const draw = (now: number) => {
      const t = now - start;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (t < total) raf = requestAnimationFrame(draw);
      else done();
    };
    // First frame is drawn synchronously, so the old picture is never uncovered before the canvas paints.
    draw(start);

    return () => {
      cancelAnimationFrame(raf);
      gl.deleteTexture(oldTex);
      gl.deleteTexture(newTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [flip]);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[1257/832] w-full overflow-hidden max-md:aspect-auto max-md:h-svh"
      style={{ backgroundColor: SCENES.seattle.shift?.fill }}
    >
      {(Object.keys(SCENES) as SceneKey[]).map((key) => (
        <Image
          key={key}
          src={SCENES[key].src}
          alt={scene === key ? SCENES[key].alt : ""}
          aria-hidden={scene === key ? undefined : true}
          fill
          preload={key === "michigan"}
          quality={90}
          sizes="100vw"
          className={`object-cover ${SCENES[key].className} ${scene === key ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {flip && <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />}

      <div
        role="group"
        aria-label="Where I'm from"
        className="absolute right-4 top-[76px] z-[56] sm:right-6 xl:top-4"
      >
        <div className="inline-flex overflow-hidden rounded-control border border-deep bg-white/60 shadow-[3px_3px_0_var(--color-plum),0_6px_14px_rgb(28_41_39/0.12)] backdrop-blur-md transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-plum),0_10px_18px_rgb(28_41_39/0.16)]">
          {(
            [
              ["seattle", "Seattle based"],
              ["michigan", "Michigan grown"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={scene === key}
              onClick={() => choose(key)}
              className={`min-h-11 px-3.5 text-[17px] font-bold transition-[scale,background-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.94] active:duration-75 sm:px-5 ${
                scene === key ? "bg-teal-deep text-sand" : "text-deep hover:bg-sand"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
