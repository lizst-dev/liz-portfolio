"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type PhoneVideo = {
  src: string;
  poster?: string;
  /** An alpha mask (PNG) that cuts the video out, so the phone floats on the page. */
  mask?: string;
  width: number;
  height: number;
  alt: string;
};

export type PhoneItem = {
  /** The stage heading, rendered by the server and shown above the phone. */
  head: ReactNode;
  video: PhoneVideo;
};

/**
 * Silent phone recordings that play one after another (first, second, third, then around again),
 * so only one moves at a time. Hovering or clicking a phone takes over: it plays on demand while the
 * others pause. A click pins it (click again to let go); hover plays it only while the pointer is on it.
 *
 * Nothing plays unless it is on screen, videos don't download until they're about to be seen, and
 * visitors who prefer reduced motion get nothing autoplaying: a click plays a phone, a click stops it.
 * On narrow screens the phones sit in a swipeable row, so each plays on its own while it's in view.
 */
export function PhoneSequence({ items }: { items: PhoneItem[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const cells = useRef<(HTMLDivElement | null)[]>([]);

  const [reduced, setReduced] = useState(false);
  const [wide, setWide] = useState(true);
  const [groupVisible, setGroupVisible] = useState(false);
  const [inView, setInView] = useState<boolean[]>(() => items.map(() => false));
  const [seq, setSeq] = useState(0); // which phone the automatic sequence is on
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const width = window.matchMedia("(min-width: 640px)");
    const sync = () => {
      setReduced(motion.matches);
      setWide(width.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    width.addEventListener("change", sync);

    const group = new IntersectionObserver(([e]) => setGroupVisible(e.isIntersecting), { threshold: 0.3 });
    if (wrap.current) group.observe(wrap.current);

    const each = new IntersectionObserver(
      (entries) =>
        setInView((prev) => {
          const next = [...prev];
          for (const e of entries) {
            const i = cells.current.indexOf(e.target as HTMLDivElement);
            if (i >= 0) next[i] = e.isIntersecting;
          }
          return next;
        }),
      { threshold: 0.6 },
    );
    cells.current.forEach((c) => c && each.observe(c));

    return () => {
      motion.removeEventListener("change", sync);
      width.removeEventListener("change", sync);
      group.disconnect();
      each.disconnect();
    };
  }, []);

  const onDemand = hover !== null || pinned !== null;
  const active = hover ?? pinned ?? seq;

  const shouldPlay = (i: number) => {
    if (reduced) return pinned === i;
    if (wide) return groupVisible && active === i;
    return inView[i] && (pinned === null || pinned === i);
  };

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      v.muted = true; // React doesn't reliably render `muted`, and browsers only autoplay muted video
      if (shouldPlay(i)) void v.play().catch(() => {});
      else v.pause();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, wide, groupVisible, inView, seq, hover, pinned]);

  const next = (i: number) => {
    // The automatic sequence only: hand over to the next phone, and start it from the beginning.
    if (reduced || !wide || onDemand || i !== seq) return;
    const n = (i + 1) % items.length;
    const v = videos.current[n];
    if (v) v.currentTime = 0;
    setSeq(n);
  };

  return (
    <div ref={wrap} className="flex snap-x gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
      {items.map((item, i) => {
        const dim = !reduced && wide && groupVisible && active !== i;
        const v = item.video;
        return (
          <div
            key={v.src}
            ref={(el) => {
              cells.current[i] = el;
            }}
            className="w-[72%] shrink-0 snap-center space-y-6 sm:w-auto"
          >
            {item.head}
            <button
              type="button"
              aria-pressed={pinned === i}
              aria-label={`${pinned === i ? "Let go of" : "Play"} this prototype: ${v.alt}`}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setHover(i);
              }}
              onPointerLeave={() => setHover(null)}
              onClick={() => setPinned((p) => (p === i ? null : i))}
              className="flex w-full cursor-pointer flex-col items-center"
            >
              <video
                ref={(el) => {
                  videos.current[i] = el;
                }}
                src={v.src}
                poster={v.poster}
                width={v.width}
                height={v.height}
                muted
                playsInline
                preload="none"
                loop={reduced || !wide || (onDemand && active === i)}
                onEnded={() => next(i)}
                aria-hidden="true"
                className={`h-auto w-full max-w-[250px] transition-opacity duration-300 ${dim ? "opacity-45" : "opacity-100"}`}
                style={
                  v.mask
                    ? {
                        WebkitMaskImage: `url(${v.mask})`,
                        maskImage: `url(${v.mask})`,
                        WebkitMaskSize: "100% 100%",
                        maskSize: "100% 100%",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                      }
                    : undefined
                }
              />
              {/* A soft shadow on the "ground" under the phone, so it reads as floating. */}
              <span aria-hidden="true" className="mt-4 block h-4 w-36 rounded-full bg-deep/30 blur-lg" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
