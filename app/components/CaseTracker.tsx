"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type TrackerItem = { id: string; label: string };

export function CaseTracker({ items }: { items: TrackerItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

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
      aria-label="Case study sections"
      className="fixed left-8 top-1/2 z-40 hidden w-44 -translate-y-1/2 xl:block"
    >
      <Link href="/#work" className="mb-6 inline-flex items-center gap-1.5 text-[16px] font-bold hover:text-dusk">
        <span aria-hidden="true">←</span> Back
      </Link>
      <nav>
        <ul className="border-l border-line">
          {items.map((i) => {
            const on = i.id === active;
            return (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
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
