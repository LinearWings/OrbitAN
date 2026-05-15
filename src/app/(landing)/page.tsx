"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import ThreeHero from "@/components/landing/ThreeHero";
import LiveClock from "@/components/landing/LiveClock";

/* ══════════════════════════════════════════════
   DEEP SPACE LAYER — global background
   ══════════════════════════════════════════════ */

function NebulaGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
      <div className="nebula-glow" style={{
        top: "-20%", left: "20%",
        width: "min(60vw, 700px)", height: "min(60vw, 700px)",
        background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, rgba(59,130,246,0.03) 30%, transparent 60%)",
        animationDuration: "55s",
      }} />
      <div className="nebula-glow" style={{
        top: "30%", right: "-10%",
        width: "min(50vw, 600px)", height: "min(50vw, 600px)",
        background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(99,102,241,0.02) 35%, transparent 65%)",
        animationDuration: "60s",
        animationDelay: "-20s",
      }} />
      <div className="nebula-glow" style={{
        bottom: "-15%", left: "40%",
        width: "min(55vw, 650px)", height: "min(55vw, 650px)",
        background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, rgba(59,130,246,0.01) 40%, transparent 70%)",
        animationDuration: "65s",
        animationDelay: "-35s",
      }} />
    </div>
  );
}

function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() < 0.3 ? 2 : 1,
      baseOpacity: 0.3 + Math.random() * 0.5,
      peakOpacity: 0.5 + Math.random() * 0.5,
      dipOpacity: Math.random() * 0.2,
      period: 2 + Math.random() * 6,
      delay: Math.random() * 5,
    })), []
  );

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{ zIndex: 1 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          className="star-point"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            ["--star-base" as string]: s.baseOpacity,
            ["--star-peak" as string]: s.peakOpacity,
            ["--star-dip" as string]: s.dipOpacity,
            ["--star-period" as string]: `${s.period}s`,
            ["--star-delay" as string]: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function TyndallBeams() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 2 }}>
      <div className="tyndall-beam--far" style={{ top: "10%", left: "-80%", transform: "rotate(-15deg)" }} />
      <div className="tyndall-beam--far" style={{ top: "60%", left: "-60%", transform: "rotate(-10deg)", animationDelay: "-20s" }} />
    </div>
  );
}

function NearFieldBeams() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 21 }}>
      <div className="tyndall-beam--near" style={{ top: "35%", animationDelay: "0s" }} />
      <div className="tyndall-beam--near" style={{ top: "55%", animationDelay: "-12s", animationDuration: "30s" }} />
      <div className="tyndall-beam--near" style={{ top: "75%", animationDelay: "-8s", animationDuration: "22s" }} />
    </div>
  );
}

function CosmicDustField() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 30 + Math.random() * 70,
      size: Math.random() < 0.4 ? 1 : 2,
      opacity: 0.3 + Math.random() * 0.4,
      drift: -10 + Math.random() * 20,
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 12,
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 22 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="cosmic-dust"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            ["--dust-opacity" as string]: p.opacity,
            ["--dust-drift" as string]: `${p.drift}px`,
            ["--dust-duration" as string]: `${p.duration}s`,
            ["--dust-delay" as string]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   INSTRUMENT LAYER — clock + panels
   ══════════════════════════════════════════════ */

function OrbitRings() {
  const rings = [
    { size: 108, speed: 80, opacity: 0.10 },
    { size: 116, speed: 95, opacity: 0.08 },
    { size: 124, speed: 110, opacity: 0.07 },
    { size: 132, speed: 85, opacity: 0.06 },
    { size: 140, speed: 100, opacity: 0.05 },
    { size: 148, speed: 115, opacity: 0.04 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true" style={{ zIndex: 20 }}>
      {rings.map((r, i) => (
        <div
          key={i}
          className="orbit-ring"
          style={{
            width: `${r.size}%`,
            height: `${r.size}%`,
            borderColor: `rgba(59,130,246,${r.opacity})`,
            ["--ring-speed" as string]: `${r.speed}s`,
            animationDirection: i % 2 === 0 ? "normal" : "reverse",
          }}
        />
      ))}
    </div>
  );
}

function StatusIndicators({ count = 6 }: { count?: number }) {
  return (
    <div className="flex items-center gap-4" style={{ zIndex: 30 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`status-dot ${i < 3 ? "status-dot--active" : "status-dot--standby"}`}
          style={{ ["--status-delay" as string]: `${i * 0.4}s` }}
          title={`Methodology ${i + 1}`}
        />
      ))}
    </div>
  );
}

