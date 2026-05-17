"use client";

interface LogoProps { variant?: "hero" | "nav"; }

export function OrbitanLogo({ variant = "hero" }: LogoProps) {
  const isHero = variant === "hero";
  return (
    <div className={isHero ? "l-logo-hero" : "l-logo-nav"} aria-label="OrbitAN" role="img">
      <svg viewBox="0 0 500 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="l-logo-svg" style={{ width: "100%", height: "auto" }}>
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

        {/* ── REGISTRATION GEOMETRY ── */}
        <line x1="100" y1="8" x2="100" y2="96" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
        <line x1="62" y1="52" x2="138" y2="52" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
        {/* Corner brackets */}
        <path d="M66 21 L66 12 L75 12" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none"/>
        <path d="M125 12 L134 12 L134 21" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none"/>
        <path d="M66 83 L66 92 L75 92" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none"/>
        <path d="M125 92 L134 92 L134 83" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7" fill="none"/>
        {/* Constructivist diagonals */}
        <line x1="66" y1="28" x2="84" y2="46" stroke="rgba(59,130,246,0.10)" strokeWidth="0.7"/>
        <line x1="116" y1="58" x2="134" y2="74" stroke="rgba(99,102,241,0.08)" strokeWidth="0.7"/>
        <line x1="70" y1="72" x2="88" y2="58" stroke="rgba(245,158,11,0.07)" strokeWidth="0.7"/>
        <line x1="68" y1="36" x2="134" y2="36" stroke="rgba(255,255,255,0.018)" strokeWidth="0.3"/>

        {/* ── ORBITAL RING SYSTEM ── */}
        <ellipse cx="100" cy="52" rx="30" ry="35" fill="none" stroke="url(#lg-ring)" strokeWidth="2.4" transform="rotate(-15 100 52)"/>
        <ellipse cx="100" cy="52" rx="21" ry="26" fill="none" stroke="rgba(99,102,241,0.20)" strokeWidth="0.8" strokeDasharray="9 11" transform="rotate(38 100 52)"/>
        <path d="M88 26 A32 37 0 0 1 110 19" fill="none" stroke="#F59E0B" strokeWidth="1.3" strokeLinecap="round" transform="rotate(-15 100 52)"/>
        <ellipse cx="100" cy="52" rx="10" ry="13" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="0.5" strokeDasharray="3 12" transform="rotate(-60 100 52)"/>

        {/* Hash marks */}
        <g transform="rotate(-15 100 52)" opacity="0.28">
          <line x1="70" y1="52" x2="66" y2="52" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="100" y1="17" x2="100" y2="13" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="130" y1="52" x2="134" y2="52" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="100" y1="87" x2="100" y2="91" stroke="#3B82F6" strokeWidth="1"/>
          <line x1="81" y1="26" x2="78" y2="24" stroke="#6366F1" strokeWidth="0.5"/>
          <line x1="119" y1="26" x2="122" y2="24" stroke="#6366F1" strokeWidth="0.5"/>
          <line x1="81" y1="78" x2="78" y2="80" stroke="#6366F1" strokeWidth="0.5"/>
          <line x1="119" y1="78" x2="122" y2="80" stroke="#6366F1" strokeWidth="0.5"/>
        </g>

        {/* ── PLANETS ── */}
        <circle cx="118" cy="27" r="13" fill="rgba(245,158,11,0.04)" filter="url(#lg-strong)"/>
        <circle cx="118" cy="27" r="8.5" fill="rgba(245,158,11,0.09)" filter="url(#lg-med)"/>
        <circle cx="118" cy="27" r="6" fill="url(#lg-p1)"/>
        <ellipse cx="115" cy="25" rx="2.6" ry="1.5" fill="rgba(255,255,255,0.52)" transform="rotate(-38 115 25)"/>
        <circle cx="114" cy="23.5" r="1.1" fill="rgba(255,255,255,0.78)"/>
        <path d="M121.5 30 A4.5 4.5 0 0 1 115.5 33 A5.2 5.2 0 0 0 122 28 Z" fill="rgba(0,0,0,0.22)"/>
        <circle cx="118" cy="27" r="1.9" fill="rgba(245,158,11,0.55)" filter="url(#lg-soft)"/>

        <circle cx="76" cy="68" r="6.5" fill="rgba(59,130,246,0.07)" filter="url(#lg-med)"/>
        <circle cx="76" cy="68" r="3" fill="url(#lg-p2)"/>
        <ellipse cx="74.8" cy="67" rx="1.3" ry="0.8" fill="rgba(255,255,255,0.52)" transform="rotate(-32 74.8 67)"/>
        <circle cx="74.4" cy="66.3" r="0.5" fill="rgba(255,255,255,0.75)"/>

        <circle cx="98" cy="11" r="1.8" fill="rgba(139,92,246,0.45)" filter="url(#lg-soft)"/>
        <circle cx="132" cy="82" r="1.3" fill="rgba(245,158,11,0.35)" filter="url(#lg-soft)"/>
        <circle cx="66" cy="40" r="1" fill="rgba(99,102,241,0.30)" filter="url(#lg-soft)"/>

        {/* ── SEPARATOR ── */}
        <line x1="150" y1="30" x2="150" y2="74" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
        <circle cx="150" cy="52" r="1.6" fill="rgba(255,255,255,0.11)"/>

        {/* ── WORDMARK — all shifted right to center with orbital mark ── */}
        <text x="166" y="64" fontFamily="'Clash Display', sans-serif" fontWeight="600" fontSize="38" fill="#fff" letterSpacing="-0.4">ORBIT</text>
        <text x="290" y="64" fontFamily="'Clash Display', sans-serif" fontWeight="700" fontSize="38" fill="#F59E0B" letterSpacing="-0.4">A</text>
        <text x="327" y="64" fontFamily="'Clash Display', sans-serif" fontWeight="400" fontSize="38" fill="rgba(255,255,255,0.24)" letterSpacing="-0.4">N</text>

        <line x1="166" y1="70" x2="382" y2="70" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
        <path d="M166 74 L177 74" stroke="rgba(59,130,246,0.15)" strokeWidth="0.6"/>

        {/* ── TAGLINE ── */}
        {isHero && (<>
          <text x="168" y="94" fontFamily="'JetBrains Mono', monospace" fontWeight="400" fontSize="7.8" fill="rgba(255,255,255,0.13)" letterSpacing="5.5">ORBITAL · SCHEDULE · SYSTEM</text>
          <line x1="166" y1="100" x2="442" y2="100" stroke="rgba(255,255,255,0.035)" strokeWidth="0.5"/>
        </>)}
      </svg>
    </div>
  );
}
