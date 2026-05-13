# GitHub Pages Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert OrbitAN from Vercel-deployed Next.js app to static-export GitHub Pages site at `linearwings.github.io/OrbitAN`.

**Architecture:** Add `output: "export"` + `basePath: "/OrbitAN"` to next.config.ts, convert 7 server-component pages (which use `cookies()`/`headers()`) to client components with a `useLanguage` hook, replace `<a>` with `<Link>` for basePath-aware routing, fix `LangSwitch` to not use `router.refresh()` (non-functional in static export), and add GitHub Actions deploy workflow.

**Tech Stack:** Next.js 16 (static export), React 19, TypeScript 6, GitHub Actions (official `deploy-pages` action)

---

### Task 1: Configure next.config.ts for static export

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update next.config.ts**

Replace the entire contents of `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/OrbitAN",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: configure static export with basePath /OrbitAN"
```

---

### Task 2: Create useLanguage hook

**Files:**
- Create: `src/hooks/useLanguage.ts`

- [ ] **Step 1: Create the hook**

Write `src/hooks/useLanguage.ts`:

```ts
"use client";

import { useState, useEffect } from "react";
import { detectLang, type Lang } from "@/lib/i18n";

export function useLanguage(): Lang {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)orbit_lang=([^;]+)/);
    const cookieLang = match?.[1] as Lang | undefined;
    setLang(cookieLang || detectLang(navigator.language));
  }, []);

  return lang;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useLanguage.ts
git commit -m "feat: add useLanguage hook for client-side i18n detection"
```

---

### Task 3: Fix LangSwitch for static export

**Files:**
- Modify: `src/components/landing/LangSwitch.tsx:5-25`

`router.refresh()` calls a server endpoint that doesn't exist in static export. Replace with `window.location.reload()`.

- [ ] **Step 1: Replace router.refresh() with page reload**

```tsx
"use client";

export default function LangSwitch({ currentLang }: { currentLang: string }) {
  const toggle = () => {
    const next = currentLang === "zh" ? "en" : "zh";
    document.cookie = `orbit_lang=${next};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      className="px-2 py-1 rounded text-[0.7rem] font-medium transition-all hover:bg-white/[0.06] text-white/30 hover:text-white/50"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      title={currentLang === "zh" ? "Switch to English" : "切换到中文"}
    >
      {currentLang === "zh" ? "EN" : "中"}
    </button>
  );
}
```

Removed: `import { useRouter } from "next/navigation"` and the `router` variable.

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/LangSwitch.tsx
git commit -m "fix: replace router.refresh() with window.location.reload() for static export"
```

---

### Task 4: Convert (landing)/layout.tsx to client component

**Files:**
- Modify: `src/app/(landing)/layout.tsx`

Changes:
1. Add `"use client"`
2. Remove `import { cookies, headers } from "next/headers"`
3. Import `useLanguage` hook
4. Remove `async` from component, replace cookie/header reads with hook
5. Remove `export const metadata` (incompatible with `"use client"`) — root layout's metadata covers all pages
6. Replace `<a>` with `<Link>` from `next/link`

- [ ] **Step 1: Rewrite the layout**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LangSwitch from "@/components/landing/LangSwitch";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="h-screen bg-[#080808] text-white/80 overflow-y-auto" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/[0.06]"
        style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <Link href="/" className="text-lg font-semibold tracking-tight text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          OrbitAN
        </Link>
        <nav className="flex items-center gap-5 text-sm text-white/35">
          <Link href="/docs" className="hover:text-white/70 transition-colors">{t.nav_docs}</Link>
          <Link
            href="/orbit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.8), rgba(124,58,237,0.8))",
              boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
              fontFamily: "'Clash Display', sans-serif",
            }}
          >
            {t.orbit_now}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <LangSwitch currentLang={lang} />
        </nav>
      </header>
      <main className="pt-20">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(landing\)/layout.tsx
