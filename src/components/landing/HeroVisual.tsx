"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  baseOpacity: number;
  color: string;
  phase: number;
}

/* Canvas 2D interactive particle field — atmospheric hero visual.
   Blue+amber particles, subtle connections, mouse-aware. */

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const count = 70;
    const ps: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const blue = Math.random() < 0.6;
      ps.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.08,
        r: 0.6 + Math.random() * 2.2,
        baseOpacity: 0.15 + Math.random() * 0.35,
        color: blue ? "59,130,246" : "245,158,11",
        phase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = ps;
  }, []);

  useEffect(() => {
    init();

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onResize = () => init();
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("resize", onResize);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);

    let prevT = 0;
    const draw = (t: number) => {
      animRef.current = requestAnimationFrame(draw);
      const dt = Math.min(50, t - prevT) / 1000;
      prevT = t;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w * dpr, h * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      const ps = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update & draw particles
      for (const p of ps) {
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Subtle mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && mx > 0) {
          const force = (1 - dist / 180) * 0.015;
          p.vx += dx * force * dt;
          p.vy += dy * force * dt;
          // Damp
          p.vx *= 0.995;
          p.vy *= 0.995;
        }

        // Opacity pulse
        const pulse = Math.sin(t * 0.001 + p.phase) * 0.3 + 0.7;
        const alpha = p.baseOpacity * pulse;

        // Draw glow circle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        gradient.addColorStop(0, `rgba(${p.color},${alpha})`);
        gradient.addColorStop(0.3, `rgba(${p.color},${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${p.color},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections between nearby particles
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.06;
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
