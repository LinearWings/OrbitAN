"use client";

import { useEffect, useRef } from "react";

/* Lusion-quality interactive particle canvas.
   120 particles, organic drift, mouse-aware,
   constellation connections, glowing halos. */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  baseAlpha: number;
  color: [number, number, number]; // RGB
  phase: number;
  freq: number;
}

const BLUE: [number, number, number] = [59, 130, 246];
const AMBER: [number, number, number] = [245, 158, 11];
const WHITE: [number, number, number] = [180, 200, 240];

export default function HeroVisual() {
  const cRef = useRef<HTMLCanvasElement>(null);
  const psRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -500, y: -500, tx: -500, ty: -500 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = cRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setup();

    // Create particles
    const ps: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      const r = Math.random();
      ps.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.05,
        size: 0.4 + Math.random() * 2.8,
        baseAlpha: 0.08 + Math.random() * 0.35,
        color: r < 0.55 ? BLUE : r < 0.75 ? AMBER : WHITE,
        phase: Math.random() * Math.PI * 2,
        freq: 0.3 + Math.random() * 0.8,
      });
    }
    psRef.current = ps;

    let prevT = 0;
    const animate = (t: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const dt = Math.min(60, t - prevT) / 1000;
      prevT = t;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const tSec = t * 0.001;

      ctx.clearRect(0, 0, w, h);

      // Update & draw
      for (const p of ps) {
        // Organic drift
        p.vx += (Math.sin(tSec * p.freq + p.phase) * 0.04) * dt;
        p.vy += (Math.cos(tSec * p.freq * 0.7 + p.phase) * 0.04 - 0.015) * dt;
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Mouse attraction (gentle)
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && mx > 0) {
          const force = (1 - dist / 200) * 0.02 * dt;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;

        // Wrap
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        // Draw glow
        const pulse = Math.sin(tSec * p.freq * 1.3 + p.phase) * 0.35 + 0.65;
        const alpha = p.baseAlpha * pulse;
        const [cr, cg, cb] = p.color;
        const sz = p.size * 5;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
        grad.addColorStop(0.25, `rgba(${cr},${cg},${cb},${alpha * 0.5})`);
        grad.addColorStop(0.6, `rgba(${cr},${cg},${cb},${alpha * 0.08})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constellation lines
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.05;
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };
    const onResize = () => setup();
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", onResize);

    // Smooth mouse interpolation
    const smoothMouse = () => {
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.08;
      requestAnimationFrame(smoothMouse);
    };
    const smId = requestAnimationFrame(smoothMouse);

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(smId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas ref={cRef} aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0, opacity: 0.85 }} />
  );
}
