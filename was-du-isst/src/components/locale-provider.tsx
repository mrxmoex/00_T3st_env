"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { UI, type UiCopy } from "@/lib/i18n";
import type { Locale } from "@/types/catalog";

type LocaleState = {
  locale: Locale;
  copy: UiCopy;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const value = useMemo<LocaleState>(
    () => ({
      locale: initialLocale,
      copy: UI[initialLocale],
      setLocale: () => undefined,
    }),
    [initialLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale requires LocaleProvider");
  return ctx;
}
