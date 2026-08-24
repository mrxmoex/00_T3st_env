"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { LocaleCode } from "@/lib/schema";

type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const listeners = new Set<() => void>();
let current: LocaleCode = "de";
let hydrated = false;

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function readBrowserLocale(): LocaleCode {
  const stored = window.localStorage.getItem("nahrung-locale");
  if (stored === "de" || stored === "en") {
    return stored;
  }
  return navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
}

function subscribe(listener: () => void) {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    current = readBrowserLocale();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): LocaleCode {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    current = readBrowserLocale();
  }
  return current;
}

function getServerSnapshot(): LocaleCode {
  return "de";
}

function writeLocale(next: LocaleCode) {
  current = next;
  window.localStorage.setItem("nahrung-locale", next);
  document.documentElement.lang = next;
  emit();
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale: writeLocale }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale requires LocaleProvider");
  }
  return ctx;
}
