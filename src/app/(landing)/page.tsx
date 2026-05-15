"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LiveClock from "@/components/landing/LiveClock";

/* ═══════════════════════════════════════════
   TYPOGRAPHY-DRIVEN LANDING
   Lusion.co DNA → Dark Space Adaptation
   ═══════════════════════════════════════════ */

/* ── Word-level scroll reveal ── */
function AnimatedWords({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="reveal-word"
          style={{ transitionDelay: `${i * 0.04}s` }}
        >
          {word}{" "}
        </span>
      ))}
    </span>
  );
}

/* ── Cross decoration (Lusion-style + marks) ── */
function CrossMark({ size = 14, opacity = 0.15 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ── Small label (Lusion-style tiny uppercase) ── */
function SectionLabel({ children }: { children: string }) {
  return (
    <span className="section-label">
      <CrossMark size={10} opacity={0.3} />
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════
   FEATURE CARD — minimal, typographic
   ═══════════════════════════════════════════ */

interface Feature {
  tag: string;
  title: string;
  desc: string;
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <div className="feature-card">
      <span className="feature-card__index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="feature-card__tag">{feature.tag}</span>
      <h3 className="feature-card__title">{feature.title}</h3>
      <p className="feature-card__desc">{feature.desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WORKFLOW STEP — sequential
   ═══════════════════════════════════════════ */

interface Step {
  time: string;
  title: string;
  desc: string;
}

function WorkflowStep({ step, index }: { step: Step; index: number }) {
  return (
    <div className="workflow-step">
      <span className="workflow-step__time">{step.time}</span>
      <div className="workflow-step__node" />
      <h4 className="workflow-step__title">{step.title}</h4>
      <p className="workflow-step__desc">{step.desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  const [dateStr, setDateStr] = useState("");
  const [utcStr, setUtcStr] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const now = new Date();
    setDateStr(
      `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`
    );
    setUtcStr(
      `UTC${now.getTimezoneOffset() <= 0 ? "+" : ""}${-Math.floor(now.getTimezoneOffset() / 60)}`
    );
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features: Feature[] = [
    { tag: "Orbit Engine", title: t.feature_clock_title, desc: t.feature_clock_desc },
    { tag: "Navigation Matrix", title: t.feature_methods_title, desc: t.feature_methods_desc },
    { tag: "Focus Protocol", title: t.feature_focus_title, desc: t.feature_focus_desc },
  ];

  const steps: Step[] = [
    { time: "00", title: t.how_1_title, desc: t.how_1_desc },
    { time: "06", title: t.how_2_title, desc: t.how_2_desc },
    { time: "12", title: t.how_3_title, desc: t.how_3_desc },
    { time: "18", title: t.how_4_title, desc: t.how_4_desc },
  ];

  return (
    <div className="landing">
      {/* ══════ Global deep space background ══════ */}
      <div className="landing-bg" aria-hidden="true" />

      {/* ══════ HERO ══════ */}
      <section className="hero">
        {/* Cross decorations — Lusion-style */}
        <div className="hero-crosses" aria-hidden="true">
          <CrossMark /><CrossMark /><CrossMark /><CrossMark /><CrossMark />
        </div>

        {/* Data line */}
        <div className="hero-meta">
          <span>{dateStr || "2026.05.15"}</span>
          <span className="hero-meta__sep" />
          <span>{utcStr || "UTC+8"}</span>
          <span className="hero-meta__sep" />
          <span>MISSION LOG #003</span>
        </div>

        {/* Central clock */}
        <div className="hero-clock">
          <LiveClock />
        </div>

        {/* Massive headline — Lusion-style typography */}
        <h1 className="hero-title">
          <AnimatedWords text={t.hero_title_1} />
        </h1>

        <p className="hero-desc">{t.hero_desc}</p>

        {/* CTA */}
        <div className="hero-cta-row">
          <Link href="/orbit" className="cta-primary">
            {t.hero_cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <span className="hero-scroll-label">
            scroll to explore
            <span className="hero-scroll-line" />
          </span>
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="features" id="features">
        <div className="section-header">
          <SectionLabel>{t.features_title}</SectionLabel>
          <h2 className="section-heading">
            <AnimatedWords text={lang === "zh" ? "三大核心系统" : "Three Core Systems"} />
          </h2>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </section>

      {/* ══════ WORKFLOW ══════ */}
      <section className="workflow" id="workflow">
        <div className="section-header">
          <SectionLabel>{t.how_title}</SectionLabel>
          <h2 className="section-heading">
            <AnimatedWords text={lang === "zh" ? "进入轨道的四个步骤" : "Four Steps to Orbit"} />
          </h2>
        </div>
        <div className="workflow-steps">
          {steps.map((s, i) => (
            <WorkflowStep key={i} step={s} index={i} />
          ))}
        </div>
      </section>

      {/* ══════ END CTA — Lusion-style oversized text ══════ */}
      <section className="end-cta">
        {/* Cross decorations */}
        <div className="hero-crosses" aria-hidden="true">
          <CrossMark /><CrossMark /><CrossMark /><CrossMark /><CrossMark />
        </div>

        <p className="end-cta__prompt">{t.cta_body}</p>

        <h2 className="end-cta__title">
          {lang === "zh" ? "准备进入轨道" : "Ready to Enter Orbit"}
        </h2>

        <Link href="/orbit" className="cta-primary cta-primary--large">
          {t.cta_button}
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>

        <div className="end-cta__status">
          <span className="end-cta__dot" />
          {t.cta_label}
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="footer">
        <span>{t.footer_text}</span>
        <div className="footer-links">
          <Link href="/docs">{t.footer_docs}</Link>
          <span className="footer-sep" />
          <Link href="/orbit">{t.footer_launch}</Link>
        </div>
      </footer>
    </div>
  );
}
