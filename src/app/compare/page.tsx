"use client";

import { CompareTool } from "@/components/compare-tool";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";

export default function ComparePage() {
  const { locale } = useLocale();
  const copy = t(locale);
  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl">{copy.nav.compare}</h1>
        <p className="max-w-3xl text-sm text-mute">
          {locale === "de"
            ? "Dieselbe Matrix für beide Seiten. Ein hoher Wert auf einer Achse kann auf einer anderen verloren gehen."
            : "The same matrix on both sides. A high value on one axis can be lost on another."}
        </p>
      </header>
      <CompareTool />
    </div>
  );
}
