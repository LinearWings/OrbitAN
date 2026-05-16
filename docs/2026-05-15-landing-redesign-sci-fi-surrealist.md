# Landing Page Sci-Fi Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Temporal Brutalism landing page with a precision sci-fi control station aesthetic — deep space, Tyndall beams, instrument panels, orbital rings.

**Architecture:** Single-page rewrite targeting `src/app/(landing)/page.tsx`, with CSS cleanup in `globals.css` (~960 lines removed, ~200 lines added), i18n text updates, and LiveClock simplification. No new dependencies.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript 6, Tailwind CSS v4, Canvas 2D (LiveClock unchanged core)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `.gitignore` | Modify | Add `.agents/` and `.clawhub/` entries |
| `src/app/globals.css` | Major modify | Remove brutalism effects (~960 lines), add sci-fi effects (~200 lines) |
| `src/lib/i18n.ts` | Modify | Update landing text values, keep docs/methodology keys intact |
| `src/components/landing/LiveClock.tsx` | Minor modify | Remove deconstructed + tertiary clock layers, keep primary only |
| `src/app/(landing)/page.tsx` | Complete rewrite | New landing page with all sci-fi components |

---

### Task 1: Update .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add .agents and .clawhub entries**

Append to `.gitignore`:

```
# agent skills & clawhub
.agents/
.clawhub/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add .agents/ and .clawhub/ to .gitignore"
```

---

### Task 2: Remove Brutalism CSS from globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Remove chromatic-aberration keyframes and .chromatic class**

Remove lines 123-139 (`@keyframes chromatic-aberration` block) and lines 531-533 (`.chromatic` class).

Edit 1 — remove the keyframes:
```
old_string:
/* ===== Animations ===== */
@keyframes chromatic-aberration {
  0% {
    text-shadow:
      2px 0 0 rgba(41, 98, 255, 0),
      -2px 0 0 rgba(245, 197, 24, 0);
  }
  60% {
    text-shadow:
      4px 0 0 rgba(41, 98, 255, 0.5),
      -3px 0 0 rgba(245, 197, 24, 0.4);
  }
  100% {
    text-shadow:
      2px 0 0 rgba(41, 98, 255, 0.4),
      -2px 0 0 rgba(245, 197, 24, 0.3);
  }
}

new_string:
/* ===== Animations ===== */
```

Edit 2 — remove `.chromatic`:
```
old_string:
.chromatic {
  animation: chromaticShift 8s ease-in-out infinite;
}


new_string:

```

Edit 3 — also remove `@keyframes chromaticShift`:
Remove lines 518-530 (the chromaticShift keyframes block).

- [ ] **Step 2: Update body background to deep space**

Replace the body background-image (lines 86-105).

```
old_string:
body {
  background-color: #080808;
  /*
   * Constructivist composition — dark base with yellow/blue geometric forms.
   * High-contrast elements (circles, diagonals) are positioned on the left &
   * bottom periphery, away from right-side text content.
   * Film grain is composited on the canvas layer via drawFilmGrain.
   */
  background-image:
    /* ── Large constructivist circle (yellow) at bottom-left ── */
     radial-gradient(circle at 8% 85%, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.04) 35%, transparent 60%),
    /* ── Offset geometric circle (blue) at left-center ── */
    radial-gradient(circle at 22% 55%, rgba(37, 99, 235, 0.12) 0%, rgba(37, 99, 235, 0.03) 35%, transparent 55%),
    /* ── Bold diagonal band (yellow) from top-left to bottom ── */
    linear-gradient(150deg, transparent 20%, rgba(234, 179, 8, 0.08) 22%, rgba(234, 179, 8, 0.01) 24%, transparent 26%),
    /* ── Intersecting diagonal band (blue) from lower-left up ── */
    linear-gradient(65deg, transparent 52%, rgba(37, 99, 235, 0.07) 54%, rgba(37, 99, 235, 0.01) 56%, transparent 58%),
    /* ── Dark gradient base ── */
    linear-gradient(180deg, #080808 0%, #0C0C0E 40%, #0A0A0A 100%);
  background-attachment: fixed;
}

new_string:
body {
  background-color: #06080D;
  background-image:
    radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 40%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 50%);
  background-attachment: fixed;
}
```

- [ ] **Step 3: Remove entire brutalism landing effects section**

