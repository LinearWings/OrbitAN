"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════
   Lusion.co proportions + TIME as the hero visual.
   Orbital progress ring. Live timecode. Day-elapsed.
   ═══════════════════════════════════════════════════════ */

const Cross = ({ s = 11, o = 0.08 }: { s?: number; o?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: o }} aria-hidden="true">
    <path d="M7 0v14M0 7h14"/>
  </svg>
);

function useReveal(th = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th, rootMargin: "0px 0px -30px 0px" });
    o.observe(el); return () => o.disconnect();
  }, [th]);
  return { ref, v };
}

/* ── Orbital Progress Ring: SVG circle that fills as day progresses ── */
function OrbitProgress({ time }: { time: Date }) {
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const ms = time.getMilliseconds();
  const dayFraction = (h * 3600 + m * 60 + s + ms / 1000) / 86400;
  const circumference = 2 * Math.PI * 140; // r=140
  const dashOffset = circumference * (1 - dayFraction);

  return (
    <svg viewBox="0 0 300 300" className="orb-prog" aria-hidden="true">
      {/* Background ring */}
      <circle cx="150" cy="150" r="140" fill="none"
        stroke="rgba(255,255,255,0.03)" strokeWidth="0.4"/>
      {/* Minor tick ring */}
      <circle cx="150" cy="150" r="135" fill="none"
        stroke="rgba(255,255,255,0.02)" strokeWidth="0.3" strokeDasharray="2 6"/>
      {/* Progress arc */}
      <circle cx="150" cy="150" r="140" fill="none"
        stroke="#3B82F6" strokeWidth="0.6" strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        style={{ transition: "stroke-dashoffset 1s linear" }}
        transform="rotate(-90 150 150)"/>
      {/* Progress dot at tip */}
      {dayFraction > 0 && (
        <circle cx="150" cy="10" r="2.5" fill="#3B82F6" opacity="0.8"
          transform={`rotate(${dayFraction * 360} 150 150)`}/>
      )}
    </svg>
  );
}

/* ── Live timecode with seconds ── */
function Timecode({ time }: { time: Date }) {
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  const pct = ((time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) / 86400 * 100).toFixed(1);

  return (
    <div className="tc">
      <span className="tc-digital">{hh}:{mm}:{ss}</span>
      <span className="tc-pct">DAY {pct}% ELAPSED</span>
    </div>
  );
}

