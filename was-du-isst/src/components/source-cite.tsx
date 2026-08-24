"use client";

import { SOURCE_BY_ID } from "@/data/sources";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";

export function SourceCite({ ids }: { ids: string[] }) {
  const { locale, copy } = useLocale();
  const unique = [...new Set(ids)].filter((id) => SOURCE_BY_ID[id]);
  if (unique.length === 0) return null;
  return (
    <span className="inline-flex flex-wrap gap-1 align-middle">
      {unique.map((id) => {
        const source = SOURCE_BY_ID[id];
        return (
          <a
            key={id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            title={`${t(source.title, locale)} (${source.year})`}
            className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted hover:border-brass hover:text-brass"
          >
            {source.id.replace(/-20\d\d$/, "")} {source.year}
          </a>
        );
      })}
      <span className="sr-only">{copy.sourcesOnClaim}</span>
    </span>
  );
}
