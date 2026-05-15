# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OrbitAN (轨道计划)** — A cosmic-themed daily schedule planner with 6 time-management methodologies, a Canvas 2D orbital visualization, and an isometric pseudo-3D engine. Built with Next.js 16 + React 19 + TypeScript 6 + Tailwind CSS v4.

## Documentation Files

- `README.md` — Project overview, features, tech stack, quick start (bilingual zh/en)
- `CONTRIBUTING.md` — Development setup, architecture, conventions, PR guidelines (bilingual zh/en)
- `LICENSE` — MIT License
- `CLAUDE.md` — This file, AI coding agent guidance
- `docs/project-analysis.md` — Full project analysis (bugs, architecture, roadmap)
- `docs/superpowers/` — Historical design specs and implementation plans

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- No test framework configured.
- `tsconfig.json` excludes `skills`, `.agents`, `.claude/skills` — third-party agent skills installed there may contain TypeScript that doesn't typecheck against this project.

## Critical: Next.js 16 + Static Export

**Next.js 16 has breaking changes** — APIs, conventions, and file structure differ from what you may know. Always check `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

**Static export (`output: "export"`)** — The app is a pure client-side SPA with zero SSR. No server components, API routes, or middleware exist. All pages use `"use client"`. Deployed at `basePath: "/OrbitAN"`. Images are unoptimized (required for static export).

## Route Structure

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/(landing)/page.tsx` | Landing page — Orbital Control Station design, LiveClock, nebula/star field, Tyndall beams, instrument panels, docking CTA |
| `/docs` | `src/app/(landing)/docs/page.tsx` | Documentation index |
| `/docs/tutorial` | `src/app/(landing)/docs/tutorial/page.tsx` | Tutorial |
| `/docs/methodology` | `src/app/(landing)/docs/methodology/page.tsx` | Methodology guide |
| `/docs/usage` | `src/app/(landing)/docs/usage/page.tsx` | Usage guide |
| `/docs/changelog` | `src/app/(landing)/docs/changelog/page.tsx` | Changelog |
| `/orbit` | `src/app/orbit/page.tsx` | Main schedule application (~1137 lines) |

The `(landing)` route group has its own layout with fixed header, nav, and LangSwitch. The `/orbit` page uses the root layout directly. Both are client-rendered static pages.

## State Management

React Context + `useReducer` in `src/context/AppContext.tsx`. Single `AppState` holds:

- `tasks` (TasksByDate) — all tasks keyed by date string
- `currentDate` — active date
- `viewMode` — `"day"` | `"week"` | `"month"`
- `selectedTaskId` / `editingTaskId`
- `activeFilter` — type filter (default `"all"`)
- `isEditPanelOpen` / `isDeleteConfirmOpen`
- `isOrbitModeOpen`
- `focusBlocks` (FocusBlocksByDate) — time-blocked methodology sessions

**20 reducer actions**: LOAD, ADD, UPDATE, DELETE, SET_DATE, SET_FILTER, SELECT_TASK, OPEN_EDIT, CLOSE_EDIT, SHOW_DELETE_CONFIRM, UPDATE_PROGRESS, UPDATE_ORBIT_MODE, SET_VIEW_MODE, LOAD_FOCUS, ADD_FOCUS_BLOCK, UPDATE_FOCUS_BLOCK, DELETE_FOCUS_BLOCK, SET_FOCUS_BLOCK_STATUS.

**Persistence**: On mount, loads tasks and focus blocks from localStorage. On change (skipping first render via ref), saves back. Uses `src/utils/storage.ts`.

### localStorage Keys

| Key | Content | Version |
|---|---|---|
| `orbital_schedule_v1` | Tasks + methodology data (GTD/Pareto/Moffatt/Howell/SWOT/Pomodoro settings) | v2 (migrated from v1) |
| `orbital_focus_v1` | Focus blocks by date | v1 |
| `orbital_custom_types_v1` | Custom task type definitions | v1 |

### Hooks (one per concern)

