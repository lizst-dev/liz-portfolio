"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ZoomImage } from "./ZoomImage";

type DockItem = { src: string; alt: string; width: number; height: number; title?: string };

/** How big the card under the pointer gets, relative to its resting size. */
const MAX_SCALE = 1.7;

/**
 * A row of floating cards that magnify like the macOS Dock: the card under the pointer grows and
 * the others stay their size and slide aside to make room.
 * Cards grow downward (their titles stay put) into reserved space, so the page never jumps.
 *
 * Only the images are transformed. The cards float on the page by blending their white backdrops away
 * (mix-blend-multiply), which stops working if a parent element is transformed.
 * Magnification only runs for a mouse on wide screens and when motion isn't reduced; clicking a card
 * still opens it large.
 */
export function CardDock({ items, className }: { items: DockItem[]; className?: string }) {
  const cells = useRef<(HTMLLIElement | null)[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [fx, setFx] = useState<{ s: number; dx: number }[]>(() => items.map(() => ({ s: 1, dx: 0 })));

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(wide.matches && !motion.matches);
    sync();
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  const reset = () => {
    setFx(items.map(() => ({ s: 1, dx: 0 })));
  };

  // The hovered card is decided by which *visible* card the pointer is over (each image reports its own
  // pointer-enter), not by the pointer's position over the original slots. A grown card covers part of
  // its neighbour's slot, so slot-based hit-testing would flip the hover back and forth near its edge.
  // In the gaps between cards the last hovered card stays grown; leaving the row resets everything.
  const hover = (hovered: number, e: React.PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const cell = cells.current[hovered];
    if (!cell) return;
    // The hovered card grows by `extra` pixels; its neighbours stay the same size and slide
    // half of that to each side, so it has room and nothing overlaps.
    const extra = cell.getBoundingClientRect().width * (MAX_SCALE - 1);
    setFx(
      items.map((_, i) => ({
        s: i === hovered ? MAX_SCALE : 1,
        dx: i === hovered ? 0 : i < hovered ? -extra / 2 : extra / 2,
      })),
    );
  };

  return (
    <ul
      onPointerLeave={reset}
      className={`${className ?? ""} ${enabled ? "pb-28" : ""}`}
    >
      {items.map((it, i) => (
        <li
          key={it.src}
          ref={(el) => {
            cells.current[i] = el;
          }}
          className="min-w-0"
        >
          {it.title && (
            <p
              style={{ translate: `${fx[i].dx}px 0` }}
              className={`mb-2 text-center font-serif text-[clamp(20px,2.2vw,24px)] leading-[1.2] transition-[translate] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
            >
              {it.title}
            </p>
          )}
          <ZoomImage src={it.src} alt={it.alt} width={it.width} height={it.height}>
            <Image
              src={it.src}
              alt={it.alt}
              width={it.width}
              height={it.height}
              sizes="(min-width: 800px) 260px, 50vw"
              quality={85}
              onPointerEnter={(e) => hover(i, e)}
              style={{ scale: fx[i].s, translate: `${fx[i].dx}px 0`, transformOrigin: "50% 0" }}
              className={`h-auto w-full mix-blend-multiply transition-[scale,translate] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
            />
          </ZoomImage>
        </li>
      ))}
    </ul>
  );
}
