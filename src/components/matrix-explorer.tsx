"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FlagBadge, KingdomBadge, TierBadge } from "@/components/ui/badge";
import { RadarMatrix } from "@/components/radar-matrix";
import { useLocale } from "@/components/locale-provider";
import { filterFoods } from "@/lib/catalog";
import { ALL_AXES, ALL_CATEGORIES, axisName, categoryName, t } from "@/lib/i18n";
import { loc } from "@/lib/utils";
import type { AxisId, FoodCategory } from "@/lib/types";

export function MatrixExplorer() {
  const { locale } = useLocale();
  const copy = t(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FoodCategory | "all">("all");
  const [axis, setAxis] = useState<AxisId | "combined">("combined");
  const [selected, setSelected] = useState("spinach-raw");

  const rows = useMemo(
    () =>
      filterFoods({
        query,
        categories: category === "all" ? undefined : [category],
        axis: axis === "combined" ? undefined : axis,
      }),
    [query, category, axis],
  );

  const selectedRow = rows.find((row) => row.food.id === selected) ?? rows[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            className="h-10 rounded-md border border-line bg-panel px-3 text-sm text-paper placeholder:text-mute"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as FoodCategory | "all")}
            className="h-10 rounded-md border border-line bg-panel px-3 text-sm text-paper"
          >
            <option value="all">{copy.allCategories}</option>
            {ALL_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {categoryName(locale, item)}
              </option>
            ))}
          </select>
          <select
            value={axis}
            onChange={(event) => setAxis(event.target.value as AxisId | "combined")}
            className="h-10 rounded-md border border-line bg-panel px-3 text-sm text-paper"
          >
            <option value="combined">{copy.combined}</option>
            {ALL_AXES.map((item) => (
              <option key={item} value={item}>
                {axisName(locale, item)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-panel text-xs uppercase tracking-wide text-mute">
              <tr>
                <th className="px-3 py-2">{locale === "de" ? "Lebensmittel" : "Food"}</th>
                <th className="px-3 py-2">{locale === "de" ? "Klasse" : "Class"}</th>
                <th className="px-3 py-2">{copy.combined}</th>
                <th className="px-3 py-2">{axis === "combined" ? axisName(locale, "proteinQuality") : axisName(locale, axis)}</th>
                <th className="px-3 py-2">{copy.acrossClasses}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const focusAxis = axis === "combined" ? "proteinQuality" : axis;
                return (
                  <tr
                    key={row.food.id}
                    onClick={() => setSelected(row.food.id)}
                    className={`cursor-pointer border-t border-line ${selected === row.food.id ? "bg-paper/5" : "hover:bg-paper/5"}`}
                  >
                    <td className="px-3 py-2">
                      <Link href={`/food/${row.food.slug}`} className="font-medium text-paper hover:text-gold">
                        {loc(row.food.name, locale)}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-mute">{categoryName(locale, row.food.category)}</td>
                    <td className="px-3 py-2 font-mono">{Math.round(row.score.combined)}</td>
                    <td className="px-3 py-2 font-mono">{Math.round(row.score.axes[focusAxis].adjusted)}</td>
                    <td className="px-3 py-2">
                      <TierBadge tier={row.score.tierAcross} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRow ? (
        <aside className="space-y-4 rounded-lg border border-line bg-panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-paper">{loc(selectedRow.food.name, locale)}</h2>
              <p className="mt-1 text-xs text-mute">{categoryName(locale, selectedRow.food.category)}</p>
            </div>
            <TierBadge tier={selectedRow.score.tierAcross} />
          </div>
          <KingdomBadge
            kingdom={selectedRow.food.kingdom}
            label={selectedRow.food.kingdom}
          />
          <RadarMatrix scores={[selectedRow.score]} names={[loc(selectedRow.food.name, locale)]} locale={locale} />
          <p className="text-sm text-paper/90">{loc(selectedRow.food.tradeoffs, locale)}</p>
          <div className="flex flex-wrap gap-1">
            {selectedRow.food.flags.map((flag) => (
              <FlagBadge key={flag}>{flag}</FlagBadge>
            ))}
          </div>
          <Link href={`/food/${selectedRow.food.slug}`} className="inline-flex text-sm text-gold underline">
            {locale === "de" ? "Alle Quellen und Werte" : "All sources and values"}
          </Link>
        </aside>
      ) : null}
    </div>
  );
}
