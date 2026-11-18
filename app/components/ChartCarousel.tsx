"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A row of cards that scrolls sideways, two at a time on wide screens and one on narrow ones.
 * Arrows page through it; it also scrolls by swipe, trackpad, or the arrow keys once focused.
 */
export function ChartCarousel({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const items = Children.toArray(children);
  const [view, setView] = useState({ atStart: true, atEnd: false, first: 1, last: Math.min(2, items.length) });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el || !el.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 20; // card plus the gap between cards
    const first = Math.round(el.scrollLeft / step) + 1;
    const perView = Math.max(1, Math.round((el.clientWidth + 20) / step));
    setView({
      atStart: el.scrollLeft < 4,
      atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      first,
      last: Math.min(items.length, first + perView - 1),
    });
  }, [items.length]);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el || !el.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 20;
    const perView = Math.max(1, Math.round((el.clientWidth + 20) / step));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step * perView, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-white text-[22px] leading-none shadow-md transition-colors hover:bg-sand focus-visible:outline-2 disabled:cursor-default disabled:opacity-40 disabled:shadow-none disabled:hover:bg-white";

  return (
    <div className="reveal">
      <div className="mb-3 flex items-center justify-end gap-3">
        <p aria-live="polite" className="mr-1 text-[15px] text-muted">
          {view.first === view.last ? `${view.first}` : `${view.first}–${view.last}`} of {items.length}
        </p>
        <button type="button" aria-label="Previous charts" className={arrow} disabled={view.atStart} onClick={() => page(-1)}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" aria-label="Next charts" className={arrow} disabled={view.atEnd} onClick={() => page(1)}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <ul
        ref={ref}
        tabIndex={0}
        aria-label={label}
        className="-m-3 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth p-3 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <li key={i} className="flex min-w-0 shrink-0 basis-[85%] snap-start sm:basis-[calc((100%-20px)*0.42)]">
            <div className="w-full [&>*]:h-full">{child}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
