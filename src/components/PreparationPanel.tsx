import { Link } from "react-router-dom";
import { foodsInGroup } from "../data/catalog";
import { NUTRIENT_UNITS, type NutrientKey } from "../data/sources/snapshot";
import { NUTRIENT_LABELS, PREPARATION_LABELS } from "../i18n/labels";
import { useLocale } from "../i18n/LocaleContext";
import type { FoodRecord, ScoreCard } from "../scoring/types";
import { formatAmount, formatChange } from "./format";

/** Nutrients that cooking changes most visibly. */
const ROWS: readonly NutrientKey[] = [
  "kcal",
  "water",
  "protein",
  "vitaminC",
  "folate",
  "thiamin",
  "vitaminB6",
  "potassium",
  "iron",
  "betaCarotene",
];

export function PreparationPanel({ food, cards }: { food: FoodRecord; cards: readonly ScoreCard[] }) {
  const { t, localize } = useLocale();
  const variants = foodsInGroup(food.group);
  const [base] = variants;
  if (!base || variants.length < 2) return null;

  const cardFor = (id: string) => cards.find((card) => card.foodId === id);
  const compareQuery = variants
    .slice(0, 3)
    .map((variant, index) => `${"abc"[index]}=${variant.id}`)
    .join("&");

  const axisRows = [
    { label: t.axes.eaa, value: (card: ScoreCard) => card.eaa.score },
    { label: t.axes.micro, value: (card: ScoreCard) => card.micro.score },
    { label: t.axes.composite, value: (card: ScoreCard) => card.composite },
  ];

  return (
    <section className="panel">
      <h2>{t.food.preparationsHeading}</h2>
      <p className="muted">{t.food.preparationsLede}</p>
      <div className="matrix-wrap">
        <table className="matrix prep-table">
          <thead>
            <tr>
              <th className="sticky">{t.food.columns.nutrient}</th>
              {variants.map((variant) => (
                <th key={variant.id} className={variant.id === food.id ? "current" : undefined}>
                  <Link to={`/food/${variant.id}`}>{localize(PREPARATION_LABELS[variant.preparation])}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((key) => (
              <tr key={key}>
                <td className="sticky">
                  {localize(NUTRIENT_LABELS[key])} <span className="muted">{NUTRIENT_UNITS[key]}</span>
                </td>
                {variants.map((variant) => {
                  const value = variant.nutrients[key];
                  const change = variant === base ? null : formatChange(value, base.nutrients[key]);
                  return (
                    <td key={variant.id} className={variant.id === food.id ? "current" : undefined}>
                      {value === null ? <span className="muted">—</span> : formatAmount(value)}
                      {change ? <span className="change"> {change}</span> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
            {axisRows.map((row) => (
              <tr key={row.label} className="axis-row">
                <td className="sticky">{row.label}</td>
                {variants.map((variant) => {
                  const card = cardFor(variant.id);
                  return (
                    <td key={variant.id} className={variant.id === food.id ? "current" : undefined}>
                      {card ? row.value(card).toFixed(1) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <Link className="btn" to={`/compare?${compareQuery}`}>
          {t.food.preparationsCompare}
        </Link>
      </p>
    </section>
  );
}
