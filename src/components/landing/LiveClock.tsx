"use client";

import { useState, useEffect, useRef } from "react";

export default function LiveClock() {
  const [time, setTime] = useState<string>("");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
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
