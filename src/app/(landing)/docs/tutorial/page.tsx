"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export default function TutorialPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16 docs-prose">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.tutorial_title}</h1>
      <p className="text-white/30 mb-12">{t.tutorial_desc}</p>

      <div className="space-y-12">
        {[
          { step: "01", title: t.tutorial_step1_title, body: t.tutorial_step1_body },
          { step: "02", title: t.tutorial_step2_title, body: t.tutorial_step2_body },
          { step: "03", title: t.tutorial_step3_title, body: t.tutorial_step3_body },
          { step: "04", title: t.tutorial_step4_title, body: t.tutorial_step4_body },
          { step: "05", title: t.tutorial_step5_title, body: t.tutorial_step5_body },
        ].map((s) => (
          <div key={s.step} className="flex gap-6">
            <span className="text-2xl font-bold text-white/[0.04] flex-shrink-0 w-10" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.step}</span>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white/75" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
