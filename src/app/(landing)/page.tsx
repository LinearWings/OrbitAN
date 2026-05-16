"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════
   TIME AS ARCHITECTURE — Lusion precision × OrbitAN time
   Every value measured. Every element intentional.
   ═══════════════════════════════════════════════════════ */

/* ── LIVE ORBIT CLOCK: SVG 24h progress ring + digital readout ── */
function OrbitClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 200);
    return () => clearInterval(i);
  }, []);

  const h = t.getHours();
  const m = t.getMinutes();
  const s = t.getSeconds();
  const ms = t.getMilliseconds();
  const dayFrac = (h * 3600 + m * 60 + s + ms / 1000) / 86400;
  const circ = 2 * Math.PI * 130;
  const offset = circ * (1 - dayFrac);
  const secondAngle = ((s + ms / 1000) / 60) * 360;

  return (
    <div className="oc">
      {/* 24h progress ring */}
      <svg viewBox="0 0 280 280" className="oc-svg" aria-hidden="true">
        {/* Tick marks: 24 hour marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const ang = (i / 24) * Math.PI * 2 - Math.PI / 2;
          const isMajor = i % 6 === 0;
          const inner = isMajor ? 115 : 122;
          const outer = 132;
          return (
            <line key={i}
              x1={140 + inner * Math.cos(ang)} y1={140 + inner * Math.sin(ang)}
              x2={140 + outer * Math.cos(ang)} y2={140 + outer * Math.sin(ang)}
              stroke={isMajor ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}
              strokeWidth={isMajor ? 0.5 : 0.3}/>
          );
        })}
        {/* Progress arc */}
        <circle cx="140" cy="140" r="130" fill="none"
          stroke="#3B82F6" strokeWidth="0.6" strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s linear" }}
          transform="rotate(-90 140 140)"/>
        {/* Second hand — thin radial line */}
        <line x1="140" y1="140"
          x2={140 + 125 * Math.cos((secondAngle - 90) * Math.PI / 180)}
          y2={140 + 125 * Math.sin((secondAngle - 90) * Math.PI / 180)}
          stroke="rgba(245,158,11,0.3)" strokeWidth="0.4" strokeLinecap="round"/>
        {/* Center dot */}
        <circle cx="140" cy="140" r="2" fill="#3B82F6" opacity="0.6"/>
      </svg>

      {/* Digital readout */}
      <div className="oc-digital">
        <span className="oc-time">
          {String(h).padStart(2,"0")}<span className="oc-colon">:</span>
          {String(m).padStart(2,"0")}<span className="oc-colon">:</span>
          {String(s).padStart(2,"0")}
        </span>
        <span className="oc-pct">
          MISSION TIME {(dayFrac * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

/* ── Scroll reveal ── */
function useReveal(th = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th, rootMargin: "0px 0px -20px 0px" });
    o.observe(el); return () => o.disconnect();
  }, [th]);
  return { ref, v };
}

/* ── Cross ── */
const X = ({ s = 11 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.06 }} aria-hidden="true"><path d="M7 0v14M0 7h14"/></svg>
);

