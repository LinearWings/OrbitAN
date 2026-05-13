"use client";

import type { SVGProps } from "react";

// ── Orbit ring (replaces 🪐 emoji) ──
export function OrbitIcon({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <ellipse cx="8" cy="8" rx="7" ry="3" stroke="currentColor" strokeWidth="1.2" opacity="0.4"
        transform="rotate(-15, 8, 8)" />
      <ellipse cx="8" cy="8" rx="5.5" ry="2.3" stroke="currentColor" strokeWidth="1" opacity="0.3"
        transform="rotate(20, 8, 8)" />
      <ellipse cx="8" cy="8" rx="4" ry="1.7" stroke="currentColor" strokeWidth="0.8" opacity="0.25"
        transform="rotate(-35, 8, 8)" />
      <circle cx="8" cy="8" r="1.8" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

// ── Crosshair / Target (replaces 🎯 emoji) ──
export function CrosshairIcon({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.8" />
      <line x1="8" y1="1" x2="8" y2="5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8" y1="11" x2="8" y2="15" stroke="currentColor" strokeWidth="1.2" />
      <line x1="1" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.2" />
      <line x1="11" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// ── Close X (replaces ✕ unicode) ──
export function CloseIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <line x1="3" y1="3" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="3" x2="3" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Hamburger menu (replaces ☰ unicode) ──
export function MenuIcon({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
      <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Left chevron (replaces ◀ / ← unicode) ──
export function ChevronLeftIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <polyline points="9,2 4,7 9,12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Right chevron (replaces ▶ / → unicode) ──
export function ChevronRightIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <polyline points="5,2 10,7 5,12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Up caret (replaces ▲ unicode) ──
export function CaretUpIcon({ size = 10, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" {...props}>
      <polyline points="2,7 5,3 8,7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Down caret (replaces ▼ unicode) ──
export function CaretDownIcon({ size = 10, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" {...props}>
      <polyline points="2,3 5,7 8,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Left arrow (replaces ← unicode) ──
export function ArrowLeftIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="6,3 2,7 6,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Right arrow (replaces → unicode) ──
export function ArrowRightIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="8,3 12,7 8,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── New task / Plus (replaces +) ──
export function PlusIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ── Grid / View mode (replaces view toggle) ──
export function GridIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// ── Auto-arrange (replaces organizer button) ──
export function ArrangeIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <line x1="3.5" y1="2" x2="3.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="5" x2="7" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10.5" y1="2" x2="10.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Trash / Delete ──
export function TrashIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <polyline points="2,4 4,4 12,4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5,4 v8 a1,1 0 0 1-1,1 h-5 a1,1 0 0 1-1-1 V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="5" y1="4" x2="5" y2="2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="4" x2="9" y2="2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6.5" y1="7" x2="6.5" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="8.5" y1="7" x2="8.5" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ── Mouse scroll (replaces 🖱 emoji — desktop only hint) ──
export function MouseScrollIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <rect x="4" y="1" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="1.2" />
      <line x1="7" y1="3" x2="7" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="7" y1="6" x2="7" y2="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// ── Grip / Drag handle (indicates draggable) ──
export function GripIcon({ size = 12, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" {...props}>
      <circle cx="3" cy="2" r="0.8" fill="currentColor" opacity="0.4" />
      <circle cx="7" cy="2" r="0.8" fill="currentColor" opacity="0.4" />
      <circle cx="3" cy="6" r="0.8" fill="currentColor" opacity="0.4" />
      <circle cx="7" cy="6" r="0.8" fill="currentColor" opacity="0.4" />
      <circle cx="3" cy="10" r="0.8" fill="currentColor" opacity="0.4" />
      <circle cx="7" cy="10" r="0.8" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

// ── Docs / Help / Question ──
export function HelpIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5,5.5 a2,2 0 0 1 3,1.5 c0,1.2 -2,2 -2,3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="11" r="0.7" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

// ── Undo ──
export function UndoIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <polyline points="3,5 3,2 6,2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3,5 a6,6 0 1 0 1.5,-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Today / Calendar dot ──
export function TodayIcon({ size = 14, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
      <rect x="1.5" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="1.5" y1="6" x2="12.5" y2="6" stroke="currentColor" strokeWidth="1.2" />
      <line x1="4.5" y1="1" x2="4.5" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9.5" y1="1" x2="9.5" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="7" cy="9" r="1.2" fill="currentColor" opacity="0.8" />
    </svg>
  );
}
