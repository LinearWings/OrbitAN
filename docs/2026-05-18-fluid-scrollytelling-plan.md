# Fluid Scrollytelling Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the landing page from static one-shot reveals to a continuous kinetic narrative driven by scroll progress and mouse position.

**Architecture:** Each section component replaces `useReveal` with `useScrollProgress` for scroll-linked transforms. A new `useMousePosition` hook provides normalized cursor coordinates for parallax. `LandingLightEffects` shifts atmosphere per-section. Section transitions use overlapping fade/translate instead of hard dividers.

**Tech Stack:** React 19, Next.js 16, CSS keyframes, existing `useScrollProgress` hook — no new dependencies.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/hooks/useScrollProgress.ts` | Modify | Add `useMousePosition` hook |
| `src/components/landing/LandingLightEffects.tsx` | Modify | Scroll-driven density/color, mouse parallax layer |
| `src/components/landing/HeroSection.tsx` | Modify | Glyph scatter/reform, logo shrink, tagline/CTA fade |
| `src/components/landing/OrbitEngineDemo.tsx` | Modify | Cards fly in from 3 directions, 3D tilt hover |
| `src/components/landing/MethodologyCards.tsx` | Modify | Fan-out from center, scroll-linked glow |
| `src/components/landing/FocusBlocksDemo.tsx` | Modify | Progressive arc drawing, legend stagger |
| `src/components/landing/KeyboardNav.tsx` | Modify | Spring bounce entrance |
| `src/components/landing/CTASection.tsx` | Modify | Converging beams, typewriter title, pulsing CTA |
| `src/app/(landing)/page.tsx` | Modify | Light beam tracks, mouse parallax wrapper |
| `src/app/globals.css` | Modify | New keyframes, section overlap, beam styles |

---

### Task 1: Add `useMousePosition` Hook

**Files:**
- Modify: `src/hooks/useScrollProgress.ts`

- [ ] **Step 1: Add the hook at the end of the file**

```ts
/**
 * Returns normalized mouse position relative to viewport center.
 * x: -1 (left) to 1 (right), y: -1 (top) to 1 (bottom).
 * Updated via rAF, stored in ref to avoid re-renders.
 */
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        pos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return pos;
}
```

- [ ] **Step 2: Add `useRef` to the existing import if not already present**

The file already imports `useRef` — verify line 3: `import { useEffect, useRef, useState, useCallback } from "react";`

- [ ] **Step 3: Verify build**

Run: `npx next build`
Expected: TypeScript passes, no errors.

---

### Task 2: Rewrite `LandingLightEffects` — Scroll-Driven Atmosphere

**Files:**
- Modify: `src/components/landing/LandingLightEffects.tsx`

- [ ] **Step 1: Replace the component with scroll-driven version**

The component needs to:
- Accept a `sectionIndex` prop (0=Hero, 1=Features, 2=Methods, 3=Focus, 4=Keyboard, 5=CTA)
- Shift spotlight color per section
- Adjust star field density via opacity
- Apply mouse parallax to all three layers

Full rewrite:

```tsx
"use client";

import { useEffect, useRef } from "react";

const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 13) % 100}%`,
  size: [1, 1.5, 2][i % 3],
  baseOpacity: 0.15 + (i % 5) * 0.1,
  duration: 3 + (i % 6),
  delay: (i * 0.37) % 5,
  hue: i % 7 === 0 ? "amber" : i % 5 === 0 ? "blue" : "white",
}));

const DUST = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 29 + 5) % 100}%`,
  size: 1 + (i % 3),
  duration: 15 + (i % 4) * 5,
  delay: (i * 1.2) % 8,
  drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 15),
  opacity: 0.08 + (i % 4) * 0.04,
}));

const SPOTLIGHT_COLORS = [
  "rgba(59,130,246,.06)",   // Hero — blue-white
  "rgba(59,130,246,.08)",   // Features — blue
  "rgba(245,158,11,.06)",   // Methods — amber
  "rgba(99,102,241,.06)",   // Focus — violet
  "rgba(59,130,246,.05)",   // Keyboard — blue
  "rgba(245,158,11,.08)",   // CTA — amber
];

interface Props {
  sectionIndex: number;
}

