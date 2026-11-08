import Link from "next/link";

/**
 * Floating pill. On the landing page (`landing`), the name is not rendered here: an empty slot
 * grows as the hero name scrolls up and docks into it (see HeroName). On other pages the
 * name is a plain home link.
 */
export function SiteNav({ landing = false }: { landing?: boolean }) {
  return (
    <header id="site-header" className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
      <nav
        aria-label="Primary"
        className="flex items-center gap-[var(--g)] rounded-full border border-white/60 bg-white/45 py-1.5 pl-4 pr-1.5 text-[17px] font-medium sm:text-[18px] shadow-[0_2px_6px_rgb(28_41_39/0.15),inset_0_1px_0_rgb(255_255_255/0.7)] backdrop-blur-xl backdrop-saturate-150 [--g:0.625rem] sm:pl-6 sm:[--g:1.75rem]"
      >
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
        <Link href="/#work" className="hover:text-dusk">Work</Link>
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
