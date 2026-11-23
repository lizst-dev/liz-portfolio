"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** How far (in screen heights) the page scrolls for each question to change. */
const SCREENS_PER_QUESTION = 0.6;

/**
 * A list of questions shown one at a time, in large type. The section pins to the screen and the page scroll
 * drives it, with no snapping: the current question is sharp, the ones before and after peek in half-visible and blurred.
 * Dots (and the neighbors themselves) jump to a question. Once every question has been seen, a "Show all"
 * link lists them in full. Visitors who prefer reduced motion just get the plain list.
 *
 * Every question stays in the page as a real list item in order, so screen readers and the keyboard
 * get all of them; the blur and fade are purely visual.
 */
export function QuestionScroller({ label, questions }: { label?: string; questions: string[] }) {
  const n = questions.length;
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null); // the part that pins to the screen
  const spacer = useRef<HTMLDivElement>(null); // the extra scroll distance that drives the questions
  const [pos, setPos] = useState(0); // how far through the questions we are, as a fraction (0 to n - 1)
  const active = Math.round(pos);
  const [seenAll, setSeenAll] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  const pinned = !reduced && !showAll;

  /** Where the pinned part sits on screen, and how far the page scrolls while it's pinned. */
  const geometry = useCallback(() => {
    const el = outer.current;
    const pin = inner.current;
    const space = spacer.current;
    if (!el || !pin || !space) return null;
    const r = el.getBoundingClientRect();
    const T = parseFloat(getComputedStyle(pin).top) || 0;
    const travel = Math.max(1, space.offsetHeight);
    return { r, T, travel, hc: pin.offsetHeight };
  }, []);

  /** The page scroll position at which question `i` is the current one. */
  const topFor = useCallback(
    (i: number) => {
      const g = geometry();
      if (!g) return 0;
      return g.r.top + window.scrollY - g.T + (g.travel * i) / Math.max(1, n - 1);
    },
    [n, geometry],
  );
  const animating = useRef(false);
  /** Our own eased scroll, so it behaves the same in every browser and can't be cut short by trackpad momentum. */
  const goTo = useCallback(
    (i: number) => {
      const from = window.scrollY;
      const to = topFor(i);
      if (Math.abs(to - from) < 2) return;
      const start = performance.now();
      const ms = 700;
      animating.current = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / ms);
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // ease in and out
        window.scrollTo({ top: from + (to - from) * e, behavior: "instant" });
        if (t < 1) requestAnimationFrame(step);
        else animating.current = false;
      };
      requestAnimationFrame(step);
    },
    [topFor],
  );

  // Follow the page scroll continuously. The questions glide toward the scroll position (a little easing,
  // so trackpad steps and mouse-wheel notches both read as smooth motion) instead of snapping or hijacking the wheel.
  useEffect(() => {
    const el = outer.current;
    if (!el || !pinned) return;
    let frame = 0;
    let target = 0;
    let shown = 0;

    const read = () => {
      const g = geometry();
      if (!g) return 0;
      return Math.min(1, Math.max(0, (g.T - g.r.top) / g.travel)) * (n - 1);
    };
    const tick = () => {
      frame = 0;
      shown += (target - shown) * 0.16;
      if (Math.abs(target - shown) < 0.002) shown = target;
      setPos(shown);
      if (shown > n - 1.15) setSeenAll(true);
      if (shown !== target) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = read();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    target = shown = read();
    setPos(shown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [n, pinned, geometry]);

  const showAllLink = (
    <button
      type="button"
      onClick={() => {
        setShowAll((v) => !v);
        outer.current?.scrollIntoView({ block: "center" });
      }}
      className="cursor-pointer text-[16px] font-bold underline underline-offset-4 hover:no-underline"
    >
      {showAll ? "Scroll through" : "Show all"}
    </button>
  );

  // Plain list: reduced motion, or the visitor asked to see everything.
  if (!pinned) {
    return (
      <div ref={outer} className="reveal">
        {label && <p className="mb-4 font-bold">{label}</p>}
        <ol className="space-y-5">
          {questions.map((q, i) => (
            <li key={q} className="flex gap-4 border-t border-line pt-4 font-serif text-[clamp(22px,2.8vw,30px)] leading-[1.2]">
              <span className="w-12 shrink-0 font-body text-[16px] font-bold leading-[2]">RQ{i + 1}</span>
              {q}
            </li>
          ))}
        </ol>
        {!reduced && <p className="mt-5">{showAllLink}</p>}
      </div>
    );
  }

  return (
    <div ref={outer}>
      <div ref={inner} className="sticky flex flex-col justify-center" style={{ top: "max(96px, calc(50svh - 13rem))" }}>
        <div className="flex items-center justify-between gap-4 pb-4">
          {label && <p className="font-bold">{label}</p>}
        </div>

        <div className="flex items-stretch gap-3 sm:gap-5">
          <div className="flex flex-col items-center justify-center" role="group" aria-label="Choose a question">
            {questions.map((q, i) => (
              <button
                key={q}
                type="button"
                aria-label={`Question ${i + 1} of ${n}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => goTo(i)}
                className="group grid size-5 cursor-pointer place-items-center"
              >
                <span className={`size-1.5 rounded-full bg-deep transition-opacity ${i === active ? "opacity-45" : "opacity-15 group-hover:opacity-30"}`} />
              </button>
            ))}
          </div>
          <div
            className="relative min-w-0 flex-1 overflow-hidden [--step:150px] sm:[--step:180px] h-[calc(var(--step)*2)] [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)]"
          >
            <ol>
              {questions.map((q, i) => {
                // The question's distance from the current spot drives everything, so it all moves with the scroll.
                const off = i - pos;
                const d = Math.min(1.6, Math.abs(off));
                const current = i === active;
                return (
                  <li
                    key={q}
                    aria-current={current ? "true" : undefined}
                    onClick={current ? undefined : () => goTo(i)}
                    style={{
                      transform: `translateY(calc(-50% + ${off} * var(--step)))`,
                      opacity: Math.max(0, d <= 1 ? 1 - 0.62 * d : 0.38 * (1 - (d - 1) / 0.6)),
                      filter: `blur(${(Math.min(d, 1) * 2.6).toFixed(2)}px)`,
                    }}
                    className={`absolute inset-x-0 top-1/2 will-change-[transform,opacity,filter] ${current ? "" : "cursor-pointer select-none"}`}
                  >
                    <span className="mb-2 block text-[15px] font-bold tracking-wide text-muted">RQ{i + 1}</span>
                    <span className="block font-serif text-[clamp(26px,4vw,44px)] leading-[1.12] tracking-[-0.01em]">{q}</span>
                  </li>
                );
              })}
            </ol>
          </div>

        </div>

        <p className="mt-4 min-h-6 text-[15px]">{seenAll && showAllLink}</p>
      </div>
      <div ref={spacer} aria-hidden="true" style={{ height: `${(n - 1) * SCREENS_PER_QUESTION * 100}svh` }} />
    </div>
  );
}
