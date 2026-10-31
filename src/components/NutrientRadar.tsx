import { useMemo, useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { activeCarbsG } from "../scoring/carbs";
import {
  generalNutrientGrams,
  GENERAL_NUTRIENT_KEYS,
  NUTRIENT_RADAR_FULL,
  nutrientRadarAmounts,
  nutrientRadarSpokes,
  scaleGramsForBasis,
  type NutrientBasis,
} from "../scoring/generalNutrients";
import { macroEnergyShares } from "../scoring/macroEnergy";
import type { FoodRecord } from "../scoring/types";
import { formatAmount } from "./format";
import { MacroCompositionPie } from "./MacroCompositionPie";
import { MassCompositionBar, MassCompositionKey } from "./MassCompositionBar";
import { RadarChart, RINGS } from "./RadarChart";

export interface NutrientRadarEntry {
  id: string;
  label: string;
  food: FoodRecord;
}

export function NutrientRadar({ entries }: { entries: readonly NutrientRadarEntry[] }) {
  const { t } = useLocale();
  const [basis, setBasis] = useState<NutrientBasis>("per100g");

  const basisLabel = basis === "per100kcal" ? t.compare.macroShareBasis.kcal : t.compare.macroShareBasis.g;
  const unit = basis === "per100kcal" ? "kcal" : "g";
  const tickLabel = (ring: number) => `${formatAmount((ring / 100) * NUTRIENT_RADAR_FULL[basis])} ${unit}`;
  const radarTitle = t.compare.nutrientRadarTitle(basisLabel);
  const hint = t.compare.nutrientRadarHint({ basis, rings: RINGS.map(tickLabel).join(", ") });

  const axes = useMemo(
    () =>
      GENERAL_NUTRIENT_KEYS.map((key) => ({
        short: t.compare.nutrientShort[key],
        label: `${t.compare.nutrientShort[key]} (${unit} ${basisLabel})`,
      })),
    [basisLabel, t, unit],
  );

  const series = useMemo(
    () =>
      entries.map(({ id, label, food }) => {
        const spokes = nutrientRadarSpokes(food, basis);
        const amounts = nutrientRadarAmounts(food, basis);
        const grams = generalNutrientGrams(food);
        return {
          id,
          label,
          values: GENERAL_NUTRIENT_KEYS.map((key) => spokes[key]),
          tips: GENERAL_NUTRIENT_KEYS.map((key) => {
            const nutrient = t.compare.nutrientShort[key];
            if (basis === "per100g") return `${label} · ${nutrient}: ${formatAmount(grams[key])} g ${basisLabel}`;
            const gramsPerKcal = formatAmount(scaleGramsForBasis(grams[key], food, basis));
            return `${label} · ${nutrient}: ${gramsPerKcal} g = ${Math.round(amounts[key])} kcal ${basisLabel}`;
          }),
        };
      }),
    [basis, basisLabel, entries, t],
  );

  return (
    <div className="nutrient-radar-wrap">
      <RadarChart hideLegend key={basis} title={radarTitle} axes={axes} series={series} tickLabel={tickLabel} />
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
      <p className="muted nutrient-radar-hint">{hint}</p>
      {entries.length > 0 ? (
        <>
          <ul className="radar-legend nutrient-macro-legend" aria-label={t.compare.macroLegendHeading}>
            {entries.map(({ id, label, food }, seriesIndex) => {
              const shares = macroEnergyShares(food);
              const proteinG = scaleGramsForBasis(food.proteinG, food, basis);
              const fatG = scaleGramsForBasis(food.fatG, food, basis);
              const carbG = scaleGramsForBasis(activeCarbsG(food), food, basis);
              return (
                <li key={id} className={`nutrient-macro-legend-item series-${seriesIndex + 1}`}>
                  <span className="radar-swatch" aria-hidden="true" />
                  <div className="nutrient-macro-legend-body">
                    <div className="nutrient-macro-legend-title">
                      <strong>{label}</strong>
                      <MacroCompositionPie food={food} />
                    </div>
                    <ul className="macro-share-lines">
                      <li>
                        <span className="macro-key-dot macro-seg-protein" aria-hidden="true" />
                        {t.compare.macroLegend.protein}: {shares.protein.toFixed(0)}% · {formatAmount(proteinG)} g
                      </li>
                      <li>
                        <span className="macro-key-dot macro-seg-fat" aria-hidden="true" />
                        {t.compare.macroLegend.fat}: {shares.fat.toFixed(0)}% · {formatAmount(fatG)} g
                      </li>
                      <li>
                        <span className="macro-key-dot macro-seg-carb" aria-hidden="true" />
                        {t.compare.macroLegend.carb}: {shares.carb.toFixed(0)}% · {formatAmount(carbG)} g
                      </li>
                      <li>
                        <span className="macro-key-dot macro-seg-other" aria-hidden="true" />
                        {t.compare.macroLegend.other}: {shares.other.toFixed(0)}%
                      </li>
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mass-composition-block">
            <p className="mass-composition-heading">{t.compare.massCompositionHeading}</p>
            {entries.map(({ id, label, food }) => (
              <MassCompositionBar key={id} food={food} label={label} />
            ))}
            <MassCompositionKey />
          </div>
        </>
      ) : null}
    </div>
  );
}