/* ── Page ── */
export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState("");
  const [utc, setUtc] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const id = setInterval(tick, 1000);
    const n = new Date();
    setDate(`${n.getFullYear()}.${String(n.getMonth()+1).padStart(2,"0")}.${String(n.getDate()).padStart(2,"0")}`);
    setUtc(`UTC${n.getTimezoneOffset()<=0?"+":""}${-Math.floor(n.getTimezoneOffset()/60)}`);
    return () => clearInterval(id);
  }, []);

  const reel = useReveal(0.05);
  const feat = useReveal(0.05);
  const endC = useReveal(0.03);

  const fts = [
    { tag: "concept • canvas2d • orbital • rendering", title: t.feature_clock_title, desc: t.feature_clock_desc },
    { tag: "gtd • pomodoro • pareto • moffatt • howell • swot", title: t.feature_methods_title, desc: t.feature_methods_desc },
    { tag: "time-box • deep-work • protocol • methodology", title: t.feature_focus_title, desc: t.feature_focus_desc },
  ];

  return (
    <div className="landing">
      {/* ═══════ HERO: Time as visual ═══════ */}
      <section className="l-hero">
        <div className="l-hero-center">
          {/* Meta */}
          <div className="l-meta">
            <span>{date}</span><span className="l-msep"/>
            <span>{utc}</span><span className="l-msep"/>
            <span className="l-mdim">MISSION LOG #003</span>
          </div>

          {/* Orbital progress ring + timecode — the hero visual */}
          <div className="l-clock">
            <OrbitProgress time={time} />
            <Timecode time={time} />
          </div>

          {/* Title — Lusion 25.9px scale */}
          <h1 className="l-h1">{t.hero_title_1}</h1>
          <p className="l-hero-p">{t.hero_desc}</p>

          <Link href="/orbit" className="l-cta">
            <span className="l-cta-t">{t.hero_cta}</span>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </Link>
        </div>

        <div className="l-hero-bot">
          <div className="l-crosses"><Cross/><Cross/><Cross/><Cross/><Cross/></div>
          <span className="l-scroll">scroll to explore</span>
          <div className="l-scroll-bar"/>
        </div>
      </section>

      {/* ═══════ REEL ═══════ */}
      <section className="l-reel">
        <div ref={reel.ref} className="l-reel-inner">
          {/* Two-line 103.6px title */}
          <h2 className="l-reel-h2">
            <span style={{ display:"block", opacity: reel.v?1:0, transform: reel.v?"translateY(0)":"translateY(20px)", transition:"opacity 0.7s, transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}>
              {lang === "zh" ? "一日一轨道" : "A Day Is An Orbit"}
            </span>
            <span style={{ display:"block", opacity: reel.v?1:0, transform: reel.v?"translateY(0)":"translateY(20px)", transition:"opacity 0.7s 0.1s, transform 0.7s 0.1s cubic-bezier(0.16,1,0.3,1)" }}>
              {lang === "zh" ? "专注即引力" : "Focus Is Your Gravity"}
            </span>
          </h2>

          <div className="l-reel-desc" style={{ opacity: reel.v?1:0, transition:"opacity 0.6s 0.2s" }}>
            <p>{t.hero_desc}</p>
            <Link href="/orbit" className="l-pill">
              <span className="l-pill-dot"/>
              <span className="l-pill-t">{t.features_title}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED ═══════ */}
      <section className="l-feat">
        <div ref={feat.ref} className="l-feat-inner">
          <div className="l-feat-top">
            <h3 className="l-feat-h3" style={{ opacity: feat.v?1:0, transform: feat.v?"translateY(0)":"translateY(16px)", transition:"opacity 0.6s, transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
              {lang === "zh" ? "三大核心系统" : "Three Core Systems"}
            </h3>
            <p className="l-feat-disc" style={{ opacity: feat.v?1:0, transition:"opacity 0.5s 0.15s" }}>
              {lang === "zh"
                ? "为轨道工作站打造的精密仪器，每一项都经过精心设计以最大化生产力。"
                : "Precision instruments for your orbital workstation, each meticulously engineered for maximum productivity."}
            </p>
          </div>

          <div className="l-feat-grid">
            {fts.map((f, i) => (
              <div key={i} className="l-fcard" style={{
                opacity: feat.v?1:0, transform: feat.v?"translateY(0)":"translateY(24px)",
                transition: `opacity 0.55s ${0.08+i*0.07}s, transform 0.6s ${0.08+i*0.07}s cubic-bezier(0.16,1,0.3,1)`,
              }}>
                <div className="l-fcard-tag">{f.tag}</div>
                <div className="l-fcard-title">{f.title}</div>
                <div className="l-fcard-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:"clamp(3rem, 7vh, 5rem)" }}>
            <Link href="/orbit" className="l-pill" style={{ opacity: feat.v?1:0, transition:"opacity 0.4s 0.4s" }}>
              <span className="l-pill-dot l-pill-dot-a"/>
              <span className="l-pill-t">{t.hero_cta}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ END CTA ═══════ */}
      <section className="l-end">
        <div ref={endC.ref} className="l-end-inner">
          <div className="l-crosses l-end-crosses"><Cross s={14} o={0.06}/><Cross s={14} o={0.06}/><Cross s={14} o={0.06}/><Cross s={14} o={0.06}/><Cross s={14} o={0.06}/></div>
          <p className="l-end-p" style={{ opacity: endC.v?1:0, transition:"opacity 0.5s" }}>{t.cta_body}</p>

          <Link href="/orbit" className="l-end-link" style={{ opacity: endC.v?1:0, transition:"opacity 0.2s" }}>
            {[...(lang === "zh" ? "准备进入轨道" : "Ready to Enter Orbit")].map((c, i) => (
              <span key={i} className="l-ec" style={{ transitionDelay: `${i*0.02}s` }}>
                <span className="l-ec-char">{c === " " ? " " : c}</span>
                <span className="l-ec-clone" aria-hidden="true">{c === " " ? " " : c}</span>
              </span>
            ))}
          </Link>

          <div className="l-end-status" style={{ opacity: endC.v?1:0, transition:"opacity 0.3s 0.6s" }}>
            <span className="l-pill-dot l-pill-dot-a" style={{ display:"inline-block", marginRight:8 }}/>
            {t.cta_label}
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="l-footer">
        <span>{t.footer_text}</span>
        <div className="l-footer-r">
          <Link href="/docs">{t.footer_docs}</Link>
          <span className="l-fsep"/>
          <Link href="/orbit">{t.footer_launch}</Link>
        </div>
      </footer>
    </div>
  );
}
