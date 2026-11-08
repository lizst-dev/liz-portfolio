# Design system: "Pixel Lighthouse"

Source of truth for tokens is `app/globals.css` (`@theme`) and `app/components/ui.ts`. This file records the decisions behind them.

## Typography

| Role | Font | Weight | Where |
| --- | --- | --- | --- |
| Name | Unbounded (Google, via `next/font`) | 600 (only weight loaded) | Hero name and the name docked in the nav pill. `font-display`. Nothing else. |
| Headings | Array Regular (local OTF) | 400 | All `h1`–`h3`, including the hero card heading (`font-serif` utility, set in `globals.css`). Regular only: heavier cuts and Array Wide have a heavy dot texture that looks rough. |
| Body | Khand (local OTF) | 300–700 | Everything else (`font-body`, the default on `body`). |

Font files live in `app/fonts/` and are loaded in `app/layout.tsx`.

Rules:
- Array is built from dots. Regular keeps that subtle at heading sizes; heavier weights and the Wide cut read as noisy dot matrix, and above about 80px it is dotted at any weight, so never use it for the big name.
- Khand is condensed and runs small, so body is 19px (not 16px) and small UI text starts at 15px. Don't go below 15px.
- Three voices only: Unbounded (name), Array Regular (headings), Khand (body).
- Headings use `letter-spacing: -0.02em`. The name uses normal tracking.

### Type scale

| Use | Size |
| --- | --- |
| Hero name | `clamp(30px, 7.4 × --hu, 120px)` |
| Hero heading | `clamp(32px, 3.5 × --hu, 56px)` |
| Section heading | `clamp(28px, 4vw, 40px)` to `clamp(36px, 6vw, 54px)` |
| Hero paragraph | `clamp(18px, 1.6 × --hu, 22px)` |
| Body | 19px, line-height 1.5 |
| Labels and tags | 15–17px |
| Nav pill | 17px (18px from `sm`); docked name 14px (18px from `sm`) |

`--hu = min(1vw, 1.75svh)` is the hero scale unit. The name, the hero card text, its padding and its width all scale from it, so the hero keeps its proportions on short laptop screens as on tall ones.

## Color tokens

| Token | Hex | Use |
| --- | --- | --- |
| `page` | `#fffcf3` | Page background (single flat color) |
| `fade` | `#f9edd3` | Bottom of the hero image fades from this to `page` |
| `sand` | `#f6e6cb` | Light accents, hover fills, text on dark buttons |
| `dusk` | `#6c4e7e` | Link hover, pointer glow |
| `plum` | `#4a3358` | Button offset shadow |
| `teal` / `teal-deep` | `#3b8e85` / `#2c6e67` | Accents / filled buttons (`teal-deep` passes AA with sand text) |
| `coral` | `#e87a6e` | Secondary button, highlights |
| `deep` | `#1c2927` | Text, outlines |
| `name` | `#3b2a4a` | The name only (hero and docked in the pill). Dark plum: 12.7:1 on cream, above 3:1 (large text) over the hero sky where it sits. `#4a3358` was rejected: it drops to 2.3:1 on the darkest sky. |
| `card` | `#fff9ee` | Card fill |
| `muted` | `#6b6256` | Secondary text |
| `line` | `#dccaa9` | Borders and dividers |

## Shape and surfaces

- Radii: controls 8px, cards 16px, pills fully round.
- Glass (`glass` in `ui.ts`): `bg-white/65`, white/80 border, `backdrop-blur-xl`, soft card shadow. Used for cards.
- Nav: floating frosted pill, fixed and centered. No header bar.
- Hero card: translucent gradient with `backdrop-blur-[20px]`, sticky to the bottom of the viewport.

## Buttons

- Soft corners, 1px `deep` outline, small offset shadow in deep plum (`3px 3px 0 plum`) as a nod to pixel art without hard blocky edges.
- Hover raises the button (moves up-left, shadow grows). Click pushes it down with a small bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- Primary: `teal-deep` fill, sand text. Secondary: `coral` fill, deep text.

## Motion

- Name docking: scrolling shrinks the hero name in proportion and carries it up into the nav pill, where it stays docked. It is scroll-linked, so it stays on under reduced motion. Logic in `app/components/HeroName.tsx`.
- Case study pages: scroll-progress bar, side tracker, scroll-in reveals (CSS scroll-driven animation, progressive enhancement).
- Reduced motion turns off transitions.

## Characters

Pixel-art character illustrations (source: `Documents/jobs/Portfolio/Sources/Character/`, white-background JPEGs). Cutouts with transparent backgrounds live in `public/images/characters/` (`hi`, `daydreaming`, `desk`, `ori`, `baking`).

