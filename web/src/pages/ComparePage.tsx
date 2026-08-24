import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FOODS, foodById } from "../catalog/foods.ts";
import { SCORE_AXES, foodClassLabel } from "../catalog/labels.ts";
import { HeatCell } from "../components/HeatCell.tsx";
import { SourcePanel } from "../components/SourcePanel.tsx";
import { EVAL_BY_ID } from "../state/catalog.ts";

function FoodPicker({
  id,
  label,
  onChange,
}: {
  id: string;
  label: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="field">
      {label}
      <select value={id} onChange={(event) => onChange(event.target.value)}>
        {FOODS.map((food) => (
          <option key={food.id} value={food.id}>
            {food.name} — {foodClassLabel(food.foodClass)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const defaultA = FOODS[0]?.id ?? "spinach-raw";
  const defaultB = FOODS.find((food) => food.kingdom === "animal")?.id ?? "egg-boiled";
  const [aId, setAId] = useState(params.get("a") ?? defaultA);
  const [bId, setBId] = useState(params.get("b") ?? defaultB);

  const pair = useMemo(() => {
    const a = foodById(aId);
    const b = foodById(bId);
    const ea = EVAL_BY_ID[aId];
    const eb = EVAL_BY_ID[bId];
    if (!a || !b || !ea || !eb) {
      return null;
    }
    return { a, b, ea, eb };
  }, [aId, bId]);

  function update(nextA: string, nextB: string): void {
    setAId(nextA);
    setBId(nextB);
    setParams({ a: nextA, b: nextB });
  }

  if (!pair) {
    return (
      <main>
        <h2>Compare</h2>
        <p>Select two foods that exist in the catalog.</p>
      </main>
    );
  }

  return (
    <main>
      <div className="page-head">
        <div>
          <h2>Side-by-side compare</h2>
          <p className="lede">
            Same formulas, same coefficients. Differences come from the tables and class weights —
            not from a narrative that plant and animal proteins are interchangeable.
          </p>
        </div>
      </div>
      <div className="filters">
        <FoodPicker id={aId} label="Food A" onChange={(id) => update(id, bId)} />
        <FoodPicker id={bId} label="Food B" onChange={(id) => update(aId, id)} />
      </div>
      <div className="table-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th>Axis</th>
              <th>
                <Link to={`/food/${pair.a.id}`}>{pair.a.name}</Link>
              </th>
              <th>
                <Link to={`/food/${pair.b.id}`}>{pair.b.name}</Link>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Protein label</td>
              <td>{pair.ea.eaa.completeness}</td>
              <td>{pair.eb.eaa.completeness}</td>
            </tr>
            {SCORE_AXES.map((axis) => (
              <tr key={axis}>
                <td>{axis.replaceAll("_", " ")}</td>
                <td>
                  <HeatCell score={pair.ea.scores[axis]} tier={pair.ea.tiers[axis]} />
                </td>
                <td>
                  <HeatCell score={pair.eb.scores[axis]} tier={pair.eb.tiers[axis]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="compare-grid" style={{ marginTop: "1rem" }}>
        <SourcePanel food={pair.a} evaluation={pair.ea} />
        <SourcePanel food={pair.b} evaluation={pair.eb} />
      </div>
    </main>
  );
}
