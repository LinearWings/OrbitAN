"use client";

import { CloseIcon } from "@/components/ui/Icons";
import DocsPage from "./DocsPage";

interface DocsOverlayProps {
  onClose: () => void;
}

export default function DocsOverlay({ onClose }: DocsOverlayProps) {
  return (
    <div className="fixed inset-0 z-[80] flex flex-col">
      <div
        className="absolute inset-0 backdrop-blur-[20px] backdrop-saturate-[180%]"
        style={{
          background: `
            radial-gradient(circle 50% at 10% 80%, rgba(234,179,8,0.06) 0%, transparent 55%),
            radial-gradient(circle 30% at 30% 65%, rgba(37,99,235,0.04) 0%, transparent 50%),
            rgba(17,17,17,0.88)
          `,
        }}
      />
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-8 py-4 shrink-0">
          <h2 className="font-clash text-2xl font-bold tracking-[-0.02em] text-white">
            知识百科
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/70 text-sm"
          >
            <CloseIcon size={14} /> 关闭
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <DocsPage />
        </div>
      </div>
    </div>
  );
}
