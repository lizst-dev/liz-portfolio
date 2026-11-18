import Link from "next/link";
import { NavAutoHide } from "./NavAutoHide";
import { projects } from "../data/projects";

/**
 * Floating pill. On the landing page (`landing`), the name is not rendered here: an empty slot
 * grows as the hero name scrolls up and docks into it (see HeroName). On other pages the
 * name is a plain home link.
 */
export function SiteNav({ landing = false, currentSlug }: { landing?: boolean; currentSlug?: string }) {
  return (
    <header
      id="site-header"
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none data-[hidden=true]:pointer-events-none data-[hidden=true]:-translate-y-[calc(100%+1.5rem)] data-[hidden=true]:opacity-0"
    >
      {/* The landing page keeps its pill: the hero name docks into it as you scroll. */}
      {!landing && <NavAutoHide />}
      <nav
        aria-label="Primary"
        className="relative flex items-center gap-[var(--g)] py-1.5 pl-4 pr-1.5 text-[17px] font-medium sm:text-[18px] [--g:0.625rem] sm:pl-6 sm:[--g:1.75rem]"
      >
        {/* The pill's glass is its own layer (not on the nav itself) so the dropdown can blur the page behind it too. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-white/60 bg-white/45 shadow-[0_2px_6px_rgb(28_41_39/0.15),inset_0_1px_0_rgb(255_255_255/0.7)] backdrop-blur-xl backdrop-saturate-150" />
        {landing ? (
          <span
            id="nav-name-slot"
            aria-hidden="true"
            className="ml-[calc(var(--g)*-1*(1-var(--p,0)))] block h-[14px] w-[var(--slot-w,0px)] sm:h-[18px] shrink-0"
          />
        ) : (
          <Link
            href="/"
            aria-label="Liz Stolnicki, home"
            className="whitespace-nowrap font-display text-name text-[14px] leading-none sm:text-[18px]"
          >
            Liz Stolnicki
          </Link>
        )}
        {/* Work: hovering (or keyboard-focusing) it opens a menu of the case studies. Tapping still jumps to the work section. */}
        <div className="group relative">
          <Link href="/#work" className="hover:text-dusk group-hover:text-dusk">Work</Link>
          <div className="invisible absolute left-1/2 top-full z-10 w-max -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,translate,visibility] duration-200 motion-reduce:transition-none group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-has-[:focus-visible]:visible group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100">
            <ul aria-label="Case studies" className="rounded-2xl p-1 border border-white/60 bg-white/45 shadow-[0_2px_6px_rgb(28_41_39/0.15),inset_0_1px_0_rgb(255_255_255/0.7)] backdrop-blur-xl backdrop-saturate-150">
              {projects.map((p) => {
                const current = p.slug === currentSlug;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/work/${p.slug}`}
                      aria-current={current ? "page" : undefined}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1 text-[14px] leading-snug transition-colors hover:bg-white/60 hover:text-dusk focus-visible:bg-white/60 aria-[current=page]:bg-white/60 aria-[current=page]:font-bold"
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
          className="inline-flex min-h-9 items-center rounded-full border border-deep px-3 sm:px-4 transition-[translate,scale,background-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:bg-sand active:scale-[0.94] active:duration-75"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
