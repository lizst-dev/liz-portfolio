# Uber header: Higgsfield brief

A looping header for the Uber case study: a rider walks to the curb, a car pulls in, the rider gets in, the car drives off. Flat vector look, in the spirit of Uber's own illustrations.

## Style references
Use the three images from the brief as style references (Uber brand illustration collage, the pastel city with the yellow taxi, the Uber Eats scooter scene). Key traits: flat shapes with no outlines, no gradients or texture, periwinkle / mint / navy palette with one warm accent, simple rounded buildings with window grids, a clean stripe of road.

## Step 1: make the start frame
Generate this still first (Nano Banana / Gemini / any image model, with the references attached), then use it for image-to-video. It is also the end frame, which is what makes the loop seamless.

> Flat vector illustration, side view, 16:9. An empty city street in the style of Uber's brand illustrations. Back row of rounded buildings in soft periwinkle and pale lavender with window grids, one mint glass tower with a white grid, a few pale clouds in a cream sky. A navy-blue road with a dashed cream center line, and in front of it a light periwinkle sidewalk with a curb edge. One round dark-green tree and one slim navy street lamp stand on the sidewalk. On the curb, left of center, a glowing mint pickup spot with a small black map pin hovering above it. No car, no people. Clean flat shapes, no outlines, no gradients, no texture, no text, no logos. Palette: periwinkle #b9c2f5, lavender #dfe3fc, mint #8fe0c4, navy #3b4a96, ink #1d2a66, cream #f6f2eb, coral accent #e87a6e.

**Composition for the crop:** the header on the site is wide and short, so the top of the frame gets cropped. Keep everything important (road, curb, car, rider) in the bottom 55% and the middle 70% of the width. Sky and rooftops can be cropped without losing anything.

## Step 2: image-to-video
- **Start and end frame:** the still from step 1 (set it as both first and last frame if available).
- **Model:** Seedance 2.0 (or newest available). **16:9**, 1080p, **10 s**. Generate 4+ takes.
- **Camera:** completely locked-off. No pan, zoom or shake.
- **Audio:** off.

### Prompt
> Locked-off 2D flat vector animation in the style of Uber's brand illustrations, side view, the camera never moves. Beat by beat: (0-2.5 s) a young rider in a coral top and yellow pants with a navy backpack walks in from the left along the sidewalk, looking at a phone, and stops on the mint pickup spot under the black map pin. (2.5-4.5 s) a mint-green sedan with a dotted navy stripe glides in from the left along the road and brakes smoothly at the curb beside the rider, the body dipping slightly as it stops. (4.5-6.5 s) the rear door swings open, the rider steps in and sits down, the door closes. (6.5-9 s) the car pulls away to the right and drives out of frame. (9-10 s) the street is empty again, exactly like the first frame, the pin and pickup spot glowing. Smooth, weighty, character-animation timing with natural easing, a real walk cycle with arm swing, wheels turning, a soft shadow under the car. Flat colors, no outlines, no gradients, no texture, no camera movement. Palette: periwinkle, lavender, mint, navy, cream, with coral and yellow only on the rider.

### Negative prompt
Camera movement, zoom, pan, 3D render, photorealism, gradients, outlines, shading, texture, text, logos, brand marks, extra people, extra cars, morphing shapes, changing building layout, color shifts, flicker, motion blur.

## Seamless loop
- Prefer a **start/end frame** with the same image.
- Otherwise I will cross-fade the last ~1 s into the first ~1 s (works because both are the empty street).
- Pick the take where the rider clearly enters the car and the buildings never change.

## Hand-off
Save the clips in `public/images/uber/header/` (any filenames). I will trim, loop, encode MP4 + WebM (target under 3 MB), export a poster still, and switch on the video header for `uber` in `app/data/projects.ts`. Until then the page shows the current still header.

## Notes
- If a take is almost right, tell me the timestamp and what is off (rider fades instead of sitting, car overshoots the curb, background shifts) and rewrite only that beat.
- The Uber logo is not shown in the scene on purpose. Keep it out of the prompt.
