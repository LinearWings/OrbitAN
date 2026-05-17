"use client";

interface LogoProps { variant?: "hero" | "nav"; }

export function OrbitanLogo({ variant = "hero" }: LogoProps) {
  const isHero = variant === "hero";
  return (
    <div className={isHero ? "l-logo-hero" : "l-logo-nav"} aria-label="OrbitAN" role="img">
      <svg viewBox={isHero ? "-17 0 300 130" : "0 0 520 130"} fill="none" xmlns="http://www.w3.org/2000/svg" className="l-logo-svg" style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="lg-soft" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5"/></filter>
          <filter id="lg-med" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="4.5"/></filter>
          <filter id="lg-strong" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur in="SourceGraphic" stdDeviation="8"/></filter>
          <radialGradient id="lg-p1" cx="30%" cy="26%" r="70%">
            <stop offset="0%" stopColor="#FEF3C7"/><stop offset="16%" stopColor="#F59E0B"/>
            <stop offset="50%" stopColor="#D97706"/><stop offset="100%" stopColor="#78350F"/>
          </radialGradient>
          <linearGradient id="lg-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="1"/>
            <stop offset="30%" stopColor="#818CF8" stopOpacity="0.7"/>
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0.04)"/>
          </linearGradient>
        </defs>

        {/* ── THE "O" — orbital ring replacing the first letter ── */}
        {/* Primary ring: blue gradient, tilted */}
        <ellipse cx="46" cy="60" rx="30" ry="35" fill="none" stroke="url(#lg-ring)" strokeWidth="3.5" transform="rotate(-15 46 60)"/>

        {/* Secondary ring: violet dashed, counter-rotated */}
        <ellipse cx="46" cy="60" rx="21" ry="26" fill="none" stroke="rgba(129,140,248,0.40)" strokeWidth="1.2" strokeDasharray="9 11" transform="rotate(38 46 60)"/>

        {/* Amber arc fragment */}
        <path d="M34 34 A32 37 0 0 1 56 27" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" transform="rotate(-15 46 60)"/>

        {/* Inner accent ring */}
        <ellipse cx="46" cy="60" rx="10" ry="13" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" strokeDasharray="3 12" transform="rotate(-60 46 60)"/>

        {/* Ring hash marks */}
        <g transform="rotate(-15 46 60)" opacity="0.45">
          <line x1="16" y1="60" x2="12" y2="60" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="46" y1="25" x2="46" y2="21" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="76" y1="60" x2="80" y2="60" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="46" y1="95" x2="46" y2="99" stroke="#3B82F6" strokeWidth="1"/>
        </g>

        {/* Focal planet — inside the ring (upper-right) */}
        <circle cx="62" cy="37" r="13" fill="rgba(245,158,11,0.04)" filter="url(#lg-strong)"/>
        <circle cx="62" cy="37" r="8.5" fill="rgba(245,158,11,0.09)" filter="url(#lg-med)"/>
        <circle cx="62" cy="37" r="6" fill="url(#lg-p1)"/>
        <ellipse cx="59" cy="35" rx="2.6" ry="1.5" fill="rgba(255,255,255,0.52)" transform="rotate(-38 59 35)"/>
        <circle cx="58" cy="33.5" r="1.1" fill="rgba(255,255,255,0.78)"/>
        <path d="M65.5 40 A4.5 4.5 0 0 1 59.5 43 A5.2 5.2 0 0 0 66 38 Z" fill="rgba(0,0,0,0.22)"/>
        <circle cx="62" cy="37" r="1.9" fill="rgba(245,158,11,0.55)" filter="url(#lg-soft)"/>

        {/* Secondary micro-planet (lower-left of ring) */}
        <circle cx="26" cy="72" r="5" fill="rgba(59,130,246,0.06)" filter="url(#lg-med)"/>
        <circle cx="26" cy="72" r="2.5" fill="#3B82F6"/>
        <ellipse cx="25" cy="71" rx="1" ry="0.6" fill="rgba(255,255,255,0.5)" transform="rotate(-30 25 71)"/>

        {/* Tiny micro-planets */}
        <circle cx="44" cy="23" r="1.6" fill="rgba(139,92,246,0.4)" filter="url(#lg-soft)"/>
        <circle cx="76" cy="86" r="1.1" fill="rgba(245,158,11,0.3)" filter="url(#lg-soft)"/>

        {/* ── WORDMARK — "rbitAN" flows directly from the ring-O ── */}
        {/* The ring IS the O, so the text starts with "rbit" */}
        <text x="62" y="72" fontFamily="'Clash Display', sans-serif" fontWeight="500" fontSize="42" fill="#fff" letterSpacing="-0.5">rbit</text>
        <text x="146" y="72" fontFamily="'Clash Display', sans-serif" fontWeight="700" fontSize="42" fill="#F59E0B" letterSpacing="-0.5">A</text>
        <text x="180" y="72" fontFamily="'Clash Display', sans-serif" fontWeight="400" fontSize="42" fill="rgba(255,255,255,0.22)" letterSpacing="-0.5">N</text>

        <line x1="62" y1="78" x2="225" y2="78" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>

        {/* ── TAGLINE ── */}
        {isHero && (<>
          <text x="135" y="100" fontFamily="'JetBrains Mono', monospace" fontWeight="400" fontSize="7.8" fill="rgba(255,255,255,0.12)" letterSpacing="5.5" textAnchor="middle">ORBITAL · SCHEDULE · SYSTEM</text>
          <line x1="30" y1="106" x2="240" y2="106" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
        </>)}
      </svg>
    </div>
  );
}
