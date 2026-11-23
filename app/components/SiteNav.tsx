import Image from "next/image";
import Link from "next/link";
import { NavAutoHide } from "./NavAutoHide";
import { projects } from "../data/projects";

/**
 * Floating pill: the moon-and-star logo and the name (a home link) on the left, then the nav links. The landing page
 * (`landing`) keeps the pill always visible; other pages let it hide on scroll down.
 */
export function SiteNav({ landing = false, currentSlug }: { landing?: boolean; currentSlug?: string }) {
  return (
    <header
      id="site-header"
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none data-[hidden=true]:pointer-events-none data-[hidden=true]:-translate-y-[calc(100%+1.5rem)] data-[hidden=true]:opacity-0"
    >
      {!landing && <NavAutoHide />}
      <nav
        aria-label="Primary"
        className="relative flex items-center gap-[var(--g)] py-1.5 pl-3 pr-1.5 text-[17px] font-medium sm:text-[18px] [--g:0.625rem] sm:pl-4 sm:[--g:1.75rem]"
      >
        {/* The pill's surface is its own layer (not on the nav itself) so the dropdown can sit over it. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 rounded-xl border border-deep bg-card/90 shadow-[3px_3px_0_var(--color-plum)]" />
        <Link href="/" aria-label="Liz Stolnicki, home" className="flex items-center gap-2 whitespace-nowrap font-display text-name text-[14px] leading-none sm:gap-2.5 sm:text-[18px]">
          <Image
            src="/images/logo-moon.png"
            alt=""
            width={64}
            height={64}
            unoptimized
            className="size-6 shrink-0 sm:size-8 [image-rendering:pixelated]"
          />
          Liz Stolnicki
        </Link>
        {/* Work: hovering (or keyboard-focusing) it opens a menu of the case studies. Tapping still jumps to the work section. */}
        <div className="group relative">
          <Link href="/#work" className="hover:text-dusk group-hover:text-dusk">Work</Link>
          <div className="invisible absolute left-1/2 top-full z-10 w-max -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,translate,visibility] duration-200 motion-reduce:transition-none group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:visible group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100">
            <ul aria-label="Case studies" className="rounded-xl border border-deep bg-card p-1 shadow-[3px_3px_0_var(--color-plum)]">
              {projects.map((p) => {
                const current = p.slug === currentSlug;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/work/${p.slug}`}
                      aria-current={current ? "page" : undefined}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1 text-[14px] leading-snug transition-colors hover:bg-sand hover:text-dusk focus-visible:bg-sand aria-[current=page]:bg-sand aria-[current=page]:font-bold"
                    >
                      {p.name}
                      {current && <span aria-hidden="true" className="size-1.5 rounded-full bg-teal" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <Link href="/#about" className="hover:text-dusk">About</Link>
        <Link
          href="/#contact"
          className="inline-flex min-h-9 items-center rounded-control border border-deep bg-coral px-3 font-bold shadow-[2px_2px_0_var(--color-plum)] transition-[translate,scale,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-x-px hover:-translate-y-px hover:bg-sand hover:shadow-[3px_3px_0_var(--color-plum)] active:translate-x-px active:translate-y-px active:scale-[0.96] active:shadow-[1px_1px_0_var(--color-plum)] active:duration-75 sm:px-4"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
