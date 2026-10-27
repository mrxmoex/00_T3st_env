import { useLocale } from "../i18n/LocaleContext";
import { massCompositionPercent } from "../scoring/generalNutrients";
import type { FoodRecord } from "../scoring/types";
import { formatAmount } from "./format";

const SEGMENTS = [
  { key: "water" as const, className: "mass-seg-water" },
  { key: "protein" as const, className: "mass-seg-protein" },
  { key: "fat" as const, className: "mass-seg-fat" },
  { key: "carbs" as const, className: "mass-seg-carbs" },
  { key: "other" as const, className: "mass-seg-other" },
];

export function MassCompositionBar({ food, label }: { food: FoodRecord; label: string }) {
  const { t } = useLocale();
  const pct = massCompositionPercent(food);
  const title = t.compare.massCompositionTitle({
    food: label,
    water: formatAmount(food.composition.waterG),
    protein: formatAmount(food.proteinG),
    fat: formatAmount(food.fatG),
    carbs: formatAmount(food.carbs.total),
  });

  return (
    <div className="mass-composition" title={title}>
      <span className="mass-composition-label">{label}</span>
      <div className="mass-composition-track" role="img" aria-label={title}>
        {SEGMENTS.map((seg) =>
          pct[seg.key] > 0.4 ? (
            <span
              key={seg.key}
              className={seg.className}
              style={{ flexGrow: pct[seg.key] }}
              title={`${t.compare.massCompositionLegend[seg.key]} ${formatAmount(pct[seg.key])}%`}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

export function MassCompositionKey() {
  const { t } = useLocale();
  return (
    <ul className="mass-composition-key">
      {SEGMENTS.map((seg) => (
        <li key={seg.key}>
          <span className={`mass-key-swatch ${seg.className}`} aria-hidden="true" />
          {t.compare.massCompositionLegend[seg.key]}
        </li>
      ))}
    </ul>
  );
}
