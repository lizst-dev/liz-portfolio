"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  mp4: string;
  webm?: string;
  poster: string;
  alt: string;
  className?: string;
};

/** Looping header video. Shows the poster (still frame) for reduced-motion users and until the video can play. */
export function HeaderVideo({ mp4, webm, poster, alt, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true); // assume reduced until checked, so no motion flashes
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      <Image src={poster} alt={alt} fill quality={90} preload sizes="(min-width: 768px) 90vw, 100vw" className={`object-cover ${className}`} />
      {!reduced && (
        <video
          ref={ref}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
        >
          {webm && <source src={webm} type="video/webm" />}
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </>
  );
}
