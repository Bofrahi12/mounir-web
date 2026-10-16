# VERTEX WEB — Cinematic Scroll Portfolio (`demo-cinema.html`)

A premium, cinematic, scroll-driven portfolio built as a 20–30 second design-reel
experience: 7 pinned/reversible film scenes, dark graphite (#07090D), electric
cobalt + soft violet + a touch of warm amber, editorial grotesk type.

**Live:** https://bofrahi12.github.io/mounir-web/demo-cinema.html

## Run it

No build step. It is one self-contained page (GSAP ScrollTrigger + Lenis via CDN,
CSS 3D for the browser mockup and cards — no WebGL, so it stays at 60fps).

```bash
# any static server, e.g.
python3 -m http.server 8000 --directory ~/workspace/mounir-web
# → http://localhost:8000/demo-cinema.html
```

Or just open the live URL above. (A React + TypeScript port would mirror the same
structure 1:1 — one component per scene: `Opening`, `Impression`, `Mood`,
`Interaction`, `Story`, `Payoff`, `Contact` — with the timelines below moved into
`useGSAP` hooks; the shipped version uses the studio's production single-file
stack so it deploys instantly to GitHub Pages.)

## The 7 scenes

| # | Scene | What happens |
|---|-------|--------------|
| 1 | Opening | Black canvas, glowing label, headline revealed line-by-line behind masks, slow halo drift |
| 2 | First Impression | Pinned: a 3D browser mockup rotates from −24° to near-flat, blur→sharp, caption pill lands |
| 3 | Visual Mood | Pinned horizontal sweep through 4 floating panels — MOOD / FORM / MOTION / STORY |
| 4 | Interaction | Card tilts toward the cursor, glow follows the pointer, detail layer reveals; magnetic button |
| 5 | Storytelling | Pinned vertical stack: 3 panels zoom through each other as the 3 story lines land |
| 6 | Payoff | “It starts feeling like an experience.” over a slow luminous glass orb with orbiting rings |
| 7 | CTA | “Create your next digital experience.”, magnetic Start-a-project button (WhatsApp), giant wordmark, footer |

## Change the brand content

- **Brand / email / WhatsApp / timing:** the `CONFIG` object at the very top of the
  `<script>` block at the bottom of `demo-cinema.html`.
- **Copy:** plain text inside each `<section class="scene">` — scenes are commented
  `SCENE 1 … SCENE 7` in the HTML.
- **CTA link:** the `#ctaStart` anchor (WhatsApp deep link) and the footer mailto.

## Change colors & fonts

All design tokens live in `:root` at the top of the `<style>` block:

```css
--bg:#07090D;  --cobalt:#2E6BFF;  --violet:#8B7CFF;  --amber:#F2A950;
--font-d:"Space Grotesk";  /* display / headlines */
--font-b:"Inter";          /* body */
```

Swap the Google Fonts `<link>` in `<head>` to change the pairing.

## Change animation timing

- **Preloader duration:** `CONFIG.timing.preloader` (seconds, skippable, hard-capped at 4s).
- **Pin lengths:** `CONFIG.timing.pinImpression / pinMood / pinStory` (×100vh of scroll).
- **Smoothness:** Lenis `lerp: 0.08` in the init block — lower = heavier/cinematic, higher = snappier.
- **Easing:** `expo.out` throughout; magnetic release uses `elastic.out(1,.45)`.

## Accessibility & performance

- `prefers-reduced-motion` → preloader hidden, all scroll animation skipped, content fully visible (calm static version).
- Semantic sections with `aria-label`s, real links/buttons, visible `:focus-visible` outlines.
- Animations use transform/opacity/filter only; heavy scenes are pinned with `scrub` (fully reversible); mobile (≤900px) stacks Scene 2, shrinks panels, disables the custom cursor.