git commit -m "refactor: convert landing layout to client component for static export"
```

---

### Task 5: Convert (landing)/page.tsx to client component

**Files:**
- Modify: `src/app/(landing)/page.tsx`

Same transformation: add `"use client"`, swap `cookies()`/`headers()` for `useLanguage()`, replace `<a>` with `<Link>`.

- [ ] **Step 1: Rewrite the landing page**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <>
      {/* Hero */}
      <section className="relative px-8 pt-24 pb-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-[12%] w-[600px] h-[600px] rounded-full bg-[#EAB308]/[0.05]" />
          <div className="absolute top-32 right-[8%] w-[450px] h-[450px] rounded-full bg-[#3B82F6]/[0.05]" />
          <div className="absolute -bottom-20 left-[25%] w-[700px] h-[700px] rounded-full bg-[#8B5CF6]/[0.03]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-white/20 mb-8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {t.hero_tagline}
          </p>
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-6 text-white/90" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            {t.hero_title_1}
            <br />
            <span className="text-[#3B82F6]">{t.hero_title_2}</span> {t.hero_title_3}
          </h1>
          <p className="text-lg text-white/30 leading-relaxed max-w-xl mx-auto mb-10">
            {t.hero_desc}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/orbit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-base font-semibold transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.9), rgba(124,58,237,0.9))",
                boxShadow: "0 4px 28px rgba(37,99,235,0.3)",
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              {t.hero_cta}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link href="/docs" className="px-8 py-4 rounded-full text-white/25 text-base font-medium hover:text-white/50 transition-colors">
              {t.learn_more}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 pb-32 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-white/15 mb-4 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {t.how_title}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { num: "01", title: t.how_1_title, desc: t.how_1_desc, color: "#3B82F6" },
            { num: "02", title: t.how_2_title, desc: t.how_2_desc, color: "#8B5CF6" },
            { num: "03", title: t.how_3_title, desc: t.how_3_desc, color: "#EAB308" },
            { num: "04", title: t.how_4_title, desc: t.how_4_desc, color: "#22C55E" },
          ].map((s) => (
            <div
              key={s.num}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-3xl font-bold text-white/[0.04] mb-4 block" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.num}</span>
              <div className="w-1.5 h-1.5 rounded-full mb-4" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}50` }} />
              <h3 className="text-base font-semibold mb-2 text-white/75 tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.title}</h3>
              <p className="text-sm text-white/25 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-32 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-white/15 mb-8 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {t.features_title}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: t.feature_clock_title, desc: t.feature_clock_desc, color: "#3B82F6" },
            { title: t.feature_methods_title, desc: t.feature_methods_desc, color: "#8B5CF6" },
            { title: t.feature_focus_title, desc: t.feature_focus_desc, color: "#EAB308" },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-2 h-2 rounded-full mb-5" style={{ background: f.color, boxShadow: `0 0 10px ${f.color}40` }} />
              <h3 className="text-lg font-semibold mb-3 tracking-tight text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{f.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-32 max-w-2xl mx-auto text-center">
        <div
          className="rounded-3xl p-12"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.06))", border: "1px solid rgba(37,99,235,0.1)" }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            {lang === "zh" ? "准备入轨？" : "Ready to orbit?"}
          </h2>
          <p className="text-white/30 mb-8">
            {lang === "zh" ? "免费、开源、为深度工作者打造。" : "Free, open-source, built for deep work."}
          </p>
          <Link
            href="/orbit"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white text-base font-semibold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.9), rgba(124,58,237,0.9))",
              boxShadow: "0 4px 28px rgba(37,99,235,0.3)",
              fontFamily: "'Clash Display', sans-serif",
            }}
          >
            {lang === "zh" ? "即刻入轨" : "Launch OrbitAN"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/15">
          <span>{t.footer_text}</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-white/35 transition-colors">{t.footer_docs}</Link>
            <Link href="/orbit" className="hover:text-white/35 transition-colors">{t.footer_launch}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(landing\)/page.tsx
git commit -m "refactor: convert landing page to client component for static export"
```

---

### Task 6: Convert 5 docs pages to client components

**Files:**
- Modify: `src/app/(landing)/docs/page.tsx`
- Modify: `src/app/(landing)/docs/tutorial/page.tsx`
- Modify: `src/app/(landing)/docs/methodology/page.tsx`
- Modify: `src/app/(landing)/docs/usage/page.tsx`
- Modify: `src/app/(landing)/docs/changelog/page.tsx`

All five pages follow the same pattern: add `"use client"`, replace `cookies()`/`headers()` with `useLanguage()`, replace `<a>` with `<Link>`, remove `async`.

- [ ] **Step 1: docs/page.tsx**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export default function DocsPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="text-4xl font-semibold tracking-tight mb-4 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>
        {t.doc_title}
      </h1>
      <p className="text-white/30 mb-12 leading-relaxed">{t.doc_desc}</p>

      <div className="grid gap-4">
        {[
          { href: "/docs/tutorial", title: t.doc_tutorial, desc: t.doc_tutorial_desc, color: "#3B82F6" },
          { href: "/docs/methodology", title: t.doc_methodology, desc: t.doc_methodology_desc, color: "#8B5CF6" },
          { href: "/docs/usage", title: t.doc_usage, desc: t.doc_usage_desc, color: "#EAB308" },
          { href: "/docs/changelog", title: t.doc_changelog, desc: t.doc_changelog_desc, color: "#22C55E" },
        ].map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="block rounded-xl p-6 transition-all hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: doc.color, boxShadow: `0 0 8px ${doc.color}40` }} />
              <h3 className="text-lg font-semibold tracking-tight text-white/80" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                {doc.title}
              </h3>
            </div>
            <p className="text-sm text-white/30 pl-5">{doc.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: docs/tutorial/page.tsx**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export default function TutorialPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.tutorial_title}</h1>
      <p className="text-white/30 mb-12">{t.tutorial_desc}</p>

      <div className="space-y-12">
        {[
          { step: "01", title: t.tutorial_step1_title, body: t.tutorial_step1_body },
          { step: "02", title: t.tutorial_step2_title, body: t.tutorial_step2_body },
          { step: "03", title: t.tutorial_step3_title, body: t.tutorial_step3_body },
          { step: "04", title: t.tutorial_step4_title, body: t.tutorial_step4_body },
          { step: "05", title: t.tutorial_step5_title, body: t.tutorial_step5_body },
        ].map((s) => (
          <div key={s.step} className="flex gap-6">
            <span className="text-2xl font-bold text-white/[0.04] flex-shrink-0 w-10" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.step}</span>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white/75" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: docs/methodology/page.tsx**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

const METHODS = [
  { nameEn: "GTD — Getting Things Done", nameZh: "GTD — 搞定", color: "#22C55E", descEn: "Five-stage kanban: Inbox → Next Actions → Waiting → Someday → Done. Capture everything, clarify next steps, and organize by context.", descZh: "五阶段看板：收集箱 → 下一步行动 → 等待 → 将来/也许 → 已完成。捕获一切、理清下一步、按情境组织。" },
  { nameEn: "Pomodoro Technique", nameZh: "番茄工作法", color: "#EF4444", descEn: "25-minute focus sessions with 5-minute breaks. Every 4 sessions triggers a longer 15-minute break. Built-in phase tracking with visual countdown.", descZh: "25 分钟专注 + 5 分钟休息。每 4 轮触发一次 15 分钟长休息。内建阶段追踪与可视化倒计时。" },
  { nameEn: "Pareto Principle (80/20)", nameZh: "帕累托原则 (80/20)", color: "#3B82F6", descEn: "Identify the 20% of tasks that yield 80% of results. Score tasks by impact and effort. Vital few tasks are highlighted automatically.", descZh: "识别产生产出 80% 的 20% 任务。按影响力和努力度评分。关键的少数自动高亮。" },
  { nameEn: "Moffatt Rest Method", nameZh: "莫法特休息法", color: "#8B5CF6", descEn: "8 timed sessions of 25 minutes each. Alternate between different types of work to maintain freshness and prevent mental fatigue.", descZh: "8 个 25 分钟定时任务段。在不同类型的工作间交替切换，保持新鲜感、防止心理疲劳。" },
  { nameEn: "Howell Matrix", nameZh: "豪威尔矩阵", color: "#F97316", descEn: "Urgent/Important quadrants. Classify tasks into four zones and prioritize accordingly. Visual matrix with drag-and-drop organization.", descZh: "紧急/重要四象限。将任务归入四个区域并按优先级排序。可视化矩阵，支持拖拽整理。" },
  { nameEn: "SWOT Analysis", nameZh: "SWOT 分析", color: "#EAB308", descEn: "Strengths, Weaknesses, Opportunities, Threats. Strategic planning tool for project-level thinking integrated into daily scheduling.", descZh: "优势、劣势、机会、威胁。项目级战略规划工具，集成到日常计划中。" },
];

export default function MethodologyPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.methodology_title}</h1>
      <p className="text-white/30 mb-12">{t.methodology_desc}</p>

      <div className="space-y-10">
        {METHODS.map((m) => (
          <div key={m.nameEn} className="flex gap-5">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}50` }} />
            <div>
              <h3 className="text-base font-semibold mb-2 text-white/75" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                {lang === "zh" ? m.nameZh : m.nameEn}
              </h3>
              <p className="text-sm text-white/30 leading-relaxed">{lang === "zh" ? m.descZh : m.descEn}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: docs/usage/page.tsx**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

