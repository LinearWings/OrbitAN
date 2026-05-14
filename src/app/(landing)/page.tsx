"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import LiveClock from "@/components/landing/LiveClock";

/* ══════════════════════════════════════════════
   PARTICLE FIELD
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
          rgba(37,99,235,0.08) 0%,
          rgba(37,99,235,0.04) 30%,
          rgba(37,99,235,0.015) 50%,
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
        borderTop: "2px solid rgba(255,255,255,0.06)",
        borderBottom: "2px solid rgba(255,255,255,0.06)",
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
   CONSTRUCTIVIST GEOMETRY — parallax line networks
   ══════════════════════════════════════════════ */
function ConstructivistGeometry() {
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

      {/* ── Dense diagonal line clusters — top-left zone ── */}
      <div style={{ position: "absolute", top: `${12 + t * 40}%`, left: `${-5 - t * 20}%`, width: "60%", height: "60%", transform: "rotate(-38deg)", display: "flex", flexDirection: "column", gap: "12px" }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={`d1-${i}`} style={{ height: 1, width: "100%", background: `rgba(37,99,235,${0.10 + i * 0.010})` }} />
        ))}
      </div>

      {/* ── Horizontal line cluster — mid-right ── */}
      <div style={{ position: "absolute", top: `${40 + t * 15}%`, right: `${-15 + t * 10}%`, width: "45%", height: "30%", transform: "rotate(22deg)", display: "flex", flexDirection: "column", gap: "8px" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`d2-${i}`} style={{ height: 1, width: "100%", background: `rgba(37,99,235,${0.08 + i * 0.012})` }} />
        ))}
      </div>

      {/* ── Vertical line cluster — far left ── */}
      <div style={{ position: "absolute", top: `${55 + t * 20}%`, left: `${3 - t * 5}%`, width: "2%", height: "40%", transform: "rotate(5deg)", display: "flex", flexDirection: "row", gap: "4px" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`v1-${i}`} style={{ width: 1, height: "100%", background: `rgba(255,255,255,${0.08 + i * 0.015})` }} />
        ))}
      </div>

      {/* ── Massive rotated rectangle — brutalist mass ── */}
      <div style={{
        position: "absolute",
        top: `${-15 + t * 25}%`, right: `${-10 + t * 5}%`,
        width: "min(50vw, 500px)", height: "min(50vw, 500px)",
        border: "6px solid rgba(37,99,235,0.08)",
        transform: `rotate(${25 + t * 8}deg)`,
        background: "rgba(0,0,0,0.3)",
      }} />

      {/* ── Thick diagonal band — constructivist slash ── */}
      <div style={{
        position: "absolute",
        top: `${30 + t * 35}%`, left: `${-20 - t * 15}%`,
        width: "min(80vw, 800px)", height: "4px",
        background: "rgba(37,99,235,0.22)",
        transform: `rotate(-42deg)`,
      }} />

      {/* ── Industrial crosshair ── */}
      <div style={{
        position: "absolute",
        top: `${70 + t * 10}%`, left: `${8 - t * 8}%`,
        width: "min(16vw, 160px)", height: "min(16vw, 160px)",
      }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "rgba(37,99,235,0.30)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "rgba(37,99,235,0.30)" }} />
        <div style={{ position: "absolute", top: 8, left: 8, right: 8, bottom: 8, border: "1px solid rgba(255,255,255,0.06)", borderRadius: "50%" }} />
      </div>

      {/* ── Deconstructed ring — surrealist partial clock face ── */}
      <div style={{
        position: "absolute",
        top: `${45 + t * 20}%`, right: `${10 - t * 8}%`,
        width: "min(30vw, 300px)", height: "min(30vw, 300px)",
        border: "2px dashed rgba(37,99,235,0.22)",
        borderRadius: "50%",
        animation: `deconstructedSpin ${120 + t * 30}s linear infinite`,
      }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = i * 45;
          return (
            <div key={`tick-${i}`} style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: i % 3 === 0 ? 4 : 2,
              height: i % 3 === 0 ? "42%" : "15%",
              background: i % 3 === 0 ? "rgba(37,99,235,0.30)" : "rgba(37,99,235,0.16)",
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
              transformOrigin: "bottom center",
            }} />
          );
        })}
      </div>

      {/* ── Blue dot constellation ── */}
      <div className="constellation-dot" style={{ top: `${18 + t * 50}%`, left: `${75 + t * 8}%`, animationDelay: "0s" }} />
      <div className="constellation-dot" style={{ top: `${55 + t * 30}%`, left: `${88 - t * 5}%`, animationDelay: "1.5s" }} />
      <div className="constellation-dot" style={{ top: `${35 + t * 60}%`, left: `${12 - t * 3}%`, animationDelay: "3s" }} />

      {/* ── Vertical rail — far right ── */}
      <div style={{ position: "absolute", top: 0, bottom: 0, right: `${2 + t * 3}%`, width: "3px", background: "rgba(37,99,235,0.18)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: `${2.5 + t * 3}%`, width: "1px", background: "rgba(255,255,255,0.08)" }} />

      {/* ── Void block — bottom left ── */}
      <div className="void-block" style={{
        bottom: `${5 - t * 15}%`, left: `${-3 + t * 5}%`,
        width: "min(20vw, 200px)", height: "min(20vw, 200px)",
      }} />

      {/* ── Heavy horizontal bar — top ── */}
      <div style={{
        position: "absolute",
        top: `${10 + t * 30}%`, left: `${60 - t * 10}%`,
        width: "min(25vw, 250px)", height: "8px",
        background: "rgba(37,99,235,0.22)",
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   TIME FRAGMENTS — surrealist floating numbers
   ══════════════════════════════════════════════ */
function TimeFragments() {
  const fragments = [
    { value: "06", top: "8%", left: "5%", rotate: -12, opacity: 0.18, delay: 0, size: "lg" },
    { value: "12", top: "5%", right: "10%", rotate: 8, opacity: 0.22, delay: 3, size: "lg" },
    { value: "18", bottom: "10%", left: "3%", rotate: -5, opacity: 0.16, delay: 6, size: "md" },
    { value: "24", bottom: "6%", right: "6%", rotate: 15, opacity: 0.22, delay: 9, size: "lg" },
    { value: "00", top: "50%", right: "2%", rotate: -20, opacity: 0.12, delay: 4, size: "sm" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {fragments.map((f, i) => (
        <div
          key={i}
          className={`time-fragment ${i % 3 === 0 ? "time-fragment--amber" : ""} ${f.size === "sm" ? "time-fragment--sm" : f.size === "lg" ? "time-fragment--lg" : ""}`}
          style={{
            position: "absolute",
            top: f.top, bottom: f.bottom, left: f.left, right: f.right,
            animationDelay: `${f.delay}s`,
            animationDuration: `${10 + i * 3}s`,
            ["--frag-rotate" as string]: `${f.rotate}deg`,
            ["--frag-opacity" as string]: f.opacity,
          }}
        >
          {f.value}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   BLUEPRINT GRID — architectural line grid
   ══════════════════════════════════════════════ */
function BlueprintGrid({ dense = false }: { dense?: boolean }) {
  return (
    <div className={`blueprint-grid ${dense ? "blueprint-grid-dense" : ""}`} aria-hidden="true" />
  );
}

/* ══════════════════════════════════════════════
   RADIAL LINE BURST — constructivist rays
   ══════════════════════════════════════════════ */
function RadialLineBurst() {
  return <div className="radial-burst" aria-hidden="true" />;
}

/* ══════════════════════════════════════════════
   INDUSTRIAL STAMP — section label
   ══════════════════════════════════════════════ */
function SectionStamp({ text }: { text: string }) {
  return (
    <div className="section-stamp">
      <div style={{ width: 6, height: 6, background: "#2563EB" }} />
      {text}
    </div>
  );
}

/* ══════════════════════════════════════════════
   DIAGONAL SLASH SECTION DIVIDER
   ══════════════════════════════════════════════ */
function DiagonalSlashDivider() {
  return (
    <div style={{ position: "relative", height: 80 }} aria-hidden="true">
      <div className="diagonal-slash" style={{ top: "50%", left: "-50%", transform: "rotate(-8deg)" }} />
      <div className="diagonal-slash" style={{ top: "calc(50% + 8px)", left: "-50%", transform: "rotate(-8deg)" }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 8, height: 8, background: "#2563EB", transform: "translate(-50%, -50%) rotate(45deg)",
        boxShadow: "0 0 12px rgba(37,99,235,0.4)",
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════
   AVANT-GARDE FEATURE CARD
   ══════════════════════════════════════════════ */
function FeatureCard({ num, title, desc, accentColor = "#2563EB" }: {
  num: string;
  title: string;
  desc: string;
  accentColor?: string;
}) {
  return (
    <div className="avant-card" style={{ borderLeft: `6px solid ${accentColor}` }}>
      {/* Number bleed */}
      <div className="section-number-brutalist" style={{
        position: "absolute", top: -60, right: 16,
        color: "rgba(255,255,255,0.07)",
        fontSize: "clamp(5rem, 12vw, 14rem)",
      }}>
        {num}
      </div>
      <h2 style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
        fontWeight: 600,
        color: "rgba(255,255,255,0.85)",
        marginBottom: 16,
        position: "relative",
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: "'Satoshi', sans-serif",
        fontSize: "0.875rem",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.22)",
        maxWidth: "90%",
        position: "relative",
      }}>
        {desc}
      </p>
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
    <div style={{ background: "#090909", color: "rgba(255,255,255,0.85)" }}>
      {/* ── Global warm ambient glow ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 30% 20%, rgba(234,179,8,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(37,99,235,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(234,179,8,0.03) 0%, transparent 50%)",
      }} aria-hidden="true" />
      {/* Global effects */}
      <div className="scanlines" aria-hidden="true" />
      <MouseSpotlight />

      {/* ═══════════════════════════════════════════════════════
          SECTION 1: TIME ANCHOR (HERO)
          ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <BlueprintGrid />
        <RadialLineBurst />
        <TimeFragments />
        <PulseRings count={4} />
        <ParticleField />
        <LightBeams />
        <ConstructivistGeometry />

        {/* ── Heavy clock housing ── */}
        <div style={{ animation: "hardCutInGlitch 0.6s steps(1) forwards", opacity: 0, position: "relative", zIndex: 10 }}>
          <div className="clock-housing" style={{ position: "relative" }}>
            {/* Small deconstructed ring behind clock */}
            <div className="deconstructed-ring deconstructed-ring--dashed" style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: "120%", height: "120%",
              transform: "translate(-50%, -50%)",
            }} />
            <LiveClock />
          </div>
          <div className="mt-5 text-center">
            <GlitchSubtitle text={t.hero_tagline} />
          </div>
        </div>

        {/* ── Title Block with constructivist framing ── */}
        <div className="mt-12 text-center" style={{ animation: "hardCutIn 0.35s steps(1) 0.2s forwards", opacity: 0, position: "relative", zIndex: 10 }}>
          {/* Heavy top rail — blue + amber dual stripe matching orbit page */}
          <div style={{ margin: "0 auto 16px", width: "clamp(120px, 20vw, 280px)" }}>
            <div style={{
              width: "100%", height: 4,
              background: "#2563EB",
              boxShadow: "0 0 12px rgba(234,179,8,0.15)",
            }} />
          </div>
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

          {/* Constructivist center bar with angle brackets */}
          <div className="flex items-center justify-center gap-4 my-4" style={{ position: "relative" }}>
            {/* Background glow — not on text edge */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "clamp(300px, 60vw, 600px)", height: "clamp(150px, 25vw, 300px)",
              background: "radial-gradient(ellipse at center, rgba(37,99,235,0.16) 0%, rgba(234,179,8,0.06) 30%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }} />
            <div className="angle-bracket angle-bracket--tl" style={{ width: 32, height: 32, position: "relative", zIndex: 1 }} />
            <div style={{
              width: "clamp(60px, 12vw, 120px)", height: 4,
              background: "#EAB308",
              position: "relative", zIndex: 1,
            }} />
            <span style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 700,
              color: "#2563EB",
              letterSpacing: "-0.02em",
              position: "relative", zIndex: 1,
            }}>
              {t.hero_title_2}
            </span>
            <div style={{
              width: "clamp(60px, 12vw, 120px)", height: 4,
              background: "#EAB308",
              position: "relative", zIndex: 1,
            }} />
            <div className="angle-bracket" style={{ width: 32, height: 32 }} />
          </div>
        </div>

        {/* ── Description with heavy left rail ── */}
        <div className="mt-10 max-w-xl text-center" style={{ animation: "hardCutIn 0.35s steps(1) 0.4s forwards", opacity: 0, position: "relative", zIndex: 10 }}>
          <div style={{
            borderLeft: "6px solid rgba(234,179,8,0.15)",
            padding: "16px 0 16px 20px",
            background: "rgba(234,179,8,0.02)",
            textAlign: "left" as const,
          }}>
            <p style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.25)",
            }}>
              {t.hero_desc}
            </p>
          </div>
        </div>

        {/* ── CTA with heavy brutalist button ── */}
        <div className="mt-14 flex items-center gap-10" style={{ animation: "strobeOnce 0.8s ease-out 0.6s forwards", opacity: 0, position: "relative", zIndex: 10 }}>
          <Link href="/orbit" className="brutal-cta-heavy">
            {t.hero_cta}
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <a href="#features" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            color: "rgba(255,255,255,0.1)",
            textDecoration: "none",
            letterSpacing: "0.08em",
          }}>
            {t.learn_more}
            <span style={{ display: "block", marginTop: 6, color: "rgba(37,99,235,0.25)", fontSize: "0.75rem" }}>↓</span>
          </a>
        </div>

        {/* Bottom time-mark notches */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-16" style={{ zIndex: 10 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="time-mark" style={{ animationDelay: `${i * 0.8}s` }} />
          ))}
        </div>

        {/* Bottom scroll indicator — vertical rail */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ zIndex: 10 }}>
          <div style={{ width: 2, height: 56, background: "rgba(37,99,235,0.25)" }} />
        </div>
      </section>

      <DiagonalSlashDivider />
      <MarqueeStrip />
      <DiagonalSlashDivider />

      {/* ═══════════════════════════════════════════════════════
          SECTION 2: CORE SYSTEMS (Features)
          ════════════════════════════════════════════════════ */}
      <section id="features" className="relative px-4 md:px-8 py-32 md:py-40 max-w-6xl mx-auto overflow-hidden" style={{ scrollMarginTop: 72 }}>
        <BlueprintGrid dense />
        <LightBeams />

        {/* ── Section header ── */}
        <div className="flex items-center gap-5 mb-24 relative" style={{ zIndex: 1 }}>
          <div style={{ width: 48, height: 8, background: "#2563EB", boxShadow: "0 0 20px rgba(37,99,235,0.4)" }} />
          <SectionStamp text={t.features_title} />
          <div className="light-streak" style={{ flex: 1, height: 2 }} />
        </div>

        {/* ── Feature cards in avant-garde layout ── */}
        <div className="relative" style={{ zIndex: 1 }}>
          {/* Connecting vertical line network */}
          <div className="industrial-rail industrial-rail--vertical" style={{
            left: 40, top: 0, bottom: 0, width: 4,
          }} />

          {/* 01 — Orbital Clock */}
          <div className="relative mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-2 flex md:justify-end md:pr-12 mb-2 md:mb-0 relative">
                <span className="section-number-brutalist" style={{ position: "relative", top: -20, zIndex: 0 }}>
                  01
                </span>
                {/* Diamond marker on rail */}
                <div className="geo-diamond" style={{ position: "absolute", left: 35, top: 24, zIndex: 2, width: 10, height: 10 }} />
              </div>
              <div className="md:col-span-8 relative" style={{ zIndex: 1 }}>
                <FeatureCard num="01" title={t.feature_clock_title} desc={t.feature_clock_desc} />
              </div>
            </div>
          </div>

          {/* 02 — Six Methodologies */}
          <div className="relative mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-3 hidden md:block" />
              <div className="md:col-span-2 flex md:justify-end md:pr-12 mb-2 md:mb-0 relative">
                <span className="section-number-brutalist" style={{ position: "relative", top: -20, zIndex: 0 }}>
                  02
                </span>
                <div className="geo-diamond geo-diamond--amber" style={{ position: "absolute", left: 35, top: 24, zIndex: 2, width: 10, height: 10 }} />
              </div>
              <div className="md:col-span-7 relative" style={{ zIndex: 1 }}>
                <FeatureCard num="02" title={t.feature_methods_title} desc={t.feature_methods_desc} accentColor="#EAB308" />
              </div>
            </div>
          </div>

          {/* 03 — Focus Blocks */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-2 flex md:justify-end md:pr-12 mb-2 md:mb-0 relative">
                <span className="section-number-brutalist" style={{ position: "relative", top: -20, zIndex: 0 }}>
                  03
                </span>
                <div className="geo-diamond geo-diamond--hollow" style={{ position: "absolute", left: 36, top: 24, zIndex: 2 }} />
              </div>
              <div className="md:col-span-8 relative" style={{ zIndex: 1 }}>
                <FeatureCard num="03" title={t.feature_focus_title} desc={t.feature_focus_desc} accentColor="#374151" />
              </div>
            </div>
          </div>
        </div>

        {/* Surreal constellation lines */}
        <div className="constellation-dot" style={{ top: "15%", right: "10%", animationDelay: "0s" }} />
        <div className="constellation-dot" style={{ top: "40%", right: "5%", animationDelay: "1s" }} />
        <div className="constellation-dot" style={{ bottom: "20%", right: "15%", animationDelay: "2s" }} />
      </section>

      <DiagonalSlashDivider />
      <MarqueeStrip />
      <DiagonalSlashDivider />

      {/* ═══════════════════════════════════════════════════════
          SECTION 3: WORKFLOW TIMELINE
          ════════════════════════════════════════════════════ */}
      <section className="relative px-4 md:px-8 py-32 md:py-40 max-w-4xl mx-auto overflow-hidden">
        <BlueprintGrid />

        {/* ── Section header ── */}
        <div className="flex items-center gap-5 mb-24 relative" style={{ zIndex: 1 }}>
          <div style={{ width: 48, height: 8, background: "#2563EB", boxShadow: "0 0 20px rgba(37,99,235,0.4)" }} />
          <SectionStamp text={t.how_title} />
          <div className="light-streak" style={{ flex: 1, height: 2 }} />
        </div>

        <div className="relative" style={{ zIndex: 1 }}>
          {/* ── Heavy industrial rail ── */}
          <div
            className="industrial-rail industrial-rail--vertical"
            style={{
              left: "60px",
              top: 40,
              bottom: 40,
              width: 6,
              background: "rgba(37,99,235,0.12)",
            }}
          />
          {/* Rail side-lines */}
          <div style={{
            position: "absolute", left: 54, top: 40, bottom: 40, width: 2,
            background: "rgba(37,99,235,0.12)",
          }} />
          <div style={{
            position: "absolute", left: 70, top: 40, bottom: 40, width: 1,
            background: "rgba(255,255,255,0.06)",
          }} />

          {[
            { time: "00:00", title: t.how_1_title, desc: t.how_1_desc },
            { time: "06:00", title: t.how_2_title, desc: t.how_2_desc },
            { time: "12:00", title: t.how_3_title, desc: t.how_3_desc },
            { time: "18:00", title: t.how_4_title, desc: t.how_4_desc },
          ].map((step, i) => (
            <div key={i} className="relative flex items-start py-12 first:pt-14 last:pb-14">
              {/* Time code — heavier industrial style */}
              <div style={{
                width: "60px",
                flexShrink: 0,
                textAlign: "right",
                paddingRight: 32,
                paddingTop: 4,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.14)",
                letterSpacing: "0.06em",
              }}>
                {step.time}
              </div>

              {/* ── Diamond marker on rail ── */}
              <div className="geo-diamond" style={{
                position: "absolute",
                left: 56,
                top: 52,
                zIndex: 2,
              }} />

              {/* ── Horizontal connector line ── */}
              <div style={{
                position: "absolute",
                left: 74,
                top: 58,
                width: 32,
                height: 1,
                background: "rgba(37,99,235,0.12)",
              }} />

              {/* ── Content block in brutalist frame ── */}
              <div style={{
                flex: 1,
                paddingLeft: 24,
                borderLeft: "3px solid rgba(255,255,255,0.08)",
                position: "relative",
              }}>
                {/* Angle bracket corner */}
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: 20, height: 20,
                  borderTop: "2px solid rgba(37,99,235,0.30)",
                  borderLeft: "2px solid rgba(37,99,235,0.30)",
                }} />
                <h3 style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.78)",
                  marginBottom: 8,
                  paddingTop: 8,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.2)",
                  maxWidth: "85%",
                }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Floating time fragments near timeline */}
        <div className="time-fragment time-fragment--sm" style={{
          position: "absolute", left: "2%", top: "30%",
          animationDelay: "2s", animationDuration: "14s",
          ["--frag-rotate" as string]: "-8deg",
          ["--frag-opacity" as string]: 0.16,
        }}>
          12:00
        </div>
        <div className="time-fragment time-fragment--amber time-fragment--sm" style={{
          position: "absolute", right: "3%", bottom: "25%",
          animationDelay: "5s", animationDuration: "16s",
          ["--frag-rotate" as string]: "12deg",
          ["--frag-opacity" as string]: 0.14,
        }}>
          24:00
        </div>
      </section>

      <DiagonalSlashDivider />

      {/* ═══════════════════════════════════════════════════════
          SECTION 4: ACTION ZONE (CTA)
          ════════════════════════════════════════════════════ */}
      <section className="relative px-4 py-36 md:py-44 overflow-hidden">
        <BlueprintGrid />
        <LightBeams />
        <RadialLineBurst />

        {/* Brutalist triple-frame container */}
        <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1 }}>
          {/* Outer ghost frame */}
          <div style={{
            position: "absolute", inset: -24,
            border: "2px solid rgba(37,99,235,0.10)",
            pointerEvents: "none",
          }} />
          {/* Inner heavy frame */}
          <div style={{
            position: "absolute", inset: -12,
            border: "4px solid rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }} />
          {/* Content box */}
          <div style={{
            borderTop: "6px solid rgba(37,99,235,0.35)",
            borderBottom: "4px solid rgba(255,255,255,0.08)",
            padding: "clamp(4rem, 10vw, 7rem) 0",
            position: "relative",
            background: "rgba(0,0,0,0.3)",
          }}>
            {/* Corner constructivist brackets */}
            <div style={{ position: "absolute", top: -6, left: 0, width: 60, height: 6, background: "#2563EB" }} />
            <div style={{ position: "absolute", bottom: -4, right: 0, width: 60, height: 4, background: "rgba(37,99,235,0.2)" }} />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 px-8 md:px-16">
              <div>
                {/* Status indicator */}
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 12, height: 12, background: "#EAB308", boxShadow: "0 0 14px rgba(234,179,8,0.4)", transform: "rotate(45deg)" }} />
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.1)",
                    textTransform: "uppercase" as const,
                  }}>
                    {t.cta_label}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.8)",
                  borderLeft: "6px solid rgba(37,99,235,0.4)",
                  paddingLeft: 24,
                }}>
                  {t.cta_body}
                </p>
              </div>
              <Link href="/orbit" className="brutal-cta-heavy" style={{ whiteSpace: "nowrap" }}>
                {t.cta_button}
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: "4px solid rgba(255,255,255,0.08)", padding: "32px 0", background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="geo-diamond geo-diamond--hollow" style={{ width: 8, height: 8 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.625rem", color: "rgba(255,255,255,0.12)", letterSpacing: "0.06em" }}>
              {t.footer_text}
            </span>
          </div>
          <div className="flex items-center gap-10">
            <Link href="/docs" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.625rem", color: "rgba(255,255,255,0.15)", textDecoration: "none" }}>
              {t.footer_docs}
            </Link>
            <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.10)" }} />
            <Link href="/orbit" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.625rem", color: "rgba(37,99,235,0.3)", textDecoration: "none" }}>
              {t.footer_launch}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
