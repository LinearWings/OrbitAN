"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

/* ═══════════════════════════════════════════════════════
   Lusion-quality. Timepiece center. Rich content.
   ═══════════════════════════════════════════════════════ */

const X = ({ s = 11 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: .06 }} aria-hidden="true"><path d="M7 0v14M0 7h14"/></svg>
);

function useReveal(th = 0.06) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th, rootMargin: "0px 0px -20px 0px" });
    o.observe(el); return () => o.disconnect();
  }, [th]);
  return { ref, v };
}

/* ── ORBITAL TIMEPIECE ── */
function Timepiece() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 100);
    return () => clearInterval(i);
  }, []);
  const h = t.getHours(), m = t.getMinutes(), s = t.getSeconds(), ms = t.getMilliseconds();
  const dayFrac = (h * 3600 + m * 60 + s + ms / 1000) / 86400;
  const C = 2 * Math.PI * 152;
  const off = C * (1 - dayFrac);
  const sa = ((s + ms / 1000) / 60) * 360;
  const ma = ((m + s / 60) / 60) * 360;
  const ha = ((h % 12 + m / 60) / 12) * 360;

  return (
    <div className="tp">
      <svg viewBox="0 0 340 340" className="tp-svg" aria-hidden="true">
        <defs>
          <radialGradient id="g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3B82F6" stopOpacity=".06"/><stop offset="60%" stopColor="#3B82F6" stopOpacity=".01"/><stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx="170" cy="170" r="160" fill="url(#g)"/>
        {Array.from({length:60},(_,i)=>{
          const a = (i/60)*Math.PI*2 - Math.PI/2;
          const q = i%15===0, hh = i%5===0;
          const ir = q?126:hh?131:137;
          return <line key={i} x1={170+ir*Math.cos(a)} y1={170+ir*Math.sin(a)} x2={170+148*Math.cos(a)} y2={170+148*Math.sin(a)} stroke={q?"rgba(255,255,255,.22)":hh?"rgba(255,255,255,.1)":"rgba(255,255,255,.03)"} strokeWidth={q?.7:hh?.45:.25}/>;
        })}
        {["00","03","06","09","12","15","18","21"].map((n,i)=>{
          const a = (i*3/24)*Math.PI*2 - Math.PI/2;
          return <text key={i} x={170+116*Math.cos(a)} y={170+116*Math.sin(a)} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,.14)" fontFamily="JetBrains Mono,monospace" fontSize="8" letterSpacing="2">{n}</text>;
        })}
        <circle cx="170" cy="170" r="152" fill="none" stroke="#3B82F6" strokeWidth=".8" strokeLinecap="round" strokeDasharray={`${C} ${C}`} strokeDashoffset={off} style={{transition:"stroke-dashoffset .6s linear",filter:"url(#glow)"}} transform="rotate(-90 170 170)"/>
        {dayFrac>.001&&<circle cx={170+152*Math.cos(dayFrac*Math.PI*2-Math.PI/2)} cy={170+152*Math.sin(dayFrac*Math.PI*2-Math.PI/2)} r="3.5" fill="#3B82F6" opacity=".9" filter="url(#glow)"/>}
        <line x1="170" y1="170" x2={170+80*Math.cos((ha-90)*Math.PI/180)} y2={170+80*Math.sin((ha-90)*Math.PI/180)} stroke="rgba(255,255,255,.45)" strokeWidth=".9" strokeLinecap="round"/>
        <line x1="170" y1="170" x2={170+108*Math.cos((ma-90)*Math.PI/180)} y2={170+108*Math.sin((ma-90)*Math.PI/180)} stroke="rgba(255,255,255,.28)" strokeWidth=".55" strokeLinecap="round"/>
        <line x1="170" y1="170" x2={170+120*Math.cos((sa-90)*Math.PI/180)} y2={170+120*Math.sin((sa-90)*Math.PI/180)} stroke="#F59E0B" strokeWidth=".45" strokeLinecap="round" opacity=".55"/>
        <circle cx="170" cy="170" r="3" fill="#3B82F6"/><circle cx="170" cy="170" r="1.2" fill="#fff" opacity=".6"/>
      </svg>
      <div className="tp-digital">
        <span className="tp-time">{String(h).padStart(2,"0")}<span className="tp-col">:</span>{String(m).padStart(2,"0")}</span>
        <span className="tp-sec">{String(s).padStart(2,"0")}</span>
        <span className="tp-meta">MISSION ELAPSED {(dayFrac*100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

/* ── PAGE ── */
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

  const A = useReveal(.04), B = useReveal(.04), C = useReveal(.03);

  const methods = ["GTD","Pomodoro","Pareto","Moffatt","Howell","SWOT"];
  const cards = [
    { tag:"concept • canvas2d • orbital • rendering", h:t.feature_clock_title, d:t.feature_clock_desc },
    { tag: methods.map(m=>m.toLowerCase()).join(" • "), h:t.feature_methods_title, d:t.feature_methods_desc },
    { tag:"time-box • deep-work • protocol • methodology", h:t.feature_focus_title, d:t.feature_focus_desc },
  ];
  const steps = [
    { t:"00:00", h:t.how_1_title, d:t.how_1_desc },
    { t:"06:00", h:t.how_2_title, d:t.how_2_desc },
    { t:"12:00", h:t.how_3_title, d:t.how_3_desc },
    { t:"18:00", h:t.how_4_title, d:t.how_4_desc },
  ];

  return (
    <div className="landing">
      {/* ═══ HERO ═══ */}
      <section className="l-hero">
        <div className="l-hero-inn">
          <div className="l-meta"><span>{date}</span><span className="l-msep"/><span>{utc}</span><span className="l-msep"/><span className="l-md">{t.hero_tagline}</span></div>
          <Timepiece />
          <h1 className="l-h1">{t.hero_title_1}</h1>
          <p className="l-hp">{t.hero_desc}</p>
          <div className="l-hcta">
            <Link href="/orbit" className="l-btn">{t.hero_cta}<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M3 8h10M9 4l4 4-4 4"/></svg></Link>
            <Link href="/docs" className="l-btn2">{t.learn_more}</Link>
          </div>
        </div>
        <div className="l-hbot"><div className="l-cr"><X/><X/><X/><X/><X/></div><span className="l-scr">scroll to explore</span><div className="l-scrb"/></div>
      </section>

      {/* ═══ BOLD IDEAS ═══ */}
      <section className="l-reel">
        <div ref={A.ref} className="l-reel-inn">
          <h2 className="l-rh2">
            <span style={{display:"block",opacity:A.v?1:0,transform:A.v?"translateY(0)":"translateY(16px)",transition:"opacity .6s,transform .6s cubic-bezier(.16,1,.3,1)"}}>{lang==="zh"?"一日一轨道":"A Day Is An Orbit"}</span>
            <span style={{display:"block",opacity:A.v?1:0,transform:A.v?"translateY(0)":"translateY(16px)",transition:"opacity .6s .1s,transform .6s .1s cubic-bezier(.16,1,.3,1)"}}>{lang==="zh"?"专注即引力":"Focus Is Your Gravity"}</span>
          </h2>
          <div className="l-rd" style={{opacity:A.v?1:0,transition:"opacity .5s .2s"}}>
            <div className="l-rd-text">
              <p>{t.hero_desc}</p>
              <p style={{marginTop:"1rem"}}>{lang==="zh"?"六种经典时间管理方法论完整集成：GTD 五阶段看板、番茄钟聚焦计时、帕累托 80/20 分析、莫法特分段休息法、豪威尔紧急重要矩阵、SWOT 态势分析。每一种方法都有独立面板，数据本地持久化。":"Six classic time-management methodologies fully integrated: GTD 5-stage kanban, Pomodoro focus timer, Pareto 80/20 analysis, Moffatt segmented sessions, Howell urgency-importance matrix, SWOT analysis. Each with its own panel, all data persisted locally."}</p>
            </div>
            <Link href="/orbit" className="l-pill"><span className="l-pill-d"/><span className="l-pill-t">{t.hero_cta}</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg></Link>
          </div>
          {/* Methodology list */}
          <div className="l-meth" style={{opacity:A.v?1:0,transition:"opacity .5s .3s"}}>
            {methods.map((m,i)=>(<span key={i} className="l-meth-i">{m}</span>))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section className="l-feat">
        <div ref={B.ref} className="l-feat-inn">
          <div className="l-ftop">
            <h3 className="l-fh3" style={{opacity:B.v?1:0,transform:B.v?"translateY(0)":"translateY(14px)",transition:"opacity .5s,transform .5s cubic-bezier(.16,1,.3,1)"}}>{lang==="zh"?"三大核心系统":"Three Core Systems"}</h3>
            <p className="l-fdisc" style={{opacity:B.v?1:0,transition:"opacity .4s .15s"}}>{lang==="zh"?"为轨道工作站打造的精密仪器。每一项都经过精心设计以最大化生产力。":"Precision instruments for orbital workstations. Each meticulously engineered for maximum productivity."}</p>
          </div>
          <div className="l-fgrid">
            {cards.map((c,i)=>(
              <div key={i} className="l-fcd" style={{opacity:B.v?1:0,transform:B.v?"translateY(0)":"translateY(20px)",transition:`opacity .5s ${.06+i*.06}s,transform .5s ${.06+i*.06}s cubic-bezier(.16,1,.3,1)`}}>
                <div className="l-fcd-t">{c.tag}</div>
                <div className="l-fcd-h">{c.h}</div>
                <div className="l-fcd-d">{c.d}</div>
                <div className="l-fcd-idx">{String(i+1).padStart(2,"0")}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"clamp(3rem,7vh,5rem)"}}>
            <Link href="/docs/methodology" className="l-pill" style={{opacity:B.v?1:0,transition:"opacity .4s .4s"}}><span className="l-pill-d"/><span className="l-pill-t">{lang==="zh"?"方法论指南":"Methodology Guide"}</span><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5"/></svg></Link>
          </div>
        </div>
      </section>

      {/* ═══ TUNNEL ═══ */}
      <section className="l-tun">
        <div className="l-tun-inn">
          <h3 className="l-tun-title" style={{fontFamily:"Clash Display,sans-serif",fontSize:"clamp(1.6rem,3.5vw,2.8rem)",fontWeight:500,color:"rgba(255,255,255,.5)",marginBottom:"clamp(2.5rem,6vh,4.5rem)",letterSpacing:"-.02em"}}>{lang==="zh"?"四步进入轨道":"Four Steps to Orbit"}</h3>
          {steps.map((s,i)=>(
            <div key={i} className="l-tun-r">
              <span className="l-tun-t">{s.t}</span>
              <span className="l-tun-h">{s.h}</span>
              <span className="l-tun-p"/>
              <span className="l-tun-d">{s.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ END ═══ */}
      <section className="l-end">
        <div ref={C.ref} className="l-end-inn">
          <div className="l-cr" style={{marginBottom:"clamp(2rem,5vh,3.5rem)"}}><X s={14}/><X s={14}/><X s={14}/><X s={14}/><X s={14}/></div>
          <p className="l-ep" style={{opacity:C.v?1:0,transition:"opacity .4s"}}>{t.cta_body}</p>
          {/* Keyboard shortcuts reference */}
          <div className="l-keys" style={{opacity:C.v?1:0,transition:"opacity .4s .1s"}}>
            <span className="l-keys-i"><kbd>←</kbd><kbd>→</kbd> Navigate</span>
            <span className="l-keys-i"><kbd>N</kbd> New task</span>
            <span className="l-keys-i"><kbd>O</kbd> Orbit mode</span>
            <span className="l-keys-i"><kbd>1</kbd>-<kbd>4</kbd> Filter</span>
          </div>
          <Link href="/orbit" className="l-elnk" style={{opacity:C.v?1:0,transition:"opacity .2s .15s"}}>
            {[...(lang==="zh"?"准备进入轨道":"Ready to Enter Orbit")].map((c,i)=>(
              <span key={i} className="l-ec" style={{transitionDelay:`${i*.015}s`}}>
                <span className="l-ec-c">{c===" "?" ":c}</span><span className="l-ec-g" aria-hidden="true">{c===" "?" ":c}</span>
              </span>
            ))}
          </Link>
          <div className="l-est" style={{opacity:C.v?1:0,transition:"opacity .3s .5s"}}><span className="l-pill-d l-pill-da" style={{display:"inline-block",marginRight:8}}/>{t.cta_label}</div>
        </div>
      </section>

      <footer className="l-ftr"><span>{t.footer_text}</span><div className="l-ftr-r"><Link href="/docs">{t.footer_docs}</Link><span className="l-ftr-s"/><Link href="/orbit">{t.footer_launch}</Link></div></footer>
    </div>
  );
}