Remove everything from the comment `/* ══════════ BRUTALIST LANDING EFFECTS v3` through the end of the file (lines 444-1402). This removes: scanlines, bloom keyframes, chromatic shift, strobe, beam sweep, particle float, pulse ring, glitch text, hard cut, background glow, bloom text, neon border, light beam, lens flare, particle, pulse ring (class), light streak, spotlight, section number, diagonal divider, marquee, brutal CTA, oppressive frame, hard panel, parallax geo, time code, text bleed, heavy block, blueprint grid, constructivist line, brutalist mass, heavy frame, industrial rail, diamond marker, time fragment, deconstructed ring, radial burst, text fracture, angle bracket, industrial crosshair, section number brutalist, time conduit, avant card, diagonal slash, brutal CTA heavy, constellation dot, void block, section stamp, hero line burst, perspective grid, brutalist notch, clock housing, time mark.

Use an Edit that captures the unique section header comment and replaces through the end of the file with a closing comment.

```
old_string (first line):
/* ══════════════════════════════════════════════════════════════
   BRUTALIST LANDING EFFECTS v3 — FULL LIGHTING SPECTACLE
   ══════════════════════════════════════════════════════════════ */

...everything through end of file...

new_string:
/* ══════════════════════════════════════════════════════════════
   SCI-FI LANDING EFFECTS — ORBITAL CONTROL STATION
   ══════════════════════════════════════════════════════════════ */
```

Note: The exact Edit will use the unique first comment line as the old_string start anchor and capture through the last line. The new CSS will be added in the next task.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: remove brutalism landing effects from globals.css"
```

---

### Task 3: Add Sci-Fi Effects CSS

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append sci-fi effects CSS**

After the brutalism removal, append the following CSS at the end of `globals.css` (after the sci-fi section header comment):

```css

/* ── Nebula Glow (deep space atmospheric clouds) ── */
.nebula-glow {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
  animation: nebulaDrift 50s ease-in-out infinite;
}

@keyframes nebulaDrift {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(2%, -1.5%); }
  50% { transform: translate(-1%, 2%); }
  75% { transform: translate(-2%, -0.5%); }
}

/* ── Tyndall Beam — far field (wide, diffuse, violet) ── */
.tyndall-beam--far {
  position: fixed;
  pointer-events: none;
  width: 250%;
  height: 120px;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(99, 102, 241, 0.015) 25%,
    rgba(99, 102, 241, 0.04) 45%,
    rgba(99, 102, 241, 0.06) 50%,
    rgba(99, 102, 241, 0.04) 55%,
    rgba(99, 102, 241, 0.015) 75%,
    transparent 100%
  );
  filter: blur(80px);
  animation: farBeamRotate 40s ease-in-out infinite;
}

@keyframes farBeamRotate {
  0%, 100% { transform: rotate(-12deg); opacity: 0.7; }
  50% { transform: rotate(-8deg); opacity: 1; }
}

/* ── Tyndall Beam — near field (narrow, sharp, blue) ── */
.tyndall-beam--near {
  position: absolute;
  pointer-events: none;
  width: 200%;
  height: 2px;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(59, 130, 246, 0.01) 15%,
    rgba(59, 130, 246, 0.08) 40%,
    rgba(255, 255, 255, 0.04) 50%,
    rgba(59, 130, 246, 0.08) 60%,
    rgba(59, 130, 246, 0.01) 85%,
    transparent 100%
  );
  filter: blur(2px);
  animation: nearBeamSweep 25s ease-in-out infinite;
}

@keyframes nearBeamSweep {
  0%, 100% { transform: translateX(-30%) rotate(-25deg); opacity: 0.6; }
  50% { transform: translateX(10%) rotate(-25deg); opacity: 1; }
}

/* ── Star Point (distant star with micro-flicker) ── */
@keyframes starFlicker {
  0%, 100% { opacity: var(--star-base, 0.5); }
  30% { opacity: var(--star-peak, 0.9); }
  60% { opacity: var(--star-base, 0.5); }
  85% { opacity: var(--star-dip, 0.2); }
}

.star-point {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  background: white;
  animation: starFlicker var(--star-period, 4s) ease-in-out infinite;
  animation-delay: var(--star-delay, 0s);
}

/* ── Cosmic Dust (slow-rising particles in beam paths) ── */
@keyframes dustRise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: var(--dust-opacity, 0.6); }
  90% { opacity: var(--dust-opacity, 0.6); }
  100% { transform: translateY(-120px) translateX(var(--dust-drift, 15px)); opacity: 0; }
}

