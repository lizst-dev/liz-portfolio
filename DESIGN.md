# Design system: "Pixel Lighthouse"

Source of truth for tokens is `app/globals.css` (`@theme`) and `app/components/ui.ts`. This file records the decisions behind them.

## Typography

| Role | Font | Weight | Where |
| --- | --- | --- | --- |
| Name | Unbounded (Google, via `next/font`) | 600 (only weight loaded) | The name in the nav pill, next to the moon-and-star logo. `font-display`. Nothing else. |
| Headings | Newsreader (Google) | 500 | All `h1`–`h3` (`font-serif` utility, set in `globals.css`; the token name is historical). |
| Body | Source Sans 3 (Google) | 400–700 | Everything else (`font-body`, the default on `body`). |

Fonts are loaded in `app/layout.tsx`.

Rules:
- Three voices: Unbounded (the name only), Newsreader (headings) and Source Sans 3 (body and UI). Unbounded is very wide and heavy, so it stays on the name; headings in it would be too loud.
- Body is 18px, line-height 1.55, no letter-spacing. Small UI text stays at 15px or above. Headings use `letter-spacing: -0.01em`.
- Tried and retired: Array Regular, Khand, and Bricolage Grotesque with Figtree (tried as one family for name and headings). Gloock, Fraunces and Inter were retired earlier. The old font files are still in `app/fonts/` but unused.

### Type scale

| Use | Size |
| --- | --- |
| Hero heading | `clamp(32px, 3.5 × --hu, 56px)` |
| Section heading | `clamp(28px, 4vw, 40px)` to `clamp(36px, 6vw, 54px)` |
| Hero paragraph | `clamp(18px, 1.6 × --hu, 22px)` |
| Body | 19px, line-height 1.5 |
| Labels and tags | 15–17px |
| Nav pill | 17px (18px from `sm`); name 14px (18px from `sm`), logo 24px (32px from `sm`) |

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
| `name` | `#3b2a4a` | The name only (in the pill). Dark plum: 12.7:1 on cream, above 3:1 (large text) over the hero sky where it sits. `#4a3358` was rejected: it drops to 2.3:1 on the darkest sky. |
| `card` | `#fff9ee` | Card fill |
| `muted` | `#6b6256` | Secondary text |
| `line` | `#dccaa9` | Borders and dividers |
| `highlight` | `#dbddff` | Marker bar under the lower half of **bold** words, on case studies that set `highlightBold` (Commit2Fit) |

## Shape and surfaces

One language for buttons, the nav pill, the hero card and menus: a flat fill, a 1px `deep` outline, and a hard offset shadow in `plum`, with no blur. Radii: buttons and controls 8px, pill, hero card and menus 12px, content cards 16px.
- Nav pill: fixed and centered, `card` cream at 90%, 3px plum shadow. It holds the moon-and-star logo, the name, Work (hover menu: `card` fill, outline, 3px plum shadow), About, and Contact as a coral button with a 2px shadow.
- Hero card: `card` cream at 90%, dark text, 5px plum shadow. Dark text replaced white text with a shadow, which had the weakest contrast on the page. It stays sticky to the bottom of the viewport and on the left edge in both scenes.
- The hero card's line reads "Previously @" followed by three logos with no company names: P&G, the full Zimmer Biomet logo (circle and wordmark; `public/images/logos/pg.png`, `zimmer-biomet.png`, `blue-origin.png`). The logos carry the company names as their alt text. The line is hidden on phones, like the old one, and the card's width cap is `52 × --hu` (760px max).
- Glass (`glass` in `ui.ts`: `bg-white/65`, white/80 border, `backdrop-blur-xl`, soft shadow) is still used by the project cards and case-study panels; it has not been moved to the outline-and-shadow style.

## Project status pills

Each project card on the home page starts its tag row with a colored status pill (`status` in `app/data/projects.ts`): Blue Origin is **Shipped** (green), Commit2Fit is **Concept** (blue) and Uber is **Research** (purple). The pill labels where the work stands in one word; the other tags still describe what it is. All three are dark text on a light tint (AA), with a second thin outline set 2px off the pill so they stand out from the plain tags. The case-study page headers do not have the pill yet.

## Diagrams

