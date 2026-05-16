# OrbitAN Landing Page Brutalist Redesign — Design Spec

> Date: 2026-05-14
> Scope: `src/app/(landing)/page.tsx`, `src/app/(landing)/layout.tsx`, `src/app/globals.css`, `src/lib/i18n.ts`
> Does NOT touch: `src/app/orbit/`, orbital engines, methodology panels, AppContext

## Design Direction

**Chrono-Constructivist Brutalism (时间构成主义)** — blending constructivist geometry with time-dominated brutalist presentation. The clock is the hero. Every element asserts the primacy of time.

## Color Palette

| Role | Value | Usage |
|------|-------|-------|
| Void Black | `#080808` | Page background |
| Amber | `#EAB308` | Time emphasis, clock digits, urgent accents |
| Blue | `#2563EB` | Order, structure, orbital elements |
| Gray | `#6B7280`, `#9CA3AF` | Secondary text, borders |
| White | `#FFFFFF` at multi-opacity levels | Text hierarchy |

## Typography (unchanged from current)

- **Clash Display** — headings, numbers, labels
- **Satoshi** — body text
- **JetBrains Mono** — clock digits, time codes, monospace

## Information Architecture (Single Long Scroll)

### Section 1: Time Anchor (Hero)
- Full-viewport-height section
- Massive live clock `HH:MM:SS` in JetBrains Mono, amber, occupying 40%+ viewport width
- Current date in hard-edged bordered box below clock
- Title: "OrbitAN" + subtitle "日程轨道管理系统" in three lines with diagonal constructivist line separators
- Low-opacity constructivist triangles/diagonals as bg geometry
- CSS scanline overlay across entire page (::after pseudo-element on body)
- Entry CTA button with hard border, no rounded corners

### Section 2: Functions as Statements
- Three hard-edge panels in asymmetrical staggered layout
- Each: large number `01` `02` `03` + function title + one-line description
- No rounded corners — sharp edges, single-side thick border accent
- Panels connected by diagonal geometric blocks
- Content: Orbital Clock, Six Methodologies, Focus Blocks

### Section 3: Workflow Timeline
- Vertical timeline with time-code format `00:00 → 24:00` on the left
- Each step = one operation: Click clock face → Set time range → Create task → Enter orbit
- Thick connector lines, industrial feel
- Monospace time labels

### Section 4: Action Zone (CTA)
- Full-width hard-edge color block
- Large entry button + real-time timestamp
- Minimal footer — essential links only

## Special Effects

1. **CSS Scanlines** — Full-page `::after` pseudo-element with repeating linear-gradient
2. **Film Grain** — Reuse existing `NoiseOverlay` component
3. **Live Clock** — `useEffect` + `requestAnimationFrame` for real-time HH:MM:SS
4. **Scroll Parallax** — Geometric shapes move at different speeds on scroll
5. **Hard-Cut Entrances** — Elements enter from bottom with zero or near-zero easing (step-end)
6. **Border Jump** — Button hover: border goes from 1px to 3px instantly (no transition)
7. **Diagonal Dividers** — SVG or CSS transform clip-path diagonal section separators
8. **Text Overflow** — Some text deliberately bleeds past container edges (clipped feel)
9. **Grain Overlay** — Existing noise texture composited over the page

## Copy Principles

- Remove metaphors and adjectives from functional descriptions
- Every sentence maps directly to one feature
- Replace poetic descriptions with direct functional statements
- Keep i18n structure, update both zh/en translation values
- Examples:
  - "轨道时钟" → "24小时径向时钟，任务以彗星弧线形态呈现在表盘上。"
  - "六大方法论" → "GTD·番茄钟·帕累托·莫法特·豪威尔·SWOT — 内建于轨道系统，随时调用。"
  - "聚焦块" → "在时钟上划定时间段，绑定方法论，以彩色弧线标记在轨道外环。"

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/globals.css` | Add scanline keyframe + overlay, brutalist utility classes, hard-cut animation keyframes |
| `src/lib/i18n.ts` | Rewrite all landing-relevant translation values (zh + en) for direct, factual tone |
| `src/app/(landing)/page.tsx` | Complete rewrite — new sections, live clock, parallax geometry, diagonal dividers |
| `src/app/(landing)/layout.tsx` | Adapt header to brutalist style, remove blur glass-morphism, add hard border |

## Out of Scope

- Orbit application page (`src/app/orbit/page.tsx`)
- Any methodology panels
- Canvas rendering engines
- AppContext / state management
- Mobile adaptation (existing responsive patterns will be preserved but not enhanced)
