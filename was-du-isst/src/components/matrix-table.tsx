"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { KingdomBadge, TierMark } from "@/components/kingdom-badge";
import { useLocale } from "@/components/locale-provider";
import { ALL_CATEGORY_IDS } from "@/lib/ontology";
import { t } from "@/lib/i18n";
import { AXIS_ORDER } from "@/lib/scoring";
import { categoryLabel } from "@/lib/catalog";
import type { AxisId, CategoryId, EvaluatedFood } from "@/types/catalog";

type SortKey = AxisId | "combined";

export function MatrixTable({ foods }: { foods: EvaluatedFood[] }) {
  const { locale, copy } = useLocale();
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<SortKey>("combined");

  const rows = useMemo(() => {
    const filtered = category === "all" ? foods : foods.filter((item) => item.food.category === category);
    return [...filtered].sort((a, b) => {
      const av = sort === "combined" ? a.combined : a.scores[sort].adjusted;
      const bv = sort === "combined" ? b.combined : b.scores[sort].adjusted;
      return bv - av;
    });
  }, [foods, category, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="grid gap-1 text-xs text-muted">
          {copy.allCategories}
          <select
            className="rounded-md border border-line bg-bg-elev px-2 py-2 text-sm text-ink"
            value={category}
            onChange={(event) => setCategory(event.target.value as CategoryId | "all")}
          >
            <option value="all">{copy.allCategories}</option>
            {ALL_CATEGORY_IDS.map((id) => (
              <option key={id} value={id}>
                {t(categoryLabel(id).name, locale)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted">
          {copy.sortBy}
          <select
            className="rounded-md border border-line bg-bg-elev px-2 py-2 text-sm text-ink"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            <option value="combined">{copy.combined}</option>
            {AXIS_ORDER.map((axis) => (
              <option key={axis} value={axis}>
                {copy.axes[axis]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-xs text-muted">{copy.combinedNote}</p>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="min-w-[820px] w-full text-left text-sm">
          <thead className="bg-bg-soft text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-2 font-medium"> </th>
              <th className="px-3 py-2 font-medium">{locale === "de" ? "Lebensmittel" : "Food"}</th>
              {AXIS_ORDER.map((axis) => (
                <th key={axis} className="px-3 py-2 font-medium">
                  {copy.axes[axis]}
                </th>
              ))}
              <th className="px-3 py-2 font-medium">{copy.combined}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.food.id} className="border-t border-line/80">
                <td className="px-3 py-2">
                  <TierMark tier={row.acrossClassTier} />
                </td>
                <td className="px-3 py-2">
                  <Link href={`/food/${row.food.id}`} className="font-medium hover:text-brass">
                    {t(row.food.name, locale)}
                  </Link>
                  <div className="mt-1">
                    <KingdomBadge category={row.food.category} />
                  </div>
                </td>
                {AXIS_ORDER.map((axis) => (
                  <td key={axis} className="px-3 py-2 font-mono text-xs">
                    {row.scores[axis].adjusted.toFixed(1)}
                  </td>
                ))}
                <td className="px-3 py-2 font-mono text-xs text-brass">{row.combined.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
