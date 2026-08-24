"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { KingdomBadge, TierMark } from "@/components/kingdom-badge";
import { useLocale } from "@/components/locale-provider";
import { ALL_CATEGORY_IDS } from "@/lib/ontology";
import { categoryLabel } from "@/lib/catalog";
import { t } from "@/lib/i18n";
import { AXIS_ORDER } from "@/lib/scoring";
import type { AxisId, CategoryId, EvaluatedFood, Tier } from "@/types/catalog";

const TIERS: Tier[] = ["S", "A", "B", "C", "D"];

export function TierList({ foods }: { foods: EvaluatedFood[] }) {
  const { locale, copy } = useLocale();
  const [axis, setAxis] = useState<AxisId | "combined">("combined");
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const groups = useMemo(() => {
    const filtered = category === "all" ? foods : foods.filter((item) => item.food.category === category);
    const sorted = [...filtered].sort((a, b) => {
      const av = axis === "combined" ? a.combined : a.scores[axis].adjusted;
      const bv = axis === "combined" ? b.combined : b.scores[axis].adjusted;
      return bv - av;
    });
    return TIERS.map((tier) => ({
      tier,
      items: sorted.filter((item) => {
        const score = axis === "combined" ? item.combined : item.scores[axis].adjusted;
        if (tier === "S") return score >= 80;
        if (tier === "A") return score >= 68 && score < 80;
        if (tier === "B") return score >= 55 && score < 68;
        if (tier === "C") return score >= 42 && score < 55;
        return score < 42;
      }),
    }));
  }, [foods, axis, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          className="rounded-md border border-line bg-bg-elev px-2 py-2 text-sm"
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
        <select
          className="rounded-md border border-line bg-bg-elev px-2 py-2 text-sm"
          value={axis}
          onChange={(event) => setAxis(event.target.value as AxisId | "combined")}
        >
          <option value="combined">{copy.combined}</option>
          {AXIS_ORDER.map((id) => (
            <option key={id} value={id}>
              {copy.axes[id]}
            </option>
          ))}
        </select>
      </div>
      {groups.map((group) => (
        <section key={group.tier} className="rounded-lg border border-line bg-bg-elev p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-muted">
            <TierMark tier={group.tier} /> {group.items.length}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {group.items.map((item) => (
              <li key={item.food.id}>
                <Link href={`/food/${item.food.id}`} className="flex items-center justify-between gap-3 rounded-md px-2 py-1 hover:bg-bg-soft">
                  <span>
                    <span className="block font-medium">{t(item.food.name, locale)}</span>
                    <KingdomBadge category={item.food.category} />
                  </span>
                  <span className="font-mono text-xs text-brass">
                    {(axis === "combined" ? item.combined : item.scores[axis].adjusted).toFixed(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
