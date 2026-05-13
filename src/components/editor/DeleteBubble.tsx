"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface DeleteBubbleProps {
  fromX: number;
  fromY: number;
  targetRect?: { left: number; top: number; right: number; bottom: number };
  onDelete: () => void;
  onCancel: () => void;
}

export default function DeleteBubble({ fromX, fromY, targetRect, onDelete, onCancel }: DeleteBubbleProps) {
  const [hovered, setHovered] = useState(true);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animating, setAnimating] = useState(true);
  const holdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef(0);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Compute final position: outside the target card/bar
  const finalPos = useRef({ x: fromX, y: fromY });
  useEffect(() => {
    const f = finalPos.current;
    if (targetRect) {
      // Place to the right of the target, vertically centered
      f.x = targetRect.right + 40;
      f.y = (targetRect.top + targetRect.bottom) / 2;
      // If too close to viewport edge, place to the left
      if (f.x > window.innerWidth - 100) {
        f.x = targetRect.left - 40;
      }
      // Clamp vertically
      f.y = Math.max(60, Math.min(window.innerHeight - 60, f.y));
    }
    setAnimating(true);
  }, [targetRect]);

  const startHold = useCallback(() => {
    setHolding(true);
    setProgress(0);
    holdStartRef.current = Date.now();
    if (holdRef.current) clearInterval(holdRef.current);
    holdRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min(100, (elapsed / 2000) * 100);
      setProgress(pct);
      if (pct >= 100) {
        if (holdRef.current) clearInterval(holdRef.current);
        holdRef.current = null;
        onDelete();
      }
    }, 50);
  }, [onDelete]);

  const cancelHold = useCallback(() => {
    setHolding(false);
    setProgress(0);
    if (holdRef.current) {
      clearInterval(holdRef.current);
      holdRef.current = null;
    }
  }, []);

  // Click outside bubble → cancel
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    const t = setTimeout(() => window.addEventListener("mousedown", handler), 200);
    return () => { clearTimeout(t); window.removeEventListener("mousedown", handler); };
  }, [onCancel]);

  // End animation after first render
  useEffect(() => {
    const t = setTimeout(() => setAnimating(false), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (holdRef.current) clearInterval(holdRef.current);
    };
  }, []);

  const isRed = hovered;
  const { x: finalX, y: finalY } = finalPos.current;

  return (
    <div
      ref={bubbleRef}
      className="fixed z-[100]"
      style={{
        left: animating ? fromX : finalX,
        top: animating ? fromY : finalY,
        transform: "translate(-50%, -50%)",
        transition: animating
          ? "none"
          : "left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-full select-none cursor-pointer"
        style={{
          background: isRed ? "#EF4444" : "rgba(20,20,25,0.92)",
          border: isRed
            ? "2px solid #EF4444"
            : "2px solid rgba(255,255,255,0.18)",
          boxShadow: isRed
            ? "0 0 28px rgba(239,68,68,0.6), 0 0 12px rgba(239,68,68,0.4)"
            : "0 4px 20px rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transform: animating ? "scale(0.4)" : "scale(1)",
          transition: animating
            ? "none"
            : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, box-shadow 0.2s, border 0.2s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); cancelHold(); }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          startHold();
        }}
        onMouseUp={cancelHold}
      >
        {holding && (
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              style={{ transition: "stroke-dashoffset 0.05s linear" }} />
          </svg>
        )}
        <span className="w-6 h-6 relative z-10 [&>svg]:w-full [&>svg]:h-full transition-colors duration-200"
          style={{ color: isRed ? "#fff" : "#EF4444" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </span>
      </div>
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[0.55rem] text-white/35">
          {holding ? "松手取消" : hovered ? "长按2秒删除" : "移入气泡删除"}
        </span>
      </div>
    </div>
  );
}
