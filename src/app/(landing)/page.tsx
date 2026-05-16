"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LiveClock from "@/components/landing/LiveClock";
import HeroVisual from "@/components/landing/HeroVisual";

/* ═══════════════════════════════════════════════════════
   Lusion.co structure replicated:
   Hero → Reel-like → Featured-like → Tunnel → End CTA
   Typography as architecture. Cross marks. Word animation.
   ═══════════════════════════════════════════════════════ */

/* ── Cross mark SVG ── */
const Cross = ({ s = 11, o = 0.15 }: { s?: number; o?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none"
    stroke="currentColor" strokeWidth="1" style={{ opacity: o }} aria-hidden="true">
    <path d="M7 0v14M0 7h14" />
  </svg>
);

/* ── Scroll reveal ── */
function useReveal(t = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); },
      { threshold: t, rootMargin: "0px 0px -30px 0px" });
    o.observe(el); return () => o.disconnect();
  }, [t]);
  return { ref, v };
}

/* ── Word-by-word reveal text ── */
function Words({ text, visible, className = "" }: { text: string; visible: boolean; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="l-word" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(0.3em)",
          transition: `opacity 0.5s, transform 0.6s cubic-bezier(0.16,1,0.3,1)`,
          transitionDelay: `${i * 0.03}s`,
        }}>{w}{" "}</span>
      ))}
    </span>
  );
}

