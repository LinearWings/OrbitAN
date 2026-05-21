// Pure Canvas 2D rendering engine for the orbital clock
// Exports rendering helpers for planet/clock background + dynamic rendering.

import type { CometPosition, Task } from "@/types";
import { timeToAngle, getTaskDuration } from "@/utils/time";
import { getTaskColor } from "@/utils/colors";
import { getOrbitRingIndex } from "@/utils/orbital";
import { getPlanetScreenRadius } from "@/utils/orbital";
import {
  CLOCK_FACE_COLOR,
  CLOCK_HAND_COLOR,
  FILM_GRAIN_OPACITY,
  FILM_GRAIN_SIZE,
  ORBIT_RING_COLOR_A,
  ORBIT_RING_COLOR_B,
  ORBIT_RING_RADII_FRACTIONS,
  CONSTRUCTIVIST_ENABLED,
  CONSTRUCTIVIST_YELLOW,
  CONSTRUCTIVIST_BLUE,
  CONSTRUCTIVIST_CIRCLE_OPACITY,
  CONSTRUCTIVIST_LINE_OPACITY,
  CONSTRUCTIVIST_RECT_OPACITY,
  CONSTRUCTIVIST_DIAG_COUNT,
} from "@/data/constants";
// no external color helpers needed here

// NOTE: This module intentionally avoids any React usage and exports pure
// rendering helpers that can be invoked by a React component's animation loop.

let FILM_GRAIN_CANVAS: HTMLCanvasElement | null = null;
let FILM_GRAIN_COMPOSITE_CANVAS: HTMLCanvasElement | null = null;
let STATIC_BG_CANVAS: HTMLCanvasElement | null = null;

function ensureStaticBackground(
  width: number,
  height: number,
  cx: number,
  cy: number,
  maxRadius: number,
  dialRadius: number,
  dpr: number,
): HTMLCanvasElement {
  const w = Math.floor(width * dpr);
  const h = Math.floor(height * dpr);
  if (
    STATIC_BG_CANVAS &&
    STATIC_BG_CANVAS.width === w &&
    STATIC_BG_CANVAS.height === h
  ) {
    return STATIC_BG_CANVAS;
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const bgCtx = canvas.getContext('2d')!;
  bgCtx.scale(dpr, dpr);
  drawConstructivistGeometry(bgCtx, cx, cy, maxRadius, width, height);
  drawClockDial(bgCtx, cx, cy, dialRadius);
  drawClock24hTicks(bgCtx, cx, cy, dialRadius, maxRadius);
  drawOrbitRings(bgCtx, cx, cy, maxRadius);
  STATIC_BG_CANVAS = canvas;
  return canvas;
}

function ensureFilmGrainTexture() {
  if (FILM_GRAIN_CANVAS) return;
  const size = FILM_GRAIN_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  FILM_GRAIN_CANVAS = canvas;
}

export function drawConstructivistGeometry(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxRadius: number,
  w: number,
  h: number,
) {
  if (!CONSTRUCTIVIST_ENABLED) return;

  ctx.save();

  // ── Large concentric circles (constructivist signature) ──
  ctx.strokeStyle = CONSTRUCTIVIST_YELLOW;
  ctx.globalAlpha = CONSTRUCTIVIST_CIRCLE_OPACITY;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius * 0.72, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = CONSTRUCTIVIST_BLUE;
  ctx.globalAlpha = CONSTRUCTIVIST_CIRCLE_OPACITY * 0.85;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius * 0.72 * 0.62, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = CONSTRUCTIVIST_YELLOW;
  ctx.globalAlpha = CONSTRUCTIVIST_CIRCLE_OPACITY * 0.7;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius * 0.72 * 0.35, 0, Math.PI * 2);
  ctx.stroke();

  // Rectangles and diagonals removed for cleaner clock face

  ctx.restore();
}

