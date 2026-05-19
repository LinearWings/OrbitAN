"use client";

import { useEffect, useRef } from "react";
import { useMousePosition } from "./useScrollProgress";

interface CinematicKeyframe {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  blur?: number;
  opacity?: number;
  mouseRotate?: number;
  mouseTranslate?: number;
}

export interface CinematicConfig {
  enter?: CinematicKeyframe;
  exit?: CinematicKeyframe;
  origin?: string;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeIn(t: number): number {
  return t * t * t;
}

export function useCinematicScroll(config: CinematicConfig) {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const reducedMotion = useRef(false);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const onChange = () => { reducedMotion.current = mq.matches; };
    mq.addEventListener("change", onChange);

    const el = ref.current;
    if (!el) return;

    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const cfg = configRef.current;
      const enter = cfg.enter;
      const exit = cfg.exit;
      const origin = cfg.origin ?? "center center";

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Off-screen early exit
      if (rect.bottom < -200 || rect.top > vh + 200) return;

      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Same formula as useScrollProgress
      const progress = sectionTop > vh
        ? 1
        : Math.max(0, Math.min(1, -sectionTop / sectionHeight));

      if (reducedMotion.current) {
        el.style.transform = "";
        el.style.filter = "";
        el.style.opacity = "";
        return;
      }

      // Determine phase and interpolation
      let rx = 0, ry = 0, rz = 0, s = 1, tx = 0, ty = 0, tz = 0, blur = 0, op = 1;

      if (progress < 0.01 && enter) {
        // Below viewport — fully at enter keyframe
        rx = enter.rotateX ?? 0;
        ry = enter.rotateY ?? 0;
        rz = enter.rotateZ ?? 0;
        s = enter.scale ?? 1;
        tx = enter.translateX ?? 0;
        ty = enter.translateY ?? 0;
        tz = enter.translateZ ?? 0;
        blur = enter.blur ?? 0;
        op = enter.opacity ?? 1;
      } else if (progress < 0.35 && enter) {
        // Entering phase — ease-out from enter keyframe to identity
        const t = easeOut(Math.min(1, progress / 0.35));
        rx = lerp(enter.rotateX ?? 0, 0, t);
        ry = lerp(enter.rotateY ?? 0, 0, t);
        rz = lerp(enter.rotateZ ?? 0, 0, t);
        s = lerp(enter.scale ?? 1, 1, t);
        tx = lerp(enter.translateX ?? 0, 0, t);
        ty = lerp(enter.translateY ?? 0, 0, t);
        tz = lerp(enter.translateZ ?? 0, 0, t);
        blur = lerp(enter.blur ?? 0, 0, t);
        op = lerp(enter.opacity ?? 1, 1, t);
      } else if (progress > 0.65 && exit) {
        // Exiting phase — ease-in from identity to exit keyframe
        const t = easeIn(Math.min(1, (progress - 0.65) / 0.35));
        rx = lerp(0, exit.rotateX ?? 0, t);
        ry = lerp(0, exit.rotateY ?? 0, t);
        rz = lerp(0, exit.rotateZ ?? 0, t);
        s = lerp(1, exit.scale ?? 1, t);
        tx = lerp(0, exit.translateX ?? 0, t);
        ty = lerp(0, exit.translateY ?? 0, t);
        tz = lerp(0, exit.translateZ ?? 0, t);
        blur = lerp(0, exit.blur ?? 0, t);
        op = lerp(1, exit.opacity ?? 1, t);
      }

      // Active zone (0.35–0.65): apply mouse-driven tilt
      if (progress >= 0.35 && progress <= 0.65) {
        const mr = enter?.mouseRotate ?? exit?.mouseRotate ?? 0;
        const mt = enter?.mouseTranslate ?? exit?.mouseTranslate ?? 0;
        if (mr) {
          ry += mouse.current.x * mr;
          rx += mouse.current.y * -mr;
        }
        if (mt) {
          tx += mouse.current.x * mt;
          ty += mouse.current.y * mt;
        }
      }

      // Build transform
      const parts: string[] = [];
      if (tx || ty || tz) parts.push(`translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px)`);
      if (rx) parts.push(`rotateX(${rx.toFixed(3)}deg)`);
      if (ry) parts.push(`rotateY(${ry.toFixed(3)}deg)`);
      if (rz) parts.push(`rotateZ(${rz.toFixed(3)}deg)`);
      if (s !== 1) parts.push(`scale(${s.toFixed(4)})`);

      el.style.transformOrigin = origin;
      el.style.transform = parts.length ? parts.join(" ") : "";
      el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "";
      el.style.opacity = op < 0.99 ? op.toFixed(3) : "";
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", onChange);
    };
  }, [mouse]);

  return { ref };
}
