"use client";

import { INVARIANTS } from "@/data/invariants";
import { SourceStack } from "@/components/source-chip";
import { useLocale } from "@/components/locale-context";
import { t, UI } from "@/lib/i18n";

export default function InvariantsPage() {
  const { locale } = useLocale();
  return (
    <div className="space-y-6">
      <header className="max-w-3xl space-y-2">
        <h1 className="font-serif text-4xl">{t(UI.navInvariants, locale)}</h1>
        <p className="text-muted">{t(UI.educational, locale)}</p>
      </header>
      <ol className="space-y-5">
        {INVARIANTS.map((invariant, index) => (
          <li key={invariant.id} className="rounded-md border border-line bg-surface p-4">
            <p className="font-mono text-xs text-gold">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 font-serif text-2xl">{t(invariant.title, locale)}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-cream/90">{t(invariant.body, locale)}</p>
            <div className="mt-3">
              <SourceStack sourceIds={invariant.sourceIds} locale={locale} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
