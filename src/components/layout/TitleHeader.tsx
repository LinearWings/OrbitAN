"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { OrbitanLogo } from "@/components/landing/OrbitanLogo";

export default function TitleHeader({ onOpenDocs }: { onOpenDocs?: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className={`absolute ${isMobile ? 'top-3 left-4' : 'top-8 left-8'} z-40 select-none`}>
      <div className="flex items-center gap-3">
        <div style={{ width: isMobile ? "120px" : "200px" }}>
          <OrbitanLogo variant="nav" />
        </div>

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
