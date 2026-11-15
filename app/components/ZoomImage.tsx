"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";

/**
 * Wraps an image so clicking it opens the full image in a modal.
 * Uses the native <dialog>: Esc closes it, focus is trapped, and the page behind is inert.
 * The large image sits in a closed dialog (display: none), so it isn't fetched until opened.
 */
export function ZoomImage({
  src,
  alt,
  width,
  height,
  fill = false,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Fill the (relatively positioned) parent on sm+, so the image scales to it without affecting its size. */
  fill?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={`Expand image: ${alt}`}
        className={`block w-full cursor-zoom-in text-left ${fill ? "sm:absolute sm:inset-0 sm:h-full" : ""}`}
      >
        {children}
      </button>
      <dialog
        ref={ref}
        aria-label={alt}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto max-h-[96svh] max-w-[96vw] overflow-auto rounded-card border-0 bg-white p-3 shadow-2xl backdrop:bg-deep/75 sm:p-4"
      >
        <form method="dialog" className="sticky top-0 z-10 flex justify-end">
          <button
            autoFocus
            aria-label="Close"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-white text-[24px] leading-none shadow-md hover:bg-sand"
          >
            <span aria-hidden="true">×</span>
          </button>
        </form>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={90}
          sizes="96vw"
          style={{ "--ar": width / height } as React.CSSProperties}
          className="mx-auto -mt-6 h-auto w-[min(90vw,calc(84svh*var(--ar)))] max-w-none"
        />
      </dialog>
    </>
  );
}
