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
        <div className="text-center" style={{ animation: "hardCutIn 0.3s steps(1) forwards" }}>
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
          className="mt-12 text-center"
          style={{ animation: "hardCutIn 0.3s steps(1) 0.2s forwards", opacity: 0 }}
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
          className="mt-8 max-w-xl text-center"
          style={{ animation: "hardCutIn 0.3s steps(1) 0.4s forwards", opacity: 0 }}
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
          className="mt-10 flex items-center gap-6"
          style={{ animation: "hardCutIn 0.3s steps(1) 0.5s forwards", opacity: 0 }}
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
