"use client";

import { useEffect, useRef, useCallback } from "react";
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

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t: number) { return t * t * t; }

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
  const ref = useRef<HTMLElement>(null);
  const mouse = useMousePosition();
  const configRef = useRef(config);
  configRef.current = config;
  const heightRef = useRef(0);

  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
    if (el && !heightRef.current) {
      heightRef.current = el.getBoundingClientRect().height;
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mq.matches;
    const onChange = () => { reducedMotion = mq.matches; };
    mq.addEventListener("change", onChange);

    const scrollEl = document.querySelector("[data-scroll-container]");
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el || !heightRef.current) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Off-screen: no transforms needed
      if (rect.bottom < -200 || rect.top > vh + 200) return;

      const cfg = configRef.current;
      const enter = cfg.enter;
      const exit = cfg.exit;
      const origin = cfg.origin ?? "center center";

      if (reducedMotion) {
        el.style.transform = "";
        el.style.filter = "";
        el.style.opacity = "";
        return;
      }

      // Viewport-relative progress:
      // Entering: 0 when bottom just entered viewport → 1 when top reaches viewport center
      // Exiting:  0 when bottom starts leaving viewport top → 1 when bottom reaches viewport top
      let enterP = 0;
      if (enter) {
        if (rect.bottom < vh) {
          // Section partially visible, bottom hasn't reached viewport top
          enterP = Math.max(0, (vh - rect.bottom) / Math.min(vh, heightRef.current));
        } else if (rect.top < vh / 2) {
          // Section extends below viewport, scrolling toward center
          enterP = Math.max(0, Math.min(1, (vh - rect.top) / (vh + heightRef.current)));
        } else {
          enterP = 0;
        }
      }

      let exitP = 0;
      if (exit && rect.top < 0) {
        exitP = Math.min(1, -rect.top / Math.min(vh, heightRef.current));
      }

      let v = IDENT;

      if (exitP > 0.01 && exit) {
        // Exiting phase
        const t = easeIn(exitP);
        const x = applyKF(exit);
        v = {
          rx: lerp(0, x.rx, t), ry: lerp(0, x.ry, t), rz: lerp(0, x.rz, t),
          s: lerp(1, x.s, t),
          tx: lerp(0, x.tx, t), ty: lerp(0, x.ty, t), tz: lerp(0, x.tz, t),
          blur: lerp(0, x.blur, t), op: lerp(1, x.op, t),
        };
      } else if (enterP < 0.99 && enter) {
        // Entering phase
        const t = easeOut(enterP);
        const e = applyKF(enter);
        v = {
          rx: lerp(e.rx, 0, t), ry: lerp(e.ry, 0, t), rz: lerp(e.rz, 0, t),
          s: lerp(e.s, 1, t),
          tx: lerp(e.tx, 0, t), ty: lerp(e.ty, 0, t), tz: lerp(e.tz, 0, t),
          blur: lerp(e.blur, 0, t), op: lerp(e.op, 1, t),
        };
      }

      // Active zone: mouse-driven tilt
      if (enterP > 0.99 && exitP < 0.01) {
        const mr = enter?.mouseRotate ?? exit?.mouseRotate ?? 0;
        const mt = enter?.mouseTranslate ?? exit?.mouseTranslate ?? 0;
        if (mr) { v.ry += mouse.current.x * mr; v.rx += mouse.current.y * -mr; }
        if (mt) { v.tx += mouse.current.x * mt; v.ty += mouse.current.y * mt; }
      }

      const { rx, ry, rz, s, tx, ty, tz, blur, op } = v;
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
    return () => { cancelAnimationFrame(raf); mq.removeEventListener("change", onChange); };
  }, [mouse]);

  return { ref: setRef };
}
