# Mobile Adaptation Design

**Date:** 2026-05-13
**Target:** OrbitAN responsive on phones (375-414px width)
**Strategy:** Responsive CSS + conditional rendering via `useMediaQuery` hook

## Section 1 — Core Layout: Mobile Day View

Desktop layout positions the Canvas clock `min(62vw, 68vh)` center, cards absolute-positioned on left (10%) and right (85%). This collapses completely on narrow screens.

**Mobile layout (≤768px):**
```
[TitleHeader compact]
[DateNav compact]
[迷你时钟 ~220px 居中]
[筛选 pills 横向滚动]
[任务卡片垂直列表 flex-col]
[底部浮动按钮栏 fixed bottom]
```

Implementation:
- New hook `src/hooks/useMediaQuery.ts` — returns boolean for `(max-width: 768px)`
- `src/app/orbit/page.tsx` — conditionally render mobile vs desktop layouts
- Cards in mobile mode use natural flex flow (no `computeCardPositions`, no absolute positioning, no `position` prop)
- `ScheduleItem` component receives `position?: CardPosition` — when undefined, renders as full-width flex child

## Section 2 — Mini Clock + Canvas

The `HybridClock` component and its Canvas engines (`orbital-engine.ts`, `isometric-engine.ts`) are completely reused — only the DOM container size changes.

|  | Desktop | Mobile |
|---|---|---|
| Container | `min(62vw, 68vh)` | `220px × 220px` |
| Interactive (click to create) | Yes | No |
| Focus arcs display | Yes | Yes (clickable) |
| `ConnectorArrows` | Yes | Hidden |

- Clock interaction disabled on mobile: `interactive={!isMobile && (isCreating || isFocusCreating)}`
- Task creation on mobile via `[+]` button → time picker flow instead of clock click
- `ConnectorArrows` component hidden on mobile (no side-cards to connect to)
- Canvas DPR and rendering unchanged — engines already handle any container size

## Section 3 — Card List: Vertical Flow

Desktop cards use absolute positioning from `computeCardPositions()`. On mobile:

- `computeCardPositions()` is never called — early return prevents unnecessary computation
- Cards render inside a `flex flex-col gap-3` container with `px-4` padding
- `ScheduleItem` receives no `position` prop → renders full-width, no translate(-50%, -50%)
- Card width: `100%` (constrained by parent padding), max-height from content
- `ScheduleCardWrapper` memo unchanged — just skips the position wrapper in mobile mode
- Progress bar, time display, task name all remain identical

## Section 4 — Bottom Floating Button Bar

Fixed at viewport bottom, above `safe-area-inset-bottom`. Mobile only.

```
┌─────────────────────────────────────────┐
│  筛选 pills: [全部] [工作] [学习] [会议] [个人]  │  ← horizontal scroll
│  [+ 新建]  [🪐 Orbit]  [📅 视图]  [⋯ 更多]     │  ← main actions
└─────────────────────────────────────────┘
```

**Filter pills row:**
- Horizontal scrollable container, `overflow-x-auto`
- 5 pills: All (0), Work (1), Study (2), Meeting (3), Personal (4)
- Active pill highlighted with type color
- Maps to keyboard shortcuts `0`-`4` on desktop

**Main action row:**
- `[+]` New task — opens `InlineTaskCreator` inline (existing component, needs mobile CSS)
- `[🪐]` Orbit Mode — toggles `isOrbitModeOpen` (existing state)
- `[📅]` View switch — cycles Day → Week → Month (uses existing `useViewNavigation`)
- `[⋯]` More — opens small menu: auto-arrange cards, open docs

**Safe area:** `padding-bottom: env(safe-area-inset-bottom, 1rem)`
**Visibility:** Only on mobile (`max-width: 768px`), replaces desktop hint bar + bottom controls
**Desktop: unchanged**

## Section 5 — Overlay Panels: Fullscreen on Mobile

### EditPanel
- Desktop: slides in from right, ~420px wide
- Mobile: fullscreen modal from bottom (`translateY`, rounded top corners), fills 100vw × 100vh

### MethodologyDrawer
- Desktop: slides in from right, ~520px wide
- Mobile: fullscreen from bottom, same animation pattern as EditPanel

### DeleteBubble
- Desktop: floating trash bubble near the card
- Mobile: centered bottom sheet with "Delete" / "Cancel" buttons, larger touch targets

### InlineTaskCreator / MethodPickerPopup / OrbitPlanPicker
- Desktop: centered popup
- Mobile: bottom sheet, full-width, 48px min touch targets

Implementation: each overlay reads `isMobile` from context or prop and switches between desktop (slide-in) and mobile (bottom sheet) variants.

## Section 6 — Week/Month Views

### Week View (`WeekGridView`)
- Desktop: 7-column grid with horizon-aligned lanes
- Mobile: single-column, 7 day cards stacked vertically, each showing its focus blocks inline. Horizontal scroll gesture to swipe between days.

### Month View (`MonthGridView`)
- Desktop: 7-column calendar grid
- Mobile: reduce cell padding, smaller day numbers (`text-xs`), fewer focus block dots shown (max 2 per cell)

Both views reuse existing components with responsive Tailwind classes (`md:grid-cols-7`, `grid-cols-1`).

## Section 7 — Landing & Docs Pages

These already use Tailwind responsive classes (`md:grid-cols-3`, `md:flex-row`). Minor fixes:

- Hero section: reduce `text-5xl` → `text-3xl` on mobile, `pt-24` → `pt-16`
- Nav header: logo only on mobile, hamburger menu for docs/orbit links
- Docs grid: `grid-cols-1` on mobile (already works via `md:` prefix)
- Footer: stack vertically on mobile

No structural changes needed — just adding mobile breakpoint overrides.

## Section 8 — Touch Interactions

Existing long-press (600ms) for delete already works on touch devices. Additions:

- **Swipe left on card → reveal delete** (optional enhancement, low priority)
- **Pull to refresh** on card list (not needed — data is localStorage, always fresh)
- **Touch-optimized time picker**: replace clock-click with two `<input type="time">` fields in the new task flow

## Section 9 — `useMediaQuery` Hook

New file: `src/hooks/useMediaQuery.ts`

```ts
"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
```

Usage throughout: `const isMobile = useMediaQuery("(max-width: 768px)");`

## Out of Scope

- Tablet-specific layout (iPad) — 768px breakpoint covers tablets in portrait, landscape uses desktop
- PWA / offline mode
- Push notifications
- Custom mobile gesture library