/* ── Character-level dual-layer text (Lusion's "Let's Talk" effect) ── */
function DualChars({ text, visible }: { text: string; visible: boolean }) {
  return (
    <span className="dual-chars">
      {[...text].map((c, i) => (
        <span key={i} className="dc-wrapper" style={{
          opacity: visible ? 1 : 0,
          transition: `opacity 0.3s ${i * 0.025}s`,
        }}>
          <span className="dc-char">{c}</span>
          <span className="dc-clone" aria-hidden="true">{c}</span>
        </span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  const [date, setDate] = useState("");
  const [utc, setUtc] = useState("");

  useEffect(() => {
    const n = new Date();
    setDate(`${n.getFullYear()}.${String(n.getMonth()+1).padStart(2,"0")}.${String(n.getDate()).padStart(2,"0")}`);
    setUtc(`UTC${n.getTimezoneOffset()<=0?"+":""}${-Math.floor(n.getTimezoneOffset()/60)}`);
  }, []);

  const reel = useReveal(0.1);
  const feat = useReveal(0.1);
  const tunl = useReveal(0.08);
  const endC = useReveal(0.05);

  const features = [
    { tag: "ORBIT ENGINE", title: t.feature_clock_title, desc: t.feature_clock_desc },
    { tag: "NAVIGATION MATRIX", title: t.feature_methods_title, desc: t.feature_methods_desc },
    { tag: "FOCUS PROTOCOL", title: t.feature_focus_title, desc: t.feature_focus_desc },
  ];

  const steps = [
    { t: "00", h: t.how_1_title, d: t.how_1_desc },
    { t: "06", h: t.how_2_title, d: t.how_2_desc },
    { t: "12", h: t.how_3_title, d: t.how_3_desc },
    { t: "18", h: t.how_4_title, d: t.how_4_desc },
  ];

  return (
    <div className="landing">

      {/* ═══════ HERO ═══════ */}
      <section className="l-hero">
        <HeroVisual />

        {/* Center content */}
        <div className="l-hero-center">
          {/* Meta data row */}
          <div className="l-hmeta">
            <span>{date}</span><span className="l-hsep" />
            <span>{utc}</span><span className="l-hsep" />
            <span className="l-hdim">MISSION LOG #003</span>
          </div>

          {/* Clock — the hero visual anchor */}
          <div className="l-clock">
            <div className="l-orbit" style={{ width: "115%", height: "115%", animationDuration: "70s" }} />
            <div className="l-orbit" style={{ width: "132%", height: "132%", animationDuration: "95s", animationDirection: "reverse" }} />
            <div className="l-orbit" style={{ width: "150%", height: "150%", animationDuration: "120s" }} />
            <LiveClock />
          </div>

          {/* Headline */}
          <h1 className="l-h1">{t.hero_title_1}</h1>
          <p className="l-hero-p">{t.hero_desc}</p>

          <Link href="/orbit" className="l-cta">
            <span className="l-cta-t">{t.hero_cta}</span>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </Link>
        </div>

        {/* Bottom */}
        <div className="l-hero-bot">
          <div className="l-crosses">
            <Cross /><Cross /><Cross /><Cross /><Cross />
          </div>
          <span className="l-scroll">scroll to explore</span>
          <div className="l-scroll-bar" />
        </div>
      </section>

      {/* ═══════ REEL (Bold Ideas) ═══════ */}
      <section className="l-reel">
        <div ref={reel.ref} className="l-reel-inner">
          <h2 className="l-reel-h2">
            <span className="l-reel-line" style={{
              opacity: reel.v ? 1 : 0,
              transform: reel.v ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {lang === "zh" ? "一日一轨道" : "A Day Is An Orbit"}
            </span>
            <span className="l-reel-line" style={{
              opacity: reel.v ? 1 : 0,
              transform: reel.v ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s 0.1s, transform 0.7s 0.1s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {lang === "zh" ? "专注即引力" : "Focus Is Your Gravity"}
            </span>
          </h2>

          <div className="l-reel-desc" style={{
            opacity: reel.v ? 1 : 0,
            transition: "opacity 0.6s 0.2s",
          }}>
            <p>{t.hero_desc}</p>
            <Link href="/orbit" className="l-dot-cta" style={{ marginTop: "1.5rem" }}>
              <span className="l-dot" />
              <span className="l-dot-cta-t">{t.features_title}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED WORK ═══════ */}
      <section className="l-feat">
        <div ref={feat.ref} className="l-feat-inner">
          <div className="l-feat-top">
            <h3 className="l-feat-h3" style={{
              opacity: feat.v ? 1 : 0,
              transform: feat.v ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s, transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {lang === "zh" ? "三大核心系统" : "Three Core Systems"}
            </h3>
            <p className="l-feat-disc" style={{
              opacity: feat.v ? 1 : 0,
              transition: "opacity 0.5s 0.15s",
            }}>
              {lang === "zh"
                ? "为轨道工作站打造的精密仪器，每一项都经过精心设计"
                : "Precision instruments for your orbital workstation, each meticulously engineered."}
            </p>
          </div>

          <div className="l-feat-grid">
            {features.map((f, i) => (
              <div key={i} className="l-fcard" style={{
                opacity: feat.v ? 1 : 0,
                transform: feat.v ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.55s ${0.1 + i * 0.08}s, transform 0.6s ${0.1 + i * 0.08}s cubic-bezier(0.16,1,0.3,1)`,
              }}>
                <div className="l-fcard-top">
                  <span className="l-fcard-n">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="l-fcard-tag">{f.tag}</span>
                <h4 className="l-fcard-h4">{f.title}</h4>
                <p className="l-fcard-p">{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "clamp(2.5rem, 6vh, 4.5rem)" }}>
            <Link href="/orbit" className="l-dot-cta" style={{
              opacity: feat.v ? 1 : 0,
              transition: "opacity 0.4s 0.4s",
            }}>
              <span className="l-dot" />
              <span className="l-dot-cta-t">{t.hero_cta}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ TUNNEL (Step into a new world) ═══════ */}
      <section className="l-tunnel">
        <div ref={tunl.ref} className="l-tunnel-inner">
          {/* Sequential steps like Lusion's "Step into a new world and let your imagination run wild" */}
          <div className="l-tunnel-title">
            {steps.map((s, i) => (
              <div key={i} className="l-tunnel-line" style={{
                opacity: tunl.v ? 1 : 0,
                transform: tunl.v ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ${i * 0.12}s, transform 0.5s ${i * 0.12}s cubic-bezier(0.16,1,0.3,1)`,
              }}>
                <span className="l-tunnel-time">{s.t}</span>
                <span className="l-tunnel-word">{s.h}</span>
                <span className="l-tunnel-pipe" />
                <span className="l-tunnel-desc">{s.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ END CTA ═══════ */}
      <section className="l-end">
        <div ref={endC.ref} className="l-end-inner">
          {/* Cross decorations */}
          <div className="l-crosses l-end-crosses">
            <Cross s={13} o={0.1} /><Cross s={13} o={0.1} /><Cross s={13} o={0.1} />
            <Cross s={13} o={0.1} /><Cross s={13} o={0.1} />
          </div>

          <p className="l-end-p" style={{
            opacity: endC.v ? 1 : 0,
            transition: "opacity 0.5s",
          }}>
            {t.cta_body}
          </p>

          {/* Character-level animated CTA — Lusion's "Let's Talk" style */}
          <h2 className="l-end-h2">
            <DualChars
              text={lang === "zh" ? "准备进入轨道" : "Ready to Enter Orbit"}
              visible={endC.v}
            />
          </h2>

          <Link href="/orbit" className="l-cta l-cta-lg" style={{
            opacity: endC.v ? 1 : 0,
            transition: "opacity 0.4s 0.5s",
          }}>
            <span className="l-cta-t">{t.cta_button}</span>
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </Link>

          <div className="l-end-status" style={{
            opacity: endC.v ? 1 : 0,
            transition: "opacity 0.3s 0.6s",
          }}>
            <span className="l-dot l-dot-amber" />
            {t.cta_label}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="l-footer">
        <span>{t.footer_text}</span>
        <div className="l-footer-r">
          <Link href="/docs">{t.footer_docs}</Link>
          <span className="l-fsep" />
          <Link href="/orbit">{t.footer_launch}</Link>
        </div>
      </footer>
    </div>
  );
}
