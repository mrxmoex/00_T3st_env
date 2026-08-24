"use client";

import { SourceLink } from "@/components/source-cite";
import { useLocale } from "@/components/locale-provider";
import { INVARIANTS } from "@/data/invariants";
import { t } from "@/lib/i18n";
import { loc } from "@/lib/utils";

export default function InvariantsPage() {
  const { locale } = useLocale();
  const copy = t(locale);
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl">{copy.nav.invariants}</h1>
        <p className="max-w-3xl text-sm text-mute">
          {locale === "de"
            ? "Das sind keine Meinungen. Sie sind im Scoring als harte Faktoren verdrahtet."
            : "These are not opinions. They are wired into scoring as hard factors."}
        </p>
      </header>
      <div className="space-y-4">
        {INVARIANTS.map((invariant, index) => (
          <article key={invariant.id} className="rounded-lg border border-line bg-panel p-5">
            <p className="text-xs uppercase tracking-widest text-gold">0{index + 1}</p>
            <h2 className="mt-1 font-serif text-2xl text-paper">{loc(invariant.title, locale)}</h2>
            <p className="mt-3 text-sm leading-7 text-paper/85">{loc(invariant.body, locale)}</p>
            <p className="mt-3 text-sm text-chlorophyll">{loc(invariant.implication, locale)}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {invariant.sourceIds.map((id) => (
                <li key={id}>
                  <SourceLink id={id} />
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