const SHORTCUTS = [
  ["N", "New Task / 新建任务"], ["O", "Toggle Orbit Mode / 切换轨道模式"], ["T", "Go to Today / 回到今天"],
  ["1-4", "Filter by type / 按类型筛选"], ["0", "Clear filter / 清除筛选"], ["Delete", "Delete selected / 删除选中"],
  ["Escape", "Close / Cancel / 关闭取消"], ["Ctrl+Z", "Undo delete / 撤销删除"], ["Shift+Drag", "Reposition card / 移动卡片"],
  ["Z+Scroll", "Zoom week view / 缩放周视图"], ["←/→", "Previous/Next day / 前后日"],
];

const INTERACTIONS_EN = [
  ["Click card", "Select / deselect"],
  ["Click clock empty space", "Deselect all"],
  ["Long press card (600ms)", "Enter delete mode with floating trash bubble"],
  ["Hold trash bubble (2s)", "Confirm delete with progress ring"],
  ["Click outside bubble", "Cancel delete"],
  ["Click selected time/name", "Inline edit"],
  ["Hover focus arc (Orbit Mode)", "Methodology tooltip + glow"],
  ["Click focus arc (Orbit Mode)", "Open methodology panel"],
  ["Click focus block (week view)", "Open methodology panel"],
];

