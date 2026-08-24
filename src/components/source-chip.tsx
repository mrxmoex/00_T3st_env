"use client";

import { getSource } from "@/data/sources";
import { t, UI } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function SourceChip({
  sourceId,
  locale,
}: {
  sourceId: string;
  locale: Locale;
}) {
  const source = getSource(sourceId);
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-sm border border-line/70 bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted hover:border-gold/60 hover:text-gold"
      title={`${source.title} — ${source.publisher} (${source.year})`}
    >
      {source.kind} · {source.year}
      <span className="sr-only">{t(UI.sourcesOnClaim, locale)}: {source.title}</span>
    </a>
  );
}

export function SourceStack({
  sourceIds,
  locale,
}: {
  sourceIds: readonly string[];
  locale: Locale;
}) {
  const unique = [...new Set(sourceIds)];
  return (
    <span className="inline-flex flex-wrap gap-1">
      {unique.map((id) => (
        <SourceChip key={id} sourceId={id} locale={locale} />
      ))}
    </span>
  );
}
