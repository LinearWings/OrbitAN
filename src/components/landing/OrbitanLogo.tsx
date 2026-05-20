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
            <stop offset="0%" stopColor="#FEF3C7"/><stop offset="12%" stopColor="#FBBF24"/>
            <stop offset="40%" stopColor="#F59E0B"/><stop offset="70%" stopColor="#D97706"/>
            <stop offset="100%" stopColor="#78350F"/>
          </radialGradient>

          <linearGradient id="lg-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="1"/>
            <stop offset="20%" stopColor="#818CF8" stopOpacity="0.85"/>
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5"/>
            <stop offset="80%" stopColor="#6366F1" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="rgba(59,130,246,0.04)"/>
          </linearGradient>

          <linearGradient id="lg-ring-violet" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5"/>
            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#4C1D95" stopOpacity="0.1"/>
          </linearGradient>

          <linearGradient id="lg-wordmark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.85"/>
          </linearGradient>

          <radialGradient id="lg-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.12"/>
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.04"/>
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
          </radialGradient>

          <clipPath id="lg-o-clip"><circle cx="46" cy="60" r="42"/></clipPath>
        </defs>

        {/* ── STATIC STARFIELD (inside the O) ── */}
        <g clipPath="url(#lg-o-clip)" opacity="0.45">
          <circle cx="30" cy="30" r="0.6" fill="#fff"/>
          <circle cx="58" cy="25" r="0.4" fill="#fff"/>
          <circle cx="22" cy="70" r="0.5" fill="#fff"/>
          <circle cx="65" cy="80" r="0.3" fill="#fff"/>
          <circle cx="40" cy="50" r="0.4" fill="#93C5FD"/>
          <circle cx="55" cy="55" r="0.35" fill="#FBBF24"/>
          <circle cx="35" cy="85" r="0.45" fill="#fff"/>
          <circle cx="60" cy="40" r="0.3" fill="#C4B5FD"/>
        </g>

        {/* ── THE "O" ── */}
        {/* Outermost faint halo ring */}
        <ellipse cx="46" cy="60" rx="38" ry="43" fill="none" stroke="rgba(59,130,246,0.04)" strokeWidth="6" transform="rotate(-15 46 60)"/>

        {/* Primary ring: blue gradient */}
        <ellipse cx="46" cy="60" rx="30" ry="35" fill="none" stroke="url(#lg-ring)" strokeWidth="3.5" transform="rotate(-15 46 60)"/>
        <ellipse cx="46" cy="60" rx="30" ry="35" fill="none" stroke="rgba(147,197,253,0.1)" strokeWidth="0.5" strokeDasharray="2 8" transform="rotate(-15 46 60)"/>

        {/* Secondary ring: violet, dashed */}
        <ellipse cx="46" cy="60" rx="21" ry="26" fill="none" stroke="url(#lg-ring-violet)" strokeWidth="1.4" strokeDasharray="9 11" transform="rotate(38 46 60)"/>

        {/* Amber arc fragment */}
        <path d="M34 34 A32 37 0 0 1 56 27" fill="none" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" transform="rotate(-15 46 60)" opacity="0.9"/>
        <path d="M34 34 A32 37 0 0 1 56 27" fill="none" stroke="#FDE68A" strokeWidth="0.6" strokeLinecap="round" transform="rotate(-15 46 60)" opacity="0.35"/>

        {/* Inner accent ring */}
        <ellipse cx="46" cy="60" rx="10" ry="13" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="0.5" strokeDasharray="3 12" transform="rotate(-60 46 60)"/>

        {/* Ring hash marks */}
        <g transform="rotate(-15 46 60)" opacity="0.5">
          <line x1="16" y1="60" x2="11" y2="60" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="46" y1="25" x2="46" y2="20" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="76" y1="60" x2="81" y2="60" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="46" y1="95" x2="46" y2="100" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="24" y1="33" x2="21" y2="30" stroke="#818CF8" strokeWidth="0.6" opacity="0.5"/>
          <line x1="68" y1="33" x2="71" y2="30" stroke="#818CF8" strokeWidth="0.6" opacity="0.5"/>
          <line x1="24" y1="87" x2="21" y2="90" stroke="#818CF8" strokeWidth="0.6" opacity="0.5"/>
          <line x1="68" y1="87" x2="71" y2="90" stroke="#818CF8" strokeWidth="0.6" opacity="0.5"/>
        </g>

        {/* ── FOCAL PLANET (upper-right) ── */}
        <circle cx="62" cy="37" r="18" fill="url(#lg-halo)"/>
        <circle cx="62" cy="37" r="13" fill="rgba(245,158,11,0.05)" filter="url(#lg-strong)"/>
        <circle cx="62" cy="37" r="9" fill="rgba(245,158,11,0.1)" filter="url(#lg-med)"/>
        <circle cx="62" cy="37" r="6.5" fill="url(#lg-p1)"/>
        <ellipse cx="59" cy="34.5" rx="2.8" ry="1.6" fill="rgba(255,255,255,0.55)" transform="rotate(-38 59 34.5)"/>
        <circle cx="58" cy="33" r="1.2" fill="rgba(255,255,255,0.85)"/>
        <circle cx="60" cy="35" r="0.5" fill="rgba(255,255,255,0.3)"/>
        <path d="M65.5 40 A4.5 4.5 0 0 1 59.5 43 A5.2 5.2 0 0 0 66 38 Z" fill="rgba(0,0,0,0.25)"/>
        <circle cx="62" cy="37" r="2" fill="rgba(245,158,11,0.6)" filter="url(#lg-soft)"/>

        {/* ── SECONDARY MICRO-PLANET (lower-left) ── */}
        <circle cx="26" cy="72" r="6" fill="rgba(59,130,246,0.07)" filter="url(#lg-med)"/>
        <circle cx="26" cy="72" r="3" fill="#3B82F6"/>
        <circle cx="26" cy="72" r="3" fill="rgba(59,130,246,0.3)" filter="url(#lg-soft)"/>
        <ellipse cx="25" cy="71" rx="1.1" ry="0.65" fill="rgba(255,255,255,0.55)" transform="rotate(-30 25 71)"/>

        {/* ── TINY MICRO-PLANETS ── */}
        <circle cx="44" cy="23" r="1.8" fill="rgba(139,92,246,0.45)" filter="url(#lg-soft)"/>
        <circle cx="76" cy="86" r="1.2" fill="rgba(245,158,11,0.35)" filter="url(#lg-soft)"/>

        {/* ── WORDMARK ── */}
        <text x="62" y="72" fontFamily="'Clash Display', sans-serif" fontWeight="500" fontSize="42" fill="url(#lg-wordmark)" letterSpacing="-0.8">rbit</text>
        <text x="146" y="72" fontFamily="'Clash Display', sans-serif" fontWeight="700" fontSize="42" fill="#F59E0B" letterSpacing="-0.5">A</text>
        <text x="180" y="72" fontFamily="'Clash Display', sans-serif" fontWeight="400" fontSize="42" fill="rgba(255,255,255,0.18)" letterSpacing="-0.5">N</text>

        <line x1="62" y1="78" x2="225" y2="78" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>

        {/* ── TAGLINE ── */}
        {isHero && (<>
          <text x="135" y="100" fontFamily="'JetBrains Mono', monospace" fontWeight="400" fontSize="5.5" fill="rgba(255,255,255,0.14)" letterSpacing="3" textAnchor="middle">ORBITAL · SCHEDULE · SYSTEM</text>
          <line x1="70" y1="106" x2="200" y2="106" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
        </>)}
      </svg>
    </div>
  );
}
