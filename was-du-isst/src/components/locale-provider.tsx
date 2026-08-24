"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, UI, type UiCopy } from "@/lib/i18n";
import type { Locale } from "@/types/catalog";

type LocaleState = {
  locale: Locale;
  copy: UiCopy;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem("was-du-isst-locale");
    if (stored === "en" || stored === "de") setLocaleState(stored);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("was-du-isst-locale", next);
    document.documentElement.lang = next;
  };

  const value = useMemo<LocaleState>(
    () => ({ locale, copy: UI[locale], setLocale }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale requires LocaleProvider");
  return ctx;
}
