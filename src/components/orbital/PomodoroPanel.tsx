"use client";

import { useEffect, useRef, useState } from "react";
import { POMODORO_DEFAULTS } from "@/data/constants";

type Phase = "focus" | "shortBreak" | "longBreak";

const PHASE_LABEL: Record<Phase, string> = {
  focus: "专注",
  shortBreak: "短休息",
  longBreak: "长休息",
};

const PHASE_COLOR: Record<Phase, string> = {
  focus: "#2563EB",
  shortBreak: "#EAB308",
  longBreak: "#7C3AED",
};

function useBeep() {
  const ctx = useRef<AudioContext | null>(null);

  const beep = async (freq = 800, duration = 0.1) => {
    try {
      if (!ctx.current) {
        ctx.current = new AudioContext();
      }
      const c = ctx.current;
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = freq;
      o.connect(g);
      g.connect(c.destination);
      const now = c.currentTime;
      g.gain.setValueAtTime(0.1, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      o.start(now);
      o.stop(now + duration);
    } catch {
      /* Audio unavailable — silently ignore */
    }
  };

  return { beep };
}

export default function PomodoroPanel() {
  const beeper = useBeep();
  const [phase, setPhase] = useState<Phase>("focus");
  const [running, setRunning] = useState(false);
  const [focusCount, setFocusCount] = useState(0);
  const [remaining, setRemaining] = useState(POMODORO_DEFAULTS.focusDuration);

  const phaseRef = useRef(phase);
  const focusCountRef = useRef(focusCount);
  // Keep refs in sync with state for the timer callback (useEffect, not render)
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    focusCountRef.current = focusCount;
  }, [focusCount]);

  const transitioning = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (transitioning.current) return;
      setRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running || remaining > 0 || transitioning.current) return;

    transitioning.current = true;
    beeper.beep(600, 0.08);

    const { cyclesBeforeLongBreak, focusDuration, shortBreakDuration, longBreakDuration } = POMODORO_DEFAULTS;
    const curPhase = phaseRef.current;
    const curFocusCount = focusCountRef.current;

    if (curPhase === "focus") {
      const needLongBreak = (curFocusCount + 1) % cyclesBeforeLongBreak === 0;
      if (needLongBreak) {
        setPhase("longBreak");
        setRemaining(longBreakDuration);
      } else {
        setPhase("shortBreak");
        setRemaining(shortBreakDuration);
      }
    } else {
      setPhase("focus");
      setRemaining(focusDuration);
      if (curPhase === "shortBreak") {
        setFocusCount((f) => f + 1);
      }
    }

    transitioning.current = false;
  }, [remaining, running, beeper]);

  function reset() {
    setPhase("focus");
    setFocusCount(0);
    setRemaining(POMODORO_DEFAULTS.focusDuration);
    setRunning(false);
  }

  const color = PHASE_COLOR[phase];
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  const phaseDuration =
    phase === "focus"
      ? POMODORO_DEFAULTS.focusDuration
      : phase === "shortBreak"
        ? POMODORO_DEFAULTS.shortBreakDuration
        : POMODORO_DEFAULTS.longBreakDuration;

  const progress = phaseDuration > 0 ? 1 - remaining / phaseDuration : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex items-center justify-center h-full select-none">
      <div className="text-center">
        <svg width={220} height={220} viewBox="0 0 220 220" aria-label="Pomodoro Timer" role="img">
          <circle cx={110} cy={110} r={radius} stroke="#ffffff33" strokeWidth={4} fill="none" />
          <circle
            cx={110}
            cy={110}
            r={radius}
            stroke={color}
            strokeWidth={4}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 110 110)`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <text x="50%" y="50%" textAnchor="middle" dy="-6" fontFamily="var(--font-satoshi)" fontSize="40" fill="#FFFFFF">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </text>
        </svg>
        <div className="mt-2 text-white text-lg font-semibold" style={{ fontFamily: "var(--font-satoshi)" }}>
          {PHASE_LABEL[phase]}
        </div>
        <div className="mt-3 flex justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded bg-white/10 px-4 py-2 text-sm"
          >
            {running ? "暂停" : "开始"}
          </button>
          <button onClick={reset} className="rounded bg-white/10 px-4 py-2 text-sm">
            重置
          </button>
        </div>
        <div className="mt-2 text-sm text-white/60">
          第 {Math.min(focusCount + 1, POMODORO_DEFAULTS.cyclesBeforeLongBreak)}/{POMODORO_DEFAULTS.cyclesBeforeLongBreak} 轮
        </div>
      </div>
    </div>
  );
}
