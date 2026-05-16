"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { getWeekDates, getToday, timeToMinutes } from "@/utils/time";
import { getTaskColor, getTaskLabel } from "@/utils/colors";
import FocusBlockCard from "@/components/focus/FocusBlockCard";
import type { FocusBlock, FocusMethodId } from "@/types/focus";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const HOUR_START = 0;
const HOUR_END = 24;
const TOTAL_HOURS = HOUR_END - HOUR_START;
const MIN_PX = 30;
const MAX_PX = 80;
const DEFAULT_PX = 42;
const DAY_LABELS_ZH = ["一", "二", "三", "四", "五", "六", "日"];

interface WeekGridViewProps {
  onDayClick: (date: string) => void;
  isOrbitMode?: boolean;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string | null) => void;
  onOpenMethodology?: (methodId: FocusMethodId) => void;
  onDeleteStart?: (id: string, type: "task" | "focus", x: number, y: number) => void;
  deleteHighlight?: { id: string; type: "task" | "focus" } | null;
}

interface TimedLayoutItem {
  startMs: number;
  endMs: number;
  col: number;
  span: number;
}

function assignConflictLanes<T extends TimedLayoutItem>(items: T[]): T[] {
  const sorted = [...items].sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
  const groups: T[][] = [];
  let group: T[] = [];
  let groupEnd = -Infinity;

  for (const item of sorted) {
    if (group.length === 0 || item.startMs < groupEnd) {
      group.push(item);
      groupEnd = Math.max(groupEnd, item.endMs);
      continue;
    }

    groups.push(group);
    group = [item];
    groupEnd = item.endMs;
  }

  if (group.length > 0) groups.push(group);

  for (const conflictGroup of groups) {
    const laneEnds: number[] = [];
    for (const item of conflictGroup) {
      let lane = 0;
      while (lane < laneEnds.length && (laneEnds[lane] ?? 0) > item.startMs) lane++;
      if (lane === laneEnds.length) laneEnds.push(item.endMs);
      else laneEnds[lane] = item.endMs;
      item.col = lane;
    }

    const laneCount = Math.max(1, laneEnds.length);
    for (const item of conflictGroup) item.span = laneCount;
  }

  return sorted;
}