/* ═══════════════ PAGE ═══════════════ */
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

  const r = useReveal(0.05);
  const f = useReveal(0.05);
  const e = useReveal(0.03);

  const cards = [
    { t: "concept • canvas2d • orbital • rendering", h: t.feature_clock_title, d: t.feature_clock_desc },
    { t: "gtd • pomodoro • pareto • moffatt • howell • swot", h: t.feature_methods_title, d: t.feature_methods_desc },
    { t: "time-box • deep-work • protocol • methodology", h: t.feature_focus_title, d: t.feature_focus_desc },
  ];

  return (
    <div className="landing">
      {/* ═══ HERO: Orbital time visual ═══ */}
      <section className="l-hero">
        <div className="l-hero-inn">
          <div className="l-meta">
            <span>{date}</span><span className="l-msep"/>
            <span>{utc}</span><span className="l-msep"/>
            <span className="l-md">MISSION LOG #003</span>
          </div>

          <OrbitClock />

          <h1 className="l-h1">{t.hero_title_1}</h1>
          <p className="l-hp">{t.hero_desc}</p>

          <Link href="/orbit" className="l-btn">
            {t.hero_cta}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </Link>
        </div>

        <div className="l-hbot">
          <div className="l-cr"><X/><X/><X/><X/><X/></div>
          <span className="l-scr">scroll to explore</span>
          <div className="l-scrb"/>
        </div>
      </section>

      {/* ═══ REEL ═══ */}
      <section className="l-reel">
        <div ref={r.ref} className="l-reel-inn">
          <h2 className="l-rh2">
            <span style={{ display:"block", opacity: r.v?1:0, transform: r.v?"translateY(0)":"translateY(16px)", transition:"opacity 0.6s, transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
              {lang === "zh" ? "一日一轨道" : "A Day Is An Orbit"}
            </span>
            <span style={{ display:"block", opacity: r.v?1:0, transform: r.v?"translateY(0)":"translateY(16px)", transition:"opacity 0.6s 0.1s, transform 0.6s 0.1s cubic-bezier(0.16,1,0.3,1)" }}>
              {lang === "zh" ? "专注即引力" : "Focus Is Your Gravity"}
            </span>
          </h2>
          <div className="l-rd" style={{ opacity: r.v?1:0, transition:"opacity 0.5s 0.2s" }}>
            <p>{t.hero_desc}</p>
            <Link href="/orbit" className="l-pill">
              <span className="l-pill-d"/><span className="l-pill-t">{t.features_title}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section className="l-feat">
        <div ref={f.ref} className="l-feat-inn">
          <div className="l-ftop">
            <h3 className="l-fh3" style={{ opacity: f.v?1:0, transform: f.v?"translateY(0)":"translateY(14px)", transition:"opacity 0.5s, transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              {lang === "zh" ? "三大核心系统" : "Three Core Systems"}
            </h3>
            <p className="l-fdisc" style={{ opacity: f.v?1:0, transition:"opacity 0.4s 0.15s" }}>
              {lang === "zh" ? "为轨道工作站打造的精密仪器。" : "Precision instruments for your orbital workstation."}
            </p>
          </div>
          <div className="l-fgrid">
            {cards.map((c, i) => (
              <div key={i} className="l-fcd" style={{
                opacity: f.v?1:0, transform: f.v?"translateY(0)":"translateY(20px)",
                transition: `opacity 0.5s ${0.06+i*0.06}s, transform 0.5s ${0.06+i*0.06}s cubic-bezier(0.16,1,0.3,1)`
              }}>
                <div className="l-fcd-t">{c.t}</div>
                <div className="l-fcd-h">{c.h}</div>
                <div className="l-fcd-d">{c.d}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"clamp(3rem, 7vh, 5rem)" }}>
            <Link href="/orbit" className="l-pill" style={{ opacity: f.v?1:0, transition:"opacity 0.4s 0.4s" }}>
              <span className="l-pill-d l-pill-da"/><span className="l-pill-t">{t.hero_cta}</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ END ═══ */}
      <section className="l-end">
        <div ref={e.ref} className="l-end-inn">
          <div className="l-cr" style={{ marginBottom:"clamp(2rem, 5vh, 3.5rem)" }}><X s={14}/><X s={14}/><X s={14}/><X s={14}/><X s={14}/></div>
          <p className="l-ep" style={{ opacity: e.v?1:0, transition:"opacity 0.4s" }}>{t.cta_body}</p>
          <Link href="/orbit" className="l-elnk" style={{ opacity: e.v?1:0, transition:"opacity 0.2s" }}>
            {[...(lang==="zh"?"准备进入轨道":"Ready to Enter Orbit")].map((c,i)=>(
              <span key={i} className="l-ec" style={{transitionDelay:`${i*0.015}s`}}>
                <span className="l-ec-c">{c===" "?" ":c}</span>
                <span className="l-ec-g" aria-hidden="true">{c===" "?" ":c}</span>
              </span>
            ))}
          </Link>
          <div className="l-est" style={{ opacity: e.v?1:0, transition:"opacity 0.3s 0.6s" }}>
            <span className="l-pill-d l-pill-da" style={{display:"inline-block",marginRight:8}}/>{t.cta_label}
          </div>
        </div>
      </section>

      <footer className="l-ftr">
        <span>{t.footer_text}</span>
        <div className="l-ftr-r">
          <Link href="/docs">{t.footer_docs}</Link><span className="l-ftr-s"/> <Link href="/orbit">{t.footer_launch}</Link>
        </div>
      </footer>
    </div>
  );
}
