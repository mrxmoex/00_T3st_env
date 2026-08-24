"use client";

import Link from "next/link";
import { AxisRadar } from "@/components/axis-radar";
import { SourceCite, SourceStack } from "@/components/source-cite";
import { TierBadge } from "@/components/tier-badge";
import { useLocale } from "@/components/locale-provider";
import { AXIS_LABELS, CATEGORY_LABELS, UI, t } from "@/lib/i18n";
import { kingdomTone } from "@/lib/kingdom-tone";
import { cn } from "@/lib/cn";
import type { FoodRecord, ScoredFood } from "@/lib/schema";

export function FoodDetail({ scored }: { scored: ScoredFood }) {
  const { locale } = useLocale();
  const food = scored.food;
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t(CATEGORY_LABELS[food.category], locale)} · {food.kingdom}
        </p>
        <h1 className={cn("text-3xl font-semibold tracking-tight", kingdomTone(food.kingdom))}>
          {t(food.names, locale)}
        </h1>
        <p className="max-w-3xl text-muted">{t(food.tradeoffs, locale)}</p>
        <div className="flex flex-wrap gap-2">
          <TierBadge tier={scored.tierOverall} label={t(UI.tierOverall, locale)} />
          <TierBadge tier={scored.tierInClass} label={t(UI.tierInClass, locale)} />
          {food.fdcId ? (
            <a
              className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ink"
              href={`https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`}
              target="_blank"
              rel="noreferrer"
            >
              {t(UI.fdc, locale)} {food.fdcId}
            </a>
          ) : null}
        </div>
      </header>

      <AxisRadar foods={[scored]} />

      <section className="grid gap-3 md:grid-cols-2">
        {scored.axes.map((axis) => (
          <div key={axis.axis} className="rounded-xl border border-line bg-bg-elev p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-medium">{t(AXIS_LABELS[axis.axis], locale)}</h2>
              <span className="font-mono text-copper">{axis.score.toFixed(0)}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{t(axis.rationale, locale)}</p>
            <div className="mt-2">
              <SourceStack sourceIds={axis.sourceIds} />
            </div>
          </div>
        ))}
      </section>

      <CompositionTable food={food} />
      <AbsenceList food={food} />
    </article>
  );
}

function CompositionTable({ food }: { food: FoodRecord }) {
  const { locale } = useLocale();
  const rows = [
    ["kcal", food.composition.energyKcal],
    ["protein g", food.composition.proteinG],
    ["fat g", food.composition.fatG],
    ["carb g", food.composition.carbG],
    ["fiber g", food.composition.fiberG],
    ["sugars g", food.composition.sugarsG],
    ["Fe mg", food.micros.ironMg],
    ["Zn mg", food.micros.zincMg],
    ["Ca mg", food.micros.calciumMg],
    ["B12 µg", food.micros.vitaminB12Ug],
    ["C mg", food.micros.vitaminCMg],
    ["folate µg", food.micros.folateUg],
    ["A RAE µg", food.micros.vitaminARaeUg],
    ["retinol µg", food.micros.retinolUg],
    ["EPA mg", food.fattyAcids.epaMg],
    ["DHA mg", food.fattyAcids.dhaMg],
    ["ALA mg", food.fattyAcids.alaMg],
  ] as const;

  return (
    <section className="overflow-x-auto rounded-xl border border-line">
      <table className="min-w-full text-sm">
        <thead className="bg-bg-elev text-xs uppercase text-muted">
          <tr>
            <th className="px-3 py-2 text-left">per 100 g</th>
            <th className="px-3 py-2 text-left">value</th>
            <th className="px-3 py-2 text-left">{t(UI.sources, locale)}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, cell]) => {
            if (!cell) return null;
            return (
              <tr key={label} className="border-t border-line/70">
                <td className="px-3 py-2">{label}</td>
                <td className="px-3 py-2 font-mono">
                  {cell.value}
                  {cell.confidence !== "high" ? (
                    <span className="ml-2 text-xs text-warn">
                      {t(UI[cell.confidence === "contested" ? "contested" : "sparse"], locale)}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  <SourceCite sourceId={cell.sourceId} compact /> · {cell.year}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function AbsenceList({ food }: { food: FoodRecord }) {
  const { locale } = useLocale();
  return (
    <section className="rounded-xl border border-line bg-bg-elev p-4">
      <h2 className="mb-3 font-medium">{locale === "de" ? "Anwesenheit / Abwesenheit" : "Presence / absence"}</h2>
      <ul className="space-y-2 text-sm">
        {food.absences.map((item) => (
          <li key={item.compound} className="flex flex-wrap items-baseline gap-2">
            <span className={item.present ? "text-ok" : "text-warn"}>
              {item.compound} {item.present ? "●" : "○"}
            </span>
            {item.note ? <span className="text-muted">{t(item.note, locale)}</span> : null}
            <SourceCite sourceId={item.sourceId} compact />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href={`/compare?a=${food.id}&b=spinach-raw`} className="text-copper">
          {t(UI.compare, locale)}
        </Link>
      </p>
    </section>
  );
}
