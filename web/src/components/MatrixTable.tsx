import { Link } from "react-router-dom";
import { SCORE_AXES, axisShort, foodClassLabel } from "../catalog/labels.ts";
import type { Food, FoodEvaluation, ScoreAxis } from "../types/domain.ts";
import { HeatCell } from "./HeatCell.tsx";
import { TierBadge } from "./TierBadge.tsx";

export function MatrixTable({
  rows,
  sortAxis,
  onSort,
}: {
  rows: readonly { food: Food; evaluation: FoodEvaluation }[];
  sortAxis: ScoreAxis;
  onSort: (axis: ScoreAxis) => void;
}) {
  return (
    <>
      <div className="table-wrap desktop-only">
        <table className="matrix">
          <caption className="muted small" style={{ textAlign: "left", padding: "0.7rem" }}>
            Sortable heatmap. Tiers are within-class (S–D), floored by absolute score so a weak
            class leader cannot be S below 70.
          </caption>
          <thead>
            <tr>
              <th className="sticky">Food</th>
              <th>Class</th>
              <th>Protein</th>
              {SCORE_AXES.map((axis) => (
                <th key={axis}>
                  <button
                    type="button"
                    aria-pressed={sortAxis === axis}
                    onClick={() => onSort(axis)}
                  >
                    {axisShort(axis)}
                    {sortAxis === axis ? " ▾" : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ food, evaluation }) => (
              <tr key={food.id}>
                <td className="sticky">
                  <Link className="food-link" to={`/food/${food.id}`}>
                    {food.name}
                  </Link>
                  <div className="small muted">{food.nameDe}</div>
                </td>
                <td>
                  <span className="class-chip">{foodClassLabel(food.foodClass)}</span>
                </td>
                <td>
                  <TierBadge tier={evaluation.tiers.eaa_digestibility} />{" "}
                  <span className="small">{evaluation.eaa.completeness}</span>
                </td>
                {SCORE_AXES.map((axis) => (
                  <td key={axis}>
                    <HeatCell score={evaluation.scores[axis]} tier={evaluation.tiers[axis]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cards">
        {rows.map(({ food, evaluation }) => (
          <article key={food.id} className="card">
            <h3>
              <Link className="food-link" to={`/food/${food.id}`}>
                {food.name}
              </Link>
            </h3>
            <div className="small muted">
              {food.nameDe} · {foodClassLabel(food.foodClass)} · {evaluation.eaa.completeness}
            </div>
            <div className="card-scores">
              {SCORE_AXES.map((axis) => (
                <div key={axis}>
                  <div className="small muted">{axisShort(axis)}</div>
                  <HeatCell score={evaluation.scores[axis]} tier={evaluation.tiers[axis]} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