.cosmic-dust {
  position: absolute;
  pointer-events: none;
  width: var(--dust-size, 2px);
  height: var(--dust-size, 2px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  animation: dustRise var(--dust-duration, 14s) ease-out infinite;
  animation-delay: var(--dust-delay, 0s);
}

/* ── Orbit Ring (concentric ring around clock) ── */
@keyframes orbitRingRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-ring {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  border: 0.5px solid rgba(59, 130, 246, 0.15);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbitRingRotate var(--ring-speed, 90s) linear infinite;
}

/* ── Status Indicator Dot ── */
@keyframes statusPulse {
  0%, 100% { box-shadow: 0 0 4px var(--status-color, rgba(59,130,246,0.4)); }
  50% { box-shadow: 0 0 10px var(--status-color, rgba(59,130,246,0.7)); }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: statusPulse 3s ease-in-out infinite;
  animation-delay: var(--status-delay, 0s);
}

.status-dot--active {
  background: #F59E0B;
  --status-color: rgba(245, 158, 11, 0.6);
}

.status-dot--standby {
  background: rgba(59, 130, 246, 0.6);
  --status-color: rgba(59, 130, 246, 0.3);
}

/* ── Data Readout (small metric display) ── */
.data-readout {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.data-readout__label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.5625rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.15);
  text-transform: uppercase;
}

.data-readout__value {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.6);
}

/* ── Instrument Panel (feature card) ── */
.instrument-panel {
  background: rgba(10, 13, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 32px;
  position: relative;
  transition: border-color 0.3s ease,
              box-shadow 0.3s ease,
              transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.instrument-panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--panel-accent, #3B82F6);
  border-radius: 6px 6px 0 0;
}

.instrument-panel:hover {
  border-color: rgba(59, 130, 246, 0.25);
  box-shadow:
    0 0 30px rgba(59, 130, 246, 0.06),
    inset 0 0 30px rgba(59, 130, 246, 0.02);
  transform: translateY(-2px);
}

/* Panel accent variants */
.instrument-panel--amber { --panel-accent: #F59E0B; }
.instrument-panel--violet { --panel-accent: #6366F1; }

/* ── Instrument Button ── */
.instrument-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 44px;
  font-family: "Clash Display", sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 4px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.instrument-btn:hover {
  background: rgba(59, 130, 246, 0.22);
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow:
    0 0 40px rgba(59, 130, 246, 0.15),
    0 0 80px rgba(59, 130, 246, 0.04);
}

.instrument-btn:active {
  transform: scale(0.97);
}

/* ── Sequence Timeline Node ── */
.sequence-node {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.35);
  background: rgba(10, 13, 20, 0.9);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.sequence-node--active {
  border-color: rgba(59, 130, 246, 0.8);
  background: rgba(59, 130, 246, 0.2);
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.3);
}

/* ── Light Track (horizontal connector between nodes) ── */
.light-track {
  height: 1px;
  background: rgba(59, 130, 246, 0.15);
  flex: 1;
  min-width: 40px;
  align-self: center;
  position: relative;
  z-index: 1;
}

@keyframes lightFlow {
  from { left: 0%; opacity: 0; }
  50% { opacity: 0.8; }
  to { left: 100%; opacity: 0; }
}

.light-track::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.6);
  transform: translate(-50%, -50%);
  animation: lightFlow 4s ease-in-out infinite;
  animation-delay: var(--flow-delay, 0s);
}

/* ── Docking Status Ring (CTA spinner) ── */
@keyframes dockingSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.docking-ring {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.15);
  border-top-color: rgba(59, 130, 246, 0.5);
  animation: dockingSpin 3s linear infinite;
}

/* ── Instrument Divider (thin horizontal rule with center glow) ── */
.instrument-divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(59, 130, 246, 0.05) 20%,
    rgba(59, 130, 246, 0.15) 50%,
    rgba(59, 130, 246, 0.05) 80%,
    transparent 100%
  );
  margin: 0;
  border: 0;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add sci-fi landing effects — nebula, Tyndall beams, instrument panels"
