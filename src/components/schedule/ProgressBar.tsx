"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

interface ProgressBarProps {
  progress: number;
  color: string;
  taskDuration: number;
  onProgressChange: (progress: number) => void;
  onStatusChange?: (status: "active" | "paused" | "completed") => void;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export default function ProgressBar({
  progress, color, taskDuration: _taskDuration, onProgressChange, onStatusChange,
}: ProgressBarProps) {
  const [status, setStatus] = useState<"idle" | "active" | "paused" | "completed">(
    progress >= 100 ? "completed" : progress > 0 ? "paused" : "idle",
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(progress);

  // Sync refs in useEffect to avoid react-hooks/refs error
  useEffect(() => {
    progressRef.current = progress;
  });

  // Handle completion state
  useEffect(() => {
    if (progress >= 100 && status !== "completed") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("completed");
      onStatusChange?.("completed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress >= 100]);

  const rgb = hexToRgb(color);

  useEffect(() => {
    if (status !== "active") {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }
    intervalRef.current = setInterval(() => {
      onProgressChange(Math.min(100, progressRef.current + 1));
    }, 60000);
    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [status, onProgressChange]);

  const handleStart = useCallback(() => {
    setStatus("active");
    onProgressChange(0);
    onStatusChange?.("active");
  }, [onProgressChange, onStatusChange]);

  const handlePause = useCallback(() => {
    setStatus("paused");
    onStatusChange?.("paused");
  }, [onStatusChange]);

  const handleEnd = useCallback(() => {
    setStatus("completed");
    onProgressChange(100);
    onStatusChange?.("completed");
  }, [onProgressChange, onStatusChange]);

  const handleNudge = useCallback(
    (delta: number) => { onProgressChange(Math.max(0, Math.min(100, progress + delta))); },
    [progress, onProgressChange],
  );

  const fillGradient = `linear-gradient(90deg, rgba(${rgb.r},${rgb.g},${rgb.b},0.35) 0%, ${color} 95%)`;
  const glowShadow = status === "active"
    ? `0 0 10px rgba(${rgb.r},${rgb.g},${rgb.b},0.35), 0 0 24px rgba(${rgb.r},${rgb.g},${rgb.b},0.12)`
    : `0 0 6px rgba(${rgb.r},${rgb.g},${rgb.b},0.2)`;

  return (
    <div className="space-y-1.5">
      <div className="relative h-1.5 w-full rounded-full overflow-hidden"
        style={{ background: `rgba(${rgb.r},${rgb.g},${rgb.b},0.08)` }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, background: fillGradient, boxShadow: glowShadow }} />
      </div>
      <div className="flex items-center gap-1 select-none">
        <button onClick={() => handleNudge(-5)} className="w-5 h-5 text-[0.55rem] text-white/25 hover:text-white/60" title="减少 5%"><ChevronLeftIcon size={10} /></button>
        <button onClick={() => handleNudge(5)} className="w-5 h-5 text-[0.55rem] text-white/25 hover:text-white/60" title="增加 5%"><ChevronRightIcon size={10} /></button>
        <span className="text-[0.55rem] font-mono tabular-nums text-white/30 w-8 text-center">{progress}%</span>
        <div className="w-px h-3 bg-white/8 mx-1" />
        {status === "idle" || status === "completed" ? (
          <button onClick={handleStart} className="px-2 py-0.5 text-[0.6rem] font-medium text-white/40 hover:text-white/80">开始</button>
        ) : status === "active" ? (
          <button onClick={handlePause} className="px-2 py-0.5 text-[0.6rem] font-medium text-amber-300/70 hover:text-amber-200">暂停</button>
        ) : (
          <button onClick={handleStart} className="px-2 py-0.5 text-[0.6rem] font-medium text-white/40 hover:text-white/80">继续</button>
        )}
        {status !== "completed" && status !== "idle" && (
          <button onClick={handleEnd} className="px-2 py-0.5 text-[0.6rem] font-medium text-white/25 hover:text-red-400/70">结束</button>
        )}
      </div>
    </div>
  );
}
