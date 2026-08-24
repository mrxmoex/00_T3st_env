"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { scoredFoods } from "@/lib/catalog";
import { ALL_CATEGORIES, categoryName, t } from "@/lib/i18n";
import { loc } from "@/lib/utils";
import { TIERS, type FoodCategory, type Tier } from "@/lib/types";

export function TierBoard() {
  const { locale } = useLocale();
  const copy = t(locale);
  const [mode, setMode] = useState<"across" | "within">("across");
  const [category, setCategory] = useState<FoodCategory | "all">("all");
  const rows = useMemo(() => {
    return scoredFoods().filter((row) => category === "all" || row.food.category === category);
  }, [category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as FoodCategory | "all")}
          className="h-10 rounded-md border border-line bg-panel px-3 text-sm"
        >
          <option value="all">{copy.allCategories}</option>
          {ALL_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {categoryName(locale, item)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setMode("across")}
          className={`h-10 rounded-md border px-3 text-sm ${mode === "across" ? "border-gold text-gold" : "border-line text-mute"}`}
        >
          {copy.acrossClasses}
        </button>
        <button
          type="button"
          onClick={() => setMode("within")}
          className={`h-10 rounded-md border px-3 text-sm ${mode === "within" ? "border-gold text-gold" : "border-line text-mute"}`}
        >
          {copy.withinClass}
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {TIERS.map((tier) => {
          const items = rows.filter((row) => (mode === "across" ? row.score.tierAcross : row.score.tierWithin) === (tier as Tier));
          return (
            <section key={tier} className="rounded-lg border border-line bg-panel p-3">
              <h2 className="mb-3 font-serif text-lg text-paper">{tier}</h2>
              <ul className="space-y-2">
                {items.map((row) => (
                  <li key={row.food.id}>
                    <Link href={`/food/${row.food.slug}`} className="block rounded-md bg-ink/40 px-2 py-2 hover:bg-ink/70">
                      <p className="text-sm text-paper">{loc(row.food.name, locale)}</p>
                      <p className="text-[11px] text-mute">
                        {categoryName(locale, row.food.category)} · {Math.round(row.score.combined)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
