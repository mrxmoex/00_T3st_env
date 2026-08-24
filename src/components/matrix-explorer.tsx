"use client";

import { useMemo, useState } from "react";
import { CATALOG } from "@/lib/catalog";
import { t, UI } from "@/lib/i18n";
import { useLocale } from "./locale-context";
import { RadarMatrix } from "./radar-matrix";
import { AxisNotes, MultiplierBar, TierTable, TradeoffList } from "./tier-table";
import { INVARIANTS } from "@/data/invariants";
import { SourceStack } from "./source-chip";

export function MatrixExplorer() {
  const { locale } = useLocale();
  const [selected, setSelected] = useState<string[]>(["spinach-raw", "beef-liver", "lentils-boiled"]);

  const rows = useMemo(
    () => CATALOG.filter((row) => selected.includes(row.food.id)),
    [selected],
  );

  const toggle = (id: string) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= 3) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-muted">{t(UI.navMatrix, locale)}</p>
          <RadarMatrix rows={rows} locale={locale} />
          <div className="mt-3 flex flex-wrap gap-2">
            {CATALOG.map((row) => {
              const on = selected.includes(row.food.id);
              return (
                <button
                  key={row.food.id}
                  type="button"
                  onClick={() => toggle(row.food.id)}
                  className={`rounded-sm border px-2 py-1 text-xs ${
                    on ? "border-gold text-gold" : "border-line text-muted"
                  }`}
                >
                  {t(row.food.name, locale)}
                </button>
              );
            })}
          </div>
        </div>
        <aside className="space-y-3">
          {rows.map((row) => (
            <article key={row.food.id} className="rounded-md border border-line bg-surface p-3">
              <h3 className="font-serif text-lg">{t(row.food.name, locale)}</h3>
              <p className="mb-2 text-xs text-muted">{t(UI.multipliers, locale)}</p>
              <MultiplierBar row={row} locale={locale} />
              <div className="mt-2">
                <TradeoffList row={row} locale={locale} />
              </div>
            </article>
          ))}
        </aside>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-2xl">{t(UI.navTiers, locale)}</h2>
        <TierTable catalog={CATALOG} locale={locale} />
      </section>

      <section className="rounded-md border border-line bg-surface p-4">
        <h2 className="mb-2 font-serif text-2xl">{t(UI.educational, locale)}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {INVARIANTS.slice(0, 4).map((invariant) => (
            <article key={invariant.id} className="border-t border-line/70 pt-3">
              <h3 className="mb-1 text-sm font-medium">{t(invariant.title, locale)}</h3>
              <p className="mb-2 text-sm text-cream/85">{t(invariant.body, locale)}</p>
              <SourceStack sourceIds={invariant.sourceIds} locale={locale} />
            </article>
          ))}
        </div>
      </section>

      {rows[0] ? (
        <section className="rounded-md border border-line bg-surface p-4">
          <h2 className="mb-3 font-serif text-xl">{t(rows[0].food.name, locale)}</h2>
          <AxisNotes row={rows[0]} locale={locale} />
        </section>
      ) : null}
    </div>
  );
}