export default function WeekGridView({ onDayClick, isOrbitMode, selectedBlockId, onOpenMethodology, onDeleteStart, deleteHighlight }: WeekGridViewProps) {
  const { state } = useAppContext();
  const today = getToday();
  const [zoomPx, setZoomPx] = useState(DEFAULT_PX);
  const week = useMemo(() => getWeekDates(state.currentDate), [state.currentDate]);
  const now = new Date();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Zoom: hold Z + scroll wheel
  const zHeldRef = useRef(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "z" && !e.ctrlKey && !e.metaKey) { zHeldRef.current = true; } };
    const onKeyUp = (e: KeyboardEvent) => { if (e.key === "z") { zHeldRef.current = false; } };
    const onWheel = (e: WheelEvent) => {
      if (!zHeldRef.current) return;
      e.preventDefault();
      setZoomPx(z => Math.max(MIN_PX, Math.min(MAX_PX, z + (e.deltaY > 0 ? -6 : 6))));
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);
  const nowPct = ((now.getHours() - HOUR_START + now.getMinutes() / 60) / TOTAL_HOURS) * 100;

  const allTypes = useMemo(() => {
    const s = new Set<string>();
    week.forEach((d) => (state.tasks[d] ?? []).forEach((t) => s.add(t.type)));
    return [...s];
  }, [week, state.tasks]);

  // Task column layout — greedy lane assignment (tasks only, within their own layer)
  const taskLayouts = useMemo(() => {
    const PX_PER_MIN = zoomPx / 60;
    const perDay: {
      taskId: string; date: string;
      topPx: number; heightPx: number;
      color: string; name: string; startTime: string; endTime: string;
      col: number; span: number;
    }[][] = [];

    week.forEach((date) => {
      const tasks = (state.tasks[date] ?? []).slice();
      if (tasks.length === 0) { perDay.push([]); return; }

      const positions = tasks.map(task => {
        const ms = timeToMinutes(task.startTime) - HOUR_START * 60;
        const me = timeToMinutes(task.endTime) - HOUR_START * 60;
        const dur = me >= ms ? me - ms : me + 24 * 60 - ms;
        return {
          taskId: task.id, date,
          startMs: ms, endMs: me >= ms ? me : me + 24 * 60,
          topPx: Math.max(0, ms * PX_PER_MIN),
          heightPx: Math.max(3, dur * PX_PER_MIN),
          color: getTaskColor(task.type),
          name: task.name, startTime: task.startTime, endTime: task.endTime,
          col: 0, span: 1,
        };
      });

      perDay.push(assignConflictLanes(positions));
    });
    return perDay;
  }, [week, state.tasks, zoomPx]);

  // Focus block column layout — independent greedy lane assignment (focus only)
  const focusLayouts = useMemo(() => {
    const PX_PER_MIN = zoomPx / 60;
    const perDay: { block: FocusBlock; topPx: number; heightPx: number; col: number; span: number }[][] = [];

    week.forEach((date) => {
      const blocks = (state.focusBlocks[date] ?? []).slice();
      if (blocks.length === 0 || !isOrbitMode) { perDay.push([]); return; }

      const positions = blocks.map(block => {
        const ms = timeToMinutes(block.startTime) - HOUR_START * 60;
        let me = timeToMinutes(block.endTime) - HOUR_START * 60;
        if (me <= ms) me += 24 * 60;
        return {
          block,
          startMs: ms, endMs: me,
          topPx: Math.max(0, ms * PX_PER_MIN),
          heightPx: Math.max(3, (me - ms) * PX_PER_MIN),
          col: 0, span: 1,
        };
      });

      perDay.push(assignConflictLanes(positions));
    });
    return perDay;
  }, [week, state.focusBlocks, zoomPx, isOrbitMode]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0A0A0D" }}>
      {/*
        7-column timeline grid — on mobile, horizontally scrollable.
        On desktop, full width with time labels on the left.
      */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: isMobile ? "auto" : "hidden" }}>
        <div style={isMobile ? { minWidth: 700 } : undefined}>
      {/* HEADER */}
      <div style={{
        display: "grid", gridTemplateColumns: "36px repeat(7, 1fr)",
        borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
      }}>
        <div />
        {week.map((date, di) => {
          const dayNum = parseInt(date.split("-")[2] ?? "0", 10);
          const isToday = date === today;
          const count = (state.tasks[date] ?? []).length + (state.focusBlocks[date] ?? []).length;
          const types = [...new Set((state.tasks[date] ?? []).map(t => t.type))];
          return (
            <button key={date} onClick={() => onDayClick(date)} style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "10px 4px 8px", border: "none", background: "transparent", cursor: "pointer",
              borderRight: di < 6 ? "1px solid rgba(255,255,255,0.035)" : "none",
            }}>
              <span style={{ fontSize: 12, fontFamily: "'Inter','Microsoft YaHei',sans-serif", color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>
                周{DAY_LABELS_ZH[di]}
              </span>
              <span style={{
                marginTop: 4, width: 34, height: 34, borderRadius: "50%",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: isToday ? "#2563EB" : "transparent",
                color: isToday ? "#fff" : "rgba(255,255,255,0.65)",
                fontSize: 18, fontFamily: "'Clash Display',sans-serif", fontWeight: 600,
              }}>
                {dayNum}
              </span>
              {count > 0 && (
                <div style={{ marginTop: 3, display: "flex", gap: 2 }}>
                  {types.slice(0, 4).map(t => (
                    <div key={t} style={{ width: 5, height: 5, borderRadius: "50%", background: getTaskColor(t) }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* BODY — scrollable */}
      <div data-week-scroll style={{ flex: 1, position: "relative", overflowY: "auto", overflowX: "hidden" }}>
        {/* Scrollable inner container with min-height so there's always content to scroll */}
        <div style={{ position: "relative", height: `${TOTAL_HOURS * zoomPx}px` }}>
          {/* Grid background — absolute fills the inner container */}
          <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "36px repeat(7, 1fr)", gridTemplateRows: "1fr" }}>
            <div style={{ position: "relative", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
              {/* Labels every 3 hours to avoid crowding */}
              {Array.from({ length: TOTAL_HOURS + 1 }, (_, h) => {
                const hour = HOUR_START + h;
                const showLabel = h % 3 === 0;
                return (
                  <div key={h} style={{ position: "absolute", left: 0, right: 0, top: `${(h / TOTAL_HOURS) * 100}%`, textAlign: "right", paddingRight: 8, transform: "translateY(-100%)" }}>
                    {showLabel && (
                      <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono','Microsoft YaHei',monospace", color: "rgba(255,255,255,0.2)", lineHeight: 1 }}>
                        {String(hour).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {week.map((date, di) => {
              const isToday = date === today;
              return (
                <div key={date} style={{ position: "relative", background: isToday ? "rgba(37,99,235,0.02)" : "transparent", borderRight: di < 6 ? "1px solid rgba(255,255,255,0.035)" : "none" }}>
                  {Array.from({ length: TOTAL_HOURS + 1 }, (_, h) => (
                    <div key={h} style={{ position: "absolute", left: 0, right: 0, top: `${(h / TOTAL_HOURS) * 100}%`, borderTop: "1px solid rgba(255,255,255,0.025)" }} />
                  ))}
                  {isToday && nowPct >= 0 && nowPct <= 100 && (
                    <div style={{ position: "absolute", left: 0, right: 0, top: `${nowPct}%`, zIndex: 20, pointerEvents: "none" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", marginLeft: -4 }} />
                        <div style={{ flex: 1, height: 1.5, background: "rgba(239,68,68,0.7)" }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        {/* Task blocks — independent lane layout, tasks don't overlap each other */}
        {taskLayouts.map((group, di) =>
          group.map((t) => (
            <div key={t.taskId}
              data-task-id={t.taskId}
              title={`${t.name}  ${t.startTime}–${t.endTime}`}
              onPointerDown={onDeleteStart ? (e) => {
                if (e.button !== 0 || e.shiftKey) return;
                const el = e.currentTarget as HTMLElement;
                const timer = setTimeout(() => onDeleteStart(t.taskId, "task", e.clientX, e.clientY), 600);
                const clear = () => { clearTimeout(timer); el.removeEventListener("pointerup", clear); el.removeEventListener("pointerleave", clear); };
                el.addEventListener("pointerup", clear);
                el.addEventListener("pointerleave", clear);
              } : undefined}
              onClick={() => {
                if (isOrbitMode) return;
                if (deleteHighlight) return; // Suppress click while delete mode active
                onDayClick(t.date);
              }}
              style={{
                position: "absolute",
                left: `calc(36px + (100% - 36px) / 7 * ${di} + 2px + (100% - 36px) / 7 / ${t.span} * ${t.col})`,
                top: `${t.topPx}px`,
                width: `calc((100% - 36px) / 7 / ${t.span} - 3px)`,
                height: `${t.heightPx}px`,
                minHeight: 18,
                background: `${t.color}18`,
                borderLeft: `3px solid ${t.color}`,
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: (deleteHighlight?.type === "task" && deleteHighlight.id === t.taskId)
                  ? `0 0 20px ${t.color}60, 0 0 8px ${t.color}40`
                  : "0 1px 2px rgba(0,0,0,0.15)",
                zIndex: (deleteHighlight?.type === "task" && deleteHighlight.id === t.taskId) ? 96 : 5,
                transform: (deleteHighlight?.type === "task" && deleteHighlight.id === t.taskId) ? "scale(1.05)" : undefined,
                transition: "transform 0.4s ease, box-shadow 0.4s ease, opacity 0.4s ease, filter 0.4s ease",
                opacity: deleteHighlight && !(deleteHighlight.type === "task" && deleteHighlight.id === t.taskId) ? 0.25 : undefined,
                filter: deleteHighlight && !(deleteHighlight.type === "task" && deleteHighlight.id === t.taskId) ? "blur(3px)" : undefined,
              }}
              onMouseEnter={(e) => { if (!deleteHighlight) { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.zIndex = "15"; } }}
              onMouseLeave={(e) => { if (!deleteHighlight) { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.zIndex = "5"; } }}
            >
              {t.heightPx > 20 ? (
                <div style={{ padding: "3px 5px" }}>
                  <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono','Microsoft YaHei',monospace", fontWeight: 500, color: `${t.color}e0`, lineHeight: 1.3 }}>{t.startTime}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3, color: "rgba(255,255,255,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{t.name}</div>
                </div>
              ) : (
                <div style={{ padding: "1px 4px", fontSize: 12, fontFamily: "'JetBrains Mono','Microsoft YaHei',monospace", color: `${t.color}e0`, lineHeight: 1.2 }}>{t.startTime}</div>
              )}
            </div>
          ))
        )}

        {/* Focus blocks — independent lane layout, focus blocks don't overlap each other (can overlap tasks) */}
        {focusLayouts.map((group, di) =>
          group.map((f, bi) => (
            <div
              key={f.block.id}
              onPointerDown={onDeleteStart ? (e) => {
                if (e.button !== 0 || e.shiftKey) return;
                const el = e.currentTarget as HTMLElement;
                const timer = setTimeout(() => onDeleteStart(f.block.id, "focus", e.clientX, e.clientY), 600);
                const clear = () => { clearTimeout(timer); el.removeEventListener("pointerup", clear); el.removeEventListener("pointerleave", clear); };
                el.addEventListener("pointerup", clear);
                el.addEventListener("pointerleave", clear);
              } : undefined}
              style={{
                position: "absolute",
                top: 0,
                left: `calc(36px + (100% - 36px) / 7 * ${di} + 2px + (100% - 36px) / 7 / ${f.span} * ${f.col})`,
                width: `calc((100% - 36px) / 7 / ${f.span} - 2px)`,
                zIndex: (deleteHighlight?.type === "focus" && deleteHighlight.id === f.block.id) ? 96 : 8,
                transform: (deleteHighlight?.type === "focus" && deleteHighlight.id === f.block.id) ? "scale(1.05)" : undefined,
                transition: "transform 0.4s ease, opacity 0.4s ease, filter 0.4s ease",
                opacity: deleteHighlight && !(deleteHighlight.type === "focus" && deleteHighlight.id === f.block.id) ? 0.25 : undefined,
                filter: deleteHighlight && !(deleteHighlight.type === "focus" && deleteHighlight.id === f.block.id) ? "blur(3px)" : undefined,
              }}
            >
              <FocusBlockCard
                block={f.block}
                isOrbitMode={true}
                isSelected={f.block.id === selectedBlockId}
                zoomPx={zoomPx}
                revealIndex={bi}
                onClick={() => {
                  if (deleteHighlight) return;
                  onOpenMethodology?.(f.block.method);
                }}
              />
            </div>
          ))
        )}
      </div>
      </div>
      </div>
      </div>

      {/* LEGEND */}
      {allTypes.length > 0 && (
        <div style={{ display: "flex", gap: 14, padding: "8px 10px", borderTop: "1px solid rgba(255,255,255,0.04)", flexShrink: 0, flexWrap: "wrap" }}>
          {allTypes.map((type) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: getTaskColor(type), flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'Inter','Microsoft YaHei',sans-serif" }}>{getTaskLabel(type).zh}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
