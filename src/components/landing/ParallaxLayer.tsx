"use client";

import { useEffect, useRef } from "react";
import { useMousePosition } from "@/hooks/useScrollProgress";

interface Props {
  depth: number;           // 0 = background (no parallax), 1 = foreground (max parallax)
  progress: number;        // section scroll progress 0–1
  scrollFactor?: number;   // px of translateY per unit of progress, default 60
  mouseFactor?: number;    // px of translate per unit of mouse position, default 20
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxLayer({
  depth,
  progress,
  scrollFactor = 60,
  mouseFactor = 20,
  children,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const scrollY = depth * scrollFactor * (progress - 0.5) * -1;
      const mx = depth * mouseFactor * mouse.current.x;
      const my = depth * mouseFactor * mouse.current.y;
      el.style.transform = `translate3d(${mx.toFixed(2)}px, ${(scrollY + my).toFixed(2)}px, 0)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [depth, scrollFactor, mouseFactor, progress, mouse]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
