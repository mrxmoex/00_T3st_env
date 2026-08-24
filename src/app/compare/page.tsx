"use client";

import { CompareTool } from "@/components/compare-tool";
import { t, UI } from "@/lib/i18n";
import { useLocale } from "@/components/locale-context";

export default function ComparePage() {
  const { locale } = useLocale();
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-4xl">{t(UI.navCompare, locale)}</h1>
      <CompareTool locale={locale} />
    </div>
  );
}
