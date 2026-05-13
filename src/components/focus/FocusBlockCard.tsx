"use client";

import React, { useMemo, useEffect, useState } from "react";
import type { FocusBlock } from "@/types/focus";
import { FOCUS_METHOD_COLORS, FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import { METHODOLOGIES } from "@/data/defaults";
import { timeToMinutes } from "@/utils/time";
import "./focus-animations.css";

interface FocusBlockCardProps {
  block: FocusBlock;
  isOrbitMode: boolean;
  isSelected: boolean;
  columnHourStart?: number;
  columnHourEnd?: number;
  revealIndex?: number;
  onClick?: () => void;
  zoomPx?: number;
}

export default function FocusBlockCard({
  block,
  isOrbitMode,
  isSelected,
  columnHourStart = 0,
  columnHourEnd = 24,
  revealIndex = 0,
  onClick,
  zoomPx,
}: FocusBlockCardProps) {
  const methodColor = FOCUS_METHOD_COLORS[block.method];
  const label = FOCUS_METHOD_LABELS[block.method];
  const [mounted, setMounted] = useState(false);

  // Staggered reveal: each block appears with a short delay for organic feel
  useEffect(() => {
    if (isOrbitMode) {
      const delay = revealIndex * 40;
      const t = setTimeout(() => setMounted(true), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setMounted(false), 80);
      return () => clearTimeout(t);
    }
  }, [isOrbitMode, revealIndex]);

  const pxStyle = useMemo(() => {
    if (!zoomPx) return null;
    const startMin = timeToMinutes(block.startTime);
    let endMin = timeToMinutes(block.endTime);
    if (endMin <= startMin) endMin += 1440;
    const dur = endMin - startMin;
    return {
      top: (startMin / 60) * zoomPx,
      height: Math.max(3, (dur / 60) * zoomPx),
    };
  }, [block.startTime, block.endTime, zoomPx]);

  const topPct = useMemo(() => {
    const start = timeToMinutes(block.startTime);
    const rangeTotal = (columnHourEnd - columnHourStart) * 60;
    return ((start - columnHourStart * 60) / rangeTotal) * 100;
  }, [block.startTime, columnHourStart, columnHourEnd]);

  const heightPct = useMemo(() => {
    const start = timeToMinutes(block.startTime);
    const end = timeToMinutes(block.endTime);
    const dur = end >= start ? end - start : end + 24 * 60 - start;
    const rangeTotal = (columnHourEnd - columnHourStart) * 60;
    return Math.max(2, (dur / rangeTotal) * 100);
  }, [block.startTime, block.endTime, columnHourStart, columnHourEnd]);

  const displayTop = pxStyle ? `${pxStyle.top}px` : `${topPct}%`;
  const displayHeight = pxStyle ? `${pxStyle.height}px` : `${heightPct}%`;

  const methodIconSvg = useMemo(() => {
    const m = METHODOLOGIES.find(m => m.id === block.method);
    return m ? m.icon.replace(/currentColor/g, methodColor) : null;
  }, [block.method, methodColor]);

  const { r, g, b } = useMemo(
    () => ({
      r: parseInt(methodColor.slice(1, 3), 16),
      g: parseInt(methodColor.slice(3, 5), 16),
      b: parseInt(methodColor.slice(5, 7), 16),
    }),
    [methodColor],
  );

  const isWeekMode = !!pxStyle;

  return (
    <>
      {/* Ghost layer — always rendered, cross-fades out when liquid appears */}
      <div
        className="focus-block-ghost absolute left-0.5 right-0.5 rounded-[3px]"
        style={{
          top: displayTop,
          height: displayHeight,
          opacity: mounted ? 0 : 0.1,
          border: `1px dashed ${methodColor}30`,
          boxShadow: `0 0 6px ${methodColor}10`,
          background: "transparent",
          pointerEvents: "none",
          transition: "opacity 0.45s ease",
        }}
      />

      {/* Liquid glass layer — fades in with staggered reveal + liquid-reveal keyframe */}
      <div
        className={`focus-block-liquid absolute left-0.5 right-0.5 transition-transform duration-200 hover:scale-[1.03] ${
          mounted ? "liquid-reveal" : ""
        }`}
        data-focus-block={block.id}
        style={{
          top: displayTop,
          height: displayHeight,
          opacity: mounted ? 1 : 0,
          pointerEvents: mounted ? "auto" : "none",
          cursor: "pointer",
          background: isWeekMode ? `rgba(${r},${g},${b},0.05)` : `rgba(${r},${g},${b},0.12)`,
          borderRadius: isWeekMode ? 10 : 5,
          border: isWeekMode
            ? `1px solid ${methodColor}20`
            : undefined,
          borderTop: isWeekMode ? `1.5px solid ${methodColor}50` : `3px solid ${methodColor}`,
          borderLeft: isWeekMode ? undefined : "1px solid rgba(255,255,255,0.08)",
          borderRight: isWeekMode ? undefined : "1px solid rgba(255,255,255,0.04)",
          borderBottom: isWeekMode ? undefined : "1px solid rgba(255,255,255,0.04)",
          boxShadow: isWeekMode
            ? (isSelected
                ? `0 0 32px ${methodColor}35, 0 0 12px ${methodColor}20, inset 0 0 16px ${methodColor}10`
                : `0 0 20px ${methodColor}15, 0 0 6px ${methodColor}08, inset 0 0 6px ${methodColor}06`)
            : (isSelected
                ? `0 0 24px ${methodColor}35, 0 0 8px ${methodColor}20, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(255,255,255,0.03)`
                : `0 0 14px ${methodColor}18, inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.02)`),
          zIndex: isSelected ? 25 : 10,
          transition: "opacity 0.35s ease, box-shadow 0.4s ease, border-color 0.3s ease",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (mounted) onClick?.();
        }}
      >
        {isWeekMode ? (
          /* Week view: SVG icon only, no text */
          pxStyle.height > 4 && methodIconSvg && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 3 }}
            >
              <span
                className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full"
                style={{
                  color: methodColor,
                  filter: `drop-shadow(0 0 6px ${methodColor}60)`,
                  opacity: 0.85,
                }}
                dangerouslySetInnerHTML={{ __html: methodIconSvg }}
              />
            </div>
          )
        ) : (
          /* Day view / legacy: text labels */
          (heightPct > 2.5) && (
            <div
              className="absolute inset-0 flex flex-col items-start justify-center px-2 overflow-hidden pointer-events-none"
              style={{ zIndex: 3 }}
            >
              <span
                className="text-[0.5rem] font-bold tracking-wide leading-tight truncate w-full"
                style={{ color: methodColor }}
              >
                {label.zh}
              </span>
              {heightPct > 5 && (
                <span className="text-[0.45rem] text-white/60 leading-tight truncate w-full">
                  {block.name}
                </span>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}