- Placement: "daydreaming" sits on top of the first project card. The dog character ("ori") sits in the gap between the heading and the body text in About (bottom aligned with the body text, which sits to the right). Tried and rejected: a row of three standing characters in About, and the full hiking scene as an About background (smooth left fade, pixel-dither top and left).
- Keep it light: one character moment per section, never overlapping text, all decorative (`alt=""`). 
- Cutouts not currently used: `hi` (waving; removed from the footer), `desk`, `baking`. The hiking scene is not in the project.

## Hero toggle: Michigan grown / Seattle based

A two-segment toggle at the top right of the landing hero (below the nav pill on screens under 1280px) switches the hero scene: "Michigan grown" (default, the lighthouse) and "Seattle based" (the skyline, `public/images/seattle-hero-sky.jpg`). It is styled like the buttons: 8px radius, 1px `deep` outline, plum offset shadow, raise on hover, bounce on press; the selected segment is filled `teal-deep` with sand text.

- Switching plays a split-flap transition (`app/components/HeroScene.tsx`, drawn in WebGL): the hero is cut into small flaps (about 48px, with a thin seam at each hinge). Every tile flips once, in a steady wave from left to right (0.9s spread, 0.2s per half flap, a little randomness), and the whole change takes about 1.7s. Earlier versions with shuffled multi-flip cards, straggler tiles, and letter flipping were tried and dropped as too much. Reduced motion switches instantly. The canvas sits beneath the hero's bottom fade.
- Over the Seattle skyline the dark plum name is unreadable, so the name fades to cream with a soft shadow and eases back to plum as it docks into the nav pill. The name itself stays still: `--tone` is a registered number property in `globals.css` that transitions from 0 to 1 over 1.4s when the scene changes.
- Also in Seattle mode the picture is nudged down (7% of the viewport height on phones, 11% on desktop; the gap on top is filled with the picture's own navy `#0f1745`, and the flip canvas applies the same shift) so the name, which stays at the same height as in the Michigan scene, mostly clears the Space Needle's spire.
- In Seattle mode the hero card (`.hero-card`, a slim card that wraps its content on `sm` and up: heading on two lines, one line naming employers, and the two buttons; full width on phones) mirrors to the right edge of the hero with the same padding as on the left (measured exactly equal at 1440px wide; it uses `cqw` and the card's own width, so it works at any card width), so the Space Needle on the left is uncovered. It slides with a spring; desktop only. The card's container has `md:pb-24` so that when the card comes to rest at the end of the hero it stays about 30px above the head of the daydreaming character sitting on the first project card.
- Both scenes must have the same art-pixel size so they look identical in scale. Measured period (DFT of column/row edge energy): Michigan `hero.jpg` 3.85px, and the Seattle scene `seattle-hero-v2.jpg` (1264x832, generated by Gemini from a photo plus the Michigan hero as a style reference) 3.85px in both axes. Earlier Seattle pictures measured 4.30px (about 12% larger on screen) and were retired; `seattle-hero-v2.jpg` is the only Seattle file kept. Re-measure before adding any new scene; the hero fills by height, so a few px of extra width are simply cropped.
- Scenes must also match in detail and subject scale, not just pixel grid. Measured on `hero.jpg` vs the Gemini Seattle picture: color changes between neighboring pixels 10.8% vs 8.4% (Michigan is finer), and the main landmark is 27% of the frame height (lighthouse) vs 45% (Space Needle) in `seattle-hero-v2.jpg`, which has denser detail (13.8% vs Michigan's 10.8%) but is still zoomed in on its landmark. To match zoom, regenerate with the Needle at about 27% of the height (about 58 art pixels).
- Case study heroes (`blue-origin/hero-grid.jpg`, `uber/hero-grid.jpg`, `commit2fit/hero-grid.jpg`, 1264x832) were generated by Gemini, whose pixel size drifted (3.0–3.5px). Each was snapped to the grid with `sharp`: crop-resize to 328x216 art pixels (lanczos3), light sharpen, 96-color palette without dithering, then nearest-neighbor up to 1264x832. All measure 3.85px in both axes. The snapped versions looked mushy and were rejected; the raw Gemini images (`hero-gemini.jpg`, 1280x832, pixel size about 3.0–3.5px, so a little finer than the landing heroes) are used instead. `hero-grid.jpg` files are kept but unused. `stripeRgb` is the average of each image's bottom 6px.
- The choice is not remembered; every visit starts on Michigan.

## Accessibility

- Text contrast meets AA on `page`; filled buttons use `teal-deep`.
- Visible focus ring on every interactive element.
- Placeholders for missing images or animations are labeled with what belongs there.

## Avoid

- Hard, blocky pixel shadows and pixel display fonts (tried and rejected).
- A purple header bar.
- Gloock, Fraunces and Inter (retired).
- Dot-matrix type (Array) at hero size.
