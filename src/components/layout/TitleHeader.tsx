"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { OrbitanLogo } from "@/components/landing/OrbitanLogo";

export default function TitleHeader({ onOpenDocs }: { onOpenDocs?: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className={`absolute ${isMobile ? 'top-1 left-4' : 'top-4 left-8'} z-40 select-none`}>
      <div className="flex items-center gap-3">
        <OrbitanLogo variant="nav" />
      </div>
    </div>
  );
}
