import { useMemo, useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { activeCarbsG } from "../scoring/carbs";
import {
  generalNutrientGramsForBasis,
  generalNutrientScoresForBasis,
  GENERAL_NUTRIENT_KEYS,
  scaleGramsForBasis,
  type NutrientBasis,
} from "../scoring/generalNutrients";
import { macroEnergyShares } from "../scoring/macroEnergy";
import type { FoodRecord } from "../scoring/types";
import { formatAmount } from "./format";
import { MacroCompositionPie } from "./MacroCompositionPie";
import { MassCompositionBar, MassCompositionKey } from "./MassCompositionBar";
import { RadarChart } from "./RadarChart";

export interface NutrientRadarEntry {
  id: string;
  label: string;
  food: FoodRecord;
}

export function NutrientRadar({ entries, title }: { entries: readonly NutrientRadarEntry[]; title: string }) {
  const { t } = useLocale();
  const [basis, setBasis] = useState<NutrientBasis>("per100g");

  const basisLabel = basis === "per100kcal" ? t.compare.macroShareBasis.kcal : t.compare.macroShareBasis.g;
  const radarTitle = t.compare.nutrientRadarTitle(basisLabel);
  const hint = t.compare.nutrientRadarHint(basisLabel);

  const axes = useMemo(
    () =>
      GENERAL_NUTRIENT_KEYS.map((key) => ({
        short: t.compare.nutrientShort[key],
        label: t.compare.nutrientRows[key],
      })),
    [t],
  );

  const series = useMemo(
    () =>
      entries.map(({ id, label, food }) => {
        const grams = generalNutrientGramsForBasis(food, basis);
        return {
          id,
          label,
          values: GENERAL_NUTRIENT_KEYS.map((key) => generalNutrientScoresForBasis(food, basis)[key]),
          tips: GENERAL_NUTRIENT_KEYS.map(
            (key) => `${label} · ${t.compare.nutrientRows[key]}: ${formatAmount(grams[key])} g (${basisLabel})`,
          ),
        };
      }),
    [basis, basisLabel, entries, t],
  );

  return (
    <div className="nutrient-radar-wrap">
      <RadarChart hideLegend key={basis} title={title || radarTitle} axes={axes} series={series} />
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
              const shares = macroEnergyShares(food, basis);
              const proteinG = scaleGramsForBasis(food.proteinG, food, basis);
              const fatG = scaleGramsForBasis(food.fatG, food, basis);
              const carbG = scaleGramsForBasis(activeCarbsG(food), food, basis);
              return (
                <li key={id} className={`nutrient-macro-legend-item series-${seriesIndex + 1}`}>
                  <span className="radar-swatch" aria-hidden="true" />
                  <div className="nutrient-macro-legend-body">
                    <div className="nutrient-macro-legend-title">
                      <strong>{label}</strong>
                      <MacroCompositionPie food={food} basis={basis} />
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
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="muted macro-legend-note">{t.compare.macroLegendNote}</p>
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
