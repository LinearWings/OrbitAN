"use client";

interface LogoProps {
  variant?: "hero" | "nav";
}

export function OrbitanLogo({ variant = "hero" }: LogoProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={isHero ? "l-logo-hero" : "l-logo-nav"}
      aria-label="OrbitAN — Orbital Schedule System"
      role="img"
    >
      <svg
        viewBox="0 0 370 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="l-logo-svg"
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          <filter id="lg-soft" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="lg-med" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
          </filter>
          <filter id="lg-strong" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <radialGradient id="lg-planet" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="20%" stopColor="#F59E0B" />
            <stop offset="55%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>
          <linearGradient id="lg-ring1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="35%" stopColor="#6366F1" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.05)" />
          </linearGradient>
          <linearGradient id="lg-planet2" cx="30%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#BFDBFE" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>

        {/* ── Background registration geometry ── */}
        {/* Subtle crosshair behind orbital mark */}
        <line x1="30" y1="0" x2="30" y2="68" stroke="rgba(255,255,255,0.025)" strokeWidth="0.4" />
        <line x1="0" y1="34" x2="60" y2="34" stroke="rgba(255,255,255,0.025)" strokeWidth="0.4" />
        {/* Corner ticks */}
        <path d="M 2 8 L 2 2 L 8 2" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none" />
        <path d="M 52 2 L 58 2 L 58 8" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none" />
        <path d="M 2 60 L 2 66 L 8 66" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none" />
        <path d="M 52 66 L 58 66 L 58 60" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none" />

        {/* ── Constructivist diagonal accents ── */}
        <line x1="2" y1="14" x2="16" y2="28" stroke="rgba(59,130,246,0.08)" strokeWidth="0.5" />
        <line x1="44" y1="40" x2="58" y2="54" stroke="rgba(99,102,241,0.06)" strokeWidth="0.5" />
        <line x1="6" y1="50" x2="20" y2="40" stroke="rgba(245,158,11,0.06)" strokeWidth="0.5" />

        {/* ── ORBITAL RING SYSTEM ── */}

        {/* Ring 1 — Primary: blue gradient, thick, tilt -15° */}
        <ellipse cx="30" cy="34" rx="23" ry="27" fill="none" stroke="url(#lg-ring1)"
          strokeWidth="2" transform="rotate(-15 30 34)" />

        {/* Ring 2 — Secondary: violet, thinner, counter-rotate +38°, dashed */}
        <ellipse cx="30" cy="34" rx="16" ry="19" fill="none"
          stroke="rgba(99,102,241,0.22)" strokeWidth="0.7"
          strokeDasharray="7 9" transform="rotate(38 30 34)" />

        {/* Ring 3 — Amber fragment: top-right quadrant arc */}
        <path d="M 20 14 A 25 29 0 0 1 37 8"
          fill="none" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round"
          transform="rotate(-15 30 34)" />

        {/* Ring hash marks — 4 cardinal points */}
        <g transform="rotate(-15 30 34)" opacity="0.25">
          <line x1="7" y1="34" x2="7" y2="39" stroke="#3B82F6" strokeWidth="0.8" />
          <line x1="30" y1="7" x2="30" y2="3" stroke="#3B82F6" strokeWidth="0.8" />
          <line x1="53" y1="34" x2="53" y2="29" stroke="#3B82F6" strokeWidth="0.8" />
          <line x1="30" y1="61" x2="30" y2="65" stroke="#3B82F6" strokeWidth="0.8" />
        </g>

        {/* ── FOCAL PLANET — upper-right of ring ── */}
        {/* Outer atmosphere — 3-layer glow */}
        <circle cx="44" cy="15" r="10" fill="rgba(245,158,11,0.06)" filter="url(#lg-strong)" />
        <circle cx="44" cy="15" r="7" fill="rgba(245,158,11,0.1)" filter="url(#lg-med)" />
        {/* Planet body */}
        <circle cx="44" cy="15" r="5" fill="url(#lg-planet)" />
        {/* Specular highlight */}
        <ellipse cx="42" cy="13.5" rx="2.2" ry="1.3" fill="rgba(255,255,255,0.45)"
          transform="rotate(-35 42 13.5)" />
        {/* Secondary highlight — small spark */}
        <circle cx="41" cy="12.5" r="0.8" fill="rgba(255,255,255,0.7)" />
        {/* Crescent shadow */}
        <path d="M 47 17.5 A 4 4 0 0 1 42 20 A 4.5 4.5 0 0 0 47.5 16.5 Z"
          fill="rgba(0,0,0,0.18)" />
        {/* Core glow */}
        <circle cx="44" cy="15" r="1.5" fill="rgba(245,158,11,0.5)" filter="url(#lg-soft)" />

        {/* ── SECONDARY PLANET — lower-left, blue ── */}
        <circle cx="11" cy="45" r="5" fill="rgba(59,130,246,0.08)" filter="url(#lg-med)" />
        <circle cx="11" cy="45" r="2.4" fill="url(#lg-planet2)" />
        <ellipse cx="10" cy="44.2" rx="1" ry="0.6" fill="rgba(255,255,255,0.45)"
          transform="rotate(-30 10 44.2)" />
        <circle cx="10.5" cy="43.8" r="0.4" fill="rgba(255,255,255,0.6)" />

        {/* ── TERTIARY PLANET — tiny, near top ── */}
        <circle cx="28" cy="4" r="1.4" fill="rgba(139,92,246,0.4)" filter="url(#lg-soft)" />

        {/* ── Quaternary micro-planet — bottom-right ── */}
        <circle cx="52" cy="58" r="1" fill="rgba(245,158,11,0.3)" filter="url(#lg-soft)" />

        {/* ── RULE SEPARATOR ── */}
        <line x1="70" y1="18" x2="70" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
        {/* Tiny dot on rule */}
        <circle cx="70" cy="34" r="1.2" fill="rgba(255,255,255,0.08)" />

        {/* ── WORDMARK ── */}

        {/* "ORBIT" — white, bold, tight tracking */}
        <text x="82" y="43"
          fontFamily="'Clash Display', sans-serif"
          fontWeight="600" fontSize="29" fill="#fff"
          letterSpacing="-0.2"
        >
          ORBIT
        </text>

        {/* "A" — amber, bold — the anchor/focus letter */}
        <text x="179" y="43"
          fontFamily="'Clash Display', sans-serif"
          fontWeight="700" fontSize="29" fill="#F59E0B"
          letterSpacing="-0.2"
        >
          A
        </text>

        {/* "N" — fading, lighter — suggests continuation */}
        <text x="208" y="43"
          fontFamily="'Clash Display', sans-serif"
          fontWeight="400" fontSize="29"
          fill="rgba(255,255,255,0.28)"
          letterSpacing="-0.2"
        >
          N
        </text>

        {/* Subtle underline beneath wordmark */}
        <line x1="82" y1="48" x2="245" y2="48" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />

        {/* ── TAGLINE (hero only) ── */}
        {isHero && (
          <>
            {/* Tagline text — spaced mono */}
            <text x="84" y="68"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="400" fontSize="6.5"
              fill="rgba(255,255,255,0.12)"
              letterSpacing="4"
            >
              ORBITAL · SCHEDULE · SYSTEM
            </text>
            {/* Bottom registration mark */}
            <line x1="82" y1="72" x2="310" y2="72" stroke="rgba(255,255,255,0.03)" strokeWidth="0.4" />
            {/* Corner registration at far right */}
            <path d="M 315 68 L 318 68 L 318 71" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" fill="none" />
          </>
        )}
      </svg>
    </div>
  );
}
