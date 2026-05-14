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
    <span
      className="clock-digit select-none"
      style={{
        fontSize: "clamp(3rem, 12vw, 10rem)",
        color: "#EAB308",
        animation: "clockPulse 2s ease-in-out infinite",
        lineHeight: 1,
      }}
    >
      {time || "--:--:--"}
    </span>
  );
}
