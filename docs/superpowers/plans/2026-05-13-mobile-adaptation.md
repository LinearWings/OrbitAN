# Mobile Adaptation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make OrbitAN fully usable on phones (375-414px width) via responsive CSS + conditional rendering at 768px breakpoint.

**Architecture:** Add `useMediaQuery` hook to detect mobile, then conditionally switch layouts in `page.tsx` — mini Canvas clock (220px), vertical card list, bottom floating button bar replacing keyboard shortcuts. All overlays become bottom sheets. Canvas engines (`orbital-engine.ts`, `isometric-engine.ts`) are reused unchanged — only DOM containers resize.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, Canvas 2D (unchanged)

---

### Task 1: Create useMediaQuery hook

**Files:**
- Create: `src/hooks/useMediaQuery.ts`

- [ ] **Step 1: Create the hook**

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

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useMediaQuery.ts
git commit -m "feat: add useMediaQuery hook for responsive breakpoint detection"
```

---

### Task 2: Restructure page.tsx for mobile core layout

**Files:**
- Modify: `src/app/orbit/page.tsx`

This is the largest task — all mobile conditional rendering lives in the main page component.

- [ ] **Step 1: Add import and hook call**

At the top of `page.tsx`, add the import:

```ts
import { useMediaQuery } from "@/hooks/useMediaQuery";
```

Inside the `Home()` function, after `const { viewMode, navigateToDay } = useViewNavigation();`, add:

```ts
const isMobile = useMediaQuery("(max-width: 768px)");
```

- [ ] **Step 2: Clock container — conditional sizing**

Find the clock container div (around line 683):

```tsx
{viewMode === "day" ? (
  <div className="relative z-10 mx-auto flex items-center justify-center"
    style={{
      width: "min(62vw, 68vh)",
      height: "min(62vw, 68vh)",
      marginTop: "max(1rem, 2vh)",
    }}
  >
```

Replace with:

```tsx
{viewMode === "day" ? (
  <div className="relative z-10 mx-auto flex items-center justify-center"
    style={{
      width: isMobile ? "220px" : "min(62vw, 68vh)",
      height: isMobile ? "220px" : "min(62vw, 68vh)",
      marginTop: isMobile ? "0.5rem" : "max(1rem, 2vh)",
    }}
  >
```

And on the `<HybridClock>` component, change:

```tsx
interactive={isCreating || isFocusCreating}
```

to:

```tsx
interactive={!isMobile && (isCreating || isFocusCreating)}
```

- [ ] **Step 3: ConnectorArrows — hide on mobile**

Find:

```tsx
{viewMode === "day" && <ConnectorArrows />}
```

Replace with:

```tsx
{viewMode === "day" && !isMobile && <ConnectorArrows />}
```

- [ ] **Step 4: Top stats bar — reposition on mobile**

Find the stats bar div (around line 666) with `className="relative z-20 mx-auto flex items-center justify-center"`. Change `style={{ marginTop: ... }}` to:

```tsx
style={{ marginTop: isMobile ? "0.25rem" : (viewMode === "day" ? "max(5rem, 8vh)" : "1rem") }}
```

On the inner stats container, add on mobile wrap:

The stats bar content stays the same — just the margin changes.

- [ ] **Step 5: Card rendering — conditional desktop/mobile**

Find the cards section (around line 761):

```tsx
{viewMode === "day" && (
  <>
  {tasksForDate.length === 0 ? null : (
    tasksForDate.map((task, index) => {
      ...
      return (
        <div key={task.id} ...>
          <ScheduleCardWrapper
            ...
            position={positions[index]!}
            ...
          />
        </div>
      );
    })
  )}
  </>
)}
```

Replace with:

```tsx
{viewMode === "day" && (
  <div className={isMobile
    ? "relative z-10 w-full px-4 flex flex-col gap-3 mt-4 pb-32"
    : undefined
  }>
    {tasksForDate.length === 0 ? (
      isMobile ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/10">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <p className="mt-4 text-sm text-white/15" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            暂无任务
          </p>
          <p className="mt-1 text-xs text-white/8" style={{ fontFamily: "'Satoshi', sans-serif" }}>
            点击下方 + 创建第一个任务
          </p>
        </div>
      ) : null
    ) : (
      tasksForDate.map((task, index) => {
        const linkedFb = focusBlocksForDate.find(fb => fb.linkedTaskId === task.id);
        const linkedFocusColor = linkedFb
          ? FOCUS_METHOD_COLORS[linkedFb.method]
          : task.method ? FOCUS_METHOD_COLORS[task.method] : undefined;
        const isDelTarget = deleteTarget?.type === "task" && deleteTarget.id === task.id;

        return (
          <div
            key={task.id}
            {...(!isMobile ? {
              onPointerDown: (e: React.PointerEvent) => {
                if (e.pointerType !== "mouse" || e.button !== 0 || e.shiftKey) return;
                const el = e.currentTarget;
                const timer = setTimeout(() => handleDeleteStart(task.id, "task", e.clientX, e.clientY), 600);
                const clear = () => { clearTimeout(timer); el.removeEventListener("pointerup", clear); el.removeEventListener("pointerleave", clear); };
                el.addEventListener("pointerup", clear);
                el.addEventListener("pointerleave", clear);
              },
            } : {})}
            style={!isMobile ? { zIndex: isDelTarget ? 96 : undefined } : undefined}
          >
            <ScheduleCardWrapper
              task={task}
              index={index}
              position={isMobile ? undefined : positions[index]!}
              selectedTaskId={selectedTaskId}
              activeFilter={activeFilter}
              onSelectTask={handleSelectTask}
              onProgress={handleProgress}
              onUpdateTask={handleUpdateTask}
              linkedFocusColor={linkedFocusColor}
              isOrbitMode={isOrbitModeOpen}
              onSetOrbitPlan={handleSetOrbitPlan}
              isDeleteTarget={isDelTarget}
              dimmed={!!deleteTarget && !isDelTarget}
            />
          </div>
        );
      })
    )}
  </div>
)}
```

- [ ] **Step 6: Add MobileBottomBar import and render**

Add import at top:

```ts
import MobileBottomBar from "@/components/layout/MobileBottomBar";
```

At the bottom of the `main` element, before `</main>`, add:

```tsx
{isMobile && (
  <MobileBottomBar
    activeFilter={activeFilter}
    onFilterChange={(f) => dispatch?.({ type: "SET_FILTER", payload: f })}
    isOrbitMode={isOrbitModeOpen}
    onToggleOrbit={toggleOrbitMode}
    viewMode={viewMode}
    onCycleView={() => {
      const modes = ["day", "week", "month"] as const;
      const i = modes.indexOf(viewMode);
      setViewMode(modes[(i + 1) % 3]!);
    }}
    onNewTask={handleStartCreate}
    onAutoArrange={() => { setManualOverrides(new Map()); setLayoutKey((k) => k + 1); }}
    onOpenDocs={() => setIsDocsOverlayOpen(true)}
  />
)}
```

Note: `dispatch` and `setViewMode` need to be accessible. `setViewMode` comes from `useViewNavigation()`. For `dispatch`, import `useAppContext` is already present — add `const { state, dispatch } = useAppContext();` if not already destructured that way.

- [ ] **Step 7: Hide desktop bottom controls on mobile**

On the existing bottom controls div (around line 810), add `!isMobile &&`:

```tsx
{!isMobile && (
  <div className="pointer-events-auto fixed bottom-[max(1.5rem,3vh)] left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2">
    {/* ... existing desktop controls ... */}
  </div>
)}
```

Same for the hint bar below it — wrap in `!isMobile && (...)`.

- [ ] **Step 8: Pass isMobile to EditPanel**

Find `<EditPanel />` and the `OrbitModeTransition`. EditPanel is thin wrapper — the actual mobile styling goes into OrbitalLaunchWizard. For now just render it. The mobile overlay adaptations happen in Tasks 5-10.

- [ ] **Step 9: Commit**

```bash
git add src/app/orbit/page.tsx
git commit -m "feat: add mobile conditional layout to orbit page"
```

---

### Task 3: Create MobileBottomBar component

**Files:**
- Create: `src/components/layout/MobileBottomBar.tsx`

- [ ] **Step 1: Create component**

```tsx
"use client";

const FILTER_OPTIONS = [
  { key: "all", label: "全部", color: "#ffffff" },
  { key: "work", label: "工作", color: "#3B82F6" },
  { key: "study", label: "学习", color: "#EAB308" },
  { key: "meeting", label: "会议", color: "#4B5563" },
  { key: "personal", label: "个人", color: "#78716C" },
] as const;

interface MobileBottomBarProps {
  activeFilter: string;
  onFilterChange: (f: string) => void;
  isOrbitMode: boolean;
  onToggleOrbit: () => void;
  viewMode: string;
  onCycleView: () => void;
  onNewTask: () => void;
  onAutoArrange: () => void;
  onOpenDocs: () => void;
}

export default function MobileBottomBar({
  activeFilter,
  onFilterChange,
  isOrbitMode,
  onToggleOrbit,
  viewMode,
  onCycleView,
  onNewTask,
  onAutoArrange,
  onOpenDocs,
}: MobileBottomBarProps) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 flex flex-col gap-2 px-3 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
      style={{
        background: "linear-gradient(to top, rgba(8,8,8,0.98) 0%, rgba(8,8,8,0.9) 70%, rgba(8,8,8,0) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onFilterChange(opt.key)}
            className="shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-medium transition-all"
            style={{
              background: activeFilter === opt.key ? `${opt.color}20` : "rgba(255,255,255,0.04)",
              border: activeFilter === opt.key ? `1px solid ${opt.color}40` : "1px solid rgba(255,255,255,0.06)",
              color: activeFilter === opt.key ? opt.color : "rgba(255,255,255,0.4)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Main action buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onNewTask}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.2)",
            color: "#60A5FA",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
          新建
        </button>

        <button
          onClick={onToggleOrbit}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
            isOrbitMode ? "bg-amber-500/15 border border-amber-500/25" : ""
          }`}
          style={isOrbitMode ? { color: "#FBBF24" } : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
        >
          <span className="text-sm">🪐</span>
          Orbit
        </button>

        <button
          onClick={onCycleView}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="1" y="1" width="5" height="5" rx="1" />
            <rect x="8" y="1" width="5" height="5" rx="1" />
            <rect x="1" y="8" width="5" height="5" rx="1" />
            <rect x="8" y="8" width="5" height="5" rx="1" />
          </svg>
          {viewMode === "day" ? "日" : viewMode === "week" ? "周" : "月"}
        </button>

        <button
          onClick={onAutoArrange}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all shrink-0"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
          title="整理"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3.5" y1="1" x2="3.5" y2="13" />
            <line x1="7" y1="4" x2="7" y2="13" />
            <line x1="10.5" y1="1" x2="10.5" y2="13" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

Add `no-scrollbar` to `globals.css`:

```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/MobileBottomBar.tsx src/app/globals.css
git commit -m "feat: add MobileBottomBar component with filter pills and actions"
```

---

### Task 4: Adapt ScheduleItem for mobile (no position prop)

**Files:**
- Modify: `src/components/schedule/ScheduleItem.tsx`
- Modify: `src/components/schedule/ScheduleItem.tsx` — type `CardPosition`

The `ScheduleItem` component currently uses `translate(-50%, -50%)` to center on its `position.left`/`position.top`. When `position` is undefined, it should render as a normal full-width block.

- [ ] **Step 1: Check CardPosition type**

Read `src/components/schedule/ScheduleItem.tsx` for the `CardPosition` export. The type should allow undefined:

```ts
export interface CardPosition {
  left: number;
  top: number;
  isLeftSide?: boolean;
  taskId?: string;
}
```

Already exported — no change needed. The prop will just be optional.

- [ ] **Step 2: Check the component's position usage**

In `ScheduleItem`, the `position` prop is used in the outer div's `style`. Find the wrapper div and make it conditional. Read the component to identify the exact line.

The outer wrapper likely has:

```tsx
style={{
  position: "absolute",
  left: position.left + "%",
  top: position.top + "%",
  transform: "translate(-50%, -50%)",
  width: "min(28vw, 240px)",
}}
```

Change to conditional:

```tsx
style={position ? {
  position: "absolute",
  left: position.left + "%",
  top: position.top + "%",
  transform: "translate(-50%, -50%)",
  width: "min(28vw, 240px)",
} : {
  // natural flow — no absolute positioning
}}
```

- [ ] **Step 2: Update the component to accept optional position**

Read the full `ScheduleItem` component, find where `position` is typed in the props interface. Change the prop type from `position: CardPosition` to `position?: CardPosition`.

Apply the conditional styling above at the component's outer element.

- [ ] **Step 3: Commit**

```bash
git add src/components/schedule/ScheduleItem.tsx
git commit -m "refactor: support optional position prop in ScheduleItem for mobile flow layout"
```

---

### Task 5: Mobile overlays — EditPanel/OrbitalLaunchWizard as bottom sheet

**Files:**
- Modify: `src/components/editor/OrbitalLaunchWizard.tsx`

- [ ] **Step 1: Add isMobile prop and bottom sheet styling**

Read `OrbitalLaunchWizard.tsx` to understand the current structure. The component renders the task editor wizard (step naming + step positioning).

Add `isMobile?: boolean` prop. When true:
- Container becomes `fixed inset-0 z-50` fullscreen
- Background: dark overlay
- Content panel: `fixed bottom-0 inset-x-0 rounded-t-3xl` slides up from bottom
- Add close handle bar at top (a 32px gray pill)

```tsx
interface OrbitalLaunchWizardProps {
  isMobile?: boolean;  // new
}

// In the return:
{isMobile ? (
  <>
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />
    <div className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl p-6 pt-4"
      style={{ background: "rgba(10,10,15,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Close handle */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-1 rounded-full bg-white/15" />
      </div>
      {/* Existing wizard content */}
      ...
    </div>
  </>
) : (
  /* Existing desktop layout */
  ...
)}
```

- [ ] **Step 2: Pass isMobile from page.tsx**

In `page.tsx`, find where `OrbitalLaunchWizard` is used (it's inside `EditPanel` which is just a wrapper). Since EditPanel is thin, either:
- Pass `isMobile` through EditPanel to OrbitalLaunchWizard
- Or check `useMediaQuery` directly inside OrbitalLaunchWizard

Simpler: use `useMediaQuery` directly inside `OrbitalLaunchWizard`:

```ts
const isMobile = useMediaQuery("(max-width: 768px)");
```

- [ ] **Step 3: Commit**

```bash
git add src/components/editor/OrbitalLaunchWizard.tsx
git commit -m "feat: add mobile bottom sheet variant to OrbitalLaunchWizard"
```

---

### Task 6: Mobile MethodologyDrawer as bottom sheet

**Files:**
- Modify: `src/components/orbital/MethodologyDrawer.tsx`

- [ ] **Step 1: Add isMobile detection and bottom sheet variant**

Read the full `MethodologyDrawer.tsx`. It currently slides in from the right.

Add `useMediaQuery` import and call:

```ts
const isMobile = useMediaQuery("(max-width: 768px)");
```

When `isMobile && isOpen`:
- Fullscreen overlay from bottom
- `fixed inset-0 z-50`
- Content: `fixed bottom-0 inset-x-0 rounded-t-3xl h-[85vh] overflow-y-auto`
- Close handle bar at top
- Close button (X) in top-right

When not mobile: keep existing right-slide-in behavior.

Changes:
- The outer condition for `isOpen` stays
- Inside, branch on `isMobile` for different container/animation styles

- [ ] **Step 2: Commit**

```bash
git add src/components/orbital/MethodologyDrawer.tsx
git commit -m "feat: add mobile bottom sheet variant to MethodologyDrawer"
```

---

### Task 7: Mobile task creation — InlineTaskCreator with time picker

**Files:**
- Modify: `src/components/editor/InlineTaskCreator.tsx`

- [ ] **Step 1: Read current implementation**

Read `src/components/editor/InlineTaskCreator.tsx` to understand its current structure. It currently shows click-phase UI ("click clock to set start/end time").

- [ ] **Step 2: Add mobile time picker variant**

When `isMobile` (detected via `useMediaQuery`):
- Instead of "click clock" instructions, show two `<input type="time">` fields
- Name input field
- Type selector (work/study/meeting/personal grid)
- Create button
- Cancel button

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

// When isMobile and isOpen, render a bottom sheet with:
// - Start time: <input type="time" value={startTime} onChange={...} />
// - End time: <input type="time" value={endTime} onChange={...} />
// - Name: <input type="text" placeholder="任务名称" />
// - Type: 4-button grid for work/study/meeting/personal
// - [Create] [Cancel] buttons
```

Desktop: keep existing behavior (click clock).

- [ ] **Step 2: Commit**

```bash
git add src/components/editor/InlineTaskCreator.tsx
git commit -m "feat: add mobile time picker variant to InlineTaskCreator"
```

---

### Task 8: Week/Month views responsive grid

**Files:**
- Modify: `src/components/layout/WeekGridView.tsx`
- Modify: `src/components/layout/MonthGridView.tsx`

- [ ] **Step 1: WeekGridView — single column on mobile**

Read `WeekGridView.tsx`. It likely uses a grid with 7 columns.

Add `isMobile` detection. When mobile:
- Change from 7-column grid to single-column stacked day cards
- Each day card shows its focus blocks inline
- Swipe left/right to move between days (or just use day buttons)

Tailwind approach: the grid should already have classes like `grid grid-cols-7` — add `max-md:grid-cols-1`.

- [ ] **Step 2: MonthGridView — compact cells**

Read `MonthGridView.tsx`. On mobile:
- Reduce font sizes (`text-xs` for day numbers)
- Reduce padding in cells (`p-1` vs `p-2`)
- Show max 2 focus block dots per cell
- Keep 7-column grid but make it tighter

Add Tailwind responsive classes.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/WeekGridView.tsx src/components/layout/MonthGridView.tsx
git commit -m "refactor: add responsive grid layout to week and month views"
```

---

### Task 9: Landing/docs responsive fixes

**Files:**
- Modify: `src/app/(landing)/layout.tsx`
- Modify: `src/app/(landing)/page.tsx`

- [ ] **Step 1: Landing layout — mobile nav**

In `(landing)/layout.tsx`, the header nav has desktop links. On mobile:
- Show only "OrbitAN" logo on the left
- Hamburger menu button on the right that reveals a dropdown with Docs/Orbit links + LangSwitch

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

// In header: conditionally render nav links or hamburger
{isMobile ? (
  <MobileNav links={[...]} currentLang={lang} />
) : (
  <nav className="flex items-center gap-5">...</nav>  // existing
)}
```

Add a simple `MobileNav` inline or in a new small component. Hamburger opens a small dropdown menu.

- [ ] **Step 2: Landing page — responsive typography**

In `(landing)/page.tsx`:
- Hero `text-5xl md:text-7xl` → keep, it already has responsive prefixes
- Add `px-4` on mobile sections instead of `px-8`
- Reduce `pt-24 pb-36` → `pt-16 pb-24` on mobile
- Features grid already has `grid-cols-1 md:grid-cols-3` — works
- How-it-works grid already has `grid-cols-1 md:grid-cols-4` — works

Minor inline style adjustments — add Tailwind responsive prefixes.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(landing\)/layout.tsx src/app/\(landing\)/page.tsx
git commit -m "refactor: responsive landing page and mobile nav"
```

---

### Task 10: DeleteBubble mobile variant

**Files:**
- Modify: `src/components/editor/DeleteBubble.tsx`

- [ ] **Step 1: Add mobile bottom confirm**

Read `DeleteBubble.tsx`. On mobile, instead of floating trash bubble near the card:
- Show a fixed bottom bar: "删除任务？" with [取消] [确认删除] buttons
- Red "确认删除" button with hold-to-confirm (same 2s progress ring logic)

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");

if (isMobile) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] flex items-center justify-between px-4 py-4"
      style={{ background: "rgba(10,8,8,0.98)", borderTop: "1px solid rgba(239,68,68,0.15)", paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <button onClick={onCancel} className="text-white/40 text-sm px-4 py-2">取消</button>
      <span className="text-white/60 text-sm">删除任务</span>
      <button onClick={onDelete} className="text-red-400 text-sm font-semibold px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
        确认删除
      </button>
    </div>
  );
}
// else: existing desktop floating bubble behavior
```

- [ ] **Step 2: Commit**

```bash
git add src/components/editor/DeleteBubble.tsx
git commit -m "feat: mobile bottom bar variant for delete confirmation"
```

---

### Task 11: TitleHeader and DateNav compact mobile

**Files:**
- Modify: `src/components/layout/TitleHeader.tsx`
- Modify: `src/components/layout/DateNav.tsx`

- [ ] **Step 1: TitleHeader — compact on mobile**

In `TitleHeader.tsx`, add `useMediaQuery`:

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");
```

On mobile:
- `absolute top-8 left-8` → `absolute top-3 left-4`
- Font size smaller: `clamp(1.6rem, 2.8vw, 2.8rem)` → `clamp(1.2rem, 4vw, 1.6rem)`
- Hide tagline subtext
- Hide decorative divider
- Hide `?` docs button (moved to bottom bar)

- [ ] **Step 2: DateNav — compact on mobile**

In `DateNav.tsx`, add `useMediaQuery`:

```tsx
const isMobile = useMediaQuery("(max-width: 768px)");
```

On mobile:
- `absolute top-8 right-8` → `absolute top-3 right-4`
- Smaller font for date display
- View mode tabs become icon-only (日/周/月)
- ← → navigation arrows smaller

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/TitleHeader.tsx src/components/layout/DateNav.tsx
git commit -m "refactor: compact mobile variants for TitleHeader and DateNav"
```

---

### Task 12: Build and verify

- [ ] **Step 1: Run the build**

```bash
"E:/DS AI Workspace/orbitan_git/node_modules/.bin/next" build 2>&1
# or: npx next build
```

- [ ] **Step 2: Fix any TypeScript or build errors**

Check the build output. Fix any missing imports, type errors, or undefined variables introduced by the mobile changes.

- [ ] **Step 3: Verify mobile layout in dev server**

```bash
pnpm dev
```

Open `http://localhost:3000/OrbitAN` in Chrome, set viewport to 375×812 (iPhone). Verify:
- Landing page renders with mobile nav
- Orbit page shows mini clock + card list + bottom bar
- Creating a task via [+] button works
- Orbit Mode toggle works
- Week/Month view switches work
- Delete flow works
- No layout overflow / horizontal scroll

- [ ] **Step 4: Commit any remaining fixes and push**

```bash
git add -A
git commit -m "fix: mobile build and layout adjustments"
git push origin master
```
