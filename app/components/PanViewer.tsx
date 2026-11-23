"use client";

import { useEffect, useState } from "react";
import { PanDialog, usePanZoom } from "./PanDialog";

/**
 * A large image (a flow map, a diagram) you can explore right where it sits: drag to pan, pinch or hold
 * Ctrl/Cmd and scroll to zoom (a plain scroll keeps scrolling the page), or use the +/- buttons. A plain
 * click, or the Expand button, opens the same image full screen (see PanDialog).
 */
export function PanViewer({
  full,
  fullWidth,
  fullHeight,
  alt,
}: {
  full: string;
  fullWidth: number;
  fullHeight: number;
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const { stage, view, dragging, moved, reset, zoom, onKey, stageProps } = usePanZoom({ width: fullWidth, height: fullHeight, wheel: "modifier", fit: "width" });

  // Fit the image to the window at first, and again if the window is resized.
  useEffect(() => {
    reset();
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(reset);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reset, stage]);

  const btn =
    "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-deep text-[18px] font-bold leading-none shadow-md hover:bg-sand";

  return (
    <>
      <div className="relative overflow-hidden rounded-card border border-line bg-[#e8e8e8]">
        <div
          ref={stage}
          tabIndex={0}
          role="group"
          aria-label={`${alt} Drag to pan, pinch or use the buttons to zoom.`}
          onKeyDown={onKey}
          onClick={() => {
            if (!moved.current) setOpen(true);
          }}
          {...stageProps}
          className={`h-[min(75svh,640px)] touch-none overflow-hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {/* A plain <img>: the optimizer would downscale it, and zooming needs the full resolution. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={full}
            alt=""
            width={fullWidth}
            height={fullHeight}
            draggable={false}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, transformOrigin: "0 0", maxWidth: "none" }}
            className="absolute left-0 top-0 select-none bg-white"
          />
        </div>
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-4 py-1.5 text-[13px] font-bold text-deep/70 shadow-md">
          Drag to pan · pinch or Ctrl/Cmd + scroll to zoom · click to expand
        </p>
      </div>
      <div data-ctl className="mt-3 flex items-center justify-end gap-2">
          <button type="button" aria-label="Zoom out" className={btn} onClick={() => zoom(1 / 1.3)}>−</button>
          <button type="button" aria-label="Zoom in" className={btn} onClick={() => zoom(1.3)}>+</button>
          <button type="button" aria-label="Fit to window" className={`${btn} w-auto px-3 text-[14px]`} onClick={reset}>Fit</button>
          <button type="button" aria-label="Expand to full screen" className={`${btn} w-auto px-3 text-[14px]`} onClick={() => setOpen(true)}>Expand</button>
      </div>
      <PanDialog open={open} onClose={() => setOpen(false)} src={full} width={fullWidth} height={fullHeight} alt={alt} />
    </>
  );
}
