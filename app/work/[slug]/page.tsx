import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollToTop } from "../../components/ScrollToTop";
import { CaseTracker } from "../../components/CaseTracker";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteNav } from "../../components/SiteNav";
import { CardDock } from "../../components/CardDock";
import { PhoneSequence } from "../../components/PhoneSequence";
import { CardVideo } from "../../components/CardVideo";
import { SketchViewer } from "../../components/SketchViewer";
import { YouTubeEmbed } from "../../components/YouTubeEmbed";
import { DocViewer } from "../../components/DocViewer";
import { ZoomImage } from "../../components/ZoomImage";
import { ChartCard, ChartGrid } from "../../components/Chart";
import { HeaderVideo } from "../../components/HeaderVideo";
import { PrinterHero } from "../../components/PrinterHero";
import { btnPrimary, glass } from "../../components/ui";
import { getProject, projects, type Feature, type Figure, type FindingGroup, type FindingLite, type Gallery, type Img, type Profile, type Section } from "../../data/projects";

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
function Media({ label, hero = false, short = false }: { label: string; hero?: boolean; short?: boolean }) {
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
          : `${short ? "aspect-[21/8]" : "aspect-[16/9]"} bg-white/50`
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

/** A smaller placeholder for a finding's side image: portrait for screenshots, square otherwise. */
function SidePlaceholder({ label }: { label: string }) {
  const i = label.indexOf(":");
  const kind = i > 0 ? label.slice(0, i) : "Image";
  const text = i > 0 ? label.slice(i + 1).trim() : label;
  return (
    <div
      role="img"
      aria-label={`Placeholder. ${label}`}
      className={`reveal grid w-full place-items-center rounded-card border-[1.5px] border-dashed border-line bg-white/50 p-4 text-center ${
        kind === "Screenshot" ? "aspect-[9/16]" : "aspect-square"
      }`}
    >
      <div>
        <p className="mb-2 inline-block rounded-full border border-line bg-white/70 px-3 py-0.5 text-xs font-bold">{kind} placeholder</p>
        <p className="text-[15px] leading-snug">{text}</p>
      </div>
    </div>
  );
}

/** The recommendation card used under every finding, so they all look the same. */
function RecCard({ recs }: { recs: string[] }) {
  return (
    <div className="reveal rounded-card border border-line bg-sand/70 p-5 shadow-card">
      <p className="mb-2 text-[15px] font-bold uppercase tracking-[0.12em] text-muted">
        {recs.length > 1 ? "Recommendations" : "Recommendation"}
      </p>
      <ul className="list-disc space-y-1.5 pl-5 text-[17px] leading-snug marker:text-coral">
        {recs.map((r) => <li key={r}>{r}</li>)}
      </ul>
    </div>
  );
}

function Fig({ figure }: { figure: Figure }) {
  if (figure.viewer) {
    return (
      <figure className="reveal">
        <DocViewer
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          pages={figure.viewer.pages}
          pageWidth={figure.viewer.pageWidth}
          pageHeight={figure.viewer.pageHeight}
          hotspots={figure.viewer.hotspots}
        />
      </figure>
    );
  }
  if (figure.bare) {
    return (
      <figure className="reveal" style={figure.maxWidth ? { maxWidth: figure.maxWidth } : undefined}>
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          quality={90}
          sizes={figure.maxWidth ? `${figure.maxWidth * 2}px` : "(min-width: 800px) 720px, 100vw"}
          className="h-auto w-full"
        />
      </figure>
    );
  }
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

/** Grow a little and cast a drop shadow on hover. Motion is skipped for reduced-motion users. */
const HOVER =
  "relative transition-[scale,box-shadow] duration-200 ease-out hover:z-10 hover:shadow-[0_14px_30px_rgba(28,41,39,0.28)] motion-safe:hover:scale-[1.06]";

/** A subtle lift for clickable images: framed ones rise and gain a soft shadow. Skipped for reduced motion. */
const RAISE =
  "relative transition-[translate,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(28,41,39,0.18)]";
/** Floating images have no frame to put a shadow on, so they only lift. */
const LIFT = "transition-[translate] duration-200 ease-out motion-safe:hover:-translate-y-1";

function Pic({ img, cols = 1, hover = false }: { img: Img; cols?: number; hover?: boolean }) {
  const sizes = `(min-width: 800px) ${Math.round(752 / cols)}px, ${cols === 1 ? "100vw" : "50vw"}`;
  const bare = img.bare;
  return (
    // Floating images use mix-blend-multiply to drop their white backdrop onto the page, which only works
    // outside an animated (.reveal) stacking context, so they skip the reveal.
    <figure className={`${bare ? "" : "reveal"} break-inside-avoid`}>
      {(img.label || img.heading) && (
        <div className="reveal mb-4">
          {img.label && <p className="mb-1 text-[15px] font-bold text-teal-deep">{img.label}</p>}
          {img.heading && (
            <h3 className="font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.2]">{img.heading}</h3>
          )}
        </div>
      )}
      {bare && img.title && (
        <p className="mb-2 text-center font-serif text-[clamp(20px,2.2vw,24px)] leading-[1.2]">{img.title}</p>
      )}
      <ZoomImage src={img.src} alt={img.alt} width={img.width} height={img.height}>
        <div
          className={`${bare ? "" : `overflow-hidden rounded-control border border-line bg-white ${RAISE}`} ${hover ? HOVER : ""}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes={sizes}
            quality={85}
            style={img.square ? { objectPosition: img.square } : undefined}
            className={`${img.square ? "aspect-square w-full object-cover" : "h-auto w-full"} ${bare ? `mix-blend-multiply ${LIFT}` : ""}`}
          />
        </div>
      </ZoomImage>
      {((!bare && img.title) || img.caption) && (
        <figcaption className="px-1 pt-2 text-[15px]">
          {!bare && img.title && <span className="block font-bold">{img.title}</span>}
          {img.caption && <span className="block text-muted">{img.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}

const gridCols: Record<Gallery["cols"], string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-5",
};

/** A bordered show/hide control. Native <details>, so it works without JavaScript. */
function Collapse({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group reveal rounded-card border border-line bg-white/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-card p-5 text-[18px] font-bold [&::-webkit-details-marker]:hidden">
        <span>{label}</span>
        <span aria-hidden="true" className="text-[28px] leading-none text-teal-deep group-open:hidden">+</span>
        <span aria-hidden="true" className="hidden text-[28px] leading-none text-teal-deep group-open:inline">−</span>
      </summary>
      <div className="border-t border-line p-5 sm:p-8">{children}</div>
    </details>
  );
}

const TILT = [-2.5, 1.5, -1, 2.5, -1.5];

function GalleryView({ gallery }: { gallery: Gallery }) {
  let body: React.ReactNode;
  if (gallery.layout === "strip") {
    // A compact row of pinned-up notes: slightly tilted, scrolls sideways on small screens.
    body = (
      <ul className="flex snap-x gap-4 overflow-x-auto px-2 py-4">
        {gallery.items.map((img, n) => (
          <li
            key={img.src}
            style={{ rotate: `${TILT[n % TILT.length]}deg` }}
            className="reveal w-40 shrink-0 snap-start sm:w-auto sm:min-w-0 sm:flex-1"
          >
            <ZoomImage src={img.src} alt={img.alt} width={img.width} height={img.height}>
              <div className={`overflow-hidden rounded-control border border-line bg-white shadow-sm ${gallery.hover ? HOVER : ""}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 800px) 150px, 160px"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </ZoomImage>
          </li>
        ))}
      </ul>
    );
  } else if (gallery.layout === "dock") {
    body = <CardDock items={gallery.items} className={`grid items-start gap-4 ${gridCols[gallery.cols]}`} />;
  } else if (gallery.layout === "masonry") {
    body = (
      <div className="columns-2 gap-3 space-y-3 sm:columns-3 md:columns-4">
        {gallery.items.map((img) => <Pic key={img.src} img={img} cols={4} hover={gallery.hover} />)}
      </div>
    );
  } else {
    body = (
      <div className={`grid items-start gap-4 ${gridCols[gallery.cols]}`}>
        {gallery.items.map((img) => <Pic key={img.src} img={img} cols={gallery.cols} hover={gallery.hover} />)}
      </div>
    );
  }
  if (!gallery.more) return body;
  return (
    <div className="space-y-6">
      {body}
      <Collapse label={gallery.more.label}>
        <GalleryView gallery={gallery.more.gallery} />
      </Collapse>
    </div>
  );
}

