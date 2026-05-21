import type { Task, CometPosition, PlanetRadius } from "@/types";
import { timeToAngle, angleToPosition, timeToMinutes } from "@/utils/time";
import { getTaskColor, getCometHeadRadius } from "@/utils/colors";
import { UNIFIED_RADIUS, ORBIT_RING_RADII_FRACTIONS } from "@/data/constants";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const s = hex.replace('#', '');
  const num = parseInt(s, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

/** Check if two time ranges [start, end] overlap (inclusive). */
function timeRangesOverlap(
  s1: number, e1: number,
  s2: number, e2: number,
): boolean {
  return s1 < e2 && s2 < e1;
}

// ORBIT_RING_RADII_FRACTIONS is now imported from @/data/constants

/**
 * Assigns each task to the first available orbit ring, separating overlapping
 * schedules onto different rings. Non-overlapping tasks can share a ring.
 *
 * Ring index mapping:
 * 0 = 0.66×maxRadius  (innermost)
 * 5 = 0.96×maxRadius  (outermost)
 */
export function computeOverlapAwareCometPositions(
  tasks: Task[],
  cx: number,
  cy: number,
  maxRadius: number,
): CometPosition[] {
  // Sort by start time, then duration (longer tasks first for deterministic ring order)
  const sorted = [...tasks].sort((a, b) => {
    const sa = timeToMinutes(a.startTime);
    const sb = timeToMinutes(b.startTime);
    if (sa !== sb) return sa - sb;
    const da = (timeToMinutes(a.endTime) - sa + 1440) % 1440;
    const db = (timeToMinutes(b.endTime) - sb + 1440) % 1440;
    return db - da;
  });

  const ringOccupants: Array<{ start: number; end: number }>[] = [[], [], [], [], [], []];
  const result: CometPosition[] = [];

  for (const task of sorted) {
    const taskStart = timeToMinutes(task.startTime);
    const taskEnd = timeToMinutes(task.endTime);
    // Handle overnight: if end < start, treat as 24h wrap
    const adjustedEnd = taskEnd <= taskStart ? taskEnd + 24 * 60 : taskEnd;

    // Find first ring where this task doesn't overlap any existing occupant
    let assignedRing = -1;
    for (let ring = 0; ring < 6; ring++) {
      const conflicts = ringOccupants[ring].some((occ) =>
        // Check against occupant's original range
        timeRangesOverlap(taskStart, adjustedEnd, occ.start, occ.end) ||
        // Check occupant shifted +24h (handles this task wrapping overnight past occupant)
        timeRangesOverlap(taskStart, adjustedEnd, occ.start + 24 * 60, occ.end + 24 * 60) ||
        // Check this task shifted +24h (handles occupant wrapping overnight past this task)
        timeRangesOverlap(taskStart + 24 * 60, adjustedEnd + 24 * 60, occ.start, occ.end),
      );
      if (!conflicts) {
        assignedRing = ring;
        ringOccupants[ring].push({ start: taskStart, end: adjustedEnd });
        break;
      }
    }

    // Fallback: if all 6 rings have conflicts, use ring 5 anyway
    if (assignedRing === -1) assignedRing = 5;

    const ringRadius = ORBIT_RING_RADII_FRACTIONS[assignedRing] * maxRadius;
    const _dialRadius = maxRadius * 0.62;

    const startAngle = timeToAngle(task.startTime);
    const endAngle = timeToAngle(task.endTime);
    const headRadius = getCometHeadRadius(task.startTime, task.endTime);

    const tailPos = angleToPosition(startAngle, ringRadius, cx, cy);
    const headPos = angleToPosition(endAngle, ringRadius, cx, cy);
    const color = getTaskColor(task.type);

    result.push({
      tailX: tailPos.x,
      tailY: tailPos.y,
      headX: headPos.x,
      headY: headPos.y,
      headRadius,
      startAngle,
      endAngle,
      orbitRadius: ringRadius,
      color,
      colorRgb: hexToRgb(color),
      progress: task.progress,
      opacity: 1,
      taskName: task.name,
      taskId: task.id,
    });
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════
// SHARED ORBIT UTILITIES — used by both hybrid clock + orbital engine
// ═══════════════════════════════════════════════════════════════

/** Maps task duration (minutes) to one of 6 concentric orbit ring indices. */
export function getOrbitRingIndex(duration: number): number {
  if (duration < 30) return 0;
  if (duration <= 60) return 1;
  if (duration <= 120) return 2;
  if (duration <= 180) return 3;
  if (duration <= 240) return 4;
  return 5;
}

/** Returns the visual planet radius based on task duration. */
export function getPlanetScreenRadius(duration: number): PlanetRadius {
  if (duration < 30) return UNIFIED_RADIUS["<30"];
  if (duration <= 60) return UNIFIED_RADIUS["30-60"];
  if (duration <= 120) return UNIFIED_RADIUS["60-120"];
  return UNIFIED_RADIUS[">120"];
}

/** Compute the screen (x,y) of the comet arc's midpoint on its orbit ring. */
export function cometMidpoint(
  startAngle: number,
  endAngle: number,
  orbitRadius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  let mid = (startAngle + endAngle) / 2;
  // Overnight wrap: normalize midpoint to the clockwise arc
  if (endAngle < startAngle) mid += Math.PI;
  return angleToPosition(mid, orbitRadius, cx, cy);
}