function DataReadout({ label, value, variant }: { label: string; value: string; variant?: "mission" }) {
  return (
    <div className={`data-readout ${variant === "mission" ? "data-readout--mission" : ""}`}>
      <span className="data-readout__label">{label}</span>
      <span className="data-readout__value">{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION 2 — Instrument Panel
   ══════════════════════════════════════════════ */

function InstrumentPanel({
  accent,
  title,
  desc,
}: {
  accent: "blue" | "amber" | "violet";
  title: string;
  desc: string;
}) {
  const accentClass =
    accent === "amber" ? "instrument-panel--amber" :
    accent === "violet" ? "instrument-panel--violet" : "";

  return (
    <div className={`instrument-panel ${accentClass}`}>
      <h3 style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: "1.25rem",
        fontWeight: 600,
        color: "rgba(255,255,255,0.85)",
        marginBottom: 16,
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "'Satoshi', sans-serif",
        fontSize: "0.875rem",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.3)",
      }}>
        {desc}
      </p>
      <div style={{
        marginTop: 20,
        height: 20,
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
      }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${4 + Math.sin(i * 0.8) * 8 + Math.random() * 10}px`,
            background: accent === "amber" ? "rgba(245,158,11,0.15)" :
                        accent === "violet" ? "rgba(99,102,241,0.12)" :
                        "rgba(59,130,246,0.12)",
            borderRadius: "1px 1px 0 0",
          }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION 3 — Sequence Timeline
   ══════════════════════════════════════════════ */

interface Step {
  time: string;
  title: string;
  desc: string;
}

function SequenceTimeline({ steps }: { steps: Step[] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: i < steps.length - 1 ? "1 1 0" : "0 0 auto",
          minWidth: 0,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6875rem",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.06em",
            marginBottom: 14,
          }}>
            {step.time}
          </span>
          <div style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}>
            <div className="sequence-node sequence-node--active" />
            {i < steps.length - 1 && (
              <div className="light-track" style={{ ["--flow-delay" as string]: `${i * 1}s` }} />
            )}
          </div>
          <div style={{ marginTop: 16, textAlign: "center", padding: "0 8px" }}>
            <h4 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.75)",
              marginBottom: 6,
            }}>
              {step.title}
            </h4>
            <p style={{
              fontFamily: "'Satoshi', sans-serif",
              fontSize: "0.8125rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.2)",
            }}>
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SECTION 4 — CTA
   ══════════════════════════════════════════════ */

function DockingCTA({
  statusLabel,
  prompt,
  buttonText,
  href,
}: {
  statusLabel: string;
  prompt: string;
  buttonText: string;
  href: string;
}) {
  return (
    <div style={{
      position: "relative",
      background: "rgba(10,13,20,0.7)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 6,
      padding: "clamp(3rem, 8vw, 5rem) 0",
      textAlign: "center",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
      }} />

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 20,
        position: "relative",
      }}>
        <div className="docking-ring" />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.625rem",
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.15)",
          textTransform: "uppercase",
        }}>
          {statusLabel}
        </span>
      </div>

      <p style={{
        fontFamily: "'Clash Display', sans-serif",
        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
        fontWeight: 600,
        color: "rgba(255,255,255,0.75)",
        marginBottom: 32,
        position: "relative",
      }}>
        {prompt}
      </p>

      <Link href={href} className="instrument-btn" style={{ position: "relative" }}>
        {buttonText}
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MOUSE SPOTLIGHT — retained, reduced intensity
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
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        background: `radial-gradient(circle 350px at ${pos.x}px ${pos.y}px,
          rgba(59,130,246,0.04) 0%,
          rgba(59,130,246,0.02) 30%,
          transparent 60%)`,
        transition: "background 0.4s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

/* ══════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════ */

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  const [dateStr, setDateStr] = useState("");
  const [utcStr, setUtcStr] = useState("");
  const [threeActive, setThreeActive] = useState(false);

  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setDateStr(`${y}.${m}.${d}`);
    const offset = -now.getTimezoneOffset() / 60;
    setUtcStr(`UTC${offset >= 0 ? "+" : ""}${offset}`);
  }, []);

  const workflowSteps: Step[] = [
    { time: "00", title: t.how_1_title, desc: t.how_1_desc },
    { time: "06", title: t.how_2_title, desc: t.how_2_desc },
    { time: "12", title: t.how_3_title, desc: t.how_3_desc },
    { time: "18", title: t.how_4_title, desc: t.how_4_desc },
  ];

  return (
    <div style={{ background: "#06080D", color: "rgba(255,255,255,0.85)" }}>
      {/* ══════ Deep Space Layer (global, fixed) — Three.js 3D Scene ══════ */}
      <ThreeHero onWebGLActive={setThreeActive} />
      {/* CSS fallback layers (behind Three.js canvas, visible when WebGL unsupported) */}
      <NebulaGlow />
      <StarField />
      <TyndallBeams />
      <MouseSpotlight />

      {/* ══════════════════════════════════════════════
          SECTION 1: ORBITAL BASELINE (HERO)
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">

        {/* Data readouts — top left */}
        <div style={{
          position: "absolute",
          top: "clamp(2rem, 6vh, 4rem)",
          left: "clamp(1rem, 4vw, 3rem)",
          display: "flex",
          gap: "clamp(1.5rem, 4vw, 3rem)",
          zIndex: 30,
        }}>
          <DataReadout label="LOCAL TIME" value={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })} />
          <DataReadout label="DATE" value={dateStr || "----.--.--"} />
          <DataReadout label="MISSION" value={`LOG #00${3}`} variant="mission" />
        </div>

        {/* Central clock — CSS fallback (hidden when Three.js active) */}
        {!threeActive && (
          <div style={{
            position: "relative",
            zIndex: 25,
            animation: "fade-in 0.8s ease-out forwards",
          }}>
            <LiveClock />
          </div>
        )}

        {/* Status indicators below clock */}
        <div style={{
          marginTop: "clamp(1.5rem, 3vh, 2.5rem)",
          zIndex: 30,
          animation: "fade-in 0.6s ease-out 0.3s forwards",
          opacity: 0,
        }}>
          <StatusIndicators count={6} />
        </div>

        {/* Title */}
        <div style={{
          marginTop: "clamp(1.5rem, 3vh, 2.5rem)",
          textAlign: "center",
          zIndex: 30,
          animation: "fade-in 0.6s ease-out 0.5s forwards",
          opacity: 0,
        }}>
          {/* Ghost clone title — Lusion dual-layer text effect */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <span
              aria-hidden="true"
              className="title-ghost-clone"
            >
              {t.hero_title_1}
            </span>
            <h1 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.015em",
              textShadow: "0 0 40px rgba(59,130,246,0.15)",
              position: "relative",
              zIndex: 2,
            }}>
              {t.hero_title_1}
            </h1>
          </div>
          <hr className="instrument-divider" style={{ width: "clamp(120px, 20vw, 200px)", margin: "16px auto" }} />
          <p style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.3)",
            maxWidth: 480,
            margin: "0 auto",
          }}>
            {t.hero_desc}
          </p>
        </div>

        {/* CTA + secondary link */}
        <div style={{
          marginTop: "clamp(2rem, 5vh, 3.5rem)",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: "clamp(1.5rem, 4vw, 3rem)",
          animation: "fade-in 0.5s ease-out 0.7s forwards",
          opacity: 0,
        }}>
          <Link href="/orbit" className="instrument-btn">
            {t.hero_cta}
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <a href="#systems" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.625rem",
            color: "rgba(255,255,255,0.12)",
            textDecoration: "none",
            letterSpacing: "0.08em",
          }}>
            {t.learn_more}
            <span style={{ display: "block", marginTop: 4, color: "rgba(59,130,246,0.2)", fontSize: "0.75rem" }}>↓</span>
          </a>
        </div>

        {/* Bottom indicator — thin vertical line */}
        <div style={{
          position: "absolute",
          bottom: "clamp(2rem, 5vh, 3rem)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
        }}>
          <div style={{ width: 1, height: 40, background: "rgba(59,130,246,0.15)" }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2: SYSTEM COMPONENTS
          ══════════════════════════════════════════════ */}
      <section id="systems" className="relative px-4 md:px-8 py-28 md:py-36 max-w-5xl mx-auto overflow-hidden" style={{ scrollMarginTop: 72 }}>
        <NearFieldBeams />

        {/* Section header */}
        <div className="flex items-center gap-5 mb-16 relative" style={{ zIndex: 25 }}>
          <div style={{ width: 36, height: 2, background: "#3B82F6", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
          }}>
            {t.features_title}
          </span>
          <hr className="instrument-divider" style={{ flex: 1 }} />
        </div>

        {/* Three panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative" style={{ zIndex: 25 }}>
          <InstrumentPanel accent="blue" title={t.feature_clock_title} desc={t.feature_clock_desc} />
          <InstrumentPanel accent="amber" title={t.feature_methods_title} desc={t.feature_methods_desc} />
          <InstrumentPanel accent="violet" title={t.feature_focus_title} desc={t.feature_focus_desc} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3: DOCKING SEQUENCE
          ══════════════════════════════════════════════ */}
      <section className="relative px-4 md:px-8 py-28 md:py-36 max-w-4xl mx-auto overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-5 mb-16 relative" style={{ zIndex: 25 }}>
          <div style={{ width: 36, height: 2, background: "#3B82F6", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.625rem",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
          }}>
            {t.how_title}
          </span>
          <hr className="instrument-divider" style={{ flex: 1 }} />
        </div>

        {/* Timeline */}
        <div className="relative" style={{ zIndex: 25 }}>
          <SequenceTimeline steps={workflowSteps} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4: DOCKING CLEARANCE (CTA)
          ══════════════════════════════════════════════ */}
      <section className="relative px-4 py-28 md:py-36 max-w-3xl mx-auto">
        <NearFieldBeams />
        <div style={{ zIndex: 25, position: "relative" }}>
          <DockingCTA
            statusLabel={t.cta_label}
            prompt={t.cta_body}
            buttonText={t.cta_button}
            href="/orbit"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════ */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "28px 0",
      }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.5625rem",
            color: "rgba(255,255,255,0.1)",
            letterSpacing: "0.06em",
          }}>
            {t.footer_text}
          </span>
          <div className="flex items-center gap-8">
            <Link href="/docs" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.5625rem",
              color: "rgba(255,255,255,0.12)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}>
              {t.footer_docs}
            </Link>
            <div style={{ width: 1, height: 10, background: "rgba(255,255,255,0.08)" }} />
            <Link href="/orbit" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.5625rem",
              color: "rgba(59,130,246,0.25)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}>
              {t.footer_launch}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
