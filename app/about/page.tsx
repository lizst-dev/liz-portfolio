import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";
import {
  btnPrimary,
  btnSecondary,
  EMAIL,
  glass,
  RESUME,
} from "../components/ui";

export const metadata: Metadata = {
  title: "About — Liz Stolnicki",
  description:
    "My path to UX came through my engineering background: several years as a Mechanical and Additive Manufacturing Process Engineer in the medical device and aerospace industry.",
};

const skills = [
  {
    label: "Design",
    items: [
      "UX / Product Design",
      "Systems Design",
      "Information Architecture",
      "Interaction Design",
      "Prototyping",
    ],
  },
  {
    label: "Research",
    items: [
      "User Interviews",
      "Usability Testing",
      "Requirements Definition",
      "Affinity Mapping",
      "Stakeholder Research",
    ],
  },
  {
    label: "Technical",
    items: [
      "React / HTML / CSS",
      "Supabase / Databricks",
      "API Integrations",
      "Secure Touchpoints / Data Storage",
      "Relational DBs / Automations",
      "Project Management",
    ],
  },
  {
    label: "Additional Tools",
    items: [
      "Jira",
      "Confluence",
      "Figma",
      "Google / MS Suites",
      "Tableau",
      "Airtable / Baserow",
      "AutoDesk Inventor",
      "Adobe Illustrator",
      "3D CAD (SolidWorks, Creo)",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main id="top" className="mx-auto max-w-page px-6 pb-24 pt-32">
        <div className="grid gap-12 md:grid-cols-[1fr_340px] md:items-start">
          <div className="max-w-[680px]">
            <h1 className="mb-6 font-serif text-[clamp(36px,6vw,64px)] leading-[1.05]">
              Hi! I’m Liz :)
            </h1>
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 font-serif text-[clamp(24px,3vw,30px)] leading-[1.1]">
                  Mechanical Engineering → UX Design
                </h2>
                <p>
                  My path to UX came through my engineering background. I spent
                  several years as a Mechanical and Additive Manufacturing
                  Process Engineer in the medical device and aerospace industry,
                  working at the intersection of technical complexity and the
                  humans who operate within it. I loved working on enterprise
                  level systems, building entire toolkits for use in various
                  contexts by people in many different roles. Working on my
                  product development project at Blue Origin led me to my formal
                  education in the user centered design space, and I am loving
                  learning how to fully leverage my engineering background and
                  apply it to the UX realm.
                </p>
              </section>
              <section>
                <h2 className="mb-3 font-serif text-[clamp(24px,3vw,30px)] leading-[1.1]">
                  Driven by being the user
                </h2>
                <p>
                  I&apos;m currently completing my UX education at the
                  University of Washington in the Human Centered Design &amp;
                  Engineering (HCDE) Masters&apos; Program. I am driven by
                  knowing that I have been the user and understand the
                  frustrations. I&apos;ve stood on a loud factory floor trying
                  to log data through three browser tabs in gloves. I’ve been
                  looking for information on my health and don’t know where to
                  find it or how to apply the information I find. I know what it
                  costs when a system fails the people who depend on it. I also
                  know how to translate this understanding into developing
                  something better.
                </p>
              </section>
              <section>
                <h2 className="mb-3 font-serif text-[clamp(24px,3vw,30px)] leading-[1.1]">
                  Complex systems are super exciting
                </h2>
                <p>
                  I love challenging myself and working within mobile and web
                  application development, especially with complex systems. I am
                  so intrigued by products where the stakes are real, the user
                  needs are layered, and the design decisions have downstream
                  impact. I&apos;m drawn to B2B and enterprise contexts, health
                  and wellness, and anywhere that dense information needs to
                  become something a person can actually digest and practically
                  use. I&apos;m looking for work where I can stay, grow, and
                  contribute to work that matters over time.
                </p>
              </section>
              <section>
                <h2 className="mb-3 font-serif text-[clamp(24px,3vw,30px)] leading-[1.1]">
                  I love a hobby
                </h2>
                <p>
                  Outside of work, I&apos;m interested in baking, biomechanics,
                  sports performance (especially the Olympics!!), knitting,
                  drawing, reading, and the intersection of data and physical
                  wellbeing. I also love my dog, exploring the PNW with my
                  husband, and traveling the world for the best food.
                </p>
              </section>
            </div>
          </div>
          <div className="pixel-frame mx-auto w-full max-w-[340px] md:mx-0 md:self-start">
            <Image
              src="/images/about-walk.jpg"
              alt="Pixel art of Liz and a partner walking hand in hand through a wildflower meadow with snowy mountains behind them"
              width={896}
              height={1195}
              quality={90}
              sizes="(min-width: 768px) 340px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        <section aria-labelledby="skills-h" className="mt-20">
          <h2
            id="skills-h"
            className="mb-8 flex items-center gap-3 font-serif text-[clamp(28px,4vw,40px)] leading-[1.1]"
          >
            <span
              aria-hidden="true"
              className="inline-block h-6 w-1.5 shrink-0 rounded-full bg-teal"
            />
            Skills
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((s) => (
              <div key={s.label} className={`${glass} p-6`}>
                <h3 className="mb-3 font-serif text-[24px] leading-[1.1]">
                  {s.label}
                </h3>
                <ul className="space-y-1">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="shy-h" className="mt-16 max-w-[680px]">
          <h2
            id="shy-h"
            className="mb-4 font-serif text-[clamp(28px,4vw,40px)] leading-[1.1]"
          >
            Don’t be shy!
          </h2>
          <p className="mb-6">
            Interested in working together? Want to talk sports? Have you had
            the best meal of your life recently? Want to just say hi? Reach out
            and I will be in touch shortly. I can’t wait to hear from you!
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={`mailto:${EMAIL}`} className={btnPrimary}>
              Get in touch
            </a>
            <a
              href={RESUME}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecondary}
            >
              Resume
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
