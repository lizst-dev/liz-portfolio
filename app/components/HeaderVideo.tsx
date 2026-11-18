"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A silent, looping video laid over the case study header. The header image underneath stays visible
 * until the video is ready, and stays on its own for visitors who prefer reduced motion. It only plays
 * while the header is on screen and the tab is visible.
 */
export function HeaderVideo({ mp4, webm, focus }: { mp4: string; webm?: string; focus?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // The video can finish loading before React attaches onCanPlay, so check once up front.
    const markReady = () => setReady(true);
    if (el.readyState >= 3) markReady();
    // Listen directly too, so a missed event (hydration timing, a hidden tab) can't leave it invisible.
    const events = ["canplay", "loadeddata", "playing", "timeupdate"] as const;
    events.forEach((e) => el.addEventListener(e, markReady, { once: true }));
    let visible = true;
    const sync = () => {
      if (visible && !document.hidden) void el.play().catch(() => {});
      else el.pause();
    };
    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      events.forEach((e) => el.removeEventListener(e, markReady));
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <video
      ref={ref}
      aria-hidden="true"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      onCanPlay={() => setReady(true)}
      style={focus ? { objectPosition: focus } : undefined}
      className={`absolute inset-0 size-full object-cover object-[40%_50%] transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
