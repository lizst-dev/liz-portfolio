"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type View = { x: number; y: number; k: number };

/**
 * Pan and zoom for one image inside a stage element: drag to pan; pinch or the buttons to zoom. The wheel zooms
 * too, either always (a full-screen viewer) or only with Ctrl/Cmd held (a small window inside a page, where a plain
 * wheel should keep scrolling the page). `moved` tells a click from the end of a drag.
 */
export function usePanZoom({ width, height, active = true, wheel = "always", fit = "contain" }: { width: number; height: number; active?: boolean; wheel?: "always" | "modifier"; fit?: "contain" | "width" }) {
  const stage = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const [dragging, setDragging] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; k: number } | null>(null);
  const min = useRef(0.1);
  const moved = useRef(false);

  /** Fit the image to the stage, centered. */
  const reset = useCallback(() => {
    const el = stage.current;
    if (!el || !el.clientWidth) return;
    // "width" fits the image across the stage and starts at its top: right for a tall image in a short window.
    const k = (fit === "width" ? el.clientWidth / width : Math.min(el.clientWidth / width, el.clientHeight / height)) * 0.98;
    min.current = Math.min(k, el.clientWidth / width) * 0.6;
    setView({ x: (el.clientWidth - width * k) / 2, y: fit === "width" ? 8 : (el.clientHeight - height * k) / 2, k });
  }, [width, height, fit]);

  /** Zoom by `f` around a point in the stage (defaults to its center). */
  const zoom = useCallback((f: number, cx?: number, cy?: number) => {
    const el = stage.current;
    if (!el) return;
    const px = cx ?? el.clientWidth / 2;
    const py = cy ?? el.clientHeight / 2;
    setView((v) => {
      // Up to 3x the image's own pixels: small text in a large image needs to be magnified past 100% to read.
      const k = Math.min(3, Math.max(min.current, v.k * f));
      const r = k / v.k;
      return { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
    });
  }, []);

  // React attaches wheel listeners as passive, so preventDefault (to stop the page behind from scrolling) needs a native one.
  useEffect(() => {
    const el = stage.current;
    if (!el || !active) return;
    const onWheel = (e: WheelEvent) => {
      // Pinch on a trackpad arrives as ctrl+wheel.
      if (wheel === "modifier" && !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoom(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [active, wheel, zoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) moved.current = false;
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
      moved.current = true;
      const [a, b] = [...pointers.current.values()];
      const r = stage.current!.getBoundingClientRect();
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoom((pinch.current.k * (d / pinch.current.dist)) / view.k, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    } else if (pointers.current.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      if (Math.abs(dx) + Math.abs(dy) > 0) moved.current = moved.current || Math.hypot(dx, dy) > 1.5;
      setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };
  const onDoubleClick = (e: React.MouseEvent) => {
    const r = stage.current!.getBoundingClientRect();
    zoom(1.8, e.clientX - r.left, e.clientY - r.top);
  };

  const pan = (dx: number, dy: number) => setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  /** Arrow keys pan, + and - zoom, 0 fits. Returns true when it handled the key. */
  const onKey = (e: React.KeyboardEvent) => {
    const step = 80;
    if (e.key === "ArrowLeft") pan(step, 0);
    else if (e.key === "ArrowRight") pan(-step, 0);
    else if (e.key === "ArrowUp") pan(0, step);
    else if (e.key === "ArrowDown") pan(0, -step);
    else if (e.key === "+" || e.key === "=") zoom(1.3);
    else if (e.key === "-") zoom(1 / 1.3);
    else if (e.key === "0") reset();
    else return false;
    e.preventDefault();
    return true;
  };

  return {
    stage,
    view,
    dragging,
    moved,
    reset,
    zoom,
    onKey,
    stageProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onDoubleClick },
  };
}

/**
 * A full-screen viewer for one large image. Drag to pan; scroll, pinch or use the +/- buttons to zoom.
 * Keys: arrows pan, +/- zoom, 0 resets, Esc closes. Uses the native <dialog>, so focus stays inside
 * while it's open.
 *
 * It is controlled: show it with `open`, and it calls `onClose` when it closes. Changing `src` while it is
 * open (for example with the previous/next buttons) re-fits the new image.
 */
export function PanDialog({
  open,
  onClose,
  src,
  width,
  height,
  alt,
  title,
  onPrevious,
  onNext,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** A small label shown top-left, such as "Insights, 1 of 6". */
  title?: string;
  /** When both are given, previous and next buttons appear, to move to the neighbouring image. */
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { stage, view, dragging, reset, zoom, onKey, stageProps } = usePanZoom({ width, height, active: open });

  // Show or hide the native dialog to match `open`.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Fit the image whenever it opens or changes.
  useEffect(() => {
    if (open) reset();
  }, [open, src, reset]);

  const btn =
    "inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-[20px] font-bold leading-none shadow-md hover:bg-sand";
  const wide = `${btn} w-auto gap-1.5 px-4 text-[15px]`;
  const many = Boolean(onPrevious && onNext);

  return (
    <dialog
      ref={dialog}
      aria-label={alt}
      onClose={onClose}
      onKeyDown={onKey}
      className="m-0 h-svh max-h-none w-screen max-w-none border-0 bg-transparent p-0 backdrop:bg-deep/85"
    >
      <div
        ref={stage}
        {...stageProps}
        className={`absolute inset-0 touch-none overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {open && (
          // A plain <img>: the optimizer would downscale it, and this one needs its full resolution.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={alt}
            width={width}
            height={height}
            draggable={false}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: "0 0", maxWidth: "none" }}
            className="absolute left-0 top-0 select-none bg-white"
          />
        )}
      </div>
      <div className="absolute left-4 top-4 flex items-center gap-2">
        {many && (
          <button type="button" aria-label="Previous section" className={wide} onClick={onPrevious}>
            <span aria-hidden="true">←</span> Previous
          </button>
        )}
        {title && <p className="rounded-full bg-white/90 px-4 py-2 text-[15px] font-bold shadow-md">{title}</p>}
        {many && (
          <button type="button" aria-label="Next section" className={wide} onClick={onNext}>
            Next <span aria-hidden="true">→</span>
          </button>
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
  );
}