```

---

### Task 4: Update i18n Translations

**Files:**
- Modify: `src/lib/i18n.ts`

- [ ] **Step 1: Update landing-specific translation values**

The docs/methodology/tutorial keys remain untouched. Only update the landing page keys.

Replace the landing-related keys in both `zh` and `en` blocks:

```typescript
// Updated zh block landing keys:
hero_tagline: "SCHEDULE MANAGEMENT SYSTEM",
hero_title_1: "轨道计划",
hero_title_2: "OrbitAN",
hero_title_3: "",
hero_desc: "24小时径向时钟。任务映射为轨道弧线，聚焦块标记在外环。六大方法论内建。",
hero_cta: "进入轨道",
learn_more: "系统概述",
features_title: "核心系统",
feature_clock_title: "轨道引擎",
feature_clock_desc: "24小时径向表盘，实时驱动。任务作为彗星弧线呈现在对应时间位置，六层同心轨道环自动分配重叠时段。",
feature_methods_title: "导航矩阵",
feature_methods_desc: "GTD 五阶段看板 · 番茄钟 25+5 计时 · 帕累托 80/20 评分 · 莫法特 8×25min 分段 · 豪威尔四象限 · SWOT 分析。六套导航算法内建于系统。",
feature_focus_title: "专注协议",
feature_focus_desc: "在时钟上划定时间段，选择方法论，系统以彩色弧线标记在轨道外环。重叠感知分配算法自动选择轨道层。",
how_title: "操作流程",
how_1_title: "设定视图",
how_1_desc: "选择日期，切换日/周/月视图，确定你的工作时间窗口。",
how_2_title: "添加任务",
how_2_desc: "在时钟表盘上设定起止时间，输入名称，选择类型。任务以弧线形态出现在轨道对应位置。",
how_3_title: "启动聚焦",
how_3_desc: "划定时间段，选择方法论。系统自动分配到合适轨道层，以方法论颜色标记。",
how_4_title: "回顾调整",
how_4_desc: "检查任务进度，调整计划安排，保持轨道稳定运行。",
cta_label: "系统就绪",
cta_body: "准备好开始你的轨道日程管理。",
cta_button: "进入系统",
footer_text: "OrbitAN · 轨道计划 · 日程轨道管理系统",

// Updated en block landing keys:
hero_tagline: "SCHEDULE MANAGEMENT SYSTEM",
hero_title_1: "Orbital Planning",
hero_title_2: "OrbitAN",
hero_title_3: "",
hero_desc: "24-hour radial clock. Tasks mapped as orbital arcs, focus blocks marked on outer rings. Six methodologies built in.",
hero_cta: "ENTER ORBIT",
learn_more: "System Overview",
features_title: "Core Systems",
feature_clock_title: "Orbit Engine",
feature_clock_desc: "24-hour radial dial, real-time driven. Tasks appear as comet arcs at their scheduled positions. Six concentric orbit rings with overlap-aware distribution.",
feature_methods_title: "Navigation Matrix",
feature_methods_desc: "GTD 5-stage kanban · Pomodoro 25+5 timer · Pareto 80/20 scoring · Moffatt 8×25min sessions · Howell quadrants · SWOT analysis. Six navigation algorithms built in.",
feature_focus_title: "Focus Protocol",
feature_focus_desc: "Define a time range on the clock face, select a methodology. The system marks it as a colored arc on the outer ring. Overlap-aware assignment auto-selects the orbit layer.",
how_title: "Workflow",
how_1_title: "Set View",
how_1_desc: "Choose a date, switch between Day/Week/Month views, define your working time window.",
how_2_title: "Add Tasks",
how_2_desc: "Click the clock face to set start and end times, enter a name, choose a type. Tasks appear as arcs at their orbital positions.",
how_3_title: "Start Focus",
how_3_desc: "Define a time range, select a methodology. The system auto-assigns it to the optimal orbit ring, color-coded by method.",
how_4_title: "Review",
how_4_desc: "Check task progress, adjust plans, keep the orbit running steady.",
cta_label: "SYSTEMS NOMINAL",
cta_body: "Ready to begin your orbital schedule management.",
cta_button: "ENTER SYSTEM",
footer_text: "OrbitAN · Orbital Planning · Schedule Management System",
```

Update using Edit tool — replace the zh block first, then the en block. Use the `hero_tagline` key as the starting anchor in each language block.

- [ ] **Step 2: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "feat: update landing page copy for sci-fi narrative"
```

---

### Task 5: Simplify LiveClock Component

**Files:**
- Modify: `src/components/landing/LiveClock.tsx`

- [ ] **Step 1: Remove deconstructed and tertiary clock layers**

Remove `deconTime` state, the deconstructed clock computation, and the two ghostly overlay spans. Keep only the primary clock.

Replace the entire file content:

