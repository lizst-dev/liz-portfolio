"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type View = { x: number; y: number; k: number };

/**
 * A large image (a flow map, a diagram) shown as a preview on the page. Clicking it opens a full-screen
 * viewer you can drag to pan and scroll, pinch or use the +/- buttons to zoom. Keys: arrows pan, +/- zoom,
 * 0 resets, Esc closes. Uses the native <dialog>, so focus stays inside while it's open.
 */
export function PanViewer({
  preview,
  previewWidth,
  previewHeight,
  full,
  fullWidth,
  fullHeight,
  alt,
  hint = "Click to explore",
}: {
  preview: string;
  previewWidth: number;
  previewHeight: number;
  full: string;
  fullWidth: number;
  fullHeight: number;
  alt: string;
  hint?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; k: number } | null>(null);
  const min = useRef(0.1);

  /** Fit the image to the stage width, starting at the top. */
  const reset = useCallback(() => {
    const el = stage.current;
    if (!el) return;
    const k = Math.min(el.clientWidth / fullWidth, el.clientHeight / fullHeight) * 0.98;
    min.current = k * 0.6;
    setView({ x: (el.clientWidth - fullWidth * k) / 2, y: (el.clientHeight - fullHeight * k) / 2, k });
  }, [fullWidth, fullHeight]);

  /** Zoom by `f` around a point in the stage (defaults to its center). */
  const zoom = useCallback((f: number, cx?: number, cy?: number) => {
    const el = stage.current;
    if (!el) return;
    const px = cx ?? el.clientWidth / 2;
    const py = cy ?? el.clientHeight / 2;
    setView((v) => {
      const k = Math.min(1.5, Math.max(min.current, v.k * f));
      const r = k / v.k;
      return { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
    });
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  // React attaches wheel listeners as passive, so preventDefault (to stop the page behind from scrolling) needs a native one.
  useEffect(() => {
    const el = stage.current;
    if (!el || !open) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      // Pinch on a trackpad arrives as ctrl+wheel; a plain scroll zooms too, which is what a map viewer does.
      zoom(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, zoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setDragging(true);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const el = stage.current!;
      const r = el.getBoundingClientRect();
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoom((pinch.current.k * (d / pinch.current.dist)) / view.k, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    } else if (pointers.current.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 80;
    const pan = (dx: number, dy: number) => setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
    if (e.key === "ArrowLeft") pan(step, 0);
    else if (e.key === "ArrowRight") pan(-step, 0);
    else if (e.key === "ArrowUp") pan(0, step);
    else if (e.key === "ArrowDown") pan(0, -step);
    else if (e.key === "+" || e.key === "=") zoom(1.3);
    else if (e.key === "-") zoom(1 / 1.3);
    else if (e.key === "0") reset();
    else return;
    e.preventDefault();
  };

  const btn =
    "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-[20px] font-bold leading-none shadow-md hover:bg-sand";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
        aria-label={`${alt} Open the full-size viewer.`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-card border border-line bg-[#e8e8e8] text-left"
      >
        <div className="max-h-[380px] overflow-hidden">
          <Image
            src={preview}
            alt=""
            width={previewWidth}
            height={previewHeight}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="h-auto w-full"
          />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
        <span data-ctl className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-[16px] font-bold shadow-lg transition-transform group-hover:-translate-y-1">
          {hint}
        </span>
      </button>
      <dialog
        ref={dialog}
        aria-label={alt}
        onClose={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="m-0 h-svh max-h-none w-screen max-w-none border-0 bg-transparent p-0 backdrop:bg-deep/85"
      >
        <div
          ref={stage}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={(e) => {
            const r = stage.current!.getBoundingClientRect();
            zoom(1.8, e.clientX - r.left, e.clientY - r.top);
          }}
          className={`absolute inset-0 touch-none overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {open && (
            // A plain <img>: the optimizer would downscale it, and this one needs its full resolution.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={full}
              alt={alt}
              width={fullWidth}
              height={fullHeight}
              draggable={false}
              style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: "0 0", maxWidth: "none" }}
              className="absolute left-0 top-0 select-none bg-white"
            />
          )}
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button type="button" aria-label="Zoom out" className={btn} onClick={() => zoom(1 / 1.3)}>−</button>
          <button type="button" aria-label="Zoom in" className={btn} onClick={() => zoom(1.3)}>+</button>
          <button type="button" aria-label="Fit to screen" className={`${btn} w-auto px-4 text-[15px]`} onClick={reset}>Fit</button>
          <button type="button" aria-label="Close" className={btn} onClick={() => dialog.current?.close()}>✕</button>
        </div>
        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-[14px] font-bold text-deep/70 shadow-md">
          Drag to pan · scroll to zoom
        </p>
      </dialog>
    </>
  );
}
