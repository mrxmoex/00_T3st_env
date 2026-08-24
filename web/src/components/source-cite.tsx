import { getSource } from "@/data/sources";
import type { LocaleCode } from "@/lib/schema";

export function SourceCite({
  sourceId,
  compact = false,
  locale = "de",
}: {
  sourceId: string;
  compact?: boolean;
  locale?: LocaleCode;
}) {
  const source = getSource(sourceId);
  const label = compact
    ? `${source.organization} ${source.year}`
    : `${source.title} (${source.year})`;
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className="inline underline decoration-copper/40 decoration-dotted underline-offset-2 hover:text-copper"
      title={source.title}
    >
      {compact ? label : locale === "de" ? `Quelle: ${label}` : `Source: ${label}`}
    </a>
  );
}

export function SourceStack({
  sourceIds,
  locale = "de",
}: {
  sourceIds: readonly string[];
  locale?: LocaleCode;
}) {
  const unique = [...new Set(sourceIds)];
  return (
    <span className="inline-flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted">
      {unique.map((id) => (
        <SourceCite key={id} sourceId={id} compact locale={locale} />
      ))}
    </span>
  );
}
