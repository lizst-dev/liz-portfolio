"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Sketch = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * A small window for flipping through a set of images one at a time. Prev/next buttons, the
 * thumbnails, and the left/right arrow keys all move through it, and "Full screen" opens the
 * current image in a larger modal that keeps the same controls.
 */
export function SketchViewer({
  title,
  items,
  bare = false,
}: {
  title: string;
  items: Sketch[];
  /** Drop the viewer's own card and title, for when it sits inside a collapsible that already has them. */
  bare?: boolean;
}) {
  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const n = items.length;
  const go = (d: number) => setI((c) => (c + d + n) % n);
  const cur = items[i];

  // Keep the selected thumbnail in view without moving the page.
  useEffect(() => {
    const el = strip.current?.children[i] as HTMLElement | undefined;
    const box = strip.current;
    if (!el || !box) return;
    box.scrollTo({
      left: el.offsetLeft - (box.clientWidth - el.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [i]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const nav = (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous sketch"
        className={arrow}
      >
        <span aria-hidden="true">←</span>
      </button>
      <p className="whitespace-nowrap text-[15px] font-bold text-deep/70" aria-live="polite">
        Sketch {i + 1} of {n}
      </p>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next sketch"
        className={arrow}
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );

  return (
    <div
      className={
        bare
          ? "space-y-4"
          : "reveal space-y-4 rounded-card border border-white/80 bg-white/65 p-4 shadow-card backdrop-blur-xl sm:p-5"
      }
      onKeyDown={onKey}
    >
      <div className="flex items-center justify-between gap-3">
        {bare ? (
          <span />
        ) : (
          <p className="text-[15px] font-bold text-teal-deep">{title}</p>
        )}
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="cursor-zoom-in rounded-control border border-line bg-white px-3 py-1 text-[15px] font-bold hover:bg-sand"
        >
          Full screen
        </button>
      </div>

      {nav}

      <div className="relative h-[clamp(300px,52vw,520px)] overflow-hidden rounded-control border border-line bg-white">
        <Image
          key={cur.src}
          src={cur.src}
          alt={cur.alt}
          fill
          quality={90}
          sizes="(min-width: 1000px) 700px, 100vw"
          className="object-contain p-3"
        />
      </div>

      <ul
        ref={strip}
        aria-label="All sketches"
        className="relative flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]"
      >
        {items.map((s, k) => (
          <li key={s.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setI(k)}
              aria-label={`Show sketch ${k + 1}`}
              aria-current={k === i ? "true" : undefined}
              className={`relative block h-16 w-20 overflow-hidden rounded-control border bg-white transition-opacity ${
                k === i
                  ? "border-teal-deep ring-2 ring-teal-deep"
                  : "border-line opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={s.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={`${title} Full screen viewer.`}
        onKeyDown={onKey}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
        className="m-auto h-[96svh] w-[96vw] max-w-none overflow-hidden rounded-card border-0 bg-white p-3 shadow-2xl backdrop:bg-deep/75 sm:p-4"
      >
        <div className="flex h-full flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">{nav}</div>
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
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-control border border-line bg-white">
            <Image
              key={`full-${cur.src}`}
              src={cur.src}
              alt={cur.alt}
              fill
              quality={90}
              sizes="96vw"
              className="object-contain p-3"
            />
          </div>
        </div>
      </dialog>
    </div>
  );
}

const arrow =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-deep bg-white text-[22px] leading-none shadow-[2px_2px_0_var(--color-plum)] transition-[translate,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-plum)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";
