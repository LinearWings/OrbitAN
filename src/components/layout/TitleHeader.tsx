"use client";

import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { OrbitanLogo } from "@/components/landing/OrbitanLogo";

export default function TitleHeader({ onOpenDocs }: { onOpenDocs?: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className={`absolute ${isMobile ? 'top-1 left-4' : 'top-4 left-8'} z-40 select-none flex items-center gap-3`}>
      <Link
        href="/"
        className="flex items-center gap-2 cursor-pointer group"
        aria-label="Back to home"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/20 group-hover:text-white/50 transition-colors">
          <polyline points="8,2 4,6 8,10" />
        </svg>
        <OrbitanLogo variant="nav" />
      </Link>
      {onOpenDocs && (
        <button
          onClick={onOpenDocs}
          className="text-[0.6rem] font-mono tracking-[0.05em] text-white/25 hover:text-white/50 transition-colors px-2 py-1 rounded border border-white/[0.06] hover:border-white/[0.12]"
          aria-label="Open documentation"
        >
          Docs
        </button>
      )}
    </div>
  );
}
