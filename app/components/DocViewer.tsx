"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type DocPage = { src: string; alt: string };
/** Where a page sits in the preview: its top-left corner and width (as % of the preview), and its tilt in degrees. */
export type DocSheet = { page: number; left: number; top: number; width: number; rotate: number };

/**
 * A few pages fanned out together, each one its own image. Hovering (or focusing) a page lifts it and brings it
 * in front of the others; clicking opens that page large in a modal, with Previous/Next to read the others.
 * Uses the native <dialog>: Esc closes it and focus stays inside while it's open. Arrow keys move between pages.
 *
 * `sheets` lists the pages front to back, so the first one is on top at rest.
 */
export function DocViewer({
  width,
  height,
  pages,
  pageWidth,
  pageHeight,
  sheets,
}: {
  /** The preview's overall size, which sets its shape. */
  width: number;
  height: number;
  pages: DocPage[];
  pageWidth: number;
  pageHeight: number;
  sheets: DocSheet[];
}) {
  const [front, setFront] = useState<number | null>(null); // the page that is in front (hovered, then briefly after)
  const [lifted, setLifted] = useState<number | null>(null); // the page the pointer is on
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(settle.current), []);
  const raise = (page: number) => {
    clearTimeout(settle.current);
    setFront(page);
    setLifted(page);
  };
  const lower = () => {
    setLifted(null);
    // Keep the page in front until it has settled back down, so the stacking doesn't snap mid-animation.
    clearTimeout(settle.current);
    settle.current = setTimeout(() => setFront(null), 350);
  };

  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const last = pages.length - 1;
  // The pages are tall, so the viewer scrolls. Every page should start at its top, not wherever the last one was left.
  const toTop = () => ref.current?.scrollTo({ top: 0, behavior: "instant" });
  const open = (n: number) => {
    setI(n);
    ref.current?.showModal();
    toTop(); // after showing: a closed dialog has no layout, so scrolling it would do nothing
  };
  const go = (d: number) => {
    setI((v) => Math.min(last, Math.max(0, v + d)));
    toTop();
  };
  const nav =
    "inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-4 text-[16px] font-bold shadow-md hover:bg-sand disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white";

  return (
    <>
      <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }} onPointerLeave={lower}>
        {sheets.map((s, idx) => {
          const z = front === s.page ? sheets.length + 1 : sheets.length - idx;
          return (
            <div
              key={s.page}
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.width}%`, rotate: `${s.rotate}deg`, transformOrigin: "0 0", zIndex: z }}
              className="absolute"
            >
              <button
                type="button"
                onClick={() => open(s.page)}
                onPointerEnter={() => raise(s.page)}
                onFocus={() => raise(s.page)}
                onBlur={lower}
                aria-label={`Read page ${s.page + 1} of ${pages.length}`}
                style={{ translate: lifted === s.page ? "0 -6%" : "0 0" }}
                className="block w-full cursor-zoom-in rounded-[2px] bg-white shadow-[0_1px_2px_rgba(28,41,39,0.25),0_3px_8px_rgba(28,41,39,0.2)] transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_2px_4px_rgba(28,41,39,0.25),0_14px_28px_rgba(28,41,39,0.3)] focus-visible:shadow-[0_2px_4px_rgba(28,41,39,0.25),0_14px_28px_rgba(28,41,39,0.3)] motion-reduce:transition-none"
              >
                <Image
                  src={pages[s.page].src}
                  alt=""
                  width={pageWidth}
                  height={pageHeight}
                  sizes="140px"
                  className="block h-auto w-full rounded-[2px]"
                />
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[14px] text-muted">Click a page to read it.</p>
      <dialog
        ref={ref}
        aria-label="Participant instructions"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="m-auto max-h-[96svh] max-w-[96vw] overflow-auto rounded-card border-0 bg-white p-3 shadow-2xl backdrop:bg-deep/75 sm:p-4"
      >
        <div className="sticky top-0 z-10 -mt-3 flex items-center justify-between gap-3 bg-white/95 pb-3 pt-3 sm:-mt-4 sm:pt-4">
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous page" className={nav} disabled={i === 0} onClick={() => go(-1)}>
              <span aria-hidden="true" className="text-[22px] leading-none">←</span>
            </button>
            <button type="button" aria-label="Next page" className={nav} disabled={i === last} onClick={() => go(1)}>
              <span aria-hidden="true" className="text-[22px] leading-none">→</span>
            </button>
          </div>
          <p aria-live="polite" className="rounded-full bg-white/90 px-3 text-[15px] font-bold">
            Page {i + 1} of {pages.length}
          </p>
          <form method="dialog">
            <button
              autoFocus
              aria-label="Close"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-white text-[24px] leading-none shadow-md hover:bg-sand"
            >
              <span aria-hidden="true">×</span>
            </button>
          </form>
        </div>
        <Image
          key={pages[i].src}
          src={pages[i].src}
          alt={pages[i].alt}
          width={pageWidth}
          height={pageHeight}
          quality={90}
          sizes="96vw"
          className="mx-auto h-auto w-[min(90vw,880px)] max-w-none"
        />
      </dialog>
    </>
  );
}
