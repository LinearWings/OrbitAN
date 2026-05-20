"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSelectedTask } from "@/hooks/useSelectedTask";
import type { CanvasPlanetScreenPos } from "@/components/orbital/orbital-engine";

interface Point {
  x: number;
  y: number;
}

function pointsToPolyline(pts: Point[]): string {
  return pts.map((p, i) => (i === 0 ? `${p.x},${p.y}` : ` ${p.x},${p.y}`)).join("");
}

function buildRoute(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): Point[] {
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.hypot(dx, dy);
  if (dist < 20) return [{ x: startX, y: startY }, { x: endX, y: endY }];

  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const SQRT3 = Math.sqrt(3);

  if (ady <= SQRT3 * adx) {
    const hRun = ady / SQRT3;
    const midX = endX - Math.sign(dx) * hRun;
    return [
      { x: startX, y: startY },
      { x: midX, y: startY },
      { x: endX, y: endY },
    ];
  }

  const vRun = adx / SQRT3;
  const midY = endY - Math.sign(dy) * vRun;
  return [
    { x: startX, y: startY },
    { x: startX, y: midY },
    { x: endX, y: endY },
  ];
}

export default function ConnectorArrows() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { selectedTaskId } = useSelectedTask();
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const selectedRef = useRef<string | null>(null);

  // Keep selectedRef in sync without triggering re-renders
  selectedRef.current = selectedTaskId;

  const recompute = useCallback(
    (positions: CanvasPlanetScreenPos[]) => {
      const now = performance.now();
      if (now - lastUpdateRef.current < 80) return;
      lastUpdateRef.current = now;

      const svg = svgRef.current;
      if (!svg) return;

      const canvasEl = document.querySelector("[data-orbit-canvas]") as HTMLCanvasElement | null
        ?? document.querySelector("canvas") as HTMLCanvasElement | null;
      if (!canvasEl) return;

      const canvasRect = canvasEl.getBoundingClientRect();
      const currentSelected = selectedRef.current;

      // Clear existing arrows
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      if (positions.length === 0) return;

      const NS = "http://www.w3.org/2000/svg";

      for (const planet of positions) {
        const itemEl = document.querySelector(
          `[data-task-id="${planet.taskId}"]`,
        ) as HTMLElement | null;
        if (!itemEl) continue;

        const itemRect = itemEl.getBoundingClientRect();
        const planetViewX = canvasRect.left + planet.screenX;
        const planetViewY = canvasRect.top + planet.screenY;
        const cardMidX = (itemRect.left + itemRect.right) / 2;

        const approachFromLeft = planetViewX < cardMidX;
        const targetX = approachFromLeft ? itemRect.left : itemRect.right;
        const targetY = (itemRect.top + itemRect.bottom) / 2;

        const dx = targetX - planetViewX;
        const dy = targetY - planetViewY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) continue;

        // Arrow starts exactly at the arc midpoint on the orbit ring
        const edgeX = planetViewX;
        const edgeY = planetViewY;

        const pathPoints = buildRoute(edgeX, edgeY, targetX, targetY);
        const pointsStr = pointsToPolyline(pathPoints);

        const lastSeg = pathPoints[pathPoints.length - 1];
        const prevSeg = pathPoints[pathPoints.length - 2] ?? pathPoints[0];
        const arrDx = lastSeg.x - prevSeg.x;
        const arrDy = lastSeg.y - prevSeg.y;
        const angle = Math.atan2(arrDy, arrDx);

        const isActive = planet.taskId === currentSelected;

        // Build SVG elements directly via DOM to avoid React re-renders
        const g = document.createElementNS(NS, "g");

        // Glow layer
        const glow = document.createElementNS(NS, "polyline");
        glow.setAttribute("points", pointsStr);
        glow.setAttribute("fill", "none");
        glow.setAttribute("stroke", planet.color);
        glow.setAttribute("stroke-width", "4");
        glow.setAttribute("opacity", isActive ? "0.2" : "0.1");
        g.appendChild(glow);

        const polyline = document.createElementNS(NS, "polyline");
        polyline.setAttribute("points", pointsStr);
        polyline.setAttribute("fill", "none");
        polyline.setAttribute("stroke", planet.color);
        polyline.setAttribute("stroke-width", isActive ? "2" : "1.2");
        polyline.setAttribute("opacity", isActive ? "0.85" : "0.55");
        polyline.style.transition = "opacity 300ms ease, stroke-width 300ms ease";
        g.appendChild(polyline);

        const polygon = document.createElementNS(NS, "polygon");
        polygon.setAttribute("points", "-6,-4 6,0 -6,4");
        polygon.setAttribute("fill", planet.color);
        polygon.setAttribute("opacity", isActive ? "0.9" : "0.5");
        polygon.setAttribute("transform",
          `translate(${lastSeg.x}, ${lastSeg.y}) rotate(${(angle * 180) / Math.PI})`);
        polygon.style.transition = "opacity 300ms ease";
        g.appendChild(polygon);

        svg.appendChild(g);
      }
    },
    [], // No deps — uses refs for all mutable values
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CanvasPlanetScreenPos[]>).detail;
      if (detail && Array.isArray(detail)) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => recompute(detail));
      }
    };

    window.addEventListener("threeclock-planet-positions", handler);
    return () => {
      window.removeEventListener("threeclock-planet-positions", handler);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [recompute]);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed inset-0 z-30"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
