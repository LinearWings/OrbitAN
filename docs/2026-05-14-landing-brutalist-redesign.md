# Landing Page Brutalist Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the OrbitAN landing page with chrono-constructivist brutalist aesthetic — live clock hero, hard-edge panels, scanlines, parallax geometry, direct factual copy.

**Architecture:** Four-section single long scroll with CSS-only effects (scanlines, parallax, hard-cut animations). New `LiveClock` component for real-time HH:MM:SS display. i18n translation values rewritten for direct tone. Header adapted to brutalist style. All changes scoped to landing page only.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript 6, Tailwind CSS v4, CSS animations

---

### Task 1: Update i18n translations for direct factual tone

**Files:**
- Modify: `src/lib/i18n.ts`

Rewrite all landing-page-relevant translation values. Replace poetic metaphors with direct functional descriptions. Keep existing keys — update values only.

- [ ] **Step 1: Rewrite zh translations**

Replace the `zh` block in `src/lib/i18n.ts`:

```ts
const translations = {
  zh: {
    siteTitle: "OrbitAN — 轨道计划",
    siteDesc: "日程轨道管理系统。24小时径向时钟，六大方法论，聚焦块。",
    nav_docs: "文档",
    orbit_now: "进入轨道",
    hero_tagline: "SCHEDULE MANAGEMENT SYSTEM",
    hero_title_1: "轨道计划",
    hero_title_2: "OrbitAN",
    hero_title_3: "",
    hero_desc: "将每日任务映射到24小时径向时钟。任务化为彗星弧线，聚焦块标记在轨道外环。六个时间管理方法论内建于系统。",
    hero_cta: "ENTER ORBIT",
    learn_more: "功能概述",
    features_title: "核心系统",
    feature_clock_title: "轨道时钟",
    feature_clock_desc: "24小时径向表盘。任务以彗星弧线形态呈现在对应时间位置。时针/分针/秒针实时驱动，轨道环按6层同心分布。",
    feature_methods_title: "六大方法论",
    feature_methods_desc: "GTD 五阶段看板 · 番茄钟 25+5 计时器 · 帕累托 80/20 评分 · 莫法特 8×25min 分段 · 豪威尔四象限矩阵 · SWOT 分析。全部内建于轨道系统。",
    feature_focus_title: "聚焦块",
    feature_focus_desc: "在时钟表盘上划定时间段，选择方法论，系统以彩色弧线标记在轨道外环。重叠感知分配算法自动选择弧线层。",
    how_title: "操作流程",
    how_1_title: "创建任务",
    how_1_desc: "点击时钟表盘设定起止时间 → 输入任务名称 → 选择类型（工作/学习/会议/个人）→ 确认。任务以彗星弧线形态出现在轨道时钟对应时间位置。",
    how_2_title: "进入轨道模式",
    how_2_desc: "按下 O 键或点击 Orbit Mode。时钟表盘展开，聚焦弧线显现。悬浮弧线查看方法论信息，点击进入方法论执行面板。",
    how_3_title: "创建聚焦块",
    how_3_desc: "在时钟上点击两次定义时间段 → 选择方法论。系统自动分配到合适轨道环层，以方法论颜色标记。周视图支持逐日聚焦块管理。",
    how_4_title: "关联方法论",
    how_4_desc: "在轨道模式中点击任务卡片的 Orbit Plan 按钮 → 选择方法论。卡片以方法论颜色辉光标记。聚焦弧线悬浮显示详情，点击直接进入对应方法论面板。",
    footer_text: "OrbitAN · 轨道计划 · 日程轨道管理系统",
    footer_docs: "文档",
    footer_launch: "启动",
    doc_title: "文档",
    doc_desc: "OrbitAN 使用指南：从基础导航到高级方法论工作流。",
    doc_tutorial: "快速入门",
    doc_tutorial_desc: "创建任务、浏览视图、使用轨道时钟。五分钟上手。",
    doc_methodology: "方法论指南",
    doc_methodology_desc: "GTD、番茄钟、帕累托、莫法特、豪威尔矩阵、SWOT — 六种框架的详细说明。",
    doc_usage: "操作指南",
    doc_usage_desc: "键盘快捷键、Orbit Mode、聚焦块及高级功能。",
    doc_changelog: "更新日志",
    doc_changelog_desc: "版本历史与变更记录。",
    tutorial_title: "快速入门",
    tutorial_desc: "五分钟掌握 OrbitAN 基本操作。",
    tutorial_step1_title: "创建第一个任务",
    tutorial_step1_body: "点击「新建任务」或按 N 键。在时钟表盘上点击两次设定起止时间。输入名称，选择类别（工作/学习/会议/个人），确认。任务以彗星弧线出现在轨道时钟上，同时生成日程卡片。",
    tutorial_step2_title: "切换视图",
    tutorial_step2_body: "使用日/周/月标签页切换。日视图：轨道时钟 + 日程卡片。周视图：可滚动时间轴，重叠感知列布局。月视图：日历概览。",
    tutorial_step3_title: "进入轨道模式",
    tutorial_step3_body: "按 O 键或点击 Orbit Mode 按钮。时钟表盘展开，聚焦弧线激活。悬浮弧线查看方法论信息。点击弧线进入方法论面板。",
    tutorial_step4_title: "创建聚焦块",
    tutorial_step4_body: "轨道模式下点击「新建聚焦」，在时钟上点击两次定义时间范围，选择方法论。聚焦块以彩色弧线显示在外环。周视图中使用每日列底部的 + 按钮创建。",
    tutorial_step5_title: "任务与方法论关联",
    tutorial_step5_body: "轨道模式下点击任务卡片上的 + 图标，选择 Orbit Plan 方法论。卡片以方法论颜色发光。悬浮时钟上的聚焦弧线并点击可进入方法论执行页。",
    methodology_title: "方法论指南",
    methodology_desc: "集成于轨道系统中的六种时间管理框架。每种方法论独立面板，数据持久化至本地存储。",
    usage_title: "操作指南",
    usage_desc: "键盘快捷键、交互方式与高级功能说明。",
    usage_shortcuts: "键盘快捷键",
    usage_mouse: "交互方式",
    changelog_title: "更新日志",
    changelog_desc: "版本历史与近期变更记录。",
    back_docs: "← 返回文档",
  },
```

