# Fluid Scrollytelling Landing Page — Design Spec

**Date:** 2026-05-18
**Scope:** Full landing page redesign — Kinetic Narrative with scroll-driven animations
**Stack:** Next.js 16, React 19, CSS keyframes, Canvas 2D (existing) — no new dependencies

---

## 1. Design Philosophy

The landing page transforms from a static "precision instrument" into a **continuous kinetic narrative**. Every element's visibility, position, and intensity are bound to scroll progress. The user scrolls through a story: entering orbit → discovering systems → choosing methodology → docking.

**Three pillars:**
- **Scroll as timeline** — `useScrollProgress` 0→1 drives all motion, not one-shot reveals
- **Mouse as atmosphere** — cursor position modulates parallax depth and light intensity
- **Sections as chapters** — no hard boundaries, content flows seamlessly

---

## 2. Global Systems

### 2.1 Mouse-Driven Parallax

Three depth layers, each offset by cursor position:

| Layer | Content | Parallax Factor |
|---|---|---|
| Deep Space | Star field, nebula glows | 0.02× |
| Instrument | Section content, cards, text | 0.04× |
| Interface | Light effects, spotlight, dust | 0.08× |

Implementation: `mousemove` listener computes `(clientX - vw/2, clientY - vh/2)`, applies `translate()` to each layer container via rAF.

### 2.2 Scroll-Driven Background

Star field density and color shift with scroll progress:

| Scroll % | Star Density | Color Bias |
|---|---|---|
| 0–20% (Hero) | Sparse (60 stars) | Blue-white |
| 20–60% (Features→Methods) | Dense (100 stars) | Blue-amber mix |
| 60–100% (Focus→CTA) | Medium (80 stars) | Amber dominant |

Implementation: `LandingLightEffects` reads global scroll progress, adjusts star opacity and color via CSS custom properties.

### 2.3 Section Transitions

No hard dividers. Sections overlap by ~10vh:

- Outgoing section: `opacity(1 - p)` + `translateY(p * -60px)` where p = local progress 0.7→1.0
- Incoming section: `opacity(p)` + `translateY((1-p) * 40px)` where p = local progress 0.0→0.3
- DecorativeArrow replaced by a **light beam track** — a horizontal SVG line that "draws in" as the user scrolls through the transition zone

### 2.4 Light Atmosphere Shift

Mouse spotlight color temperature changes per section:

| Section | Spotlight Color | Intensity |
|---|---|---|
| Hero | Blue-white `rgba(59,130,246,.06)` | 0.06 |
| Features | Blue `rgba(59,130,246,.08)` | 0.08 |
| Methods | Amber `rgba(245,158,11,.06)` | 0.06 |
| Focus | Violet `rgba(99,102,241,.06)` | 0.06 |
| CTA | Amber-white `rgba(245,158,11,.08)` | 0.08 |

---

## 3. Section Designs

### 3.1 Hero Section

**Current:** Static glyphs, logo, tagline, CTA buttons with one-shot fade-in.
**New:** Scroll-driven particle dispersal and reformation.

**Scroll choreography (0→1):**