```tsx
"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Background glow — radial pulse behind the clock */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "130%",
          height: "130%",
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 35%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          animation: "backgroundGlowPulse 3s ease-in-out infinite",
        }}
      />

      {/* Primary clock — clean, precise, no text-shadow bloom */}
      <span
        className="clock-digit select-none"
        style={{
          fontSize: "clamp(4rem, 14vw, 12rem)",
          color: "#3B82F6",
          lineHeight: 0.9,
          fontWeight: 700,
          position: "relative",
          zIndex: 2,
        }}
      >
        {time || "--:--:--"}
      </span>
    </div>
  );
}
```

Note: Since we removed `@keyframes backgroundGlowPulse` from globals.css in Task 2, we need to keep it. Add it back near the other retained animations:

```css
@keyframes backgroundGlowPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
```

Actually — check: `backgroundGlowPulse` was in the brutalism section (line 620-623). It was removed. We need to add it back if LiveClock uses it. The new LiveClock uses it inline. So add it to the sci-fi CSS section in Task 3.

Add this to the sci-fi CSS block (at the end, before file close):

```css
/* ── Clock Background Glow Pulse ── */
@keyframes backgroundGlowPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
```

Update Task 3 Step 1 to include this keyframe.

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/LiveClock.tsx
git commit -m "refactor: simplify LiveClock — remove deconstructed and tertiary layers"
```

---

### Task 6: Rewrite Landing Page

**Files:**
- Rewrite: `src/app/(landing)/page.tsx`

This is the main task. The file contains all inline components following the existing project pattern.

- [ ] **Step 1: Write the complete new landing page**

```tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LiveClock from "@/components/landing/LiveClock";

/* ══════════════════════════════════════════════
   DEEP SPACE LAYER — global background
   ══════════════════════════════════════════════ */

function NebulaGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
      <div className="nebula-glow" style={{
        top: "-20%", left: "20%",
        width: "min(60vw, 700px)", height: "min(60vw, 700px)",
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, rgba(59,130,246,0.03) 30%, transparent 60%)",
        animationDuration: "55s",
      }} />
      <div className="nebula-glow" style={{
        top: "30%", right: "-10%",
        width: "min(50vw, 600px)", height: "min(50vw, 600px)",
        background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(99,102,241,0.02) 35%, transparent 65%)",
        animationDuration: "60s",
        animationDelay: "-20s",
      }} />
      <div className="nebula-glow" style={{
        bottom: "-15%", left: "40%",
        width: "min(55vw, 650px)", height: "min(55vw, 650px)",
        background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, rgba(59,130,246,0.01) 40%, transparent 70%)",
        animationDuration: "65s",
        animationDelay: "-35s",
      }} />
    </div>
  );
}

function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() < 0.3 ? 2 : 1,
      baseOpacity: 0.3 + Math.random() * 0.5,
      peakOpacity: 0.5 + Math.random() * 0.5,
      dipOpacity: Math.random() * 0.2,
      period: 2 + Math.random() * 6,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          className="star-point"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            ["--star-base" as string]: s.baseOpacity,
            ["--star-peak" as string]: s.peakOpacity,
            ["--star-dip" as string]: s.dipOpacity,
            ["--star-period" as string]: `${s.period}s`,
            ["--star-delay" as string]: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function TyndallBeams() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 2 }}>
      {/* Far-field beams */}
      <div className="tyndall-beam--far" style={{ top: "10%", left: "-80%", transform: "rotate(-15deg)" }} />
      <div className="tyndall-beam--far" style={{ top: "60%", left: "-60%", transform: "rotate(-10deg)", animationDelay: "-20s" }} />
    </div>
  );
}

function NearFieldBeams() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 21 }}>
      <div className="tyndall-beam--near" style={{ top: "35%", animationDelay: "0s" }} />
      <div className="tyndall-beam--near" style={{ top: "55%", animationDelay: "-12s", animationDuration: "30s" }} />
      <div className="tyndall-beam--near" style={{ top: "75%", animationDelay: "-8s", animationDuration: "22s" }} />
    </div>
  );
}

function CosmicDustField() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 30 + Math.random() * 70,
      size: Math.random() < 0.4 ? 1 : 2,
      opacity: 0.3 + Math.random() * 0.4,
      drift: -10 + Math.random() * 20,
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 12,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 22 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="cosmic-dust"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            ["--dust-opacity" as string]: p.opacity,
            ["--dust-drift" as string]: `${p.drift}px`,
            ["--dust-duration" as string]: `${p.duration}s`,
            ["--dust-delay" as string]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   INSTRUMENT LAYER — clock + panels
   ══════════════════════════════════════════════ */

