// Isometric pseudo-3D rendering engine for the orbital clock.
// All functions are pure Canvas 2D calls — no React, no side effects outside canvas.
// Replaces the 2D clock dial / hands / orbit rings from orbital-engine.ts
// while preserving drawFilmGrain and initCanvas from that module.

import type { Task } from "@/types";
import {
  CLOCK_FACE_COLOR,
  CLOCK_HAND_COLOR,
  NEBULA_PARTICLE_COUNT,
  NEBULA_COLOR_AMBER,
  NEBULA_COLOR_BLUE,
  NEBULA_COLOR_VIOLET,
  NEBULA_OPACITY_MIN,
  NEBULA_OPACITY_MAX,
  ORBIT_RING_COUNT,
  ORBIT_RING_COLOR_A,
  ORBIT_RING_COLOR_B,
  UNIFIED_RADIUS,
} from "@/data/constants";
import { timeToAngle, timeToMinutes } from "@/utils/time";
import { getTaskColor } from "@/utils/colors";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface IsoVec3 {
  x: number; // 3D X axis (projects to screen lower-right)
  y: number; // 3D Y axis (projects to screen lower-left)
  z: number; // 3D Z axis (projects to screen up)
}

export interface IsoVec2 {
  x: number;
  y: number;
}

export interface IsoDialConfig {
  cx: number;            // canvas center X (pixels)
  cy: number;            // canvas center Y (pixels)
  dialRadius: number;    // clock face radius in 3D space
  faceThickness: number; // thickness of the clock body (Z axis)
  bezelSteps: number;    // concentric bezel ring count (default 4)
}

export interface IsoPlanet {
  id: string;
  x3d: number;
  y3d: number;
  z3d: number;
  screenX: number;       // projected screen X (canvas-relative, origin at cx)
  screenY: number;       // projected screen Y (canvas-relative, origin at cy)
  radius: number;        // visual radius in pixels
  color: string;
  colorRgb: { r: number; g: number; b: number };
  progress: number;      // 0..1
  taskId: string;
  taskName?: string;
  taskTime?: string;
  floatPhase: number;    // unique float animation phase
  orbitIndex: number;    // 0–5 which ring
  angle: number;         // rad on the orbit
}

export interface IsoRenderParams {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  cx: number;
  cy: number;
  now: Date;
  animationTime: number;
  planets: IsoPlanet[];
  selectedIndex: number | null;
  hoveredIndex: number | null;
}

// ═══════════════════════════════════════════════════════════════
// ISOMETRIC PROJECTION CORE
// ═══════════════════════════════════════════════════════════════

const ISO_COS = Math.cos(Math.PI / 6); // cos(30°) ≈ 0.8660254
const ISO_SIN = Math.sin(Math.PI / 6); // sin(30°) = 0.5

/** Project a 3D point in isometric space to 2D screen coordinates.
 *  Origin is at the canvas center (cx, cy).
 *  X axis → screen lower-right, Y → screen lower-left, Z → screen up.
 */
export function toScreen(x3d: number, y3d: number, z3d: number): IsoVec2 {
  return {
    x: (x3d - y3d) * ISO_COS,
    y: (x3d + y3d) * ISO_SIN - z3d,
  };
}

/** Return a point on an isometric circle (circle in 3D XY-plane at height z).
 *  t ∈ [0, 2π] traces the full circle.
 */
export function isoCirclePoint(
  t: number,
  radius: number,
  height: number,
  cx: number,
  cy: number,
): IsoVec2 {
  const x3d = radius * Math.cos(t);
  const y3d = radius * Math.sin(t);
  const z3d = height;
  const s = toScreen(x3d, y3d, z3d);
  return { x: cx + s.x, y: cy + s.y };
}

/** Convert a hex color string to an rgb object. */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const s = hex.replace("#", "");
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
}

/** Build an rgba() string from rgb components and optional alpha. */
function rgba(r: number, g: number, b: number, a?: number): string {
  return typeof a === "number"
    ? `rgba(${r},${g},${b},${a})`
    : `rgb(${r},${g},${b})`;
}

// ═══════════════════════════════════════════════════════════════
// NEBULA PARTICLE CACHE (independent from orbital-engine.ts)
// ═══════════════════════════════════════════════════════════════

interface NebulaParticle {
  orbitRing: number;
  orbitRadius: number;
  startAngle: number;
  angularSpeed: number;
  heightBase: number;
  heightAmp: number;
  heightFreq: number;
  color: string;
  colorR: number;
  colorG: number;
  colorB: number;
  opacity: number;
  size: number;
}