function ProfileView({ profile }: { profile: Profile }) {
  return (
    <article className={`${glass} reveal grid items-start gap-4 p-4 sm:grid-cols-[96px_1fr] sm:gap-5 sm:p-5`}>
      <Image
        src={profile.image.src}
        alt={profile.image.alt}
        width={profile.image.width}
        height={profile.image.height}
        sizes="96px"
        className="aspect-square w-20 rounded-card object-cover sm:w-24"
      />
      <div>
        <h3 className="mb-2 font-serif text-[clamp(20px,2.2vw,24px)] leading-[1.2]">{profile.title}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {profile.groups.map((g) => (
            <div key={g.label}>
              <p className="mb-1 text-[15px] font-bold text-teal-deep">{g.label}</p>
              <ul className="list-disc space-y-1 pl-4 text-[15px] leading-snug marker:text-teal">
                {g.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function FeatureView({ feature, flip }: { feature: Feature; flip: boolean }) {
  const img = feature.image;
  const list = (
    <div>
      {feature.listLabel && <p className="font-bold">{feature.listLabel}</p>}
      {feature.listIntro && <p className="mb-2">{feature.listIntro}</p>}
      {feature.chips ? (
        <ul className="flex flex-wrap gap-2">
          {feature.list.map((i) => (
            <li key={i} className="rounded-full border border-line bg-white/60 px-3 py-1 text-[16px]">{i}</li>
          ))}
        </ul>
      ) : (
        <ul className="list-disc space-y-1 pl-5 marker:text-teal">
          {feature.list.map((i) => <li key={i}>{i}</li>)}
        </ul>
      )}
    </div>
  );
  // Tall images need a narrower column to match the text height; squarer ones get an even split.
  const tall = img.width / img.height < 0.6;
  const cols = feature.imageWide
    ? flip
      ? "sm:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]"
      : "sm:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]"
    : tall
    ? flip
      ? "sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      : "sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    : "sm:grid-cols-2";
  return (
    <article>
      <h3 className="reveal mb-4 font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.2]">{feature.heading}</h3>
      {/* The image column stretches to the height of the text, and the (trimmed) image scales to fill it. */}
      <div className={`grid gap-6 ${cols}`}>
        <div className={`reveal space-y-4 ${flip ? "sm:order-2" : ""}`}>
          {feature.paras.map((p) => <p key={p}>{p}</p>)}
          {list}
        </div>
        {/* On sm+ the image is positioned inside a box that stretches to the text's height, so it can't make the row taller. */}
        <div className={`relative ${flip ? "sm:order-1" : ""}`}>
          <ZoomImage src={img.src} alt={img.alt} width={img.width} height={img.height} fill>
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              sizes="(min-width: 800px) 340px, 100vw"
              quality={85}
              className={`h-auto w-full object-contain mix-blend-multiply sm:h-full ${LIFT}`}
            />
          </ZoomImage>
        </div>
      </div>
    </article>
  );
}

function StatCards({ stats, pills }: { stats: NonNullable<Section["stats"]>; pills?: string[] }) {
  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((st) => (
          <div key={st.label} className={`${glass} reveal p-4`}>
            <dd className="font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.1]">{st.value}</dd>
            <dt className="mt-1 text-[15px]">{st.label}</dt>
          </div>
        ))}
      </dl>
      {pills && (
        <ul className="reveal flex flex-wrap gap-2">
          {pills.map((t) => (
            <li key={t} className="rounded-full border border-line bg-white/60 px-3 py-1 text-xs font-bold">{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ImageCards({ cards }: { cards: NonNullable<Section["imageCards"]> }) {
  return (
    <div className="space-y-5">
      {cards.map((c) => (
        <div key={c.text} className="reveal mx-auto max-w-[600px] space-y-4">
          <h3 className="font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.2]">{c.text}</h3>
          <ZoomImage src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height}>
            <Image
              src={c.image.src}
              alt={c.image.alt}
              width={c.image.width}
              height={c.image.height}
              quality={90}
              sizes="(min-width: 640px) 600px, 100vw"
              className={`h-auto w-full mix-blend-multiply ${LIFT}`}
            />
          </ZoomImage>
        </div>
      ))}
    </div>
  );
}

function ResearchPlan({ plan }: { plan: NonNullable<Section["plan"]> }) {
  return (
    <div className="space-y-3">
      {plan.duration && <p className="reveal text-[15px] font-bold text-teal-deep">{plan.duration}</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {plan.methods.map((mt) => (
          <li key={mt.label} className={`${glass} reveal flex items-center gap-4 px-5 py-4`}>
            {mt.value && (
              <span className="font-serif text-[clamp(36px,4.4vw,48px)] leading-none text-teal-deep">{mt.value}</span>
            )}
            <span className="min-w-0">
              <span className="block font-serif text-[clamp(18px,2vw,21px)] leading-[1.2]">{mt.label}</span>
              {mt.detail && <span className="mt-1 block text-[16px] leading-snug">{mt.detail}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Stage = NonNullable<Section["stages"]>[number];

function StageHead({ n, total, name }: { n: number; total: number; name: string }) {
  return (
    <div className="relative z-10 flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-deep font-serif text-[18px] leading-none text-sand"
      >
        {n + 1}
      </span>
      <div className="bg-page pr-3">
        <p className="reveal text-[15px] font-bold leading-tight text-teal-deep">
          Stage {n + 1} of {total}
        </p>
        <h3 className="reveal font-serif text-[clamp(20px,2.4vw,26px)] leading-[1.15]">{name}</h3>
      </div>
    </div>
  );
}

/** Photos in a single row, all the same height (each item is as wide as its aspect ratio). */
function PhotoRow({ images }: { images: Img[] }) {
  return (
    <ul className="grid grid-cols-3 gap-3 sm:flex">
      {images.map((img) => (
        <li
          key={img.src}
          style={{ "--ar": img.width / img.height } as React.CSSProperties}
          className="min-w-0 sm:[flex:var(--ar)_1_0%]"
        >
          <Pic img={img} cols={6} />
        </li>
      ))}
    </ul>
  );
}

function Stages({ stages }: { stages: NonNullable<Section["stages"]> }) {
  // Consecutive video stages are shown side by side, so the progression reads left to right.
  type Block = { single: { st: Stage; n: number } } | { phones: { st: Stage; n: number }[] };
  const blocks: Block[] = [];
  stages.forEach((st, n) => {
    const last = blocks[blocks.length - 1];
    if (st.video && last && "phones" in last) last.phones.push({ st, n });
    else if (st.video) blocks.push({ phones: [{ st, n }] });
    else blocks.push({ single: { st, n } });
  });

  return (
    <div className="space-y-16">
      {blocks.map((b) =>
        "single" in b ? (
          <div key={b.single.st.name} className="space-y-5">
            <StageHead n={b.single.n} total={stages.length} name={b.single.st.name} />
            {b.single.st.image && <Pic img={b.single.st.image} />}
            {b.single.st.images && <PhotoRow images={b.single.st.images} />}
          </div>
        ) : (
          <div key={b.phones[0].st.name} className="relative">
            {/* A line running through the stage badges, joining them into one progression. */}
            <div aria-hidden="true" className="absolute left-4 right-4 top-[18px] hidden h-px bg-line sm:block" />
            <PhoneSequence
              items={b.phones.map(({ st, n }) => ({
                head: <StageHead n={n} total={stages.length} name={st.name} />,
                video: st.video!,
              }))}
            />
          </div>
        ),
      )}
    </div>
  );
}

function SectionBody({ s, wide }: { s: Section; wide?: boolean }) {
  const m = wide ? "" : "max-w-[62ch]";
  return (
    <div className="space-y-8">
      {s.galleryTop && <GalleryView gallery={s.galleryTop} />}

      {!s.statement && s.paras?.map((p) => <p key={p} className={`reveal ${m}`}>{p}</p>)}

      {s.galleryMid && <GalleryView gallery={s.galleryMid} />}
      {s.sketchViewer && (
        <Collapse label={s.sketchViewer.title}>
          <SketchViewer bare title={s.sketchViewer.title} items={s.sketchViewer.images} />
        </Collapse>
      )}

      {s.splitGallery && s.gallery ? (
        <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="reveal order-2">
            {s.intro && (
              <h3 className="mb-4 font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.2]">{s.intro}</h3>
            )}
            {s.bullets && (
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                {s.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </div>
          <div className="order-1">
            <GalleryView gallery={s.gallery} />
          </div>
        </div>
      ) : (
        (s.intro || s.bullets) && (
          <div className={`reveal ${m}`}>
            {s.intro && <p className="mb-3 font-bold">{s.intro}</p>}
            {s.bullets && s.bulletCards && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li key={b} className={`${glass} flex items-center gap-3 px-5 py-4 text-[18px] leading-snug`}>
                    <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-teal" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {s.bullets && !s.bulletCards && (
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                {s.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
          </div>
        )
      )}

      {s.stats && <StatCards stats={s.stats} pills={s.pills} />}

      {s.plan && <ResearchPlan plan={s.plan} />}

      {s.stages && <Stages stages={s.stages} />}

      {s.imageCards && <ImageCards cards={s.imageCards} />}

      {s.cards && s.cardCols === 3 && s.numbered && (
        <ol className="grid gap-4 sm:grid-cols-3">
          {s.cards.map((c, n) => (
            <li key={c.title ?? c.text} className={`${glass} reveal flex flex-col gap-3 p-5`}>
              <span aria-hidden="true" className="font-serif text-[28px] leading-none text-teal-deep">
                {String(n + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-[clamp(20px,2.2vw,24px)] leading-[1.15]">{c.title}</h3>
              <p className="text-[16px] leading-snug">{c.text}</p>
            </li>
          ))}
        </ol>
      )}

      {s.cards && s.cardCols === 3 && !s.numbered && (
        <div className="grid gap-4 sm:grid-cols-3">
          {s.cards.map((c) => (
            <div key={c.title ?? c.text} className={`${glass} reveal flex flex-col gap-3 p-5`}>
              {c.icon && (
                <Image
                  src={c.icon.src}
                  alt={c.icon.alt}
                  width={c.icon.width}
                  height={c.icon.height}
                  quality={90}
                  sizes="112px"
                  className="mx-auto size-24 sm:size-28"
                />
              )}
              <h3 className="font-serif text-[clamp(20px,2.2vw,24px)] leading-[1.15]">{c.title}</h3>
              <p className="text-[16px] leading-snug">{c.text}</p>
              {c.solution && (
                <p className="mt-auto border-t border-line pt-3 text-[16px] leading-snug">
                  <span className="mb-1 block font-bold text-teal-deep">Solution:</span>
                  {c.solution}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {s.cards && s.numbered && !s.cardCols && (
        <ol className="space-y-10">
          {s.cards.map((c, n) => (
            <li key={c.title ?? c.text} className="reveal flex gap-5">
              <span aria-hidden="true" className="w-12 shrink-0 font-serif text-[28px] leading-none text-teal-deep">
                {String(n + 1).padStart(2, "0")}
              </span>
              <div className={`min-w-0 flex-1 ${c.aside ? "flex flex-col gap-6 md:flex-row md:items-start md:gap-10" : ""}`}>
              <div className={`${c.aside ? "min-w-0 flex-1" : ""} ${wide ? "" : "max-w-[56ch]"}`}>
                <h3 className="mb-1 font-serif text-[clamp(20px,2.4vw,24px)] leading-[1.2]">{c.title}</h3>
                {c.text && <p>{c.text}</p>}
                {c.list && (
                  <ul className="mt-1 space-y-1.5">
                    {c.list.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[18px] leading-snug">
                        <span aria-hidden="true" className="text-teal-deep">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {c.bubbles && (
                  <div
                    className="relative mt-5 pb-6"
                    aria-label="Questions we asked"
                  >
                    {c.bubbles.length === 1 ? (
                      <div className="relative mx-auto w-full max-w-[560px]">
                                          <Bubble tone={1} className="z-10 text-center">
                          {c.bubbles[0]}
                        </Bubble>
                      </div>
                    ) : (
                      c.bubbles.map((q, i) => (
                        <Bubble
                          key={q}
                          tone={i}
                          style={{ marginLeft: `${i * 11}%`, zIndex: i + 1 }}
                          className={`w-[78%] ${i > 0 ? "mt-9" : ""}`}
                        >
                          {q}
                        </Bubble>
                      ))
                    )}
                  </div>
                )}
                {c.solution && (
                  <p className="mt-2">
                    <span className="font-bold text-teal-deep">Solution: </span>
                    {c.solution}
                  </p>
                )}
              </div>
              {c.aside && (
                <div className="w-full shrink-0 md:w-[250px]">
                  <Fig figure={c.aside} />
                </div>
              )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {s.cards && !s.numbered && !s.cardCols && (
        <div className="grid gap-4 sm:grid-cols-2">
          {s.cards.map((c) => (
            <div key={c.title ?? c.text} className={`${glass} reveal p-5`}>
              {c.title && <h3 className="mb-2 text-[19px] font-bold leading-snug">{c.title}</h3>}
              <p className={c.title ? "text-[17px]" : "text-[20px] leading-snug"}>{c.text}</p>
              {c.solution && (
                <p className="mt-2 text-[17px]">
                  <span className="font-bold text-teal-deep">Solution: </span>
                  {c.solution}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {s.profiles?.map((pr) => <ProfileView key={pr.title} profile={pr} />)}

      {s.features && (
        <div className="space-y-14">
          {s.features.map((f, n) => <FeatureView key={f.heading} feature={f} flip={n % 2 === 1} />)}
        </div>
      )}

      {s.gallery && !s.splitGallery && <GalleryView gallery={s.gallery} />}

      {s.scale && (
        <ul aria-label="Severity levels" className={s.scale.every((sc) => sc.text) ? "mx-auto grid w-full max-w-[560px] gap-3 sm:grid-cols-3" : "reveal flex flex-wrap gap-3"}>
          {s.scale.map((sc) =>
            sc.text ? (
              <li
                key={sc.level}
                style={{ borderColor: SEVERITY_TONE[sc.level] }}
                className="reveal flex flex-col items-center gap-3 rounded-[16px] border-2 px-3.5 py-4 text-center"
              >
                <span style={{ background: SEVERITY_TONE[sc.level] }} className="rounded-full px-7 py-1 text-[16px] leading-tight">
                  {sc.level}
                </span>
                <span className="text-[14px] leading-snug">{sc.text}</span>
              </li>
            ) : (
              <li key={sc.level}>
                <SeverityBadge level={sc.level} />
              </li>
            ),
          )}
        </ul>
      )}

      {s.outline && <FindingsOutline groups={s.outline} />}

      {s.charts && <ChartGrid charts={s.charts} />}

      {s.figure && <Fig figure={s.figure} />}

      {s.findings?.map((f) => (
        <article key={f.title} className="space-y-5">
          <div className="reveal">
            <p className="mb-3">
              <SeverityBadge level={f.severity} label={`${f.severity} severity`} />
            </p>
            <h3 className="font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.2]">{f.title}</h3>
          </div>
          {f.media && <Media label={f.media} />}
          {f.bubble && <SpeechBubble {...f.bubble} />}
          <div className={f.figureFirst ? "grid items-start gap-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10" : "space-y-5"}>
          {f.figureFirst && f.figure && (
            <div className="lg:sticky lg:top-28">
              <Fig figure={f.figure} />
            </div>
          )}
          <div className="min-w-0 space-y-5">
          {f.points && (
            <ul className="reveal list-disc space-y-2 pl-5 marker:text-teal">
              {f.points.map((pt) => <li key={pt}>{pt}</li>)}
            </ul>
          )}
          {f.columns && (
            <div className={`grid gap-x-4 gap-y-6 ${f.figureFirst ? "" : "md:grid-cols-3"}`}>
              {f.columns.map((col) => (
                <div key={col.title} className={`reveal gap-3 ${f.figureFirst ? "grid sm:grid-cols-2 sm:items-stretch" : `flex flex-col ${col.recs ? "md:row-span-2 md:grid md:grid-rows-subgrid" : ""}`}`}>
                  <div className={`${glass} flex-1 p-5`}>
                    <h4 className="mb-3 text-[19px] font-bold leading-snug">{col.title}</h4>
                    <ul className="list-disc space-y-1.5 pl-5 text-[17px] leading-snug marker:text-teal">
                      {col.points.map((pt) =>
                        typeof pt === "string" ? (
                          <li key={pt}>{pt}</li>
                        ) : (
                          <li key={pt.text}>
                            {pt.text}
                            <ul className="mt-1.5 list-[circle] space-y-1 pl-5 marker:text-teal">
                              {pt.sub.map((sp) => <li key={sp}>{sp}</li>)}
                            </ul>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  {col.recs && <RecCard recs={col.recs} />}
                </div>
              ))}
            </div>
          )}
          {f.quotes?.map((q) => <Quote key={q.text} {...q} />)}
          {!f.figureFirst && f.figure && <Fig figure={f.figure} />}
          {f.chart && <ChartCard chart={f.chart} />}
          {f.recs && <RecCard recs={f.recs} />}
          </div>
          </div>
        </article>
      ))}

      {s.media?.map((md) => <Media key={md} label={md} />)}

      {s.quote && <Quote {...s.quote} />}

      {s.subsections?.map((sub) => <SubSection key={sub.heading} s={sub} wide={wide} />)}
    </div>
  );
}

/** Wraps a section's body in a show/hide control or a desaturated image backdrop, when it asks for one. */
function Framed({ s, wide }: { s: Section; wide?: boolean }) {
  const body = <SectionBody s={s} wide={wide} />;
  if (s.collapsible) {
    return <Collapse label={s.collapseLabel ?? "Show details"}>{body}</Collapse>;
  }
  if (s.backdrop) {
    return (
      <div className="relative overflow-hidden rounded-card border border-line">
        <Image
          src={s.backdrop.src}
          alt=""
          fill
          sizes="(min-width: 800px) 752px, 100vw"
          className="object-cover grayscale"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-page/80" />
        <div className="relative p-6 sm:p-10">{body}</div>
      </div>
    );
  }
  return body;
}

function SubSection({ s, wide }: { s: Section; wide?: boolean }) {
  const id = slugify(s.heading);
  return (
    <div id={id} className={s.noHeading ? "scroll-mt-28" : "scroll-mt-28 border-t border-line pt-12"}>
      {!s.noHeading && s.labelOnly && (
        <p className="reveal mb-6 text-[15px] font-bold text-teal-deep">{s.heading}</p>
      )}
      {!s.noHeading && !s.labelOnly && (
        <>
          {s.title && <p className="reveal mb-3 text-[15px] font-bold text-teal-deep">{s.heading}</p>}
          <h3 className="reveal mb-6 font-serif text-[clamp(24px,3vw,32px)] leading-[1.15] tracking-[-0.02em]">
            {s.title ?? s.heading}
          </h3>
        </>
      )}
      <Framed s={s} wide={wide} />
    </div>
  );
}

function SectionBlock({ s, wide }: { s: Section; wide?: boolean }) {
  const id = slugify(s.heading);
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="relative scroll-mt-28 border-t border-line py-16">
      {s.stickyLabel && (
        // Long findings sections keep their name in the left margin, reading upward, for the whole section.
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-10 hidden lg:block">
          <p className="sticky top-36 pt-16 text-[15px] font-bold tracking-wide text-teal-deep [writing-mode:vertical-rl] rotate-180">
            {s.heading}
          </p>
        </div>
      )}
      {s.statement ? (
        <>
          <p className="reveal mb-4 text-[15px] font-bold text-teal-deep">{s.heading}</p>
          <h2 id={`${id}-h`} className="reveal font-serif text-[clamp(28px,4vw,40px)] leading-[1.15] tracking-[-0.02em]">
            {s.paras?.[0]}
          </h2>
        </>
      ) : (
        <>
          {s.title && <p className="reveal mb-3 text-[15px] font-bold text-teal-deep">{s.heading}</p>}
          <h2 id={`${id}-h`} className="reveal mb-8 font-serif text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em]">
            {s.title ?? s.heading}
          </h2>
          <Framed s={s} wide={wide} />
        </>
      )}
    </section>
  );
}

// Speech bubbles use the periwinkles from the header illustration: flat colors, rounded shapes, soft shadows.
const BUBBLE_TONES = [
  { from: "#d4d8fa", to: "#bfc6f4" }, // light periwinkle (the header's pale buildings)
  { from: "#bdc4f3", to: "#abb7eb" }, // periwinkle (the header's clouds)
  { from: "#bcb9f1", to: "#aca3e6" }, // lilac (the rider's jacket)
];

function Bubble({
  tone,
  className = "",
  style,
  children,
}: {
  tone: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const t = BUBBLE_TONES[tone % BUBBLE_TONES.length];
  return (
    <div
      style={{ background: `linear-gradient(180deg, ${t.from}, ${t.to})`, ...style }}
      className={`relative rounded-[28px] px-7 py-5 text-[18px] leading-snug text-[#1d2f55] shadow-[0_10px_22px_-8px_rgba(35,60,101,0.45),0_2px_4px_rgba(35,60,101,0.12)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1.5 hover:shadow-[0_18px_30px_-10px_rgba(35,60,101,0.5),0_3px_6px_rgba(35,60,101,0.14)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
    >
      {children}
      {/* Comic-style tail, the same color as the bubble's lower edge so it reads as one shape. */}
      <svg aria-hidden="true" viewBox="0 0 26 17" className="absolute left-8 top-full -mt-px h-[17px] w-[26px] overflow-visible">
        <path d="M0 0H25C17 3 10 9 2 16C3.5 10 1 4 0 0Z" fill={t.to} />
      </svg>
    </div>
  );
}

const SEVERITY_TONE = { Low: "#c8eab0", Medium: "#fdf28f", High: "#f08a84" } as const;

/** A severity rating: a colored pill inside a ring of the same color. Used wherever a rating appears. */
function SeverityBadge({ level, label }: { level: keyof typeof SEVERITY_TONE; label?: string }) {
  const tone = SEVERITY_TONE[level];
  return (
    <span style={{ borderColor: tone }} className="inline-flex rounded-[14px] border-2 p-[3px] align-middle">
      <span style={{ background: tone }} className="rounded-full px-4 py-0.5 text-[16px] leading-tight">
        {label ?? level}
      </span>
    </span>
  );
}

function FindingRow({ f, flip }: { f: FindingLite; flip?: boolean }) {
  return (
    <li>
      <details open className="group rounded-card border border-transparent transition-colors open:border-line open:bg-white/70">
        <summary className="flex cursor-pointer list-none items-start gap-3 rounded-card px-3 py-2.5 hover:bg-sand/50 focus-visible:outline-2 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="pt-px text-[18px] text-teal-deep">→</span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[18px] font-bold leading-snug">{f.title}</span>
              {f.severity !== "Low" && <SeverityBadge level={f.severity} label={`${f.severity} severity`} />}
            </span>
            <span className="mt-0.5 block text-[16px] leading-snug text-muted">{f.takeaway}</span>
          </span>
          <span aria-hidden="true" className="pt-px text-[22px] leading-none text-teal-deep transition-transform duration-200 group-open:rotate-90 motion-reduce:transition-none">›</span>
        </summary>
        <div
          className={`grid gap-6 border-t border-line px-4 py-6 ${
            f.figure || f.media ? `md:gap-10 ${flip ? "md:grid-cols-[minmax(0,1fr)_200px]" : "md:grid-cols-[200px_minmax(0,1fr)]"}` : ""
          }`}
        >
          {(f.figure || f.media) && (
            <div className={`md:sticky md:top-28 md:self-start ${flip ? "md:order-2" : ""}`}>
              {f.figure ? <Fig figure={f.figure} /> : <SidePlaceholder label={f.media!} />}
            </div>
          )}
          <div className="min-w-0 space-y-7">
            <ul className="list-disc space-y-2.5 pl-5 marker:text-teal">
              {f.points.map((pt) => <li key={pt}>{pt}</li>)}
            </ul>
            {f.quote && <Quote {...f.quote} />}
            <RecCard recs={f.recs} />
          </div>
        </div>
      </details>
    </li>
  );
}

function FindingsOutline({ groups }: { groups: FindingGroup[] }) {
  let n = 0; // running finding count, so the side images alternate down the page
  return (
    <ol className="space-y-24">
      {groups.map((g, gi) => (
        <li key={g.title} className="flex items-start gap-5">
          {/* Each number sticks while its group scrolls past, and the next number pushes it out of the way. */}
          <span aria-hidden="true" className="sticky top-24 w-12 shrink-0 self-start font-serif text-[28px] leading-none text-teal-deep">
            {String(gi + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="mb-6 font-serif text-[clamp(20px,2.4vw,24px)] leading-[1.2]">{g.title}</h3>
            {g.media && (
              <div className="mb-10">
                <Media label={g.media} short />
              </div>
            )}
            <ul className="-mx-3 space-y-10">
              {g.findings.map((f) => <FindingRow key={f.title} f={f} flip={n++ % 2 === 1} />)}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

function SpeechBubble({ text, by }: { text: string; by: string }) {
  return (
    <div className="reveal relative pb-5">
      <Bubble tone={0} className="z-10 w-full max-w-[640px]">
        <p>“{text}”</p>
        <p className="mt-2 text-[15px] font-bold">{`– ${by}`}</p>
      </Bubble>
    </div>
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

  // The page header: a dedicated photo if the project has one, otherwise the same image as its homepage card.
  const scene = project.headerScene;
  const hero = scene ? { src: "", alt: scene.alt, stripeRgb: scene.stripeRgb } : (project.headerImage ?? project.heroImage);
  const photoHeader = Boolean(project.headerImage || scene);
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
      <ScrollToTop />
      <SiteNav currentSlug={slug} />
      <CaseTracker items={tracker} />

      <main id="top" className={`overflow-x-clip bg-[linear-gradient(to_bottom,var(--color-fade),var(--color-page)_520px)] ${hero ? "" : "pt-28"}`}>
        {/* Header: full bleed and pinned to the top of the page; the content below scrolls up and over it. */}
        {hero && (
          <div className="sticky top-0 z-0 h-[clamp(240px,44svh,440px)] md:h-[clamp(300px,min(55svh,calc(58.5vw)),820px)]">
            <div className="absolute inset-0">
              {scene ? (
                <PrinterHero label={scene.alt} />
              ) : (
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                quality={90}
                sizes="100vw"
                preload
                className={`object-cover ${photoHeader ? "object-[40%_50%]" : "object-[35%_50%]"}`}
                style={(project.headerVideo?.focus ?? project.headerImage?.focus) ? { objectPosition: project.headerVideo?.focus ?? project.headerImage?.focus } : undefined}
              />
              )}
              {project.headerVideo && <HeaderVideo {...project.headerVideo} />}
            </div>
          </div>
        )}
        <div id="case-content" className={hero ? "relative z-10 bg-page pt-4" : ""}>
        {hero && (
          <div
            aria-hidden="true"
            className="stripe-edge pointer-events-none absolute inset-x-0 top-0"
            style={{ "--stripe-rgb": hero.stripeRgb } as React.CSSProperties}
          />
        )}
        <div className="mx-auto max-w-[800px] px-6">
          {!hero && <Media label={project.heroMedia} hero />}

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
                  sizes="364px"
                  className="h-auto w-[152px] sm:w-[182px]"
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
            <h1
              className={`mb-6 font-serif leading-[1.05] tracking-[-0.02em] ${
                project.headline.length > 100
                  ? "text-[clamp(28px,4.2vw,44px)] leading-[1.15]"
                  : "text-[clamp(36px,6vw,60px)]"
              }`}
            >
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
            <h2 id="tldr-h" className="reveal mb-8 font-serif text-[clamp(28px,4vw,40px)] leading-[1.1] tracking-[-0.02em]">TL;DR</h2>
            <div className={`mb-8 grid items-center gap-8 md:gap-10 ${project.cardVideo ? "md:grid-cols-[minmax(0,380px)_1fr]" : ""}`}>
                <dl className="reveal space-y-4">
                  {project.tldr.map((t) => (
                    <div key={t.label} className="grid gap-1">
                      <dt className="text-[15px] font-bold">
                        {t.href ? (
                          <a href={t.href} className="underline decoration-line underline-offset-4 hover:text-dusk">
                            {t.label} <span aria-hidden="true">↓</span>
                          </a>
                        ) : (
                          t.label
                        )}
                      </dt>
                      <dd>{t.text}</dd>
                    </div>
                  ))}
                </dl>
              {project.cardVideo && (
                <div className="reveal flex flex-col items-center">
                  <CardVideo
                    {...project.cardVideo}
                    className="h-auto w-full max-w-[210px]"
                  />
                  {/* A soft shadow on the "ground" under the phone, so it reads as floating. */}
                  <span aria-hidden="true" className="mt-3 block h-4 w-32 rounded-full bg-deep/30 blur-lg" />
                </div>
              )}
            </div>

            <dl className={`${glass} reveal grid gap-x-10 gap-y-8 p-6 sm:grid-cols-2 sm:p-8 ${project.hideStats ? "" : "mb-6"}`}>
              {project.meta.map((m) => (
                <div key={m.label}>
                  <dt className="mb-2 text-[15px] font-bold uppercase tracking-[0.12em] text-muted">{m.label}</dt>
                  {(Array.isArray(m.value) ? m.value : [m.value]).map((v) => (
                    <dd key={v} className="leading-snug">{v}</dd>
                  ))}
                </div>
              ))}
            </dl>

            {!project.hideStats && (
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {project.stats.map((s) => (
                  <div key={s.label} className={`${glass} reveal p-4`}>
                    <dd className="font-serif text-[clamp(22px,2.6vw,28px)] leading-[1.1]">{s.value}</dd>
                    <dt className="mt-1 text-[15px]">{s.label}</dt>
                  </div>
                ))}
              </dl>
            )}

            {project.lead && (
              <div className="mt-10">
                <Pic img={project.lead} />
              </div>
            )}

            {project.note && (
              <p className={`${glass} reveal mt-6 px-5 py-3 text-[15px] font-bold`}>{project.note}</p>
            )}
          </section>

          {/* Showcase video */}
          {project.showcase && (
            <section aria-labelledby="showcase-h" className="reveal scroll-mt-28 pb-14">
              <h2 id="showcase-h" className="mb-6 font-serif text-[clamp(24px,3vw,32px)] leading-[1.15] tracking-[-0.02em]">
                {project.showcase.label}
              </h2>
              <YouTubeEmbed id={project.showcase.id} title={project.showcase.title} poster={project.showcase.poster} />
            </section>
          )}

          {/* Sections */}
          {project.sections.map((s) => <SectionBlock key={s.heading} s={s} wide={project.wideText} />)}

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