| Hook | Purpose |
|---|---|
| `useTasks` | Task CRUD: addTask, updateTask, deleteTask, updateProgress, filteredTasks |
| `useKeyboard` | Global keyboard shortcuts |
| `useOrbital` | Orbit Mode toggle |
| `useDateNavigation` | Date nav (prev/next/today) and view mode switching, with boundary handling |
| `useFilter` | Task type filter (all/work/study/meeting/personal) |
| `useSelectedTask` | Get/set selected task ID |
| `useEditPanel` | Edit panel open/close, delete confirm |
| `useClock` | Real-time clock returning current `Date` updated every 1s |
| `useFocusBlocks` | Focus block CRUD + status management |
| `useLanguage` | Language detection from cookie `orbit_lang` or browser `navigator.language` |
| `useMediaQuery` | Responsive media query hook (768px breakpoint) |

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `←`/`→` | Previous/next day (in day view) or week/month |
| `T` | Go to today |
| `1`-`4` | Filter: work/study/meeting/personal |
| `0` | Clear filter |
| `N` | New task |
| `Delete` | Delete selected task |
| `O` | Toggle Orbit Mode |
| `Escape` | Close edit panel / deselect task |

## Focus Blocks System

Focus blocks are time-boxed methodology sessions displayed as colored arcs on the clock's outer rings. Key types in `src/types/focus.ts`:

- `FocusMethodId` — `"gtd"` | `"pomodoro"` | `"pareto"` | `"moffatt"` | `"howell"` | `"swot"`
- `FocusBlockStatus` — `"planned"` | `"active"` | `"paused"` | `"completed"`
- `FocusBlock` — id, date, startTime, endTime, method, status, linkedTaskId?, name, note, createdAt

Method colors (from `src/data/focus-defaults.ts`): gtd=green `#22C55E`, pomodoro=red `#EF4444`, pareto=blue `#2563EB`, moffatt=purple `#7C3AED`, howell=orange `#F97316`, swot=amber `#EAB308`.

Focus blocks render on outer orbit rings (radius 0.97+) in the clock, visually distinct from task comets. Components live in `src/components/focus/`.

## Orbit Mode / Main App Page Layout (`src/app/orbit/page.tsx`)

Stacking order (bottom to top):
1. `<OrbitalCursor />` — Custom cursor
2. `<ConnectorArrows />` — SVG arrow connections (`z-30`, pointer-events-none)
3. `<NoiseOverlay />` — Film grain texture
4. `<TitleHeader />` — Top title bar
5. `<DateNav />` — Date navigation
6. `<FloatingProgressCard />` / `<FloatingStatsCard />` — Floating panels
7. `<HybridClock />` — Canvas clock (centered, `min(62vw, 68vh)`)
8. `<ScheduleItem />` cards — positioned via `computeCardPositions()`
9. `<LegendBar />` + "Orbit Mode" button — Bottom center
10. `<EditPanel />` — Task editor (modal overlay)
11. `<OrbitModeTransition>` — Fullscreen orbit mode with methodology panels

### Card Distribution (`computeCardPositions`)

Cards alternate between left zone (~10% viewport) and right zone (~85% viewport). Even indices go left, odd go right. Same-side cards get ±2px horizontal stagger. Vertical spacing adapts dynamically across 12%–78% viewport height.

### Schedule Cards (`src/components/schedule/ScheduleItem.tsx`)

Vertical-stack with no card chrome: Time (Clash Display, `text-2xl`) → Task name (Satoshi, `0.8125rem`) → Meta row (duration · type · end time) → ProgressBar. Positioned absolutely, width `min(28vw, 240px)`.

### Arrow Routing (`src/components/layout/ConnectorArrows.tsx`)

Connects comet arc midpoints on the orbit ring to schedule cards. Max 3 points (2 segments), 120° obtuse bends (PCB routing style), at least one horizontal/vertical segment. Arrow tips are SVG `<polygon>` triangles. Listens for `"threeclock-planet-positions"` custom event from `HybridClock.tsx`. Throttled 80ms + `requestAnimationFrame`.

## Rendering Engines

Two independent Canvas 2D engines (no WebGL/Three.js):