| Progress | Event |
|---|---|
| 0.0–0.1 | Initial state: logo centered, glyphs floating, tagline visible |
| 0.1–0.3 | Glyphs scatter outward (translateX/Y based on glyph position relative to center, ±80px) |
| 0.3–0.5 | Logo rises `translateY(-60px)` and scales down `0.85×`, tagline fades out |
| 0.5–0.7 | Scattered glyphs reform into 3 clusters (matching Features section's 3 cards) |
| 0.7–1.0 | Clusters stabilize, CTA fades out, Features cards begin to appear |

**Mouse interaction:**
- Glyphs: cursor proximity causes subtle push-away (30px radius, cubic falloff)
- Logo: breathing glow intensifies when cursor is within 200px

**Key CSS transforms (per glyph):**
```
translateX(scatterX * progress * 80px)
translateY(scatterY * progress * 80px)
opacity(1 - progress * 0.8)
scale(1 - progress * 0.15)
```

### 3.2 OrbitEngineDemo (Features)

**Current:** 3 cards with one-shot staggered fade-in.
**New:** Cards fly in from three directions with scroll-linked entrance.

**Scroll choreography (0→1):**

| Progress | Event |
|---|---|
| 0.0–0.2 | Cards off-screen: left card at `translateX(-120px)`, center at `translateY(80px)`, right at `translateX(120px)` |
| 0.2–0.5 | Cards slide in with elastic easing, staggered 0.1s per card |
| 0.5–0.8 | Card content reveals: title → description → icon (staggered opacity) |
| 0.8–1.0 | Cards settle, hover effects activate |

**Mouse interaction:**
- Cards: `perspective(800px) rotateX(mouseY * 3deg) rotateY(mouseX * 3deg)` — subtle 3D tilt
- Card icons: parallax offset `±4px` from card body

### 3.3 MethodologyCards

**Current:** 6 cards with staggered fade-in from bottom.
**New:** Cards fan out from a central point, then settle into grid.

**Scroll choreography (0→1):**

| Progress | Event |
|---|---|
| 0.0–0.15 | Cards stacked at center, slight rotation offset per card (±5°) |
| 0.15–0.5 | Cards fan out: each card translates to its grid position, rotation → 0° |
| 0.5–0.7 | Card content fades in (staggered per card, 0.08s each) |
| 0.7–1.0 | Method-specific glow pulses once on each card |

**Mouse interaction:**
- Hover: card lifts `translateY(-4px)`, border glows with method color
- Hover icon: method color box-shadow pulse

### 3.4 FocusBlocksDemo

**Current:** Static SVG clock with animated arcs.
**New:** Arcs draw in progressively with scroll.

**Scroll choreography (0→1):**

| Progress | Event |
|---|---|
| 0.0–0.3 | Clock housing fades in, tick marks appear |
| 0.3–0.8 | Arcs progressively draw: `stroke-dashoffset` from full to 0, proportional to progress |
| 0.8–1.0 | Legend items fade in (staggered 0.1s each), hub glow activates |

**Mouse interaction:**
- Hovering an arc highlights it (opacity 1.0) while dimming others (0.3)

### 3.5 KeyboardNav

**Current:** Cards with staggered scale+fade entrance.
**New:** Cards bounce in with spring physics.

**Scroll choreography (0→1):**

| Progress | Event |
|---|---|
| 0.0–0.2 | Cards below viewport, `translateY(60px)` + `rotate(-2°)` |
| 0.2–0.5 | Cards spring in: `cubic-bezier(0.34, 1.56, 0.64, 1)` overshoot |
| 0.5–0.7 | Key labels appear with subtle scale bounce |
| 0.7–1.0 | Cards settle, hover effects activate |

### 3.6 CTASection

**Current:** Static rotating crosses and title.
**New:** Converging light beams + typewriter title + pulsing CTA.

**Scroll choreography (0→1):**

| Progress | Event |
|---|---|
| 0.0–0.2 | Background: 4 light beams from corners, initially diverged |
| 0.2–0.5 | Beams converge toward center as scroll progresses |
| 0.5–0.7 | Title characters appear one by one (opacity + translateY per char) |
| 0.7–0.9 | CTA button fades in with scale(0.95→1.0) |
| 0.9–1.0 | Button glow pulse activates, beams reach full convergence |

**Mouse interaction:**
- Beam angles subtly shift toward cursor position (±5° rotation)

---

## 4. Technical Architecture

### 4.1 Hook: `useScrollProgress`

Already exists at `src/hooks/useScrollProgress.ts`. Returns `{ ref, progress, isVisible }` where progress is 0→1. Each section component will use this hook instead of `useReveal`.

### 4.2 Hook: `useMousePosition` (new)

```ts
// Returns normalized mouse position { x: -1..1, y: -1..1 }
// relative to viewport center, updated via rAF
function useMousePosition(): { x: number; y: number }
```

Single shared listener. Components read the value via ref (not state, to avoid re-renders).

### 4.3 Component: `ScrollParallax` (new)

Wrapper component that applies parallax transform to children based on mouse position:

```tsx
<ScrollParallax factor={0.04}>
  <SectionContent />
</ScrollParallax>
```

### 4.4 CSS Strategy

- Scroll-driven transforms: inline `style` bound to `progress` value (same pattern as current, but more transforms per element)
- Keyframe animations: used only for ambient loops (star twinkle, dust float, glow pulse)
- Transition timing: `cubic-bezier(0.16, 1, 0.3, 1)` for reveals, `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring bounces

### 4.5 Performance

- All scroll handlers use `requestAnimationFrame` throttling
- Parallax transforms use `will-change: transform` on layer containers
- Mouse position tracked via ref (no React re-renders)
- IntersectionObserver used to pause animations for off-screen sections

---

## 5. Files to Modify

| File | Change |
|---|---|
| `src/hooks/useScrollProgress.ts` | Add `useMousePosition` hook |
| `src/components/landing/LandingLightEffects.tsx` | Scroll-driven density/color shifts, mouse parallax layer |
| `src/components/landing/HeroSection.tsx` | Full scroll choreography: scatter, reform, fade |
| `src/components/landing/OrbitEngineDemo.tsx` | Scroll-driven card entrance from 3 directions |
| `src/components/landing/MethodologyCards.tsx` | Fan-out animation, scroll-linked glow |
| `src/components/landing/FocusBlocksDemo.tsx` | Progressive arc drawing |
| `src/components/landing/KeyboardNav.tsx` | Spring bounce entrance |
| `src/components/landing/CTASection.tsx` | Converging beams, typewriter title |
| `src/app/(landing)/page.tsx` | Replace SectionArrow with light beam tracks, add mouse parallax wrapper |
| `src/app/globals.css` | New keyframes, transition classes, section overlap styles |

---

## 6. Verification

1. `pnpm build` — no errors
2. Scroll through entire page — every section has continuous scroll-linked motion
3. Move mouse — parallax visible on all three depth layers
4. Scroll back up — all animations reverse smoothly
5. Check performance — 60fps on mid-range hardware (no jank)
6. Mobile — parallax disabled (touch devices), scroll animations still work
