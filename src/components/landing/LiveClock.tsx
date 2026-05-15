"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Background glow — radial pulse behind the clock */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "130%",
          height: "130%",
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 35%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          animation: "backgroundGlowPulse 3s ease-in-out infinite",
        }}
      />

      {/* Primary clock — clean, precise, no text-shadow bloom */}
      <span
        className="clock-digit select-none"
        style={{
          fontSize: "clamp(4rem, 14vw, 12rem)",
          color: "#3B82F6",
          lineHeight: 0.9,
          fontWeight: 700,
          position: "relative",
          zIndex: 2,
        }}
      >
        {time || "--:--:--"}
      </span>
    </div>
  );
}
