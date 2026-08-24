import { Link } from "react-router-dom";
import { classExtraColumns } from "../scoring/extras";
import type { AxisKey, FoodClass, FoodRecord, ScoreCard } from "../scoring/types";
import { AXIS_KEYS } from "../scoring/types";
import { AXIS_SHORT, CLASS_LABELS, EXTRA_LABELS } from "../ui/labels";
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
  const extras = extraClass === "all" ? [] : classExtraColumns(extraClass);

  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <thead>
          <tr>
            <th className="sticky">Food</th>
            <th>Class</th>
            <th>Tier</th>
            {AXIS_KEYS.map((axis) => (
              <th
                key={axis}
                className="sortable"
                onClick={() => onSort(axis)}
                aria-sort={sortAxis === axis ? "descending" : "none"}
              >
                {AXIS_SHORT[axis]}
                {sortAxis === axis ? " ↓" : ""}
              </th>
            ))}
            {extras.map((column) => (
              <th key={column}>{EXTRA_LABELS[column] ?? column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ food, card }) => (
            <tr key={food.id}>
              <td className="sticky">
                <Link className="food-link" to={`/food/${food.id}`}>
                  {food.nameDe}
                </Link>
                <div className="muted mono">{food.name}</div>
              </td>
              <td>{CLASS_LABELS[food.class]}</td>
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
