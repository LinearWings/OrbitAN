# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OrbitAN (轨道计划)** — A cosmic-themed daily schedule planner with 6 time-management methodologies, a Canvas 2D orbital visualization, and an isometric pseudo-3D engine. Built with Next.js 16 + React 19 + TypeScript 6.

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- No test framework configured.
- `tsconfig.json` excludes `skills`, `.agents`, `.claude/skills` — third-party agent skills installed there may contain TypeScript that doesn't typecheck against this project.

## Critical: Next.js Version Warning

**Next.js 16 has breaking changes** — APIs, conventions, and file structure differ from what you may know. Always check `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Architecture

### State Management

React Context + `useReducer` in `src/context/AppContext.tsx`. Single `AppState` holds: tasks keyed by date (`TasksByDate`), currentDate, selectedTaskId, editingTaskId, activeFilter, isEditPanelOpen, isDeleteConfirmOpen, isOrbitModeOpen.

- **Reducer actions**: LOAD, ADD, UPDATE, DELETE, SET_DATE, SET_FILTER, SELECT_TASK, OPEN_EDIT, CLOSE_EDIT, SHOW_DELETE_CONFIRM, UPDATE_PROGRESS, UPDATE_ORBIT_MODE
- **Persistence**: Auto-saves to `localStorage` key `orbital_schedule_v1` with schema versioning (current: v2). Migration support in `src/utils/storage.ts`. Version 1→2 migrated `time`+`duration` fields to `startTime`+`endTime` strings.
- **Hooks** (one per concern): `useTasks`, `useKeyboard`, `useOrbital`, `useDateNavigation`, `useFilter`, `useSelectedTask`, `useEditPanel`, `useClock`

### Page Layout (`src/app/page.tsx`)

Main page renders in this stacking order (bottom to top):
1. `<OrbitalCursor />` — Custom cursor
2. `<ConnectorArrows />` — SVG arrow connections (fixed `z-30`, pointer-events-none)
3. `<NoiseOverlay />` — Film grain texture overlay
4. `<TitleHeader />` — Top title bar
5. `<DateNav />` — Date navigation
6. `<FloatingProgressCard />` / `<FloatingStatsCard />` — Floating panels
7. `<HybridClock />` — Canvas clock (centered, `min(62vw, 68vh)`)
8. `<ScheduleItem />` cards — positioned via `computeCardPositions()`
9. `<LegendBar />` + "Orbit Mode" button — Bottom center
10. `<EditPanel />` — Task editor (modal overlay)
11. `<OrbitModeTransition>` → `<OrbitModePage>` — Fullscreen orbit mode

### Card Distribution (`computeCardPositions` in `src/app/page.tsx`)

Cards alternate between left zone (~10% viewport) and right zone (~85% viewport) to spread across the screen and avoid clustering. Cards with even indices go left, odd indices go right. Same-side cards get a ±2px horizontal stagger to prevent perfectly straight columns. Vertical spacing adapts dynamically — cards are evenly distributed across 12%–78% viewport height based on count.

### Schedule Cards (`src/components/schedule/ScheduleItem.tsx`)

Vertical-stack layout with no card chrome (no border, no background):
1. **Time** — Clash Display `font-semibold`, `text-2xl`, `tabular-nums` — the hero element
2. **Task name** — Satoshi `0.8125rem`, `leading-snug`
3. **Meta row** — duration `·` type `·` end time, Satoshi `0.6875rem`, `text-white/16`, on one compact line with `·` separators
4. **Progress bar** — `ProgressBar` component, `mt-2.5`

Positioned absolutely via `computeCardPositions()`, centered on `(left%, top%)` with `translate(-50%, -50%)`. Card width: `min(28vw, 240px)`. Height is content-driven. Selection/hover states use opacity transitions on text colors.

### Arrow Routing (`src/components/layout/ConnectorArrows.tsx`)

Connects task orbit positions on the clock to schedule cards. Arrow origins are the **comet arc midpoint** on the orbit ring (computed via `cometMidpoint()` in `src/utils/orbital.ts`), dispatched from `HybridClock.tsx` in the `"threeclock-planet-positions"` custom event. Design constraints:
- **Max 3 points (2 segments)** per arrow — never more
- **120° obtuse bend** (60° direction change) — PCB routing style
- **At least one segment** is always horizontal or vertical

Routing strategy:
- **Horizontal-first** (when `|dy| ≤ √3 × |dx|`): horizontal segment from planet, then 60° diagonal to card
- **Vertical-first** (fallback): vertical segment from planet, then 30° diagonal to card
- One of the two constraints is always satisfiable

Arrow tips: SVG `<polygon>` triangle rotated to match last segment angle. Arrowhead at card edge (left or right edge depending on planet position relative to card center).

Throttled via 80ms min-interval + `requestAnimationFrame`. Listens for `"threeclock-planet-positions"` custom event dispatched from `HybridClock.tsx`.

### Rendering Engines

Two independent rendering engines, both pure Canvas 2D (no WebGL/Three.js):

**1. 2D Orbital Engine** (`src/components/orbital/orbital-engine.ts`):
- Static background cached to offscreen canvas: constructivist geometry, 24h clock dial (3-tier tick hierarchy with 8 labels every 3h, day/night sector shading — amber for 06-18, blue for 18-06), 6 concentric orbit rings (amber/blue alternating, `0.66×` to `0.96×` of maxRadius)
- Dynamic: clock hands (blue #2563EB, hour/minute/second), comet trails (segmented arc rendering with per-segment opacity 0.25→0.75), comet heads (radial glass-sphere gradient matching isometric planet style), comet labels (hover/select only)
- Film grain overlay: cached noise texture composited with radial vignette (`overlay` blend mode)
- `computePlanetScreenPositions()` — maps tasks to 2D screen positions for arrow connections
- `CanvasPlanetScreenPos` interface includes optional `headX`/`headY`/`tailX`/`tailY` for smarter arrow routing

**2. Isometric Engine** (`src/components/orbital/isometric-engine.ts`):
- Pseudo-3D projection: X→lower-right (cos30°), Y→lower-left (cos30°), Z→up (sin30°)
- `toScreen(x3d, y3d, z3d)` → `(cx + (x - y) * ISO_COS, cy + (x + y) * ISO_SIN - z)`
- 8 rendering layers: constructivist geometry, base, orbit rings, dial, ticks, nebula, planets, hands
- Planet rendering: glass sphere with atmosphere, body gradient, specular highlights, subsurface scattering, Fresnel rim light, refraction lines
- Different clock dial design (isometric 24h dial, elevated floating)
- Nebula particle system (80 particles, amber/blue/violet)

### Comet Positioning (`src/utils/orbital.ts`)

Overlap-aware algorithm assigns each task to one of 6 concentric orbit rings:
- Tasks sorted by start time, then duration (longer first)
- Each ring tracks time-slot occupancy; overlapping schedules get pushed to outer rings
- Non-overlapping tasks share rings
- Fallback: ring 5 (outermost) if all 6 rings conflict
- Handles overnight tasks (24h wraparound)

### Comet & Planet Rendering

**Comet head gradient**: Radial glass-sphere gradient (consistent with isometric planet style) — offset center `(headX - r*0.28, headY - r*0.28)`, color stops from white highlight (0.65 opacity) through solid color to dark edge (0.6 opacity). A specular highlight ellipse is overlaid at upper-left.

**Comet trail**: Segmented arc rendering — 24 arc segments, each with interpolated opacity (0.25 at tail → 0.75 at head). This ensures uniform opacity along the arc path. Trail width: `headRadius * 1.2`.

**Planet/comet radius**: Unified across all rendering paths via `UNIFIED_RADIUS` in `src/data/constants.ts`:
| Duration | Radius |
|---|---|
| <30min | 4 |
| 30-60min | 5 |
| 60-120min | 7 |
| >120min | 9 |

This replaces three previously-divergent radius maps (`PLANET_RADIUS_MAP`, `getCometHeadRadius`, `getPlanetRadius`).

### Visual Design

- **Palette**: Dark void (#080808, #111111), amber #EAB308 (work/study), blue #2563EB (study), gray #374151 (meeting), #6B7280 (personal)
- **Constructivist aesthetic**: Geometric forms, bold diagonals at 3 offsets, concentric circles, rotated rectangles — amber (#EAB308) and blue (#2563EB) at low opacity (0.06–0.10)
- **Fonts**: Clash Display (headings), Satoshi (body), JetBrains Mono (mono/tabular)
- **Clock**: 24-hour radial clock face, blue hands, black dial with beveled concentric rings

### Methodology System

6 methodology panels, each with its own data structure persisted to localStorage (key `orbital_methodology_v1`):
- **GTD**: 5-stage kanban (inbox→next→waiting→someday→done)
- **Pomodoro**: 25min focus / 5min break cycles with long break every 4
- **Pareto**: 80/20 analysis with impact/effort scoring
- **Moffatt**: 8×25min timed sessions
- **Howell Matrix**: urgent/important quadrants
- **SWOT**: strengths/weaknesses/opportunities/threats

### Key Types (`src/types/index.ts`)

- `Task`: id, type (work/study/meeting/personal), name, nameEn, startTime, endTime, progress, completed, note, createdAt
- `AppState`: tasks (TasksByDate), currentDate, selectedTaskId, editingTaskId, activeFilter, isEditPanelOpen, isDeleteConfirmOpen, isOrbitModeOpen
- `AppAction`: discriminated union with 14 action types
- Orbital types: `CometPosition`, `PlanetPosition`, `PlanetRadius` (4|5|7|9 — unified via `UNIFIED_RADIUS` in constants.ts)
- Methodology types: `GTDItem`, `QuadrantItem`, `HowellMatrixData`, `SWOTData`, `ParetoItem`, `MoffattSession`, `PomodoroPhase`

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `←`/`→` | Previous/next day (current week only) |
| `T` | Go to today |
| `1`-`4` | Filter: work/study/meeting/personal |
| `0` | Clear filter |
| `N` | New task |
| `Delete` | Delete selected task |
| `O` | Toggle Orbit Mode |
| `Escape` | Close edit panel / deselect task |
