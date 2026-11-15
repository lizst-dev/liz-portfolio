"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A YouTube video that stays a plain poster until someone clicks play. The poster is the video's own
 * thumbnail, saved with the site, so nothing is requested from YouTube before then (no script, no
 * tracking), and the player itself loads from the privacy-enhanced youtube-nocookie.com domain.
 */
export function YouTubeEmbed({
  id,
  title,
  poster,
}: {
  id: string;
  title: string;
  poster: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-card border border-line bg-deep shadow-card">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 cursor-pointer"
        >
          <Image
            src={poster}
            alt=""
            fill
            quality={90}
            sizes="(min-width: 1000px) 912px, 100vw"
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-deep/15 transition-colors group-hover:bg-deep/5"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-deep bg-white pl-1 text-[32px] text-deep shadow-[3px_3px_0_var(--color-plum)] transition-[scale,box-shadow] duration-300 group-hover:scale-105 group-hover:shadow-[5px_5px_0_var(--color-plum)] group-active:scale-95 group-active:shadow-none"
          >
            ▶
          </span>
        </button>
      )}
    </div>
  );
}
