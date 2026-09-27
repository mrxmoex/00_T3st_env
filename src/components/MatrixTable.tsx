import { Link } from "react-router-dom";
import { altFoodName, foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { classExtraColumns } from "../scoring/extras";
import type { AxisKey, FoodClass, FoodRecord, ScoreCard } from "../scoring/types";
import { AXIS_KEYS } from "../scoring/types";
import { HeatCell } from "./HeatCell";

export function axisValue(card: ScoreCard, axis: AxisKey): number {
  switch (axis) {
    case "eaa":
      return card.eaa.score;
    case "efa":
      return card.efa.score;
    case "carb":
      return card.carb.score;
    case "micro":
      return card.micro.score;
    case "fibre":
      return card.fibre.score;
    case "residue":
      return card.residue.score;
    case "degradation":
      return card.degradation.score;
    case "composite":
      return card.composite;
    default: {
      const _exhaustive: never = axis;
      return _exhaustive;
    }
  }
}

export function MatrixTable({
  rows,
  extraClass,
  onSort,
  sortAxis,
}: {
  rows: { food: FoodRecord; card: ScoreCard }[];
  extraClass: FoodClass | "all";
  onSort: (axis: AxisKey) => void;
  sortAxis: AxisKey;
}) {
  const { t, locale } = useLocale();
  const extras = extraClass === "all" ? [] : classExtraColumns(extraClass);

  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <thead>
          <tr>
            <th className="sticky">{t.table.food}</th>
            <th>{t.table.class}</th>
            <th>{t.table.tier}</th>
            {AXIS_KEYS.map((axis) => (
              <th
                key={axis}
                className="sortable"
                onClick={() => onSort(axis)}
                aria-sort={sortAxis === axis ? "descending" : "none"}
              >
                {t.axesShort[axis]}
                {sortAxis === axis ? " ↓" : ""}
              </th>
            ))}
            {extras.map((column) => (
              <th key={column}>{t.extras[column] ?? column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ food, card }) => (
            <tr key={food.id}>
              <td className="sticky">
                <Link className="food-link" to={`/food/${food.id}`}>
                  {foodName(food, locale)}
                </Link>
                <div className="muted mono">{altFoodName(food, locale)}</div>
              </td>
              <td>{t.classes[food.class]}</td>
              <td>
                <span className={`tier tier-${card.tier}`} title={`#${card.classRank} / ${card.classSize}`}>
                  {card.tier}
                </span>
              </td>
              {AXIS_KEYS.map((axis) => (
                <td key={axis}>
                  <HeatCell score={axisValue(card, axis)} />
                </td>
              ))}
              {extras.map((column) => (
                <td key={column}>
                  <HeatCell score={card.extras[column] ?? 0} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
