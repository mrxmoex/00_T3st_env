import Link from "next/link";
import { AxisRadar } from "@/components/axis-radar";
import { SourceStack } from "@/components/source-cite";
import { TierBadge } from "@/components/tier-badge";
import { sourceTooltip } from "@/data/sources";
import { filterCatalog, sortCatalog } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { AXIS_LABELS, CATEGORY_LABELS, UI, t } from "@/lib/i18n";
import { kingdomTone } from "@/lib/kingdom-tone";
import { getLocale } from "@/lib/locale";
import { compareHref, matrixHref, type MatrixQuery } from "@/lib/query";
import { AXES, FOOD_CATEGORIES, type LocaleCode, type ScoredFood } from "@/lib/schema";

export async function MatrixApp({ query }: { query: MatrixQuery }) {
  const locale = await getLocale();
  const resolved: MatrixQuery = { ...query, lang: locale };
  const rows = sortCatalog(
    filterCatalog({
      categories: resolved.categories.length ? resolved.categories : undefined,
      includeReference: resolved.includeReference,
      query: resolved.q,
    }),
    resolved.sort,
  );
  const selected =
    rows.find((item) => item.food.id === resolved.selectedId) ?? rows[0] ?? null;

  return (
    <div className="space-y-6">
      <form method="get" action="/" className="space-y-4">
        <input type="hidden" name="lang" value={locale} />
        {resolved.selectedId ? (
          <input type="hidden" name="id" value={resolved.selectedId} />
        ) : null}
        {resolved.categories.map((category) => (
          <input key={category} type="hidden" name="klasse" value={category} />
        ))}
        <section className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-muted">
              {t(UI.search, locale)}
            </span>
            <input
              name="q"
              defaultValue={resolved.q}
              placeholder={t(UI.search, locale)}
              className="w-full rounded-lg border border-line bg-bg-elev px-3 py-2 text-sm outline-none ring-copper/40 focus:ring-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="ref"
              value="1"
              defaultChecked={resolved.includeReference}
            />
            {t(UI.includeReference, locale)}
          </label>
          <button
            type="submit"
            className="rounded-lg border border-copper/50 bg-copper/15 px-4 py-2 text-sm text-copper"
          >
            {t(UI.apply, locale)}
          </button>
        </section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm uppercase tracking-wide text-muted">
            {t(UI.sortBy, locale)}
          </h2>
          <select
            name="achse"
            defaultValue={resolved.sort}
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
      </form>

      <div className="flex flex-wrap gap-2">
        {FOOD_CATEGORIES.map((category) => {
          const active = resolved.categories.includes(category);
          const nextCategories = active
            ? resolved.categories.filter((item) => item !== category)
            : [...resolved.categories, category];
          return (
            <Link
              key={category}
              href={matrixHref({ ...resolved, categories: nextCategories })}
              data-category={category}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                active
                  ? "border-copper bg-copper/15 text-copper"
                  : "border-line text-muted hover:text-ink",
              )}
            >
              {t(CATEGORY_LABELS[category], locale)}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <p className="text-xs text-muted">{t(UI.compositeNote, locale)}</p>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="bg-bg-elev text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">{t(UI.food, locale)}</th>
                  <th className="px-3 py-2">{t(UI.tierOverall, locale)}</th>
                  <th className="px-3 py-2">
                    <Link
                      href={matrixHref({ ...resolved, sort: "composite" })}
                      className="hover:text-ink"
                    >
                      {t(UI.composite, locale)}
                    </Link>
                  </th>
                  {AXES.map((axis) => (
                    <th key={axis} className="px-2 py-2 font-mono">
                      <Link
                        href={matrixHref({ ...resolved, sort: axis })}
                        className="hover:text-ink"
                      >
                        {t(AXIS_LABELS[axis], locale).slice(0, 4)}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr
                    key={item.food.id}
                    data-food-id={item.food.id}
                    data-category={item.food.category}
                    className={cn(
                      "border-t border-line/70 hover:bg-bg-soft",
                      selected?.food.id === item.food.id && "bg-bg-soft",
                    )}
                  >
                    <td className="px-3 py-2">
                      <Link
                        href={matrixHref({ ...resolved, selectedId: item.food.id })}
                        className={cn("font-medium", kingdomTone(item.food.kingdom))}
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
                      <td
                        key={entry.axis}
                        title={sourceTooltip(entry.sourceIds)}
                        data-sources={entry.sourceIds.join(" ")}
                        className="px-2 py-2 font-mono text-muted"
                      >
                        {entry.score.toFixed(0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected ? <SelectedPanel food={selected} locale={locale} /> : null}
      </div>

      <TierStrip rows={rows} locale={locale} />
    </div>
  );
}

function SelectedPanel({
  food,
  locale,
}: {
  food: ScoredFood;
  locale: LocaleCode;
}) {
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
      <AxisRadar foods={[food]} locale={locale} />
      <p className="text-sm text-muted">{t(food.food.tradeoffs, locale)}</p>
      <div className="flex flex-wrap gap-2">
        <TierBadge tier={food.tierInClass} label={t(UI.tierInClass, locale)} />
        <Link
          href={compareHref({ a: food.food.id, b: "lentils-cooked", lang: locale })}
          className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ink"
        >
          {t(UI.compare, locale)}
        </Link>
        <Link
          href={`/food/${food.food.id}?lang=${locale}`}
          className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:text-ink"
        >
          {t(UI.food, locale)}
        </Link>
      </div>
      <SourceStack
        locale={locale}
        sourceIds={food.axes.flatMap((axis) => axis.sourceIds).slice(0, 6)}
      />
    </aside>
  );
}

function TierStrip({
  rows,
  locale,
}: {
  rows: readonly ScoredFood[];
  locale: LocaleCode;
}) {
  const groups = ["S", "A", "B", "C", "D"] as const;
  return (
    <section className="space-y-3">
      <h2 className="text-sm uppercase tracking-wide text-muted">
        {t(UI.tierOverall, locale)}
      </h2>
      {rows.every((item) => item.tierOverall !== "S") ? (
        <p className="text-xs text-muted">{t(UI.emptyS, locale)}</p>
      ) : null}
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
                      href={`/food/${item.food.id}?lang=${locale}`}
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
