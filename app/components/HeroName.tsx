"use client";

import { useEffect, useRef } from "react";

const PILL_FONT_PX = 18;
const PILL_FONT_MOBILE_PX = 14;

const letterClasses =
  "font-display text-[clamp(30px,calc(7.4*var(--hu)),120px)] leading-none tracking-normal whitespace-nowrap";
const descriptorClasses =
  "mt-3 block font-body text-[clamp(16px,calc(1.7*var(--hu)),24px)] font-medium tracking-normal";
const descriptorText = "(UX & Product Designer, MS HCDE @UW)";

/**
 * The big name. Scrolling shrinks it in proportion and carries it up into the nav pill, where it
 * stays docked. Until docked it is absolutely positioned inside the hero (so it scrolls natively);
 * once docked it is fixed over the pill. A coral-to-plum glow follows the pointer inside the letters.
 * Over the Seattle scene the name fades from plum to cream (see --tone in globals.css).
 */
export function HeroName() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = elRef.current;
    const letters = lettersRef.current;
    const slot = document.getElementById("nav-name-slot");
    const header = document.getElementById("site-header");
    if (!wrap || !el || !letters || !slot || !header) return;

    let scaleTarget = 1;
    let slotWidth = 0;
    let wrapDocTop = 0;
    let wrapLeft = 0;

    const measure = () => {
      const heroFont = parseFloat(getComputedStyle(letters).fontSize);
      const pillFont = window.innerWidth < 640 ? PILL_FONT_MOBILE_PX : PILL_FONT_PX;
      scaleTarget = pillFont / heroFont;
      slotWidth = letters.offsetWidth * scaleTarget;
      const r = wrap.getBoundingClientRect();
      wrapDocTop = r.top + window.scrollY;
      wrapLeft = r.left;
    };

    const update = () => {
      const y = window.scrollY;
      const distance = Math.max(1, wrapDocTop - slot.getBoundingClientRect().top);
      // Scroll-linked, so it is user-driven motion and stays on even with reduced motion.
      const p = Math.min(1, Math.max(0, y / distance));

      header.style.setProperty("--p", String(p));
      el.style.setProperty("--p", String(p));
      header.style.setProperty("--slot-w", `${slotWidth * p}px`);
      const target = slot.getBoundingClientRect();

      if (p >= 1) {
        el.style.position = "fixed";
        el.style.left = `${target.left}px`;
        el.style.top = `${target.top}px`;
        el.style.transform = `scale(${scaleTarget})`;
      } else {
        el.style.position = "absolute";
        el.style.left = "0px";
        el.style.top = "0px";
        const s = 1 + (scaleTarget - 1) * p;
        el.style.transform = `translate(${p * (target.left - wrapLeft)}px, 0) scale(${s})`;
      }
      el.dataset.moving = String(p > 0.02);
      el.dataset.docked = String(p >= 1);
    };

    // Run inside the scroll event itself (no rAF) so the name never lags the native scroll.
    const schedule = () => update();
    const remeasure = () => {
      // Reset to the resting state so measurements are not affected by the transform.
      el.style.position = "absolute";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.transform = "none";
      measure();
      update();
    };

    remeasure();
    document.fonts?.ready.then(remeasure);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  const onMove = (e: React.PointerEvent<HTMLHeadingElement>) => {
    const el = elRef.current;
    const letters = lettersRef.current;
    if (!el || !letters) return;
    const r = letters.getBoundingClientRect();
    const s = r.width / letters.offsetWidth || 1;
    el.style.setProperty("--mx", `${(e.clientX - r.left) / s}px`);
    el.style.setProperty("--my", `${(e.clientY - r.top) / s}px`);
  };
  const onLeave = () => {
    elRef.current?.style.setProperty("--mx", "-999px");
  };
  const toTop = () => {
    if (elRef.current?.dataset.docked === "true") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={wrapRef} className="relative">
      {/* Invisible copy that reserves the hero layout space while the real name travels. */}
      <div aria-hidden="true" className="invisible">
        <span className={`block ${letterClasses}`}>Liz Stolnicki</span>
        <span className={descriptorClasses}>{descriptorText}</span>
      </div>

      <h1
        ref={elRef}
        tabIndex={0}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={toTop}
        onKeyDown={(e) => {
          if (e.key === "Enter") toTop();
        }}
        className="hero-name pointer-events-auto absolute left-0 top-0 z-[60] origin-top-left"
      >
        <span ref={lettersRef} className={`hero-name__letters block ${letterClasses}`}>
          Liz Stolnicki
        </span>
        <span className={`hero-name__reveal ${descriptorClasses}`}>{descriptorText}</span>
      </h1>
    </div>
  );
}
