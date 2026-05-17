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
        viewBox="0 0 360 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="l-logo-svg"
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          {/* Planar glow — soft diffusion */}
          <filter id="lg-soft" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <filter id="lg-strong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          {/* Planet surface gradient */}
          <radialGradient id="lg-planet" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </radialGradient>
          {/* Ring gradient — blue to transparent */}
          <linearGradient id="lg-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="40%" stopColor="#6366F1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* ── Constructivist accent — thin structural lines ── */}
        {/* Horizontal registration mark */}
        <line x1="8" y1="34" x2="52" y2="34" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        {/* Diagonal engineering line — upper-left */}
        <line x1="2" y1="10" x2="18" y2="26" stroke="rgba(59,130,246,0.12)" strokeWidth="0.6" />
        {/* Diagonal engineering line — lower */}
        <line x1="10" y1="56" x2="32" y2="40" stroke="rgba(99,102,241,0.10)" strokeWidth="0.5" />

        {/* ── ORBITAL RING SYSTEM ── */}

        {/* Ring 1 — Primary: blue, thick, tilted -15° */}
        <ellipse
          cx="30" cy="34" rx="22" ry="26"
          fill="none"
          stroke="url(#lg-ring)"
          strokeWidth="1.8"
          transform="rotate(-15 30 34)"
        />

        {/* Ring 2 — Secondary: violet, thinner, counter-rotated +35°, dashed */}
        <ellipse
          cx="30" cy="34" rx="15" ry="18"
          fill="none"
          stroke="rgba(99,102,241,0.25)"
          strokeWidth="0.7"
          strokeDasharray="6 8"
          transform="rotate(38 30 34)"
        />

        {/* Ring 3 — Accent: amber fragment arc, only top-right quadrant */}
        <path
          d="M 18 16 A 24 28 0 0 1 36 10"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1"
          strokeLinecap="round"
          transform="rotate(-15 30 34)"
        />

        {/* Tiny orbital hash marks on primary ring */}
        <g transform="rotate(-15 30 34)" opacity="0.3">
          <line x1="8" y1="34" x2="8" y2="38" stroke="#3B82F6" strokeWidth="0.8" />
          <line x1="30" y1="8" x2="30" y2="4" stroke="#3B82F6" strokeWidth="0.8" />
          <line x1="52" y1="34" x2="52" y2="30" stroke="#3B82F6" strokeWidth="0.8" />
          <line x1="30" y1="60" x2="30" y2="64" stroke="#3B82F6" strokeWidth="0.8" />
        </g>

        {/* ── FOCAL PLANET (upper-right of ring) ── */}
        {/* Outer atmosphere glow */}
        <circle cx="44" cy="16" r="8" fill="rgba(245,158,11,0.12)" filter="url(#lg-strong)" />
        {/* Planet body */}
        <circle cx="44" cy="16" r="4.8" fill="url(#lg-planet)" />
        {/* Specular highlight — upper-left of planet */}
        <ellipse cx="42.5" cy="14.5" rx="2" ry="1.2" fill="rgba(255,255,255,0.5)" transform="rotate(-30 42.5 14.5)" />
        {/* Crescent shadow — lower-right of planet */}
        <path d="M 46.5 18 A 3.5 3.5 0 0 1 43 20 A 4.2 4.2 0 0 0 47 17 Z" fill="rgba(0,0,0,0.2)" />
        {/* Sharp core glow */}
        <circle cx="44" cy="16" r="1.8" fill="rgba(245,158,11,0.5)" filter="url(#lg-soft)" />

        {/* ── SECONDARY PLANET (lower-left of ring) ── */}
        <circle cx="12" cy="44" r="4" fill="rgba(59,130,246,0.12)" filter="url(#lg-strong)" />
        <circle cx="12" cy="44" r="2.2" fill="#3B82F6" />
        <circle cx="11.5" cy="43.5" r="0.8" fill="rgba(255,255,255,0.5)" />

        {/* ── TERTIARY PLANET (tiny, near top) ── */}
        <circle cx="28" cy="6" r="1.2" fill="rgba(99,102,241,0.5)" filter="url(#lg-soft)" />

        {/* ── WORDMARK ── */}

        {/* Thin rule line separating mark from text */}
        <line x1="68" y1="20" x2="68" y2="48" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

        {/* "ORBIT" — solid white, tight tracking */}
        <text
          x="78" y="43"
          fontFamily="'Clash Display', sans-serif"
          fontWeight="600"
          fontSize="28"
          fill="#fff"
          letterSpacing="-0.3"
        >
          ORBIT
        </text>

        {/* "A" — amber, bold — the focal letter */}
        <text
          x="172" y="43"
          fontFamily="'Clash Display', sans-serif"
          fontWeight="700"
          fontSize="28"
          fill="#F59E0B"
          letterSpacing="-0.3"
        >
          A
        </text>

        {/* "N" — fading out, lighter weight */}
        <text
          x="201" y="43"
          fontFamily="'Clash Display', sans-serif"
          fontWeight="400"
          fontSize="28"
          fill="rgba(255,255,255,0.3)"
          letterSpacing="-0.3"
        >
          N
        </text>

        {/* ── Tagline (hero only) — with dot dividers ── */}
        {isHero && (
          <>
            <text
              x="80" y="62"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="400"
              fontSize="6.2"
              fill="rgba(255,255,255,0.14)"
              letterSpacing="3.5"
            >
              ORBITAL · SCHEDULE · SYSTEM
            </text>
            {/* Bottom registration line */}
            <line x1="78" y1="66" x2="310" y2="66" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
          </>
        )}
      </svg>
    </div>
  );
}
