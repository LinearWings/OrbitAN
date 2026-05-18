"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf: number;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        bar.style.width = `${pct}%`;
        setVisible(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), 1000);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="l-scroll-progress"
      aria-hidden="true"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div ref={barRef} className="l-scroll-progress-bar" />
    </div>
  );
}
