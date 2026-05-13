"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export default function DocsPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="text-4xl font-semibold tracking-tight mb-4 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>
        {t.doc_title}
      </h1>
      <p className="text-white/30 mb-12 leading-relaxed">{t.doc_desc}</p>

      <div className="grid gap-4">
        {[
          { href: "/docs/tutorial", title: t.doc_tutorial, desc: t.doc_tutorial_desc, color: "#3B82F6" },
          { href: "/docs/methodology", title: t.doc_methodology, desc: t.doc_methodology_desc, color: "#8B5CF6" },
          { href: "/docs/usage", title: t.doc_usage, desc: t.doc_usage_desc, color: "#EAB308" },
          { href: "/docs/changelog", title: t.doc_changelog, desc: t.doc_changelog_desc, color: "#22C55E" },
        ].map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="block rounded-xl p-6 transition-all hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ background: doc.color, boxShadow: `0 0 8px ${doc.color}40` }} />
              <h3 className="text-lg font-semibold tracking-tight text-white/80" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                {doc.title}
              </h3>
            </div>
            <p className="text-sm text-white/30 pl-5">{doc.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
