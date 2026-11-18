"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type TrackerItem = { id: string; label: string };

export function CaseTracker({ items }: { items: TrackerItem[] }) {
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
      className="fixed left-8 top-0 z-40 hidden w-44 xl:block"
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
              <li key={i.id}>
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
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
