"use client";

import { useState, useEffect } from "react";
import { detectLang, type Lang } from "@/lib/i18n";

export function useLanguage(): Lang {
  const [lang, setLang] = useState<Lang>("zh");

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)orbit_lang=([^;]+)/);
    const cookieLang = match?.[1] as Lang | undefined;
    setLang(cookieLang || detectLang(navigator.language));
  }, []);

  return lang;
}
