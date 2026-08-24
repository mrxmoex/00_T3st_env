"use client";

import { INVARIANTS } from "@/data/invariants";
import { SourceStack } from "@/components/source-cite";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";

export function InvariantList() {
  const { locale } = useLocale();
  return (
    <ol className="space-y-4">
      {INVARIANTS.map((item, index) => (
        <li key={item.id} className="rounded-xl border border-line bg-bg-elev p-4">
          <p className="text-xs uppercase tracking-wide text-copper">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="mt-1 text-lg font-semibold">{t(item.title, locale)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t(item.body, locale)}</p>
          <div className="mt-3">
            <SourceStack sourceIds={item.sourceIds} />
          </div>
        </li>
      ))}
    </ol>
  );
}
