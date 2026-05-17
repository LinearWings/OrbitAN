"use client";

import { FOCUS_METHOD_COLORS } from "@/data/focus-defaults";
import { getMethodologyGuide } from "@/data/methodology-content";
import type { FocusMethodId } from "@/types/focus";

interface MethodGuideProps {
  methodId: FocusMethodId;
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-xs leading-relaxed text-white/55">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/25" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MethodGuide({ methodId }: MethodGuideProps) {
  const guide = getMethodologyGuide(methodId);
  const color = FOCUS_METHOD_COLORS[methodId];

  return (
    <section
      className="mb-5 rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.035)",
        border: `1px solid ${color}24`,
        boxShadow: `0 0 28px ${color}08`,
      }}
    >
      <div className="mb-3 flex items-start justify-between gap-4 border-b border-white/[0.06] pb-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}80` }} />
            <h3 className="font-clash text-base font-semibold text-white/90">{guide.titleZh}</h3>
          </div>
          <p className="text-xs leading-relaxed text-white/55">{guide.shortZh}</p>
        </div>
        <span className="shrink-0 rounded-full border border-white/[0.06] px-2.5 py-1 text-[0.55rem] text-white/30">
          {guide.sourceDoc}
        </span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-white/45">{guide.originZh}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/35">核心原则</h4>
          <BulletList items={guide.principles.slice(0, 3)} />
        </div>
        <div>
          <h4 className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/35">适用场景</h4>
          <BulletList items={guide.bestFor} />
        </div>
      </div>

      <div className="mt-4 border-t border-white/[0.06] pt-3">
        <h4 className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/35">执行流程</h4>
        <div className="grid gap-2">
          {guide.workflow.map((step, index) => (
            <div key={step.label} className="flex gap-2 text-xs leading-relaxed">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[0.58rem]"
                style={{ background: `${color}18`, color, border: `1px solid ${color}28` }}
              >
                {index + 1}
              </span>
              <div>
                <span className="font-medium text-white/70">{step.label}</span>
                <span className="text-white/45">：{step.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-white/[0.06] pt-3">
        <h4 className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/35">开始前自问</h4>
        <div className="flex flex-wrap gap-2">
          {guide.prompts.slice(0, 3).map((prompt) => (
            <span
              key={prompt}
              className="rounded-full px-2.5 py-1 text-[0.62rem] leading-relaxed text-white/55"
              style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
