import { btnSecondary, EMAIL, LINKEDIN, RESUME } from "./ui";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto max-w-page px-6 pb-8 pt-20">
        <div className="pb-20">
          <h2 className="mb-10 max-w-[18ch] font-serif text-[clamp(36px,6vw,54px)] leading-[1.1]">
            Let&apos;s work together.
          </h2>
          <a href={`mailto:${EMAIL}`} className={btnSecondary}>Say hello</a>
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm">
          <span>© 2026 Liz Stolnicki</span>
          <nav aria-label="Elsewhere" className="flex gap-6 font-bold">
            <a href={`mailto:${EMAIL}`} className="hover:text-dusk">Email</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="hover:text-dusk">LinkedIn</a>
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="hover:text-dusk">Resume</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
