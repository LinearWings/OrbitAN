"use client";

interface LogoProps {
  variant?: "hero" | "nav";
}

export function OrbitanLogo({ variant = "hero" }: LogoProps) {
  const isHero = variant === "hero";

  return (
    <div
      className={isHero ? "l-logo-hero" : "l-logo-nav"}
      aria-label="OrbitAN"
      role="img"
    >
      <svg
        viewBox="0 0 340 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="l-logo-svg"
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          {/* Planet glow filter */}
          <filter id="lo-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
          <filter id="lo-glow-strong" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* ── Orbital "O" — the conceptual centerpiece ── */}

        {/* Outer orbit ring — blue, slightly tilted */}
        <ellipse
          cx="30" cy="34" rx="20" ry="24"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          transform="rotate(-15 30 34)"
        />

        {/* Inner dashed ring — subtle, counter-rotating */}
        <ellipse
          cx="30" cy="34" rx="13" ry="16"
          fill="none"
          stroke="rgba(59,130,246,0.3)"
          strokeWidth="0.8"
          strokeDasharray="5 7"
          transform="rotate(35 30 34)"
        />

        {/* Accent ring fragment — amber */}
        <path
          d="M 14 18 A 22 26 0 0 1 35 12"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform="rotate(-15 30 34)"
        />

        {/* Focal planet — amber dot in upper-right of ring */}
        <circle cx="42" cy="18" r="4.5" fill="#F59E0B" filter="url(#lo-glow)" />
        {/* Planet inner highlight */}
        <circle cx="40.8" cy="16.8" r="1.5" fill="rgba(255,255,255,0.4)" />

        {/* Tiny secondary planet — lower-left */}
        <circle cx="10" cy="42" r="2" fill="rgba(59,130,246,0.6)" filter="url(#lo-glow)" />

        {/* ── Wordmark ── */}

        {/* "RBIT" — solid white */}
        <text x="68" y="44" fontFamily="'Clash Display', sans-serif" fontWeight="600" fontSize="30" fill="#fff" letterSpacing="-0.5">
          RBIT
        </text>

        {/* "A" — amber accent — the anchor letter */}
        <text x="152" y="44" fontFamily="'Clash Display', sans-serif" fontWeight="600" fontSize="30" fill="#F59E0B" letterSpacing="-0.5">
          A
        </text>

        {/* "N" — fading to transparent — suggests continuation/infinity */}
        <text x="181" y="44" fontFamily="'Clash Display', sans-serif" fontWeight="500" fontSize="30" fill="rgba(255,255,255,0.35)" letterSpacing="-0.5">
          N
        </text>

        {/* ── Tagline (hero only) ── */}
        {isHero && (
          <text x="69" y="60" fontFamily="'JetBrains Mono', monospace" fontWeight="400" fontSize="6.5" fill="rgba(255,255,255,0.18)" letterSpacing="4">
            ORBITAL SCHEDULE SYSTEM
          </text>
        )}
      </svg>
    </div>
  );
}
