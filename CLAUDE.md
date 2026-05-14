# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OrbitAN (轨道计划)** — A cosmic-themed daily schedule planner with 6 time-management methodologies, a Canvas 2D orbital visualization, and an isometric pseudo-3D engine. Built with Next.js 16 + React 19 + TypeScript 6 + Tailwind CSS v4.

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
| `/` | `src/app/(landing)/page.tsx` | Landing page — Temporal Brutalism design, LiveClock, particle field, features, timeline, CTA |
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
- **Effects** (in `globals.css`): Bloom, chromatic aberration, particle floats, CRT scanlines, glitch text, marquee, pulse rings, glass morphism

### Landing Page — Temporal Brutalism (Temporal Brutalism 时间粗野重构)

The landing page fuses four art movements into a cohesive visual language:

- **Constructivist** — Blueprint grids (48px/24px CSS repeating line patterns), radial line bursts (conic-gradient rays from clock center), dense diagonal line clusters with parallax scrolling, industrial rails (8px vertical conduits)
- **Brutalist** — Heavy frames (6–8px borders, triple-nested ghost/mid/heavy frames), brutalist mass blocks (solid #020202 blocks with low-opacity borders), clock housing (8px border + double shadow box), heavy CTA buttons (8px border + double outer frame rings)
- **Surrealist** — Time fragments (floating oversized numbers 06/12/18/24/00 at random angles and opacities), deconstructed clock rings (dashed circles with tick marks, 120s rotation), multi-layer clock display (primary sharp blue + secondary tilted/blurred amber at 6h offset with reversed seconds + tertiary ghost amber)
- **Avant-garde** — Text fracture animations (irregular letter-spacing jumps), oversized brutalist section numbers (18rem bleeding off cards), angle-bracket decorations, diamond markers (rotated squares replacing circles), diagonal slash dividers, perspective grids

**Important**: Font edges must NOT glow (no text-shadow bloom). Glow effects come from background radial gradients (`background-glow` class, `radial-gradient` behind elements). This applies to the clock, title, and all text elements.

**Color alignment with orbit page**: The landing page uses the same dual-accent scheme as the main orbit application:
- **Blue `#2563EB`** — Primary accent (clock, feature cards 01, section headers, industrial rails)
- **Amber `#EAB308`** — Secondary accent (time fragments, feature card 02/methodologies, deconstructed clock layers, accent diamonds, description rail)
- **Gray `#374151`** — Tertiary (feature card 03/focus blocks)
- Section header accent bars use blue→amber gradients to unify the palette

Key landing page components:
- `LiveClock` — Multi-layer clock: primary (Clash Display, blue bloom), deconstructed secondary (JetBrains Mono, -8° tilt, blurred, 6h time offset with reversed seconds), tertiary ghost (amber, 15° tilt, compressed)
- `BlueprintGrid` — CSS repeating-linear-gradient line grids, with radial mask fade
- `TimeFragments` — 5 floating oversized numbers positioned at viewport edges
- `ConstructivistGeometry` — Parallax-scrolling line networks: 14-line diagonal cluster, 10-line horizontal cluster, 5-line vertical cluster, rotated mass blocks, dashed deconstructed rings with ticks
- `RadialLineBurst` — conic-gradient ray burst (24 rays at 15° intervals)
- `DiagonalSlashDivider` — Twin diagonal lines with diamond center marker replacing traditional horizontal dividers
- `FeatureCard` — Avant-garde cards with 6px colored left border, oversized bleeding numbers, top blue bar accent
- `SectionStamp` — Industrial mono labels with square indicator dot and hard border

The page is divided into 4 sections separated by `DiagonalSlashDivider` + `MarqueeStrip` (24h scrolling time) pairs:
1. **Hero** — Full viewport with blueprint grid, radial burst, time fragments, clock housing, title with angle brackets, heavy CTA
2. **Core Systems** — 3 feature cards (01 Orbital Clock, 02 Six Methodologies, 03 Focus Blocks) on vertical industrial rail with diamond markers
3. **Workflow Timeline** — 4 steps (00:00/06:00/12:00/18:00) along 8px industrial rail, diamond node markers, angle-bracket framed content blocks
4. **CTA Zone** — Triple-nested frame (ghost→mid→heavy), diamond status indicator, heavy brutalist CTA button

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
