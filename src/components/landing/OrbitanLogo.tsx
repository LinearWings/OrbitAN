"use client";

interface LogoProps { variant?: "hero" | "nav"; }

export function OrbitanLogo({ variant = "hero" }: LogoProps) {
  const isHero = variant === "hero";
  return (
    <div className={isHero ? "l-logo-hero" : "l-logo-nav"} aria-label="OrbitAN" role="img">
      <svg viewBox="0 0 430 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="l-logo-svg" style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="lg-soft" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5"/></filter>
          <filter id="lg-med" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="4"/></filter>
          <filter id="lg-strong" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="7"/></filter>
          <radialGradient id="lg-planet" cx="32%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#FEF3C7"/><stop offset="18%" stopColor="#F59E0B"/>
            <stop offset="52%" stopColor="#D97706"/><stop offset="100%" stopColor="#78350F"/>
          </radialGradient>
          <radialGradient id="lg-planet2" cx="30%" cy="28%" r="68%">
            <stop offset="0%" stopColor="#DBEAFE"/><stop offset="28%" stopColor="#3B82F6"/>
            <stop offset="100%" stopColor="#1E3A5F"/>
          </radialGradient>
          <linearGradient id="lg-ring1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1"/>
            <stop offset="35%" stopColor="#6366F1" stopOpacity="0.55"/>
            <stop offset="72%" stopColor="#3B82F6" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0.03)"/>
          </linearGradient>
        </defs>

        {/* ── REGISTRATION GEOMETRY ── */}
        <line x1="36" y1="0" x2="36" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
        <line x1="0" y1="40" x2="72" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
        {/* Corner brackets */}
        <path d="M3 12 L3 3 L12 3" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" fill="none"/>
        <path d="M60 3 L69 3 L69 12" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" fill="none"/>
        <path d="M3 68 L3 77 L12 77" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" fill="none"/>
        <path d="M60 77 L69 77 L69 68" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" fill="none"/>

        {/* Constructivist diagonals */}
        <line x1="3" y1="18" x2="20" y2="35" stroke="rgba(59,130,246,0.10)" strokeWidth="0.6"/>
        <line x1="52" y1="46" x2="69" y2="60" stroke="rgba(99,102,241,0.08)" strokeWidth="0.6"/>
        <line x1="8" y1="58" x2="24" y2="46" stroke="rgba(245,158,11,0.07)" strokeWidth="0.6"/>
        <line x1="5" y1="26" x2="69" y2="26" stroke="rgba(255,255,255,0.02)" strokeWidth="0.3"/>

        {/* ── ORBITAL RING SYSTEM ── */}
        {/* Ring 1 — Primary blue gradient, thick, tilt -15° */}
        <ellipse cx="36" cy="40" rx="28" ry="32" fill="none" stroke="url(#lg-ring1)" strokeWidth="2.2" transform="rotate(-15 36 40)"/>

        {/* Ring 2 — Violet dashed, counter-rotated +38° */}
        <ellipse cx="36" cy="40" rx="19" ry="23" fill="none" stroke="rgba(99,102,241,0.22)" strokeWidth="0.8" strokeDasharray="8 10" transform="rotate(38 36 40)"/>

        {/* Ring 3 — Amber arc fragment, top-right quadrant */}
        <path d="M24 16 A30 34 0 0 1 45 10" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" transform="rotate(-15 36 40)"/>

        {/* Ring hash marks — 4 cardinal + 4 intercardinal */}
        <g transform="rotate(-15 36 40)" opacity="0.3">
          <line x1="8" y1="40" x2="8" y2="46" stroke="#3B82F6" strokeWidth="0.9"/>
          <line x1="36" y1="8" x2="36" y2="4" stroke="#3B82F6" strokeWidth="0.9"/>
          <line x1="64" y1="40" x2="64" y2="34" stroke="#3B82F6" strokeWidth="0.9"/>
          <line x1="36" y1="72" x2="36" y2="76" stroke="#3B82F6" strokeWidth="0.9"/>
          <line x1="18" y1="14" x2="18" y2="18" stroke="#6366F1" strokeWidth="0.5"/>
          <line x1="54" y1="14" x2="54" y2="18" stroke="#6366F1" strokeWidth="0.5"/>
          <line x1="18" y1="66" x2="18" y2="62" stroke="#6366F1" strokeWidth="0.5"/>
          <line x1="54" y1="66" x2="54" y2="62" stroke="#6366F1" strokeWidth="0.5"/>
        </g>

        {/* ── FOCAL PLANET (upper-right of ring) ── */}
        <circle cx="53" cy="18" r="12" fill="rgba(245,158,11,0.05)" filter="url(#lg-strong)"/>
        <circle cx="53" cy="18" r="8" fill="rgba(245,158,11,0.10)" filter="url(#lg-med)"/>
        <circle cx="53" cy="18" r="5.8" fill="url(#lg-planet)"/>
        <ellipse cx="50.5" cy="16" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.5)" transform="rotate(-35 50.5 16)"/>
        <circle cx="49.5" cy="15" r="1" fill="rgba(255,255,255,0.75)"/>
        <path d="M56.5 21 A4.5 4.5 0 0 1 51 24 A5 5 0 0 0 57 19.5 Z" fill="rgba(0,0,0,0.2)"/>
        <circle cx="53" cy="18" r="1.8" fill="rgba(245,158,11,0.55)" filter="url(#lg-soft)"/>

        {/* ── SECONDARY PLANET (lower-left, blue) ── */}
        <circle cx="13" cy="55" r="6" fill="rgba(59,130,246,0.08)" filter="url(#lg-med)"/>
        <circle cx="13" cy="55" r="2.8" fill="url(#lg-planet2)"/>
        <ellipse cx="11.8" cy="54" rx="1.2" ry="0.7" fill="rgba(255,255,255,0.5)" transform="rotate(-30 11.8 54)"/>
        <circle cx="11.5" cy="53.5" r="0.5" fill="rgba(255,255,255,0.7)"/>

        {/* ── MICRO-PLANETS ── */}
        <circle cx="34" cy="3" r="1.6" fill="rgba(139,92,246,0.45)" filter="url(#lg-soft)"/>
        <circle cx="64" cy="68" r="1.2" fill="rgba(245,158,11,0.35)" filter="url(#lg-soft)"/>
        <circle cx="5" cy="30" r="0.9" fill="rgba(99,102,241,0.3)" filter="url(#lg-soft)"/>

        {/* ── RULE SEPARATOR ── */}
        <line x1="82" y1="22" x2="82" y2="58" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
        <circle cx="82" cy="40" r="1.5" fill="rgba(255,255,255,0.10)"/>

        {/* ── WORDMARK ── */}
        <text x="96" y="51" fontFamily="'Clash Display', sans-serif" fontWeight="600" fontSize="34" fill="#fff" letterSpacing="-0.3">ORBIT</text>
        <text x="210" y="51" fontFamily="'Clash Display', sans-serif" fontWeight="700" fontSize="34" fill="#F59E0B" letterSpacing="-0.3">A</text>
        <text x="244" y="51" fontFamily="'Clash Display', sans-serif" fontWeight="400" fontSize="34" fill="rgba(255,255,255,0.26)" letterSpacing="-0.3">N</text>

        {/* Wordmark underline */}
        <line x1="96" y1="57" x2="290" y2="57" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>

        {/* ── TAGLINE ── */}
        {isHero && (<>
          <text x="98" y="78" fontFamily="'JetBrains Mono', monospace" fontWeight="400" fontSize="7.2" fill="rgba(255,255,255,0.14)" letterSpacing="5">ORBITAL · SCHEDULE · SYSTEM</text>
          <line x1="96" y1="83" x2="350" y2="83" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
          <path d="M358 78 L362 78 L362 82" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none"/>
        </>)}
      </svg>
    </div>
  );
}
