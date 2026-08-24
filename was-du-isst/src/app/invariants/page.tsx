"use client";

import { SourceCite } from "@/components/source-cite";
import { useLocale } from "@/components/locale-provider";
import { getInvariants } from "@/lib/catalog";
import { t } from "@/lib/i18n";

export default function InvariantsPage() {
  const { locale, copy } = useLocale();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{copy.nav.invariants}</h1>
      <p className="max-w-2xl text-sm text-muted">{copy.subtitle}</p>
      {getInvariants().map((invariant) => (
        <article key={invariant.id} className="rounded-lg border border-line bg-bg-elev p-5">
          <h2 className="text-xl font-medium">
            {invariant.number}. {t(invariant.title, locale)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t(invariant.body, locale)}</p>
          <div className="mt-4">
            <SourceCite ids={invariant.sourceIds} />
          </div>
        </article>
      ))}
    </div>
  );
}
