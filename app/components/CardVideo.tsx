"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  /** An alpha mask (PNG) that cuts the video out, so the phone floats on the card. */
  mask?: string;
  width: number;
  height: number;
  alt: string;
  /** Overrides the default sizing (fills the height of its parent, up to 400px). */
  className?: string;
};

/**
 * A silent, looping phone recording for a homepage card. It only plays while it is on screen,
 * doesn't download until it is about to be seen, and visitors who prefer reduced motion get the
 * still poster instead.
 */
export function CardVideo({
  src,
  poster,
  mask,
  width,
  height,
  alt,
  className,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);

    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.3,
    });
    if (ref.current) io.observe(ref.current);

    return () => {
      motion.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // browsers only autoplay muted video
    if (visible && !reduced) void v.play().catch(() => {});
    else v.pause();
  }, [visible, reduced]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="metadata"
      role="img"
      aria-label={alt}
      className={className ?? "h-full max-h-[400px] w-auto"}
      style={
        mask
          ? {
              WebkitMaskImage: `url(${mask})`,
              maskImage: `url(${mask})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }
          : undefined
      }
    />
  );
}
