import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseTracker } from "../../components/CaseTracker";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteNav } from "../../components/SiteNav";
import { btnPrimary, glass } from "../../components/ui";
import { getProject, projects, type Figure } from "../../data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Liz Stolnicki`,
    description: project.cardSummary,
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Labeled stand-in for an image, animation, diagram, or chart. */
function Media({ label, hero = false }: { label: string; hero?: boolean }) {
  const i = label.indexOf(":");
  const kind = i > 0 ? label.slice(0, i) : "Media";
  const text = i > 0 ? label.slice(i + 1).trim() : label;
  return (
    <div
      role="img"
      aria-label={`Placeholder. ${label}`}
      className={`reveal grid place-items-center rounded-card border-[1.5px] border-dashed border-line p-6 text-center ${
        hero
          ? "aspect-[16/10] bg-[linear-gradient(160deg,var(--color-fade),#e9b9a8_60%,#b79ac2)]"
          : "aspect-[16/9] bg-white/50"
      }`}
    >
      <div className="max-w-[44ch]">
        <p className="mb-2 inline-block rounded-full border border-line bg-white/70 px-3 py-0.5 text-xs font-bold">
          {kind} placeholder
        </p>
        <p className="text-[17px]">{text}</p>
      </div>
    </div>
  );
}

function Fig({ figure }: { figure: Figure }) {
  return (
    <figure className={`${glass} reveal overflow-hidden p-3 sm:p-4`}>
      <Image
        src={figure.src}
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        sizes="(min-width: 800px) 720px, 100vw"
        className="h-auto w-full rounded-control bg-white"
      />
      <figcaption className="px-1 pt-3 text-[15px]">{figure.caption}</figcaption>
    </figure>
  );
}

