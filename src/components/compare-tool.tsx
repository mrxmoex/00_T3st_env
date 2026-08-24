"use client";

import { useMemo, useState } from "react";
import { RadarMatrix } from "@/components/radar-matrix";
import { SourceCite } from "@/components/source-cite";
import { TierBadge } from "@/components/ui/badge";
import { useLocale } from "@/components/locale-provider";
import { FOODS } from "@/data/foods";
import { ALL_AXES, axisName, categoryName, t } from "@/lib/i18n";
import { scoreFood } from "@/lib/scoring";
import { loc } from "@/lib/utils";

export function CompareTool() {
  const { locale } = useLocale();
  const copy = t(locale);
  const [left, setLeft] = useState("spinach-raw");
  const [right, setRight] = useState("beef-liver-braised");
  const [third, setThird] = useState<string>("");

  const foods = useMemo(() => {
    const ids = [left, right, third].filter(Boolean);
    return FOODS.filter((food) => ids.includes(food.id));
  }, [left, right, third]);
  const scores = foods.map((food) => scoreFood(food, locale));

  return (
    <div className="space-y-6">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          [left, setLeft],
          [right, setRight],
          [third, setThird],
        ].map(([value, setter], index) => (
          <select
            key={index}
            value={value as string}
            onChange={(event) => (setter as (next: string) => void)(event.target.value)}
            className="h-10 rounded-md border border-line bg-panel px-3 text-sm"
          >
            {index === 2 ? <option value="">{copy.selectFood}</option> : null}
            {FOODS.map((food) => (
              <option key={food.id} value={food.id}>
                {loc(food.name, locale)}
              </option>
            ))}
          </select>
        ))}
      </div>

      {scores.length >= 2 ? (
        <RadarMatrix
          scores={scores}
          names={foods.map((food) => loc(food.name, locale))}
          locale={locale}
        />
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="min-w-full text-sm">
          <thead className="bg-panel text-xs uppercase text-mute">
            <tr>
              <th className="px-3 py-2 text-left">{copy.sortBy}</th>
              {foods.map((food) => (
                <th key={food.id} className="px-3 py-2 text-left">
                  {loc(food.name, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line">
              <td className="px-3 py-2 text-mute">{copy.combined}</td>
              {scores.map((score) => (
                <td key={score.foodId} className="px-3 py-2">
                  <span className="mr-2 font-mono">{Math.round(score.combined)}</span>
                  <TierBadge tier={score.tierAcross} />
                </td>
              ))}
            </tr>
            {ALL_AXES.map((axis) => (
              <tr key={axis} className="border-t border-line">
                <td className="px-3 py-2 text-mute">{axisName(locale, axis)}</td>
                {scores.map((score) => (
                  <td key={score.foodId} className="px-3 py-2 font-mono">
                    {Math.round(score.axes[axis].adjusted)}
                    <span className="ml-2 text-[11px] text-mute">
                      {copy.raw} {Math.round(score.axes[axis].raw)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-line">
              <td className="px-3 py-2 text-mute">{copy.diaas}</td>
              {foods.map((food) => (
                <td key={food.id} className="px-3 py-2">
                  {food.proteinQuality.diaas ? <SourceCite value={food.proteinQuality.diaas} /> : "—"}
                </td>
              ))}
            </tr>
            <tr className="border-t border-line">
              <td className="px-3 py-2 text-mute">B12</td>
              {foods.map((food) => (
                <td key={food.id} className="px-3 py-2">
                  <SourceCite value={food.composition.vitaminB12Ug} />
                </td>
              ))}
            </tr>
            <tr className="border-t border-line">
              <td className="px-3 py-2 text-mute">{locale === "de" ? "Klasse" : "Class"}</td>
              {foods.map((food) => (
                <td key={food.id} className="px-3 py-2 text-mute">
                  {categoryName(locale, food.category)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
