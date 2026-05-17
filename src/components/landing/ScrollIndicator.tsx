"use client";

import { useLanguage } from "@/hooks/useLanguage";

export function ScrollIndicator() {
  const lang = useLanguage();

  return (
    <div className="l-scroll-indicator" aria-hidden="true">
      <div className="l-scroll-marks">
        <span className="l-scroll-mark">+</span>
        <span className="l-scroll-mark">+</span>
        <span className="l-scroll-text">
          {lang === "zh" ? "滚动探索" : "SCROLL TO EXPLORE"}
        </span>
        <span className="l-scroll-mark">+</span>
        <span className="l-scroll-mark">+</span>
      </div>
      <div className="l-scroll-line" />
    </div>
  );
}
