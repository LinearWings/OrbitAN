"use client";

import { useState, useEffect } from "react";
import { detectLang, type Lang } from "@/lib/i18n";

export const LANGUAGE_COOKIE = "orbit_lang";
export const LANGUAGE_CHANGE_EVENT = "orbit-language-change";

function readLanguage(): Lang {
  const match = document.cookie.match(/(?:^|;\s*)orbit_lang=([^;]+)/);
  const cookieLang = match?.[1] as Lang | undefined;
  return cookieLang === "zh" || cookieLang === "en"
    ? cookieLang
    : detectLang(navigator.language);
}

export function useLanguage(): Lang {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const syncLanguage = () => setLang(readLanguage());

    syncLanguage();
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage);
    window.addEventListener("storage", syncLanguage);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  return lang;
}
