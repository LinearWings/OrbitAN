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

const IDENT = { rx: 0, ry: 0, rz: 0, s: 1, tx: 0, ty: 0, tz: 0, blur: 0, op: 1 };

function applyKF(kf: CinematicKeyframe) {
  return {
    rx: kf.rotateX ?? 0, ry: kf.rotateY ?? 0, rz: kf.rotateZ ?? 0,
    s: kf.scale ?? 1,
    tx: kf.translateX ?? 0, ty: kf.translateY ?? 0, tz: kf.translateZ ?? 0,
    blur: kf.blur ?? 0, op: kf.opacity ?? 1,
  };
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

    // Cache the untransformed layout position ONCE before any transforms.
    // After transforms are applied, getBoundingClientRect() returns transformed
    // dimensions which would create a feedback loop with the progress calculation.
    const initRect = el.getBoundingClientRect();
    const initTop = initRect.top + window.scrollY;
    const baseHeight = initRect.height;

    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const cfg = configRef.current;
      const enter = cfg.enter;
      const exit = cfg.exit;
      const origin = cfg.origin ?? "center center";

      // Compute viewport-relative top from cached document position.
      // This is immune to transforms since we never re-read the rect.
      const top = initTop - window.scrollY;
      const vh = window.innerHeight;

      // Off-screen early exit
      if (top > vh + 300 || top + baseHeight < -300) return;

      const progress = top > vh
        ? 1
        : Math.max(0, Math.min(1, -top / baseHeight));

      if (reducedMotion.current) {
        el.style.transform = "";
        el.style.filter = "";
        el.style.opacity = "";
        return;
      }

      let v = IDENT;

      if (progress < 0.01) {
        v = enter ? applyKF(enter) : IDENT;
      } else if (progress < 0.35 && enter) {
        const t = easeOut(Math.min(1, progress / 0.35));
        const e = applyKF(enter);
        v = {
          rx: lerp(e.rx, 0, t), ry: lerp(e.ry, 0, t), rz: lerp(e.rz, 0, t),
          s: lerp(e.s, 1, t),
          tx: lerp(e.tx, 0, t), ty: lerp(e.ty, 0, t), tz: lerp(e.tz, 0, t),
          blur: lerp(e.blur, 0, t), op: lerp(e.op, 1, t),
        };
      } else if (progress > 0.65 && exit) {
        const t = easeIn(Math.min(1, (progress - 0.65) / 0.35));
        const x = applyKF(exit);
        v = {
          rx: lerp(0, x.rx, t), ry: lerp(0, x.ry, t), rz: lerp(0, x.rz, t),
          s: lerp(1, x.s, t),
          tx: lerp(0, x.tx, t), ty: lerp(0, x.ty, t), tz: lerp(0, x.tz, t),
          blur: lerp(0, x.blur, t), op: lerp(1, x.op, t),
        };
      }

      let { rx, ry, rz, s, tx, ty, tz, blur, op } = v;

      // Active zone: mouse-driven tilt
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
