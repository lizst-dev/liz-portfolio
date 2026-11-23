"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type TrackerItem = { id: string; label: string };

/** The pixel marker beside the current section: a dumbbell by default, a car for Uber, a rocket for Blue Origin. Each is a pixel grid. */
const MARKERS: Record<string, { w: number; h: number; dark: string; accent: string; layers?: { fill: string; d: string }[] }> = {
  default: { w: 9, h: 7, dark: "M0 2h1v3H0zM1 1h2v5H1zM6 1h2v5H6zM8 2h1v3H8z", accent: "M3 3h3v1H3z" },
  uber: { w: 14, h: 9, dark: "", accent: "", layers: [{ fill: "#1c2927", d: "M4 0h6v1H4zM3 1h1v1H3zM7 1h1v1H7zM10 1h1v1H10zM2 2h1v1H2zM7 2h1v1H7zM11 2h1v1H11zM1 3h12v1H1zM1 4h1v1H1zM12 4h1v1H12zM1 5h1v1H1zM12 5h1v1H12zM1 6h12v1H1zM2 7h1v1H2zM4 7h1v1H4zM9 7h1v1H9zM11 7h1v1H11zM2 8h3v1H2zM9 8h3v1H9z" }, { fill: "#3b8e85", d: "M3 2h1v1H3zM10 2h1v1H10zM3 4h8v1H3zM2 5h10v1H2z" }, { fill: "#e3f1ef", d: "M4 1h3v1H4zM8 1h2v1H8zM4 2h3v1H4zM8 2h2v1H8z" }, { fill: "#f4d77c", d: "M2 4h1v1H2z" }, { fill: "#d93a2f", d: "M11 4h1v1H11z" }, { fill: "#cfc8b4", d: "M3 7h1v1H3zM10 7h1v1H10z" }] },
  "blue-origin": { w: 13, h: 15, dark: "", accent: "", layers: [{ fill: "#1c2927", d: "M5 0h3v1H5zM4 1h1v1H4zM8 1h1v1H8zM3 2h1v1H3zM9 2h1v1H9zM3 3h1v1H3zM9 3h1v1H9zM3 4h1v1H3zM9 4h1v1H9zM3 5h1v1H3zM9 5h1v1H9zM3 6h1v1H3zM9 6h1v1H9zM3 7h1v1H3zM9 7h1v1H9zM1 8h3v1H1zM9 8h3v1H9zM0 9h1v1H0zM3 9h1v1H3zM9 9h1v1H9zM12 9h1v1H12zM1 10h1v1H1zM3 10h1v1H3zM9 10h1v1H9zM11 10h1v1H11zM2 11h9v1H2zM5 12h3v1H5z" }, { fill: "#e0584b", d: "M5 1h3v1H5zM4 2h5v1H4zM5 4h3v1H5zM5 5h1v1H5zM7 5h1v1H7zM5 6h3v1H5zM1 9h2v1H1zM10 9h2v1H10zM2 10h1v1H2zM10 10h1v1H10z" }, { fill: "#f7f3ea", d: "M4 3h4v1H4zM4 4h1v1H4zM4 5h1v1H4zM4 6h1v1H4zM4 7h4v1H4zM4 8h4v1H4zM4 9h4v1H4zM4 10h4v1H4z" }, { fill: "#d8d2c0", d: "M8 3h1v1H8zM8 4h1v1H8zM8 5h1v1H8zM8 6h1v1H8zM8 7h1v1H8zM8 8h1v1H8zM8 9h1v1H8zM8 10h1v1H8z" }, { fill: "#9fd3e6", d: "M6 5h1v1H6z" }, { fill: "#f6d66b", d: "M5 13h3v1H5z" }, { fill: "#f2a53c", d: "M6 14h1v1H6z" }] },
};

export function CaseTracker({ items, slug }: { items: TrackerItem[]; slug?: string }) {
  const marker = MARKERS[slug ?? ""] ?? MARKERS.default;
  const [active, setActive] = useState(items[0]?.id);
  const aside = useRef<HTMLElement>(null);
  // The section list stays hidden until the Back link has risen to its resting place in the tree.
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // Back starts just below the header and rides up with the page content; once it reaches the
    // tree's own position (vertically centered in the window) it stays put and the section list fades in under it.
    const GAP = 44; // clears the striped edge at the top of the content
    const place = () => {
      const el = aside.current;
      if (!el) return;
      const content = document.getElementById("case-content");
      const rest = Math.max(80, (window.innerHeight - el.offsetHeight) / 2);
      const follow = content ? content.getBoundingClientRect().top + GAP : -Infinity;
      el.style.transform = `translateY(${Math.max(rest, follow)}px)`;
      el.style.visibility = "visible";
      setJoined(follow <= rest);
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, []);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          setActive(top.target.id);
        }
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <aside
      ref={aside}
      aria-label="Case study sections"
      style={{ visibility: "hidden" }}
      className="fixed left-8 top-0 z-40 hidden w-48 xl:block"
    >
      <Link href="/#work" className="mb-6 inline-flex items-center gap-1.5 text-[16px] font-bold hover:text-dusk">
        <span aria-hidden="true">←</span> Back
      </Link>
      <nav
        aria-hidden={!joined}
        className={`transition-[opacity,translate] duration-300 motion-reduce:transition-none ${
          joined ? "opacity-100" : "pointer-events-none -translate-x-3 opacity-0"
        }`}
      >
        <ul className="border-l border-line">
          {items.map((i) => {
            const on = i.id === active;
            return (
              <li key={i.id} className="relative">
                <a
                  href={`#${i.id}`}
                  tabIndex={joined ? undefined : -1}
                  aria-current={on ? "location" : undefined}
                  className={`-ml-px block border-l-2 py-1.5 pl-4 text-[16px] leading-snug transition-colors duration-200 ${
                    on
                      ? "border-teal font-bold text-deep"
                      : "border-transparent text-muted hover:text-deep"
                  }`}
                >
                  {i.label}
                  {/* A pixel marker sits beside the current section, one space after its label. */}
                  <svg
                  aria-hidden="true"
                  style={{ width: marker.w * 2, height: marker.h * 2 }}
                  viewBox={`0 0 ${marker.w} ${marker.h}`}
                  shapeRendering="crispEdges"
                  className={`ml-2 inline-block align-middle transition-opacity duration-200 motion-reduce:transition-none ${on ? "opacity-100" : "opacity-0"}`}
                >
                  {marker.layers ? (
                    marker.layers.map((l) => <path key={l.fill} fill={l.fill} d={l.d} />)
                  ) : (
                    <>
                      <path className="fill-deep" d={marker.dark} />
                      <path className="fill-teal" d={marker.accent} />
                    </>
                  )}
                </svg>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
