"use client";

import { SOURCES } from "@/data/sources";
import { useLocale } from "@/components/locale-provider";

export function SourceLibrary() {
  const { locale } = useLocale();
  const ordered = [...SOURCES].sort((a, b) => b.year - a.year);
  return (
    <ul className="space-y-3">
      {ordered.map((source) => (
        <li key={source.id} className="rounded-xl border border-line bg-bg-elev p-4">
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-copper hover:underline"
          >
            {source.title}
          </a>
          <p className="mt-1 text-sm text-muted">
            {source.organization} · {source.year} · {source.kind}
          </p>
          <p className="mt-1 text-xs text-muted">
            {locale === "de" ? "Jeder Matrixwert verweist auf eine dieser Quellen." : "Every matrix value points at one of these sources."}
          </p>
        </li>
      ))}
    </ul>
  );
}
