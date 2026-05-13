"use client";

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useFocusBlocks } from "@/hooks/useFocusBlocks";
import { getWeekDates } from "@/utils/time";
import FocusBlockCreator from "./FocusBlockCreator";
import FocusBlockMiniPanel from "./FocusBlockMiniPanel";
import type { FocusBlock, FocusMethodId } from "@/types/focus";

interface FocusTimelineOverlayProps {
  isOrbitMode: boolean;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onOpenMethodology?: (methodId: FocusMethodId) => void;
  onDrawFocus?: (date: string, startTime: string, endTime: string, x: number, y: number) => void;
  clearDragSignal?: number;
  disableDrag?: boolean;
}

export default function FocusTimelineOverlay({
  isOrbitMode,
  selectedBlockId,
  onSelectBlock,
  onOpenMethodology,
  onDrawFocus,
  clearDragSignal,
  disableDrag,
}: FocusTimelineOverlayProps) {
  const { state } = useAppContext();
  const { getBlocksForDate } = useFocusBlocks();
  const [creatingDate, setCreatingDate] = useState<string | null>(null);

  // Drag-draw state
  const [dragPreview, setDragPreview] = useState<{
    date: string; topPct: number; heightPct: number; locked?: boolean;
  } | null>(null);
  const dragRef = useRef<{ date: string; startY: number; hasMoved: boolean; columnTop: number; columnHeight: number } | null>(null);

  const week = useMemo(() => getWeekDates(state.currentDate), [state.currentDate]);

  // Get zoomPx from the scrollable week view container
  const getZoomPx = useCallback(() => {
    const scrollable = document.querySelector("[data-week-scroll]") as HTMLElement | null;
    if (!scrollable) return 42;
    const inner = scrollable.firstElementChild as HTMLElement | null;
    if (!inner) return 42;
    return inner.clientHeight / 24;
  }, []);

  const selectedBlock: FocusBlock | null = useMemo(() => {
    if (!selectedBlockId) return null;
    for (const d of week) {
      const found = getBlocksForDate(d).find((b) => b.id === selectedBlockId);
      if (found) return found;
    }
    return null;
  }, [selectedBlockId, week, getBlocksForDate]);

  const handleColumnMouseDown = useCallback((e: React.MouseEvent, date: string) => {
    if (!isOrbitMode || !onDrawFocus || disableDrag) return;
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    const col = e.currentTarget as HTMLElement;
    const rect = col.getBoundingClientRect();
    const startY = e.clientY - rect.top;
    // Get scroll offset for accurate time positioning
    const scrollable = document.querySelector("[data-week-scroll]") as HTMLElement | null;
    const scrollTop = scrollable?.scrollTop ?? 0;
    const zoomPx = getZoomPx();
    const startMin = ((startY + scrollTop) / zoomPx) * 60;
    const hh = Math.floor(startMin / 60) % 24;
    const mm = Math.round((startMin % 60) / 15) * 15;
    const startTime = `${String(Math.min(23, hh)).padStart(2, "0")}:${String(mm >= 60 ? 0 : mm).padStart(2, "0")}`;

    dragRef.current = { date, startY, hasMoved: false, columnTop: rect.top, columnHeight: rect.height };
    // Don't show preview until actual drag movement

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const currentY = ev.clientY - dragRef.current.columnTop;
      const dy = Math.abs(currentY - dragRef.current.startY);
      if (dy < 4 && !dragRef.current.hasMoved) return; // minimum drag threshold
      if (!dragRef.current.hasMoved) { ev.preventDefault(); } // prevent text selection on actual drag
      dragRef.current.hasMoved = true;
      const topPct = (Math.min(currentY, dragRef.current.startY) / dragRef.current.columnHeight) * 100;
      const heightPct = Math.max(2, (Math.abs(currentY - dragRef.current.startY) / dragRef.current.columnHeight) * 100);
      setDragPreview({ date, topPct: Math.max(0, topPct), heightPct: Math.min(100 - topPct, heightPct) });
    };

    const handleUp = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      if (!dragRef.current.hasMoved) {
        dragRef.current = null;
        setDragPreview(null);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        return;
      }
      const endY = ev.clientY - dragRef.current.columnTop;
      // Use scroll-aware time computation
      const sTop = scrollable?.scrollTop ?? 0;
      const zPx = getZoomPx();
      const endMin = ((endY + sTop) / zPx) * 60;
      const ehh = Math.min(23, Math.max(0, Math.floor(endMin / 60)));
      const emmRaw = Math.round((endMin % 60) / 15) * 15;
      const emm = emmRaw >= 60 ? 0 : emmRaw;

      const startMin2 = ((dragRef.current.startY + sTop) / zPx) * 60;
      const shh = Math.min(23, Math.max(0, Math.floor(startMin2 / 60)));
      const smmRaw = Math.round((startMin2 % 60) / 15) * 15;
      const smm = smmRaw >= 60 ? 0 : smmRaw;

      let st = `${String(shh).padStart(2, "0")}:${String(smm).padStart(2, "0")}`;
      let et = `${String(ehh).padStart(2, "0")}:${String(emm).padStart(2, "0")}`;
      if (ehh * 60 + emm <= shh * 60 + smm) {
        et = `${String(Math.min(23, shh)).padStart(2, "0")}:${String(Math.min(59, smm + 30)).padStart(2, "0")}`;
      }

      onDrawFocus(dragRef.current.date, st, et, ev.clientX, ev.clientY);
      // Lock preview as solid (don't clear)
      setDragPreview(prev => prev ? { ...prev, locked: true } : null);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [isOrbitMode, onDrawFocus, getZoomPx, disableDrag]);

  // Clear locked drag preview when method is picked or cancelled
  useEffect(() => {
    setDragPreview(null);
    dragRef.current = null;
  }, [clearDragSignal]);

  // Forward wheel events to the scrollable week view container underneath
  const zHeldRef = useRef(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "z" && !e.ctrlKey && !e.metaKey) zHeldRef.current = true; };
    const onKeyUp = (e: KeyboardEvent) => { if (e.key === "z") zHeldRef.current = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); };
  }, []);

  useEffect(() => {
    if (!isOrbitMode) return;
    const handler = (e: WheelEvent) => {
      if (zHeldRef.current) return; // let zoom handler take over
      const target = e.target as HTMLElement;
      const overlay = document.querySelector("[data-week-overlay]");
      if (overlay && overlay.contains(target)) {
        const scrollable = document.querySelector("[data-week-scroll]") as HTMLElement | null;
        if (scrollable) {
          scrollable.scrollTop += e.deltaY;
        }
      }
    };
    window.addEventListener("wheel", handler, { passive: true });
    return () => window.removeEventListener("wheel", handler);
  }, [isOrbitMode]);

  return (
    <div
      data-week-overlay
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: isOrbitMode ? 30 : 5 }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "36px repeat(7, 1fr)",
        height: "100%",
      }}>
        <div />
        {week.map((date, di) => {
          return (
            <div
              key={date}
              className="relative"
              style={{
                borderRight: di < 6 ? "1px solid transparent" : "none",
                pointerEvents: "none",
              }}
              onMouseDown={(e) => handleColumnMouseDown(e, date)}
            >

              {/* Drag-draw preview block */}
              {dragPreview && dragPreview.date === date && (
                <div
                  className="absolute left-0.5 right-0.5 rounded-[4px] pointer-events-none"
                  style={{
                    top: `${dragPreview.topPct}%`,
                    height: `${dragPreview.heightPct}%`,
                    background: dragPreview.locked
                      ? "rgba(234,179,8,0.2)"
                      : "rgba(234,179,8,0.1)",
                    border: dragPreview.locked
                      ? "2px solid rgba(234,179,8,0.55)"
                      : "2px dashed rgba(234,179,8,0.4)",
                    boxShadow: dragPreview.locked
                      ? "0 0 20px rgba(234,179,8,0.3), inset 0 0 8px rgba(234,179,8,0.1)"
                      : "0 0 12px rgba(234,179,8,0.12)",
                    zIndex: 20,
                    transition: "all 0.2s ease",
                  }}
                />
              )}

              {/* Add button — always visible with at least 10% opacity in Orbit Mode */}
              {isOrbitMode && (
                <button
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center opacity-10 hover:!opacity-100 transition-opacity text-[0.55rem] font-mono"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                    pointerEvents: "auto",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreatingDate(date);
                  }}
                  title="添加聚焦时间段"
                >
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>

      {creatingDate && (
        <FocusBlockCreator
          date={creatingDate}
          onClose={() => setCreatingDate(null)}
          onCreate={() => setCreatingDate(null)}
        />
      )}

      {selectedBlock && isOrbitMode && (
        <FocusBlockMiniPanel
          block={selectedBlock}
          onClose={() => onSelectBlock(null)}
          onOpenMethodology={onOpenMethodology}
        />
      )}
    </div>
  );
}