**1. 2D Orbital Engine** (`src/components/orbital/orbital-engine.ts`):
- Offscreen canvas cache for static background: constructivist geometry, 24h clock dial (3-tier ticks, 8 labels every 3h, day/night sector shading — amber 06-18, blue 18-06), 6 concentric orbit rings (amber/blue alternating, 0.66×–0.96× of maxRadius)
- Dynamic: clock hands (blue #2563EB), comet trails (segmented arcs, per-segment opacity 0.25→0.75), comet heads (radial glass-sphere gradient), comet labels (hover/select only)
- Film grain: cached noise texture composited with radial vignette (`overlay` blend mode)

**2. Isometric Engine** (`src/components/orbital/isometric-engine.ts`):
- Pseudo-3D: X→lower-right (cos30°), Y→lower-left (cos30°), Z→up (sin30°)
- 8 rendering layers: constructivist geometry, base, orbit rings, dial, ticks, nebula, planets, hands
- Planet rendering: glass sphere with atmosphere, body gradient, specular highlights, subsurface scattering, Fresnel rim light
- Nebula: 80 particles (amber/blue/violet)

### Comet Positioning (`src/utils/orbital.ts`)

Overlap-aware: tasks sorted by start time then duration (longer first). Each of 6 concentric rings tracks time-slot occupancy; overlapping schedules push to outer rings. Non-overlapping tasks share rings. Handles overnight (24h wraparound).

### Planet/Comet Radius (`UNIFIED_RADIUS` in `src/data/constants.ts`)

| Duration | Radius |
|---|---|
| <30min | 4 |
| 30–60min | 5 |
| 60–120min | 7 |
| >120min | 9 |

## Visual Design

- **Palette**: Dark void (#080808, #0A0A0F), amber #EAB308 (work/study), blue #2563EB (study), gray #374151 (meeting), #6B7280 (personal)
- **Constructivist**: Geometric forms, bold diagonals at 3 offsets, concentric circles, rotated rectangles — amber/blue at low opacity (0.06–0.10)
- **Fonts**: Clash Display (headings, from api.fontshare.com), Satoshi (body, from api.fontshare.com), JetBrains Mono (mono/tabular, from next/font/google)
- **Effects** (in `globals.css`): Nebula glow drift, Tyndall beam sweeps, star micro-flicker, dust particle float, mouse spotlight, bloom, glass morphism

### Landing Page — Orbital Control Station × Deep Space Observatory

The landing page is a deep-space orbital control station. The user is an operator about to enter orbit. Precision instruments float in a nebula field; data streams flow through cosmic dust. The design fuses **Hard Sci-Fi** (precision instruments, data overlays, beam lights) with **Cosmic Mysticism** (nebula glows, star fields, sublimation of time).

**Color System** (strict role enforcement):
- **Blue `#3B82F6`** — Structure: clock, orbit lines, data streams, tick marks (geometric-order elements only)
- **Amber `#F59E0B`** — Status/action: indicators, warnings, emphasis buttons (interactive attention nodes only)
- **Violet `#6366F1`** — Depth/atmosphere: nebula glows, far-field Tyndall beams (background only)
- Never mix blue and amber on the same element for the same function.

**Spatial Depth System** (three distinct layers):
| Layer | z-range | Content | Parallax |
|---|---|---|---|
| Deep Space | 0–10 | Nebula glows, distant stars, far-field Tyndall beams (violet, wide) | 0.1× |
| Instrument | 20–40 | Orbit clock, data panels, orbit rings, near-field beams (blue/amber, narrow) | 0.5× |
| Interface | 50–70 | Text, buttons, status indicators, mouse spotlight | 1.0× |

Key landing page components:
- `LiveClock` — Single precision clock face with thin-border instrument casing, tick ring, subtle glow (no deconstructed layers, no brutalist housing)
- `NebulaGlow` — 3 large-area radial-gradient nebula glows (blue/violet, high blur, slow 55–65s drift)
- `StarField` — 50 scattered star points with randomized micro-flicker (2–8s periods), varied brightness
- `TyndallBeams` — Near-field narrow beams (blue/amber, blur 1–2px, 20–40s sweep) + far-field wide beams (violet, blur 60–100px, 60–90s drift), with dust particles clustered along beam paths
- `InstrumentPanel` — Thin-border (1px) dark hull surfaces with top color strip, internal micro data viz (schematic orbit lines, tick marks), hover glow intensification
- `SequentialTimeline` — 4 horizontal nodes (Calibrate/Load/Execute/Review) connected by thin light track with flowing dot, circular ring→fill→completion marks
- `DockingCTA` — Minimal status panel + precision launch button, blue Tyndall beam passing through from behind

The page is divided into 4 sections, separated by thin light-track dividers:
1. **Orbital Baseline (Hero)** — Full viewport, centered clock, 6 ultra-thin concentric orbit rings rotating at different rates, 6 status indicator dots below, rising "time evaporation" particles from beneath clock
2. **System Components (Features)** — Three horizontal instrument panels (Orbit Engine / Navigation Matrix / Focus Protocol), staggered scroll-triggered reveal (0.15s stagger, 0.6s each)
3. **Docking Sequence (Workflow)** — 4 sequential nodes (00/06/12/18 timecodes), light track extends left→right on scroll
4. **Docking Clearance (CTA)** — Single status panel with rotating "docking status" ring, beam brightness increases on viewport enter

**Animation & Effects**:
- **Page load sequence**: Deep space background instant → Tyndall beams fade in (200ms/2s) → Clock housing (400ms/0.6s) → Hands (600ms/0.4s, blur→sharp) → Status dots stagger (800ms, 60ms each) → Text fade (1000ms/0.5s) → Rising particles start (1200ms)
- **Ambient**: Nebula slow drift (±20px, 40–60s), star micro-flicker (2–8s random), orbit rings slow rotation (60–120s/rev), dust particles upward float (10–20s)
- **Interaction**: Mouse spotlight follows cursor (reduced intensity), panel hover glow + lift (−2px), button hover blue→white glow transition, button click 0.1s flash + rings accelerate
- **Explicitly removed**: CRT scanlines, glitch/chromatic text, pulse rings, text fracture, constructivist geometry clusters, time fragment numbers, bounce/elastic easings, heavy brutalist borders

## Methodology System

6 methodology panels, each with own data persisted inside `orbital_schedule_v1`:
- **GTD**: 5-stage kanban (inbox→next→waiting→someday→done)
- **Pomodoro**: 25min focus / 5min break cycles with long break every 4
- **Pareto**: 80/20 analysis with impact/effort scoring
- **Moffatt**: 8×25min timed sessions
- **Howell Matrix**: urgent/important quadrants
- **SWOT**: strengths/weaknesses/opportunities/threats

## Internationalization

Two languages: `zh` (Chinese, default) and `en` (English). Simple key-value map in `src/lib/i18n.ts` with ~70 translation keys. Language detected from cookie `orbit_lang` or `navigator.language`. Docs content is currently Chinese-only (hardcoded in `src/data/docs-content.ts`).

## Key Types (`src/types/index.ts`)

- `Task`: id, type, name, startTime, endTime, progress, completed, note, createdAt, method?
- `AppState` / `AppAction`: 20-action discriminated union
- `CometPosition`: orbital rendering data for comet arcs
- `PlanetRadius`: `4 | 5 | 7 | 9`
- `CustomTypeDef`: id, name, color (persisted to `orbital_custom_types_v1`)
- Methodology types: `GTDItem`, `QuadrantItem`, `HowellMatrixData`, `SWOTData`, `ParetoItem`, `MoffattSession`, `PomodoroPhase`

## Mobile Support

- `useMediaQuery` at 768px breakpoint
- `MobileBottomBar` replaces desktop controls
- Touch swipe: left/right to navigate days, left-swipe on cards to delete
- Long press (400ms) for drag activation
- 44px minimum touch targets per Apple HIG
- Hover effects disabled on touch devices via `@media (hover: none)`
- iOS smooth scrolling, overscroll prevention, tap highlight removal

## Zero External Dependencies

No React Query, Zustand, date-fns/dayjs, Framer Motion, or any UI library. Everything is vanilla React hooks, Canvas 2D, and CSS animations. The only runtime dependencies are `next`, `react`, and `react-dom`.
