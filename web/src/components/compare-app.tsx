"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AxisRadar } from "@/components/axis-radar";
import { SourceStack } from "@/components/source-cite";
import { TierBadge } from "@/components/tier-badge";
import { useLocale } from "@/components/locale-provider";
import { getCatalog, getFood } from "@/lib/catalog";
import { AXIS_LABELS, CATEGORY_LABELS, UI, t } from "@/lib/i18n";
import { AXES } from "@/lib/schema";

function safeFood(id: string | null, fallback: string) {
  try {
    return getFood(id && id.length > 0 ? id : fallback);
  } catch {
    return getFood(fallback);
  }
}

export function CompareApp() {
  const params = useSearchParams();
  const { locale } = useLocale();
  const catalog = getCatalog();
  const [leftId, setLeftId] = useState(params.get("a") ?? "beef-liver");
  const [rightId, setRightId] = useState(params.get("b") ?? "lentils-cooked");
  const left = useMemo(() => safeFood(leftId, "beef-liver"), [leftId]);
  const right = useMemo(() => safeFood(rightId, "lentils-cooked"), [rightId]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <FoodSelect value={leftId} onChange={setLeftId} />
        <FoodSelect value={rightId} onChange={setRightId} />
      </div>
      <AxisRadar foods={[left, right]} />
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
                <tr key={axis} className="border-t border-line/70">
                  <td className="px-3 py-2">{t(AXIS_LABELS[axis], locale)}</td>
                  <td className="px-3 py-2 font-mono">{l?.score.toFixed(0)}</td>
                  <td className="px-3 py-2 font-mono">{r?.score.toFixed(0)}</td>
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
              <SourceStack sourceIds={item.axes.flatMap((axis) => axis.sourceIds)} />
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">{catalog.length}</p>
    </div>
  );
}

function FoodSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const { locale } = useLocale();
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
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
