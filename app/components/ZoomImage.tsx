"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";

export type ZoomItem = { src: string; alt: string; width: number; height: number };

/**
 * Wraps an image so clicking it opens the full image in a modal.
 * Uses the native <dialog>: Esc closes it, focus is trapped, and the page behind is inert.
 * The large image sits in a closed dialog (display: none), so it isn't fetched until opened.
 *
 * Pass `group` (the images of a set, in order) and this image's `index` in it to let people move
 * through the whole set from the expanded view: the left and right arrow keys, or the on-screen
 * arrows, step through it (wrapping around), with a counter showing where they are.
 */
export function ZoomImage({
  src,
  alt,
  width,
  height,
  fill = false,
  group,
  index = 0,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Fill the (relatively positioned) parent on sm+, so the image scales to it without affecting its size. */
  fill?: boolean;
  /** The images of the set this one belongs to, so the expanded view can step through them. */
  group?: ZoomItem[];
  /** This image's position in `group`. */
  index?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(index);

  const many = Boolean(group && group.length > 1);
  const shown: ZoomItem = group ? group[current] : { src, alt, width, height };
  const step = (by: number) => {
    if (!group) return;
    setCurrent((c) => (c + by + group.length) % group.length);
    ref.current?.scrollTo({ top: 0, behavior: "instant" }); // each image starts at its top
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCurrent(index); // always open on the image that was clicked
          ref.current?.showModal();
          ref.current?.scrollTo({ top: 0, behavior: "instant" }); // and at its top
        }}
        aria-label={`Expand image: ${alt}`}
        className={`block w-full cursor-zoom-in text-left ${fill ? "sm:absolute sm:inset-0 sm:h-full" : ""}`}
      >
        {children}
      </button>
      <dialog
        ref={ref}
        aria-label={shown.alt}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          }
        }}
        className="m-auto max-h-[96svh] max-w-[96vw] overflow-auto rounded-card border-0 bg-white p-3 shadow-2xl backdrop:bg-deep/75 sm:p-4"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between">
          {many ? (
            <div className="flex items-center gap-1 rounded-full border border-line bg-white/95 p-1 shadow-md">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="grid size-8 cursor-pointer place-items-center rounded-full text-[20px] leading-none hover:bg-sand"
              >
                <span aria-hidden="true">←</span>
              </button>
              <span aria-live="polite" className="min-w-[4.5rem] text-center text-[15px] font-bold tabular-nums">
                {current + 1} of {group!.length}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="grid size-8 cursor-pointer place-items-center rounded-full text-[20px] leading-none hover:bg-sand"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <span />
          )}
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
          key={shown.src}
          src={shown.src}
          alt={shown.alt}
          width={shown.width}
          height={shown.height}
          quality={90}
          sizes="96vw"
          style={{ "--ar": shown.width / shown.height } as React.CSSProperties}
          className="mx-auto -mt-6 h-auto w-[min(90vw,calc(84svh*var(--ar)))] max-w-none"
        />
      </dialog>
    </>
  );
}
