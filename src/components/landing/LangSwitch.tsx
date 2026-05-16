"use client";

import { LANGUAGE_CHANGE_EVENT, LANGUAGE_COOKIE } from "@/hooks/useLanguage";
import type { Lang } from "@/lib/i18n";

export default function LangSwitch({ currentLang }: { currentLang: Lang }) {
  const toggle = () => {
    const next = currentLang === "zh" ? "en" : "zh";
    document.cookie = `${LANGUAGE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT));
  };

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={currentLang === "zh" ? "Switch to English" : "切换到中文"}
      className="px-2 py-1 rounded text-[0.7rem] font-medium transition-all hover:bg-white/[0.06] text-white/30 hover:text-white/50"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      title={currentLang === "zh" ? "Switch to English" : "切换到中文"}
    >
      {currentLang === "zh" ? "EN" : "中"}
    </button>
  );
}
