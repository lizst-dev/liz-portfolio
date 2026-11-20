"use client";

import { useEffect, useRef, useState } from "react";

/** m:ss */
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/**
 * A short silent screen recording that loops. It plays while on screen, stays still for visitors who prefer
 * reduced motion, and always has a pause/play button and a scrub bar.
 */
export function ClipVideo({
  mp4,
  webm,
  poster,
  width,
  height,
  alt,
  participant,
}: {
  mp4: string;
  webm?: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
  participant?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false); // the visitor's choice
  const [onScreen, setOnScreen] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(0);
  const [tapped, setTapped] = useState(false); // touch screens: a tap shows the scrub bar for a few seconds
  const hideTimer = useRef<number>(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(motion.matches);
      if (motion.matches) setPaused(true);
    };
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => setOnScreen(entries[0]?.isIntersecting ?? false), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the scrub bar in step with the video (a frame loop while it plays, so the thumb glides).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const tick = () => {
      setTime(el.currentTime);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      setTime(el.currentTime);
    };
    const meta = () => setLength(el.duration || 0);
    meta();
    el.addEventListener("loadedmetadata", meta);
    el.addEventListener("durationchange", meta);
    el.addEventListener("play", start);
    el.addEventListener("pause", stop);
    el.addEventListener("seeked", stop);
    if (!el.paused) start();
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("loadedmetadata", meta);
      el.removeEventListener("durationchange", meta);
      el.removeEventListener("play", start);
      el.removeEventListener("pause", stop);
      el.removeEventListener("seeked", stop);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (onScreen && !paused && !document.hidden) void el.play().catch(() => {});
    else el.pause();
  }, [onScreen, paused]);

  return (
    <div>
    <figure
      onPointerDown={(e) => {
        if (e.pointerType !== "touch") return;
        setTapped(true);
        window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setTapped(false), 3500);
      }}
      className="group reveal relative overflow-hidden rounded-[22px] border border-line bg-white"
    >
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        width={width}
        height={height}
        aria-label={participant ? `${alt} Participant ${participant.replace(/^P/, "")}.` : alt}
        className="block h-auto w-full"
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play recording" : "Pause recording"}
        className="absolute right-2 top-2 grid size-8 cursor-pointer place-items-center rounded-full bg-black/70 text-white backdrop-blur hover:bg-black"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
        </svg>
      </button>
      {/* Shown on hover or keyboard focus, or for a few seconds after a tap on touch screens (like YouTube). It floats over the clip's bottom edge so nothing shifts. */}
      <div className={`absolute inset-x-0 bottom-0 bg-white/90 px-3 pb-2 pt-1.5 transition-opacity duration-200 focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none ${tapped ? "opacity-100" : "opacity-0"}`}>
        <input
          type="range"
          min={0}
          max={length || 1}
          step={0.05}
          value={Math.min(time, length || 1)}
          onChange={(e) => {
            const v = ref.current;
            if (!v) return;
            v.currentTime = Number(e.target.value);
            setTime(v.currentTime);
          }}
          aria-label="Scrub through the recording"
          aria-valuetext={`${fmt(time)} of ${fmt(length)}`}
          style={{ ["--p" as string]: `${length ? (time / length) * 100 : 0}%` }}
          className="block h-4 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 [&::-moz-range-progress]:h-1 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-black [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black [&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#e2e2e2] [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#000_var(--p),#e2e2e2_var(--p))] [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
        />
      </div>
      {reduced && <span className="sr-only">Autoplay is off because you prefer reduced motion.</span>}
    </figure>
    {participant && <p className="mt-2 text-center text-[14px] font-bold text-muted">{participant}</p>}
    </div>
  );
}