const NEBULA_PARTICLES: NebulaParticle[] = [];

function ensureNebulaParticles(
  faceA: number,
  baseStep: number,
): void {
  if (NEBULA_PARTICLES.length > 0) return;
  const colors = [NEBULA_COLOR_AMBER, NEBULA_COLOR_BLUE, NEBULA_COLOR_VIOLET];
  const particlesPerRing = Math.ceil(NEBULA_PARTICLE_COUNT / ORBIT_RING_COUNT);

  for (let ring = 0; ring < ORBIT_RING_COUNT; ring++) {
    const ra = faceA + (ring + 1) * baseStep * 0.7;
    const baseSpeed = 0.00008 - ring * 0.00001;

    for (let j = 0; j < particlesPerRing; j++) {
      const hex = colors[Math.floor(Math.random() * colors.length)];
      const rgb = hexToRgb(hex);
      NEBULA_PARTICLES.push({
        orbitRing: ring,
        orbitRadius: ra,
        startAngle: Math.random() * Math.PI * 2,
        angularSpeed: baseSpeed * (0.6 + Math.random() * 0.8),
        heightBase: (Math.random() - 0.5) * 25,
        heightAmp: 3 + Math.random() * 8,
        heightFreq: 0.0003 + Math.random() * 0.0006,
        color: hex,
        colorR: rgb.r,
        colorG: rgb.g,
        colorB: rgb.b,
        opacity: NEBULA_OPACITY_MIN + Math.random() * (NEBULA_OPACITY_MAX - NEBULA_OPACITY_MIN),
        size: 1.5 + Math.random() * 2.5,
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// 1. ISOMETRIC BASE PLATE
// ═══════════════════════════════════════════════════════════════

export function drawIsoBase(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
): void {
  const { cx, cy, dialRadius, faceThickness } = config;

  // The base is a thick "coin" — a circle in XY plane extruded in Z.
  // In isometric projection it becomes a stack of ellipses.
  const a = dialRadius * 1.22; // major axis (cos30*(R-(-R)) = cos30*2R ≈ 1.22R)
  const b = dialRadius * 0.71; // minor axis (sin30*2R = R)

  ctx.save();

  // ── Layer 3 (bottommost): deep shadow drop ──
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(cx + 4, cy + 6, a * 1.08, b * 1.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Layer 2: bevelled slope (bottom face) ──
  const bevelGrad = ctx.createLinearGradient(
    cx - a * 0.7, cy - b * 0.7,
    cx + a * 0.7, cy + b * 0.7,
  );
  bevelGrad.addColorStop(0, "rgba(15, 15, 15, 1)");
  bevelGrad.addColorStop(0.4, "rgba(8, 8, 8, 1)");
  bevelGrad.addColorStop(1, "rgba(3, 3, 3, 1)");
  ctx.fillStyle = bevelGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + faceThickness * 0.3, a * 1.02, b * 1.02, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Layer 1: top face with metallic gradient ──
  const topGrad = ctx.createRadialGradient(
    cx - a * 0.15, cy - b * 0.15, 0,
    cx, cy, a,
  );
  topGrad.addColorStop(0, "#1e1e1e");
  topGrad.addColorStop(0.5, "#0f0f0f");
  topGrad.addColorStop(1, "#050505");
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Top face rim highlight ──
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 2. ISOMETRIC CLOCK DIAL
// ═══════════════════════════════════════════════════════════════

export function drawIsoDial(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
): void {
  const { cx, cy, dialRadius, bezelSteps } = config;
  const a = dialRadius * 1.22;
  const b = dialRadius * 0.71;

  ctx.save();

  // ── 4 concentric bezel rings (outer → inner) ──
  for (let i = 0; i < bezelSteps; i++) {
    const shrink = i * 3;
    const ra = a - shrink;
    const rb = b - shrink;
    const offsetY = (bezelSteps - 1 - i) * 0.5; // top rings slightly raised

    // Bevel gradient: light at top-left, dark at bottom-right
    const bevel = ctx.createLinearGradient(
      cx - ra * 0.6, cy - rb * 0.6 - offsetY,
      cx + ra * 0.6, cy + rb * 0.6 - offsetY,
    );
    bevel.addColorStop(0, "rgba(255, 255, 255, 0.06)");
    bevel.addColorStop(0.35, "rgba(0, 0, 0, 0)");
    bevel.addColorStop(0.7, "rgba(0, 0, 0, 0.2)");
    bevel.addColorStop(1, "rgba(0, 0, 0, 0.35)");

    ctx.strokeStyle = bevel;
    ctx.lineWidth = 3.5 - i * 0.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy - offsetY, ra, rb, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── Dial face (elliptical, dark) ──
  const faceA = a - bezelSteps * 3;
  const faceB = b - bezelSteps * 3;
  const faceGrad = ctx.createRadialGradient(
    cx - faceA * 0.1, cy - faceB * 0.1, 0,
    cx, cy, faceA,
  );
  faceGrad.addColorStop(0, "#0c0c0c");
  faceGrad.addColorStop(0.5, CLOCK_FACE_COLOR);
  faceGrad.addColorStop(1, "#060606");
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, faceA, faceB, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Subtle inner face rim ──
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, faceA, faceB, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 3. CLOCK TICKS (on elliptical dial face)
// ═══════════════════════════════════════════════════════════════

export function drawIsoTicks(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
): void {
  const { cx, cy, dialRadius, bezelSteps } = config;
  const a = dialRadius * 1.22 - bezelSteps * 3 - 4;
  const b = dialRadius * 0.71 - bezelSteps * 3 - 4;

  ctx.save();
  ctx.strokeStyle = CLOCK_HAND_COLOR;

  // ── 12 hour ticks (bold at 12, 3, 6, 9) ──
  for (let h = 0; h < 12; h++) {
    // Map hour to angle on the ellipse: 12 o'clock at top, clockwise
    const angle = (h * Math.PI) / 6;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const isBold = h === 0 || h === 3 || h === 6 || h === 9;

    ctx.lineWidth = isBold ? 2 : 1;
    ctx.strokeStyle = isBold ? "#E5E5E5" : "rgba(229, 229, 229, 0.6)";

    const outerX = cx + a * cosA;
    const outerY = cy - b * sinA;
    const innerLen = isBold ? 14 : 10;
    const innerX = cx + (a - innerLen) * cosA;
    const innerY = cy - (b - innerLen) * sinA;

    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(outerX, outerY);
    ctx.stroke();
  }

  // ── 60 minute ticks (shorter, thinner) ──
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "rgba(229, 229, 229, 0.35)";
  for (let m = 0; m < 60; m++) {
    if (m % 5 === 0) continue; // skip hour positions
    const angle = (m * Math.PI) / 30;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const outerX = cx + a * cosA;
    const outerY = cy - b * sinA;
    const innerX = cx + (a - 5) * cosA;
    const innerY = cy - (b - 5) * sinA;

    ctx.beginPath();
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(outerX, outerY);
    ctx.stroke();
  }

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 4. CLOCK HANDS (projected onto elliptical face)
// ═══════════════════════════════════════════════════════════════

export function drawIsoHands(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
  now: Date,
): void {
  const { cx, cy, dialRadius, bezelSteps } = config;
  const a = dialRadius * 1.22 - bezelSteps * 3;
  const b = dialRadius * 0.71 - bezelSteps * 3;

  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourAngle = (h + m / 60 + s / 3600) * (Math.PI / 6);
  const minuteAngle = (m + s / 60) * (Math.PI / 30);
  const secondAngle = s * (Math.PI / 30);

  ctx.save();

  drawHandTapered(ctx, cx, cy, a, b, hourAngle, 0.32, 3.5, "#2563EB");
  drawHandTapered(ctx, cx, cy, a, b, minuteAngle, 0.50, 2.2, "#E5E5E5");
  drawHandTapered(ctx, cx, cy, a, b, secondAngle, 0.58, 1.0, "#EF4444");

  const hubR = dialRadius * 0.055;
  const hubA = hubR * 1.22;
  const hubB = hubR * 0.71;

  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.ellipse(cx, cy, hubA + 2, hubB + 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  const hubGrad = ctx.createRadialGradient(cx - hubA * 0.15, cy - hubB * 0.15, 0, cx, cy, hubA);
  hubGrad.addColorStop(0, "#F5F5F5");
  hubGrad.addColorStop(0.25, "#E5E5E5");
  hubGrad.addColorStop(0.5, "#9CA3AF");
  hubGrad.addColorStop(0.75, "#374151");
  hubGrad.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = hubGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, hubA, hubB, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, hubA, hubB, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawHandTapered(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  a: number,
  b: number,
  angle: number,
  lengthRatio: number,
  baseWidth: number,
  color: string,
): void {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const tipX = cx + a * cosA * lengthRatio;
  const tipY = cy - b * sinA * lengthRatio;

  const perpX = -sinA * baseWidth * 0.5;
  const perpY = -cosA * baseWidth * 0.5;

  const baseRX = cx + perpX;
  const baseRY = cy + perpY;
  const baseLX = cx - perpX;
  const baseLY = cy - perpY;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(baseRX, baseRY);
  ctx.lineTo(baseLX, baseLY);
  ctx.closePath();
  ctx.fill();

  const edgeGrad = ctx.createLinearGradient(cx, cy - baseWidth, cx, cy + baseWidth);
  edgeGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
  edgeGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  edgeGrad.addColorStop(1, "rgba(0, 0, 0, 0.25)");
  ctx.fillStyle = edgeGrad;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(baseRX, baseRY);
  ctx.lineTo(baseLX, baseLY);
  ctx.closePath();
  ctx.fill();
}

// ═══════════════════════════════════════════════════════════════
// 5. ORBIT RINGS (elliptical, layered)
// ═══════════════════════════════════════════════════════════════

export function drawIsoOrbitRings(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
): void {
  const { cx, cy, dialRadius, bezelSteps } = config;
  const count = ORBIT_RING_COUNT; // 6
  const faceA = dialRadius * 1.22 - bezelSteps * 3;
  const baseStep = faceA * 0.25;   // radius increment per ring

  ctx.save();

  for (let i = 0; i < count; i++) {
    const ra = faceA + (i + 1) * baseStep * 0.7;
    const rb = ra * (0.71 / 1.22); // maintain ellipse ratio
    const color = i % 2 === 0 ? ORBIT_RING_COLOR_A : ORBIT_RING_COLOR_B;
    const alpha = 0.3 - i * 0.04;  // inner brighter, outer dimmer

    ctx.strokeStyle = color;
    ctx.globalAlpha = Math.max(alpha, 0.06);
    ctx.lineWidth = 0.5;

    // Archimedean spiral wobble (gentle sinusoidal perturbation)
    ctx.beginPath();
    const segments = 360;
    const wobbleAmp = 2.0 + i * 0.3;
    for (let s = 0; s <= segments; s++) {
      const t = (s / segments) * Math.PI * 2;
      const wobble = Math.sin(t * 3 + i) * wobbleAmp;
      const wr = ra + wobble;
      const x = cx + wr * Math.cos(t);
      const y = cy - rb * Math.sin(t) * (wr / ra);  // maintain shape
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 6. ISOMETRIC PLANET (liquid glass sphere at isometric position)
// ═══════════════════════════════════════════════════════════════

export function drawIsoPlanet(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
  planet: IsoPlanet,
  isSelected: boolean,
  isHovered: boolean,
  time: number,
): void {
  const { cx, cy } = config;
  const px = cx + planet.screenX;
  const py = cy + planet.screenY;
  const r = planet.radius;
  const { r: cr, g: cg, b: cb } = planet.colorRgb;
  const glow = isSelected || isHovered;

  // ── Float animation ──
  const floatY = Math.sin(time * 0.001 + planet.floatPhase) * 2.5;
  const fy = py + floatY;

  // ── Isometric drop shadow (ellipse along iso direction) ──
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(px + 1.5, fy + r * 0.55, r * 0.8, r * 0.14, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── Outer atmosphere (broad soft glow) ──
  const outerAtmoR = r * 1.8;
  const outerAtmo = ctx.createRadialGradient(px, fy, r * 0.3, px, fy, outerAtmoR);
  outerAtmo.addColorStop(0, rgba(cr, cg, cb, 0));
  outerAtmo.addColorStop(0.4, rgba(cr, cg, cb, 0.05));
  outerAtmo.addColorStop(1, rgba(cr, cg, cb, 0));
  ctx.fillStyle = outerAtmo;
  ctx.beginPath();
  ctx.arc(px, fy, outerAtmoR, 0, Math.PI * 2);
  ctx.fill();

  // ── Inner atmosphere (tight, brighter) ──
  const innerAtmoR = r * 1.3;
  const innerAtmo = ctx.createRadialGradient(px, fy, r * 0.7, px, fy, innerAtmoR);
  innerAtmo.addColorStop(0, rgba(cr, cg, cb, 0));
  innerAtmo.addColorStop(0.55, rgba(cr, cg, cb, 0.12));
  innerAtmo.addColorStop(1, rgba(cr, cg, cb, 0));
  ctx.fillStyle = innerAtmo;
  ctx.beginPath();
  ctx.arc(px, fy, innerAtmoR, 0, Math.PI * 2);
  ctx.fill();

  // ── Glass edge thickness (dark outer rim, depth illusion) ──
  const edgeGrad = ctx.createRadialGradient(px, fy, r * 0.85, px, fy, r);
  edgeGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  edgeGrad.addColorStop(0.45, "rgba(0, 0, 0, 0.03)");
  edgeGrad.addColorStop(0.75, rgba(Math.floor(cr * 0.5), Math.floor(cg * 0.5), Math.floor(cb * 0.5), 0.25));
  edgeGrad.addColorStop(1, rgba(Math.floor(cr * 0.3), Math.floor(cg * 0.3), Math.floor(cb * 0.3), 0.55));
  ctx.fillStyle = edgeGrad;
  ctx.beginPath();
  ctx.arc(px, fy, r, 0, Math.PI * 2);
  ctx.fill();

  // ── Glass body gradient (translucent core with color) ──
  const gCx = px - r * 0.3;
  const gCy = fy - r * 0.3;
  const bodyGrad = ctx.createRadialGradient(gCx, gCy, r * 0.02, px, fy, r);
  bodyGrad.addColorStop(0, rgba(255, 255, 255, 0.7));
  bodyGrad.addColorStop(0.06, rgba(cr, cg, cb, 0.65));
  bodyGrad.addColorStop(0.22, rgba(cr, cg, cb, 0.45));
  bodyGrad.addColorStop(0.48, rgba(cr, cg, cb, 0.30));
  bodyGrad.addColorStop(0.72, rgba(Math.floor(cr * 0.6), Math.floor(cg * 0.6), Math.floor(cb * 0.6), 0.35));
  bodyGrad.addColorStop(1, rgba(Math.floor(cr * 0.35), Math.floor(cg * 0.35), Math.floor(cb * 0.35), 0.55));
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(px, fy, r, 0, Math.PI * 2);
  ctx.fill();

  // ── Subsurface scattering (warm inner glow) ──
  const warmR = Math.min(255, cr + 40);
  const warmG = Math.min(255, cg + 30);
  const warmB = Math.min(255, cb + 20);
  const ssGrad = ctx.createRadialGradient(px + r * 0.15, fy + r * 0.25, r * 0.05, px, fy, r * 0.7);
  ssGrad.addColorStop(0, rgba(warmR, warmG, warmB, 0.12));
  ssGrad.addColorStop(0.4, rgba(warmR, warmG, warmB, 0.06));
  ssGrad.addColorStop(1, rgba(cr, cg, cb, 0));
  ctx.fillStyle = ssGrad;
  ctx.beginPath();
  ctx.arc(px, fy, r * 0.7, 0, Math.PI * 2);
  ctx.fill();

  // ── Primary specular highlight (sharp bright — liquid glass key) ──
  const hOffX = Math.cos(time * 0.0003 + planet.floatPhase) * r * 0.08;
  const hOffY = Math.sin(time * 0.0003 + planet.floatPhase) * r * 0.06;
  const hx = px - r * 0.28 + hOffX;
  const hy = fy - r * 0.3 + hOffY;

  const hlGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.45);
  hlGrad.addColorStop(0, rgba(255, 255, 255, 0.95));
  hlGrad.addColorStop(0.08, rgba(255, 255, 255, 0.55));
  hlGrad.addColorStop(0.2, rgba(255, 255, 255, 0.15));
  hlGrad.addColorStop(0.45, rgba(255, 255, 255, 0.02));
  hlGrad.addColorStop(1, rgba(255, 255, 255, 0));
  ctx.fillStyle = hlGrad;
  ctx.beginPath();
  ctx.ellipse(hx, hy, r * 0.42, r * 0.22, -0.6, 0, Math.PI * 2);
  ctx.fill();

  // ── Secondary sharp highlight (tiny bright core point) ──
  const shx = hx - r * 0.06;
  const shy = hy - r * 0.08;
  const sharpGrad = ctx.createRadialGradient(shx, shy, 0, shx, shy, r * 0.1);
  sharpGrad.addColorStop(0, rgba(255, 255, 255, 0.9));
  sharpGrad.addColorStop(0.3, rgba(255, 255, 255, 0.2));
  sharpGrad.addColorStop(1, rgba(255, 255, 255, 0));
  ctx.fillStyle = sharpGrad;
  ctx.beginPath();
  ctx.arc(shx, shy, r * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // ── Secondary reflection (bottom-right, dim) ──
  const srx = px + r * 0.35;
  const sry = fy + r * 0.28;
  const srGrad = ctx.createRadialGradient(srx, sry, 0, srx, sry, r * 0.18);
  srGrad.addColorStop(0, rgba(255, 255, 255, 0.12));
  srGrad.addColorStop(0.5, rgba(255, 255, 255, 0.03));
  srGrad.addColorStop(1, rgba(255, 255, 255, 0));
  ctx.fillStyle = srGrad;
  ctx.beginPath();
  ctx.ellipse(srx, sry, r * 0.18, r * 0.12, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // ── Fresnel rim light (edge glow from internal refraction) ──
  const rimGrad = ctx.createRadialGradient(px, fy + r * 0.1, r * 0.4, px, fy, r);
  rimGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
  rimGrad.addColorStop(0.55, "rgba(0, 0, 0, 0)");
  rimGrad.addColorStop(0.82, rgba(Math.min(255, cr + 50), Math.min(255, cg + 50), Math.min(255, cb + 50), 0.08));
  rimGrad.addColorStop(0.93, rgba(cr, cg, cb, 0.15));
  rimGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(px, fy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ── Glass interior refraction lines ──
  ctx.save();
  ctx.globalAlpha = 0.03 + Math.sin(time * 0.0005 + planet.floatPhase) * 0.01;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 2; i++) {
    const aOff = (i / 2) * Math.PI * 2 + time * 0.0001 * (i + 1);
    const cx2 = px + Math.cos(aOff) * r * 0.25;
    const cy2 = fy + Math.sin(aOff) * r * 0.25;
    ctx.beginPath();
    ctx.ellipse(cx2, cy2, r * 0.45, r * 0.2, aOff * 0.3, aOff, aOff + Math.PI * 0.6);
    ctx.stroke();
  }
  ctx.restore();

  // ── Glow ring (selected / hovered) with pulse ──
  if (glow) {
    const pulse = 0.5 + Math.sin(time * 0.003) * 0.2;
    ctx.save();
    ctx.shadowColor = planet.color;
    ctx.shadowBlur = isSelected ? 32 : 18;
    ctx.strokeStyle = rgba(cr, cg, cb, isSelected ? pulse : 0.5);
    ctx.lineWidth = isSelected ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(px, fy, r * 1.25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (isSelected) {
      ctx.save();
      ctx.globalAlpha = 0.08 + Math.sin(time * 0.003) * 0.04;
      ctx.fillStyle = rgba(cr, cg, cb, 0.5);
      ctx.beginPath();
      ctx.arc(px, fy, r * 1.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ── Progress arc ──
  if (planet.progress > 0 && planet.progress < 1) {
    const endAngle = -Math.PI / 2 + planet.progress * Math.PI * 2;

    // Glow trail
    ctx.save();
    ctx.lineWidth = 5;
    ctx.strokeStyle = rgba(cr, cg, cb, 0.2);
    ctx.lineCap = "round";
    ctx.shadowColor = planet.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(px, fy, r + 3.5, -Math.PI / 2, endAngle);
    ctx.stroke();
    ctx.restore();

    // Main arc
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(px, fy, r + 3.5, -Math.PI / 2, endAngle);
    ctx.stroke();

    // End dot
    const dotX = px + Math.cos(endAngle) * (r + 3.5);
    const dotY = fy + Math.sin(endAngle) * (r + 3.5);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════
// 7. NEBULA PARTICLES (isometric distribution)
// ═══════════════════════════════════════════════════════════════

export function drawIsoNebula(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
  time: number,
): void {
  const { cx, cy, dialRadius, bezelSteps } = config;
  const faceA = dialRadius * 1.22 - bezelSteps * 3;
  const baseStep = faceA * 0.25;
  ensureNebulaParticles(faceA, baseStep);

  for (let i = 0; i < NEBULA_PARTICLES.length; i++) {
    const p = NEBULA_PARTICLES[i];
    const angle = p.startAngle + p.angularSpeed * time;
    const height = p.heightBase + Math.sin(time * p.heightFreq) * p.heightAmp;

    const s = toScreen(
      p.orbitRadius * Math.cos(angle),
      p.orbitRadius * Math.sin(angle),
      height,
    );
    const px = cx + s.x;
    const py = cy + s.y;

    ctx.fillStyle = rgba(p.colorR, p.colorG, p.colorB, p.opacity);
    ctx.beginPath();
    ctx.arc(px, py, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ═══════════════════════════════════════════════════════════════
// 8. PLANET LABEL (frosted glass style, isometric-projected)
// ═══════════════════════════════════════════════════════════════

export function drawIsoPlanetLabel(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
  planet: IsoPlanet,
  isSelected: boolean,
  isHovered: boolean,
  time: number,
): void {
  const { cx, cy } = config;
  const px = cx + planet.screenX;
  const py = cy + planet.screenY;
  const r = planet.radius;
  const visible = isSelected || isHovered;

  if (!planet.taskTime && !planet.taskName) return;

  const floatY = Math.sin(time * 0.001 + planet.floatPhase) * 2.5;
  const fy = py + floatY;

  const labelY = fy - r - 12;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (visible) {
    const label = planet.taskName ?? planet.taskTime ?? "";
    const fontSize = Math.max(9, r * 0.7);
    ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
    const textWidth = ctx.measureText(label).width;
    const padding = 6;
    const bgH = fontSize + padding * 2;
    const bgW = textWidth + padding * 2;
    const bgX = px - bgW / 2;
    const bgY = labelY - bgH / 2;

    // Frosted glass background
    ctx.fillStyle = "rgba(10, 10, 15, 0.6)";
    ctx.strokeStyle = rgba(planet.colorRgb.r, planet.colorRgb.g, planet.colorRgb.b, 0.3);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgW, bgH, 6);
    ctx.fill();
    ctx.stroke();

    // Glass shine overlay
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgW, bgH * 0.4, 6);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = planet.color;
    ctx.fillText(label, px, labelY);
  } else {
    const displayText = planet.taskTime ?? "";
    ctx.font = `600 ${Math.max(8, r * 0.6)}px "JetBrains Mono", monospace`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillText(displayText, px, labelY);
  }

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 9. CONSTRUCTIVIST GEOMETRY (isometric adaptation)
// ═══════════════════════════════════════════════════════════════

export function drawIsoConstructivistGeometry(
  ctx: CanvasRenderingContext2D,
  config: IsoDialConfig,
): void {
  const { cx, cy, dialRadius } = config;
  const a = dialRadius * 1.22;
  const b = dialRadius * 0.71;

  ctx.save();

  // ── Diagonal accent lines (engineering drawing style) ──
  const w = ctx.canvas.clientWidth;
  const h = ctx.canvas.clientHeight;

  ctx.strokeStyle = "#EAB308";
  ctx.globalAlpha = 0.04;
  ctx.lineWidth = 1;

  for (let i = 0; i < 2; i++) {
    const offset = i * h * 0.15;
    ctx.beginPath();
    ctx.moveTo(0, cy - b * 1.4 + offset);
    ctx.lineTo(w, cy + b * 1.4 + offset);
    ctx.stroke();
  }

  ctx.strokeStyle = "#2563EB";
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 2; i++) {
    const offset = i * w * 0.18;
    ctx.beginPath();
    ctx.moveTo(cx - a * 1.4 + offset, 0);
    ctx.lineTo(cx + a * 1.4 + offset, h);
    ctx.stroke();
  }

  // ── Corner geometric accent ──
  ctx.strokeStyle = "#2563EB";
  ctx.globalAlpha = 0.05;
  ctx.lineWidth = 1.5;
  const rectSize = dialRadius * 0.15;
  ctx.strokeRect(cx - a * 0.5, cy - b * 0.55, rectSize, rectSize);

  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 10. COMPOSITE RENDER FRAME
// ═══════════════════════════════════════════════════════════════

/** Render a complete frame of the isometric orbital clock.
 *  This replaces the renderFrame() in orbital-engine.ts for the clock region.
 *  drawFilmGrain should still be called separately after this.
 */
export function renderIsoFrame(params: IsoRenderParams): void {
  const {
    ctx, width, height, cx, cy, now, animationTime,
    planets, selectedIndex, hoveredIndex,
  } = params;

  ctx.clearRect(0, 0, width, height);

  const maxRadius = Math.min(width, height) * 0.38;
  const dialRadius = maxRadius * 0.62;

  const config: IsoDialConfig = {
    cx,
    cy,
    dialRadius,
    faceThickness: dialRadius * 0.22,
    bezelSteps: 4,
  };

  // Rendering order: back → front
  drawIsoConstructivistGeometry(ctx, config);
  drawIsoBase(ctx, config);
  drawIsoOrbitRings(ctx, config);
  drawIsoDial(ctx, config);
  drawIsoTicks(ctx, config);
  drawIsoNebula(ctx, config, animationTime);

  // Draw planets (back to front → sort by screenY)
  const sorted = planets
    .map((p, i) => ({ planet: p, index: i }))
    .sort((a, b) => a.planet.screenY - b.planet.screenY);

  for (const { planet, index } of sorted) {
    drawIsoPlanet(ctx, config, planet, index === selectedIndex, index === hoveredIndex, animationTime);
  }

  for (const { planet, index } of sorted) {
    drawIsoPlanetLabel(ctx, config, planet, index === selectedIndex, index === hoveredIndex, animationTime);
  }

  drawIsoHands(ctx, config, now);
}

// ═══════════════════════════════════════════════════════════════
// 11. POSITION COMPUTATION
// ═══════════════════════════════════════════════════════════════

function getOrbitIndex(startTime: string, endTime: string): number {
  const s = timeToMinutes(startTime);
  const e = timeToMinutes(endTime);
  const d = (e - s + 1440) % 1440;
  if (d < 30) return 0;
  if (d <= 60) return 1;
  if (d <= 120) return 2;
  if (d <= 180) return 3;
  if (d <= 240) return 4;
  return 5;
}

function getPlanetRadius(startTime: string, endTime: string): number {
  const s = timeToMinutes(startTime);
  const e = timeToMinutes(endTime);
  const d = (e - s + 1440) % 1440;
  if (d < 30) return UNIFIED_RADIUS["<30"];
  if (d <= 60) return UNIFIED_RADIUS["30-60"];
  if (d <= 120) return UNIFIED_RADIUS["60-120"];
  return UNIFIED_RADIUS[">120"];
}

export function computeIsoPlanetPosition(
  task: Task,
  cx: number,
  cy: number,
  dialRadius: number,
): IsoPlanet {
  const angle = timeToAngle(task.startTime); // 0..PI, 06:00→0, 18:00→PI
  const orbitIdx = getOrbitIndex(task.startTime, task.endTime);
  const bezelWidth = 4 * 3; // bezelSteps * shrinkPerStep
  const faceRadius = dialRadius - bezelWidth;
  const orbitR = faceRadius * 1.22 + (orbitIdx + 1) * faceRadius * 0.25 * 0.7;
  const size = getPlanetRadius(task.startTime, task.endTime);

  // Place planet in 3D on the XY plane at Z=0 (on the dial face)
  const x3d = orbitR * Math.cos(angle);
  const y3d = orbitR * Math.sin(angle);
  const z3d = dialRadius * 0.22; // same as faceThickness

  const screen = toScreen(x3d, y3d, z3d);
  const color = getTaskColor(task.type);

  return {
    id: task.id,
    x3d, y3d, z3d,
    screenX: screen.x,
    screenY: screen.y,
    radius: size,
    color,
    colorRgb: hexToRgb(color),
    progress: task.progress / 100,
    taskId: task.id,
    taskName: task.name,
    taskTime: task.startTime,
    floatPhase: (task.id.charCodeAt(0) || 0) * 0.7 + (task.id.charCodeAt(2) || 0) * 1.3,
    orbitIndex: orbitIdx,
    angle,
  };
}

/** Compute all planet positions for a set of tasks. */
export function computeAllIsoPlanetPositions(
  tasks: Task[],
  cx: number,
  cy: number,
  dialRadius: number,
): IsoPlanet[] {
  return tasks.map((t) => computeIsoPlanetPosition(t, cx, cy, dialRadius));
}

/** Hit test against planet head positions. Returns the planet index or -1. */
export function hitTestIsoPlanet(
  mx: number,
  my: number,
  planets: IsoPlanet[],
  cx: number,
  cy: number,
): number {
  for (let i = planets.length - 1; i >= 0; i--) {
    const p = planets[i];
    const dx = mx - (cx + p.screenX);
    const dy = my - (cy + p.screenY);
    if (Math.sqrt(dx * dx + dy * dy) <= p.radius + 8) {
      return i;
    }
  }
  return -1;
}
