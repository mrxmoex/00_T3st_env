import { useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { generalNutrientGrams, generalNutrientScores, GENERAL_NUTRIENT_KEYS } from "../scoring/generalNutrients";
import type { FoodRecord } from "../scoring/types";
import { formatAmount } from "./format";
import { MacroCompositionPie } from "./MacroCompositionPie";
import { RadarChart } from "./RadarChart";

export interface NutrientRadarEntry {
  id: string;
  label: string;
  food: FoodRecord;
}

export function NutrientRadar({ entries, title }: { entries: readonly NutrientRadarEntry[]; title: string }) {
  const { t } = useLocale();
  const [basis, setBasis] = useState<"per100g" | "per100kcal">("per100g");

  return (
    <div className="nutrient-radar-wrap">
      <RadarChart
        hideLegend
        title={title}
        axes={GENERAL_NUTRIENT_KEYS.map((key) => ({
          short: t.compare.nutrientShort[key],
          label: t.compare.nutrientRows[key],
        }))}
        series={entries.map(({ id, label, food }) => {
          const grams = generalNutrientGrams(food);
          return {
            id,
            label,
            values: GENERAL_NUTRIENT_KEYS.map((key) => generalNutrientScores(food)[key]),
            tips: GENERAL_NUTRIENT_KEYS.map(
              (key) => `${label} · ${t.compare.nutrientRows[key]}: ${formatAmount(grams[key])} g`,
            ),
          };
        })}
      />
      <div className="nutrient-radar-controls">
        <span className="muted">{t.compare.macroShareToggleLabel}</span>
        <label>
          <input
            type="radio"
            name="macro-basis"
            checked={basis === "per100g"}
            onChange={() => setBasis("per100g")}
          />
          {t.compare.macroShareBasis.g}
        </label>
        <label>
          <input
            type="radio"
            name="macro-basis"
            checked={basis === "per100kcal"}
            onChange={() => setBasis("per100kcal")}
          />
          {t.compare.macroShareBasis.kcal}
        </label>
      </div>
      {entries.length > 0 ? (
        <ul className="radar-legend nutrient-macro-legend">
          {entries.map(({ id, label, food }, seriesIndex) => (
            <li key={id} className={`series-${seriesIndex + 1}`}>
              <MacroCompositionPie food={food} basis={basis} />
              <span className="radar-swatch" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
