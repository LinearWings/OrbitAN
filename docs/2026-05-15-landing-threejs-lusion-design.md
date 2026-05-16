# Landing Page Three.js Upgrade — Lusion-Inspired 3D Orbital Control Station

**Date**: 2026-05-15
**Status**: Approved
**Reference**: https://lusion.co/ , https://labs.lusion.co/ , https://exp-gemini.lusion.co/style
**Tech decision**: Introduce Three.js (~140KB gzipped) as Hero section rendering layer. Sections 2-4 remain pure CSS/HTML. Zero other new dependencies.

---

## 0. Design Philosophy

Translating Lusion's design DNA into OrbitAN's deep-space orbital control station:

| Lusion Technique | OrbitAN Translation |
|---|---|
| Word-by-word scroll animation | H1 title stagger fade-in + ghost clone layer |
| Text dual-layer (text + text-clone) | Title ghost clone: 3px down + 4px right, rgba(59,130,246,0.08) |
| Typography-as-Architecture (103.6px, -2px ls) | Bigger Clash Display H1, tighter letter-spacing |
| 3 Canvas atmospheric layers | Single Three.js scene with layered rendering |
| Experiment numbering EXP 001 | Mission Log #00X numbering |
| Volumetric light + firefly particles | Enhanced Tyndall beams + 200+ glowing sprites |
| White minimalist UI | Dark void + blue/amber HUD minimal overlay |

---

## 1. 3D Scene Architecture

### Layer Stack (back → front)

```
Layer 0: Deep Space Skybox (dark gradient sphere, radius 30)
Layer 1: Volumetric Nebula (3 translucent spheres + noise shader)
Layer 2: Particle Field (200+ glowing point sprites)
Layer 3: Volumetric Light Cones (2 Tyndall beams + custom shader)
Layer 4: 6 Tilted Orbit Rings (TorusGeometry, varied inclinations)
Layer 5: Curved Clock Face + Hands
─────────────────────────────────────────────
CSS overlay: Data readouts / Title / CTA / Status dots
```

### Camera

- PerspectiveCamera, FOV 45°, initial position (0, 0, 12)
- Mouse move → camera orbits around Y/X axis (±0.15rad max)
- Scroll → camera Z-axis push-back (0-3 units over 40vh scroll)
- All movement lerped: `lerp(current, target, 0.05)` per frame

### Renderer

