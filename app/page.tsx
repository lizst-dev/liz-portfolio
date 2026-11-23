import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { CardVideo } from "./components/CardVideo";
import { HeroScene } from "./components/HeroScene";
import { SiteNav } from "./components/SiteNav";
import { btnPrimary, btnSecondary, glass } from "./components/ui";
import { projects } from "./data/projects";

/** Status pill colors on the project cards (dark text on a light tint, so each passes AA). */
const STATUS_TONE = {
  green: "border-[#5aa66e] bg-[#dcefdc] text-[#1d5a32] outline-[#5aa66e]",
  blue: "border-[#5b8fcf] bg-[#dbe9f8] text-[#1d4e8a] outline-[#5b8fcf]",
  purple: "border-[#9276b8] bg-[#e9e0f3] text-[#4a3358] outline-[#9276b8]",
} as const;

function SectionTitle({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mb-8 flex items-center gap-3 font-serif text-[clamp(32px,5vw,48px)] leading-[1.1]"
    >
      <span
        aria-hidden="true"
        className="inline-block h-6 w-1.5 shrink-0 rounded-full bg-teal"
      />
      {children}
    </h2>
  );
}

/** A company logo in the "Previously @" line. The company name is its alt text, since the name is no longer written out. */
function Logo({ name, src, w, h, fit }: { name: string; src: string; w: number; h: number; fit: string }) {
  return <Image src={src} alt={name} width={w} height={h} sizes="120px" className={`w-auto max-w-none shrink-0 ${fit}`} />;
}

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-deep focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to work
      </a>

      <SiteNav landing />

      <main id="top">
        {/* Hero: full image height; glass card stays pinned to the viewport bottom while scrolling */}
        <section className="relative">
          <HeroScene />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-[225px] bg-[linear-gradient(to_bottom,rgb(249_237_211_/_0),var(--color-fade)_35%,var(--color-page))]"
          />
          {/* md:pb-24 keeps the card, when it comes to rest at the hero's end, above the character sitting on the first project card */}
          <div className="hero-card-wrap absolute inset-0 flex flex-col justify-end p-4 sm:px-6 md:pb-24">
            <div className="hero-card sticky bottom-10 z-10 sm:w-fit max-w-[680px] md:max-w-[clamp(480px,calc(52*var(--hu)),760px)] md:ml-12 lg:ml-24 rounded-xl border border-deep bg-card/90 p-6 text-deep shadow-[5px_5px_0_var(--color-plum)] sm:p-[clamp(22px,calc(2*var(--hu)),34px)]">
              <h2 className="mb-3 font-serif text-[clamp(30px,calc(3.3*var(--hu)),52px)] leading-[1.08]">
                Technical UX design for
                <br className="hidden sm:inline" /> complex systems.
              </h2>
              <p className="mb-5 hidden flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(18px,calc(1.6*var(--hu)),22px)] leading-[1.45] sm:flex">
                <span>Previously @</span>
                <span className="flex items-end gap-1">
                  <Logo name="P&amp;G" src="/images/logos/pg.png" w={256} h={256} fit="h-[1.5em]" />
                  <span aria-hidden="true">,</span>
                </span>
                <span className="flex items-end gap-1">
                  <Logo name="Zimmer Biomet" src="/images/logos/zimmer-biomet.png" w={707} h={128} fit="h-[1.2em]" />
                  <span aria-hidden="true">,</span>
                </span>
                <Logo name="Blue Origin" src="/images/logos/blue-origin.png" w={896} h={472} fit="h-[1.9em]" />
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a href="#work" className={btnPrimary}>
                  Selected work
                </a>
                <a href="#contact" className={btnSecondary}>
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="mx-auto max-w-page px-6 py-20">
          <SectionTitle>Selected work</SectionTitle>
          <ul className="grid gap-10">
            {projects.map((p, i) => {
              const wide = i % 2 === 0;
              return (
                <li
                  key={p.slug}
                  data-cursor-label="View"
                  className="group relative grid gap-6 md:grid-cols-12"
                >
                  {i === 0 && (
                    <Image
                      src="/images/characters/daydreaming.png"
                      alt=""
                      width={878}
                      height={963}
                      quality={90}
                      sizes="220px"
                      className="pointer-events-none absolute bottom-full right-10 z-0 hidden h-[200px] w-auto md:block lg:right-14 lg:h-[230px]"
                    />
                  )}
                  {p.cardVideo ? (
                    <div
                      className={`${glass} relative flex min-h-[260px] items-center justify-center overflow-hidden px-6 py-5 ${
                        wide ? "md:col-span-7" : "md:col-span-5 md:order-2"
                      }`}
                      style={{ background: p.cardVideo.background }}
                    >
                      <CardVideo {...p.cardVideo} />
                    </div>
                  ) : p.heroImage ? (
                    <div
                      className={`${glass} relative min-h-[260px] overflow-hidden ${
                        wide ? "md:col-span-7" : "md:col-span-5 md:order-2"
                      }`}
                    >
                      <Image
                        src={p.heroImage.src}
                        alt={p.heroImage.alt}
                        fill
                        quality={90}
                        sizes="(min-width: 768px) 700px, 100vw"
                        className="object-cover"
                        style={{
                          objectPosition: p.heroImage.focus ?? "35% 50%",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`${glass} grid min-h-[260px] place-items-center bg-[linear-gradient(160deg,var(--color-fade),#e9b9a8_60%,#b79ac2)] p-6 text-center text-[15px] ${
                        wide ? "md:col-span-7" : "md:col-span-5 md:order-2"
                      }`}
                    >
                      <span className="rounded-full border border-white/80 bg-white/65 px-4 py-1.5 backdrop-blur-md">
                        Project visual to come
                      </span>
                    </div>
                  )}
                  <article
                    className={`${glass} z-10 flex flex-col justify-between gap-10 p-8 md:p-10 ${
                      wide ? "md:col-span-5" : "md:col-span-7 md:order-1"
                    }`}
                  >
                    <div>
                      <ul className="mb-5 flex flex-wrap gap-2">
                        <li className={`mr-1.5 rounded-control border px-2.5 py-0.5 text-xs font-bold outline outline-1 outline-offset-2 ${STATUS_TONE[p.status.tone]}`}>{p.status.label}</li>
                        {p.tags.map((t) => (
                          <li
                            key={t}
                            className="rounded-control border border-line bg-white/60 px-2.5 py-0.5 text-xs font-bold"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                      <h3 className="mb-2 font-serif text-[clamp(28px,4vw,40px)] leading-[1.1]">
                        <Link
                          href={`/work/${p.slug}`}
                          className="after:absolute after:inset-0 after:content-['']"
                        >
                          {p.name}
                        </Link>
                      </h3>
                      <p className="mb-4 text-[15px] font-bold">{p.role}</p>
                      <p>{p.cardSummary}</p>
                    </div>
                    <p
                      className="text-[17px] font-bold group-hover:text-dusk"
                      aria-hidden="true"
                    >
                      Read case study →
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        {/* About */}
        <section id="about" className="border-t border-line">
          <div className="mx-auto flex max-w-page flex-col gap-8 px-6 py-20 md:flex-row md:gap-8">
            <div className="md:shrink-0">
              <SectionTitle>About</SectionTitle>
              <p className="font-serif text-[clamp(24px,3vw,27px)] leading-[1.2]">
                I&apos;m Liz, and this is my dog, Ori.
              </p>
            </div>
            {/* The space between heading and body: the character is centered in it, bottom aligned with the body text. */}
            <div
              aria-hidden="true"
              className="order-last flex md:order-none md:flex-1 md:items-end md:justify-center"
            >
              <Image
                src="/images/characters/ori.png"
                alt=""
                width={582}
                height={648}
                quality={90}
                sizes="200px"
                className="pointer-events-none block h-[120px] w-auto sm:h-[150px] md:h-[170px]"
              />
            </div>
            <div className="space-y-4 md:w-[40%] md:shrink-0">
              <p>
                I&apos;m a technical UX designer with a master&apos;s in
                Human-Centered Design and Engineering from the University of
                Washington. I&apos;m drawn to work that balances technical
                complexity with human need.
              </p>
              <p>
                I&apos;m looking for a full-time UX design role, especially in
                complex systems, enterprise applications, or health and
                wellness.
              </p>
              <Link href="/about" className={`${btnPrimary} mt-2`}>
                Learn more
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
