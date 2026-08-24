"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AXIS_IDS, type AxisId } from "@/lib/types";
import { AXIS_SHORT, t, UI } from "@/lib/i18n";
import { CATEGORY_LABELS } from "@/lib/ontology";
import { filterCatalog, type CategoryFilter } from "@/lib/catalog";
import type { EvaluatedFood, FoodCategory, Locale } from "@/lib/types";
import { FOOD_CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/cn";
import { SourceStack } from "./source-chip";

type SortKey = "combined" | AxisId;

function sortRows(rows: EvaluatedFood[], key: SortKey): EvaluatedFood[] {
  return [...rows].sort((a, b) => {
    if (key === "combined") return b.combined - a.combined;
    return b.axes[key].adjusted - a.axes[key].adjusted;
  });
}

export function TierTable({
  catalog,
  locale,
}: {
  catalog: readonly EvaluatedFood[];
  locale: Locale;
}) {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("combined");

  const rows = useMemo(() => sortRows(filterCatalog(catalog, filter), sort), [catalog, filter, sort]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-xs text-muted">
          <span className="sr-only">{t(UI.filterAll, locale)}</span>
          <select
            className="w-full rounded-sm border border-line bg-surface px-2 py-2 text-sm text-cream sm:w-64"
            value={filter}
            onChange={(event) => setFilter(event.target.value as CategoryFilter)}
          >
            <option value="all">{t(UI.filterAll, locale)}</option>
            <option value="plant">{t(UI.filterPlant, locale)}</option>
            <option value="animal">{t(UI.filterAnimal, locale)}</option>
            {FOOD_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t(CATEGORY_LABELS[category], locale)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          <select
            className="w-full rounded-sm border border-line bg-surface px-2 py-2 text-sm text-cream sm:w-56"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            <option value="combined">{t(UI.sortCombined, locale)}</option>
            {AXIS_IDS.map((axis) => (
              <option key={axis} value={axis}>
                {t(AXIS_SHORT[axis], locale)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto rounded-md border border-line">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2">{locale === "de" ? "Lebensmittel" : "Food"}</th>
              <th className="px-3 py-2">{t(UI.acrossClasses, locale)}</th>
              <th className="px-3 py-2">{t(UI.withinClass, locale)}</th>
              <th className="px-3 py-2">{t(UI.sortCombined, locale)}</th>
              {AXIS_IDS.map((axis) => (
                <th key={axis} className="px-2 py-2">
                  {t(AXIS_SHORT[axis], locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.food.id} className="border-t border-line/70 hover:bg-surface-2/60">
                <td className="px-3 py-2">
                  <Link href={`/food/${row.food.id}`} className="font-medium text-cream hover:text-gold">
                    {t(row.food.name, locale)}
                  </Link>
                  <div className="text-[11px] text-muted">{t(CATEGORY_LABELS[row.food.category as FoodCategory], locale)}</div>
                </td>
                <td className="px-3 py-2">
                  <TierBadge tier={row.globalTier} />
                </td>
                <td className="px-3 py-2">
                  <TierBadge tier={row.classTier} />
                </td>
                <td className="px-3 py-2 font-mono text-gold">{row.combined.toFixed(1)}</td>
                {AXIS_IDS.map((axis) => (
                  <td key={axis} className="px-2 py-2 font-mono text-xs">
                    <span className="text-cream">{row.axes[axis].adjusted.toFixed(0)}</span>
                    <span className="text-muted">/{row.axes[axis].raw.toFixed(0)}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">{t(UI.axisNote, locale)}</p>
    </div>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-sm border px-1.5 font-mono text-xs",
        tier === "S" && "border-gold text-gold",
        tier === "A" && "border-sage text-sage",
        tier === "B" && "border-line text-cream",
        tier === "C" && "border-line text-muted",
        tier === "D" && "border-danger/50 text-danger",
      )}
    >
      {tier}
    </span>
  );
}

export function MultiplierBar({ row, locale }: { row: EvaluatedFood; locale: Locale }) {
  return (
    <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
      <Metric label={t(UI.completeness, locale)} value={row.completenessMultiplier.toFixed(2)} />
      <Metric label={t(UI.bioavailability, locale)} value={row.bioavailabilityMultiplier.toFixed(2)} />
      <Metric label={t(UI.antinutrient, locale)} value={`−${(row.antinutrientPenalty * 100).toFixed(0)}`} />
      <Metric label={t(UI.residue, locale)} value={`−${(row.residuePenalty * 100).toFixed(0)}`} />
    </dl>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-line bg-surface-2 px-2 py-1.5">
      <dt className="text-[10px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="font-mono text-cream">{value}</dd>
    </div>
  );
}

export function TradeoffList({
  row,
  locale,
}: {
  row: EvaluatedFood;
  locale: Locale;
}) {
  if (row.tradeoffs.length === 0) return null;
  return (
    <ul className="space-y-1 text-sm text-cream/90">
      {row.tradeoffs.map((item) => (
        <li key={item.en} className="border-l-2 border-gold/50 pl-2">
          {t(item, locale)}
        </li>
      ))}
    </ul>
  );
}

export function AxisNotes({ row, locale }: { row: EvaluatedFood; locale: Locale }) {
  return (
    <div className="space-y-2">
      {AXIS_IDS.map((axis) => (
        <div key={axis} className="rounded-sm border border-line/70 p-2">
          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
            <span className="text-muted">{t(AXIS_SHORT[axis], locale)}</span>
            <SourceStack sourceIds={row.axes[axis].sourceIds} locale={locale} />
          </div>
          <p className="text-sm">{t(row.axes[axis].drivers, locale)}</p>
        </div>
      ))}
    </div>
  );
}
