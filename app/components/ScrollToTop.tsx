"use client";

import { useLayoutEffect } from "react";

// When the page arrives through the back or forward button, the browser's own scroll position
// should win, so remember that a popstate just happened.
let poppedAt = 0;
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    poppedAt = Date.now();
  });
}

/**
 * Next keeps the current scroll position when you move between pages whose top is still on screen,
 * so jumping from the bottom of one case study to another landed at the bottom. This puts a case
 * study at its top when you arrive by clicking a link, instantly (the site's smooth scrolling would
 * otherwise animate it). Back and forward keep your old place, and a link with a #hash is left to the browser.
 */
export function ScrollToTop() {
  useLayoutEffect(() => {
    if (window.location.hash) return;
    if (Date.now() - poppedAt < 1500) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  return null;
}
