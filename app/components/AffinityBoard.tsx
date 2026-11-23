"use client";

import Image from "next/image";
import { useState } from "react";
import { PanDialog } from "./PanDialog";

export type BoardSection = {
  title: string;
  /** The high-resolution image of this part of the board. */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Where it sits on the board, in the board's own units (see `Board`). */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Board = {
  /** The board's overall size. Everything below is placed in these units. */
  width: number;
  height: number;
  sections: BoardSection[];
  /** Thin connector arrows between sections. */
  arrows?: { from: [number, number]; to: [number, number] }[];
  /** Small decorative sticky notes. */
  stickies?: { x: number; y: number; w: number; h: number; color: string }[];
};

/**
 * A big working board (like an affinity diagram) rebuilt from separate high-resolution sections, laid out the
 * way they sit on the board. The board reads as one picture; each section lifts on hover and opens in a
 * full-screen viewer (drag to pan, scroll to zoom) with Previous/Next to move between sections.
 */
export function AffinityBoard({ board, alt }: { board: Board; alt: string }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const n = board.sections.length;
  const current = board.sections[openAt ?? 0];
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <>
      <div role="group" aria-label={alt} className="relative w-full" style={{ aspectRatio: `${board.width} / ${board.height}` }}>
        {/* Connector arrows and sticky notes sit behind the sections, as on the board. */}
        <svg aria-hidden="true" viewBox={`0 0 ${board.width} ${board.height}`} className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <marker id="board-arrowhead" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0L6 3L0 6Z" fill="#b8b6b2" />
            </marker>
          </defs>
          {board.stickies?.map((s) => (
            <rect key={`${s.x}-${s.y}`} x={s.x} y={s.y} width={s.w} height={s.h} rx="1.5" fill={s.color} />
          ))}
          {board.arrows?.map((a) => (
            <line
              key={`${a.from}-${a.to}`}
              x1={a.from[0]}
              y1={a.from[1]}
              x2={a.to[0]}
              y2={a.to[1]}
              stroke="#b8b6b2"
              strokeWidth="1.6"
              markerEnd="url(#board-arrowhead)"
            />
          ))}
        </svg>
        {board.sections.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setOpenAt(i)}
            aria-label={`Open ${s.title}: ${s.alt}`}
            style={{ left: pct(s.x, board.width), top: pct(s.y, board.height), width: pct(s.w, board.width), height: pct(s.h, board.height) }}
            className="group absolute block cursor-zoom-in rounded-[3px] transition-[translate,filter] duration-200 ease-out hover:z-10 hover:drop-shadow-[0_6px_10px_rgba(28,41,39,0.28)] focus-visible:z-10 focus-visible:drop-shadow-[0_6px_10px_rgba(28,41,39,0.28)] motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1"
          >
            <Image
              src={s.src}
              alt=""
              width={s.width}
              height={s.height}
              sizes={`${Math.round((s.w / board.width) * 1000)}px`}
              quality={85}
              className="h-full w-full"
            />
            <span className="pointer-events-none absolute left-1 top-1 rounded-full bg-deep/85 px-2 py-0.5 text-[12px] font-bold leading-tight text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {s.title}
            </span>
          </button>
        ))}
      </div>
      <PanDialog
        open={openAt !== null}
        onClose={() => setOpenAt(null)}
        src={current.src}
        width={current.width}
        height={current.height}
        alt={current.alt}
        title={`${current.title} · ${(openAt ?? 0) + 1} of ${n}`}
        onPrevious={() => setOpenAt((i) => ((i ?? 0) - 1 + n) % n)}
        onNext={() => setOpenAt((i) => ((i ?? 0) + 1) % n)}
      />
    </>
  );
}
