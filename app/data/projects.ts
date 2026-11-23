/** A real image. `title` and `caption` render under it. */
export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  caption?: string;
  /** Crop to a square, with this CSS object-position (e.g. "50% 20%"). */
  square?: string;
  /** Small label and larger heading shown above the image. */
  label?: string;
  heading?: string;
  /** No frame, border or white backdrop: the image floats on the page. */
  bare?: boolean;
  /** Cap the displayed width, in px (for phone screenshots and other small images). */
  maxWidth?: number;
  /** Draw this diagram (SVG, see `app/components/diagrams.tsx`) instead of showing `src`. */
  diagram?: "reminders" | "nudge" | "sitemap";
};

export type Gallery = {
  /** "masonry" packs mixed-size images into columns; "grid" lays them out in rows; "dock" is a row that magnifies under the pointer, like the macOS Dock. */
  layout?: "grid" | "masonry" | "strip" | "dock";
  cols: 1 | 2 | 3 | 4 | 5;
  items: Img[];
  /** Images grow and gain a drop shadow on hover. */
  hover?: boolean;
  /** More images tucked behind a show/hide control under this gallery. */
  more?: { label: string; gallery: Gallery };
};

export type Profile = {
  title: string;
  image: Img;
  groups: { label: string; items: string[] }[];
};

export type Feature = {
  heading: string;
  paras: string[];
  /** Bold lead-in for the list, e.g. "Opt-in notifications". */
  listLabel?: string;
  listIntro?: string;
  list: string[];
  /** Give the image the wider column (about 55%), so a squarer image can get closer to the text height. */
  imageWide?: boolean;
  /** Show the list items as compact chips instead of bullets (keeps the text block short). */
  chips?: boolean;
  image: Img;
};

/**
 * Text in a section (paragraphs, bullets, card text, solutions, findings, quotes, TL;DR) can mark words
 * bold with double asterisks, e.g. "Only **30-50%** stick to their plan". On projects with
 * `highlightBold` set, those words also get a marker bar under the lower half of the text.
 */
export type Section = {
  heading: string;
  /** Optional. When missing, the heading is shown as the section title. */
  title?: string;
  numbered?: boolean;
  media?: string[];
  /** Real images shown before the paragraphs. */
  galleryTop?: Gallery;
  /** Real images shown right after the paragraphs (before the intro, lists and cards). */
  galleryMid?: Gallery;
  intro?: string;
  /** Show the intro line before the section's paragraphs instead of after them. */
  introFirst?: boolean;
  paras?: string[];
  bullets?: string[];
  /** Show the bullets as a row of cards instead of a list. */
  bulletCards?: boolean;
  /** Show the `cards` as one large question at a time, driven by page scroll. The section's `intro` is its label. */
  scrollCards?: boolean;
  cards?: { title?: string; text: string; /** A short list shown under the card (numbered cards): arrows lead from the group to its findings. */ list?: string[]; solution?: string; /** Short prompts shown as overlapping speech cards under the card text. */ bubbles?: string[]; /** A small illustration shown beside the card (research-finding cards). */ icon?: Img; /** A bare image shown to the right of a numbered card's text. */ aside?: Figure; /** A figure shown full width under the card's text. */ figure?: Figure }[];
  /** 3 lays the cards out side by side with serif titles. */
  cardCols?: 3;
  /** A research plan: a duration, the methods used (with counts), and how they were synthesized. */
  plan?: {
    duration: string;
    methods: { value?: string; label: string; detail?: string }[];
  };
  /** Short numbers shown as stat cards, with optional pills below. */
  stats?: { value: string; label: string }[];
  pills?: string[];
  /** Sequential steps, shown as a numbered timeline with the image under each step. */
  stages?: {
    name: string;
    image?: Img;
    /** Several separate images, shown in a grid. */
    images?: Img[];
    /** A silent looping video. */
    video?: { src: string; poster?: string; /** An alpha mask (PNG) that cuts the video out, so it floats on the page. */ mask?: string; width: number; height: number; alt: string };
  }[];
  /** A small window for flipping through individual images (prev/next, thumbnails, full screen). */
  sketchViewer?: { title: string; images: Img[] };
  /** A header-font line of text with one big floating image underneath. */
  imageCards?: { text: string; image: Img; /** Paragraphs shown under the image. */ description?: string[] }[];
  /** The heading becomes a small label and the first paragraph becomes the section title. */
  statement?: boolean;
  /** As a subsection: show the heading only as a small label, with no big heading under it. */
  labelOnly?: boolean;
  /** As a subsection: no heading and no divider line above it. */
  noHeading?: boolean;
  /** Content sits behind a show/hide control. */
  collapsible?: boolean;
  collapseLabel?: string;
  /** Desaturated image the section content is laid over. */
  backdrop?: Img;
  /** Nested sections, shown under this one with smaller headings. */
  subsections?: Section[];
  profiles?: Profile[];
  features?: Feature[];
  /** Lay the intro and bullets beside the gallery (list on the left, images on the right). */
  splitGallery?: boolean;
  /** Real images shown after the content. */
  gallery?: Gallery;
  quote?: { text: string; by: string };
  findings?: Finding[];
  /** Numbered groups of findings; each finding opens to show its evidence and recommendations. */
  outline?: FindingGroup[];
  figure?: Figure;
  charts?: ChartData[];
  /** A small row of severity levels, shown as colored badges only. */
  scale?: { level: "Low" | "Medium" | "High"; /** With text: a full card. Without: just the badge. */ text?: string }[];
  /** Keep the section's name pinned in the left margin while scrolling through it. */
  stickyLabel?: boolean;
};

export type FindingLite = {
  title: string;
  /** One line, always visible under the title. */
  takeaway: string;
  severity: "Low" | "Medium" | "High";
  /** What we saw: one to three short points. */
  points: string[];
  quote?: { text: string; by: string } | { text: string; by: string }[];
  figure?: Figure;
  /** Supporting evidence (a policy, a screen) shown full width under the points. */
  evidence?: Figure;
  /** A silent looping screen recording, shown in the side column like a figure (takes the place of `media`). */
  clip?: { /** Participant number shown under the clip, e.g. "P1". */ participant?: string; mp4: string; webm?: string; poster: string; width: number; height: number; alt: string; maxWidth?: number };
  /** Placeholder for an image to come, used when there's no figure: "Kind: what it should show". */
  media?: string;
  recs: string[];
};

export type FindingGroup = {
  title: string;
  /** A wide placeholder under the group title, to break up the text. */
  media?: string;
  findings: FindingLite[];
};

export type Figure = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  /** Transparent image shown straight on the page, without the card behind it. */
  bare?: boolean;
  /** Cap the displayed width, in px (for phone screenshots and other small images). */
  maxWidth?: number;
  /** Where the image came from, shown as a link after the caption. */
  source?: { label: string; href: string };
  /** Highlighter marks drawn over the image, in pixels of the original image (x, y, width, height). */
  marks?: { x: number; y: number; w: number; h: number }[];
  /** Shows `src` as a preview that opens a full-screen viewer you can pan and zoom, using this larger image. */
  pan?: { src: string; width: number; height: number };
  /** Makes each page in the image clickable, opening it large with Previous/Next. */
  viewer?: {
    pages: { src: string; alt: string }[];
    pageWidth: number;
    pageHeight: number;
    hotspots: { page: number; polygon: string }[];
  };
};

export type ChartItem = { label: string; value: number; /** Draw this one in the accent color. */ accent?: boolean; /** Short note shown above a column. */ callout?: string };

export type ChartData = {
  kind: "columns" | "rows" | "pie";
  title: string;
  note?: string;
  items: ChartItem[];
  /** Number of responses, used for percentages. */
  total?: number;
  /** Show value only, no percentage. */
  percent?: false;
  axisLabel?: string;
  legend?: { label: string; accent?: boolean }[];
  caption?: string;
  alt: string;
};

/** One column of a finding laid out as observation cards with a recommendation under each. */
export type FindingColumn = {
  title: string;
  points: (string | { text: string; sub: string[] })[];
  /** Leave out to show one shared recommendations card under all the columns. */
  recs?: string[];
};

export type Finding = {
  title: string;
  severity: "Low" | "Medium" | "High";
  points?: string[];
  /** Lay the finding out as side-by-side cards, each with its own recommendation, instead of a bullet list. */
  columns?: FindingColumn[];
  quotes?: { text: string; by: string }[];
  figure?: Figure;
  /** Show the figure above the finding's columns instead of below. */
  figureFirst?: boolean;
  /** A participant quote shown as a comic-style speech bubble above the finding's cards. */
  bubble?: { text: string; by: string };
  chart?: ChartData;
  media?: string;
  recs?: string[];
};

