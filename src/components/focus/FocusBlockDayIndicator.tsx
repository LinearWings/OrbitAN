"use client";

import React from "react";
import type { FocusBlock, FocusMethodId } from "@/types/focus";
import { FOCUS_METHOD_COLORS } from "@/data/focus-defaults";
import { METHODOLOGIES } from "@/data/defaults";

interface FocusBlockDayIndicatorProps {
  block: FocusBlock;
  position: { left: number; top: number };
  onOpenMethodology: (methodId: FocusMethodId) => void;
}

export default function FocusBlockDayIndicator({ block, position, onOpenMethodology }: FocusBlockDayIndicatorProps) {
  const color = FOCUS_METHOD_COLORS[block.method];
  const iconDef = METHODOLOGIES.find((m) => m.id === block.method);
  const icon = iconDef ? iconDef.icon.replace(/currentColor/g, color) : "";

  return (
    <div
      data-focus-block={block.id}
      className="absolute z-20"
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
      }}
    >
      <button
        className="flex items-center justify-center w-[26px] h-[26px] rounded-full transition-all hover:scale-110"
        style={{
          background: `rgba(10,10,15,0.9)`,
          border: `1px solid ${color}50`,
          boxShadow: `0 0 12px ${color}30, 0 0 4px ${color}20`,
          color,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpenMethodology(block.method);
        }}
        title={block.name}
      >
        <span
          className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      </button>
    </div>
  );
}
