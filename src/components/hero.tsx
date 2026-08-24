"use client";

import { t, UI } from "@/lib/i18n";
import { useLocale } from "./locale-context";

export function Hero() {
  const { locale } = useLocale();
  return (
    <section className="max-w-3xl space-y-2">
      <p className="text-xs uppercase tracking-[0.18em] text-gold">Matrix</p>
      <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{t(UI.appTitle, locale)}</h1>
      <p className="text-base text-muted">{t(UI.heroBody, locale)}</p>
      <p className="text-xs text-muted">{t(UI.noLogin, locale)}</p>
    </section>
  );
}