- [ ] **Step 2: Rewrite en translations**

Replace the `en` block:

```ts
  en: {
    siteTitle: "OrbitAN — Orbital Planning",
    siteDesc: "Schedule orbit management system. 24-hour radial clock, six methodologies, focus blocks.",
    nav_docs: "Docs",
    orbit_now: "Enter Orbit",
    hero_tagline: "SCHEDULE MANAGEMENT SYSTEM",
    hero_title_1: "Orbital Planning",
    hero_title_2: "OrbitAN",
    hero_title_3: "",
    hero_desc: "Map daily tasks onto a 24-hour radial clock. Tasks appear as comet arcs, focus blocks mark the outer rings. Six time-management methodologies built into the system.",
    hero_cta: "ENTER ORBIT",
    learn_more: "Features",
    features_title: "Core Systems",
    feature_clock_title: "Orbital Clock",
    feature_clock_desc: "24-hour radial dial. Tasks rendered as comet arcs at their scheduled positions. Hour/minute/second hands driven in real time. Six concentric orbit rings for task distribution.",
    feature_methods_title: "Six Methodologies",
    feature_methods_desc: "GTD 5-stage kanban · Pomodoro 25+5 timer · Pareto 80/20 scoring · Moffatt 8×25min sessions · Howell urgent/important matrix · SWOT analysis. All built into the orbital system.",
    feature_focus_title: "Focus Blocks",
    feature_focus_desc: "Define a time range on the clock face, select a methodology, and the system marks it as a colored arc on the outer ring. Overlap-aware assignment algorithm auto-selects the ring layer.",
    how_title: "Workflow",
    how_1_title: "Create Tasks",
    how_1_desc: "Click the clock face to set start/end times → enter task name → select type (Work/Study/Meeting/Personal) → confirm. The task appears as a comet arc at its scheduled position on the orbital clock.",
    how_2_title: "Enter Orbit Mode",
    how_2_desc: "Press O or click Orbit Mode. The clock expands, focus arcs activate. Hover arcs to view methodology info, click to enter the methodology execution panel.",
    how_3_title: "Create Focus Blocks",
    how_3_desc: "Click twice on the clock to define a time range → select a methodology. The system auto-assigns the block to the optimal orbit ring layer, color-coded by methodology. Week view supports per-day focus block management.",
    how_4_title: "Link Methodologies",
    how_4_desc: "In Orbit Mode, click a task card's Orbit Plan button → select a methodology. The card glows with the method's color. Hover focus arcs for details, click to enter the corresponding methodology panel.",
    footer_text: "OrbitAN · Orbital Planning · Schedule Management System",
    footer_docs: "Docs",
    footer_launch: "Launch",
    doc_title: "Documentation",
    doc_desc: "OrbitAN usage guide: from basic navigation to advanced methodology workflows.",
    doc_tutorial: "Quickstart",
    doc_tutorial_desc: "Create tasks, navigate views, use the orbital clock. Get started in five minutes.",
    doc_methodology: "Methodology Guide",
    doc_methodology_desc: "GTD, Pomodoro, Pareto, Moffatt, Howell Matrix, SWOT — detailed explanations of all six frameworks.",
    doc_usage: "Usage Guide",
    doc_usage_desc: "Keyboard shortcuts, Orbit Mode, focus blocks, and advanced features.",
    doc_changelog: "Changelog",
    doc_changelog_desc: "Version history and change log.",
    tutorial_title: "Quickstart",
    tutorial_desc: "Master OrbitAN basics in five minutes.",
    tutorial_step1_title: "Your First Task",
    tutorial_step1_body: "Click 'New Task' or press N. Click the clock face twice to set start and end times. Enter a name, choose a category (Work/Study/Meeting/Personal), confirm. The task appears as a comet arc on the orbital clock with a corresponding schedule card.",
    tutorial_step2_title: "Switch Views",
    tutorial_step2_body: "Use the Day/Week/Month tabs. Day view: orbital clock + schedule cards. Week view: scrollable timeline with overlap-aware lane layout. Month view: calendar overview.",
    tutorial_step3_title: "Enter Orbit Mode",
    tutorial_step3_body: "Press O or click the Orbit Mode button. The clock face expands, focus arcs activate. Hover arcs for methodology info. Click arcs to enter methodology panels.",
    tutorial_step4_title: "Create Focus Blocks",
    tutorial_step4_body: "In Orbit Mode, click 'New Focus', click the clock twice to define a time range, select a methodology. Focus blocks appear as colored arcs on the outer ring. In week view, use the + button at the bottom of each day column.",
    tutorial_step5_title: "Link Tasks to Methods",
    tutorial_step5_body: "In Orbit Mode, click the + icon on any task card, select an Orbit Plan methodology. The card glows with the method's color. Hover focus arcs on the clock and click to enter the methodology execution page.",
    methodology_title: "Methodology Guide",
    methodology_desc: "Six time-management frameworks integrated into the orbital system. Each methodology has its own panel with data persisted to local storage.",
    usage_title: "Usage Guide",
    usage_desc: "Keyboard shortcuts, interactions, and advanced feature documentation.",
    usage_shortcuts: "Keyboard Shortcuts",
    usage_mouse: "Interactions",
    changelog_title: "Changelog",
    changelog_desc: "Version history and recent changes.",
    back_docs: "← Back to Docs",
  },
} as const;
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/i18n.ts
git commit -m "refactor: rewrite landing i18n translations with direct factual tone"
```