function Quote({ text, by }: { text: string; by: string }) {
  return (
    <blockquote className="reveal border-l-4 border-teal pl-5">
      <p className="font-serif text-[clamp(20px,2.4vw,24px)] leading-[1.3]">“{text}”</p>
      <footer className="mt-2 text-[15px] font-bold">{by}</footer>
    </blockquote>
  );
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const tracker = [
    { id: "tldr", label: "TL;DR" },
    ...project.sections.map((s) => ({ id: slugify(s.heading), label: s.heading })),
  ];

  return (
    <>
      <div
        aria-hidden="true"
        className="read-progress fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-teal"
      />
      <SiteNav />
      <CaseTracker items={tracker} />

      <main id="top" className={`overflow-x-clip bg-[linear-gradient(to_bottom,var(--color-fade),var(--color-page)_520px)] ${project.heroImage ? "" : "pt-28"}`}>
        {/* Hero image: pinned to the top of the page; the content below scrolls up and over it. Full bleed to the right, fading out on the left so the side tracker stays readable. */}
        {project.heroImage && (
          <div className="sticky top-0 z-0 h-[clamp(360px,62svh,640px)] md:h-[clamp(480px,min(78svh,calc(58.5vw)),820px)]">
            <div className="absolute inset-y-0 right-0 w-full md:w-[90%]">
              <Image
                src={project.heroImage.src}
                alt={project.heroImage.alt}
                fill
                quality={90}
                sizes="(min-width: 768px) 90vw, 100vw"
                preload
                className="object-cover object-[35%_50%] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_22%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_22%)]"
              />
            </div>
          </div>
        )}
        <div className={project.heroImage ? "relative z-10 bg-page pt-4" : ""}>
        {project.heroImage && (
          <div
            aria-hidden="true"
            className="stripe-edge pointer-events-none absolute inset-x-0 top-0"
            style={{ "--stripe-rgb": project.heroImage.stripeRgb } as React.CSSProperties}
          />
        )}
        <div className="mx-auto max-w-[800px] px-6">
          {!project.heroImage && <Media label={project.heroMedia} hero />}

          {/* Title */}
          <header className="pb-14 pt-10">
            <p className={`${project.logo ? "mb-6" : "mb-4"} flex items-center gap-3 text-[17px] font-bold`}>
              {project.logo ? (
                <Image
                  src={project.logo.src}
                  alt={project.name}
                  width={project.logo.width}
                  height={project.logo.height}
                  quality={90}
                  sizes="200px"
                  className="h-20 w-auto sm:h-24"
                />
              ) : (
                <>
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-coral" />
                  {project.name}
                </>
              )}
              {project.logo && <span aria-hidden="true" className="h-10 w-px bg-deep/25 sm:h-12" />}
              <span className="font-normal text-muted">{project.logo ? "" : "· "}{project.kicker.split("·")[1]?.trim() ?? project.kicker}</span>
            </p>
            <h1 className="mb-6 font-serif text-[clamp(36px,6vw,60px)] leading-[1.05] tracking-[-0.02em]">
              {project.headline}
            </h1>
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li key={t} className="rounded-full border border-line bg-white/60 px-3 py-1 text-xs font-bold">
                  {t}
                </li>
              ))}
            </ul>
          </header>

          {/* TL;DR */}
          <section id="tldr" aria-labelledby="tldr-h" className="scroll-mt-28 pb-14">
            <p id="tldr-h" className="reveal mb-4 text-[15px] font-bold text-teal-deep">TL;DR</p>
            <dl className="reveal mb-8 space-y-4">
              {project.tldr.map((t) => (
                <div key={t.label} className="grid gap-1 sm:grid-cols-[110px_1fr] sm:gap-6">
                  <dt className="text-[15px] font-bold">{t.label}</dt>
                  <dd>{t.text}</dd>
                </div>
              ))}
            </dl>

            <dl className={`${glass} reveal mb-6 grid gap-6 p-6 sm:grid-cols-2 sm:p-8`}>
              {project.meta.map((m) => (
                <div key={m.label}>
                  <dt className="mb-1 text-[15px] font-bold text-muted">{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>

            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {project.stats.map((s) => (
                <div key={s.label} className={`${glass} reveal p-4`}>
                  <dd className="font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.1]">{s.value}</dd>
                  <dt className="mt-1 text-[15px]">{s.label}</dt>
                </div>
              ))}
            </dl>

            {project.note && (
              <p className={`${glass} reveal mt-6 px-5 py-3 text-[15px] font-bold`}>{project.note}</p>
            )}
          </section>

          {/* Sections */}
          {project.sections.map((s) => {
            const id = slugify(s.heading);
            return (
              <section key={id} id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-line py-16">
                <p className="reveal mb-3 text-[15px] font-bold text-teal-deep">{s.heading}</p>
                <h2 id={`${id}-h`} className="reveal mb-8 font-serif text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em]">
                  {s.title}
                </h2>

                <div className="space-y-8">
                  {s.paras?.map((p) => <p key={p} className="reveal max-w-[62ch]">{p}</p>)}

                  {(s.intro || s.bullets) && (
                    <div className="reveal max-w-[62ch]">
                      {s.intro && <p className="mb-3 font-bold">{s.intro}</p>}
                      {s.bullets && (
                        <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                          {s.bullets.map((b) => <li key={b}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  )}

                  {s.cards && s.numbered && (
                    <ol className="space-y-10">
                      {s.cards.map((c, n) => (
                        <li key={c.title} className="reveal flex gap-5">
                          <span aria-hidden="true" className="w-12 shrink-0 font-serif text-[28px] leading-none text-teal-deep">
                            {String(n + 1).padStart(2, "0")}
                          </span>
                          <div className="max-w-[56ch]">
                            <h3 className="mb-1 text-[18px] font-bold leading-snug">{c.title}</h3>
                            <p>{c.text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {s.cards && !s.numbered && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {s.cards.map((c) => (
                        <div key={c.title} className={`${glass} reveal p-5`}>
                          <h3 className="mb-2 text-[19px] font-bold leading-snug">{c.title}</h3>
                          <p className="text-[17px]">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.figure && <Fig figure={s.figure} />}

                  {s.findings?.map((f) => (
                    <article key={f.title} className="space-y-5">
                      <div className="reveal">
                        <p
                          className={`mb-3 inline-block rounded-full border px-3 py-0.5 text-xs font-bold ${
                            f.severity === "Low" ? "border-line bg-white/60" : "border-deep bg-coral"
                          }`}
                        >
                          {f.severity} severity
                        </p>
                        <h3 className="font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.2]">{f.title}</h3>
                      </div>
                      {f.media && <Media label={f.media} />}
                      <ul className="reveal list-disc space-y-2 pl-5 marker:text-teal">
                        {f.points.map((pt) => <li key={pt}>{pt}</li>)}
                      </ul>
                      {f.quotes?.map((q) => <Quote key={q.text} {...q} />)}
                      {f.figure && <Fig figure={f.figure} />}
                      <div className={`${glass} reveal p-5`}>
                        <p className="mb-2 text-[15px] font-bold">Recommendations</p>
                        <ul className="list-disc space-y-2 pl-5 text-[17px] marker:text-coral">
                          {f.recs.map((r) => <li key={r}>{r}</li>)}
                        </ul>
                      </div>
                    </article>
                  ))}

                  {s.media?.map((m) => <Media key={m} label={m} />)}

                  {s.quote && <Quote {...s.quote} />}
                </div>
              </section>
            );
          })}

          {/* Next project */}
          <section aria-labelledby="next-h" className="border-t border-line py-16">
            <p id="next-h" className="reveal mb-3 text-[15px] font-bold text-teal-deep">Next project</p>
            <h2 className="reveal mb-8 font-serif text-[clamp(32px,5vw,48px)] leading-[1.1]">{next.name}</h2>
            <Link href={`/work/${next.slug}`} className={`${btnPrimary} reveal`}>
              Read the case study
            </Link>
          </section>
        </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