function OrbitRings() {
  const rings = [
    { size: 108, speed: 80, opacity: 0.10 },
    { size: 116, speed: 95, opacity: 0.08 },
    { size: 124, speed: 110, opacity: 0.07 },
    { size: 132, speed: 85, opacity: 0.06 },
    { size: 140, speed: 100, opacity: 0.05 },
    { size: 148, speed: 115, opacity: 0.04 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true" style={{ zIndex: 20 }}>
      {rings.map((r, i) => (
        <div
          key={i}
          className="orbit-ring"
          style={{
            width: `${r.size}%`,
            height: `${r.size}%`,
            borderColor: `rgba(59,130,246,${r.opacity})`,
            ["--ring-speed" as string]: `${r.speed}s`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
    </div>
  );
}

function StatusIndicators({ count = 6 }: { count?: number }) {
  return (
    <div className="flex items-center gap-4" style={{ zIndex: 30 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`status-dot ${i < 3 ? "status-dot--active" : "status-dot--standby"}`}
          style={{ ["--status-delay" as string]: `${i * 0.4}s` }}
          title={`Methodology ${i + 1}`}
        />
      ))}
    </div>
  );
}

function DataReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="data-readout">
      <span className="data-readout__label">{label}</span>
      <span className="data-readout__value">{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION 2 — Instrument Panel
   ══════════════════════════════════════════════ */

function InstrumentPanel({
  accent,
  title,
  desc,
}: {
  accent: "blue" | "amber" | "violet";
  title: string;
  desc: string;
}) {
  const accentClass =
    accent === "amber" ? "instrument-panel--amber" :
    accent === "violet" ? "instrument-panel--violet" : "";

  return (
    <div className={`instrument-panel ${accentClass}`}>
      <h3 style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: "1.25rem",
        fontWeight: 600,
        color: "rgba(255,255,255,0.85)",
        marginBottom: 16,
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "'Satoshi', sans-serif",
        fontSize: "0.875rem",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.3)",
      }}>
        {desc}
      </p>
      {/* Decorative data trace — subtle schematic lines */}
      <div style={{
        marginTop: 20,
        height: 20,
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
      }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${4 + Math.sin(i * 0.8) * 8 + Math.random() * 10}px`,
            background: accent === "amber" ? "rgba(245,158,11,0.15)" :
                        accent === "violet" ? "rgba(99,102,241,0.12)" :
                        "rgba(59,130,246,0.12)",
            borderRadius: "1px 1px 0 0",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION 3 — Sequence Timeline
   ══════════════════════════════════════════════ */

interface Step {
  time: string;
  title: string;
  desc: string;
}

function SequenceTimeline({ steps }: { steps: Step[] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: i < steps.length - 1 ? "1 1 0" : "0 0 auto",
          minWidth: 0,
        }}>
          {/* Time code */}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.06em",
            marginBottom: 14,
          }}>
            {step.time}
          </span>
          {/* Node + track row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}>
            <div className="sequence-node sequence-node--active" />
            {i < steps.length - 1 && (
              <div className="light-track" style={{ ["--flow-delay" as string]: `${i * 1}s` }} />
            )}
          </div>
          {/* Content */}
          <div style={{ marginTop: 16, textAlign: "center", padding: "0 8px" }}>
            <h4 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              marginBottom: 6,
            }}>
              {step.title}
            </h4>
            <p style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.2)",
            }}>
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION 4 — CTA
   ══════════════════════════════════════════════ */

function DockingCTA({
  statusLabel,
  prompt,
  buttonText,
  href,
}: {
  statusLabel: string;
  prompt: string;
  buttonText: string;
  href: string;
}) {
  return (
    <div style={{
      position: "relative",
      background: "rgba(10,13,20,0.7)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 6,
      padding: "clamp(3rem, 8vw, 5rem) 0",
      textAlign: "center",
      overflow: "hidden",
    }}>
      {/* Docking beam behind the panel */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
      }} />

      {/* Docking indicator */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 20,
        position: "relative",
      }}>
        <div className="docking-ring" />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.625rem",
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.15)",
          textTransform: "uppercase",
        }}>
          {statusLabel}
        </span>
      </div>

      <p style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
        fontWeight: 600,
        color: "rgba(255,255,255,0.75)",
        marginBottom: 32,
        position: "relative",
      }}>
        {prompt}
      </p>

      <Link href={href} className="instrument-btn" style={{ position: "relative" }}>
        {buttonText}
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MOUSE SPOTLIGHT — retained, reduced intensity
   ══════════════════════════════════════════════ */

function MouseSpotlight() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        background: `radial-gradient(circle 350px at ${pos.x}px ${pos.y}px,
          rgba(59,130,246,0.04) 0%,
          rgba(59,130,246,0.02) 30%,
          transparent 60%)`,
        transition: "background 0.4s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

/* ══════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════ */

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  const [dateStr, setDateStr] = useState("");
  const [utcStr, setUtcStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setDateStr(`${y}.${m}.${d}`);
    const offset = -now.getTimezoneOffset() / 60;
    setUtcStr(`UTC${offset >= 0 ? "+" : ""}${offset}`);
  }, []);

  const workflowSteps: Step[] = [
    { time: "00", title: t.how_1_title, desc: t.how_1_desc },
    { time: "06", title: t.how_2_title, desc: t.how_2_desc },
    { time: "12", title: t.how_3_title, desc: t.how_3_desc },
    { time: "18", title: t.how_4_title, desc: t.how_4_desc },
  ];

  return (
    <div style={{ background: "#06080D", color: "rgba(255,255,255,0.85)" }}>
      {/* ══════ Deep Space Layer (global, fixed) ══════ */}
      <NebulaGlow />
      <StarField />
      <TyndallBeams />
      <MouseSpotlight />

      {/* ══════════════════════════════════════════════
          SECTION 1: ORBITAL BASELINE (HERO)
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <NearFieldBeams />
        <CosmicDustField />
        <OrbitRings />

        {/* Data readouts — top left */}
        <div style={{
          position: "absolute",
          top: "clamp(2rem, 6vh, 4rem)",
          left: "clamp(1rem, 4vw, 3rem)",
          display: "flex",
          gap: "clamp(1.5rem, 4vw, 3rem)",
          zIndex: 30,
        }}>
          <DataReadout label="LOCAL TIME" value={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })} />
          <DataReadout label="DATE" value={dateStr || "----.--.--"} />
          <DataReadout label="TZ" value={utcStr || "UTC+8"} />
        </div>

        {/* Central clock */}
        <div style={{
          position: "relative",
          zIndex: 25,
          animation: "fade-in 0.8s ease-out forwards",
        }}>
          <LiveClock />
        </div>

        {/* Status indicators below clock */}
        <div style={{
          marginTop: "clamp(1.5rem, 3vh, 2.5rem)",
          zIndex: 30,
          animation: "fade-in 0.6s ease-out 0.3s forwards",
          opacity: 0,
        }}>
          <StatusIndicators count={6} />
        </div>

        {/* Title */}
        <div style={{
          marginTop: "clamp(1.5rem, 3vh, 2.5rem)",
          textAlign: "center",
          zIndex: 30,
          animation: "fade-in 0.6s ease-out 0.5s forwards",
          opacity: 0,
        }}>
          <h1 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            fontWeight: 600,
            lineHeight: 1.1,
            color: "rgba(255,255,255,0.85)",
          }}>
            {t.hero_title_1}
          </h1>
          {/* Instrument divider */}
          <hr className="instrument-divider" style={{ width: "clamp(120px, 20vw, 200px)", margin: "16px auto" }} />
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.25)",
            maxWidth: 480,
            margin: "0 auto",
          }}>
            {t.hero_desc}
          </p>
        </div>

        {/* CTA + secondary link */}
        <div style={{
          marginTop: "clamp(2rem, 5vh, 3.5rem)",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: "clamp(1.5rem, 4vw, 3rem)",
          animation: "fade-in 0.5s ease-out 0.7s forwards",
          opacity: 0,
        }}>
          <Link href="/orbit" className="instrument-btn">
            {t.hero_cta}
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <a href="#systems" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.625rem",
            color: "rgba(255,255,255,0.12)",
            textDecoration: "none",
            letterSpacing: "0.08em",
          }}>
            {t.learn_more}
            <span style={{ display: "block", marginTop: 4, color: "rgba(59,130,246,0.2)", fontSize: "0.75rem" }}>↓</span>
          </a>
        </div>

        {/* Bottom indicator — thin vertical line */}
        <div style={{
          position: "absolute",
          bottom: "clamp(2rem, 5vh, 3rem)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
        }}>
          <div style={{ width: 1, height: 40, background: "rgba(59,130,246,0.15)" }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2: SYSTEM COMPONENTS
          ══════════════════════════════════════════════ */}
      <section id="systems" className="relative px-4 md:px-8 py-28 md:py-36 max-w-5xl mx-auto overflow-hidden" style={{ scrollMarginTop: 72 }}>
        <NearFieldBeams />

        {/* Section header */}
        <div className="flex items-center gap-5 mb-16 relative" style={{ zIndex: 25 }}>
          <div style={{ width: 36, height: 2, background: "#3B82F6", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
          }}>
            {t.features_title}
          </span>
          <hr className="instrument-divider" style={{ flex: 1 }} />
        </div>

        {/* Three panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative" style={{ zIndex: 25 }}>
          <InstrumentPanel accent="blue" title={t.feature_clock_title} desc={t.feature_clock_desc} />
          <InstrumentPanel accent="amber" title={t.feature_methods_title} desc={t.feature_methods_desc} />
          <InstrumentPanel accent="violet" title={t.feature_focus_title} desc={t.feature_focus_desc} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3: DOCKING SEQUENCE
          ══════════════════════════════════════════════ */}
      <section className="relative px-4 md:px-8 py-28 md:py-36 max-w-4xl mx-auto overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-5 mb-16 relative" style={{ zIndex: 25 }}>
          <div style={{ width: 36, height: 2, background: "#3B82F6", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
          }}>
            {t.how_title}
          </span>
          <hr className="instrument-divider" style={{ flex: 1 }} />
        </div>

        {/* Timeline */}
        <div className="relative" style={{ zIndex: 25 }}>
          <SequenceTimeline steps={workflowSteps} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4: DOCKING CLEARANCE (CTA)
          ══════════════════════════════════════════════ */}
      <section className="relative px-4 py-28 md:py-36 max-w-3xl mx-auto">
        <NearFieldBeams />
        <div style={{ zIndex: 25, position: "relative" }}>
          <DockingCTA
            statusLabel={t.cta_label}
            prompt={t.cta_body}
            buttonText={t.cta_button}
            href="/orbit"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════ */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "28px 0",
      }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.5625rem",
            color: "rgba(255,255,255,0.1)",
            letterSpacing: "0.06em",
          }}>
            {t.footer_text}
          </span>
          <div className="flex items-center gap-8">
            <Link href="/docs" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.5625rem",
              color: "rgba(255,255,255,0.12)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}>
              {t.footer_docs}
            </Link>
            <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.08)" }} />
            <Link href="/orbit" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.5625rem",
              color: "rgba(59,130,246,0.25)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}>
              {t.footer_launch}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(landing)/page.tsx
git commit -m "feat: complete landing page redesign — orbital control station + deep space aesthetic"
```

---

### Task 7: Build Verification

- [ ] **Step 1: Run build**

```bash
pnpm build
```

Expected: Build succeeds with no TypeScript errors. The landing page and all other pages compile correctly.

- [ ] **Step 2: Fix any issues**

If `pnpm build` fails:
- Check for missing imports
- Verify i18n keys exist for all `t.*` references
- Ensure removed CSS classes are not referenced by any component

- [ ] **Step 3: Commit any fixes (if needed)**

```bash
git add -A
git commit -m "fix: build errors from landing page redesign"
```

---

## Self-Review Checklist

1. **Spec coverage:**
   - Deep space background (nebula + stars + far beams) → Task 3 CSS + Task 6 NebulaGlow/StarField/TyndallBeams ✓
   - Tyndall effect (near + far beams with dust particles) → Task 3 CSS + Task 6 NearFieldBeams/CosmicDustField ✓
   - Orbit rings (6 concentric) → Task 3 CSS + Task 6 OrbitRings ✓
   - Status indicators (6 dots) → Task 3 CSS + Task 6 StatusIndicators ✓
   - Instrument panels (3) → Task 3 CSS + Task 6 InstrumentPanel ✓
   - Sequence timeline (4 steps) → Task 3 CSS + Task 6 SequenceTimeline ✓
   - Docking CTA → Task 3 CSS + Task 6 DockingCTA ✓
   - Instrument button → Task 3 CSS + Task 6 instrument-btn ✓
   - Simplified LiveClock → Task 5 ✓
   - .gitignore → Task 1 ✓
   - Color rules enforced → All tasks use blue=structure, amber=status, violet=atmosphere ✓

2. **Placeholder scan:** No TBD/TODO. All code is concrete. ✓

3. **Type consistency:** `Step` interface used in `SequenceTimeline` matches `workflowSteps` definition. i18n keys (`t.hero_*`, `t.feature_*`, `t.how_*`, `t.cta_*`, `t.footer_*`) all exist in i18n.ts. CSS classes referenced in JSX all defined in globals.css. ✓
