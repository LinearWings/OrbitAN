"use client";

import React from "react";
import { FOCUS_METHOD_COLORS, FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import { METHODOLOGIES } from "@/data/defaults";
import type { FocusMethodId } from "@/types/focus";

interface MethodPickerPopupProps {
  x: number;
  y: number;
  onSelect: (method: FocusMethodId) => void;
  onClose: () => void;
}

export default function MethodPickerPopup({ x, y, onSelect, onClose }: MethodPickerPopupProps) {
  return (
    <>
      <div className="fixed inset-0 z-[55]" onClick={onClose} />
      <div
        className="fixed z-[60] rounded-xl p-3"
        style={{
          left: Math.min(x, window.innerWidth - 240),
          top: Math.min(y, window.innerHeight - 100),
          background: "rgba(10,10,15,0.94)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="text-[0.55rem] text-white/30 mb-2">选择方法论</div>
        <div className="flex gap-1.5">
          {METHODOLOGIES.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id as FocusMethodId)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: `${FOCUS_METHOD_COLORS[m.id]}20`,
                border: `1px solid ${FOCUS_METHOD_COLORS[m.id]}30`,
              }}
              title={FOCUS_METHOD_LABELS[m.id].zh}
            >
              <span
                className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                style={{ color: FOCUS_METHOD_COLORS[m.id] }}
                dangerouslySetInnerHTML={{ __html: m.icon }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
