"use client";

import { useMemo, useState } from "react";
import { RadarMatrix } from "@/components/radar-matrix";
import { SourceCite } from "@/components/source-cite";
import { KingdomBadge } from "@/components/kingdom-badge";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";
import { AXIS_ORDER } from "@/lib/scoring";
import type { EvaluatedFood } from "@/types/catalog";

export function CompareTool({ foods }: { foods: EvaluatedFood[] }) {
  const { locale, copy } = useLocale();
  const [leftId, setLeftId] = useState("spinach-raw");
  const [rightId, setRightId] = useState("beef-liver");
  const left = foods.find((item) => item.food.id === leftId);
  const right = foods.find((item) => item.food.id === rightId);
  const pair = useMemo(() => [left, right].filter(Boolean) as EvaluatedFood[], [left, right]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {[leftId, rightId].map((value, index) => (
          <label key={index} className="grid gap-1 text-xs text-muted">
            {copy.compareSelect} {index + 1}
            <select
              className="rounded-md border border-line bg-bg-elev px-2 py-2 text-sm text-ink"
              value={value}
              onChange={(event) => (index === 0 ? setLeftId(event.target.value) : setRightId(event.target.value))}
            >
              {foods.map((item) => (
                <option key={item.food.id} value={item.food.id}>
                  {t(item.food.name, locale)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {pair.length !== 2 || pair[0].food.id === pair[1].food.id ? (
        <p className="text-sm text-muted">{copy.emptyCompare}</p>
      ) : (
        <>
          <RadarMatrix foods={pair} />
          <div className="grid gap-4 sm:grid-cols-2">
            {pair.map((item) => (
              <article key={item.food.id} className="rounded-lg border border-line bg-bg-elev p-4">
                <h2 className="text-lg font-medium">{t(item.food.name, locale)}</h2>
                <div className="mt-2">
                  <KingdomBadge category={item.food.category} />
                </div>
                <p className="mt-3 font-mono text-sm text-brass">
                  {copy.combined}: {item.combined.toFixed(1)} · {item.acrossClassTier}
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  {AXIS_ORDER.map((axis) => (
                    <li key={axis} className="flex justify-between gap-3">
                      <span className="text-muted">{copy.axes[axis]}</span>
                      <span className="font-mono">{item.scores[axis].adjusted.toFixed(1)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted">{t(item.scores.proteinQuality.rationale, locale)}</p>
                <div className="mt-2">
                  <SourceCite ids={item.scores.proteinQuality.sourceIds} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
