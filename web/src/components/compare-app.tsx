import { sourceTooltip } from "@/data/sources";
import { AxisRadar } from "@/components/axis-radar";
import { SourceStack } from "@/components/source-cite";
import { TierBadge } from "@/components/tier-badge";
import { getCatalog, getFood } from "@/lib/catalog";
import { AXIS_LABELS, CATEGORY_LABELS, UI, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { CompareQuery } from "@/lib/query";
import { AXES, type LocaleCode } from "@/lib/schema";

function safeFood(id: string, fallback: string) {
  try {
    return getFood(id.length > 0 ? id : fallback);
  } catch {
    return getFood(fallback);
  }
}

export async function CompareApp({ query }: { query: CompareQuery }) {
  const locale = await getLocale();
  const catalog = getCatalog();
  const left = safeFood(query.a, "beef-liver");
  const right = safeFood(query.b, "lentils-cooked");

  return (
    <div className="space-y-6">
      <form method="get" action="/compare" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <input type="hidden" name="lang" value={locale} />
        <FoodSelect name="a" value={left.food.id} locale={locale} />
        <FoodSelect name="b" value={right.food.id} locale={locale} />
        <button
          type="submit"
          className="rounded-lg border border-copper/50 bg-copper/15 px-4 py-2 text-sm text-copper"
        >
          {t(UI.apply, locale)}
        </button>
      </form>
      <AxisRadar foods={[left, right]} locale={locale} />
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full text-sm">
          <thead className="bg-bg-elev text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2 text-left">{t(UI.matrix, locale)}</th>
              <th className="px-3 py-2 text-left">{t(left.food.names, locale)}</th>
              <th className="px-3 py-2 text-left">{t(right.food.names, locale)}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line/70">
              <td className="px-3 py-2 text-muted">{t(UI.tierOverall, locale)}</td>
              <td className="px-3 py-2">
                <TierBadge tier={left.tierOverall} />
              </td>
              <td className="px-3 py-2">
                <TierBadge tier={right.tierOverall} />
              </td>
            </tr>
            {AXES.map((axis) => {
              const l = left.axes.find((item) => item.axis === axis);
              const r = right.axes.find((item) => item.axis === axis);
              return (
                <tr key={axis} data-axis={axis} className="border-t border-line/70">
                  <td className="px-3 py-2">{t(AXIS_LABELS[axis], locale)}</td>
                  <td
                    className="px-3 py-2 font-mono"
                    title={l ? sourceTooltip(l.sourceIds) : undefined}
                  >
                    {l?.score.toFixed(0)}
                  </td>
                  <td
                    className="px-3 py-2 font-mono"
                    title={r ? sourceTooltip(r.sourceIds) : undefined}
                  >
                    {r?.score.toFixed(0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[left, right].map((item) => (
          <div key={item.food.id} className="rounded-xl border border-line bg-bg-elev p-4">
            <h2 className="font-medium">{t(item.food.names, locale)}</h2>
            <p className="text-xs text-muted">
              {t(CATEGORY_LABELS[item.food.category], locale)}
            </p>
            <p className="mt-2 text-sm text-muted">{t(item.food.tradeoffs, locale)}</p>
            <div className="mt-3">
              <SourceStack
                locale={locale}
                sourceIds={item.axes.flatMap((axis) => axis.sourceIds)}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">{catalog.length}</p>
    </div>
  );
}

function FoodSelect({
  name,
  value,
  locale,
}: {
  name: "a" | "b";
  value: string;
  locale: LocaleCode;
}) {
  return (
    <select
      name={name}
      defaultValue={value}
      className="w-full rounded-lg border border-line bg-bg-elev px-3 py-2 text-sm"
    >
      {getCatalog().map((item) => (
        <option key={item.food.id} value={item.food.id}>
          {t(item.food.names, locale)} — {t(CATEGORY_LABELS[item.food.category], locale)}
        </option>
      ))}
    </select>
  );
}