// PUBLIC API
export function drawClock24hTicks(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  dialRadius: number,
  maxRadius: number,
) {
  const innerR = dialRadius + 6;
  const outerR = maxRadius * 0.66 - 2;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // ── Day/Night zone shading — very subtle radial gradient ──
  const zoneGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
  zoneGrad.addColorStop(0, "rgba(37, 99, 235, 0.008)");
  zoneGrad.addColorStop(0.5, "rgba(234, 179, 8, 0.010)");
  zoneGrad.addColorStop(1, "rgba(37, 99, 235, 0.008)");
  ctx.fillStyle = zoneGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fill();

  // ── Ticks and labels (three-tier hierarchy) ──
  for (let h = 0; h < 24; h++) {
    const angle = (h / 24) * Math.PI * 2 - Math.PI / 2;
    const isQuarter = h % 6 === 0;          // 00, 06, 12, 18 — boldest
    const isMajor = h % 3 === 0;            // every 3h — labeled
    const tickOuter = outerR - (isMajor ? 0 : isQuarter ? 2 : 6);
    const tickInner = innerR + (isMajor ? 0 : 8);

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * tickInner, cy + Math.sin(angle) * tickInner);
    ctx.lineTo(cx + Math.cos(angle) * tickOuter, cy + Math.sin(angle) * tickOuter);
    ctx.strokeStyle = isQuarter
      ? "rgba(229,229,229,0.55)"
      : isMajor
        ? "rgba(229,229,229,0.38)"
        : "rgba(229,229,229,0.22)";
    ctx.lineWidth = isQuarter ? 1.4 : isMajor ? 1.0 : 0.6;
    ctx.stroke();

    if (isMajor) {
      const label = String(h).padStart(2, "0");
      const lr = outerR + 12;
      const lx = cx + Math.cos(angle) * lr;
      const ly = cy + Math.sin(angle) * lr;
      ctx.font = isQuarter
        ? "700 10px 'JetBrains Mono', monospace"
        : "500 8.5px 'JetBrains Mono', monospace";
      ctx.fillStyle = isQuarter
        ? "rgba(229,229,229,0.6)"
        : "rgba(229,229,229,0.4)";
      ctx.fillText(label, lx, ly);
    }
  }

  ctx.restore();
}

