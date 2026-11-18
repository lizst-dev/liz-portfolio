"use client";

import { useEffect } from "react";

/**
 * Hides the floating pill (`#site-header`) while scrolling down and brings it back on a small scroll up,
 * when near the top of the page, when the mouse moves to where the pill sits, or when it receives keyboard focus. It only toggles `data-hidden` on the
 * header (styled in SiteNav), so nothing re-renders on scroll.
 */
export function NavAutoHide() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const TOP = 80; // always visible this close to the top
    const STEP = 6; // ignore tiny scroll jitters
    let last = window.scrollY;
    const set = (hidden: boolean) => header.setAttribute("data-hidden", String(hidden));
    const onScroll = () => {
      const y = window.scrollY, dy = y - last;
      if (y < TOP) set(false);
      else if (dy > STEP) { if (!header.matches(":hover")) set(true); } // stay put while the pointer is on the pill
      else if (dy < -STEP) set(false);
      if (Math.abs(dy) > STEP || y < TOP) last = y;
    };
    const show = () => set(false);
    // Moving the mouse to the top of the page, where the pill normally sits, brings it back.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || header.getAttribute("data-hidden") !== "true") return;
      const r = header.getBoundingClientRect(); // only moved vertically, so left/right still mark where it sits
      if (e.clientY <= 72 && e.clientX >= r.left - 48 && e.clientX <= r.right + 48) set(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    header.addEventListener("focusin", show);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      header.removeEventListener("focusin", show);
      header.removeAttribute("data-hidden");
    };
  }, []);
  return null;
}
