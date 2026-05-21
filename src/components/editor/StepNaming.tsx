"use client";

import React, { useEffect, useRef } from "react";
import { getTaskColor, getTaskLabel } from "@/utils/colors";
import type { CustomTypeDef } from "@/types";

export function StepNaming({
  name,
  setName,
  type,
  setType,
  typeColor,
  onNext,
  transitionClass,
  customTypes,
}: {
  name: string;
  setName: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  typeColor: string;
  onNext: () => void;
  transitionClass: string;
  customTypes?: CustomTypeDef[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      onNext();
    }
  };

  const builtInTypes: string[] = ["work", "study", "meeting", "personal"];
  const types = [...builtInTypes, ...(customTypes?.map(ct => ct.name) ?? [])];

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center px-8 ${transitionClass}`}
    >
      {/* Background nebula */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${typeColor}12 0%, ${typeColor}06 30%, transparent 65%)`,
          transition: "background 0.5s ease",
        }}
      />

      {/* Orbital particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1.5 + (i % 4) * 1.5,
              height: 1.5 + (i % 4) * 1.5,
              left: `${15 + ((i * 13) % 70)}%`,
              top: `${10 + ((i * 7) % 80)}%`,
              backgroundColor: i % 2 === 0 ? typeColor : "#ffffff",
              opacity: 0.1 + (i % 5) * 0.04,
              animation: `float-drift ${10 + (i % 6) * 2}s ease-in-out infinite`,
              animationDelay: `${(i * 0.5) % 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg">
        {/* Title */}
        <div className="text-center">
          <div
            className="text-[0.6rem] font-mono tracking-[0.2em] uppercase mb-2"
            style={{ color: `${typeColor}99` }}
          >
            Orbit Launch Wizard · Step 01
          </div>
          <h2
            className="text-white/70 text-sm font-mono font-light"
          >
            为你的任务命名
          </h2>
        </div>

        {/* Large name input */}
        <div className="relative w-full">
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入任务名称…"
            className="w-full bg-transparent text-center outline-none text-white placeholder-white/15"
            style={{
              fontFamily: '"Clash Display", sans-serif',
              fontSize: name ? "clamp(2rem, 5vw, 3.5rem)" : "clamp(1.4rem, 3.5vw, 2.2rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              transition: "font-size 0.3s ease",
              textShadow: name ? `0 0 40px ${typeColor}25` : "none",
            }}
          />
          {/* Underline glow */}
          <div
            className="absolute bottom-0 left-[10%] right-[10%] h-[2px] rounded-full transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${typeColor}60 50%, transparent 100%)`,
              opacity: name ? 0.8 : 0.3,
              boxShadow: name ? `0 0 12px ${typeColor}40` : "none",
            }}
          />
          <div
            className="text-[0.55rem] text-white/20 font-mono text-center mt-3"
          >
            ⏎ Enter 继续 · 支持中文 + English
          </div>
        </div>

        {/* Type selector — orbital planet buttons */}
        <div className="flex items-center gap-3">
          {types.map((t) => {
            const color = getTaskColor(t);
            const label = getTaskLabel(t);
            const selected = type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="relative flex flex-col items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300"
                style={{
                  background: selected
                    ? `linear-gradient(135deg, ${color}25 0%, ${color}08 100%)`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${
                    selected ? `${color}50` : "rgba(255,255,255,0.06)"
                  }`,
                  boxShadow: selected
                    ? `0 0 20px ${color}20, inset 0 0 20px ${color}10`
                    : "none",
                  transform: selected ? "scale(1.05)" : "scale(1)",
                }}
              >
                {/* Glow aura */}
                {selected && (
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at center, ${color}30 0%, transparent 70%)`,
                    }}
                  />
                )}
                {/* Planet dot */}
                <div className="relative">
                  <div
                    className="w-4 h-4 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: color,
                      boxShadow: selected
                        ? `0 0 12px ${color}80, 0 0 30px ${color}30`
                        : "none",
                      opacity: selected ? 1 : 0.5,
                    }}
                  />
                  {/* Specular highlight */}
                  <div
                    className="absolute -top-[2px] -left-[2px] w-[6px] h-[6px] rounded-full bg-white/60"
                    style={{ opacity: selected ? 0.7 : 0.2 }}
                  />
                </div>
                {/* Label */}
                <span
                  className="text-xs font-medium tracking-wide relative z-[1]"
                  style={{
                    color: selected ? color : "rgba(255,255,255,0.3)",
                    fontFamily: "'Inter', sans-serif",
                    transition: "color 0.3s",
                  }}
                >
                  {label.zh}
                </span>
                <span
                  className="text-[0.5rem] font-mono relative z-[1]"
                  style={{
                    color: selected
                      ? `${color}99`
                      : "rgba(255,255,255,0.15)",
                  }}
                >
                  {label.en}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={onNext}
          disabled={!name.trim()}
          className="relative mt-4 px-8 py-3 rounded-full text-sm font-medium transition-all duration-300"
          style={{
            background: name.trim()
              ? `linear-gradient(135deg, ${typeColor}, ${typeColor}bb)`
              : "rgba(255,255,255,0.05)",
            color: name.trim() ? "#000" : "rgba(255,255,255,0.2)",
            boxShadow: name.trim()
              ? `0 4px 24px ${typeColor}40`
              : "none",
            cursor: name.trim() ? "pointer" : "not-allowed",
            fontFamily: "'Clash Display', sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          下一步 →
        </button>
      </div>
    </div>
  );
}
