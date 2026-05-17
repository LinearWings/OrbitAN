"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export function LandingFooter() {
  const lang = useLanguage();
  const t = getT(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="l-footer">
      <div className="l-footer-inner">
        <div className="l-footer-col">
          <h3 className="l-footer-heading">
            {lang === "zh" ? "保持联系" : "Stay in Orbit"}
          </h3>
          <p className="l-footer-desc">
            {lang === "zh"
              ? "获取项目更新和时间管理方法论洞察。"
              : "Get project updates and time-management methodology insights."}
          </p>
        </div>

        <div className="l-footer-col">
          <h3 className="l-footer-heading">{lang === "zh" ? "导航" : "Navigate"}</h3>
          <ul className="l-footer-links">
            <li><Link href="/orbit">{t.footer_launch}</Link></li>
            <li><Link href="/docs/tutorial">{lang === "zh" ? "教程" : "Tutorial"}</Link></li>
            <li><Link href="/docs/methodology">{lang === "zh" ? "方法论" : "Methodology"}</Link></li>
            <li><Link href="/docs/usage">{lang === "zh" ? "使用指南" : "Usage"}</Link></li>
          </ul>
        </div>

        <div className="l-footer-col">
          <h3 className="l-footer-heading">{lang === "zh" ? "项目" : "Project"}</h3>
          <ul className="l-footer-links">
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <span className="l-footer-muted">
                {lang === "zh" ? "浙江大学 SQTP 项目" : "Zhejiang University SQTP"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="l-footer-bottom">
        <span>© {year} OrbitAN</span>
        <span className="l-footer-sep" />
        <span>{t.footer_text}</span>
      </div>
    </footer>
  );
}
