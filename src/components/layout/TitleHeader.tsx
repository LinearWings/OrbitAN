"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { OrbitanLogo } from "@/components/landing/OrbitanLogo";

export default function TitleHeader({ onOpenDocs }: { onOpenDocs?: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className={`absolute ${isMobile ? 'top-3 left-4' : 'top-8 left-8'} z-40 select-none`}>
      <div className="flex items-center gap-3">
        <div style={{ width: isMobile ? "150px" : "280px" }}>
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

    </div>
  );
}