export function drawOrbitRings(ctx: CanvasRenderingContext2D, cx: number, cy: number, maxRadius: number) {
  // 6 concentric rings outside the clock dial, alternating amber/blue
  const count = ORBIT_RING_RADII_FRACTIONS.length;
  ctx.save();
  for (let i = 0; i < count; i++) {
    const r = ORBIT_RING_RADII_FRACTIONS[i] * maxRadius;
    const color = (i % 2 === 0) ? ORBIT_RING_COLOR_A : ORBIT_RING_COLOR_B;
    const alpha = 0.35 - (i * 0.04);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.0;
    ctx.globalAlpha = Math.max(alpha, 0.08);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawClockDial(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  // Outer bezel: 4 concentric bevel rings using radial gradients
  ctx.save();
  for (let i = 0; i < 4; i++) {
    const ringR = radius - i * 2;
    const inner = ringR - 6;
    const grad = ctx.createRadialGradient(cx, cy, inner * 0.5, cx, cy, ringR);
    grad.addColorStop(0, '#1A1A1A');
    grad.addColorStop(1, '#0A0A0A');
    ctx.lineWidth = 4 - i * 0.5;
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Face
  ctx.fillStyle = CLOCK_FACE_COLOR;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 8, 0, Math.PI * 2);
  ctx.fill();

  // Ticks
  const tickOuter = radius - 4;
  const hourTickLen = 14;
  for (let h = 0; h < 12; h++) {
    const angle = h * (Math.PI * 2) / 12 - Math.PI / 2;
    const isBold = h === 0 || h === 3 || h === 6 || h === 9;
    ctx.lineWidth = isBold ? 2 : 1;
    ctx.strokeStyle = '#E5E5E5';
    const x0 = cx + Math.cos(angle) * (tickOuter - hourTickLen);
    const y0 = cy + Math.sin(angle) * (tickOuter - hourTickLen);
    const x1 = cx + Math.cos(angle) * tickOuter;
    const y1 = cy + Math.sin(angle) * tickOuter;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  // 60 minute ticks (shorter)
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = '#E5E5E5';
  for (let m = 0; m < 60; m++) {
    const angle = m * (Math.PI * 2) / 60 - Math.PI / 2;
    const x0 = cx + Math.cos(angle) * (radius - 6);
    const y0 = cy + Math.sin(angle) * (radius - 6);
    const x1 = cx + Math.cos(angle) * (radius - 2);
    const y1 = cy + Math.sin(angle) * (radius - 2);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  // Center cap
  ctx.fillStyle = '#E5E5E5';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawClockHands(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  now: Date,
  dialRadius: number,
) {
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourAngle = (-Math.PI / 2) + ((h % 12) + m / 60 + s / 3600) * (Math.PI / 6);
  const minuteAngle = (-Math.PI / 2) + (m + s / 60) * (Math.PI / 30);
  const secondAngle = (-Math.PI / 2) + s * (Math.PI / 30);

  const hourLen = dialRadius * 0.48;
  const minuteLen = dialRadius * 0.66;
  const secondLen = dialRadius * 0.74;

  // Hour hand
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#2563EB";
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(hourAngle) * hourLen, cy + Math.sin(hourAngle) * hourLen);
  ctx.stroke();

  // Minute hand
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(minuteAngle) * minuteLen, cy + Math.sin(minuteAngle) * minuteLen);
  ctx.stroke();

  // Second hand
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#2563EB';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(secondAngle) * secondLen, cy + Math.sin(secondAngle) * secondLen);
  ctx.stroke();

  // Center hub
  ctx.fillStyle = CLOCK_HAND_COLOR;
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
}

// ═══════════════════════════════════════════════════════════════
// PLANET SCREEN POSITIONS — replaces THREE.js position computation
// ═══════════════════════════════════════════════════════════════

export interface CanvasPlanetScreenPos {
  taskId: string;
  screenX: number;
  screenY: number;
  radius: number;
  color: string;
  isActive: boolean;
  headX?: number;
  headY?: number;
  tailX?: number;
  tailY?: number;
}

/**
 * Compute 2D screen positions for all tasks, placed on the same concentric
 * orbit rings as drawOrbitRings. Returns data needed by ConnectorArrows.
 */
export function computePlanetScreenPositions(
  tasks: Task[],
  cx: number,
  cy: number,
  maxRadius: number,
): CanvasPlanetScreenPos[] {
  return tasks.map((task) => {
    const duration = getTaskDuration(task);
    const orbitIdx = getOrbitRingIndex(duration);
    const orbitR = ORBIT_RING_RADII_FRACTIONS[orbitIdx] * maxRadius;

    // timeToAngle: 0 rad = 6am (right/+X), π rad = 6pm (left/-X)
    const angle = timeToAngle(task.startTime);

    const x = cx + Math.cos(angle) * orbitR;
    const y = cy + Math.sin(angle) * orbitR;
    const color = getTaskColor(task.type);
    const radius = getPlanetScreenRadius(duration);

    return { taskId: task.id, screenX: x, screenY: y, radius, color, isActive: false };
  });
}

export function drawCometTrail(
  ctx: CanvasRenderingContext2D,
  comet: CometPosition,
  isSelected: boolean,
  isHovered: boolean,
  time: number,
  cx: number,
  cy: number,
  dialRadius: number,
) {
  const { headX, headY, headRadius, startAngle, endAngle, orbitRadius, color, colorRgb, progress } = comet;
  const { r: cr, g: cg, b: cb } = colorRgb;
  const glow = isSelected || isHovered;

  let cStart = startAngle;
  let cEnd = endAngle;
  // Normalize end angle for overnight tasks so arc always sweeps clockwise
  if (cEnd <= cStart) cEnd += Math.PI * 2;

  const arcSpan = cEnd - cStart;
  const isAllDay = arcSpan > 6.1; // ~350°

  const trailW = headRadius * 1.2;
  // Segmented arc trail: opacity increases from tail to head along the arc
  const segments = 24;
  ctx.save();
  ctx.lineCap = "butt";

  if (isAllDay) {
    // All-day: render as a full ring with low opacity
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.18)`;
    ctx.lineWidth = trailW * 0.6;
    ctx.beginPath();
    ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

  for (let s = 0; s < segments; s++) {
    const t0 = s / segments;
    const t1 = (s + 1) / segments;
    const alpha0 = 0.25 + t0 * 0.5;
    const alpha1 = 0.25 + t1 * 0.5;
    const a0 = cStart + (cEnd - cStart) * t0;
    const a1 = cStart + (cEnd - cStart) * t1;
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(alpha0 + alpha1) / 2})`;
    ctx.lineWidth = trailW;
    ctx.beginPath();
    ctx.arc(cx, cy, orbitRadius, a0, a1, false);
    ctx.stroke();
  }
  ctx.restore();

  const r = headRadius;

  // Glass body — radial gradient for a 3D sphere look, consistent with isometric planets
  const gCx = headX - r * 0.28;
  const gCy = headY - r * 0.28;
  const bodyGrad = ctx.createRadialGradient(gCx, gCy, r * 0.02, headX, headY, r);
  bodyGrad.addColorStop(0, `rgba(255,255,255,0.65)`);
  bodyGrad.addColorStop(0.08, color);
  bodyGrad.addColorStop(0.25, `rgba(${cr},${cg},${cb},0.5)`);
  bodyGrad.addColorStop(0.55, `rgba(${cr},${cg},${cb},0.3)`);
  bodyGrad.addColorStop(0.8, `rgba(${Math.floor(cr * 0.5)},${Math.floor(cg * 0.5)},${Math.floor(cb * 0.5)},0.45)`);
  bodyGrad.addColorStop(1, `rgba(${Math.floor(cr * 0.3)},${Math.floor(cg * 0.3)},${Math.floor(cb * 0.3)},0.6)`);
  ctx.save();
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(headX, headY, r, 0, Math.PI * 2);
  ctx.fill();

  // Specular highlight (upper-left, bright white reflection)
  const hlGrad = ctx.createRadialGradient(
    headX - r * 0.28, headY - r * 0.28, 0,
    headX - r * 0.28, headY - r * 0.28, r * 0.4,
  );
  hlGrad.addColorStop(0, `rgba(255,255,255,0.85)`);
  hlGrad.addColorStop(0.12, `rgba(255,255,255,0.4)`);
  hlGrad.addColorStop(0.35, `rgba(255,255,255,0.08)`);
  hlGrad.addColorStop(1, `rgba(255,255,255,0)`);
  ctx.fillStyle = hlGrad;
  ctx.beginPath();
  ctx.ellipse(headX - r * 0.28, headY - r * 0.28, r * 0.38, r * 0.2, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Arc highlight ring on the head
  ctx.save();
  const strokeStart = startAngle - Math.PI / 2;
  const strokeEnd = startAngle + Math.PI / 2;
  ctx.beginPath();
  ctx.arc(headX, headY, r, strokeStart, strokeEnd, false);
  ctx.strokeStyle = `rgba(${cr},${cg},${cb},${glow ? 0.85 : 0.55})`;
  ctx.lineWidth = glow ? 2.0 : 1.4;
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = isSelected ? 16 : 6;
  }
  ctx.stroke();
  ctx.restore();

  if (glow) {
    const outerPulse = 0.5 + Math.sin(time * 0.003) * 0.2;
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = isSelected ? 24 : 12;
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${isSelected ? (0.5 + outerPulse * 0.3) : 0.35})`;
    ctx.lineWidth = isSelected ? 2.0 : 1.0;
    ctx.beginPath();
    ctx.arc(headX, headY, r * 1.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (progress > 0 && progress < 100) {
    const arcAngle = (progress / 100) * Math.PI * 2;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = glow ? 2.0 : 1.0;
    ctx.shadowColor = "rgba(255,255,255,0.4)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(headX, headY, r + 3, -Math.PI / 2, -Math.PI / 2 + arcAngle);
    ctx.stroke();
    ctx.restore();
  }

  const tickInnerR = dialRadius + 6;

  const drawDashedRadial = (angle: number) => {
    const lx = cx + Math.cos(angle) * orbitRadius;
    const ly = cy + Math.sin(angle) * orbitRadius;
    const tx = cx + Math.cos(angle) * tickInnerR;
    const ty = cy + Math.sin(angle) * tickInnerR;
    ctx.save();
    ctx.setLineDash([2.5, 3.5]);
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${glow ? 0.55 : 0.25})`;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  };

  drawDashedRadial(startAngle);

  const startHour = Math.round((startAngle / Math.PI) * 12 + 6) % 24;
  const endHour = Math.round((endAngle / Math.PI) * 12 + 6) % 24;
  if (endHour !== startHour) {
    drawDashedRadial(endAngle);
  }
}

export function drawCometLabel(
  ctx: CanvasRenderingContext2D,
  comet: CometPosition,
  isSelected: boolean,
  isHovered: boolean,
) {
  const { headX, headY, headRadius, color, colorRgb, taskName, taskId } = comet;
  if (!taskName) return;

  const labelY = headY - headRadius - 14;
  const visible = isSelected || isHovered;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (visible) {
    const label = taskName;
    const fontSize = Math.max(9, headRadius * 0.8);
    ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;

    const textWidth = ctx.measureText(label).width;
    const padding = 6;
    const bgH = fontSize + padding * 2;
    const bgW = textWidth + padding * 2;
    const bgX = headX - bgW / 2;
    const bgY = labelY - bgH / 2;

    ctx.fillStyle = "rgba(10,10,15,0.65)";
    ctx.strokeStyle = `rgba(${colorRgb.r},${colorRgb.g},${colorRgb.b},0.35)`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgW, bgH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillText(label, headX, labelY);
  }

  ctx.restore();
}

export function drawFilmGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dpr: number,
) {
  ensureFilmGrainTexture();
  if (!FILM_GRAIN_CANVAS) return;

  const w = Math.floor(width * dpr);
  const h = Math.floor(height * dpr);

  if (
    !FILM_GRAIN_COMPOSITE_CANVAS ||
    FILM_GRAIN_COMPOSITE_CANVAS.width !== w ||
    FILM_GRAIN_COMPOSITE_CANVAS.height !== h
  ) {
    const composite = document.createElement('canvas');
    composite.width = w;
    composite.height = h;
    const cctx = composite.getContext('2d')!;
    cctx.scale(dpr, dpr);

    const pattern = cctx.createPattern(FILM_GRAIN_CANVAS, 'repeat');
    if (!pattern) return;
    cctx.fillStyle = pattern;
    cctx.fillRect(0, 0, width, height);

    cctx.globalCompositeOperation = 'destination-in';
    const maxDim = Math.max(width, height);
    const grad = cctx.createRadialGradient(cx, cy, maxDim * 0.2, cx, cy, maxDim * 0.58);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.45, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    cctx.fillStyle = grad;
    cctx.fillRect(0, 0, width, height);

    FILM_GRAIN_COMPOSITE_CANVAS = composite;
  }

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = FILM_GRAIN_OPACITY;
  ctx.drawImage(FILM_GRAIN_COMPOSITE_CANVAS, 0, 0, width, height);
  ctx.restore();
}

export function initCanvas(canvas: HTMLCanvasElement) {
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return {
    canvas,
    ctx,
    width: cssW,
    height: cssH,
    cx: cssW / 2,
    cy: cssH / 2,
    dpr,
  };
}

export function renderClockCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cx: number,
  cy: number,
  now: Date,
  dpr: number = 1,
) {
  ctx.clearRect(0, 0, width, height);
  const maxRadius = Math.min(width, height) * 0.4;
  const dialRadius = maxRadius * 0.62;

  // Clip to circle for clean circular canvas
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, maxRadius * 0.98, 0, Math.PI * 2);
  ctx.clip();

  const bg = ensureStaticBackground(width, height, cx, cy, maxRadius, dialRadius, dpr);
  ctx.drawImage(bg, 0, 0, width, height);

  drawClockHands(ctx, cx, cy, now, dialRadius);
  ctx.restore();
}
