"use client";

interface LogoProps { variant?: "hero" | "nav"; }

export function OrbitanLogo({ variant = "hero" }: LogoProps) {
  const isHero = variant === "hero";
  return (
    <div className={isHero ? "l-logo-hero" : "l-logo-nav"} aria-label="OrbitAN" role="img">
      <svg viewBox="0 0 460 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="l-logo-svg" style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="lg-soft" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5"/></filter>
          <filter id="lg-med" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="4.5"/></filter>
          <filter id="lg-strong" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="8"/></filter>
          <radialGradient id="lg-p1" cx="30%" cy="26%" r="70%">
            <stop offset="0%" stopColor="#FEF3C7"/><stop offset="16%" stopColor="#F59E0B"/>
            <stop offset="50%" stopColor="#D97706"/><stop offset="100%" stopColor="#78350F"/>
          </radialGradient>
          <radialGradient id="lg-p2" cx="28%" cy="26%" r="70%">
            <stop offset="0%" stopColor="#DBEAFE"/><stop offset="26%" stopColor="#3B82F6"/>
            <stop offset="100%" stopColor="#1E3A5F"/>
          </radialGradient>
          <linearGradient id="lg-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1"/>
            <stop offset="30%" stopColor="#6366F1" stopOpacity="0.5"/>
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0.02)"/>
          </linearGradient>
        </defs>

        {/* ── REGISTRATION GRID ── */}
        <line x1="38" y1="0" x2="38" y2="88" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
        <line x1="0" y1="44" x2="76" y2="44" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
        {/* Corner brackets — precision instrument style */}
        <path d="M3 14 L3 3 L14 3" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
        <path d="M62 3 L73 3 L73 14" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
        <path d="M3 74 L3 85 L14 85" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
        <path d="M62 85 L73 85 L73 74" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
        {/* Inner corner ticks */}
        <path d="M9 9 L15 9 M9 9 L9 15" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" fill="none"/>
        <path d="M67 9 L61 9 M67 9 L67 15" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" fill="none"/>
        <path d="M9 79 L15 79 M9 79 L9 73" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" fill="none"/>
        <path d="M67 79 L61 79 M67 79 L67 73" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" fill="none"/>

        {/* Constructivist diagonals */}
        <line x1="3" y1="20" x2="22" y2="38" stroke="rgba(59,130,246,0.10)" strokeWidth="0.7"/>
        <line x1="54" y1="50" x2="73" y2="66" stroke="rgba(99,102,241,0.08)" strokeWidth="0.7"/>
        <line x1="8" y1="64" x2="26" y2="50" stroke="rgba(245,158,11,0.07)" strokeWidth="0.7"/>
        <line x1="5" y1="28" x2="73" y2="28" stroke="rgba(255,255,255,0.018)" strokeWidth="0.3"/>

        {/* ── ORBITAL RING SYSTEM ── */}
        {/* Ring 1 — Primary blue gradient, tilt -15° */}
        <ellipse cx="38" cy="44" rx="30" ry="35" fill="none" stroke="url(#lg-ring)" strokeWidth="2.4" transform="rotate(-15 38 44)"/>

        {/* Ring 2 — Violet dashed, counter-rotate +38° */}
        <ellipse cx="38" cy="44" rx="21" ry="26" fill="none" stroke="rgba(99,102,241,0.20)" strokeWidth="0.8" strokeDasharray="9 11" transform="rotate(38 38 44)"/>

        {/* Ring 3 — Amber arc fragment, top-right */}
        <path d="M26 18 A32 37 0 0 1 48 11" fill="none" stroke="#F59E0B" strokeWidth="1.3" strokeLinecap="round" transform="rotate(-15 38 44)"/>

        {/* Ring 4 — Micro ring, inner, blue, partial */}
        <ellipse cx="38" cy="44" rx="10" ry="13" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" strokeDasharray="3 12" transform="rotate(-60 38 44)"/>

        {/* Hash marks — 8 cardinal + intercardinal */}
        <g transform="rotate(-15 38 44)" opacity="0.28">
          {[[8,44],[38,8],[68,44],[38,80],[19,17],[57,17],[19,71],[57,71]].map(([x,y],i) => (
            <line key={i} x1={x} y1={y} x2={x+(38-x)*0.08} y2={y+(44-y)*0.08} stroke={i<4?"#3B82F6":"#6366F1"} strokeWidth={i<4?1:0.5}/>
          ))}
        </g>

        {/* ── PLANETS ── */}
        {/* Focal planet — amber, upper-right of ring */}
        <circle cx="56" cy="19" r="13" fill="rgba(245,158,11,0.04)" filter="url(#lg-strong)"/>
        <circle cx="56" cy="19" r="8.5" fill="rgba(245,158,11,0.09)" filter="url(#lg-med)"/>
        <circle cx="56" cy="19" r="6" fill="url(#lg-p1)"/>
        <ellipse cx="53" cy="17" rx="2.6" ry="1.5" fill="rgba(255,255,255,0.52)" transform="rotate(-38 53 17)"/>
        <circle cx="52" cy="15.5" r="1.1" fill="rgba(255,255,255,0.78)"/>
        <path d="M59.5 22 A4.5 4.5 0 0 1 53.5 25 A5.2 5.2 0 0 0 60 20 Z" fill="rgba(0,0,0,0.22)"/>
        <circle cx="56" cy="19" r="1.9" fill="rgba(245,158,11,0.55)" filter="url(#lg-soft)"/>

        {/* Secondary planet — blue, lower-left */}
        <circle cx="14" cy="60" r="6.5" fill="rgba(59,130,246,0.07)" filter="url(#lg-med)"/>
        <circle cx="14" cy="60" r="3" fill="url(#lg-p2)"/>
        <ellipse cx="12.8" cy="59" rx="1.3" ry="0.8" fill="rgba(255,255,255,0.52)" transform="rotate(-32 12.8 59)"/>
        <circle cx="12.4" cy="58.3" r="0.5" fill="rgba(255,255,255,0.75)"/>

        {/* Micro-planets (3) */}
        <circle cx="36" cy="3" r="1.8" fill="rgba(139,92,246,0.45)" filter="url(#lg-soft)"/>
        <circle cx="70" cy="74" r="1.3" fill="rgba(245,158,11,0.35)" filter="url(#lg-soft)"/>
        <circle cx="4" cy="32" r="1" fill="rgba(99,102,241,0.30)" filter="url(#lg-soft)"/>

        {/* ── SEPARATOR ── */}
        <line x1="88" y1="22" x2="88" y2="66" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
        <circle cx="88" cy="44" r="1.6" fill="rgba(255,255,255,0.11)"/>

        {/* ── WORDMARK ── */}
        <text x="104" y="56" fontFamily="'Clash Display', sans-serif" fontWeight="600" fontSize="38" fill="#fff" letterSpacing="-0.4">ORBIT</text>
        <text x="228" y="56" fontFamily="'Clash Display', sans-serif" fontWeight="700" fontSize="38" fill="#F59E0B" letterSpacing="-0.4">A</text>
        <text x="265" y="56" fontFamily="'Clash Display', sans-serif" fontWeight="400" fontSize="38" fill="rgba(255,255,255,0.24)" letterSpacing="-0.4">N</text>

        {/* Wordmark underline + accent */}
        <line x1="104" y1="62" x2="320" y2="62" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
        <path d="M104 66 L115 66" stroke="rgba(59,130,246,0.15)" strokeWidth="0.6"/>

        {/* ── TAGLINE ── */}
        {isHero && (<>
          <text x="106" y="86" fontFamily="'JetBrains Mono', monospace" fontWeight="400" fontSize="7.8" fill="rgba(255,255,255,0.13)" letterSpacing="5.5">ORBITAL · SCHEDULE · SYSTEM</text>
          <line x1="104" y1="92" x2="380" y2="92" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5"/>
          <path d="M390 86 L394 86 L394 90" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none"/>
        </>)}
      </svg>
    </div>
  );
}