---

### Task 2: Add brutalist CSS — scanlines, hard-cut animations, utilities

**Files:**
- Modify: `src/app/globals.css`

Add CSS scanline overlay, hard-cut animation keyframes, and brutalist utility classes. These go at the end of the existing file (after the Tailwind imports and existing custom styles).

- [ ] **Step 1: Append brutalist CSS to globals.css**

Add the following at the end of `src/app/globals.css`:

```css
/* ===== Brutalist Landing Effects ===== */

/* Scanline overlay — applied via dedicated element */
.scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
}

/* Hard-cut reveal — elements snap up from below with zero easing */
@keyframes hardCutIn {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes hardCutInRight {
  0% {
    transform: translateX(40px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes hardCutInLeft {
  0% {
    transform: translateX(-40px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes clockPulse {
  0%, 100% {
    text-shadow: 0 0 0 rgba(234, 179, 8, 0);
  }
  50% {
    text-shadow: 0 0 12px rgba(234, 179, 8, 0.15);
  }
}

@keyframes borderSnap {
  0% {
    border-width: 1px;
  }
  100% {
    border-width: 3px;
  }
}

.hard-cut-in {
  animation: hardCutIn 0.3s steps(1) forwards;
}

.hard-cut-in-right {
  animation: hardCutInRight 0.3s steps(1) forwards;
}

.hard-cut-in-left {
  animation: hardCutInLeft 0.3s steps(1) forwards;
}

/* Staggered reveal delays */
.reveal-1 { animation-delay: 0.1s; }
.reveal-2 { animation-delay: 0.2s; }
.reveal-3 { animation-delay: 0.3s; }
.reveal-4 { animation-delay: 0.4s; }
.reveal-5 { animation-delay: 0.5s; }

/* Brutalist border — thick single-side accent */
.brutal-border-top {
  border-top: 3px solid rgba(255, 255, 255, 0.12);
}

.brutal-border-left {
  border-left: 3px solid rgba(255, 255, 255, 0.12);
}

.brutal-border-right {
  border-right: 3px solid rgba(255, 255, 255, 0.12);
}

/* Hard panel — no rounded corners, sharp edges */
.hard-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Diagonal section divider */
.diagonal-divider {
  position: relative;
}
.diagonal-divider::before {
  content: "";
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom right,
    transparent 49%,
    rgba(255, 255, 255, 0.06) 49.5%,
    rgba(255, 255, 255, 0.06) 50.5%,
    transparent 51%
  );
}

/* Clock digit style */
.clock-digit {
  font-family: "JetBrains Mono", monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
}

/* Parallax geometric shapes */
.parallax-geo {
  position: absolute;
  pointer-events: none;
  transition: transform 0.1s linear;
}

/* Brutalist CTA button */
.brutal-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 48px;
  font-family: "Clash Display", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #080808;
  background: #EAB308;
  border: 2px solid #EAB308;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: border-width 0s steps(1), margin 0s steps(1);
}
.brutal-cta:hover {
  border-width: 4px;
  margin: -2px;
}

/* Time code label for workflow timeline */
.time-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.06em;
}

/* Section number — oversized, low opacity */
.section-number {
  font-family: "Clash Display", sans-serif;
  font-size: clamp(4rem, 8vw, 8rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.03);
  line-height: 0.8;
}

/* Horizontal rule — hard industrial */
.hr-hard {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
}

/* Text bleed — deliberately overflows */
.text-bleed {
  white-space: nowrap;
  overflow: visible;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add brutalist CSS — scanlines, hard-cut animations, utility classes"
```

