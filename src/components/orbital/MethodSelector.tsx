"use client";

import React from "react";
import { METHODOLOGIES } from "@/data/defaults";
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
      {METHODOLOGIES.map((m, i) => (
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
          <div className="text-white/40 text-sm mt-2 leading-tight" title={m.description}>
            {m.description}
          </div>
        </button>
      ))}
    </div>
  );
}