- WebGLRenderer, `alpha: true` (transparent, CSS provides #06080D base)
- `toneMapping: ACESFilmicToneMapping`
- `outputColorSpace: SRGBColorSpace`
- `antialias: true`
- Pixel ratio capped at 2 for performance

### Scene Management

- Single `useRef<HTMLCanvasElement>` in page.tsx
- Three.js lifecycle managed in a custom hook `useThreeJSScene`
- Canvas sized to `100vw × 100vh` (hero section), position fixed
- Scene fades out linearly over 40vh scroll distance
- Disposed on component unmount

---

## 2. Particle System

### Composition (200+ sprites)

| Group | Count | Distribution | Size | Color | Behavior |
|---|---|---|---|---|---|
| Firefly particles | 120 | Spherical shell radius 4-10 | 2-6px | Blue 70% + Amber 20% + White 10% | Brownian drift + Y-axis slow rise |
| Star field | 60 | Large spherical shell radius 15-25 | 1-2px | White/blue-white | Low-frequency random flicker |
| Dust motes | 30 | Near camera (z: -1 to 2) | 4-10px | White, semi-transparent | Slow cross-viewport drift, out-of-focus blur |

### Material

- Custom `SpriteMaterial` with radial gradient texture (bright center → transparent edge)
- `AdditiveBlending` for glow stacking
- `depthWrite: false` for correct transparency sorting
- Each particle: random phase for sin-based opacity oscillation (2-6s period)

### Particle Shader (GLSL)

- Vertex: pass UV + size
- Fragment: radial gradient `exp(-dist² * 3.0)`, color with intensity uniform
- Optional: subtle chromatic fringe (R/G channels offset by 0.5px)

---

## 3. Volumetric Light Beams (Tyndall Effect)

### Beam A (Blue #3B82F6)

- Source: outside top-right (5, 8, -5)
- Direction: diagonal down-left through particle field
- Shape: `CylinderGeometry(0.3, 1.2, 8)` — cone widening toward camera
- Rotation: slow Z-axis sway ±8°, period 30s
- Intensity: max at hero, fades over scroll

### Beam B (Amber #F59E0B)

- Source: mid-left (-6, 0, -3)
- Direction: horizontal, crossing beam A
- Shape: wider elliptical cone
- Rotation: gentle pitch ±5°, period 25s
- Intensity: 0.6× Beam A

### Volumetric Light Shader

- Attenuation along beam axis (distance from center line)
- Attenuation along beam length (distance from source)
- 3D simplex noise perturbation (breaks uniformity, adds "dust" texture)
- `AdditiveBlending` — particles in beam path appear brighter, creating visible light path

---

## 4. 3D Orbit Rings

### Geometry (6 TorusGeometry rings)

| Ring | Radius | Tube | Inclination (X/Y/Z) | Rotation Speed |
|---|---|---|---|---|
| 1 (innermost) | 2.2 | 0.015 | 82° / 5° / 3° | +0.15 rad/s |
| 2 | 2.6 | 0.012 | 78° / -3° / -5° | -0.12 rad/s |
| 3 | 3.0 | 0.010 | 85° / 8° / 2° | +0.10 rad/s |
| 4 | 3.4 | 0.010 | 75° / -6° / -4° | -0.08 rad/s |
| 5 | 3.8 | 0.008 | 80° / 4° / 6° | +0.06 rad/s |
| 6 (outermost) | 4.2 | 0.008 | 88° / -2° / -3° | -0.05 rad/s |

### Material

- `MeshStandardMaterial`
- color: `rgb(59, 130, 246)`
- emissive: `rgb(26, 38, 102)` (subtle self-illumination)
- metalness: 0.3, roughness: 0.5
- opacity: 0.35 → 0.10 (decreasing by ring)
- `transparent: true`

### Interaction

- Mouse proximity to clock center → ring rotation speed ×1.3
- Section 2 scroll-in → ring opacity fade to 0

---

## 5. 3D Curved Clock Face

### Layers (front → back)

```
Layer 1: Protective Glass — slightly convex, clearcoat, near-invisible
Layer 2: Hand Set — hour/min/sec hands, 3D extruded
Layer 3: Numeral Ring — 12 numbers, tilted inward 8°
Layer 4: Dial Face — concave disc, metallic
Layer 5: Tick Ring — 12 major + 48 minor tick marks
Layer 6: Dial Backlight — emissive radial gradient
```

### Dial Face

- Geometry: `SphereGeometry(3.0, 64, 32)` front hemisphere, pushed inward 0.15 units (concave dish)
- Material: `MeshStandardMaterial`
  - color: `#0A0D14` (hull dark)
  - metalness: 0.85, roughness: 0.25
  - emissive: `rgba(59,130,246,0.03)`
  - envMapIntensity: 0.3

### Tick Marks

- 12 major ticks: thin boxes, radial, emissive `rgba(59,130,246,0.5)`, length 0.25
- 3/6/9/12 positions: longer (0.35)
- 48 minor ticks: thinner, emissive `rgba(59,130,246,0.18)`
- Position: radius 2.75 around dial circumference

### Numerals

- 12 numbers: sprite textures (pre-baked Canvas2D) or ExtrudeGeometry
- Font: JetBrains Mono / geometric sans-serif
- Position: radius 2.45, facing center, tilted inward 8°
- Material: emissive `rgba(255,255,255,0.5)`

### Hands

| Hand | Length | Width | Thickness | Material (emissive) | Shape |
|---|---|---|---|---|---|
| Hour | 1.1 | 0.06 | 0.04 | `rgba(255,255,255,0.7)` | Tapered (root wide → tip narrow) |
| Minute | 1.8 | 0.04 | 0.03 | `rgba(59,130,246,0.8)` | Tapered |
| Second | 2.1 | 0.015 | 0.02 | `rgb(245,158,11,0.9)` | Tapered + counterweight ball |

- Center cap: small cylinder + hemisphere, emissive white
- Rotation updated from `new Date()` each frame

### Protective Glass

- `MeshPhysicalMaterial`, roughness 0.05, metalness 0
- clearcoat 0.4, ior 1.5
- opacity 0.15 (barely visible, only specular highlight shows)

---

## 6. CSS Overlay — HUD Data Panels

All positioned absolutely over the Three.js canvas via z-index.

### Data Readouts (top-left)

```
┌─ LOCAL TIME ───┐ ┌─ DATE ────┐ ┌─ MISSION ──┐
│ 14:35:52       │ │ 2026.05.15│ │ LOG #003   │
└────────────────┘ └───────────┘ └────────────┘
```

- Label: JetBrains Mono 0.5625rem, letter-spacing 0.2em, `rgba(255,255,255,0.25)` (upgraded from 0.15)
- Value: JetBrains Mono 0.8125rem, tabular-nums, `rgba(255,255,255,0.75)` (upgraded from 0.6)
- Value glow: `text-shadow: 0 0 8px rgba(59,130,246,0.15)`
- New "MISSION LOG" readout — Lusion-style experiment numbering

### Status Indicators (below clock)

- 6 dots: first 3 amber active (breathing pulse), last 3 blue standby
- Label: "SYSTEMS NOMINAL" JetBrains Mono 0.5rem, `rgba(255,255,255,0.1)`

### Title Group (center)

- **H1**: Clash Display, `clamp(2.5rem, 6vw, 5rem)`, font-weight 600, `rgba(255,255,255,0.9)`
  - `letter-spacing: -0.02em`
  - `text-shadow: 0 0 40px rgba(59,130,246,0.15)` (subtle blue halo)
- **Ghost Clone** (Lusion dual-layer): same text, offset 3px down + 4px right, `rgba(59,130,246,0.08)`, z-index below main
  - Offset amount changes during scroll (internal text parallax)
- **Subtitle**: Satoshi 0.9375rem, `rgba(255,255,255,0.3)`

### CTA Button

- Existing `instrument-btn` class with minor upgrades:
  - padding: 20px 50px (up from 18px 44px)
  - border glow slightly brighter on hover
- Secondary link: "↓ MISSION BRIEFING" JetBrains Mono 0.5625rem

---

## 7. Animation Choreography

### Page Load Sequence

| Time | Event | Duration |
|---|---|---|
| 0ms | 3D scene renders (canvas appears) | instant |
| 200ms | Nebula volumes begin fade-in | 1.5s |
| 400ms | Particles converge from scene edges toward center | 1.2s |
| 600ms | Volumetric beams fade in (dark→bright) | 1.0s |
| 800ms | 6 orbit rings illuminate sequentially | 100ms stagger each |
| 1200ms | Clock dial fade-in + scale 1.02→1 | 0.6s |
| 1500ms | 12 numerals pop in | 30ms stagger each |
| 1800ms | Hands spin from 00:00 to current time | 0.8s |
| 2000ms | Data readouts fade in | 0.5s |
| 2200ms | Status dots activate sequentially | 80ms stagger each |
| 2500ms | Title text fade in | 0.6s |
| 2800ms | CTA fade in | 0.4s |
| 3000ms | Mouse parallax camera motion begins | — |

### Scroll Behavior

- Hero 3D scene fades out linearly over 40vh scroll distance
- Camera Z push-back (12 → 9) during scroll
- Particle opacity decreases with scroll
- Beam intensity decreases with scroll
- Rings fade to zero opacity
- Sections 2-4 behave identically to current implementation (pure CSS)

### Ambient Animations (continuous)

| Element | Animation | Period |
|---|---|---|
| Nebula volumes | Slow position drift (±0.3 units) | 40-60s |
| Particle fireflies | Sin opacity oscillation (random phase) | 2-6s |
| Star field | Low-frequency flicker | 2-8s random |
| Volumetric beams | Slow rotation sway | 25-30s |
| Orbit rings | Continuous rotation around own axes | 6-20s/rev (varied) |
| Dust motes | Slow cross-viewport drift | 10-20s |

### Interaction Feedback

| Trigger | Response |
|---|---|
| Mouse move | Camera orbit ±0.15rad, lerped |
| Hover clock area | Ring rotation ×1.3 speed, hands slight emissive boost |
| Hover CTA button | Existing glow transition (unchanged) |
| Click CTA | Brief 0.1s flash + rings momentarily accelerate, then navigate to /orbit |

### Easing

- All CSS animations: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- Camera/particle lerp: `current += (target - current) * 0.05` per frame
- No bounce, no elastic, no linear (per frontend-design-pro skill)

---

## 8. Technical Implementation

### New Dependency

- `three` (npm package, ~140KB gzipped)
- `@types/three` (dev dependency)

### New Files

| File | Purpose |
|---|---|
| `src/hooks/useThreeJSScene.ts` | Three.js setup, lifecycle, animation loop, cleanup |
| `src/components/landing/ThreeHero.tsx` | Three.js canvas wrapper component |
| `src/components/landing/three/particles.ts` | Particle system setup (200+ sprites) |
| `src/components/landing/three/beams.ts` | Volumetric light beams (2 cones + shaders) |
| `src/components/landing/three/rings.ts` | 6 orbit Torus rings |
| `src/components/landing/three/clock-face.ts` | 3D clock dial, ticks, numerals, hands |
| `src/components/landing/three/nebula.ts` | Volumetric nebula fog spheres + noise shader |

### Modified Files

| File | Changes |
|---|---|
| `src/app/(landing)/page.tsx` | Replace Hero section with `<ThreeHero />` + new HUD overlay markup. Sections 2-4 unchanged. |
| `src/app/globals.css` | Add ghost clone text styles, enhanced data readout glow, minor HUD tweaks |
| `package.json` | Add `three` dependency |
| `CLAUDE.md` | Document Three.js dependency and architecture |

### Files NOT Touched

- `src/components/landing/LiveClock.tsx` — replaced by 3D clock (may keep as fallback)
- `src/components/landing/LangSwitch.tsx`
- `src/app/orbit/` — all orbit app files
- `src/context/`, `src/hooks/`, `src/utils/`, `src/types/`, `src/data/`
- Sections 2-4 of `page.tsx` (InstrumentPanel, SequenceTimeline, DockingCTA)
- `src/lib/i18n.ts`
- All documentation pages

### Performance Targets

- 60fps on desktop (with pixel ratio ≤2)
- 30fps minimum on mobile (with pixel ratio = 1, reduced particle count 120)
- Canvas resolution caps at 1920px wide
- `requestAnimationFrame` loop with delta-time for frame-rate independence
- Dispose all geometries, materials, textures on unmount to prevent memory leaks

---

## 9. Success Criteria

1. **Visual**: 3D depth is immediately perceptible — particles at different distances, rings at varied tilts, clock has material presence
2. **Performance**: 60fps on desktop with GPU acceleration, no frame drops on scroll
3. **Integration**: Sections 2-4 render identically to current state, no layout regressions
4. **Mobile**: Reduced particle count (120), pixel ratio 1, still visually impressive
5. **No regressions**: i18n still works, links still work, static export still works (`pnpm build` succeeds)
6. **Lusion reference**: Ghost clone text, dual-layer depth, volumetric beam atmosphere are all recognizable
7. **Load time**: Three.js lazy-loaded, first paint < 2s on fast connection

---

## 10. Risk Mitigation

| Risk | Mitigation |
|---|---|
| Three.js bundle size (~140KB) | Dynamic import `() => import('three')` — not needed for sections 2-4 |
| WebGL not supported | Fallback to current CSS-only Hero (feature-detect WebGL, keep LiveClock.tsx) |
| Mobile GPU performance | Halve particle count, pixel ratio 1, skip glass refraction |
| Static export compat | Three.js is client-side only, zero SSR impact |
| Animation memory leak | Dispose all Three.js objects in useEffect cleanup |
