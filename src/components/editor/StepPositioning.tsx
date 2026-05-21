"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { timeToMinutes } from "@/utils/time";
import { addMinutes, minutesToTime } from "@/utils/orbit-clock-renderer";
import drawOrbitClock from "@/utils/orbit-clock-renderer";
import { uid } from "@/utils/uid";

export const DURATION_PRESETS = [
  { label: "15分", minutes: 15 },
  { label: "30分", minutes: 30 },
  { label: "1h", minutes: 60 },
  { label: "1.5h", minutes: 90 },
  { label: "2h", minutes: 120 },
  { label: "3h", minutes: 180 },
] as const;

export const MAX_VISIBLE_DURATION = 240;

// ─────────────────────────────────────────────
// Launch Arrow SVG Button
// ─────────────────────────────────────────────

function LaunchArrowSVG({ typeColor }: { typeColor: string }) {
  const id = useMemo(() => `launch-grad-${uid()}`, []);
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:scale-110"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="48" x2="0" y2="0">
          <stop offset="0%" stopColor={typeColor} stopOpacity="0.4" />
          <stop offset="50%" stopColor={typeColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <filter id="arrow-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="24"
        cy="38"
        r="7"
        stroke={typeColor}
        strokeWidth="1.2"
        opacity="0.6"
        fill="none"
      />

      <circle
        cx="24"
        cy="38"
        r="7"
        stroke={typeColor}
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
        strokeDasharray="3 3"
      />

      {/* Vertical guidance line through ring */}
      <line
        x1="24"
        y1="31"
        x2="24"
        y2="40"
        stroke={typeColor}
        strokeWidth="0.8"
        opacity="0.35"
      />

      {/* Thruster glow at base */}
      <ellipse
        cx="24"
        cy="40"
        rx="3"
        ry="2"
        fill={typeColor}
        opacity="0.3"
      >
        <animate
          attributeName="ry"
          values="2;3;2"
          dur="1.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.15;0.3"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Arrow body / rocket shape */}
      <path
        d="M24 6 L17 18 L20.5 18 L20.5 30 L27.5 30 L27.5 18 L31 18 Z"
        fill={`url(#${id})`}
        filter="url(#arrow-glow)"
        style={{ transition: "fill 0.3s" }}
      />

      {/* Arrow tip accent line */}
      <line
        x1="24"
        y1="6"
        x2="24"
        y2="14"
        stroke="white"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Step 2: Positioning
// ─────────────────────────────────────────────

export function StepPositioning({
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  name,
  note,
  setNote,
  typeColor,
  typeLabel,
  duration,
  isEditing,
  clickPhase,
  setClickPhase,
  onPrev,
  onLaunch,
  transitionClass,
  repeat,
  setRepeat,
  location,
  setLocation,
}: {
  startTime: string;
  endTime: string;
  setStartTime: (v: string) => void;
  setEndTime: (v: string) => void;
  name: string;
  note: string;
  setNote: (v: string) => void;
  typeColor: string;
  typeLabel: { zh: string; en: string };
  duration: number;
  isEditing: boolean;
  clickPhase: "start" | "end" | null;
  setClickPhase: (v: "start" | "end" | null) => void;
  onPrev: () => void;
  onLaunch: () => void;
  transitionClass: string;
  repeat?: string;
  setRepeat?: (v: "none" | "daily" | "weekly" | "weekdays") => void;
  location?: string;
  setLocation?: (v: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverAngle, setHoverAngle] = useState<number | null>(null);

  const durationLabel =
    duration >= 60
      ? `${Math.floor(duration / 60)}h${duration % 60 > 0 ? ` ${duration % 60}m` : ""}`
      : `${duration}m`;
  const barPct = Math.min(100, (duration / MAX_VISIBLE_DURATION) * 100);

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      if (
        canvas.width !== Math.floor(rect.width * dpr) ||
        canvas.height !== Math.floor(rect.height * dpr)
      ) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      drawOrbitClock(
        ctx,
        rect.width,
        rect.height,
        rect.width / 2,
        rect.height / 2,
        startTime,
        endTime,
        typeColor,
        hoverAngle,
        clickPhase,
      );
    };

    render();
  }, [startTime, endTime, typeColor, hoverAngle, clickPhase]);

  // Handle canvas click — hybrid click-twice + endpoint nudge
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const dx = mx - cx;
      const dy = my - cy;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      const angle = Math.atan2(dy, dx) + Math.PI / 2;
      const normalizedAngle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

      // Convert angle to 24h time (no offset — timeToAngle24h maps 00:00→0)
      const totalMinutes = Math.round(
        (normalizedAngle / (Math.PI * 2)) * 24 * 60,
      ) % 1440;
      const clickedTime = minutesToTime(totalMinutes);

      // If in click-twice mode (picking end), second click completes it
      if (clickPhase === "end") {
        const startMin = timeToMinutes(startTime);
        const clickMin = timeToMinutes(clickedTime);
        let endMin = clickMin;
        if (endMin <= startMin) endMin += 1440;
        if (endMin - startMin < 15) endMin = startMin + 15;
        setEndTime(minutesToTime(endMin % 1440));
        setClickPhase(null);
        return;
      }

      // Not in click-twice mode: check if clicking near an endpoint for fine-tuning
      const startMin = timeToMinutes(startTime);
      const endMin = timeToMinutes(endTime);
      const clickMin = timeToMinutes(clickedTime);

      // Distance in minutes on the 24h dial (45min threshold ≈ 11° on clock)
      const distToStart = Math.min(
        Math.abs(clickMin - startMin),
        Math.abs(clickMin - startMin + 1440),
        Math.abs(clickMin - startMin - 1440),
      );
      const distToEnd = Math.min(
        Math.abs(clickMin - endMin),
        Math.abs(clickMin - endMin + 1440),
        Math.abs(clickMin - endMin - 1440),
      );
      const threshold = 45;

      if (distToStart <= threshold && distToStart <= distToEnd) {
        // Nudge start only; maintain duration by shifting end
        const duration = endMin >= startMin ? endMin - startMin : endMin + 1440 - startMin;
        let newEnd = clickMin + duration;
        if (newEnd >= clickMin + 1440) newEnd -= 1440;
        setStartTime(clickedTime);
        setEndTime(minutesToTime(newEnd));
      } else if (distToEnd <= threshold) {
        // Nudge end only
        const newEnd = clickMin <= startMin ? clickMin + 1440 : clickMin;
        setEndTime(minutesToTime(Math.max(newEnd, startMin + 15) % 1440));
      } else {
        // Clicked far from both endpoints → start click-twice flow
        setStartTime(clickedTime);
        setClickPhase("end");
      }
    },
    [clickPhase, startTime, endTime, setStartTime, setEndTime, setClickPhase],
  );

  // Canvas hover tracking
  const handleCanvasMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxR = Math.min(rect.width, rect.height) * 0.38;
      const outerR = maxR * 0.66 - 2;

      // Only track hover within orbit ring area
      const innerR = maxR * 0.62 + 14;
      if (dist >= innerR && dist <= outerR * 1.1) {
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        setHoverAngle(
          ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2),
        );
      } else {
        setHoverAngle(null);
      }
    },
    [],
  );

  const handleCanvasLeave = useCallback(() => {
    setHoverAngle(null);
  }, []);

  // Duration presets
  const applyDurationPreset = useCallback(
    (minutes: number) => {
      setEndTime(addMinutes(startTime, minutes));
    },
    [startTime, setEndTime],
  );

  return (
    <div
      className={`absolute inset-0 flex flex-col items-start justify-start px-8 py-8 overflow-y-auto ${transitionClass}`}
    >
      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
        {/* Title */}
        <div className="text-center">
          <div
            className="text-[0.6rem] font-mono tracking-[0.2em] uppercase mb-2"
            style={{ color: `${typeColor}99` }}
          >
            Orbit Launch Wizard · Step 02
          </div>
          <h2 className="text-white/70 text-sm font-mono font-light">
            在时钟上定位你的任务
          </h2>
        </div>

        {/* Click phase hint */}
        <div
          className="text-[0.55rem] font-mono tracking-wider transition-all duration-300"
          style={{
            color: clickPhase === "end"
              ? `${typeColor}bb`
              : `${typeColor}99`,
          }}
        >
          {clickPhase === "end"
            ? "⦿ 点击时钟完成终点 · 移动鼠标预览弧线"
            : clickPhase === "start"
              ? "⦿ 点击时钟选择新起点"
              : "⦿ 点击端点微调 · 点击空白区重新选择"}
        </div>

        {/* Canvas container */}
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ maxWidth: 440, aspectRatio: "1/1" }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-2xl cursor-pointer"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
            onMouseLeave={handleCanvasLeave}
            style={{
              border: `1px solid ${typeColor}15`,
              boxShadow: `0 0 40px ${typeColor}08, inset 0 0 40px ${typeColor}05`,
            }}
          />
        </div>

        {/* Time display */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-[0.55rem] text-white/30 font-mono">
              开始
            </span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-20 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-1.5 text-sm text-white/80 outline-none transition-all duration-200 focus:border-white/20 text-center"
              style={{
                colorScheme: "dark",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
              }}
            />
          </div>

          <div
            className="w-6 h-[1px]"
            style={{ background: `linear-gradient(90deg, ${typeColor}80, ${typeColor}20)` }}
          />

          <div className="flex items-center gap-2">
            <span className="text-[0.55rem] text-white/30 font-mono">
              结束
            </span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-20 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-1.5 text-sm text-white/80 outline-none transition-all duration-200 focus:border-white/20 text-center"
              style={{
                colorScheme: "dark",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
              }}
            />
          </div>

          <div
            className="px-2.5 py-1 rounded-full text-[0.6rem] font-mono"
            style={{
              background: `${typeColor}15`,
              color: typeColor,
              border: `1px solid ${typeColor}25`,
            }}
          >
            {durationLabel}
          </div>
        </div>

        {/* Duration presets */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="text-[0.5rem] text-white/20 font-mono mr-1 uppercase tracking-wider">
            快速:
          </span>
          {DURATION_PRESETS.map((p) => {
            const isActive = duration === p.minutes;
            return (
              <button
                key={p.minutes}
                type="button"
                onClick={() => applyDurationPreset(p.minutes)}
                className="px-3 py-1.5 rounded-lg text-[0.6rem] font-mono transition-all duration-200"
                style={{
                  background: isActive
                    ? `${typeColor}20`
                    : "rgba(255,255,255,0.02)",
                  color: isActive
                    ? typeColor
                    : "rgba(255,255,255,0.3)",
                  border: `1px solid ${
                    isActive
                      ? `${typeColor}40`
                      : "rgba(255,255,255,0.05)"
                  }`,
                  boxShadow: isActive
                    ? `0 0 12px ${typeColor}20`
                    : "none",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* ── Summary card ── */}
        <div
          className="relative w-full rounded-2xl overflow-hidden mt-2"
          style={{
            background: `linear-gradient(135deg, ${typeColor}10 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${typeColor}20`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 60px ${typeColor}08`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${typeColor}20 0%, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${typeColor}10 0%, transparent 70%)` }}
          />

          <div className="relative p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div
                className="text-base font-semibold tracking-tight truncate"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  color: "#FFFFFF",
                  textShadow: `0 0 20px ${typeColor}20`,
                }}
              >
                {name || "未命名任务"}
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
                style={{ background: `${typeColor}15`, border: `1px solid ${typeColor}25` }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: typeColor, boxShadow: `0 0 6px ${typeColor}80` }}
                />
                <span className="text-xs font-medium" style={{ color: typeColor }}>
                  {typeLabel.zh}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[0.55rem] text-white/25 font-mono tracking-wide uppercase">时长</span>
                <span className="text-[0.6rem] font-mono px-2 py-0.5 rounded-full" style={{ color: typeColor, background: `${typeColor}15` }}>
                  {durationLabel}
                </span>
              </div>
              <div className="relative h-[3px] w-full rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${typeColor}60, ${typeColor})`,
                    boxShadow: `0 0 8px ${typeColor}40`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[0.55rem] text-white/25 font-mono tracking-wide uppercase">备注</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={1}
                placeholder="添加备注…（可选）"
                className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-2 text-sm text-white/60 placeholder:text-white/12 outline-none transition-all duration-200 focus:border-white/15 resize-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Location */}
            {setLocation && (
              <div className="space-y-1">
                <label className="block text-[0.55rem] text-white/25 font-mono tracking-wide uppercase">地点</label>
                <input
                  value={location ?? ""}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="地点（可选）"
                  className="w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-2 text-sm text-white/60 placeholder:text-white/12 outline-none transition-all duration-200 focus:border-white/15"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            )}

            {/* Repeat */}
            {setRepeat && (
              <div className="space-y-1">
                <label className="block text-[0.55rem] text-white/25 font-mono tracking-wide uppercase">重复</label>
                <div className="flex items-center gap-1.5">
                  {(["none", "daily", "weekly", "weekdays"] as const).map((r) => {
                    const labels: Record<string, string> = { none: "不重复", daily: "每天", weekly: "每周", weekdays: "工作日" };
                    const sel = (repeat ?? "none") === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRepeat(r)}
                        className="px-2.5 py-1 rounded-full text-[0.6rem] font-medium transition-all duration-200"
                        style={{
                          background: sel ? `${typeColor}20` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${sel ? `${typeColor}40` : "rgba(255,255,255,0.06)"}`,
                          color: sel ? typeColor : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {labels[r]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation + Launch */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={onPrev}
            className="px-6 py-2.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'Clash Display', sans-serif",
            }}
          >
            ← 上一步
          </button>

          <button
            onClick={onLaunch}
            className="group relative flex items-center gap-3 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${typeColor}, ${typeColor}bb)`,
              color: "#000",
              boxShadow: `0 4px 24px ${typeColor}40`,
              fontFamily: "'Clash Display', sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse at center, ${typeColor}60 0%, transparent 70%)`,
                transform: "scale(1.5)",
              }}
            />

            <span className="relative z-10">
              {isEditing ? "更新任务" : "发射入轨"}
            </span>

            <span className="relative z-10">
              <LaunchArrowSVG typeColor={typeColor} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
