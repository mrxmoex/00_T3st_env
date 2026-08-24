"use client";

import { SOURCES } from "@/data/sources";
import { useLocale } from "@/components/locale-context";
import { t, UI } from "@/lib/i18n";

export default function SourcesPage() {
  const { locale } = useLocale();
  const ordered = [...SOURCES].sort((a, b) => b.year - a.year);

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-4xl">{t(UI.navSources, locale)}</h1>
      <p className="max-w-2xl text-sm text-muted">
        USDA FoodData Central is the quantitative backbone. FAO/WHO defines DIAAS. EFSA and DGE supply
        European reference values. NIH ODS and post-2015 bioavailability papers constrain interpretation.
        Residue claims cite EFSA monitoring and USDA PDP.
      </p>
      <ul className="space-y-2">
        {ordered.map((source) => (
          <li key={source.id} className="rounded-sm border border-line bg-surface p-3">
            <a href={source.url} target="_blank" rel="noreferrer" className="text-cream hover:text-gold">
              {source.title}
            </a>
            <p className="text-xs text-muted">
              {source.publisher} · {source.year} · {source.kind}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
