export type Section = {
  heading: string;
  title: string;
  numbered?: boolean;
  media?: string[];
  intro?: string;
  paras?: string[];
  bullets?: string[];
  cards?: { title: string; text: string }[];
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
  heroImage?: { src: string; width: number; height: number; alt: string; /** CSS object-position used when the image is cropped to a homepage card, e.g. "70% 50%". */ focus?: string; /** Space-separated r g b of the image's bottom edge, used to tint the striped transition. */ stripeRgb: string };
  name: string;
  /** Optional logo shown in place of the dot and name on the case study page. */
  logo?: { src: string; width: number; height: number };
  kicker: string;
  headline: string;
  tags: string[];
  role: string;
  cardSummary: string;
  stats: { value: string; label: string }[];
  meta: { label: string; value: string }[];
  note?: string;
  tldr: { label: string; text: string }[];
  sections: Section[];
  inProgress?: boolean;
};

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
    heroMedia: "Image: hero shot of the Commit2Fit app screens with the exercise cards",
    name: "Commit2Fit",
    kicker: "UX case study · Health and wellness",
    headline: "Helping adults stick to their at-home physical therapy plans",
    tags: ["Mobile app", "Health and wellness"],
    role: "UX designer and researcher · 10 weeks",
    cardSummary:
      "A B2C mobile app that pairs habit-stacking cards with community accountability to help adults stick to their at-home physical therapy plans.",
    stats: [
      { value: "50M+", label: "U.S. adults in PT each year" },
      { value: "30–50%", label: "stick to at-home exercises" },
      { value: "10 weeks", label: "Fall 2025" },
      { value: "4", label: "person team" },
    ],
    meta: [
      { label: "Role", value: "UX designer and researcher" },
      { label: "Team", value: "Raquel Eisele, Molly Dicke, Hayley Stout, and me" },
      { label: "Project", value: "UW HCDE group project, Fall 2025" },
    ],
    tldr: [
      {
        label: "Problem",
        text: "Over 50 million U.S. adults go to physical therapy each year, and only about 30 to 50 percent stick to their at-home exercises, which reduces recovery outcomes.",
      },
      {
        label: "Solution",
        text: "A set of cards and a companion app that use habit stacking and community accountability.",
      },
      {
        label: "Impact",
        text: "Better consistency and motivation outside the clinic should improve adherence and support faster, more effective recovery.",
      },
    ],
    sections: [
      {
        heading: "Problem",
        title: "Going to PT is the easy part. Doing the exercises is hard",
        numbered: true,
        paras: [
          "Adults with physical limitations turn to physical therapists to improve, but many struggle to move from the first appointment to the improvement they're after. Three things stood out.",
        ],
        cards: [
          {
            title: "Going to PT isn't improvement",
            text: "Patients have a hard time turning appointments into results at home.",
          },
          {
            title: "Recovery can be lonely",
            text: "People rehabilitating an injury rarely know others going through the same thing at the same time, which leads to frustration and uncertainty about progress.",
          },
          {
            title: "Changing routine is hard",
            text: "Many people struggle to start and keep up their exercises, and there are no PT-specific resources that reduce the mental load of fitting them into an existing routine.",
          },
        ],
      },
      {
        heading: "Design question",
        title: "One question guided the project",
        paras: ["How might we help adults effectively complete at-home therapy routines to achieve their desired outcomes?"],
      },
      {
        heading: "Research",
        title: "Motivation, goals, and know-how kept coming up",
        numbered: true,
        media: ["Image: affinity map from the interviews and 29-response survey"],
        paras: [
          "With two weeks for UX research, we ran semi-structured interviews with two physical therapists and three former physical therapy patients, a 29-respondent survey, and secondary research, then synthesized with affinity mapping.",
        ],
        cards: [
          {
            title: "Motivation",
            text: "Lack of motivation is a common thread among people with home exercise plans. We responded with habit stacking and community accountability.",
          },
          {
            title: "Goals",
            text: "Clear goals and exercise expectations were mentioned often as motivating. We responded with milestones and progress tracking toward personal goals.",
          },
          {
            title: "How and why",
            text: "Knowing how to do each exercise, and why, is motivating because it shows the difference it makes. We responded with directions in multiple modalities.",
          },
        ],
      },
      {
        heading: "Ideation and archetypes",
        title: "From 29 ideas to two kinds of patient",
        media: ["Image: sketches from the brainstorm, with the 10 themes", "Diagram: the Goal Motivated and Community Seeker archetypes"],
        paras: [
          "We held a brainstorming session where each of us sketched solutions, then grouped 29 ideas into 10 themes. From there we focused on three directions: a card that educates and connects to existing technology, an alarm clock that alerts the patient in their environment, and a light that connects communities of patients.",
          "Two archetypes shaped the work. The Goal Motivated patient needs a target and a way to track progress, and measures success by seeing a number improve. The Community Seeker prefers group activities, wants more fun in exercise, and needs trust with their therapist and external support to get started.",
          "We pivoted away from the initial concept, but every feature we explored in those early use cases ended up in the final product.",
        ],
      },
      {
        heading: "Solution",
        title: "Cards and an app that fit exercise into the day",
        numbered: true,
        media: ["Animation: setting up a habit stack in the companion app", "Image: exercise cards with muscle-group colors", "Image: community screens with buddy challenge and leaderboard", "Image: goal screen with the daily progress ring", "Image: information architecture and style guide"],
        paras: [
          "Commit2Fit is a set of exercise cards and a companion app. Each accent color is tied to a muscle group (legs, back, arms, chest, abdominals), so patients know at a glance what a card targets.",
        ],
        cards: [
          {
            title: "Adapting exercises into routines",
            text: "Habit stacking links new exercises to existing habits, like brushing teeth or brewing morning coffee. Opt-in notifications are customizable by exercise, time or location, repetition, and early reminders.",
          },
          {
            title: "Accountability through community",
            text: "Opt-in, PT-focused groups with daily buddy challenges, a daily leaderboard, an encouragement feed, and progress and goal sharing.",
          },
          {
            title: "Confidence through education",
            text: "Simple physical and digital cards, handed out by the PT in small sets to avoid overwhelm. A QR code opens the digital version, with written, video, and audio guidance plus form tips and frequency and duration.",
          },
          {
            title: "Motivation through personal goals",
            text: "Goals tied to an activity patients want to return to, with lifetime stats, a progress ring that updates daily, milestones that break big goals into short-term targets, and a view of friends' goals.",
          },
        ],
      },
      {
        heading: "Impact",
        title: "Better consistency outside the clinic",
        paras: [
          "By improving consistency and motivation outside the clinic, Commit2Fit aims to improve adherence to at-home physical therapy plans and support faster, more effective recovery.",
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
