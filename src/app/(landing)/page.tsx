"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LiveClock from "@/components/landing/LiveClock";

/* ══════════════════════════════════════════════
   PARTICLE FIELD (pure generation via useState initializer)
   ══════════════════════════════════════════════ */

type ParticleData = {
  id: number;
  left: number; top: number;
  color: "blue" | "white" | "amber";
  size: "xs" | "sm" | "md";
  anim: "float1" | "float2" | "float3" | "float4";
  delay: number;
  duration: number;
};

function generateParticles(): ParticleData[] {
  const colors: Array<"blue"|"white"|"amber"> = ["blue","blue","blue","blue","blue","white","white","amber"];
  const sizes: Array<"xs"|"sm"|"md"> = ["xs","xs","xs","sm","sm","sm","sm","md","md"];
  const anims: Array<"float1"|"float2"|"float3"|"float4"> = ["float1","float1","float2","float2","float3","float3","float4"];
  const items: ParticleData[] = [];
  for (let i = 0; i < 40; i++) {
    items.push({
      id: i,
      left: Math.random() * 100,
      top: 20 + Math.random() * 80,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      size: sizes[Math.floor(Math.random() * sizes.length)]!,
      anim: anims[Math.floor(Math.random() * anims.length)]!,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 8,
    });
  }
  return items;
}

