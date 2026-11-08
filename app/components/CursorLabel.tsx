"use client";

import { useEffect, useRef } from "react";

/**
 * A small parchment label that trails the pointer (offset, no lag) over anything marked with
 * `data-cursor-label="..."`. Mouse-like pointers only; touch devices never show it.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor-label]");
      if (!target) {
        el.style.opacity = "0";
        return;
      }
      el.textContent = target.dataset.cursorLabel ?? "";
      el.style.opacity = "1";
      el.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 18}px)`;
    };
    const hide = () => {
      el.style.opacity = "0";
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    return () => {
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300] rounded-[3px] border-2 border-[#3a2218] bg-[#f6e6cb] px-2 font-body text-[14px] font-bold leading-[1.35] text-[#3a2218] opacity-0 shadow-[2px_2px_0_#3a2218] transition-opacity duration-150"
    />
  );
}