export type Project = {
  slug: string;
  heroMedia: string;
  /** When set, shown in place of the labeled hero placeholder. */
  /** A photo used as the case study page's header in place of `heroImage` (which still drives the homepage card). It runs full bleed across the top of the page. */
  headerImage?: { src: string; width: number; height: number; alt: string; /** CSS object-position, e.g. "80% 100%". */ focus?: string; /** Space-separated r g b of the image's bottom edge, used to tint the striped transition. */ stripeRgb: string };
  /** An animated 3D header (the printer-window scene) used in place of an image. `stripeRgb` tints the striped transition under it. */
  headerScene?: { kind: "printer"; alt: string; stripeRgb: string };
  /** A silent looping video laid over the page header (the header image stays underneath as the fallback and poster). */
  headerVideo?: { mp4: string; webm?: string; /** CSS object-position for the video and its poster, e.g. "50% 100%". */ focus?: string };
  /** A phone screen recording shown on the homepage card in place of `heroImage`. */
  cardVideo?: { src: string; poster?: string; mask?: string; width: number; height: number; alt: string; /** CSS background behind the phone. */ background: string };
  /** A YouTube video shown right after the TL;DR, as a poster that loads the player only when clicked. */
  showcase?: { id: string; title: string; label: string; /** The video's thumbnail, saved with the site. */ poster: string };
  heroImage?: { src: string; width: number; height: number; alt: string; /** CSS object-position used when the image is cropped to a homepage card, e.g. "70% 50%". */ focus?: string; /** Space-separated r g b of the image's bottom edge, used to tint the striped transition. */ stripeRgb: string };
  name: string;
  /** Optional logo shown in place of the dot and name on the case study page. */
  logo?: { src: string; width: number; height: number };
  kicker: string;
  headline: string;
  /** Put a marker bar (#DBDDFF) under the lower half of **bold** words on this project's page. */
  highlightBold?: boolean;
  /** Let paragraphs run the full width of the content area. */
  wideText?: boolean;
  /** Real image shown right under the title block. */
  lead?: Img;
  /** Where the project stands, shown as a colored pill before the tags on the home page cards. */
  status: { label: string; tone: "green" | "blue" | "purple" };
  tags: string[];
  role: string;
  cardSummary: string;
  stats: { value: string; label: string }[];
  /** A list value is shown one item per line. */
  meta: { label: string; value: string | string[] }[];
  /** Hide the stat cards under the meta card. */
  hideStats?: boolean;
  note?: string;
  tldr: { label: string; text: string; href?: string }[];
  sections: Section[];
  inProgress?: boolean;
};

const c2f = (file: string, width: number, height: number, alt: string, extra: Partial<Img> = {}): Img => ({
  src: `/images/commit2fit/wix/${file}`,
  alt,
  width,
  height,
  ...extra,
});

/** Full-resolution ideation images, exported from the group's Ideation & Sketching deck. */
const idea = (file: string, width: number, height: number, alt: string, extra: Partial<Img> = {}): Img => ({
  src: `/images/commit2fit/ideation/${file}`,
  alt,
  width,
  height,
  ...extra,
});

/** Full-resolution photos of the paper prototype. */
const paper = (file: string, width: number, height: number, alt: string, extra: Partial<Img> = {}): Img => ({
  src: `/images/commit2fit/paper-prototype/${file}`,
  alt,
  width,
  height,
  ...extra,
});

