"use client";

import React from "react";
import { FOCUS_METHOD_COLORS, FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import { METHODOLOGIES } from "@/data/defaults";
import type { FocusMethodId } from "@/types/focus";

interface OrbitPlanPickerProps {
  x: number;
  y: number;
  currentMethod?: FocusMethodId;
  onSelect: (method: FocusMethodId | null) => void;
  onOpenMethodology: (methodId: FocusMethodId) => void;
  onClose: () => void;
}

const METHOD_IDS: FocusMethodId[] = ["gtd", "pomodoro", "pareto", "moffatt", "howell", "swot"];

export default function OrbitPlanPicker({
  x, y, currentMethod, onSelect, onOpenMethodology, onClose,
}: OrbitPlanPickerProps) {
  return (
    <>
      <div className="fixed inset-0 z-[70]" onClick={onClose} />
      <div
        className="fixed z-[75] rounded-xl p-4"
        style={{
          left: Math.min(x, window.innerWidth - 280),
          top: Math.min(y, window.innerHeight - 200),
          background: "rgba(10,10,15,0.96)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          width: 260,
        }}
      >
        <div className="text-[0.55rem] text-white/30 mb-3">选择方法论</div>
        <div className="grid grid-cols-3 gap-2">
          {METHOD_IDS.map((id) => {
            const color = FOCUS_METHOD_COLORS[id];
            const label = FOCUS_METHOD_LABELS[id];
            const sel = currentMethod === id;
            const iconDef = METHODOLOGIES.find((m) => m.id === id);
            const icon = iconDef ? iconDef.icon.replace(/currentColor/g, color) : "";
            return (
              <button
                key={id}
                onClick={() => onSelect(sel ? null : id)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-105"
                style={{
                  background: sel ? `${color}20` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${sel ? `${color}50` : "rgba(255,255,255,0.06)"}`,
                  boxShadow: sel ? `0 0 16px ${color}30` : "none",
                }}
              >
                <span
                  className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
                  style={{ color, opacity: sel ? 1 : 0.6 }}
                  dangerouslySetInnerHTML={{ __html: icon }}
                />
                <span
                  className="text-[0.55rem] font-medium leading-tight text-center"
                  style={{ color: sel ? color : "rgba(255,255,255,0.5)" }}
                >
                  {label.zh}
                </span>
              </button>
            );
          })}
        </div>
        {currentMethod && (
          <button
            onClick={() => onOpenMethodology(currentMethod)}
            className="w-full mt-3 py-2 rounded-lg text-[0.6rem] font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            打开{FOCUS_METHOD_LABELS[currentMethod].zh}面板
          </button>
        )}
      </div>
    </>
  );
}
