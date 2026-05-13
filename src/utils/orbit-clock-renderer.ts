import { timeToAngle24h } from "@/utils/time";

export function addMinutes(time: string, add: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = ((h ?? 0) * 60 + (m ?? 0) + add) % 1440;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function minutesToTime(minutes: number): string {
  const clamped = ((minutes % 1440) + 1440) % 1440;
  const hh = Math.floor(clamped / 60);
  const mm = clamped % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* Canvas orbit clock for step 2 — simplified from orbital-engine.ts */

function drawOrbitClock(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cx: number,
  cy: number,
  startTime: string,
  endTime: string,
  typeColor: string,
  hoverAngle: number | null,
  clickPhase: "start" | "end" | null,
) {
  ctx.clearRect(0, 0, w, h);
  ctx.save();

  const maxR = Math.min(w, h) * 0.38;
  const dialR = maxR * 0.62;

  ctx.fillStyle = "#0A0A0A";
  ctx.beginPath();
  ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.fill();

  // ── Orbit rings (4 concentric) ──
  const ringFractions = [0.66, 0.76, 0.86, 0.96];
  for (let i = 0; i < ringFractions.length; i++) {
    const r = ringFractions[i] * maxR;
    ctx.strokeStyle =
      i % 2 === 0
        ? `rgba(234, 179, 8, ${0.2 - i * 0.03})`
        : `rgba(37, 99, 235, ${0.2 - i * 0.03})`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Clock dial ──
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  ctx.arc(cx, cy, dialR, 0, Math.PI * 2);
  ctx.fill();

  // ── Dial border rings ──
  for (let i = 0; i < 3; i++) {
    const ringR = dialR - i * 2;
    const grad = ctx.createRadialGradient(cx, cy, ringR * 0.3, cx, cy, ringR);
    grad.addColorStop(0, "#1A1A1A");
    grad.addColorStop(1, "#0A0A0A");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3 - i * 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── 24h ticks (every 2h) ──
  const tickInnerR = dialR + 6;
  const tickOuterR = maxR * 0.66 - 2;
  for (let h = 0; h < 24; h++) {
    const angle = (h / 24) * Math.PI * 2 - Math.PI / 2;
    const isMajor = h % 6 === 0;
    const isMid = h % 3 === 0;
    const tOuter = tickOuterR - (isMajor ? 0 : 6);
    const tInner = tickInnerR + (isMajor ? 0 : 8);

    ctx.beginPath();
    ctx.moveTo(
      cx + Math.cos(angle) * tInner,
      cy + Math.sin(angle) * tInner,
    );
    ctx.lineTo(
      cx + Math.cos(angle) * tOuter,
      cy + Math.sin(angle) * tOuter,
    );
    ctx.strokeStyle = isMajor
      ? "rgba(229,229,229,0.5)"
      : "rgba(229,229,229,0.25)";
    ctx.lineWidth = isMajor ? 1.2 : 0.5;
    ctx.stroke();

    if (isMid) {
      const label = String(h).padStart(2, "0");
      const lr = tickOuterR + 10;
      ctx.font = `600 ${isMajor ? 9 : 7}px "JetBrains Mono", monospace`;
      ctx.fillStyle = isMajor
        ? "rgba(229,229,229,0.55)"
        : "rgba(229,229,229,0.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        label,
        cx + Math.cos(angle) * lr,
        cy + Math.sin(angle) * lr,
      );
    }
  }

  // ── Day/night zones ──
  ctx.fillStyle = "rgba(234, 179, 8, 0.03)";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, tickOuterR, 0, Math.PI, false);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(37, 99, 235, 0.025)";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, tickOuterR, Math.PI, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();

  // ── Hover indicator ──
  if (hoverAngle !== null) {
    const hoverX = cx + Math.cos(hoverAngle - Math.PI / 2) * tickOuterR * 0.85;
    const hoverY = cy + Math.sin(hoverAngle - Math.PI / 2) * tickOuterR * 0.85;
    ctx.save();
    ctx.shadowColor = typeColor;
    ctx.shadowBlur = 20;
    ctx.fillStyle = typeColor;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(hoverX, hoverY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(hoverX, hoverY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Task arc ──
  const startAngle = timeToAngle24h(startTime) - Math.PI / 2;
  const endAngle = timeToAngle24h(endTime) - Math.PI / 2;
  const arcR = tickOuterR * 0.85;

  // Draw main arc (segmented trail)
  ctx.save();
  const segments = 30;
  for (let s = 0; s < segments; s++) {
    const t0 = s / segments;
    const t1 = (s + 1) / segments;
    const alpha = 0.25 + t0 * 0.5;
    const a0 = startAngle + (endAngle - startAngle) * t0;
    const a1 = startAngle + (endAngle - startAngle) * t1;
    ctx.strokeStyle =
      s === segments - 1
        ? typeColor
        : hexToRgba(typeColor, alpha);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, arcR, a0, a1, false);
    ctx.stroke();
  }
  ctx.restore();

  // Arc glow
  ctx.save();
  ctx.shadowColor = typeColor;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = typeColor;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, arcR, startAngle, endAngle, false);
  ctx.stroke();
  ctx.restore();

  // Start marker — white dot
  const sx = cx + Math.cos(startAngle) * arcR;
  const sy = cy + Math.sin(startAngle) * arcR;
  ctx.save();
  ctx.shadowColor = "rgba(255,255,255,0.5)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(sx, sy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // End marker — glass sphere
  const ex = cx + Math.cos(endAngle) * arcR;
  const ey = cy + Math.sin(endAngle) * arcR;
  const headGrad = ctx.createRadialGradient(ex - 3, ey - 3, 1, ex, ey, 10);
  headGrad.addColorStop(0, "rgba(255,255,255,0.9)");
  headGrad.addColorStop(0.2, typeColor);
  headGrad.addColorStop(0.6, `${typeColor}99`);
  headGrad.addColorStop(1, `${typeColor}33`);
  ctx.save();
  ctx.shadowColor = typeColor;
  ctx.shadowBlur = 16;
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(ex, ey, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(ex - 3, ey - 3, 3, 2, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Dashed radial lines
  const drawDashed = (angle: number) => {
    const lx = cx + Math.cos(angle) * arcR;
    const ly = cy + Math.sin(angle) * arcR;
    const tx = cx + Math.cos(angle) * tickInnerR;
    const ty = cy + Math.sin(angle) * tickInnerR;
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = `${typeColor}50`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  };
  drawDashed(startAngle);
  drawDashed(endAngle);

  // ── Preview overlay (only in clickPhase "end") ──
  if (clickPhase === "end" && hoverAngle !== null) {
    const previewAngle = hoverAngle - Math.PI / 2;
    const px = cx + Math.cos(previewAngle) * arcR;
    const py = cy + Math.sin(previewAngle) * arcR;

    // Preview arc extension from current end to hover position
    ctx.save();
    for (let s = 0; s < 15; s++) {
      const t = s / 15;
      const a = endAngle + (previewAngle - endAngle) * t;
      const aN = endAngle + (previewAngle - endAngle) * ((s + 1) / 15);
      ctx.strokeStyle = typeColor;
      ctx.globalAlpha = 0.08 + t * 0.12;
      ctx.lineWidth = 5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, arcR, a, aN, false);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // Preview end marker — dashed hollow circle
    ctx.save();
    ctx.strokeStyle = typeColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = typeColor;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Hover hint ring (only in clickPhase "start") ──
  if (clickPhase === "start" && hoverAngle !== null) {
    const ha = hoverAngle - Math.PI / 2;
    const hx = cx + Math.cos(ha) * arcR;
    const hy = cy + Math.sin(ha) * arcR;
    ctx.save();
    ctx.strokeStyle = typeColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ── Center hub ──
  ctx.save();
  const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 5);
  hubGrad.addColorStop(0, "#E5E5E5");
  hubGrad.addColorStop(1, "#888888");
  ctx.fillStyle = hubGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

export default drawOrbitClock;
