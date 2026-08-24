"use client";

import { useLocale } from "@/components/locale-provider";
import { getSources } from "@/lib/catalog";
import { t } from "@/lib/i18n";

export default function SourcesPage() {
  const { locale, copy } = useLocale();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{copy.nav.sources}</h1>
      <ul className="space-y-4">
        {getSources().map((source) => (
          <li key={source.id} className="rounded-lg border border-line bg-bg-elev p-4">
            <p className="font-mono text-xs text-brass">
              {source.kind} · {source.year}
            </p>
            <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 block font-medium hover:text-brass">
              {t(source.title, locale)}
            </a>
            <p className="mt-1 text-sm text-muted">{source.publisher}</p>
            {source.note ? <p className="mt-2 text-sm">{t(source.note, locale)}</p> : null}
            <p className="mt-2 text-xs text-muted">
              {copy.year} {source.year} · {source.accessed}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