The Commit2Fit flow charts and site map are drawn in code, not as images: `app/components/Diagram.tsx` (a small SVG renderer) and `app/components/diagrams.tsx` (the three diagrams, placed by hand). They use the page's fonts, so they match the rest of the page, stay sharp at any size, and use the same box language as the buttons (rounded boxes, a dark outline, a hard plum shadow). Steps are tinted boxes, decisions are solid pills with light text, start and end points are cream pills, and Yes and No sit on small chips on the arrows. Flow 1 (reminders) is teal and flow 2 (buddy nudge) is coral, so they read as different flows; the site map keeps its original branch colors (violet Home, blue Exercises, coral Community, gray Profile) with a key. Clicking a diagram opens a larger copy (`DiagramFrame.tsx`); on phones the flow charts keep a readable minimum width and scroll sideways. The site map is allowed to break out of the text column (up to 1000px) so its labels stay readable. To add a diagram, add it to `diagrams.tsx` and set `diagram` on the image in `projects.ts`; the original PNGs are still in `public/images/commit2fit/wix/` but unused.

The case-study header shows a project without a logo (Commit2Fit) with its name in the nav-pill font (Unbounded, 30px, 40px from `sm`), a coral dot and a divider, matching the height of the other case studies' logos.

## Buttons

- Soft corners, 1px `deep` outline, small offset shadow in deep plum (`3px 3px 0 plum`) as a nod to pixel art without hard blocky edges.
- Hover raises the button (moves up-left, shadow grows). Click pushes it down with a small bounce (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- Primary: `teal-deep` fill, sand text. Secondary: `coral` fill, deep text.

## Motion

- The name lives only in the nav pill, with the moon-and-star logo (the same artwork as the tab icon, `public/images/logo-moon.png`) to its left. The big hero name and its scroll-docking animation were removed.
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
- The Seattle picture sits at its natural position like Michigan. It used to be nudged down with a navy strip on top so the big hero name cleared the Space Needle; that name is gone, so the nudge was removed.
- The hero card stays on the left in both scenes (a version that mirrored it to the right in Seattle was removed on request).
- Both scenes must have the same art-pixel size so they look identical in scale. Measured period (DFT of column/row edge energy): Michigan `hero.jpg` 3.85px, and the Seattle scene `seattle-hero-v2.jpg` (1264x832, generated by Gemini from a photo plus the Michigan hero as a style reference) 3.85px in both axes. Earlier Seattle pictures measured 4.30px (about 12% larger on screen) and were retired; `seattle-hero-v2.jpg` is the only Seattle file kept. Re-measure before adding any new scene; the hero fills by height, so a few px of extra width are simply cropped.
- Scenes must also match in detail and subject scale, not just pixel grid. Measured on `hero.jpg` vs the Gemini Seattle picture: color changes between neighboring pixels 10.8% vs 8.4% (Michigan is finer), and the main landmark is 27% of the frame height (lighthouse) vs 45% (Space Needle) in `seattle-hero-v2.jpg`, which has denser detail (13.8% vs Michigan's 10.8%) but is still zoomed in on its landmark. To match zoom, regenerate with the Needle at about 27% of the height (about 58 art pixels).
- Case study heroes (`blue-origin/hero-grid.jpg`, `uber/hero-grid.jpg`, `commit2fit/hero-grid.jpg`, 1264x832) were generated by Gemini, whose pixel size drifted (3.0–3.5px). Each was snapped to the grid with `sharp`: crop-resize to 328x216 art pixels (lanczos3), light sharpen, 96-color palette without dithering, then nearest-neighbor up to 1264x832. All measure 3.85px in both axes. The snapped versions looked mushy and were rejected; the raw Gemini images (`hero-gemini.jpg`, 1280x832, pixel size about 3.0–3.5px, so a little finer than the landing heroes) are used instead. `hero-grid.jpg` files are kept but unused. `stripeRgb` is the average of each image's bottom 6px.
- Michigan waves: an animation of the water (swells nudging the whitecaps toward the shore, with a water mask) was built and then removed; the Michigan scene is still. Reduced-motion and the flip are unaffected.
- Michigan gulls: flapping wings (two-frame sprites over a picture with the birds painted out) were built and then removed; the birds are part of the still `hero.jpg`.
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
