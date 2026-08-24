"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AxisRadar } from "@/components/axis-radar";
import { SourceStack } from "@/components/source-cite";
import { TierBadge } from "@/components/tier-badge";
import { useLocale } from "@/components/locale-provider";
import { filterCatalog, sortCatalog } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { AXIS_LABELS, CATEGORY_LABELS, UI, t } from "@/lib/i18n";
import { kingdomTone } from "@/lib/kingdom-tone";
import {
  AXES,
  FOOD_CATEGORIES,
  type AxisId,
  type FoodCategory,
  type ScoredFood,
} from "@/lib/schema";

type SortKey = AxisId | "composite";

export function MatrixApp() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [includeReference, setIncludeReference] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("composite");
  const [selectedId, setSelectedId] = useState("beef-liver");

  const rows = useMemo(() => {
    const filtered = filterCatalog({
      categories: categories.length ? categories : undefined,
      includeReference,
      query,
    });
    return sortCatalog(filtered, sortKey);
  }, [categories, includeReference, query, sortKey]);

  const selected =
    rows.find((item) => item.food.id === selectedId) ?? rows[0] ?? null;

  function toggleCategory(category: FoodCategory) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-muted">
            {t(UI.search, locale)}
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(UI.search, locale)}
            className="w-full rounded-lg border border-line bg-bg-elev px-3 py-2 text-sm outline-none ring-copper/40 focus:ring-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={includeReference}
            onChange={(event) => setIncludeReference(event.target.checked)}
          />
          {t(UI.includeReference, locale)}
        </label>
      </section>

      <div className="flex flex-wrap gap-2">
        {FOOD_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => toggleCategory(category)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              categories.includes(category)
                ? "border-copper bg-copper/15 text-copper"
                : "border-line text-muted hover:text-ink",
            )}
          >
            {t(CATEGORY_LABELS[category], locale)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm uppercase tracking-wide text-muted">
              {t(UI.sortBy, locale)}
            </h2>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-lg border border-line bg-bg-elev px-3 py-2 text-sm"
            >
              <option value="composite">{t(UI.composite, locale)}</option>
              {AXES.map((axis) => (
                <option key={axis} value={axis}>
                  {t(AXIS_LABELS[axis], locale)}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted">{t(UI.compositeNote, locale)}</p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-bg-elev text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">{t(UI.food, locale)}</th>
                  <th className="px-3 py-2">{t(UI.tierOverall, locale)}</th>
                  <th className="px-3 py-2">{t(UI.composite, locale)}</th>
                  {AXES.map((axis) => (
                    <th key={axis} className="px-2 py-2 font-mono">
                      {t(AXIS_LABELS[axis], locale).slice(0, 4)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr
                    key={item.food.id}
                    onClick={() => setSelectedId(item.food.id)}
                    className={cn(
                      "cursor-pointer border-t border-line/70 hover:bg-bg-soft",
                      selected?.food.id === item.food.id && "bg-bg-soft",
                    )}
                  >
                    <td className="px-3 py-2">
                      <Link
                        href={`/food/${item.food.id}`}
                        className={cn("font-medium", kingdomTone(item.food.kingdom))}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {t(item.food.names, locale)}
                      </Link>
                      <div className="text-xs text-muted">
                        {t(CATEGORY_LABELS[item.food.category], locale)}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <TierBadge tier={item.tierOverall} />
                    </td>
                    <td className="px-3 py-2 font-mono">{item.composite.toFixed(0)}</td>
                    {item.axes.map((entry) => (
                      <td key={entry.axis} className="px-2 py-2 font-mono text-muted">
                        {entry.score.toFixed(0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected ? <SelectedPanel food={selected} /> : null}
      </div>

      <TierStrip rows={rows} />
    </div>
  );
}

function SelectedPanel({ food }: { food: ScoredFood }) {
  const { locale } = useLocale();
  return (
    <aside className="space-y-3 rounded-xl border border-line bg-bg-elev p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={cn("text-lg font-semibold", kingdomTone(food.food.kingdom))}>
            {t(food.food.names, locale)}
          </h3>
          <p className="text-xs text-muted">
            {t(CATEGORY_LABELS[food.food.category], locale)}
            {food.food.fdcId ? ` · FDC ${food.food.fdcId}` : ""}
          </p>
        </div>
        <TierBadge tier={food.tierOverall} label={t(UI.tierOverall, locale)} />
      </div>
      <AxisRadar foods={[food]} />
      <p className="text-sm text-muted">{t(food.food.tradeoffs, locale)}</p>
      <div className="flex flex-wrap gap-2">
        <TierBadge tier={food.tierInClass} label={t(UI.tierInClass, locale)} />
        <Link
          href={`/compare?a=${food.food.id}&b=lentils-cooked`}
          className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ink"
        >
          {t(UI.compare, locale)}
        </Link>
        <Link
          href={`/food/${food.food.id}`}
          className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ink"
        >
          {t(UI.food, locale)}
        </Link>
      </div>
      <SourceStack
        sourceIds={food.axes.flatMap((axis) => axis.sourceIds).slice(0, 6)}
      />
    </aside>
  );
}

function TierStrip({ rows }: { rows: readonly ScoredFood[] }) {
  const { locale } = useLocale();
  const groups = ["S", "A", "B", "C", "D"] as const;
  return (
    <section className="space-y-3">
      <h2 className="text-sm uppercase tracking-wide text-muted">
        {t(UI.tierOverall, locale)}
      </h2>
      <div className="grid gap-3 md:grid-cols-5">
        {groups.map((tier) => (
          <div key={tier} className="rounded-xl border border-line bg-bg-elev p-3">
            <TierBadge tier={tier} />
            <ul className="mt-2 space-y-1 text-sm">
              {rows
                .filter((item) => item.tierOverall === tier)
                .map((item) => (
                  <li key={item.food.id}>
                    <Link
                      href={`/food/${item.food.id}`}
                      className={kingdomTone(item.food.kingdom)}
                    >
                      {t(item.food.names, locale)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
