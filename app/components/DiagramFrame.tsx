"use client";

import { useRef, type ReactNode } from "react";

/**
 * Wraps a diagram so clicking it opens a larger copy in a modal (same behavior as the zoomable images). On narrow screens the
 * inline diagram keeps a readable minimum width and scrolls sideways instead of shrinking its text.
 */
export function DiagramFrame({
  label,
  minWidth = 640,
  zoomWidth = 1100,
  wide = false,
  children,
}: {
  label: string;
  /** Narrowest the inline diagram gets before it scrolls, in px. */
  minWidth?: number;
  /** Width of the diagram in the modal, in px (capped to the screen). */
  zoomWidth?: number;
  /** Break out of the text column (up to 1000px), for big diagrams that would otherwise get small text. */
  wide?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className={`overflow-x-auto px-1 pb-2 pt-2 -mt-2 ${wide ? "relative left-1/2 w-[min(1000px,calc(100vw-2rem))] -translate-x-1/2" : "-mx-1"}`}>
        <button
          type="button"
          onClick={() => ref.current?.showModal()}
          aria-label={`Expand diagram: ${label}`}
          style={{ minWidth }}
          className="block w-full cursor-zoom-in text-left transition-[translate] duration-200 ease-out motion-safe:hover:-translate-y-0.5"
        >
          {children}
        </button>
      </div>
      <dialog
        ref={ref}
        aria-label={label}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto max-h-[96svh] max-w-[96vw] overflow-auto rounded-card border border-deep bg-card p-3 shadow-[6px_6px_0_var(--color-plum)] backdrop:bg-deep/75 sm:p-5"
      >
        <form method="dialog" className="sticky top-0 z-10 flex justify-end">
          <button
            autoFocus
            aria-label="Close"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-deep bg-card text-[24px] leading-none shadow-[2px_2px_0_var(--color-plum)] hover:bg-sand"
          >
            <span aria-hidden="true">×</span>
          </button>
        </form>
        <div style={{ width: `min(92vw, ${zoomWidth}px)` }} className="mx-auto -mt-6 min-w-[720px]">
          {children}
        </div>
      </dialog>
    </>
  );
}
