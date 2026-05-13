"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function TitleHeader({ onOpenDocs }: { onOpenDocs?: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className={`absolute ${isMobile ? 'top-3 left-4' : 'top-8 left-8'} z-40 select-none`}>
      {/* OrbitAN wordmark */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {/* Orbital ring accent */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-white/20">
            <ellipse cx="14" cy="14" rx="12" ry="5" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
            <ellipse cx="14" cy="14" rx="12" ry="5" stroke="currentColor" strokeWidth="0.4" opacity="0.2"
              strokeDasharray="2 3" transform="rotate(15, 14, 14)" />
            <circle cx="14" cy="9" r="1.8" fill="#EAB308" opacity="0.7" />
          </svg>
        </div>
        <h1 className="flex items-baseline leading-none tracking-[-0.02em] font-bold"
          style={{ fontSize: isMobile ? "clamp(1.2rem, 4vw, 1.6rem)" : "clamp(1.6rem, 2.8vw, 2.8rem)" }}
        >
          <span className="font-clash text-white/90" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Orbit
          </span>
          <span
            className="font-clash ml-[0.02em]"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              background: "linear-gradient(135deg, #EAB308 0%, #2563EB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AN
          </span>
        </h1>

        {!isMobile && onOpenDocs && (
          <button
            onClick={onOpenDocs}
            className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/35 hover:text-white/70 hover:border-white/20 transition-all text-[0.65rem] ml-1"
            title="知识百科"
          >
            ?
          </button>
        )}
      </div>

      {!isMobile && (
        /* Tagline */
        <p className="font-satoshi mt-2 text-[clamp(0.55rem,0.75vw,0.75rem)] font-light tracking-[0.12em] text-white/25 uppercase">
          A day is an orbit, focus is your gravity
        </p>
      )}

      {!isMobile && (
        /* Decorative divider */
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-[1px] w-12" style={{ background: "linear-gradient(to right, rgba(234,179,8,0.3), rgba(37,99,235,0.15))" }} />
          <div className="h-[1px] w-6" style={{ background: "linear-gradient(to right, rgba(37,99,235,0.15), transparent)" }} />
        </div>
      )}

    </div>
  );
}
