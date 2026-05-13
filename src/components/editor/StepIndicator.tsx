"use client";

import React from "react";

type WizardStep = 1 | 2;

export function StepIndicator({
  current,
  typeColor,
}: {
  current: WizardStep;
  typeColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      {([1, 2] as WizardStep[]).map((s) => {
        const isActive = s === current;
        const isPassed = s < current;
        return (
          <div key={s} className="flex items-center gap-3">
            <div
              className="relative transition-all duration-500"
              style={{
                width: isActive ? 14 : 6,
                height: isActive ? 14 : 6,
              }}
            >
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500`}
                style={{
                  backgroundColor:
                    isActive || isPassed ? typeColor : "rgba(255,255,255,0.12)",
                  boxShadow:
                    isActive
                      ? `0 0 12px ${typeColor}60`
                      : isPassed
                        ? `0 0 4px ${typeColor}30`
                        : "none",
                  opacity: isActive || isPassed ? 1 : 0.5,
                }}
              />
              {isActive && (
                <div
                  className="absolute -inset-[4px] rounded-full animate-ping"
                  style={{
                    border: `1px solid ${typeColor}40`,
                    animationDuration: "2s",
                  }}
                />
              )}
            </div>
            {s < 2 && (
              <div
                className="h-[1px] w-6 transition-all duration-500"
                style={{
                  background: isPassed
                    ? `linear-gradient(90deg, ${typeColor}60, ${typeColor}20)`
                    : "rgba(255,255,255,0.06)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