---

### Task 3: Create LiveClock component

**Files:**
- Create: `src/components/landing/LiveClock.tsx`

Real-time HH:MM:SS clock using `useEffect` + `requestAnimationFrame`. Renders massive amber digits that pulse subtly.

- [ ] **Step 1: Create the component**

Write `src/components/landing/LiveClock.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<string>("");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <span
      className="clock-digit select-none"
      style={{
        fontSize: "clamp(3rem, 12vw, 10rem)",
        color: "#EAB308",
        animation: "clockPulse 2s ease-in-out infinite",
        lineHeight: 1,
      }}
    >
      {time || "--:--:--"}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/LiveClock.tsx
git commit -m "feat: add LiveClock component with real-time rAF-driven HH:MM:SS"
```

---

### Task 4: Rewrite landing page with brutalist design

**Files:**
- Modify: `src/app/(landing)/page.tsx`

Complete rewrite of the landing page. Four sections: Hero with live clock, Functions as hard-edge statements, Workflow timeline, CTA.

- [ ] **Step 1: Write the new landing page**

Replace the entire contents of `src/app/(landing)/page.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LiveClock from "@/components/landing/LiveClock";

function ParallaxGeometry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState({ y: 0 });

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top / window.innerHeight;
      setOffsets({ y: scrolled });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = offsets.y;
  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large triangle — top right */}
      <div
        className="parallax-geo"
        style={{
          top: `${-10 + t * 30}%`,
          right: "-5%",
          width: 0,
          height: 0,
          borderLeft: "min(30vw, 300px) solid transparent",
          borderBottom: `min(50vh, 500px) solid rgba(234,179,8,0.04)`,
          transform: `rotate(${15 + t * 5}deg)`,
        }}
      />
      {/* Diagonal line — left side */}
      <div
        className="parallax-geo"
        style={{
          top: `${40 + t * 20}%`,
          left: `${5 - t * 10}%`,
          width: "min(40vw, 400px)",
          height: "1px",
          background: "rgba(37,99,235,0.12)",
          transform: `rotate(-35deg)`,
        }}
      />
      {/* Circle ring */}
      <div
        className="parallax-geo"
        style={{
          top: `${60 + t * 15}%`,
          right: `${10 - t * 10}%`,
          width: "min(20vw, 200px)",
          height: "min(20vw, 200px)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "50%",
        }}
      />
      {/* Small amber dot */}
      <div
        className="parallax-geo"
        style={{
          top: `${25 + t * 40}%`,
          left: `${80 + t * 5}%`,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "rgba(234,179,8,0.3)",
        }}
      />
    </div>
  );
}

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  const weekdayStr = lang === "zh"
    ? ["日", "一", "二", "三", "四", "五", "六"][today.getDay()]
    : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][today.getDay()];

  return (
    <div style={{ background: "#080808", color: "rgba(255,255,255,0.82)" }}>
      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* ===== Section 1: Time Anchor (Hero) ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <ParallaxGeometry />

        {/* Top-left: OrbitAN label */}
        <div className="absolute top-8 left-8 flex items-center gap-4">
          <div style={{ width: 12, height: 12, background: "#EAB308" }} />
          <span
            className="text-sm tracking-[0.15em] text-white/30 uppercase"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            OrbitAN
          </span>
        </div>

        {/* Top-right: date box */}
        <div
          className="absolute top-8 right-8 px-4 py-2"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {dateStr} <span style={{ color: "rgba(234,179,8,0.6)" }}>{weekdayStr}</span>
        </div>

        {/* Center: Live clock */}
        <div className="text-center animate-[hardCutIn_0.3s_steps(1)_forwards]">
          <LiveClock />
          <div
            className="mt-4 text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.12)",
            }}
          >
            {t.hero_tagline}
          </div>
        </div>

        {/* Title lines with diagonal separators */}
        <div
          className="mt-12 text-center animate-[hardCutIn_0.3s_steps(1)_0.2s_forwards]"
          style={{ opacity: 0, animationFillMode: "forwards" }}
        >
          <h1
            className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1]"
            style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.85)" }}
          >
            {t.hero_title_1}
          </h1>
          <div className="flex items-center justify-center gap-4 my-3">
            <div style={{ width: "clamp(40px, 8vw, 80px)", height: 1, background: "rgba(234,179,8,0.4)" }} />
            <span
              className="text-4xl md:text-6xl font-semibold tracking-tight"
              style={{ fontFamily: "'Clash Display', sans-serif", color: "#EAB308" }}
            >
              {t.hero_title_2}
            </span>
            <div style={{ width: "clamp(40px, 8vw, 80px)", height: 1, background: "rgba(234,179,8,0.4)" }} />
          </div>
        </div>

        {/* Description */}
        <div
          className="mt-8 max-w-xl text-center animate-[hardCutIn_0.3s_steps(1)_0.4s_forwards]"
          style={{ opacity: 0, animationFillMode: "forwards" }}
        >
          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(255,255,255,0.3)" }}
          >
            {t.hero_desc}
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="mt-10 flex items-center gap-6 animate-[hardCutIn_0.3s_steps(1)_0.5s_forwards]"
          style={{ opacity: 0, animationFillMode: "forwards" }}
        >
          <Link href="/orbit" className="brutal-cta">
            {t.hero_cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <a
            href="#features"
            className="text-sm tracking-[0.1em] uppercase"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "rgba(255,255,255,0.2)",
              textDecoration: "none",
              paddingBottom: 2,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {t.learn_more} ↓
          </a>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "rgba(255,255,255,0.08)" }}>
          <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.06)" }} />
        </div>
      </section>

      {/* Diagonal divider */}
      <div className="diagonal-divider" />

      {/* ===== Section 2: Functions as Statements ===== */}
      <section id="features" className="relative px-4 md:px-8 py-24 md:py-32 max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-16">
          <div style={{ width: 24, height: 2, background: "#EAB308" }} />
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.15)" }}
          >
            {t.features_title}
          </span>
        </div>

        {/* Panel 01 — Orbital Clock */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 mb-8">
          <div className="md:col-span-2 flex md:justify-end md:pr-8 mb-4 md:mb-0">
            <span className="section-number">01</span>
          </div>
          <div className="md:col-span-6 hard-panel p-8 brutal-border-left" style={{ borderLeftColor: "#2563EB" }}>
            <div style={{ width: 8, height: 8, background: "#2563EB", marginBottom: 20 }} />
            <h2
              className="text-xl md:text-2xl font-semibold mb-4 tracking-tight"
              style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.82)" }}
            >
              {t.feature_clock_title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(255,255,255,0.3)" }}>
              {t.feature_clock_desc}
            </p>
          </div>
          <div className="md:col-span-4 hidden md:block" />
        </div>

        {/* Panel 02 — Six Methodologies (offset right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 mb-8">
          <div className="md:col-span-3 hidden md:block" />
          <div className="md:col-span-2 flex md:justify-end md:pr-8 mb-4 md:mb-0">
            <span className="section-number">02</span>
          </div>
          <div className="md:col-span-6 hard-panel p-8 brutal-border-left" style={{ borderLeftColor: "#EAB308" }}>
            <div style={{ width: 8, height: 8, background: "#EAB308", marginBottom: 20 }} />
            <h2
              className="text-xl md:text-2xl font-semibold mb-4 tracking-tight"
              style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.82)" }}
            >
              {t.feature_methods_title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(255,255,255,0.3)" }}>
              {t.feature_methods_desc}
            </p>
          </div>
        </div>

        {/* Panel 03 — Focus Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-2 flex md:justify-end md:pr-8 mb-4 md:mb-0">
            <span className="section-number">03</span>
          </div>
          <div className="md:col-span-6 hard-panel p-8 brutal-border-left" style={{ borderLeftColor: "#6B7280" }}>
            <div style={{ width: 8, height: 8, background: "#6B7280", marginBottom: 20 }} />
            <h2
              className="text-xl md:text-2xl font-semibold mb-4 tracking-tight"
              style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.82)" }}
            >
              {t.feature_focus_title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(255,255,255,0.3)" }}>
              {t.feature_focus_desc}
            </p>
          </div>
        </div>
      </section>

      {/* Diagonal divider */}
      <div className="diagonal-divider" />

      {/* ===== Section 3: Workflow Timeline ===== */}
      <section className="relative px-4 md:px-8 py-24 md:py-32 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-16">
          <div style={{ width: 24, height: 2, background: "#2563EB" }} />
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.15)" }}
          >
            {t.how_title}
          </span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[60px] md:left-[100px] top-0 bottom-0"
            style={{ width: 1, background: "rgba(255,255,255,0.06)" }}
          />

          {[
            { time: "00:00", title: t.how_1_title, desc: t.how_1_desc, color: "#2563EB" },
            { time: "06:00", title: t.how_2_title, desc: t.how_2_desc, color: "#EAB308" },
            { time: "12:00", title: t.how_3_title, desc: t.how_3_desc, color: "#6B7280" },
            { time: "18:00", title: t.how_4_title, desc: t.how_4_desc, color: "#9CA3AF" },
          ].map((step, i) => (
            <div key={i} className="relative flex items-start mb-20 last:mb-0">
              {/* Time code */}
              <div className="time-code w-[60px] md:w-[100px] flex-shrink-0 text-right pr-6 pt-1">
                {step.time}
              </div>
              {/* Dot on timeline */}
              <div
                className="absolute rounded-full flex-shrink-0"
                style={{
                  left: "calc(60px - 3px)",
                  top: 6,
                  width: 7,
                  height: 7,
                  background: step.color,
                }}
              />
              {/* Content */}
              <div className="pl-10 md:pl-16 flex-1">
                <h3
                  className="text-base md:text-lg font-semibold mb-2 tracking-tight"
                  style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.75)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-lg" style={{ fontFamily: "'Satoshi', sans-serif", color: "rgba(255,255,255,0.28)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Section 4: Action Zone (CTA) ===== */}
      <section className="relative px-4 py-24 md:py-32">
        <div
          className="max-w-4xl mx-auto"
          style={{
            borderTop: "2px solid rgba(255,255,255,0.08)",
            borderBottom: "2px solid rgba(255,255,255,0.08)",
            padding: "clamp(3rem, 8vw, 6rem) 0",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 8, height: 8, background: "#EAB308" }} />
                <span
                  className="text-xs tracking-[0.15em]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.2)" }}
                >
                  {lang === "zh" ? "开始使用" : "GET STARTED"}
                </span>
              </div>
              <p
                className="text-xl md:text-2xl font-semibold tracking-tight"
                style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.8)" }}
              >
                {lang === "zh" ? "在轨道时钟上标记你的第一个任务。" : "Mark your first task on the orbital clock."}
              </p>
            </div>
            <Link href="/orbit" className="brutal-cta">
              {lang === "zh" ? "进入系统" : "ENTER ORBIT"}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="px-4 md:px-8 py-8 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: 6, height: 6, background: "rgba(255,255,255,0.2)" }} />
            <span
              className="text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.15)" }}
            >
              {t.footer_text}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-xs hover:opacity-70"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.2)" }}
            >
              {t.footer_docs}
            </Link>
            <Link
              href="/orbit"
              className="text-xs hover:opacity-70"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.2)" }}
            >
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
git add src/app/\(landing\)/page.tsx
git commit -m "feat: rewrite landing page with brutalist chrono-constructivist design"
```

