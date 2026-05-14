"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<string>("");
  const [deconTime, setDeconTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
      // Deconstructed version: offset by 6 hours, reversed seconds
      const dH = String((now.getHours() + 6) % 24).padStart(2, "0");
      const dS = String(59 - now.getSeconds()).padStart(2, "0");
      setDeconTime(`${dH}:${mm}:${dS}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Background glow — radial pulse behind the clock, not on the text */}
      <div className="background-glow" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "120%", height: "120%" }} />

      {/* Primary clock — clean, no text-shadow bloom */}
      <span
        className="clock-digit select-none"
        style={{
          fontSize: "clamp(4rem, 14vw, 12rem)",
          color: "#2563EB",
          lineHeight: 0.9,
          fontWeight: 700,
          position: "relative",
          zIndex: 2,
        }}
      >
        {time || "--:--:--"}
      </span>

      {/* Deconstructed secondary clock — smaller, tilted, ghostly */}
      <span
        className="select-none"
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-8%",
          fontSize: "clamp(1.5rem, 5vw, 4rem)",
          color: "rgba(234,179,8,0.10)",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          lineHeight: 0.9,
          letterSpacing: "0.06em",
          transform: "rotate(-8deg) scaleX(0.85)",
          zIndex: 1,
          pointerEvents: "none",
          filter: "blur(1px)",
        }}
      >
        {deconTime || "--:--:--"}
      </span>

      {/* Tiny tertiary time — extreme distortion, amber ghost */}
      <span
        className="select-none"
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          fontSize: "clamp(0.7rem, 2vw, 1.5rem)",
          color: "rgba(234,179,8,0.07)",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 500,
          letterSpacing: "0.15em",
          transform: "rotate(15deg) scaleY(0.7)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {time || "--:--:--"}
      </span>
    </div>
  );
}
