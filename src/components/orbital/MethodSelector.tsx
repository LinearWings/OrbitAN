"use client";

import React from "react";
import { METHODOLOGIES } from "@/data/defaults";
import { getMethodologyGuide } from "@/data/methodology-content";
import type { MethodologyType } from "@/types";
import styles from "./MethodSelector.module.css";

type Props = {
  onSelect: (id: MethodologyType["id"]) => void;
};

function SvgIcon({ svg }: { svg: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-10 h-10"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function MethodSelector({ onSelect }: Props) {
  return (
    <div className={styles.grid}>
      {METHODOLOGIES.map((m, i) => {
        const guide = getMethodologyGuide(m.id);
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`${styles.card} group relative`}
            style={{ "--i": i } as React.CSSProperties}
            aria-label={`Select ${m.name}`}
          >
            <div className="mb-2 text-white/80 group-hover:translate-y-[-1px] transition-transform">
              <SvgIcon svg={m.icon} />
            </div>
            <div className="font-clash text-lg font-semibold text-white">{m.name}</div>
            <div className="text-white/60 text-sm mt-1">{m.nameEn}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/40" title={guide.shortZh}>
              {guide.shortZh}
            </div>
            <div className="mt-3 border-t border-white/[0.06] pt-2 text-[0.65rem] leading-relaxed text-white/30">
              适合：{guide.bestFor[0]}
            </div>
          </button>
        );
      })}
    </div>
  );
}
