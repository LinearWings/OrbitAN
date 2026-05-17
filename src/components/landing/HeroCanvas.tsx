"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  drawIsoBase,
  drawIsoDial,
  drawIsoTicks,
  drawIsoOrbitRings,
  drawIsoNebula,
  drawIsoPlanet,
  drawIsoHands,
  drawIsoPlanetLabel,
  type IsoDialConfig,
  type IsoPlanet,
} from "@/components/orbital/isometric-engine";
import { getTaskColor } from "@/utils/colors";

interface HeroCanvasProps {
  scrollProgress?: number;
}

const DEMO_TASKS = [
  { id: "d1", name: "Deep Work", startTime: "09:00", endTime: "10:30", type: "work" },
  { id: "d2", name: "Team Sync", startTime: "10:00", endTime: "11:00", type: "meeting" },
  { id: "d3", name: "Code Review", startTime: "14:00", endTime: "15:30", type: "work" },
  { id: "d4", name: "Study", startTime: "16:00", endTime: "17:00", type: "study" },
  { id: "d5", name: "Planning", startTime: "08:00", endTime: "08:30", type: "personal" },
];

function buildPlanets(width: number, height: number): IsoPlanet[] {
  const cx = width / 2;
  const cy = height / 2;
  const dialRadius = Math.min(width, height) * 0.35;
  const faceA = dialRadius * 1.22;
  const baseStep = faceA * 0.25;
  const ringRadii = [0.66, 0.72, 0.78, 0.84, 0.9, 0.96].map((r) => faceA + r * baseStep * 0.7);

  return DEMO_TASKS.map((task, i) => {
    const [sh, sm] = task.startTime.split(":").map(Number);
    const [eh] = task.endTime.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60;
    const duration = endMin - startMin;
    const midMin = (startMin + endMin) / 2;
    const angle = ((midMin / 1440) * Math.PI * 2) - Math.PI / 2;
    const orbitR = ringRadii[i % ringRadii.length];

    const color = getTaskColor(task.type as any);
    const rgb = (() => {
      const hex = color.replace("#", "");
      const n = parseInt(hex, 16);
      return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
    })();

    const radius = duration < 30 ? 4 : duration < 60 ? 5 : duration < 120 ? 7 : 9;

    return {
      id: task.id,
      x3d: Math.cos(angle) * orbitR,
      y3d: Math.sin(angle) * orbitR,
      z3d: 0,
      screenX: Math.cos(angle) * orbitR,
      screenY: Math.sin(angle) * orbitR * 0.58,
      radius,
      color,
      colorRgb: rgb,
      progress: 0.6,
      taskId: task.id,
      taskName: task.name,
      taskTime: task.startTime,
      floatPhase: i * 1.2,
      orbitIndex: i % 6,
      angle,
    };
  });
}

export function HeroCanvas({ scrollProgress = 0 }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const scrollRef = useRef(scrollProgress);

  scrollRef.current = scrollProgress;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const dialRadius = Math.min(width, height) * 0.35;

    const config: IsoDialConfig = {
      cx,
      cy,
      dialRadius,
      faceThickness: 12,
      bezelSteps: 4,
    };

    const elapsed = Date.now() - startTimeRef.current;
    const now = new Date();

    ctx.clearRect(0, 0, width, height);

    drawIsoBase(ctx, config);
    drawIsoDial(ctx, config);
    drawIsoTicks(ctx, config);
    drawIsoOrbitRings(ctx, config);
    drawIsoNebula(ctx, config, elapsed);

    const planets = buildPlanets(width, height);
    for (const planet of planets) {
      drawIsoPlanet(ctx, config, planet, false, false, elapsed);
    }

    drawIsoHands(ctx, config, now);

    for (const planet of planets) {
      drawIsoPlanetLabel(ctx, config, planet, false, false, elapsed);
    }

    const sp = scrollRef.current;
    canvas.style.transform = `rotate(${sp * 15}deg) scale(${1 - sp * 0.05})`;

    animRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animRef.current = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animRef.current);
          animRef.current = 0;
        }
      },
      { threshold: 0 },
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="l-hero-canvas"
      aria-hidden="true"
    />
  );
}
