import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { de } from "./de";
import { en } from "./en";
import { applyLocale, readLocale, type Locale, type LocalizedText } from "./locale";
import type { Messages } from "./messages";

const MESSAGES: Record<Locale, Messages> = { de, en };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
  localize: (text: LocalizedText) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readLocale);

  useEffect(() => {
    applyLocale(locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: MESSAGES[locale], localize: (text) => text[locale] }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used inside <LocaleProvider>");
  }
  return value;
}