const INTERACTIONS_ZH = [
  ["点击卡片", "选中 / 取消选中"],
  ["点击时钟空白区域", "取消所有选中"],
  ["长按卡片 (600ms)", "进入删除模式，弹出垃圾桶气泡"],
  ["按住垃圾桶气泡 (2s)", "进度环确认删除"],
  ["点击气泡外部", "取消删除"],
  ["点击已选中的时间/名称", "内联编辑"],
  ["悬浮聚焦弧 (Orbit Mode)", "方法论提示 + 辉光"],
  ["点击聚焦弧 (Orbit Mode)", "打开方法论面板"],
  ["点击聚焦块 (周视图)", "打开方法论面板"],
];

export default function UsagePage() {
  const lang = useLanguage();
  const t = getT(lang);
  const interactions = lang === "zh" ? INTERACTIONS_ZH : INTERACTIONS_EN;

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.usage_title}</h1>
      <p className="text-white/30 mb-12">{t.usage_desc}</p>

      <div className="space-y-10">
        <section>
          <h3 className="text-lg font-semibold mb-4 text-white/70" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.usage_shortcuts}</h3>
          <div className="grid grid-cols-2 gap-2">
            {SHORTCUTS.map(([key, label]) => (
              <div key={key} className="flex items-center gap-3 text-sm">
                <kbd className="px-2 py-0.5 rounded text-[0.65rem] font-mono bg-white/[0.06] text-white/35 border border-white/[0.08]">{key}</kbd>
                <span className="text-white/35">{lang === "zh" ? label.split(" / ")[1] : label.split(" / ")[0]}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-white/70" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.usage_mouse}</h3>
          <div className="space-y-3 text-sm text-white/30 leading-relaxed">
            {interactions.map(([action, desc]) => (
              <p key={action}><strong className="text-white/50">{action}</strong> &mdash; {desc}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: docs/changelog/page.tsx**

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export default function ChangelogPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.changelog_title}</h1>
      <p className="text-white/30 mb-12">{t.changelog_desc}</p>

      <div className="space-y-10">
        {[
          { version: "v0.5", date: "2026-05-13", changes: [
            "Landing page & documentation website with i18n (zh/en)",
            "Mouse long-press delete with animated trash bubble",
            "Ctrl+Z undo for deleted tasks and focus blocks",
            "Week view liquid glass focus block redesign",
            "Orbit Plan task property with methodology glow",
            "Click-to-enter methodology from focus arcs and cards",
          ]},
          { version: "v0.4", date: "2026-05-10", changes: [
            "Week & month view navigation",
            "Focus block creation via click-twice on clock",
            "Method picker popup after focus creation",
            "Focus block arc overlap-aware ring assignment",
            "Liquid glass card reveal animations",
          ]},
          { version: "v0.3", date: "2026-04-28", changes: [
            "Orbit Mode with focus block system",
            "Six methodology panels (GTD, Pomodoro, Pareto, Moffatt, Howell, SWOT)",
            "24-hour radial clock with comet trails",
          ]},
          { version: "v0.2", date: "2026-04-20", changes: [
            "Inline task creation on the clock face",
            "Schedule card distribution with overlap avoidance",
            "Connector arrow system for clock-to-card connections",
            "Progress bar and inline time editing",
          ]},
          { version: "v0.1", date: "2026-04-15", changes: [
            "Initial release with Canvas 2D orbital clock",
            "Task CRUD with localStorage persistence",
            "Keyboard shortcuts and day navigation",
            "Constructivist cosmic visual theme",
          ]},
        ].map((v) => (
          <div key={v.version}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-sm font-semibold text-white/70" style={{ fontFamily: "'Clash Display', sans-serif" }}>{v.version}</span>
              <span className="text-xs text-white/15">{v.date}</span>
            </div>
            <ul className="space-y-1.5">
              {v.changes.map((c) => (
                <li key={c} className="text-sm text-white/30 flex items-start gap-2">
                  <span className="text-white/10 mt-0.5">&bull;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit all 5 docs pages**

```bash
git add src/app/\(landing\)/docs/
git commit -m "refactor: convert 5 docs pages to client components for static export"
```

---

### Task 7: Create GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the workflow file**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy to GitHub Pages workflow"
```

---

### Task 8: Build and verify

- [ ] **Step 1: Run the build**

```bash
pnpm build
```

Expected: build succeeds with no errors, `out/` directory is created.

- [ ] **Step 2: Verify output structure**

```bash
ls out/
```

Expected: `index.html` (landing page), `orbit.html`, `docs.html`, `docs/tutorial.html`, `docs/methodology.html`, `docs/usage.html`, `docs/changelog.html`, `404.html`, plus JS/CSS assets.

- [ ] **Step 3: Verify basePath in HTML**

```bash
grep -r '/OrbitAN' out/index.html | head -5
```

Expected: links and asset paths contain `/OrbitAN` prefix.

- [ ] **Step 4: Verify no server-only imports remain**

```bash
grep -r 'cookies()' out/ 2>/dev/null || echo "No server cookies found"
grep -r 'next/headers' out/ 2>/dev/null || echo "No next/headers found"
```

Expected: no matches — `cookies()` and `next/headers` are build-time only and shouldn't appear in static output.

- [ ] **Step 5: Configure GitHub Pages settings**

Before pushing, go to repo Settings → Pages and set:
- Source: "GitHub Actions"

- [ ] **Step 6: Push to trigger deployment**

```bash
git push origin main
```

Then navigate to `https://linearwings.github.io/OrbitAN` and verify:
- Landing page loads with correct language
- Navigation links work (docs, orbit)
- Orbit mode page loads and Canvas renders
- Language switcher works

---

## Verification Checklist (Post-Deploy)

- [ ] Landing page renders at `linearwings.github.io/OrbitAN`
- [ ] All docs pages accessible via navigation
- [ ] Orbit mode page loads with Canvas 2D clock
- [ ] Language switcher works (cookie persists across pages)
- [ ] Task creation, editing, deletion work (localStorage)
- [ ] No 404s on JS/CSS assets
- [ ] No console errors
