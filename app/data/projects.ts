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
  paras?: string[];
  bullets?: string[];
  cards?: { title: string; text: string; solution?: string; /** A small illustration shown beside the card (research-finding cards). */ icon?: Img }[];
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
  imageCards?: { text: string; image: Img }[];
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
  figure?: Figure;
};

export type Figure = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export type Finding = {
  title: string;
  severity: "Low" | "Medium" | "High";
  points: string[];
  quotes?: { text: string; by: string }[];
  figure?: Figure;
  media?: string;
  recs: string[];
};

export type Project = {
  slug: string;
  heroMedia: string;
  /** When set, shown in place of the labeled hero placeholder. */
  /** A photo used as the case study page's header in place of `heroImage` (which still drives the homepage card). It is a photograph, so it fades out over a narrow strip on its left edge and sits clear of the side tracker. */
  headerImage?: { src: string; width: number; height: number; alt: string; /** Space-separated r g b of the image's bottom edge, used to tint the striped transition. */ stripeRgb: string };
  /** Optional looping video layered over `headerImage` (which then acts as its poster / reduced-motion still). */
  headerVideo?: { mp4: string; webm?: string };
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
  /** Let paragraphs run the full width of the content area. */
  wideText?: boolean;
  /** Real image shown right under the title block. */
  lead?: Img;
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
    name: "Blue Origin",
    logo: { src: "/images/logos/blue-origin.png", width: 896, height: 472 },
    kicker: "UX case study · Space manufacturing",
    headline: "Replacing the system that runs the additive manufacturing floor",
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
          "Blue Origin's Enterprise Technology team was disabling the software behind its additive manufacturing floor, which builds 450 to 2,000 engine parts a week. We had 10 months to replace it. Without a replacement, the floor couldn't operate.",
        ],
        intro: "Why it mattered",
        bullets: [
          "Every engine part required ITAR compliance and full traceability.",
          "The old system let operators create custom versions of approved processes, so engineers couldn't tell which variation was followed.",
          "That inconsistency caused 5 to 10 anomalies a week, each needing significant engineer time for root cause analysis, and made parts hard to trace.",
        ],
      },
      {
        heading: "Role and team",
        title: "A team of three, and I wore three hats",
        media: ["Diagram: team structure across AM customers and operations", "Diagram: timeline from Sept 2024 notice to July 2025 rollout"],
        paras: [
          "I stepped into design, PM, and product owner roles because the project needed them and I understood both the system and its users.",
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
        media: ["Image: shadowing operators on the floor (cleared photo)", "Diagram: process flow from research to side-by-side testing"],
        paras: [
          "Research: I shadowed operators and interviewed 33 stakeholders (15 engineers, 12 operators, 3 managers, and 3 maintenance staff), then audited the old system.",
          "Key insight: operators had built workarounds because the old process didn't fit their machines. It required all four laser inputs, even on dual-laser machines, so operators made custom views. I built that need into the system with dynamic checklists that adapt to machine type: a dual-laser machine shows two laser fields, a quad shows four. Operators get relevant inputs, and engineers get consistent data.",
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
          "Baserow, the platform I advocated for, became Blue's central hub for additive manufacturing data, and our React interface is still in use.",
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
    tags: ["Mobile app", "Health and wellness"],
    role: "UX designer and researcher · 10 weeks",
    wideText: true,
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
        href: "#impact",
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
        paras: [
          "Our semi-structured interviews were made up of 2 physical therapists and 3 former physical therapy patients.",
        ],
        subsections: [
          {
            heading: "Research Findings",
            title: "Three themes pointed us to a solution",
            cardCols: 3,
            paras: [
              "By connecting the findings below, we aimed to lessen the resistance of working exercises into routines and make the path to reaching goals easier.",
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
            c2f("sketch-01.png", 468, 321, "Brainstorm sketch 1 of 25."),
            c2f("sketch-02.png", 468, 304, "Brainstorm sketch 2 of 25."),
            c2f("sketch-03.png", 364, 568, "Brainstorm sketch 3 of 25."),
            c2f("sketch-04.png", 468, 313, "Brainstorm sketch 4 of 25."),
            c2f("sketch-05.png", 468, 357, "Brainstorm sketch 5 of 25."),
            c2f("sketch-06.png", 451, 648, "Brainstorm sketch 6 of 25."),
            c2f("sketch-07.png", 468, 281, "Brainstorm sketch 7 of 25."),
            c2f("sketch-08.jpg", 371, 224, "Brainstorm sketch 8 of 25."),
            c2f("sketch-09.png", 468, 260, "Brainstorm sketch 9 of 25."),
            c2f("sketch-10.png", 468, 385, "Brainstorm sketch 10 of 25."),
            c2f("sketch-11.png", 409, 568, "Brainstorm sketch 11 of 25."),
            c2f("sketch-12.jpg", 319, 234, "Brainstorm sketch 12 of 25."),
            c2f("sketch-13.png", 392, 525, "Brainstorm sketch 13 of 25."),
            c2f("sketch-14.jpg", 332, 195, "Brainstorm sketch 14 of 25."),
            c2f("sketch-15.png", 468, 254, "Brainstorm sketch 15 of 25."),
            c2f("sketch-16.png", 468, 299, "Brainstorm sketch 16 of 25."),
            c2f("sketch-17.jpg", 339, 377, "Brainstorm sketch 17 of 25."),
            c2f("sketch-18.png", 380, 289, "Brainstorm sketch 18 of 25."),
            c2f("sketch-19.png", 468, 308, "Brainstorm sketch 19 of 25."),
            c2f("sketch-20.png", 394, 178, "Brainstorm sketch 20 of 25."),
            c2f("sketch-21.png", 409, 233, "Brainstorm sketch 21 of 25."),
            c2f("sketch-22.jpg", 383, 277, "Brainstorm sketch 22 of 25."),
            c2f("sketch-23.png", 386, 479, "Brainstorm sketch 23 of 25."),
            c2f("sketch-24.jpg", 384, 220, "Brainstorm sketch 24 of 25."),
            c2f("sketch-25.png", 437, 612, "Brainstorm sketch 25 of 25."),
          ],
        },
        paras: [
          "As a group we held a quick brainstorming session where we challenged ourselves to sketch solutions that could address our research findings and goals.",
          "From those initial sketches, we were able to identify 10 key themes across the 29 ideas.",
        ],
        intro: "After reviewing our goals for this solution, we decided to focus on",
        imageCards: [
          {
            text: "A card that could educate and connect to existing technology.",
            image: c2f("direction-1.png", 468, 350, "Sketch of the card concept: a watch and education cards that connect through NFC, with a workout tracker and motivation cards."),
          },
        ],
        subsections: [
          {
            heading: "Pivot - Alternate Use Cases Considered",
            collapsible: true,
            /** Shown without its own heading or divider, right under the card concept image. */
            noHeading: true,
            collapseLabel: "Curious about other paths we almost tried? Find them here!",
            paras: [
              "Although we pivoted away from these initial concepts, we gained many valuable insights from exploring these use cases. All features demonstrated ended up reappearing in our final product.",
              "This gallery also includes two of the other product directions we explored: an alarm clock and a light.",
            ],
            gallery: {
              cols: 2,
              items: [
                c2f("usecase-1.png", 2400, 2364, "Sketch from a driver’s seat with a hand on the wheel and a smartwatch buzzing a “Don’t forget” reminder. Caption: Alex’s watch reminds him to do his exercises when he gets home."),
                c2f("usecase-2.png", 2400, 1209, "Use case 2 of 4: a sketched scenario with its caption."),
                c2f("usecase-3.png", 2400, 1283, "Use case 3 of 4: a sketched scenario with its caption."),
                c2f("usecase-4.png", 2400, 1313, "Use case 4 of 4: a sketched scenario with its caption."),
                c2f("direction-2.jpg", 468, 350, "Storyboard sketch of the alarm clock concept: a bedside alarm, a phone, an exercise in the home, a backyard stretch, and a smartwatch with a goal.", { caption: "An alarm clock that could alert the patient in their environment." }),
                c2f("direction-3.png", 468, 620, "Sketch of the Silicon Light Community concept: a dome of friends’ lights, a wearable rep counter, and handwritten notes on how it works.", { caption: "A light that could connect communities of patients." }),
              ],
            },
          },
          {
            heading: "User Archetypes",
            title: "Two archetypes shaped who we designed for",
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
                c2f("userflow-1-clean.png", 2036, 959, "User flow diagram for setting up habit stacking in the companion app.", { bare: true,
                  label: "User Flow 1",
                  heading: "Set up habit stacking on companion app",
                }),
                c2f("userflow-2-clean.png", 1599, 802, "User flow diagram for planning exercises based on social connectivity.", { bare: true,
                  label: "User Flow 2",
                  heading: "User is guided through planning their exercises based on social connectivity",
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
                  c2f("prototype-1a.png", 276, 345, "Paper prototype: a Let’s Get Physical welcome screen with App Store and Google Play buttons."),
                  c2f("prototype-1b.png", 277, 345, "Paper prototype: a home screen on sticky notes with a notification that the PT uploaded exercises, an accountability group prompt, and a tab bar."),
                  c2f("prototype-1c.png", 276, 345, "Paper prototype: a Calf Raises tutorial screen with a video placeholder and step-by-step directions."),
                  c2f("prototype-1d.png", 276, 345, "Paper prototype: a progress screen with a goal, rep counts, a progress chart, and a November calendar."),
                  c2f("prototype-1e.png", 276, 345, "Paper prototype: six notification strips, such as congratulating a friend on completing their exercises or sending a reminder."),
                  c2f("prototype-1f.png", 431, 345, "Paper prototype: Feed, Dashboard, and Leaderboard screens drawn on orange paper."),
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
              items: [c2f("info-architecture.png", 1861, 1139, "Information architecture diagram of the Commit2Fit companion app.", { bare: true })],
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
              "Habit stacking is a method to create new habits by linking them to existing ones. Patients are more likely to complete their exercises if they are reminded in a time of transition between activities or before/during/after an existing habit such as brushing their teeth, coming home from work, or brewing their morning coffee.",
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
              "Personalized, community-driven support groups that connect people navigating similar physical therapy journeys - motivating them through shared accountability, friendly competition, and encouragement to complete their exercises more consistently. Patients can opt in to these features.",
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
              "Simple, instructive physical and digital exercise cards designed for PT patients, delivered in small, manageable sets to serve as effective reminders. When paired with the companion app videos, the system builds confidence, clarifies purpose, and reinforces that exercises are achievable and meaningful.",
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
              "Having a personal goal outside of your Physical Therapy achievements can help with motivation because it is valuable to the individual patient. Recovery progress can be linked to an activity they previously enjoyed that they want to be able to partake in again.",
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
        heading: "Impact",
        paras: [
          "By improving consistency and motivation outside the clinic, Commit2Fit will enhance adherence to at-home physical therapy plans and ultimately support faster, more effective recovery.",
        ],
      },
    ],
  },
  {
    slug: "uber",
    heroImage: {
      src: "/images/uber/hero-gemini.jpg",
      width: 1280,
      height: 832,
      alt: "Pixel-art illustration of a line of cars waiting along an airport pickup curb at dusk, beneath a curved terminal roof and a pink and purple sky.",
      stripeRgb: "120 114 118",
    },
    heroMedia: "Image: hero shot of the Uber pickup map from a participant recording",
    name: "Uber",
    kicker: "UX research case study · Mobility",
    headline: "Why riders and drivers miss each other at pickup",
    tags: ["Usability study", "Mobility"],
    role: "UX researcher and PM · 10 weeks",
    cardSummary:
      "A usability study of the rendezvous phase, from driver acceptance to vehicle entry, at hard pickup spots: multi-level garages, inaccurate GPS, one-way streets, and dense urban blocks.",
    stats: [
      { value: "9", label: "participants" },
      { value: "9", label: "findings across setup, navigation, and pickup" },
      { value: "78%", label: "had a confusing pickup in the past three months" },
      { value: "10 weeks", label: "HCDE 517 course project" },
    ],
    meta: [
      { label: "Role", value: "UX researcher and PM" },
      { label: "Team", value: "Jenn Park, Grace Liu, Yudie Xia, and me" },
      { label: "Context", value: "UW HCDE 517 Usability Studies, Winter 2026, in partnership with Uber" },
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
        text: "Nine findings. Pickup suggestions, the map, and GPS all erode trust, riders fall back on instinct, and not knowing which side of the road to wait on is the one issue that raises a safety concern.",
      },
    ],
    sections: [
      {
        heading: "Overview",
        title: "Where riders and drivers lose each other",
        media: ["Diagram: the rendezvous phase, from driver acceptance to entering the vehicle"],
        paras: [
          "We studied the Uber rider mobile app, focusing on the pickup, or rendezvous, phase: interpreting the pickup location, navigating to the meeting point, tracking the driver's arrival, and coordinating with the driver. The target audience was riders who deal with complex pickup environments, such as multi-level pickup areas and places with GPS or coordination challenges.",
        ],
        intro: "Research questions",
        cards: [
          { title: "Understanding", text: "How well do riders understand where to go for pickup?" },
          { title: "Navigation", text: "How do riders navigate to confusing or complex pickup locations?" },
          { title: "Coordination", text: "How effectively do riders coordinate with their driver during the rendezvous?" },
          { title: "Information", text: "Do riders feel they have enough information to complete the pickup?" },
        ],
      },
      {
        heading: "Methods",
        title: "Four methods, one real pickup",
        numbered: true,
        media: ["Image: study setup showing the unmoderated test and think-aloud flow"],
        cards: [
          {
            title: "Screening survey",
            text: "Filtered for people likely to face real pickup challenges, such as multi-level buildings, GPS drift, and dense urban areas. Participants also submitted a test recording to confirm screen and audio quality, and gave informed consent.",
          },
          {
            title: "Unmoderated usability test",
            text: "Participants screen-recorded a real Uber pickup from booking to entering the vehicle, thinking aloud as they went. We focused on how they read the pickup pin, map cues, and driver location, and on what they did when the app's guidance didn't match the physical world.",
          },
          {
            title: "Post-test questionnaire",
            text: "A five-point Likert scale across six dimensions of the pickup experience, with an open-ended “why” for each rating, so every number came with its reasoning.",
          },
          {
            title: "Post-test interview",
            text: "Remote and semi-structured, with questions ordered primary, secondary, then exploratory. It clarified in-app decisions, moments of hesitation, and trust in the app's guidance.",
          },
        ],
        paras: [
          "We used four methods, then analyzed the results together. We transcribed participant observations and grouped notes with affinity diagramming, pairing questionnaire ratings with recorded behavior and interview reflections to find patterns across participants.",
        ],
      },
      {
        heading: "Participants",
        title: "Nine riders who knew hard pickups firsthand",
        paras: [
          "We recruited 9 participants through the screening survey. They were frequent, confident Uber users who mostly ride in urban areas, and many had recently had a confusing pickup.",
        ],
        bullets: [
          "Criteria: used Uber 1 to 6 times in the past month, had experienced a confusing pickup, were aged 21 to 60, and were located in the United States.",
          "Age: most were 22 to 30 (66.7%), with the rest split between 18 to 21 (11.1%) and 31 to 40 (22.2%).",
          "Location: mainly Seattle, with several other U.S. cities.",
          "Confidence: most rated themselves very confident with the app, with 55.6% giving a 4 out of 5.",
          "Ride frequency: in the screening survey (10 responses), 50% had taken 1 to 3 Uber rides in the past month, 40% had taken 4 to 6, and 10% had taken 7 or more.",
          "Recent pickups: 77.8% had a confusing or difficult pickup within the past three months.",
        ],
        figure: {
          src: "/images/uber/usage-frequency.png",
          alt: "Pie chart of screening survey responses to how many Uber rides people took in the past month: 50 percent took 1 to 3, 40 percent took 4 to 6, and 10 percent took 7 or more.",
          caption: "Screening survey: rides taken with Uber in the past month (10 responses).",
          width: 812,
          height: 440,
        },
      },
      {
        heading: "How we rated findings",
        title: "Three levels of severity",
        media: ["Diagram: the low, medium, and high severity scale"],
        paras: [
          "Each finding got a severity rating. Low means frustrating but not task-inhibiting. Medium means safety-related but not task-inhibiting. High means the task couldn't be completed. We found nine issues across setup, navigation, and pickup. None was rated high, and one was rated medium.",
        ],
      },
      {
        heading: "Findings: setup",
        title: "Riders don't trust where the app puts the pin",
        findings: [
          {
            title: "Pickup point suggestions erode trust",
            severity: "Low",
            media: "Screenshot: a suggested pickup spot far from the rider's intended spot",
            points: [
              "Suggested spots felt random: far away, impractical, or unrelated to what riders expected.",
              "Riders didn't see or use any reasoning for why the app suggested a spot.",
              "Riders felt the system overrode their intended spot through frequent pin changes and automatic location adjustments.",
            ],
            recs: [
              "Explain the logic behind suggestions, such as safety or traffic flow, with context or visual cues.",
              "Avoid unexpected pin changes.",
              "Give riders transparent control over the pickup spot.",
            ],
          },
          {
            title: "Riders rely on instinct, not the app",
            severity: "Low",
            media: "Image: a rider waiting at a familiar, visible landmark",
            points: [
              "5 of 9 riders pick a spot and stay put, adjusting position only when they meet the driver, and choose visible or familiar places.",
              "4 of 9 expect some hiccups, especially at airports or buildings with multiple entrances.",
              "Riders' own judgment compensates for guidance that is unclear and imperfect.",
            ],
            recs: [
              "Help riders find clearer, more reliable pickup spots: highlight visible landmarks, recommend simpler locations, or surface spots with many successful pickups.",
              "Give clear feedback on distance and alignment between rider and driver to reduce coordination friction.",
            ],
          },
        ],
      },
      {
        heading: "Findings: navigation",
        title: "The map, the GPS, and the side of the road",
        findings: [
          {
            title: "The map is perceived as unreliable",
            severity: "Low",
            media: "Screenshot: the map in a dense area with no rotation or detail",
            points: [
              "Orientation is confusing, and details and markings are lacking, which leads to uncertainty and mistrust.",
              "6 of 9 participants expressed frustration, yet average satisfaction on the questionnaire was 4.2 out of 5. Frustration isn't the same as dissatisfaction.",
            ],
            quotes: [
              {
                text: "The map itself doesn't rotate, so the orientation can sometimes be confusing. The arrow that shows direction can also be inaccurate, especially in areas with many buildings.",
                by: "P5",
              },
              {
                text: "Going off the Uber map, I would have assumed the spot I picked was a surface parking lot and I was getting picked up at the entrance.",
                by: "P9, waiting at the top of a parking garage",
              },
            ],
            recs: [
              "Add more detailed visuals, like satellite view, street view, and sidewalks.",
              "Introduce location selection for multi-level structures.",
            ],
          },
          {
            title: "GPS isn't accurate, which leads to mistrust",
            severity: "Low",
            media: "Screenshot: a driver marked as arrived away from the pickup pin",
            points: [
              "5 of 9 participants said the GPS wasn't followed: the driver didn't arrive at the pickup point the rider selected, which caused confusion.",
              "Riders didn't follow the suggested path either when it wasn't the quickest, and the app only offers walking directions.",
            ],
            quotes: [
              {
                text: "If the Uber app shows that the driver has arrived, I assume they believe their current location is a better spot to stop or that they may think that location is the pickup point.",
                by: "P5",
              },
            ],
            recs: [
              "Recalibrate GPS accuracy and clearly communicate how accurate it is.",
              "Improve the ideal path experience.",
              "Have a course of action to re-establish trust and safety when paths aren't followed.",
            ],
          },
          {
            title: "Side of the road is critical",
            severity: "Medium",
            media: "Screenshot: the pickup map with no street-side guidance",
            points: [
              "The app doesn't say which side of the road riders should wait on, which leads to confusion, unsafe street-crossing behavior, and traffic problems.",
              "4 of 9 participants experienced this in the study, and more said in the interview that it comes up often.",
            ],
            quotes: [
              {
                text: "I often don't know which direction the car will approach from, so I'm not sure which side of the road I should stand on.",
                by: "P6",
              },
            ],
            recs: [
              "Add explicit street-side guidance to the pickup map.",
              "Align rider and driver positioning before the driver arrives.",
            ],
          },
        ],
      },
      {
        heading: "Findings: pickup",
        title: "Finding the car takes more than the map",
        findings: [
          {
            title: "Locating the driver takes more than the map",
            severity: "Low",
            media: "Screenshot: vehicle details on the ride screen",
            points: [
              "Riders identify their ride by the vehicle's color, model, and license plate.",
              "They read road conditions and their surroundings to predict where the driver will arrive.",
              "2 of 9 riders messaged their driver during pickup.",
            ],
            recs: [
              "Provide adequate vehicle identification information.",
              "Suggest pickup points that reflect traffic flow and whether a car can actually stop there.",
            ],
          },
          {
            title: "Complex environments and driver inconsistency reduce confidence",
            severity: "Low",
            points: [
              "Drivers may not stop at the exact pickup spot. 5 of 9 participants saw this, shaped by traffic and parking availability.",
              "Intersections and busy streets make stopping unpredictable, and drivers vary in navigation and communication skills, so pickup reliability feels inconsistent.",
              "In the questionnaire, 7 of 9 riders rated their trust in the Uber system during pickup a 4 or 5. The two lower ratings, a 2 and a 3, traced back to time pressure from an off-pin pickup and to side-of-road ambiguity.",
            ],
            quotes: [
              {
                text: "The driver thought she had already arrived at the pickup point and expected me to run across the street to her, but I was still on the other side of the road.",
                by: "P5",
              },
              {
                text: "I asked if they would come to the top floor, and they declined and had me go down to the bottom floor.",
                by: "P9",
              },
            ],
            figure: {
              src: "/images/uber/trust-in-pickup.png",
              alt: "Bar chart of trust in the Uber system during pickup on a 1 to 5 scale from 9 responses: none rated 1, one rated 2, one rated 3, five rated 4, and two rated 5. The 2 is annotated as time pressure from off-pin pickup and the 3 as side-of-road ambiguity.",
              caption: "Questionnaire: trust in the Uber system during pickup, 1 to 5 (9 responses).",
              width: 2000,
              height: 690,
            },
            recs: [
              "Suggest pickup points based on traffic and safe stopping.",
              "Clarify the exact pickup location: entrance, level, and side of the street.",
              "Give drivers clearer guidance on where to stop.",
            ],
          },
          {
            title: "Inaccurate arrival signals and countdown timers add stress",
            severity: "Low",
            media: "Screenshot: the countdown timer and ETA",
            points: [
              "The ETA doesn't reflect real pickup conditions, and the app marked a driver as arrived at a red light, before the actual pickup spot.",
              "Countdown timers made riders feel rushed even when the driver was still some distance from the pickup spot.",
            ],
            quotes: [
              { text: "App countdown timer makes it more stressful.", by: "P1" },
              { text: "The pickup time estimate is not accurate.", by: "P6" },
            ],
            recs: [
              "Detect true pickup proximity more reliably.",
              "Design to reduce the pressure from countdown timers.",
            ],
          },
          {
            title: "Hidden cancellation fee logic creates anxiety",
            severity: "Low",
            media: "Screenshot: the cancellation fee prompt",
            points: [
              "Cancellation fees follow defined rules, but how they're calculated isn't apparent in the interface.",
            ],
            quotes: [
              {
                text: "The cancellation fee feels a bit unclear. I might want to cancel, but I don't know exactly when the fee starts, so I prefer to have more information about that.",
                by: "P6",
              },
            ],
            recs: [
              "Show when cancellation fees apply.",
              "Explain why fees vary, such as by location or demand.",
              "Provide a clear fee breakdown.",
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
