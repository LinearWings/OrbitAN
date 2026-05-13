"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
};

export default function OrbitModeTransition({ open }: Props) {
  const [phase, setPhase] = useState<"idle" | "entering" | "exiting">("idle");
  const prevOpen = useRef(open);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setPhase("entering");
      const t = setTimeout(() => setPhase("idle"), 550);
      return () => clearTimeout(t);
    } else if (!open && prevOpen.current) {
      setPhase("exiting");
      const t = setTimeout(() => setPhase("idle"), 400);
      return () => clearTimeout(t);
    }
    prevOpen.current = open;
  }, [open]);

  if (phase === "idle") return null;

  const isExiting = phase === "exiting";

  return (
    <>
      {/* Edge glow frame — brief pulse around viewport perimeter */}
      <div
        className="focus-edge-overlay"
        style={{
          animation: isExiting
            ? "focus-edge-pulse-out 400ms ease-out forwards"
            : "focus-edge-pulse 550ms ease-out forwards",
        }}
      />

      {/* Four corner accent flashes */}
      <div
        className="focus-corner"
        style={{
          top: 0, left: 0,
          background: "radial-gradient(circle at 0 0, rgba(234,179,8,0.15) 0%, transparent 70%)",
          animation: `focus-corner-flash ${isExiting ? "350ms" : "500ms"} ease-out forwards`,
        }}
      />
      <div
        className="focus-corner"
        style={{
          top: 0, right: 0,
          background: "radial-gradient(circle at 100% 0, rgba(37,99,235,0.12) 0%, transparent 70%)",
          animation: `focus-corner-flash ${isExiting ? "350ms" : "500ms"} ease-out ${isExiting ? "0ms" : "60ms"} forwards`,
        }}
      />
      <div
        className="focus-corner"
        style={{
          bottom: 0, left: 0,
          background: "radial-gradient(circle at 0 100%, rgba(37,99,235,0.1) 0%, transparent 70%)",
          animation: `focus-corner-flash ${isExiting ? "350ms" : "500ms"} ease-out ${isExiting ? "0ms" : "100ms"} forwards`,
        }}
      />
      <div
        className="focus-corner"
        style={{
          bottom: 0, right: 0,
          background: "radial-gradient(circle at 100% 100%, rgba(234,179,8,0.12) 0%, transparent 70%)",
          animation: `focus-corner-flash ${isExiting ? "350ms" : "500ms"} ease-out ${isExiting ? "0ms" : "140ms"} forwards`,
        }}
      />
    </>
  );
}