export const projects: Project[] = [
  {
    slug: "blue-origin",
    heroMedia: "Image: hero visual of the additive manufacturing floor or an abstract illustration (no product UI, per NDA)",
    heroImage: {
      src: "/images/blue-origin/hero-gemini.jpg",
      width: 1280,
      height: 832,
      alt: "Pixel-art illustration of an additive manufacturing floor: a technician at a large metal 3D printer, with more machines and a high steel-truss ceiling behind.",
      stripeRgb: "231 136 130",
    },
    headerScene: {
      kind: "printer",
      alt: "Animation of laser powder bed fusion seen through the printer's window: lasers fuse an impeller layer by layer in metal powder, then the powder is blown away from the finished silver part.",
      stripeRgb: "38 41 48",
    },
    name: "Blue Origin",
    logo: { src: "/images/logos/blue-origin.png", width: 896, height: 472 },
    kicker: "UX case study · Space manufacturing",
    headline: "Replacing the system that runs the additive manufacturing floor",
    status: { label: "Shipped", tone: "green" },
    tags: ["Systems design", "Manufacturing", "Web app"],
    role: "Technical Product Designer & PM · 10 months",
    cardSummary:
      "I led a three-person design team in building a new manufacturing management software. It shipped on deadline with zero production downtime and now serves nearly 1,000 users.",
    stats: [
      { value: "0", label: "production downtime" },
      { value: "10 months", label: "to replace the system" },
      { value: "150+ → ~1,000", label: "users, launch to today" },
      { value: "3", label: "person team" },
    ],
    meta: [
      { label: "Role", value: "UX designer, PM, and product owner (title: Process Engineer II)" },
      { label: "Team", value: "Me, a machine programmer, and a software engineer" },
      { label: "Timeline", value: "Sept 2024 notice, Feb 2025 handoff, July 2025 rollout" },
    ],
    note: "Due to NDA and ITAR restrictions, no images of the design can be shown.",
    tldr: [
      {
        label: "Situation",
        text: "Blue Origin was shutting down the system that ran its additive manufacturing floor, with a 10-month deadline.",
      },
      {
        label: "What I did",
        text: "Led design, product, and delivery planning, and designed, built, and tested the replacement.",
      },
      {
        label: "Result",
        text: "After I left, rollout finished on time with zero downtime, and the system now serves about 1,000 users. Blue's head of IT called one aspect of the design “the perfect solution for our use-case.”",
      },
    ],
    sections: [
      {
        heading: "Problem",
        title: "A floor that can't run without the system being shut off",
        media: ["Illustration: the retiring system and the 10-month countdown"],
        paras: [
          "Blue Origin's Enterprise Technology team was disabling the software behind its additive manufacturing floor due to ITAR compliance issues. This software facilitates the production of thousands of engine parts a week. A 10-month timeline was set to replace it.",
        ],
        intro: "Why it mattered",
        bullets: [
          "Every engine part required ITAR compliance and full traceability.",
          "The old system let machine operators create custom versions of approved processes, so engineers couldn't tell which variation was followed.",
          "That inconsistency caused 5 to 10 anomalies a week, each needing significant engineer time for root cause analysis, and made parts hard to trace.",
        ],
      },
      {
        heading: "Role and team",
        title: "A team of three, and I wore three hats",
        media: ["Diagram: team structure across AM customers and operations", "Diagram: timeline from Sept 2024 notice to July 2025 rollout"],
        paras: [
          "I volunteered to lead this project and stepped into a UX research & design role due to my familiarity with the existing software and physical workflow on the manufacturing floor.",
        ],
        bullets: [
          "Me: design, product, and delivery, about 50% of my time.",
          "Machine programmer: fully dedicated.",
          "Software engineer: about 20% capacity.",
          "Users: 150+ daily users across six groups: operators, process and M&P engineers, managers, design engineers, post-processing, and AM engineers.",
        ],
      },
      {
        heading: "Approach",
        title: "Start on the floor, with the people who use it",
        media: ["Image: shadowing machine operators on the floor (cleared photo)", "Diagram: process flow from research to side-by-side testing"],
        paras: [
          "Research: I shadowed machine operators and interviewed 33 stakeholders (15 engineers, 12 operators, 3 managers, and 3 maintenance staff), to solicit feedback on the old system. I then conducted a thorough audit of all elements of the old system to determine what was essential to translate to the new product.",
          "Key insight: Machine operators had built workarounds because the old process didn't fit their machines. It required all four laser inputs, even on dual-laser machines, so machine operators made custom views. I built that need into the system with dynamic checklists that adapt to machine type: a dual-laser machine shows two laser fields, a quad shows four. Machine operators get relevant inputs, and engineers get consistent data.",
          "Prioritizing and testing: I ranked every known weakness and fixed the high-priority ones for launch. Each section got a one-day side-by-side test in both systems before rollout.",
        ],
      },
      {
        heading: "Challenges",
        title: "No approved tools and almost no engineering time",
        numbered: true,
        cards: [
          {
            title: "Getting the right tools approved",
            text: "Standard enterprise tools couldn't support our relational data needs. I met with Enterprise Technology to show why, and Baserow was approved. Our front-end choice wasn't, so we built a custom React interface.",
          },
          {
            title: "Almost no engineering capacity",
            text: "Our software engineer had about 20% availability and we had no extra budget. The machine programmer and I learned to code, cut every nice-to-have, and designed modular features with feature flags so we could ship incrementally as constraints changed.",
          },
        ],
      },
      {
        heading: "Solution",
        title: "A checklist that adapts and an anomaly flow that stays honest",
        numbered: true,
        media: ["Animation: the checklist changing between a dual-laser and a quad-laser machine (illustrative, no real UI)", "Diagram: anomaly flow from submission through triage, root cause, and closure"],
        cards: [
          {
            title: "Operator checklist",
            text: "An 11-step checklist plus monitoring steps that adapts to machine type and locks inputs for consistent data. Built for gloved hands on the floor: large buttons, auto-save, and grouped tasks on one screen.",
          },
          {
            title: "Anomaly system",
            text: "Anyone can submit an anomaly through a simple form. A triage team works it through analysis, containment, root cause, and closure on one dashboard. Team SPOCs meet twice a week to assign root cause analyses. Submitters can't edit the underlying data, which keeps records trustworthy.",
          },
        ],
      },
      {
        heading: "Results and impact",
        title: "On time, with zero downtime",
        media: ["Chart: users growing from 150+ to about 1,000 across Engines, Lunar, and Alloy"],
        bullets: [
          "Zero production downtime. Rollout completed on time, following the plan I built.",
          "Delivered within the 10-month deadline.",
          "From 150+ users to around 1,000, across Engines, Lunar, and Alloy.",
          "Better data: standardized QA checklists, fewer manual entry errors, and improved anomaly traceability.",
          "My project became Blue's central hub for additive manufacturing data, and our React interface is still in use.",
        ],
      },
      {
        heading: "What's next",
        title: "The deferred features are now being built",
        paras: [
          "The React interface is still in use and continues to grow. The features we deferred to hit the MVP are now being built: automations, dashboards, automated report generation for engineers, and customizable flows.",
        ],
        quote: {
          text: "Nearly 1,000 people across the Engines, Lunar, and Alloy teams now collaborate on Baserow. Production data moved out of scattered spreadsheets into a single real-time hub.",
          by: "Baserow founder, on LinkedIn, one year post-launch",
        },
      },
      {
        heading: "Reflection",
        title: "The outcome was set months before launch",
        paras: [
          "I left the company before the system went live, as part of a company-wide reduction in February 2025. My manager's reflection on the project's success afterward stayed with me.",
          "I think about that a lot, because the outcome wasn't determined at launch. It was determined months earlier, in how requirements were defined, how the team was structured around a shifting set of constraints, and how consistently users were treated as collaborators rather than recipients of something being built for them.",
        ],
        quote: {
          text: "The reason it succeeded on rollout was because of the way you set up the project and the team for success.",
          by: "My manager",
        },
      },
    ],
  },
  {
    slug: "commit2fit",
    heroImage: {
      src: "/images/commit2fit/hero-gemini.jpg",
      width: 1280,
      height: 832,
      alt: "Pixel-art illustration of four people trail running single file along a hillside path in warm sunset light, above a river valley with a small village.",
      stripeRgb: "50 36 33",
      focus: "72% 50%",
    },
    cardVideo: {
      src: "/images/commit2fit/wix/mid-fidelity.mp4",
      poster: "/images/commit2fit/wix/mid-fidelity-poster.jpg",
      mask: "/images/commit2fit/wix/phone-mask-titanium.png",
      width: 732,
      height: 1358,
      alt: "Screen recording of the Commit2Fit mid-fidelity prototype, starting on the welcome screen and moving through the app.",
      background: "linear-gradient(160deg, #f3c9a0, #e08f6a 55%, #9b6a9e)",
    },
    headerImage: {
      src: "/images/commit2fit/wix/hero-slide.jpg",
      width: 2400,
      height: 1484,
      alt: "The Commit2Fit companion app open on a phone, beside a fan of exercise cards, on a wooden table with trailing plants.",
      stripeRgb: "118 62 9",
    },
    showcase: { id: "I58s0mZ8LKg", title: "Commit2Fit: Final Showcase", label: "Watch the final showcase", poster: "/images/commit2fit/wix/showcase-thumb.jpg" },
    heroMedia: "Image: hero shot of the Commit2Fit app screens with the exercise cards",
    name: "Commit2Fit",
    kicker: "UX case study · Health and wellness",
    headline:
      "Habit-stacking cards and a companion app that help adults stick to at-home physical therapy through community accountability.",
    status: { label: "Concept", tone: "blue" },
    tags: ["Mobile app", "Health and wellness"],
    role: "UX designer and researcher · 10 weeks",
    wideText: true,
    highlightBold: true,
    cardSummary:
      "Habit-stacking cards and a companion app that help adults stick to at-home physical therapy through community accountability.",
    stats: [
      { value: "50M+", label: "U.S. adults in PT each year" },
      { value: "30–50%", label: "stick to at-home exercises" },
      { value: "10 weeks", label: "Fall 2025" },
      { value: "4", label: "person team" },
    ],
    hideStats: true,
    meta: [
      { label: "Role", value: ["UX designer", "Researcher"] },
      { label: "Duration", value: "Fall 2025 — 10 Weeks" },
      { label: "Team", value: ["Raquel Eisele", "Molly Dicke", "Liz Stolnicki", "Hayley Stout"] },
      { label: "Project Type", value: "4-Person Group Project (UW HCDE)" },
    ],
    tldr: [
      {
        label: "Problem",
        href: "#problem",
        text: "Over 50 million adults in the U.S. go to physical therapy each year, and only about 30-50% adhere to their at-home exercise routines, leading to reduced recovery outcomes.",
      },
      {
        label: "Solution",
        href: "#design-solution",
        text: "Commit2Fit leverages the power of habit stacking and community accountability through a set of cards and companion app.",
      },
      {
        label: "Impact",
        text: "By improving consistency and motivation outside the clinic, Commit2Fit will enhance adherence to at-home physical therapy plans and ultimately support faster, more effective recovery.",
      },
    ],
    sections: [
      {
        heading: "Problem",
        title: "Up to 70% of adults don't do their at-home PT exercises",
        numbered: true,
        cardCols: 3,
        intro: "Our secondary research found:",
        cards: [
          {
            title: "Going to PT ≠ Improvement",
            text: "Adults experiencing physical limitations often turn to physical therapists to help them improve their physical capabilities. However, many patients have difficulties transitioning from their first appointment with a physical therapist to experiencing the improvement that they seek.",
          },
          {
            title: "Recovery can be Lonely",
            text: "It’s not often that someone with an injury in need of rehabilitation has connections with others going through the same experiences at the same time. This can lead to frustration and uncertainty in the way they are progressing.",
          },
          {
            title: "Changing Routine is Hard",
            text: "For many, the issue is finding the motivation to get started and to continue doing their exercises consistently. There are no PT-specific resources to assist in reducing the mental load of implementing the exercises into an existing routine.",
          },
        ],
      },
      {
        heading: "Design Question",
        statement: true,
        paras: [
          "How might we help adults effectively complete at home therapy routines to achieve their desired outcomes?",
        ],
      },
      {
        heading: "Research",
        title: "5 semi-structured interviews + a 29 respondent survey",
        cardCols: 3,
        paras: [
          "We conducted semi-structured interviews with 2 physical therapists and 3 former physical therapy patients.",
          "Three themes pointed us to a solution. By connecting the findings below, we aimed to lessen the resistance of working exercises into routines and make the path to reaching goals easier.",
        ],
        cards: [
          {
            title: "Lack of Motivation",
            icon: c2f("finding-motivation.png", 280, 280, "Illustration of two hilltops with winding paths up to flags."),
            text: "It is clear that lack of motivation is a common thread throughout those in Physical Therapy who have Home Exercise Plans assigned to them.",
            solution: "Implement habit stacking & community accountability to assist with motivation",
          },
          {
            title: "Working towards Goals",
            icon: c2f("finding-goals.png", 280, 280, "Illustration of a folded map with a dotted route."),
            text: "Setting and working towards goals and clear exercise expectations were mentioned many times as being a motivating factor.",
            solution: "Encourage the setting & tracking of milestones and progress towards personal goals",
          },
          {
            title: "How & Why Matters",
            icon: c2f("finding-how-why.png", 280, 280, "Illustration of a head in profile with a question mark."),
            text: "Knowing how to do their assigned exercises and why they are doing each specific movement is motivating because they know how it makes a difference.",
            solution: "Include directions for how to complete exercises presented via multiple modalities",
          },
        ],
      },
      {
        heading: "Ideation",
        galleryMid: {
          cols: 1,
          items: [
            c2f("ideation-board.webp", 2000, 790, "A board of brainstorm sketches grouped into ten themes: Calibrator, Strava, Pain, Bracelets, Cards, Digital tutor, Creating environment, Virtual Community, Physical Community, and Physical reminders."),
          ],
        },
        sketchViewer: {
          title: "Browse the individual sketches",
          images: [
            idea("sketch-01.jpg", 2048, 1404, "Sketch: a kit shape placed on a desk, with an open box of pieces nearby and a note to place the kit on or off a spot to signify use."),
            idea("sketch-02.jpg", 1573, 2028, "Sketch: Community Park and PT collab, with a pull-up frame for strength, a balance bowl, and a rack of resistance bands."),
            idea("sketch-03.jpg", 1153, 2048, "Sketch: a screen of leg lifts above a digital friend that encourages the patient and tracks their exercises."),
            idea("sketch-04.jpg", 2048, 1433, "Sketch: a TV with a person exercising and arrows to follow, noted as similar to Wii Fit or Kinect."),
            idea("sketch-05.jpg", 1783, 1588, "Four-panel storyboard sketch: a reminder to go outside, a prompt asking how you will make it there, and a message on a screen."),
            idea("sketch-06.jpg", 1427, 2048, "Sketch: a card deck to motivate, with Day 1 create your environment, Day 2 your trigger, Day 3 visualize your goal, and Day 4."),
            idea("sketch-07.jpg", 2048, 1374, "Sketch: a stack of flashcards; one side shows the exercise and the other shows what it will lead to."),
            idea("sketch-08.jpg", 2048, 1351, "Sketch: a bracelet with a marquee message from other patients or the PT, and haptic feedback notifications."),
            idea("sketch-09.jpg", 1354, 755, "Sketch: a toothbrush counter for habit stacking: rotate it each time you do the activity."),
            idea("sketch-10.jpg", 1577, 2048, "Sketch: a circle of lights that light up when each friend works out, with a button you press when you complete an exercise."),
            idea("sketch-11.jpg", 1520, 2048, "Sketch: a gingerbread-shaped body outline for tracking pain, with notes about PT programs."),
            idea("sketch-12.jpg", 1354, 863, "Sketch: Strava 4 PT, an app on a phone that logs what you did."),
            idea("sketch-13.jpg", 1356, 2048, "Sketch: a watch whose bands grow as you do your reps, leading to a Today's Summary with progress rings."),
            idea("sketch-14.jpg", 1874, 1539, "Two-frame storyboard sketch: a stick figure at a table, then the same figure lifting a framed picture."),
            idea("sketch-15.jpg", 1354, 738, "Sketch: the PT Ghoul, a figure that vibrates and makes noise when you pass by, and only turns off once you've completed your PT for the day."),
            idea("sketch-16.jpg", 2048, 1310, "Sketch: a touch point on a target zone that corresponds to information in an app."),
            idea("sketch-17.jpg", 1728, 1573, "Sketch: stick figures moving around and a pair interacting in the foreground."),
            idea("sketch-18.jpg", 2048, 1266, "Sketch: a mentorship program that matches patients with people who have gone through the same PT regimen."),
            idea("sketch-19.jpg", 2048, 1345, "Sketch: a weekly or monthly kit with equipment, exercises, a brochure, and cards."),
            idea("sketch-20.jpg", 1382, 525, "Sketch: Your PT Sanctuary, a tent for a person to do PT in."),
            idea("sketch-21.jpg", 2048, 1020, "Sketch: Your PT Sanctuary #2, a decorative display for your PT equipment to make it more seen."),
            idea("sketch-22.jpg", 1382, 1180, "Sketch: Stairs for PT, a staircase with added extra steps for PT exercises."),
            idea("sketch-23.jpg", 1218, 2048, "Sketch: a PT vibe gym without the PTs, with a mirror, PT tools, and a table to gather and chat."),
            idea("sketch-24.jpg", 1375, 791, "Sketch: TV assistance, a screen asking if you would like to add PT to your day."),
            idea("sketch-25.jpg", 1389, 2048, "Sketch: app screens for education, with today's exercises, a prompt to break your goal down, and habit stacking tips."),
            idea("sketch-26.jpg", 1314, 1424, "Sketch: Goal Progress, adding a ring for each step or time you do PT, shown as a stack of rings beside a thermometer that fills toward a goal."),
            idea("sketch-27.jpg", 1314, 786, "Sketch: Mindful Pain Meditation, a figure putting weight on the pain area to get body connection."),
            idea("sketch-28.jpg", 741, 2048, "Sketch: Strava, kinda, an app screen listing 3x leg press sets above a progress graph."),
            idea("sketch-29.jpg", 1208, 2048, "Sketch: a mirror with lights and rep counters around its edge, and a bluetooth wristband."),
            idea("sketch-30.jpg", 1271, 2048, "Sketch: the connection bracelet, which connects you with people who have your same injury, lets you make a friend, sync your bracelets, and see how your buddy is doing; it buzzes when your buddy completes their PT."),
          ],
        },
        paras: [
          "As a group we held a quick brainstorming session where we challenged ourselves to sketch solutions that could address our research findings and goals.",
          "From those initial sketches, we were able to identify 10 key themes across the 30 ideas.",
        ],
        intro: "After reviewing our goals for this solution, we decided to focus on",
        imageCards: [
          {
            text: "A card that could educate and connect to existing technology.",
            image: idea("direction-1.png", 2048, 1535, "Sketch of the card concept: a watch and education cards that connect through NFC, with a workout tracker and motivation cards."),
            description: [
              "This idea consists of a deck of flashcards, with one side pointing to a specific muscle group & exercise and the other side showing examples of the types of activities these exercises will empower you to do (could be digital). These cards could have categories of either exercise type or intensity, with physical therapists using them to build a plan (ex. This week complete #2 and #9). Like cue cards, users can hang them up in their home where they plan to do their physical therapy exercises. There would also be colors associated with each muscle group or type of exercise. The cards would be equipped with NFC technology and would transfer the exercise information, instructions, and data to your smartwatch. This makes it so that the smartwatch (or other wearable) could track your movements & provide haptic and visual feedback on whether the exercises were performed correctly, as well as track reps for each exercise. When your activity was complete, the application would display a summary of your session and progress towards your overall goal.",
            ],
          },
        ],
        subsections: [
          {
            heading: "Pivot - Alternate Use Cases Considered",
            collapsible: true,
            /** Shown without its own heading or divider, right under the card concept image. */
            noHeading: true,
            collapseLabel: "Alternate paths considered",
            paras: [
              "Although we pivoted away from these initial concepts, we gained many valuable insights from exploring these use cases. All features demonstrated ended up reappearing in our final product. We didn't choose to pursue these directions because they were not as effective at addressing our research findings and goals.",
            ],
            gallery: {
              cols: 2,
              items: [
                c2f("usecase-1.png", 2400, 2364, "Sketch from a driver’s seat with a hand on the wheel and a smartwatch buzzing a “Don’t forget” reminder. Caption: Alex’s watch reminds him to do his exercises when he gets home."),
                c2f("usecase-2.png", 2400, 1209, "Use case 2 of 4: a sketched scenario with its caption."),
                c2f("usecase-3.png", 2400, 1283, "Use case 3 of 4: a sketched scenario with its caption."),
                c2f("usecase-4.png", 2400, 1313, "Use case 4 of 4: a sketched scenario with its caption."),
              ],
            },
            intro: "We also explored two other product directions: an alarm clock and a light.",
            introFirst: true,
            imageCards: [
              {
                text: "An alarm clock that could alert the patient in their environment.",
                image: idea("direction-2.jpg", 2048, 1535, "Storyboard sketch of the alarm clock concept: a bedside alarm, a phone, an exercise in the home, a backyard stretch, and a smartwatch with a goal."),
                description: [
                  "This idea consists of a smart alarm clock. In the morning, it gives a wake up alarm and gives the direction that, “you have 5 minutes to go outside”. It then gives recommendations of different exercises to do on the way out. This idea seeks to build upon the need for external motivation and help with creating habits. It does this by scheduling a time for the exercise in a consistent location. This design is intended to get the ball rolling. By habit stacking and creating a consistent environment, this design helps to eliminate mental blocks that may come from knowing you have to force yourself to exercise - you just have to get outside. After an exercise is complete an image of a custom goal is displayed reinforcing that the habit they are building is more valuable than the actions alone.",
                ],
              },
              {
                text: "A light that could connect communities of patients.",
                image: idea("direction-3.png", 1226, 1622, "Sketch of the Silicon Light Community concept: a dome of friends’ lights, a wearable rep counter, and handwritten notes on how it works."),
                description: [
                  "This design consists of a dome shaped device that has bulbs that light up to represent each of your friends. When you finish your physical therapy routine for the day, you push a button and that button then lights up for you and your friends. If one of your community members sees that your button is not lit, they could send you a reminder to complete the activity for the day. This idea covered several of the user needs we found in our research, such as desire for community or group activities, being held accountable by the physical presence of someone, or someone knowing that you haven’t done your exercises, and a need for a reminder to do your exercises in a specific environment. It is more geared towards our “community seeker” archetype.",
                ],
              },
            ],
          },
          {
            heading: "User Archetypes",
            labelOnly: true,
            profiles: [
              {
                title: "“Goal Motivated”",
                image: c2f("archetype-goal.jpg", 2400, 2400, "Illustration of the Goal Motivated archetype."),
                groups: [
                  {
                    label: "Core Needs:",
                    items: [
                      "Need a goal to work towards, and a process to do so (tracking, taking notes, etc.)",
                      "Success to them is seeing a metric improve or increase.",
                      "It is important to them to be able to measure their progress and see improvement",
                    ],
                  },
                  {
                    label: "Behaviors:",
                    items: [
                      "Always thinking of the “big picture” or end results to work towards in their lives.",
                      "Breaking down larger goals into smaller, attainable steps.",
                      "Struggles with fitting all of their goals into their day",
                      "Has a smartwatch and loves music as a form of motivation",
                      "Is willing to follow a plan or treatment that will ultimately help them in their efforts to reach their goals.",
                    ],
                  },
                ],
              },
              {
                title: "“Community Seeker”",
                image: c2f("archetype-community.jpg", 2400, 2400, "Illustration of the Community Seeker archetype."),
                groups: [
                  {
                    label: "Core Needs:",
                    items: [
                      "Wants more fun and silliness in their exercise",
                      "To return to full health so that they can exercise with their friends again",
                      "Needs a connection and trust with their PT in order to be motivated to keep going back",
                    ],
                  },
                  {
                    label: "Behaviors:",
                    items: [
                      "Chooses group activities over solo, such as group exercise classes, hikes with friends, etc.",
                      "Is more likely to stick to meaningful habits or activities if they are in community",
                      "Gravitates towards group therapy or apps to help them motivate themselves",
                      "May stop going to physical therapy if they don’t trust their therapist or don’t feel they are being listened to",
                      "Struggles with self-motivation, and needs external support to get started",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        heading: "Design",
        subsections: [
          {
            heading: "User Flows",
            noHeading: true,
            gallery: {
              cols: 1,
              items: [
                c2f("userflow-1-clean.png", 2036, 959, "User flow diagram for setting up habit stacking in the companion app. A patient opens the Exercise tab and sees their weekly exercises. If a reminder is already set up, the app shows its details and asks whether to stack another habit; if not, it shows an Add a Reminder banner and asks whether they want a notification. They then select exercises and a start date, choose a time or, for location-based reminders, enable location sharing and pick a location, add an optional early reminder or repeat, and save.", { bare: true, diagram: "reminders",
                  label: "User Flow 1",
                  heading: "Set up habit stacking on companion app",
                }),
                c2f("userflow-2-clean.png", 1599, 802, "User flow diagram for planning exercises based on social connectivity. A buddy sends a nudge. If the patient wants to do today's exercise, a new session autoplays, they complete it, see the session summary, and land on the Community page where the Daily Buddy Challenge progress bar grows. If not, they long-press the notification to mark it complete or snooze it for 15, 30 or 60 minutes; a snooze brings a notification at the chosen time, otherwise the exercise is marked complete.", { bare: true, diagram: "nudge",
                  label: "User Flow 2",
                  heading: "Planning exercises based on social connectivity",
                }),
              ],
            },
          },
          {
            heading: "Prototypes",
            title: "From paper to mid-fidelity in four stages",
            stages: [
              {
                name: "Paper prototype",
                images: [
                  paper("paper-1.jpg", 1800, 2400, "Paper prototype: a Let’s Get Physical welcome screen with App Store and Google Play buttons."),
                  paper("paper-2.jpg", 1800, 2400, "Paper prototype: a home screen on sticky notes with a notification that the PT uploaded exercises, an accountability group prompt, and a tab bar."),
                  paper("paper-3.jpg", 1800, 2400, "Paper prototype: a Calf Raises tutorial screen with a video placeholder and step-by-step directions."),
                  paper("paper-4.jpg", 1800, 2400, "Paper prototype: a progress screen with a goal, rep counts, a progress chart, and a November calendar."),
                  paper("paper-5.jpg", 1800, 2400, "Paper prototype: six notification strips, such as congratulating a friend on completing their exercises or sending a reminder."),
                  paper("paper-6.jpg", 2400, 1800, "Paper prototype: Feed, Dashboard, and Leaderboard screens drawn on orange paper."),
                ],
              },
              {
                name: "Wireframes",
                video: {
                  src: "/images/commit2fit/wix/wireframes.mp4",
                  poster: "/images/commit2fit/wix/wireframes-poster.jpg",
                  mask: "/images/commit2fit/wix/phone-mask.png",
                  width: 732,
                  height: 1358,
                  alt: "Screen recording of the grayscale wireframes, starting on the Let’s Get Physical welcome screen and moving through the app.",
                },
              },
              {
                name: "Low-fidelity",
                video: {
                  src: "/images/commit2fit/wix/low-fidelity.mp4",
                  poster: "/images/commit2fit/wix/low-fidelity-poster.jpg",
                  mask: "/images/commit2fit/wix/phone-mask.png",
                  width: 732,
                  height: 1358,
                  alt: "Screen recording of the low-fidelity prototype, starting on an onboarding screen that reads Plan: set up times that your exercises will fit in your life.",
                },
              },
              {
                name: "Mid-fidelity",
                video: {
                  src: "/images/commit2fit/wix/mid-fidelity.mp4",
                  poster: "/images/commit2fit/wix/mid-fidelity-poster.jpg",
                  mask: "/images/commit2fit/wix/phone-mask-titanium.png",
                  width: 732,
                  height: 1358,
                  alt: "Screen recording of the mid-fidelity prototype, starting on the Commit2Fit welcome screen with a Get Started button and moving through the app.",
                },
              },
            ],
          },
          {
            heading: "Information Architecture",
            labelOnly: true,
            gallery: {
              cols: 1,
              items: [c2f("info-architecture.png", 1861, 1139, "Information architecture diagram of the Commit2Fit companion app. After onboarding, the Home screen leads to three main tabs: Exercises (new cards, sessions, weekly lists and reminders), Community (groups, challenges and the feed) and User profile (settings, goals and general reminders). Home also holds an alert, a start-session button and widgets for the buddy nudge, streak and goal progress.", { bare: true, diagram: "sitemap" })],
            },
          },
          {
            heading: "Style Guide",
            labelOnly: true,
            gallery: {
              cols: 2,
              items: [
                c2f("style-palette.jpg", 2400, 1896, "Color palette with primary, secondary, and accent colors, each labeled with its name, hex code, and CMYK value.", {
               heading: "Color Palette",
               caption: "Color Name · Hex Code (digital) · CMYK (for print)",
             }),
                c2f("style-variations.jpg", 2400, 1896, "Variations of each primary and accent color.", { heading: "Color Variations" }),
              ],
            },
          },
          {
            heading: "Color Coordinated Cards",
            paras: [
              "Each accent color and its variations is associated with a different main muscle group targeted by the exercise.",
            ],
            gallery: {
              layout: "dock",
              cols: 5,
              items: [
                c2f("card-legs.jpg", 1276, 1528, "Exercise card color-coded for legs.", { title: "Legs", bare: true }),
                c2f("card-back.jpg", 1276, 1528, "Exercise card color-coded for back.", { title: "Back", bare: true }),
                c2f("card-arms.jpg", 1276, 1528, "Exercise card color-coded for arms.", { title: "Arms", bare: true }),
                c2f("card-chest.jpg", 1276, 1528, "Exercise card color-coded for chest.", { title: "Chest", bare: true }),
                c2f("card-abs.jpg", 1276, 1528, "Exercise card color-coded for abdominals.", { title: "Abdominals", bare: true }),
              ],
            },
          },
        ],
      },
      {
        heading: "Design Solution",
        title: "Cards + Companion App was the solution",
        paras: [
          "A set of cards and a companion app that leverage the power of habit stacking and community accountability to help adults adhere to their at-home physical therapy plans.",
        ],
        intro: "Key Features",
        bullets: [
          "Habit stacking guidance",
          "Online PT community",
          "Exercise education",
          "Goal-focused tracking",
          "Tech-free guidance options",
        ],
        splitGallery: true,
        gallery: {
          cols: 1,
          items: [c2f("solution-overview.png", 1491, 1291, "Overview of the Commit2Fit companion app screens and exercise cards.", { bare: true })],
        },
        features: [
          {
            heading: "Adapting Exercises into Existing Routines",
            paras: [
              "Habit stacking is a method to create new habits by linking them to existing ones. Patients are more likely to complete their exercises if they are **reminded in a time of transition** between activities or before/during/after an **existing habit** such as brushing their teeth, coming home from work, or brewing their morning coffee.",
              "With this feature, patients have fewer barriers in introducing new exercises into their existing routine.",
            ],
            chips: true,
            imageWide: true,
            listLabel: "Opt-in notifications",
            listIntro: "Completely customizable by:",
            list: ["Exercise(s)", "Time-based OR Location-based", "Repetition", "Early reminder"],
            image: c2f("solution-habit-stacking-tight.png", 2156, 2066, "Companion app screens for setting up habit stacking and opt-in notifications.", { bare: true }),
          },
          {
            heading: "Building Accountability through Online Community",
            paras: [
              "Personalized, **community-driven** support groups that connect people navigating similar physical therapy journeys - motivating them through shared accountability, friendly competition, and encouragement to complete their exercises more consistently. Patients can opt in to these features.",
            ],
            chips: true,
            list: [
              "PT Focused Group Participation",
              "Daily Buddy Challenges",
              "Daily Leaderboard",
              "Community Encouragement Feed",
              "Progress & Goal Sharing",
            ],
            image: c2f("solution-community-tight.png", 951, 910, "Companion app community screens with a buddy challenge, a daily leaderboard, and an encouragement feed.", { bare: true }),
          },
          {
            heading: "Increasing Confidence through Education",
            paras: [
              "Simple, **instructive physical and digital exercise cards** designed for PT patients, delivered in small, manageable sets to serve as effective reminders. When paired with the companion app videos, the system builds confidence, clarifies purpose, and reinforces that exercises are achievable and meaningful.",
            ],
            list: [
              "Incremental distribution of cards by PT to prevent overwhelm and guide progression",
              "Form improvement tips",
              "QR code on card opens digital version in app",
              "Step-by-Step written, video, and audio guidance",
              "Frequency and duration guidance",
              "Muscle group color coding for immediate focus",
            ],
            image: c2f("solution-education-tight.png", 1342, 1655, "Physical exercise cards beside the companion app’s digital exercise guidance.", { bare: true }),
          },
          {
            heading: "Helping Motivate through Prioritizing Personal Goals",
            paras: [
              "Having a personal goal outside of your Physical Therapy achievements can **help with motivation** because it is valuable to the individual patient. Recovery progress can be linked to an activity they previously enjoyed that they want to be able to partake in again.",
            ],
            list: [
              "Lifetime Statistics Tracked",
              "Progress bar shown around goal icon and adjusts daily",
              "Goals can be adjusted at any time",
              "Milestones can break down long term goals into achievable short-term targets",
              "Seeing friend's goals adds interest and a level of humanity to recovery",
            ],
            image: c2f("solution-goals-tight.png", 657, 1322, "Companion app goal screens with a daily progress ring, lifetime statistics, and milestones.", { bare: true }),
          },
        ],
      },
      {
        heading: "Reflection",
        title: "What I learned and what I'd do next",
        cardCols: 3,
        paras: [
          "Commit2Fit is a concept, so what I took from it is as much about process as outcome.",
        ],
        cards: [
          {
            title: "What worked",
            text: "Tying every feature back to a research finding kept the project focused. Sketching 29 ideas and then pivoting from an alarm clock and a light to cards plus an app gave us a stronger direction than any single early idea.",
          },
          {
            title: "What I'd do differently",
            text: "We haven't tested Commit2Fit with real patients or physical therapists yet. I'd put the mid-fidelity prototype in front of people mid-recovery to see whether habit stacking and buddy nudges actually change what they do at home.",
          },
          {
            title: "What's next",
            text: "Measure adherence over several weeks, work with PTs on how cards are handed out, and check that the app works for people who are in pain or less comfortable with technology.",
          },
        ],
      },
    ],
  },
  {
    slug: "uber",
    wideText: true,
    headerImage: {
      src: "/images/uber/header/header-static.jpg",
      width: 2752,
      height: 1536,
      alt: "Illustration of a city street: a rider with a phone waits beside an Uber car at the curb.",
      focus: "92% 100%",
      stripeRgb: "243 243 243",
    },
    // The looping header video is parked for now: re-add headerVideo { mp4, webm, focus } to bring it back
    // (files are in /images/uber/header/uber-header.mp4 and .webm).
    heroImage: {
      src: "/images/uber/hero-gemini.jpg",
      width: 1280,
      height: 832,
      alt: "Pixel-art illustration of a line of cars waiting along an airport pickup curb at dusk, beneath a curved terminal roof and a pink and purple sky.",
      stripeRgb: "120 114 118",
    },
    heroMedia: "Image: hero shot of the Uber pickup map from a participant recording",
    name: "Uber",
    logo: { src: "/images/logos/uber.png", width: 778, height: 275 },
    kicker: "UX research case study · Mobility",
    headline: "Why riders and drivers miss each other at pickup",
    status: { label: "Research", tone: "purple" },
    tags: ["Usability study", "Mobility"],
    role: "UX researcher and PM · 10 weeks",
    cardSummary:
      "A usability study of the rendezvous phase, from driver acceptance to vehicle entry, at hard pickup spots: multi-level garages, inaccurate GPS, one-way streets, and dense urban blocks.",
    hideStats: true,
    stats: [],
    meta: [
      { label: "Role", value: ["UX Researcher", "PM"] },
      { label: "Timeline", value: ["10 weeks", "Winter 2026"] },
      { label: "Team", value: ["Jenn Park", "Grace Liu", "Yudie Xia", "Liz Overbeek"] },
      { label: "Uber Partners", value: ["Joan Williams", "Jonathon Markowski"] },
      { label: "Context", value: "Usability Studies course in partnership with Uber" },
    ],
    tldr: [
      {
        label: "Focus",
        text: "The rendezvous phase of the Uber rider app: everything between a driver accepting a ride and the rider getting into the car.",
      },
      {
        label: "What we did",
        text: "Ran unmoderated, think-aloud usability tests with 9 riders who regularly face hard pickups, followed by a questionnaire and interview.",
      },
      {
        label: "What we found",
        text: "Five findings. Pickup suggestions, the map, and GPS all erode trust, riders fall back on instinct, and not knowing which side of the road to wait on is the one issue that raises a safety concern.",
      },
    ],
    sections: [
      {
        heading: "Overview",
        title: "Where riders and drivers lose each other",
        paras: [
          "We studied the Uber rider mobile app, focusing on the pickup, or rendezvous, phase: interpreting the pickup location, navigating to the meeting point, tracking the driver's arrival, and coordinating with the driver. The target audience was riders who deal with complex pickup environments, such as multi-level pickup areas and places with GPS or coordination challenges.",
        ],
        intro: "Research questions",
        scrollCards: true,
        cards: [
          { text: "How well do riders understand where to go for pickup?" },
          { text: "How do riders navigate to confusing or complex pickup locations?" },
          { text: "How effectively do riders coordinate with their driver during the rendezvous?" },
          { text: "Do riders feel they have enough information to complete the pickup?" },
        ],
      },
      {
        heading: "Methods",
        title: "How we ran the study",
        numbered: true,
        cards: [
          {
            title: "Screening survey",
            text: "Filtered for people likely to face real pickup challenges, such as multi-level buildings, GPS drift, and dense urban areas. Participants also submitted a test recording to confirm screen and audio quality, and gave informed consent.",
          },
          {
            title: "Unmoderated usability test",
            text: "Participants screen-recorded a real Uber pickup from booking to entering the vehicle, thinking aloud as they went. We focused on how they read the pickup pin, map cues, and driver location, and on what they did when the app's guidance didn't match the physical world.",
            aside: {
              src: "/images/uber/participant-materials.png",
              alt: "Three pages of the participant instructions: the study purpose, think-aloud and recording instructions, and step-by-step study steps.",
              caption: "",
              width: 837,
              height: 848,
              bare: true,
              viewer: {
                pageWidth: 1445,
                pageHeight: 1870,
                pages: [
                  { src: "/images/uber/participant-instructions-1.jpg", alt: "Participant instructions, page 1: purpose of the study, think-aloud instructions, and recording instructions." },
                  { src: "/images/uber/participant-instructions-2.jpg", alt: "Participant instructions, page 2: privacy and the step-by-step study instructions." },
                  { src: "/images/uber/participant-instructions-3.jpg", alt: "Participant instructions, page 3: the final steps once the ride is complete, and additional notes for the waiting period." },
                ],
                // The visible part of each page (the pages overlap, so these never do), as clip-path outlines in % of the image.
                hotspots: [
                  { page: 2, polygon: "polygon(32.6% 0.2%, 30.8% 14.9%, 49.1% 14.9%, 49.1% 35.4%, 54.0% 23.6%, 77.6% 32.8%, 80.9% 6.7%)" },
                  { page: 1, polygon: "polygon(30.7% 79.8%, 75.9% 98.8%, 98.8% 41.0%, 54.0% 23.6%, 49.1% 35.4%, 49.1% 77.0%, 31.9% 77.0%)" },
                  { page: 0, polygon: "polygon(0.2% 14.9%, 49.1% 14.9%, 49.1% 77.0%, 0.2% 77.0%)" },
                ],
              },
            },
          },
          {
            title: "Post-test questionnaire",
            text: "A five-point Likert scale across six dimensions of the pickup experience, with an open-ended “why” for each rating, to inform our interview scripts, incorporating mixed-methods research.",
            bubbles: ["How would you rate the clarity of your pickup location? Why did you choose the rating you did?"],
          },
          {
            title: "Post-test interview",
            text: "Remote and semi-structured, with questions ordered primary, secondary, then exploratory. It clarified in-app decisions, moments of hesitation, and trust in the app's guidance.",
            bubbles: [
              "How did you determine when and where the driver had arrived?",
              "How did you understand where the pickup location was?",
              "If you were picking up from this same location again, would you do anything differently next time?",
            ],
          },
          {
            title: "Analysis",
            text: "We transcribed participant observations and grouped notes with affinity diagramming, pairing questionnaire ratings with recorded behavior and interview reflections to find patterns across participants.",
            figure: {
              src: "/images/uber/affinity-diagram.png",
              alt: "Affinity diagram of color-coded sticky notes from the study, grouped into clusters of related observations, with written findings and design implications beside each cluster.",
              caption: "195 observations grouped into 15 clusters across setup, navigation, and pickup, which became the five findings below.",
              width: 1978,
              height: 539,
              bare: true,
            },
          },
        ],
        paras: [
          "We used four methods, then analyzed the results together.",
        ],
      },
      {
        heading: "Participants",
        title: "9 riders who knew hard pickups firsthand",
        paras: ["We recruited 9 participants for this study through a Screening Survey. Participants were frequent Uber users, highly confident with the app, and primarily riding in urban environments."],
        intro: "Minimum requirements for a participant",
        bulletCards: true,
        bullets: [
          "Used Uber 1-6 times in the past month",
          "Experienced a confusing pickup situation",
          "Ages 21-60",
          "Located in the United States",
        ],
        charts: [
          {
            kind: "pie",
            title: "Age range",
            note: "9 responses",
            total: 9,
            items: [
              { label: "22–30", value: 6 },
              { label: "31–40", value: 2 },
              { label: "18–21", value: 1 },
            ],
            alt: "Pie chart of participant ages from 9 responses: 66.7 percent were 22 to 30, 22.2 percent were 31 to 40, and 11.1 percent were 18 to 21.",
          },
          {
            kind: "rows",
            title: "Where are you located?",
            note: "9 responses, closest major city",
            total: 9,
            items: [
              { label: "Greater Seattle Area", value: 6, accent: true },
              { label: "Los Angeles", value: 1 },
              { label: "Manhattan", value: 1 },
              { label: "Scottsdale, AZ", value: 1 },
            ],
            alt: "Bar chart of participant locations from 9 responses: 6 in the Greater Seattle Area (Seattle, the U District, and Bothell), and 1 each in Los Angeles, Manhattan, and Scottsdale, Arizona.",
          },
          {
            kind: "columns",
            title: "How confident are you using the Uber app?",
            note: "9 responses, 1 to 5",
            total: 9,
            items: [
              { label: "1", value: 0 },
              { label: "2", value: 0 },
              { label: "3", value: 1 },
              { label: "4", value: 5, accent: true },
              { label: "5", value: 3 },
            ],
            alt: "Bar chart of confidence using the Uber app on a 1 to 5 scale from 9 responses: none rated 1 or 2, one rated 3, five rated 4 (55.6 percent), and three rated 5.",
          },
          {
            kind: "rows",
            title: "What kind of areas do you typically use Uber in?",
            note: "9 responses",
            total: 9,
            items: [
              { label: "Urban", value: 9, accent: true },
              { label: "Suburban", value: 2 },
              { label: "Rural", value: 0 },
            ],
            alt: "Bar chart of the areas participants typically use Uber in, from 9 responses: all 9 urban, 2 suburban, and none rural. Participants could pick more than one.",
          },
          {
            kind: "pie",
            title: "Rides with Uber in the past month",
            note: "Screening survey, 10 responses",
            total: 10,
            items: [
              { label: "1–3 rides", value: 5 },
              { label: "4–6 rides", value: 4 },
              { label: "7 or more", value: 1 },
              { label: "None", value: 0 },
            ],
            alt: "Pie chart of rides taken with Uber in the past month from 10 screening survey responses: 50 percent took 1 to 3 rides, 40 percent took 4 to 6, and 10 percent took 7 or more.",
          },
          {
            kind: "pie",
            title: "A confusing or difficult pickup in the past 3 months?",
            note: "9 responses",
            total: 9,
            items: [
              { label: "Yes", value: 7 },
              { label: "No", value: 2 },
            ],
            alt: "Pie chart of whether participants had a confusing or difficult pickup in the past three months from 9 responses: 7 said yes (77.8 percent) and 2 said no (22.2 percent).",
          },
        ],
      },
      {
        heading: "Interaction map",
        title: "Mapping the pickup flow",
        paras: [
          "Before the study, I mapped every screen a rider sees between entering a destination and getting in the car. It showed us where the app gives pickup guidance, and so where to look for breakdowns.",
        ],
        figure: {
          src: "/images/uber/interaction-map-preview.jpg",
          alt: "Interaction map of the Uber pickup experience: entering a pickup and destination, choosing a ride, confirming the pickup spot, requesting the ride, waiting while the driver approaches, and the driver arriving, with the notification and safety pop-ups.",
          caption: "",
          width: 1327,
          height: 1800,
          pan: { src: "/images/uber/interaction-map.jpg", width: 3835, height: 5200 },
        },
      },
      {
        heading: "Findings",
        title: "5 findings across 3 stages of the pickup",
        paras: [
          "The study surfaced more findings than fit here. These five are the ones I chose to highlight because they impacted trust and safety the most.",
          "Each finding was assigned a severity rating based on its impact on the user experience. Most were low, but one was medium because it raised a safety concern.",
        ],
        scale: [
          { level: "Low", text: "Frustrating, but not task inhibiting" },
          { level: "Medium", text: "Safety related, but not task inhibiting" },
          { level: "High", text: "Task unable to be completed" },
        ],
        outline: [
          {
            title: "Setup: Riders lose trust",
            findings: [
              {
                title: "Pickup suggestions erode trust, so riders rely on instinct",
                takeaway: "Suggested spots feel arbitrary and can't be questioned, so riders fall back on visible, familiar spots and expect friction.",
                severity: "Low",
                points: [
                  "Suggested spots feel far away, impractical, or unrelated to what riders expect, and riders didn't see or use the reasoning behind them.",
                  "Frequent pin changes and automatic location adjustments make riders feel the system overrides their intended spot.",
                  "So riders trust their own judgment: 5 of 9 adjust their position only when meeting the driver, choose visible or familiar locations, and read road conditions to predict where the driver will arrive.",
                  "4 of 9 expect hiccups, especially at airports or buildings with multiple entrances.",
                ],
                quote: { text: "Usually I would choose to get picked up at the company entrance because the company has a clear sign and a logo, making it easier for the driver.", by: "P4" },
                clip: {
                  participant: "P6",
                  mp4: "/images/uber/pickup-far-clip.mp4",
                  webm: "/images/uber/pickup-far-clip.webm",
                  poster: "/images/uber/pickup-far-clip-poster.jpg",
                  width: 444,
                  height: 960,
                  alt: "Screen recording of a rider choosing a pickup spot on a campus map, sped up, with captions quoting the participant. The suggested spots are far from where they are, so they walk, check other suggestions, still find them far away, and finally pick one.",
                  maxWidth: 200,
                },
                recs: [
                  "Explain why a spot was suggested, such as safety or traffic flow, and suggest spots where a car can actually stop.",
                  "Avoid unexpected pin changes and give riders transparent control over the pickup spot.",
                  "Help riders find clearer pickup spots: highlight visible landmarks and surface spots with many successful pickups.",
                  "Give clear feedback on distance and alignment between rider and driver.",
                ],
              },
            ],
          },
          {
            title: "Navigation: The map falls short",
            findings: [
              {
                title: "The map is perceived as unreliable",
                takeaway: "Orientation is confusing and details are lacking, which leads to uncertainty and mistrust.",
                severity: "Low",
                points: [
                  "6 of 9 participants expressed frustration, yet average satisfaction on the questionnaire was about 4 out of 5. **Frustration isn't the same as dissatisfaction.**",
                  "The app only offers walking directions, and riders didn't follow the suggested path when it wasn't the quickest.",
                ],
                quote: {
                  text: "The map itself doesn't rotate, so the orientation can sometimes be confusing. The arrow that shows direction can also be inaccurate, especially in areas with many buildings.",
                  by: "P5",
                },
                clip: {
                  participant: "P7",
                  mp4: "/images/uber/walking-path-clip.mp4",
                  webm: "/images/uber/walking-path-clip.webm",
                  poster: "/images/uber/walking-path-clip-poster.jpg",
                  width: 444,
                  height: 960,
                  alt: "Screen recording of a rider waiting for their driver, sped up to 15 seconds. The map shows a suggested walking path to the pickup point, but the rider doesn't follow it. Caption: Participant does not consider or follow suggested walking path.",
                  maxWidth: 200,
                },
                recs: [
                  "Add more detailed visuals, like satellite view, street view, and sidewalks.",
                  "Introduce location selection for multi-level structures.",
                  "Have a course of action to re-establish trust and safety when paths aren't followed.",
                ],
              },
              {
                title: "Side of the road is critical",
                takeaway: "The app doesn't say which side of the road to wait on, which raises a safety concern.",
                severity: "Medium",
                clip: {
                  participant: "P5",
                  mp4: "/images/uber/pickup-side-clip.mp4",
                  webm: "/images/uber/pickup-side-clip.webm",
                  poster: "/images/uber/pickup-side-clip-poster.jpg",
                  width: 444,
                  height: 960,
                  alt: "Screen recordings of two Uber pickups, sped up, with captions quoting the participant. In the first, the participant explains that drivers are often confused about which side of a busy street to pick them up on. In the second, the driver arrives, the participant isn't sure which side he will wait on, texts him that they are on the other side of the street, and the driver eventually comes to them.",
                  maxWidth: 200,
                },
                points: [
                  "Riders are confused about where to stand, which leads to unsafe street-crossing behavior and traffic problems.",
                  "4 of 9 participants experienced this in the study, and more said in the interview that it comes up often. One of the two lowest trust ratings in the questionnaire traced back to it.",
                ],
                quote: { text: "I often don't know which direction the car will approach from, so I'm not sure which side of the road I should stand on.", by: "P6" },
                recs: [
                  "Add explicit street-side guidance to the pickup map.",
                  "Align rider and driver positioning before the driver arrives.",
                ],
              },
            ],
          },
          {
            title: "Pickup: Waiting under pressure",
            findings: [
              {
                title: "Drivers don't stop where the pin is",
                takeaway: "Drivers often don't stop at the pin the rider chose, so pickup reliability feels inconsistent.",
                severity: "Low",
                clip: {
                  participant: "P1",
                  mp4: "/images/uber/gps-clip.mp4",
                  webm: "/images/uber/gps-clip.webm",
                  poster: "/images/uber/gps-clip-poster.jpg",
                  width: 444,
                  height: 960,
                  alt: "Screen recording of a rider's Uber app during a pickup, sped up 2.5 times. The map shows the driver stopped at a red light while the app says the driver has arrived, then driving to the pickup point, then parking on the side of the road. Captions quote the participant describing each moment.",
                  maxWidth: 200,
                },
                points: [
                  "5 of 9 participants said the GPS wasn't followed: the driver didn't arrive at the pickup point the rider selected, which caused confusion. The app even marked a driver as arrived at a red light, before the real spot.",
                  "Where drivers stop is shaped by traffic and parking availability, and drivers vary in navigation and communication skills, so pickup reliability feels inconsistent.",
                ],

                recs: [
                  "Recalibrate GPS accuracy, detect true pickup proximity more reliably, and clearly communicate how accurate it is.",
                  "Clarify the exact pickup location (entrance, level, and side of the street) and give drivers clearer guidance on where to stop.",
                ],
              },
              {
                title: "Time pressure and fee uncertainty",
                takeaway: "Countdown timers and unclear fee rules make riders feel rushed and anxious about cancelling.",
                severity: "Low",
                points: [
                  "Countdown timers made riders feel rushed even when the driver was still some distance away, and the ETA doesn't reflect real pickup conditions. One of the two lowest trust ratings traced back to time pressure from an off-pin pickup.",
                  "Cancellation fees follow defined rules, but calculation is not apparent in the UI. Riders want to know exactly when a fee starts before they decide to cancel.",
                ],
                evidence: {
                  src: "/images/uber/cancellation-policy.png",
                  alt: "Uber's cancellation fee policy. Shared, Economy, and Premium rides each have different cancellation windows. For Economy rides, a fee applies if you cancel more than 2 minutes after your request is accepted. The policy also says fees vary by location and may increase depending on how busy it is.",
                  caption: "Uber's cancellation fee policy: the rules depend on ride type, location, and demand. Highlights added.",
                  source: { label: "Uber Help Page", href: "https://help.uber.com/riders/article/review-cancellation-fee?nodeId=6bec690f-ee35-40ba-96ee-c38a8ae796e0" },
                  width: 1576,
                  height: 1052,
                  marks: [
                    { x: 708, y: 200, w: 150, h: 38 },
                    { x: 296, y: 728, w: 244, h: 38 },
                    { x: 1010, y: 728, w: 140, h: 38 },
                  ],
                },
                quote: {
                  text: "The cancellation fee feels a bit unclear. I might want to cancel, but I don't know exactly when the fee starts, so I prefer to have more information about that.",
                  by: "P6",
                },
                recs: [
                  "Design to reduce the pressure from countdown timers, and make the ETA reflect real pickup conditions.",
                  "Show when cancellation fees apply, explain why they vary, and provide a clear fee breakdown.",
                ],
              },
            ],
          },
        ],
      },
      {
        heading: "Reflection and next steps",
        title: "What a follow-up should cover",
        numbered: true,
        paras: ["Three limits of the study point to what a follow-up should do."],
        cards: [
          {
            title: "Sample diversity",
            text: "Most participants were 22 to 30 and based mainly in Seattle, which limits the range of rider experiences. A future study should recruit across broader age groups and geographies.",
          },
          {
            title: "Real-time rider-driver interaction",
            text: "Driver behavior shaped pickup outcomes, but we mostly captured the rider's side. A future study should observe both rider and driver to see where coordination breaks down.",
          },
          {
            title: "Environmental context",
            text: "Map mistrust and side-of-road confusion depended on the physical setting. A future study should capture street layout, building levels, and pickup infrastructure.",
          },
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