function ParticleField() {
  const [particles] = useState<ParticleData[]>(generateParticles);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle particle--${p.color} particle--size-${p.size} particle--${p.anim}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MOUSE SPOTLIGHT
   ══════════════════════════════════════════════ */
function MouseSpotlight() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="spotlight-layer"
      style={{
        background: `radial-gradient(circle 400px at ${pos.x}px ${pos.y}px,
          rgba(37,99,235,0.04) 0%,
          rgba(37,99,235,0.015) 30%,
          rgba(37,99,235,0.005) 50%,
          transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
}

/* ══════════════════════════════════════════════
   LIGHT BEAMS
   ══════════════════════════════════════════════ */
function LightBeams() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="light-beam" style={{ top: "15%", animationDelay: "0s" }} />
      <div className="light-beam" style={{ top: "45%", animationDelay: "-7s", animationDuration: "24s" }} />
      <div className="light-beam light-beam-thick" style={{ top: "75%", animationDelay: "-13s", animationDuration: "18s" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   LENS FLARES
   ══════════════════════════════════════════════ */
function LensFlares() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="lens-flare" style={{ top: "8%", right: "15%", width: "400px", height: "400px" }} />
      <div className="lens-flare" style={{ bottom: "20%", left: "5%", width: "300px", height: "300px", opacity: 0.6 }} />
      <div className="lens-flare" style={{ top: "55%", right: "25%", width: "200px", height: "200px", opacity: 0.4 }} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   PULSE RINGS
   ══════════════════════════════════════════════ */
function PulseRings({ count = 3 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="pulse-ring absolute"
          style={{
            width: "min(50vw, 500px)",
            height: "min(50vw, 500px)",
            animationDelay: `${i * 1}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   GLITCH SUBTITLE
   ══════════════════════════════════════════════ */
function GlitchSubtitle({ text }: { text: string }) {
  return (
    <span className="glitch-text chromatic" style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.6875rem",
      letterSpacing: "0.35em",
      color: "rgba(255,255,255,0.08)",
      textTransform: "uppercase" as const,
    }}>
      {text}
    </span>
  );
}

/* ══════════════════════════════════════════════
   MARQUEE TIME STRIP
   ══════════════════════════════════════════════ */
function MarqueeStrip() {
  const chars = "00:00 · 01:00 · 02:00 · 03:00 · 04:00 · 05:00 · 06:00 · 07:00 · 08:00 · 09:00 · 10:00 · 11:00 · 12:00 · 13:00 · 14:00 · 15:00 · 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00 · 22:00 · 23:00 · ";
  return (
    <div className="marquee-strip pointer-events-none select-none" aria-hidden="true"
      style={{
        borderTop: "2px solid rgba(255,255,255,0.03)",
        borderBottom: "2px solid rgba(255,255,255,0.03)",
        padding: "5px 0",
        background: "rgba(0,0,0,0.4)",
      }}>
      <div className="marquee-strip-inner" style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.625rem",
        color: "rgba(255,255,255,0.06)",
        letterSpacing: "0.15em",
      }}>
        {chars}{chars}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BRUTALIST GEOMETRY (parallax)
   ══════════════════════════════════════════════ */
function BrutalistGeometry() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = document.querySelector("[data-scroll-container]");
    if (!el) return;
    const onScroll = () => setScrollY((el as HTMLElement).scrollTop);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const viewH = typeof window !== "undefined" ? window.innerHeight : 900;
  const t = scrollY / viewH;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Massive rotated rectangle — top right */}
      <div className="parallax-geo" style={{
        top: `${-15 + t * 25}%`, right: `${-10 + t * 5}%`,
        width: "min(50vw, 500px)", height: "min(50vw, 500px)",
        border: "3px solid rgba(37,99,235,0.04)",
        transform: `rotate(${25 + t * 8}deg)`,
      }} />
      {/* Thick diagonal */}
      <div className="parallax-geo" style={{
        top: `${30 + t * 35}%`, left: `${-20 - t * 15}%`,
        width: "min(80vw, 800px)", height: "4px",
        background: "rgba(37,99,235,0.06)",
        transform: `rotate(-42deg)`,
      }} />
      {/* Crosshair — bottom left */}
      <div className="parallax-geo" style={{
        top: `${70 + t * 10}%`, left: `${8 - t * 8}%`,
        width: "min(12vw, 120px)", height: "min(12vw, 120px)",
        border: "1px solid rgba(255,255,255,0.03)",
        transform: `rotate(${45 + t * 3}deg)`,
      }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.02)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.02)" }} />
      </div>
      {/* Circle ring — right */}
      <div className="parallax-geo" style={{
        top: `${45 + t * 20}%`, right: `${15 - t * 12}%`,
        width: "min(25vw, 250px)", height: "min(25vw, 250px)",
        border: "2px solid rgba(37,99,235,0.04)",
        borderRadius: "50%",
      }} />
      {/* Blue dot constellation */}
      <div className="parallax-geo" style={{ top: `${18 + t * 50}%`, left: `${75 + t * 8}%`, width: "4px", height: "4px", borderRadius: "50%", background: "rgba(37,99,235,0.4)", boxShadow: "0 0 8px rgba(37,99,235,0.3)" }} />
      <div className="parallax-geo" style={{ top: `${55 + t * 30}%`, left: `${88 - t * 5}%`, width: "3px", height: "3px", borderRadius: "50%", background: "rgba(37,99,235,0.35)", boxShadow: "0 0 6px rgba(37,99,235,0.25)" }} />
      {/* Amber dot — rare accent */}
      <div className="parallax-geo" style={{ top: `${35 + t * 60}%`, left: `${12 - t * 3}%`, width: "4px", height: "4px", borderRadius: "50%", background: "rgba(234,179,8,0.3)", boxShadow: "0 0 6px rgba(234,179,8,0.2)" }} />
      {/* Vertical rail — far right */}
      <div className="parallax-geo" style={{ top: 0, bottom: 0, right: `${2 + t * 3}%`, width: "2px", background: "rgba(37,99,235,0.03)" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════ */
export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div style={{ background: "#020202", color: "rgba(255,255,255,0.85)" }}>
      {/* Global effects */}
      <div className="scanlines" aria-hidden="true" />
      <MouseSpotlight />

      {/* ═══ SECTION 1: TIME ANCHOR (HERO) ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <LensFlares />
        <LightBeams />
        <PulseRings count={3} />
        <ParticleField />
        <BrutalistGeometry />

        {/* Massive Blue Clock with bloom */}
        <div style={{ animation: "hardCutInGlitch 0.6s steps(1) forwards", opacity: 0, position: "relative", zIndex: 1 }}>
          <div style={{ position: "relative" }}>
            <LiveClock />
            {/* Extra bloom layer behind clock */}
            <div style={{
              position: "absolute", inset: "-20%", pointerEvents: "none",
              background: "radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 70%)",
              filter: "blur(30px)",
            }} />
          </div>
          <div className="mt-4 text-center">
            <GlitchSubtitle text={t.hero_tagline} />
          </div>
        </div>

        {/* Title Block */}
        <div className="mt-10 text-center" style={{ animation: "hardCutIn 0.35s steps(1) 0.2s forwards", opacity: 0, position: "relative", zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "rgba(255,255,255,0.88)",
          }}>
            {t.hero_title_1}
          </h1>
          <div className="flex items-center justify-center gap-4 my-3">
            <div style={{
              width: "clamp(50px, 10vw, 100px)", height: 3,
              background: "linear-gradient(to right, transparent, #2563EB, transparent)",
            }} />
            <span className="bloom-text-strong" style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: "-0.02em",
            }}>
              {t.hero_title_2}
            </span>
            <div style={{
              width: "clamp(50px, 10vw, 100px)", height: 3,
              background: "linear-gradient(to right, transparent, #2563EB, transparent)",
            }} />
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 max-w-xl text-center" style={{ animation: "hardCutIn 0.35s steps(1) 0.4s forwards", opacity: 0, position: "relative", zIndex: 1 }}>
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.28)",
            borderLeft: "2px solid rgba(37,99,235,0.25)",
            paddingLeft: 16,
            textAlign: "left" as const,
          }}>
            {t.hero_desc}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex items-center gap-8" style={{ animation: "strobeOnce 0.8s ease-out 0.6s forwards", opacity: 0, position: "relative", zIndex: 1 }}>
          <Link href="/orbit" className="brutal-cta">
            {t.hero_cta}
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <a href="#features" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            color: "rgba(255,255,255,0.12)",
            textDecoration: "none",
            letterSpacing: "0.08em",
          }}>
            {t.learn_more}
            <span style={{ display: "block", marginTop: 4, color: "rgba(37,99,235,0.3)" }}>↓</span>
          </a>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ zIndex: 1 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(37,99,235,0.2), transparent)" }} />
        </div>
      </section>

      <div className="diagonal-divider" />
      <MarqueeStrip />
      <div className="diagonal-divider" />

      {/* ═══ SECTION 2: CORE SYSTEMS ═══ */}
      <section id="features" className="relative px-4 md:px-8 py-28 md:py-36 max-w-6xl mx-auto" style={{ scrollMarginTop: 72 }}>
        <LensFlares />

        <div className="flex items-center gap-4 mb-20">
          <div style={{ width: 32, height: 4, background: "#2563EB", boxShadow: "0 0 12px rgba(37,99,235,0.3)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem",
            letterSpacing: "0.25em", color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase" as const,
          }}>
            {t.features_title}
          </span>
          <div className="light-streak" style={{ flex: 1, height: 1 }} />
        </div>

        {/* 01 — Orbital Clock */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 mb-6">
          <div className="md:col-span-2 flex md:justify-end md:pr-10 mb-2 md:mb-0 md:-mt-8">
            <span className="section-number">01</span>
          </div>
          <div className="md:col-span-7 neon-border p-10" style={{ borderLeft: "4px solid #2563EB" }}>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>
              {t.feature_clock_title}
            </h2>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(255,255,255,0.25)", maxWidth: "90%" }}>
              {t.feature_clock_desc}
            </p>
          </div>
        </div>

        {/* 02 — Six Methodologies */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 mb-6">
          <div className="md:col-span-3 hidden md:block" />
          <div className="md:col-span-2 flex md:justify-end md:pr-10 mb-2 md:mb-0 md:-mt-8">
            <span className="section-number">02</span>
          </div>
          <div className="md:col-span-7 neon-border p-10" style={{ borderLeft: "4px solid #2563EB" }}>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>
              {t.feature_methods_title}
            </h2>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(255,255,255,0.25)", maxWidth: "90%" }}>
              {t.feature_methods_desc}
            </p>
          </div>
        </div>

        {/* 03 — Focus Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          <div className="md:col-span-2 flex md:justify-end md:pr-10 mb-2 md:mb-0 md:-mt-8">
            <span className="section-number">03</span>
          </div>
          <div className="md:col-span-7 neon-border p-10" style={{ borderLeft: "4px solid #6B7280" }}>
            <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>
              {t.feature_focus_title}
            </h2>
            <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(255,255,255,0.25)", maxWidth: "90%" }}>
              {t.feature_focus_desc}
            </p>
          </div>
        </div>
      </section>

      <div className="diagonal-divider" />
      <MarqueeStrip />
      <div className="diagonal-divider" />

      {/* ═══ SECTION 3: WORKFLOW TIMELINE ═══ */}
      <section className="relative px-4 md:px-8 py-28 md:py-36 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <div style={{ width: 32, height: 4, background: "#2563EB", boxShadow: "0 0 12px rgba(37,99,235,0.3)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem",
            letterSpacing: "0.25em", color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase" as const,
          }}>
            {t.how_title}
          </span>
          <div className="light-streak" style={{ flex: 1, height: 1 }} />
        </div>

        <div className="relative oppressive-frame">
          {/* Timeline rail — glowing */}
          <div className="absolute left-[60px] md:left-[100px] top-12 bottom-12"
            style={{
              width: 3,
              background: "rgba(37,99,235,0.1)",
              boxShadow: "0 0 20px rgba(37,99,235,0.06)",
            }} />

          {[
            { time: "00:00", title: t.how_1_title, desc: t.how_1_desc },
            { time: "06:00", title: t.how_2_title, desc: t.how_2_desc },
            { time: "12:00", title: t.how_3_title, desc: t.how_3_desc },
            { time: "18:00", title: t.how_4_title, desc: t.how_4_desc },
          ].map((step, i) => (
            <div key={i} className="relative flex items-start py-10 first:pt-12 last:pb-12">
              <div className="time-code w-[60px] md:w-[100px] flex-shrink-0 text-right pr-8 pt-1"
                style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.12)" }}>
                {step.time}
              </div>
              {/* Glowing node */}
              <div className="absolute left-[57px] md:left-[97px] rounded-full flex-shrink-0"
                style={{
                  top: 46, width: 9, height: 9,
                  background: "#2563EB",
                  boxShadow: "0 0 16px rgba(37,99,235,0.5), 0 0 32px rgba(37,99,235,0.15)",
                }} />
              <div className="pl-12 md:pl-20 flex-1">
                <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(1rem, 1.5vw, 1.25rem)", fontWeight: 600, color: "rgba(255,255,255,0.78)", marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(255,255,255,0.22)", maxWidth: "85%" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="diagonal-divider" />

      {/* ═══ SECTION 4: ACTION ZONE ═══ */}
      <section className="relative px-4 py-32 md:py-40 overflow-hidden">
        <LightBeams />
        <div className="max-w-4xl mx-auto" style={{
          borderTop: "4px solid rgba(37,99,235,0.2)",
          borderBottom: "4px solid rgba(255,255,255,0.04)",
          padding: "clamp(4rem, 10vw, 7rem) 0",
          position: "relative",
        }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div style={{ width: 10, height: 10, background: "#EAB308", boxShadow: "0 0 10px rgba(234,179,8,0.3)" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6875rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.12)" }}>
                  {t.cta_label}
                </span>
              </div>
              <p style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 600,
                color: "rgba(255,255,255,0.82)",
                borderLeft: "3px solid rgba(37,99,235,0.35)",
                paddingLeft: 20,
              }}>
                {t.cta_body}
              </p>
            </div>
            <Link href="/orbit" className="brutal-cta" style={{ whiteSpace: "nowrap" }}>
              {t.cta_button}
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: "2px solid rgba(255,255,255,0.03)", padding: "28px 0" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: 5, height: 5, background: "#2563EB", boxShadow: "0 0 6px rgba(37,99,235,0.3)" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.625rem", color: "rgba(255,255,255,0.08)", letterSpacing: "0.06em" }}>
              {t.footer_text}
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/docs" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.625rem", color: "rgba(255,255,255,0.1)", textDecoration: "none" }}>
              {t.footer_docs}
            </Link>
            <Link href="/orbit" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.625rem", color: "rgba(37,99,235,0.25)", textDecoration: "none" }}>
              {t.footer_launch}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