export function LandingLightEffects({ sectionIndex }: Props) {
  const spotRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    const stars = starsRef.current;
    const dust = dustRef.current;
    if (!spot) return;

    let raf: number;
    let shown = false;

    const update = (mx: number, my: number) => {
      const y = window.scrollY;
      if (stars) stars.style.transform = `translate(${mx * 15}px, ${y * 0.03 + my * 15}px)`;
      if (dust) dust.style.transform = `translate(${mx * 40}px, ${y * 0.08 + my * 40}px)`;
      spot.style.transform = `translate(${mx * 60}px, ${my * 60}px)`;
    };

    const onMove = (e: MouseEvent) => {
      if (!shown) { spot.classList.add("l-spotlight-visible"); shown = true; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        update(mx, my);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(0, 0));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Update spotlight color when section changes
  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;
    const color = SPOTLIGHT_COLORS[sectionIndex] || SPOTLIGHT_COLORS[0];
    spot.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  }, [sectionIndex]);

  const starColor = (hue: string) =>
    hue === "amber" ? "rgba(245,158,11," : hue === "blue" ? "rgba(59,130,246," : "rgba(255,255,255,";

  return (
    <>
      <div className="l-stars" ref={starsRef} aria-hidden="true">
        {STARS.map((s) => (
          <div key={s.id} className="l-star" style={{
            left: s.left, top: s.top, width: s.size, height: s.size,
            animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
            "--star-color": starColor(s.hue), "--star-opacity": s.baseOpacity,
          } as React.CSSProperties} />
        ))}
      </div>
      <div className="l-spotlight" ref={spotRef} aria-hidden="true" />
      <div className="l-dust" ref={dustRef} aria-hidden="true">
        {DUST.map((d) => (
          <div key={d.id} className="l-dust-p" style={{
            left: d.left, width: d.size, height: d.size,
            animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s`,
            "--dust-drift": `${d.drift}px`, opacity: d.opacity,
          } as React.CSSProperties} />
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Build passes. The `sectionIndex` prop is not yet passed — that's OK, Task 8 handles it.

---

### Task 3: Rewrite `HeroSection` — Scroll Choreography

**Files:**
- Modify: `src/components/landing/HeroSection.tsx`

- [ ] **Step 1: Replace the component with scroll-driven version**

Key changes:
- Glyphs scatter outward as `progress` goes 0→0.5, using per-glyph direction vectors
- Logo rises and scales down
- Tagline and CTA fade based on progress
- Remove `useReveal` — use only `useScrollProgress`

```tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { FloatingTimestamps } from "./FloatingTimestamps";
import { ScrollIndicator } from "./ScrollIndicator";
import { OrbitanLogo } from "./OrbitanLogo";

interface Glyph {
  char: string;
  x: string;
  y: string;
  size: string;
  opacity: number;
  weight: number;
  dx: number; // scatter direction x (-1 to 1)
  dy: number; // scatter direction y (-1 to 1)
}

const LEFT_GLYPHS: Glyph[] = [
  { char: "轨", x: "4%",  y: "16%", size: "clamp(2.6rem,5.2vw,4.8rem)", opacity: 0.56, weight: 700, dx: -1, dy: -0.5 },
  { char: "划", x: "7%",  y: "32%", size: "clamp(2rem,4vw,3.6rem)", opacity: 0.44, weight: 500, dx: -0.8, dy: 0 },
  { char: "分", x: "3%",  y: "50%", size: "clamp(2.9rem,5.8vw,5.2rem)", opacity: 0.62, weight: 700, dx: -1, dy: 0.3 },
  { char: "秒", x: "6%",  y: "68%", size: "clamp(1.8rem,3.6vw,3.2rem)", opacity: 0.40, weight: 500, dx: -0.7, dy: 0.6 },
];

const RIGHT_GLYPHS: Glyph[] = [
  { char: "注", x: "88%", y: "18%", size: "clamp(3rem,6vw,5.6rem)", opacity: 0.64, weight: 700, dx: 1, dy: -0.5 },
  { char: "定", x: "91%", y: "36%", size: "clamp(1.8rem,3.6vw,3rem)", opacity: 0.42, weight: 500, dx: 0.9, dy: 0 },
  { char: "乾", x: "87%", y: "54%", size: "clamp(2.3rem,4.6vw,4rem)", opacity: 0.52, weight: 600, dx: 1, dy: 0.3 },
  { char: "坤", x: "90%", y: "70%", size: "clamp(2.5rem,5vw,4.6rem)", opacity: 0.56, weight: 700, dx: 0.8, dy: 0.6 },
];

const EN_GLYPHS = [
  { text: "TIME",    x: "3%",  y: "12%", size: "clamp(.6rem,1.2vw,1rem)", opacity: 0.2, dx: -1, dy: -0.5 },
  { text: "ORBITED", x: "6%",  y: "28%", size: "clamp(.55rem,1vw,.85rem)", opacity: 0.16, dx: -0.8, dy: 0 },
  { text: "FOCUS",   x: "88%", y: "14%", size: "clamp(.6rem,1.2vw,1rem)", opacity: 0.2, dx: 1, dy: -0.5 },
  { text: "DETER-",  x: "90%", y: "32%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.15, dx: 0.9, dy: 0 },
  { text: "MINED",   x: "87%", y: "64%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.15, dx: 0.8, dy: 0.5 },
];

export function HeroSection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, progress } = useScrollProgress();
  const isZh = lang === "zh";
  const logoRef = useRef<HTMLDivElement>(null);

  // Scatter intensity: 0 at progress=0, max at progress=0.5
  const scatter = Math.min(1, progress * 2);
  // Fade: starts at progress=0.3, gone by progress=0.7
  const fade = Math.max(0, 1 - (progress - 0.3) / 0.4);

  return (
    <section className="l-hero-v2">
      <div className="l-hero-v2-canvas-wrap" ref={ref}>
        <FloatingTimestamps logoRef={logoRef} />

        <div className="l-hero-stage" style={{ opacity: fade }}>
          {/* Left glyphs — scatter outward */}
          {isZh && LEFT_GLYPHS.map((g, i) => (
            <span key={`l${i}`} className="l-hero-glyph" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: g.opacity * fade, fontWeight: g.weight,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.15})`,
              transition: "none",
            }}>
              {g.char}
            </span>
          ))}

          {/* Right glyphs — scatter outward */}
          {isZh && RIGHT_GLYPHS.map((g, i) => (
            <span key={`r${i}`} className="l-hero-glyph" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: g.opacity * fade, fontWeight: g.weight,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.15})`,
              transition: "none",
            }}>
              {g.char}
            </span>
          ))}

          {/* English glyphs */}
          {!isZh && EN_GLYPHS.map((g, i) => (
            <span key={i} className="l-hero-glyph l-hero-glyph-en" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: g.opacity * fade,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.1})`,
              transition: "none",
            }}>
              {g.text}
            </span>
          ))}

          {/* Logo — rises and shrinks */}
          <div ref={logoRef} className="l-hero-logo" style={{
            opacity: fade,
            transform: `translate(-50%, -50%) translateY(${progress * -60}px) scale(${1 - progress * 0.1})`,
            transition: "none",
          }}>
            <OrbitanLogo variant="hero" />
          </div>

          {/* Tagline — fades early */}
          <p className="l-hero-desc" style={{
            opacity: Math.max(0, fade - 0.3),
            transition: "none",
          }}>
            {isZh ? "轨划分秒 · 注定乾坤" : "TIME ORBITED · FOCUS DETERMINED"}
          </p>

          {/* CTA — fades slightly later */}
          <div className="l-hero-actions" style={{
            opacity: Math.max(0, fade - 0.15),
            transition: "none",
          }}>
            <div className="l-hero-actions-rule" />
            <div className="l-hero-actions-row">
              <Link href="/orbit" className="l-hero-btn l-hero-btn-primary">
                <span className="l-hero-btn-dot" />
                {t.hero_cta}
              </Link>
              <span className="l-hero-actions-sep" />
              <Link href="/docs" className="l-hero-btn l-hero-btn-secondary">
                {t.learn_more}
              </Link>
            </div>
            <div className="l-hero-actions-rule" />
          </div>
        </div>

        <ScrollIndicator />
        <div className="l-evap" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="l-evap-p" style={{
              left: `${12 + (i * 6) % 76}%`,
              animationDelay: `${i * 0.55}s`,
              animationDuration: `${5 + (i % 4) * 2}s`,
              "--drift": `${(i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2)}px`,
              "--drift-end": `${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3) * 2)}px`,
            } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 4: Rewrite `OrbitEngineDemo` — Scroll-Driven Card Entrance

**Files:**
- Modify: `src/components/landing/OrbitEngineDemo.tsx`

- [ ] **Step 1: Replace with scroll-driven version**

Cards fly in from three directions (left, bottom, right) as scroll progresses 0→0.5, then content reveals 0.5→0.8.

```tsx
"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getT } from "@/lib/i18n";

const PANELS = [
  { id: "engine", icon: "R1", iconBg: "rgba(59,130,246,.12)", iconColor: "#3B82F6", titleKey: "feature_clock_title", descKey: "feature_clock_desc", fromX: -120, fromY: 0 },
  { id: "methods", icon: "Rx", iconBg: "rgba(99,102,241,.12)", iconColor: "#6366F1", titleKey: "feature_methods_title", descKey: "feature_methods_desc", fromX: 0, fromY: 80 },
  { id: "focus", icon: "Fc", iconBg: "rgba(245,158,11,.12)", iconColor: "#F59E0B", titleKey: "feature_focus_title", descKey: "feature_focus_desc", fromX: 120, fromY: 0 },
];

export function OrbitEngineDemo() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, progress } = useScrollProgress();

  // Card entrance: 0→0.5 slide in, 0.5→0.8 content reveal
  const entrance = Math.min(1, progress / 0.5);
  const contentReveal = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));

  return (
    <section className="l-engine" ref={ref}>
      <div className="l-engine-inner">
        <div className="l-engine-deck">
          {PANELS.map((panel, i) => {
            const stagger = Math.max(0, entrance - i * 0.1);
            const cardProgress = Math.min(1, stagger / 0.8);
            const eased = 1 - Math.pow(1 - cardProgress, 3); // ease-out cubic
            return (
              <div
                key={panel.id}
                className="l-engine-card"
                style={{
                  opacity: eased,
                  transform: `translate(${panel.fromX * (1 - eased)}px, ${panel.fromY * (1 - eased)}px)`,
                  "--icon-r": parseInt(panel.iconColor.slice(1, 3), 16),
                  "--icon-g": parseInt(panel.iconColor.slice(3, 5), 16),
                  "--icon-b": parseInt(panel.iconColor.slice(5, 7), 16),
                } as React.CSSProperties}
              >
                <div className="l-engine-card-icon" style={{
                  background: panel.iconBg, color: panel.iconColor,
                  opacity: contentReveal > i * 0.15 ? 1 : 0,
                  transform: `scale(${contentReveal > i * 0.15 ? 1 : 0.5})`,
                  transition: "opacity 0.4s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                  {panel.icon}
                </div>
                <h3 className="l-engine-card-h" style={{
                  opacity: contentReveal > i * 0.15 + 0.1 ? 1 : 0,
                  transform: `translateY(${contentReveal > i * 0.15 + 0.1 ? 0 : 12}px)`,
                  transition: "opacity 0.4s 0.1s, transform 0.4s 0.1s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  {t[panel.titleKey as keyof typeof t]}
                </h3>
                <p className="l-engine-card-d" style={{
                  opacity: contentReveal > i * 0.15 + 0.2 ? 1 : 0,
                  transition: "opacity 0.4s 0.2s",
                }}>
                  {t[panel.descKey as keyof typeof t]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 5: Rewrite `MethodologyCards` — Fan-Out Animation

**Files:**
- Modify: `src/components/landing/MethodologyCards.tsx`

- [ ] **Step 1: Replace with scroll-driven fan-out**

Cards start stacked at center with rotation offsets, then fan out to their grid positions as scroll progresses 0→0.5. Content fades in 0.5→0.8.

```tsx
"use client";

import { useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useScrollProgress } from "@/hooks/useScrollProgress";

// ... keep existing METHODS array and preview components unchanged ...
```

Replace only the `MethodologyCards` function. Keep all `METHODS` data and preview components (`GTDPreview`, `PomodoroPreview`, etc.) exactly as they are.

```tsx
export function MethodologyCards() {
  const lang = useLanguage();
  const { ref, progress } = useScrollProgress();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${x}%`);
    e.currentTarget.style.setProperty("--my", `${y}%`);
  }, []);

  // Fan-out: 0→0.5 cards spread from center, 0.5→0.8 content reveals
  const fanProgress = Math.min(1, progress / 0.5);
  const contentReveal = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));

  // Rotation offsets for fan effect (degrees)
  const rotations = [-5, -3, -1, 1, 3, 5];

  return (
    <section className="l-methods" ref={ref}>
      <div className="l-methods-inner">
        <div className="l-methods-top">
          <h2 className="l-methods-h2" style={{
            opacity: Math.min(1, fanProgress * 2),
            transform: `translateY(${(1 - Math.min(1, fanProgress * 2)) * 18}px)`,
          }}>
            {lang === "zh" ? "六维时间管理" : "Six Dimensions of Time Management"}
          </h2>
          <p className="l-methods-disc" style={{
            opacity: Math.min(1, fanProgress * 2 - 0.2),
          }}>
            {lang === "zh"
              ? "六种经典方法论，各有专属面板。"
              : "Six proven methodologies, each with its own dedicated panel."}
          </p>
        </div>

        <div className="l-methods-grid">
          {METHODS.map((m, i) => {
            const stagger = Math.max(0, fanProgress - i * 0.05);
            const cardProgress = Math.min(1, stagger / 0.7);
            const eased = 1 - Math.pow(1 - cardProgress, 3);
            const rot = rotations[i] * (1 - eased);
            const contentVisible = contentReveal > i * 0.08;
            return (
              <div
                key={m.id}
                className="l-method-card"
                onMouseMove={handleMouseMove}
                style={{
                  opacity: eased,
                  transform: `rotate(${rot}deg) scale(${0.9 + eased * 0.1})`,
                }}
              >
                <span className="l-method-tag" style={{
                  color: m.color, background: `${m.color}18`,
                  opacity: contentVisible ? 1 : 0,
                  transition: "opacity 0.4s",
                }}>
                  {m.tag}
                </span>
                <h3 className="l-method-name" style={{
                  color: m.color,
                  opacity: contentVisible ? 1 : 0,
                  transform: `translateY(${contentVisible ? 0 : 10}px)`,
                  transition: "opacity 0.4s 0.05s, transform 0.4s 0.05s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  {m.name[lang === "zh" ? "zh" : "en"]}
                </h3>
                <p className="l-method-desc" style={{
                  opacity: contentVisible ? 1 : 0,
                  transition: "opacity 0.4s 0.1s",
                }}>
                  {m.desc[lang === "zh" ? "zh" : "en"]}
                </p>
                <div className="l-method-preview" style={{ borderColor: `${m.color}20` }}>
                  <div className="l-method-preview-inner" style={{ background: `${m.color}08` }}>
                    {m.id === "gtd" && <GTDPreview color={m.color} />}
                    {m.id === "pomodoro" && <PomodoroPreview color={m.color} />}
                    {m.id === "pareto" && <ParetoPreview color={m.color} />}
                    {m.id === "moffatt" && <MoffattPreview color={m.color} />}
                    {m.id === "howell" && <HowellPreview color={m.color} />}
                    {m.id === "swot" && <SWOTPreview color={m.color} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 6: Rewrite `FocusBlocksDemo` — Progressive Arc Drawing

**Files:**
- Modify: `src/components/landing/FocusBlocksDemo.tsx`

- [ ] **Step 1: Replace with scroll-driven arc drawing**

Arcs progressively draw their `stroke-dashoffset` from full to 0 as scroll progresses 0.3→0.8. Legend items stagger in at 0.8+.

```tsx
"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const FOCUS_METHODS = [
  { id: "gtd", label: "GTD", color: "#22C55E" },
  { id: "pomodoro", label: "Pomodoro", color: "#EF4444" },
  { id: "pareto", label: "Pareto", color: "#2563EB" },
  { id: "moffatt", label: "Moffatt", color: "#7C3AED" },
  { id: "howell", label: "Howell", color: "#F97316" },
  { id: "swot", label: "SWOT", color: "#EAB308" },
];

export function FocusBlocksDemo() {
  const lang = useLanguage();
  const { ref, progress } = useScrollProgress();

  // Clock housing: 0→0.3 fade in
  const housingOpacity = Math.min(1, progress / 0.3);
  // Arcs draw: 0.3→0.8
  const arcProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.5));
  // Legend: 0.8→1.0
  const legendProgress = Math.max(0, (progress - 0.8) / 0.2);

  return (
    <section className="l-focus" ref={ref}>
      <div className="l-focus-inner">
        <div className="l-focus-clock" style={{ opacity: housingOpacity }}>
          <svg viewBox="0 0 220 220" className="l-focus-clock-svg">
            <defs>
              <filter id="focusGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle className="l-focus-ring" cx="110" cy="110" r="85" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <circle className="l-focus-ring" cx="110" cy="110" r="65" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <circle className="l-focus-ring" cx="110" cy="110" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

            {FOCUS_METHODS.map((m, i) => {
              const r = 90 + i * 3.5;
              const startAngle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const sweep = (0.22 + (i / FOCUS_METHODS.length) * 0.22) * Math.PI * 2;
              const circumference = r * sweep;
              const drawn = arcProgress * circumference;
              const x1 = 110 + r * Math.cos(startAngle);
              const y1 = 110 + r * Math.sin(startAngle);
              const x2 = 110 + r * Math.cos(startAngle + sweep);
              const y2 = 110 + r * Math.sin(startAngle + sweep);
              const largeArc = sweep > Math.PI ? 1 : 0;
              return (
                <path
                  key={m.id}
                  className="l-focus-arc"
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={m.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#focusGlow)"
                  opacity="0.7"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - drawn}
                />
              );
            })}

            <line x1="110" y1="110" x2="110" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="110" y1="110" x2="160" y2="110" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round" />
            <circle className="l-focus-hub" cx="110" cy="110" r="3" fill="#3B82F6" />
          </svg>
        </div>

        <div className="l-focus-content">
          <h2 className="l-focus-h2" style={{
            opacity: housingOpacity,
            transform: `translateY(${(1 - housingOpacity) * 18}px)`,
          }}>
            {lang === "zh" ? "专注块系统" : "Focus Blocks"}
          </h2>
          <p className="l-focus-desc" style={{ opacity: Math.min(1, housingOpacity + 0.2) }}>
            {lang === "zh"
              ? "将方法论会话时间盒化，显示在时钟外环。planned → active → paused → completed。"
              : "Time-box your methodology sessions. Visualized as colored arcs on the clock's outer rings."}
          </p>

          <div className="l-focus-legend">
            {FOCUS_METHODS.map((m, i) => (
              <span key={m.id} className="l-focus-legend-item" style={{
                opacity: Math.max(0, Math.min(1, (legendProgress - i * 0.1) / 0.5)),
                transform: `translateY(${Math.max(0, (1 - Math.min(1, (legendProgress - i * 0.1) / 0.5))) * 10}px)`,
              }}>
                <span className="l-focus-legend-dot" style={{ background: m.color }} />
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 7: Rewrite `KeyboardNav` — Spring Bounce Entrance

**Files:**
- Modify: `src/components/landing/KeyboardNav.tsx`

- [ ] **Step 1: Replace with scroll-driven spring bounce**

Cards bounce in from below with elastic easing as scroll progresses 0→0.5.

```tsx
"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const SHORTCUTS = [
  { keys: ["←", "→"], label: { zh: "前一天/后一天", en: "Prev/Next Day" } },
  { keys: ["T"], label: { zh: "今天", en: "Today" } },
  { keys: ["N"], label: { zh: "新建任务", en: "New Task" } },
  { keys: ["O"], label: { zh: "轨道模式", en: "Orbit Mode" } },
  { keys: ["Delete"], label: { zh: "删除选中", en: "Delete Selected" } },
  { keys: ["1", "2", "3", "4"], label: { zh: "类型筛选", en: "Filter by Type" } },
  { keys: ["0"], label: { zh: "清除筛选", en: "Clear Filter" } },
  { keys: ["Esc"], label: { zh: "关闭面板", en: "Close Panel" } },
];

export function KeyboardNav() {
  const lang = useLanguage();
  const { ref, progress } = useScrollProgress();

  const headingProgress = Math.min(1, progress / 0.2);

  return (
    <section className="l-keys-section" ref={ref}>
      <div className="l-keys-inner">
        <h2 className="l-keys-h2" style={{
          opacity: headingProgress,
          transform: `translateY(${(1 - headingProgress) * 18}px)`,
        }}>
          {lang === "zh" ? "全键盘操作" : "Full Keyboard Navigation"}
        </h2>
        <p className="l-keys-sub" style={{
          opacity: Math.min(1, headingProgress - 0.2),
        }}>
          {lang === "zh" ? "每个操作，一次按键。" : "Every action, one keystroke away."}
        </p>

        <div className="l-keys-grid">
          {SHORTCUTS.map((s, i) => {
            const stagger = Math.max(0, (progress - 0.15) / 0.35);
            const cardProgress = Math.min(1, stagger - i * 0.04);
            // Spring overshoot: peaks at ~1.08 then settles to 1
            const spring = cardProgress < 0
              ? 0
              : cardProgress < 0.7
                ? cardProgress / 0.7 * 1.08
                : 1.08 - (cardProgress - 0.7) / 0.3 * 0.08;
            const scale = Math.min(1.08, Math.max(0, spring));
            return (
              <div key={i} className="l-keys-card" style={{
                opacity: Math.min(1, cardProgress * 2),
                transform: `translateY(${(1 - scale) * 40}px) scale(${scale}) rotate(${-2 * (1 - Math.min(1, cardProgress))}deg)`,
              }}>
                <div className="l-keys-keys">
                  {s.keys.map((k) => (
                    <kbd key={k} className="l-keys-kbd">{k}</kbd>
                  ))}
                </div>
                <span className="l-keys-label">{s.label[lang === "zh" ? "zh" : "en"]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 8: Rewrite `CTASection` — Converging Beams + Typewriter

**Files:**
- Modify: `src/components/landing/CTASection.tsx`

- [ ] **Step 1: Replace with scroll-driven converging beams**

Light beams from 4 corners converge to center as scroll 0→0.5. Title characters appear one by one 0.5→0.8. CTA button fades in with pulse 0.8→1.0.

```tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function CTASection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, progress } = useScrollProgress();

  const ctaText = lang === "zh" ? "准备进入轨道" : "Ready to Enter Orbit";

  // Beams converge: 0→0.5
  const beamProgress = Math.min(1, progress / 0.5);
  // Title typewriter: 0.4→0.8
  const titleProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.4));
  // CTA button: 0.7→1.0
  const ctaProgress = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));

  const chars = ctaText.split("");

  return (
    <section className="l-cta" ref={ref}>
      {/* Converging light beams */}
      <div className="l-cta-beams" aria-hidden="true">
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner, i) => {
          const angle = [225, 315, 135, 45][i];
          const spread = (1 - beamProgress) * 30;
          return (
            <div key={corner} className="l-cta-beam" style={{
              transform: `rotate(${angle + (i % 2 === 0 ? -spread : spread)}deg)`,
              opacity: 0.03 + beamProgress * 0.05,
            }} />
          );
        })}
      </div>

      <div className="l-cta-inner">
        <div className="l-cta-crosses" aria-hidden="true">
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
        </div>

        <h2 className="l-cta-title">
          {chars.map((c, i) => {
            const charProgress = Math.max(0, Math.min(1, (titleProgress - i * (0.8 / chars.length)) / (0.8 / chars.length)));
            return (
              <span key={i} style={{
                opacity: charProgress,
                transform: `translateY(${(1 - charProgress) * 20}px)`,
                display: "inline-block",
                transition: "none",
              }}>
                {c === " " ? " " : c}
              </span>
            );
          })}
        </h2>

        <p className="l-cta-desc" style={{
          opacity: Math.max(0, titleProgress - 0.3),
        }}>
          {t.cta_body}
        </p>

        <div className="l-cta-actions" style={{
          opacity: ctaProgress,
          transform: `scale(${0.95 + ctaProgress * 0.05})`,
        }}>
          <Link href="/orbit" className="l-cta-btn l-cta-btn-primary">
            {t.hero_cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5" />
            </svg>
          </Link>
          <Link href="/docs" className="l-cta-btn l-cta-btn-secondary">
            {t.learn_more}
          </Link>
        </div>

        <div className="l-cta-keys" style={{
          opacity: Math.max(0, ctaProgress - 0.2),
        }}>
          <span className="l-cta-key"><kbd>←</kbd><kbd>→</kbd> Navigate</span>
          <span className="l-cta-key"><kbd>N</kbd> New</span>
          <span className="l-cta-key"><kbd>O</kbd> Orbit</span>
          <span className="l-cta-key"><kbd>1</kbd>-<kbd>4</kbd> Filter</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 9: Update `page.tsx` — Light Beam Tracks + Section Index

**Files:**
- Modify: `src/app/(landing)/page.tsx`

- [ ] **Step 1: Add section index tracking and replace SectionArrow with light beam tracks**

The page needs to:
1. Track which section is currently in view to pass `sectionIndex` to `LandingLightEffects`
2. Replace `SectionArrow` dividers with light beam track elements
3. Add section overlap via CSS classes

```tsx
"use client";

import { useEffect, useState } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { OrbitEngineDemo } from "@/components/landing/OrbitEngineDemo";
import { MethodologyCards } from "@/components/landing/MethodologyCards";
import { FocusBlocksDemo } from "@/components/landing/FocusBlocksDemo";
import { KeyboardNav } from "@/components/landing/KeyboardNav";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingLightEffects } from "@/components/landing/LandingLightEffects";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";

function LightBeamTrack({ color = "rgba(59,130,246,.12)" }: { color?: string }) {
  return (
    <div className="l-beam-track" aria-hidden="true">
      <div className="l-beam-track-line" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

function useActiveSection(ids: string[]) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx >= 0) setIndex(idx);
          }
        }
      },
      { threshold: 0.3 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return index;
}

const SECTION_IDS = ["hero", "features", "methods", "focus", "keyboard", "cta"];

export default function LandingPage() {
  const sectionIndex = useActiveSection(SECTION_IDS);

  return (
    <div className="landing">
      <ScrollProgressBar />
      <LandingLightEffects sectionIndex={sectionIndex} />
      <LandingNav />

      <div id="hero"><HeroSection /></div>

      <LightBeamTrack />
      <div id="features"><OrbitEngineDemo /></div>

      <LightBeamTrack color="rgba(99,102,241,.10)" />
      <div id="methods"><MethodologyCards /></div>

      <LightBeamTrack color="rgba(245,158,11,.08)" />
      <div id="focus"><FocusBlocksDemo /></div>

      <LightBeamTrack color="rgba(59,130,246,.10)" />
      <div id="keyboard"><KeyboardNav /></div>

      <LightBeamTrack color="rgba(99,102,241,.08)" />
      <div id="cta"><CTASection /></div>

      <LightBeamTrack color="rgba(245,158,11,.06)" />
      <LandingFooter />
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 10: Update `globals.css` — Light Beam Track + Section Overlap Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add light beam track styles**

Add after the existing `.l-section-arrow` styles (around line 969):

```css
/* ── Light Beam Track (replaces SectionArrow) ── */
.l-beam-track{
  display:flex;align-items:center;justify-content:center;
  padding:clamp(1rem,3vh,2rem) 0;overflow:hidden;
}
.l-beam-track-line{
  width:clamp(200px,60vw,800px);height:1px;
  opacity:0.6;
  animation:l-beam-pulse 4s ease-in-out infinite alternate;
}
@keyframes l-beam-pulse{
  0%{opacity:.3;filter:blur(0px)}
  50%{opacity:.8;filter:blur(1px)}
  100%{opacity:.4;filter:blur(0px)}
}
```

- [ ] **Step 2: Add section overlap transition styles**

```css
/* ── Section overlap for smooth transitions ── */
.landing > div[id]{
  position:relative;
}
```

- [ ] **Step 3: Add CTA beam styles**

```css
/* ── CTA Converging Beams ── */
.l-cta-beams{
  position:absolute;inset:0;overflow:hidden;pointer-events:none;
}
.l-cta-beam{
  position:absolute;top:50%;left:50%;
  width:200vw;height:1px;
  transform-origin:0 0;
  background:linear-gradient(90deg,rgba(245,158,11,.15),transparent 60%);
}
```

- [ ] **Step 4: Verify build**

Run: `npx next build`
Expected: Passes.

---

### Task 11: Final Integration Test

- [ ] **Step 1: Run production build**

Run: `npx next build`
Expected: All 10 pages generate successfully.

- [ ] **Step 2: Start dev server and verify**

Run: `npx dev`
Open `http://localhost:3000` and verify:
- Hero glyphs scatter on scroll, reform into clusters
- Features cards fly in from 3 directions
- Methodology cards fan out from center
- Focus arcs draw progressively
- Keyboard cards bounce in with spring
- CTA beams converge, title types out
- Mouse spotlight changes color per section
- Light beam tracks pulse between sections
- Scroll progress bar works at top
