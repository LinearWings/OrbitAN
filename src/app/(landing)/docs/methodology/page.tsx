"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { FOCUS_METHOD_COLORS } from "@/data/focus-defaults";
import { METHODOLOGY_GUIDES } from "@/data/methodology-content";

export default function MethodologyPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.methodology_title}</h1>
      <p className="text-white/30 mb-12">{t.methodology_desc}</p>

      <div className="space-y-12">
        {METHODOLOGY_GUIDES.map((guide) => {
          const color = FOCUS_METHOD_COLORS[guide.id];
          const title = lang === "zh" ? guide.titleZh : guide.titleEn;
          const desc = lang === "zh" ? guide.shortZh : guide.shortEn;

          return (
          <section key={guide.id} className="flex gap-5 border-b border-white/[0.05] pb-10 last:border-b-0">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}50` }} />
            <div>
              <h3 className="text-base font-semibold mb-2 text-white/75" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                {title}
              </h3>
              <p className="text-sm text-white/35 leading-relaxed mb-4">{desc}</p>

              {lang === "zh" && (
                <>
                  <p className="text-sm text-white/30 leading-relaxed mb-5">{guide.originZh}</p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-[0.65rem] uppercase tracking-[0.14em] text-white/25 mb-2">核心原则</h4>
                      <ul className="space-y-1.5 text-sm text-white/35 leading-relaxed">
                        {guide.principles.slice(0, 3).map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[0.65rem] uppercase tracking-[0.14em] text-white/25 mb-2">OrbitAN 实现</h4>
                      <p className="text-sm text-white/35 leading-relaxed">{guide.appModel}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <h4 className="text-[0.65rem] uppercase tracking-[0.14em] text-white/25 mb-2">操作流程</h4>
                    <div className="grid gap-2">
                      {guide.workflow.map((step, index) => (
                        <div key={step.label} className="flex gap-2 text-sm leading-relaxed text-white/35">
                          <span className="font-mono" style={{ color }}>{String(index + 1).padStart(2, "0")}</span>
                          <span>
                            <span className="text-white/55">{step.label}</span>
                            ：{step.detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {guide.bestFor.map((item) => (
                      <span key={item} className="rounded-full border border-white/[0.06] px-3 py-1 text-xs text-white/30">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-white/20">来源：{guide.sourceDoc}</p>
                </>
              )}
            </div>
          </section>
          );
        })}
      </div>
    </div>
  );
}
