"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LiveClock from "@/components/landing/LiveClock";

/* ═══════════════════════════════════════════
   Lusion.co DNA → Dark Space Landing
   Typography as architecture.
   Content first. Motion with purpose.
   ═══════════════════════════════════════════ */

/* ── Scroll reveal hook ── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ── Counter animation ── */
function useCountUp(target: number, visible: boolean, duration = 1.2) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / (duration * 1000));
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, visible, duration]);

  return value;
}

/* ── Feature Card ── */
function FeatureCard({
  index,
  tag,
  title,
  desc,
  visible,
}: {
  index: number;
  tag: string;
  title: string;
  desc: string;
  visible: boolean;
}) {
  const count = useCountUp(99, visible);
  return (
    <div
      className="fc"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      <div className="fc-top">
        <span className="fc-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="fc-stat">
          {count}
          <span className="fc-stat-unit">%</span>
        </span>
      </div>
      <span className="fc-tag">{tag}</span>
      <h3 className="fc-title">{title}</h3>
      <p className="fc-desc">{desc}</p>
      <div className="fc-line" />
    </div>
  );
}

/* ── Page ── */

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  const [dateStr, setDateStr] = useState("");
  const [utcStr, setUtcStr] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setDateStr(`${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`);
    setUtcStr(`UTC${now.getTimezoneOffset() <= 0 ? "+" : ""}${-Math.floor(now.getTimezoneOffset() / 60)}`);
    const tick = () => {
      const d = new Date();
      setCurrentTime(`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const features = [
    { tag: "ORBIT ENGINE", title: t.feature_clock_title, desc: t.feature_clock_desc },
    { tag: "NAVIGATION MATRIX", title: t.feature_methods_title, desc: t.feature_methods_desc },
    { tag: "FOCUS PROTOCOL", title: t.feature_focus_title, desc: t.feature_focus_desc },
  ];

  const steps = [
    { time: "00", title: t.how_1_title, desc: t.how_1_desc },
    { time: "06", title: t.how_2_title, desc: t.how_2_desc },
    { time: "12", title: t.how_3_title, desc: t.how_3_desc },
    { time: "18", title: t.how_4_title, desc: t.how_4_desc },
  ];

  const featRef = useScrollReveal();
  const workRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="landing">
      {/* Background */}
      <div className="landing-bg" aria-hidden="true" />

      {/* ══════ HERO ══════ */}
      <section className="hero">
        <div className="hero-center">
          {/* Clock as hero visual */}
          <div className="hero-clock-wrap">
            <div className="hero-orbit-ring" style={{ width: "110%", height: "110%", animationDuration: "60s" }} />
            <div className="hero-orbit-ring" style={{ width: "125%", height: "125%", animationDuration: "80s", animationDirection: "reverse" }} />
            <div className="hero-orbit-ring" style={{ width: "140%", height: "140%", animationDuration: "100s" }} />
            <LiveClock />
          </div>

          {/* Meta */}
          <div className="hero-meta">
            <span>{dateStr}</span>
            <span className="hero-meta-sep" />
            <span>{utcStr}</span>
            <span className="hero-meta-sep" />
            <span className="hero-meta-dim">{currentTime}</span>
          </div>

          {/* Headline */}
          <h1 className="hero-h1">{t.hero_title_1}</h1>

          {/* Description */}
          <p className="hero-p">{t.hero_desc}</p>

          {/* CTA */}
          <Link href="/orbit" className="cta">
            <span className="cta-text">{t.hero_cta}</span>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        {/* Bottom scroll indicator */}
        <div className="hero-bottom">
          <div className="hero-cross-row" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12"><path d="M7 0v14M0 7h14"/></svg>
          </div>
          <span className="hero-scroll">scroll to explore</span>
          <div className="hero-scroll-bar" />
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="feat-section" id="features">
        <div ref={featRef.ref} className="feat-inner">
          <div className="sec-label">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4"><path d="M7 0v14M0 7h14"/></svg>
            <span>{t.features_title}</span>
          </div>

          <h2
            className="sec-h2"
            style={{
              opacity: featRef.visible ? 1 : 0,
              transform: featRef.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {lang === "zh" ? "三大核心系统" : "Three Core Systems"}
          </h2>

          <div className="feat-grid">
            {features.map((f, i) => (
              <FeatureCard key={i} index={i} tag={f.tag} title={f.title} desc={f.desc} visible={featRef.visible} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WORKFLOW ══════ */}
      <section className="work-section" id="workflow">
        <div ref={workRef.ref} className="work-inner">
          <div className="sec-label">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4"><path d="M7 0v14M0 7h14"/></svg>
            <span>{t.how_title}</span>
          </div>

          <h2
            className="sec-h2"
            style={{
              opacity: workRef.visible ? 1 : 0,
              transform: workRef.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {lang === "zh" ? "进入轨道的四个步骤" : "Four Steps to Orbit"}
          </h2>

          <div className="work-grid">
            {steps.map((s, i) => (
              <div
                key={i}
                className="work-card"
                style={{
                  opacity: workRef.visible ? 1 : 0,
                  transform: workRef.visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                }}
              >
                <span className="work-time">{s.time}</span>
                <div className="work-dot" />
                <h4 className="work-title">{s.title}</h4>
                <p className="work-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ END CTA (Lusion-style dark block with massive text) ══════ */}
      <section className="end-section">
        <div ref={ctaRef.ref} className="end-inner">
          <div className="end-cross-row" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15"><path d="M7 0v14M0 7h14"/></svg>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15"><path d="M7 0v14M0 7h14"/></svg>
          </div>

          <p
            className="end-p"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {t.cta_body}
          </p>

          <h2
            className="end-h2"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transform: ctaRef.visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s 0.1s cubic-bezier(0.16,1,0.3,1), transform 0.8s 0.1s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {lang === "zh" ? "准备进入轨道" : "Ready to Enter Orbit"}
          </h2>

          <Link
            href="/orbit"
            className="cta cta-lg"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transition: "opacity 0.5s 0.25s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span className="cta-text">{t.cta_button}</span>
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>

          <div
            className="end-status"
            style={{
              opacity: ctaRef.visible ? 1 : 0,
              transition: "opacity 0.4s 0.35s ease",
            }}
          >
            <span className="end-dot" />
            {t.cta_label}
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="footer">
        <span>{t.footer_text}</span>
        <div className="footer-right">
          <Link href="/docs">{t.footer_docs}</Link>
          <span className="footer-sep" />
          <Link href="/orbit">{t.footer_launch}</Link>
        </div>
      </footer>
    </div>
  );
}
