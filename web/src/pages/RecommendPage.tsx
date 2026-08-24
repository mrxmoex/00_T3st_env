import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FOODS, foodById } from "../catalog/foods.ts";
import { foodClassLabel, patternLabel } from "../catalog/labels.ts";
import { recommend } from "../recommend/engine.ts";
import { EVALUATIONS } from "../state/catalog.ts";
import type { DietaryPattern } from "../types/domain.ts";

export function RecommendPage() {
  const [pattern, setPattern] = useState<DietaryPattern>("hybrid");
  const report = useMemo(
    () => recommend({ pattern, foods: FOODS, evaluations: EVALUATIONS }),
    [pattern],
  );

  return (
    <main>
      <div className="page-head">
        <div>
          <h2>Best-practice recommendations</h2>
          <p className="lede">
            Practice advice follows the matrix. It will not claim that a pure plant diet is
            complete without naming the fortification and supplementation that remain required.
          </p>
        </div>
        <label className="field">
          Dietary pattern
          <select
            value={pattern}
            onChange={(event) => setPattern(event.target.value as DietaryPattern)}
          >
            <option value="hybrid">{patternLabel("hybrid")}</option>
            <option value="animal_inclusive">{patternLabel("animal_inclusive")}</option>
            <option value="plant_only">{patternLabel("plant_only")}</option>
          </select>
        </label>
      </div>

      <section className="cannot">
        <h3>What this engine will not claim</h3>
        <ul>
          {report.cannotClaim.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {report.items.map((item) => (
        <article key={item.id} className={`rec ${item.severity}`}>
          <div className="small muted">{item.severity}</div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}

      <section className="panel">
        <h3>Foods the current pattern highlights</h3>
        <ul>
          {report.suggestedFoodIds.map((id) => {
            const food = foodById(id);
            if (!food) {
              return null;
            }
            return (
              <li key={id}>
                <Link to={`/food/${id}`}>{food.name}</Link>
                <span className="muted"> · {foodClassLabel(food.foodClass)}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
