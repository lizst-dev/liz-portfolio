"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type DocPage = { src: string; alt: string };
export type DocHotspot = { page: number; /** CSS clip-path polygon, in % of the preview image. */ polygon: string };

/**
 * A preview image (a few pages floating together) where each page can be clicked. Clicking opens that page
 * large in a modal, with Previous/Next to read the others. Uses the native <dialog>: Esc closes it and
 * focus stays inside while it's open. Arrow keys move between pages.
 */
export function DocViewer({
  src,
  alt,
  width,
  height,
  pages,
  pageWidth,
  pageHeight,
  hotspots,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  pages: DocPage[];
  pageWidth: number;
  pageHeight: number;
  hotspots: DocHotspot[];
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const last = pages.length - 1;
  const open = (n: number) => {
    setI(n);
    ref.current?.showModal();
  };
  const go = (d: number) => setI((v) => Math.min(last, Math.max(0, v + d)));
  const nav =
    "inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-4 text-[16px] font-bold shadow-md hover:bg-sand disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white";

  return (
    <>
      <div className="relative">
        <Image src={src} alt={alt} width={width} height={height} sizes="250px" className="h-auto w-full" />
        {hotspots.map((h) => (
          <button
            key={h.page}
            type="button"
            onClick={() => open(h.page)}
            aria-label={`Read page ${h.page + 1} of ${pages.length}`}
            style={{ clipPath: h.polygon }}
            className="absolute inset-0 cursor-zoom-in transition-colors hover:bg-teal/15 focus-visible:bg-teal/15"
          />
        ))}
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
