"use client";

export default function LangSwitch({ currentLang }: { currentLang: string }) {
  const toggle = () => {
    const next = currentLang === "zh" ? "en" : "zh";
    document.cookie = `orbit_lang=${next};path=/;max-age=31536000`;
    window.location.reload();
  };

  return (
    <button
      onClick={toggle}
      className="px-2 py-1 rounded text-[0.7rem] font-medium transition-all hover:bg-white/[0.06] text-white/30 hover:text-white/50"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      title={currentLang === "zh" ? "Switch to English" : "切换到中文"}
    >
      {currentLang === "zh" ? "EN" : "中"}
    </button>
  );
}
