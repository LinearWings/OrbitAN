"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { initCanvas, renderClockCanvas, drawCometTrail, drawCometLabel } from "./orbital-engine";
import { computeOverlapAwareCometPositions, cometMidpoint } from "@/utils/orbital";
import { useTasks } from "@/hooks/useTasks";
import { useSelectedTask } from "@/hooks/useSelectedTask";
import { timeToAngle } from "@/utils/time";
import { METHODOLOGIES } from "@/data/defaults";
import { FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import { sanitizeSvg } from "@/utils/colors";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

interface HybridClockProps {
  interactive?: boolean;
  clickPhase?: "idle" | "start" | "end";
  pendingStartTime?: string;
  pendingEndTime?: string;
  onTimeSelect?: (time: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLCanvasElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLCanvasElement>) => void;
  focusBlockArcs?: Array<{
    startAngle: number;
    endAngle: number;
    color: string;
    isActive: boolean;
    ringRadius?: number;
    methodId?: string;
    blockId?: string;
  }>;
  onFocusBlockClick?: (methodId: string) => void;
}

export default function HybridClock({
  interactive = false,
  clickPhase = "idle",
  pendingStartTime,
  pendingEndTime,
  onTimeSelect,
  onDragOver,
  onDrop,
  focusBlockArcs,
  onFocusBlockClick,
}: HybridClockProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof initCanvas> | null>(null);
  const { filteredTasks } = useTasks();
  const { selectedTaskId, selectTask } = useSelectedTask();
  const lang = useLanguage();
  const t = getT(lang);
  const hoveredTaskIdRef = useRef<string | null>(null);
  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Focus block hover state
  const [hoveredFocusBlock, setHoveredFocusBlock] = useState<{
    methodId: string; color: string; x: number; y: number;
  } | null>(null);
  const hoveredFocusRef = useRef<{ methodId: string; color: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const init = () => {
      const engine = initCanvas(canvas);
      if (engine) engineRef.current = engine;
    };
    init();
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 50);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Interactive marker renderer ──
  const drawInteractiveMarkers = useCallback((
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    maxRadius: number,
  ) => {
    const orbitR = maxRadius * 0.96;
    const arcR = orbitR;

    // timeToAngle maps HH:MM directly to canvas angle (0=right, π/2=bottom, π=left, 3π/2=top)
    const timeToCanvasAngle = (t: string) => timeToAngle(t);

    // Draw start marker
    if (pendingStartTime) {
      const sa = timeToCanvasAngle(pendingStartTime);
      const sx = cx + Math.cos(sa) * arcR;
      const sy = cy + Math.sin(sa) * arcR;
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.6)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw preview arc if end is set or phase is "end" with hover
      if (pendingEndTime) {
        let ea = timeToCanvasAngle(pendingEndTime);
        if (ea <= sa) ea += Math.PI * 2; // overnight wrap
        // Segmented trail
        ctx.save();
        for (let s = 0; s < 20; s++) {
          const t = s / 20;
          const a0 = sa + (ea - sa) * t;
          const a1 = sa + (ea - sa) * ((s + 1) / 20);
          const alpha = 0.3 + t * 0.45;
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.arc(cx, cy, arcR, a0, a1, false);
          ctx.stroke();
        }
        ctx.restore();

        // Glow
        ctx.save();
        ctx.shadowColor = "#2563EB";
        ctx.shadowBlur = 15;
        ctx.strokeStyle = "#2563EB";
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, arcR, sa, ea, false);
        ctx.stroke();
        ctx.restore();

        // End marker
        const ex = cx + Math.cos(ea) * arcR;
        const ey = cy + Math.sin(ea) * arcR;
        const grad = ctx.createRadialGradient(ex - 2, ey - 2, 1, ex, ey, 8);
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(0.3, "#2563EB");
        grad.addColorStop(0.7, "#2563EB99");
        grad.addColorStop(1, "#2563EB33");
        ctx.save();
        ctx.shadowColor = "#2563EB";
        ctx.shadowBlur = 14;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ex, ey, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (clickPhase === "end" && hoverTime) {
        // Preview arc from start to hover
        let ha = timeToCanvasAngle(hoverTime);
        if (ha <= sa) ha += Math.PI * 2; // overnight wrap
        ctx.save();
        for (let s = 0; s < 12; s++) {
          const t = s / 12;
          const a0 = sa + (ha - sa) * t;
          const a1 = sa + (ha - sa) * ((s + 1) / 12);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 + t * 0.15})`;
          ctx.lineWidth = 4;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(cx, cy, arcR, a0, a1, false);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
        // Preview end dot
        const hx = cx + Math.cos(ha) * arcR;
        const hy = cy + Math.sin(ha) * arcR;
        ctx.save();
        ctx.strokeStyle = "#2563EB";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(hx, hy, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#2563EB";
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

  }, [pendingStartTime, pendingEndTime, clickPhase, hoverTime]);

  // Refs to always access latest values in rAF loop (avoid stale closures)
  const drawMarkersRef = useRef(drawInteractiveMarkers);
  const focusBlockArcsRef = useRef(focusBlockArcs);
  useEffect(() => { drawMarkersRef.current = drawInteractiveMarkers; });
  useEffect(() => { focusBlockArcsRef.current = focusBlockArcs; });

  // Cache comet positions — only recompute when tasks change
  const cachedCometsRef = useRef<ReturnType<typeof computeOverlapAwareCometPositions>>([]);
  const cometsKeyRef = useRef<string>("");
  const cometsCxRef = useRef(0);
  const cometsCyRef = useRef(0);
  const cometsMaxRRef = useRef(0);

  // ── Animation loop ──
  useEffect(() => {
    let raf: number;

    const loop = () => {
      const engine = engineRef.current;
      if (!engine) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const { ctx, width, height, cx, cy, dpr } = engine;
      const time = performance.now();
      const maxRadius = Math.min(width, height) * 0.4;
      const dialRadius = maxRadius * 0.62;

      renderClockCanvas(ctx, width, height, cx, cy, new Date(), dpr);

      // Draw existing task comets (cached — only recompute when tasks change)
      const cometsKey = filteredTasks.map(t => `${t.id}:${t.startTime}:${t.endTime}:${t.type}`).join("|");
      if (cometsKey !== cometsKeyRef.current || cx !== cometsCxRef.current || cy !== cometsCyRef.current || maxRadius !== cometsMaxRRef.current) {
        cachedCometsRef.current = computeOverlapAwareCometPositions(filteredTasks, cx, cy, maxRadius);
        cometsKeyRef.current = cometsKey;
        cometsCxRef.current = cx;
        cometsCyRef.current = cy;
        cometsMaxRRef.current = maxRadius;
      }
      const comets = cachedCometsRef.current;

      for (const comet of comets) {
        const isSelected = comet.taskId === selectedTaskId;
        const isHovered = comet.taskId === hoveredTaskIdRef.current;
        drawCometTrail(ctx, comet, isSelected, isHovered, time, cx, cy, dialRadius);
      }

      for (const comet of comets) {
        const isSelected = comet.taskId === selectedTaskId;
        const isHovered = comet.taskId === hoveredTaskIdRef.current;
        drawCometLabel(ctx, comet, isSelected, isHovered);
      }

      // Draw focus block arcs — visible, glow on hover
      const arcs = focusBlockArcsRef.current;
      const hoveredFbId = hoveredFocusRef.current?.methodId;
      if (arcs && arcs.length > 0) {
        arcs.forEach((fb) => {
          const a0 = fb.startAngle;
          let a1 = fb.endAngle;
          if (a1 <= a0) a1 += Math.PI * 2;
          const arcR = maxRadius * (fb.ringRadius ?? 0.98);
          const isHovered = !!(hoveredFbId && fb.methodId === hoveredFbId);
          const color = fb.isActive ? fb.color : `${fb.color}30`;
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, arcR, a0, a1, false);
          ctx.strokeStyle = color;
          ctx.lineWidth = fb.isActive ? 2.5 : 1.5;
          ctx.lineCap = "round";
          ctx.shadowColor = isHovered ? fb.color : "transparent";
          ctx.shadowBlur = isHovered ? 16 : (fb.isActive ? 6 : 0);
          ctx.stroke();
          if (isHovered) {
            ctx.beginPath();
            ctx.arc(cx, cy, arcR, a0, a1, false);
            ctx.strokeStyle = `${fb.color}20`;
            ctx.lineWidth = 10;
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // Interactive markers
      if (interactive) {
        drawMarkersRef.current(ctx, cx, cy, maxRadius);
      }

      window.dispatchEvent(
        new CustomEvent("threeclock-planet-positions", {
          detail: comets.map((c) => {
            const mid = cometMidpoint(c.startAngle, c.endAngle, c.orbitRadius, cx, cy);
            return {
              taskId: c.taskId,
              screenX: mid.x,
              screenY: mid.y,
              radius: c.headRadius,
              color: c.color,
              isActive: false,
              headX: c.headX,
              headY: c.headY,
              tailX: c.tailX,
              tailY: c.tailY,
            };
          }),
        }),
      );

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [filteredTasks, selectedTaskId, interactive]);

  // ── Mouse handlers ──
  const getTimeFromMouse = useCallback((e: React.MouseEvent<HTMLCanvasElement>): { time: string; x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - rect.width / 2;
    const dy = my - rect.height / 2;

    // 24h dial convention: canvasAngle = (h/24)*2π - π/2  (00:00 at top, clockwise)
    // atan2(dy,dx) gives the canvas angle directly
    // Inverse: timeToAngle24h(T) = canvasAngle + π/2 → maps [00:00, 24:00)
    const canvasAngle = Math.atan2(dy, dx);
    const normalizedAngle = ((canvasAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    const totalMin = ((normalizedAngle + Math.PI / 2) / (Math.PI * 2)) * 1440;
    // Snap to nearest 15-minute mark
    const snappedMin = Math.round(totalMin / 15) * 15;
    const hh = Math.floor(snappedMin / 60) % 24;
    const mm = snappedMin % 60;
    return { time: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (interactive) {
      const result = getTimeFromMouse(e);
      if (result) {
        setHoverTime(result.time);
        setHoverPos({ x: result.x, y: result.y });
      }
      setHoveredFocusBlock(null);
      hoveredFocusRef.current = null;
      return;
    }
    // Non-interactive: hit-test against comets for hover
    const engine = engineRef.current;
    if (!engine) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const comets = cachedCometsRef.current;
    let found: string | null = null;
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      const dx = mx - c.headX;
      const dy = my - c.headY;
      if (dx * dx + dy * dy <= c.headRadius * c.headRadius) {
        found = c.taskId ?? null;
        break;
      }
    }
    hoveredTaskIdRef.current = found;

    // Focus block hover detection (work in CSS pixels from bounding rect)
    const arcs = focusBlockArcsRef.current;
    let fbResult: { methodId: string; color: string; x: number; y: number } | null = null;
    if (arcs && arcs.length > 0) {
      const cssW = rect.width;
      const cssH = rect.height;
      const cssCx = cssW / 2;
      const cssCy = cssH / 2;
      const cssMaxR = Math.min(cssW, cssH) * 0.4;
      const rx = mx - cssCx;
      const ry = my - cssCy;
      const mouseDist = Math.sqrt(rx * rx + ry * ry);
      const mouseAngle = Math.atan2(ry, rx);
      const normMouse = ((mouseAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      for (const fb of arcs) {
        if (!fb.isActive) continue;
        let ea = fb.endAngle;
        if (ea <= fb.startAngle) ea += Math.PI * 2;
        const cssArcR = cssMaxR * (fb.ringRadius ?? 0.98);
        if (Math.abs(mouseDist - cssArcR) > 12) continue;
        const normStart = ((fb.startAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const normEnd = ((ea % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const inAngle = normStart <= normEnd
          ? normMouse >= normStart && normMouse <= normEnd
          : normMouse >= normStart || normMouse <= normEnd;
        if (inAngle) {
          fbResult = {
            methodId: fb.methodId ?? "",
            color: fb.color,
            x: e.clientX,
            y: e.clientY,
          };
          break;
        }
      }
    }
    setHoveredFocusBlock(fbResult);
    hoveredFocusRef.current = fbResult ? { methodId: fbResult.methodId, color: fbResult.color } : null;
  }, [interactive, getTimeFromMouse]);

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null);
    setHoverPos(null);
    setHoveredFocusBlock(null);
    hoveredFocusRef.current = null;
    hoveredTaskIdRef.current = null;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (interactive) {
        const result = getTimeFromMouse(e);
        if (result && onTimeSelect) {
          onTimeSelect(result.time);
        }
        return;
      }
      // Non-interactive: select existing task or open methodology
      const engine = engineRef.current;
      if (!engine) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Focus block click → open methodology (check first so it takes priority)
      const fbHovered = hoveredFocusRef.current;
      if (fbHovered && onFocusBlockClick) {
        onFocusBlockClick(fbHovered.methodId);
        return;
      }

      const comets = cachedCometsRef.current;
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        const dx = mx - c.headX;
        const dy = my - c.headY;
        if (dx * dx + dy * dy <= c.headRadius * c.headRadius) {
          if (c.taskId) selectTask(c.taskId);
          return;
        }
      }
      // Clicked empty space → deselect
      selectTask(null);
    },
    [interactive, selectTask, onTimeSelect, getTimeFromMouse, onFocusBlockClick],
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        data-orbit-canvas
        className="h-full w-full"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{ cursor: interactive ? "crosshair" : "pointer" }}
      />
      {interactive && hoverTime && hoverPos && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed z-[60] font-mono text-xs px-2 py-1 rounded-md"
          style={{
            left: hoverPos.x + 12,
            top: hoverPos.y - 20,
            backgroundColor: "rgba(0,0,0,0.75)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#EAB308",
            backdropFilter: "blur(8px)",
          }}
        >
          {hoverTime}
        </div>
      )}
      {/* Focus block hover — frosted glass bubble */}
      {hoveredFocusBlock && !interactive && (
        <div
          className="pointer-events-none fixed z-[60] rounded-xl px-3 py-2"
          style={{
            left: hoveredFocusBlock.x + 16,
            top: hoveredFocusBlock.y - 40,
            background: `rgba(10,10,15,0.9)`,
            border: `1px solid ${hoveredFocusBlock.color}30`,
            boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 16px ${hoveredFocusBlock.color}20`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
              style={{ color: hoveredFocusBlock.color }}
              dangerouslySetInnerHTML={{
                __html: sanitizeSvg((() => {
                  const m = METHODOLOGIES.find(m => m.id === hoveredFocusBlock.methodId);
                  return m ? m.icon.replace(/currentColor/g, hoveredFocusBlock.color) : "";
                })()),
              }}
            />
            <div className="flex flex-col">
              <span
                className="text-[0.65rem] font-semibold leading-tight"
                style={{ color: hoveredFocusBlock.color, fontFamily: "'Inter','Microsoft YaHei',sans-serif" }}
              >
                {(() => { const lbl = FOCUS_METHOD_LABELS[hoveredFocusBlock.methodId as keyof typeof FOCUS_METHOD_LABELS]; return (lang === "en" ? lbl?.en : lbl?.zh) ?? hoveredFocusBlock.methodId; })()}
              </span>
              <span className="text-[0.5rem] text-white/30 leading-tight">{t.orbit_click_to_enter}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
