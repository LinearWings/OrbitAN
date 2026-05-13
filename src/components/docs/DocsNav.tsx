"use client";
import React from "react";
import type { DocsChapter } from "@/data/docs-content";

interface DocsNavProps {
  chapters: DocsChapter[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function DocsNav({ chapters, activeId, onSelect }: DocsNavProps) {
  return (
    <nav className="w-52 shrink-0 border-r border-white/[0.04] p-4 space-y-1 overflow-y-auto">
      {chapters.map((ch) => (
        <button
          key={ch.id}
          onClick={() => onSelect(ch.id)}
          className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
          style={{
            background: activeId === ch.id ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeId === ch.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
            border: activeId === ch.id ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          }}
        >
          {ch.title}
        </button>
      ))}
    </nav>
  );
}
