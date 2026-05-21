"use client";

import { useEffect, useRef, useState } from "react";
import { POMODORO_DEFAULTS } from "@/data/constants";
import { loadMethodologyData, saveMethodologyData } from "@/utils/storage";

const METHODOLOGY_KEY = "pomodoro";
type Phase = "focus" | "shortBreak" | "longBreak";

interface PomodoroState {
  phase: Phase;
  focusCount: number;
  remaining: number;
}

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

export default function PomodoroPanel({ initialItems }: { initialItems?: string[] }) {
  const [activeReminder, setActiveReminder] = useState<string | null>(initialItems?.[0] ?? null);
  const beeper = useBeep();
  const [phase, setPhase] = useState<Phase>(() => {
    const saved = loadMethodologyData<PomodoroState>(METHODOLOGY_KEY);
    return saved?.phase ?? "focus";
  });
  const [running, setRunning] = useState(false);
  const [focusCount, setFocusCount] = useState(() => {
    const saved = loadMethodologyData<PomodoroState>(METHODOLOGY_KEY);
    return saved?.focusCount ?? 0;
  });
  const [remaining, setRemaining] = useState(() => {
    const saved = loadMethodologyData<PomodoroState>(METHODOLOGY_KEY);
    return saved?.remaining ?? POMODORO_DEFAULTS.focusDuration;
  });

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
        if (prev <= 0) return 0;
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
        setFocusCount(0); // Reset cycle after long break
      } else {
        setPhase("shortBreak");
        setRemaining(shortBreakDuration);
        setFocusCount((f) => f + 1);
      }
    } else {
      setPhase("focus");
      setRemaining(focusDuration);
    }

    transitioning.current = false;
  }, [remaining, running, beeper]);

  // Persist state (not running — always start paused on reload)
  useEffect(() => {
    saveMethodologyData(METHODOLOGY_KEY, { phase, focusCount, remaining });
  }, [phase, focusCount, remaining]);

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
    <div className="flex flex-col items-center justify-center h-full select-none gap-4">
      {/* Active reminder indicator */}
      {initialItems && initialItems.length > 0 && (
        <div className="w-full max-w-xs">
          <p className="text-[0.6rem] text-white/25 mb-2 text-center font-mono">当前专注</p>
          <div className="space-y-1">
            {initialItems.map((name, i) => (
              <button
                key={i}
                onClick={() => setActiveReminder(name)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: activeReminder === name ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeReminder === name ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.04)"}`,
                  color: activeReminder === name ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
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