---

### Task 5: Adapt landing layout header to brutalist style

**Files:**
- Modify: `src/app/(landing)/layout.tsx`

Replace glass-morphism blur header with hard-edge brutalist header. Keep existing mobile nav logic. Remove blur effects, add hard border.

- [ ] **Step 1: Rewrite the layout header**

Replace `src/app/(landing)/layout.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getT } from "@/lib/i18n";
import LangSwitch from "@/components/landing/LangSwitch";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const lang = useLanguage();
  const t = getT(lang);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-[#080808] text-white/80 overflow-y-auto" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: "rgba(8,8,8,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.75)" }}
        >
          <div style={{ width: 8, height: 8, background: "#EAB308" }} />
          <span className="text-sm font-semibold tracking-[0.08em]">OrbitAN</span>
        </Link>
        {isMobile ? (
          <div className="flex items-center gap-3">
            <LangSwitch currentLang={lang} />
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/50 text-xl leading-none">
              {menuOpen ? <CloseIcon size={16} /> : <MenuIcon size={18} />}
            </button>
            {menuOpen && (
              <div
                className="absolute top-full right-4 mt-2 py-2 px-4 flex flex-col gap-2"
                style={{
                  background: "rgba(10,10,15,0.98)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Link href="/docs" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white/90">
                  {t.nav_docs}
                </Link>
                <Link href="/orbit" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white/90">
                  {t.orbit_now}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <nav className="flex items-center gap-6 text-sm text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <Link href="/docs" className="hover:text-white/60" style={{ fontSize: "0.6875rem", letterSpacing: "0.06em" }}>
              {t.nav_docs}
            </Link>
            <Link
              href="/orbit"
              className="hover:text-[#EAB308]"
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.06em",
                padding: "6px 16px",
                border: "1px solid rgba(234,179,8,0.3)",
              }}
            >
              {t.orbit_now}
            </Link>
            <LangSwitch currentLang={lang} />
          </nav>
        )}
      </header>
      <main className="pt-16">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(landing\)/layout.tsx
git commit -m "refactor: adapt landing header to brutalist style — hard border, no blur"
```

---

### Task 6: Build and verify

- [ ] **Step 1: Run the build**

```bash
cd "E:/DS AI Workspace/orbitan_git" && pnpm build
```

Expected: Build succeeds with no errors. `out/` directory created with all static pages.

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd "E:/DS AI Workspace/orbitan_git" && pnpm lint 2>&1 | head -50
```

Expected: No new lint errors from landing page files.

- [ ] **Step 3: Fix any build or lint errors**

Address any errors found in Steps 1-2 before proceeding.

- [ ] **Step 4: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: build and lint adjustments for landing brutalist redesign"
```

---

## Verification Checklist (Post-Implementation)

- [ ] `pnpm build` succeeds
- [ ] Landing page loads at `/`
- [ ] Live clock renders and updates in real time
- [ ] Scanlines visible as overlay
- [ ] Parallax geometry responds to scroll
- [ ] All i18n text renders in both zh/en
- [ ] Navigation links (docs, orbit) work
- [ ] CTA buttons link to `/orbit`
- [ ] Footer links work
- [ ] Mobile responsive (375px+) — layout doesn't break
- [ ] No console errors
- [ ] No visual regression in docs pages
- [ ] No visual regression in orbit application page
