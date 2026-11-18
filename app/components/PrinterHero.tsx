"use client";

import { useEffect, useRef } from "react";
import type { PrinterScene } from "./printerScene";

// Start fetching the 3D scene as soon as this file is loaded, not after the first paint.
const sceneModule = typeof window !== "undefined" ? import("./printerScene") : null;

/**
 * Animated header for the Blue Origin case study: the view through a laser powder bed fusion printer's window.
 * The 3D scene starts mid-action (no opening fade), pauses when scrolled out of view or the tab is hidden, and shows
 * a still frame of the finished part for visitors who prefer reduced motion (or if WebGL isn't available).
 */
export function PrinterHero({ label, className = "" }: { label: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let scene: PrinterScene | null = null;
    let cancelled = false;
    let visible = true;
    let observer: IntersectionObserver | undefined;
    let sizer: ResizeObserver | undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const freezeParam = new URLSearchParams(window.location.search).get("printerFreeze"); // debug: ?printerFreeze=<seconds>
    const freezeAt = freezeParam !== null && !Number.isNaN(parseFloat(freezeParam)) ? parseFloat(freezeParam) : null;

    const sync = () => {
      if (!scene) return;
      if (reduce.matches) { scene.stop(); scene.renderAt(scene.stillTime); }
      else if (visible && !document.hidden) scene.start();
      else scene.stop();
    };

    (sceneModule ?? import("./printerScene"))
      .then(({ createPrinterScene }) => {
        if (cancelled) return;
        try {
          scene = createPrinterScene(el, {
            freezeAt,
            startAt: 1.0,
            onFade: (o) => { if (fade.current) fade.current.style.opacity = String(o); },
          });
        } catch {
          return; // no WebGL: the dark backdrop stays
        }
        observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
        observer.observe(el);
        sizer = new ResizeObserver(() => { scene?.resize(); if (reduce.matches) scene?.renderAt(scene.stillTime); });
        sizer.observe(el);
        reduce.addEventListener("change", sync);
        document.addEventListener("visibilitychange", sync);
        sync();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      observer?.disconnect();
      sizer?.disconnect();
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={box} role="img" aria-label={label} className={`absolute inset-0 overflow-hidden bg-[#0b0c0e] ${className}`}>
      {/* black overlay that fades the loop out and back in */}
      <div ref={fade} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[#0b0c0e] opacity-0" />
      {/* a hint of printer-window frame at the extreme edges, plus a soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          boxShadow: "inset 0 0 0 4px #15171a, inset 0 0 0 6px #2a2d32, inset 0 0 120px 24px rgba(0,0,0,.7)",
          background: "linear-gradient(115deg,transparent 38%,rgba(255,255,255,.035) 45%,transparent 52%), radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(0,0,0,.35) 100%)",
        }}
      />
    </div>
  );
}
