# Blue Origin header: Higgsfield brief

## Setup
- **Start frame:** the reference image (powder bed, glowing laser trace on a bladed impeller). Use image-to-video.
- **Model:** Seedance 2.0 (or newest available). **16:9**, 1080p, **8-10 s**. Generate 4+ takes.
- **Camera:** completely locked-off. No push-in, pan or shake. This is what makes a loop possible.
- **Audio:** off.

## Prompt
> Locked-off macro shot through the viewing window of a laser powder bed fusion metal 3D printer. Dark gray metal powder fills the build chamber. A turbopump impeller with curved blades sits half-buried in the powder, centered in frame. A bright orange-white laser spot traces the top cross-section of the impeller, leaving a thin glowing line that cools from white-hot to orange to dark gray. Fine golden sparks and a faint wisp of smoke rise from the melt point. Between passes, a flat recoater blade sweeps a fresh smooth layer of powder across the bed, and the laser resumes. The camera does not move. Shallow depth of field, soft out-of-focus powder in the foreground corners, a hint of the dark metal window frame at the extreme edges only. Neutral gray and graphite palette; the only warm color is the laser glow. Photorealistic, industrial, cinematic, matte metal texture.

## Negative prompt
Camera movement, zoom, people, text, logos, branding, printer exterior, buttons, screens, blue light, color grading shifts, flicker, morphing geometry.

## Seamless loop
- Prefer a **start/end frame** option if available: set the same image as both first and last frame.
- Otherwise I will make the loop by cross-fading the last ~1 s into the first ~1 s.

## Hand-off
Save the clips in `public/images/blue-origin/header/` (any filenames). I will trim, loop, encode MP4 + WebM (target under 3 MB), export a poster still, and enable `headerImage` + `headerVideo` for `blue-origin` in `app/data/projects.ts`.

## Notes
- The impeller is generic, not modeled on any Blue Origin part (NDA / ITAR).
- Palette is kept neutral. If a tint is needed, use the site teal (#3b8e85) or coral (#e87a6e) sparingly, in grading only.
