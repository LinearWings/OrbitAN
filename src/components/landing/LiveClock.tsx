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
        fontSize: "clamp(4rem, 14vw, 11rem)",
        color: "#3B82F6",
        lineHeight: 0.9,
        fontWeight: 700,
      }}
    >
      {time || "--:--:--"}
    </span>
  );
}
