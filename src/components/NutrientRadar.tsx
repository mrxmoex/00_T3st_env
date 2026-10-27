import { useLocale } from "../i18n/LocaleContext";
import { energyKj, generalNutrientGrams, generalNutrientScores, GENERAL_NUTRIENT_KEYS } from "../scoring/generalNutrients";
import type { FoodRecord } from "../scoring/types";
import { formatAmount } from "./format";
import { RadarChart } from "./RadarChart";

export interface NutrientRadarEntry {
  id: string;
  label: string;
  food: FoodRecord;
}

export function NutrientRadar({ entries, title }: { entries: readonly NutrientRadarEntry[]; title: string }) {
  const { t } = useLocale();

  return (
    <RadarChart
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
      center={entries.map(({ food }, index) => ({
        text: `${Math.round(food.kcalPer100g)} kcal · ${energyKj(food.kcalPer100g)} kJ`,
        seriesClass: `series-${index + 1}`,
      }))}
    />
  );
}
