import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HeatCell } from "../components/HeatCell";
import { FOODS } from "../data/catalog";
import { scoreCatalog } from "../scoring/scoreFood";
import { AXIS_KEYS } from "../scoring/types";
import { AXIS_LABELS, CLASS_LABELS } from "../ui/labels";
import { axisValue } from "../components/MatrixTable";

const cards = scoreCatalog(FOODS);

export function ComparePage() {
  const [params] = useSearchParams();
  const [ids, setIds] = useState<[string, string, string]>([
    params.get("a") ?? "egg_whole_cooked",
    params.get("b") ?? "lentils_boiled",
    params.get("c") ?? "salmon_atlantic_cooked",
  ]);

  const selected = useMemo(
    () =>
      ids
        .map((id) => {
          const food = FOODS.find((item) => item.id === id);
          const card = cards.find((item) => item.foodId === id);
          return food && card ? { food, card } : undefined;
        })
        .filter((row): row is NonNullable<typeof row> => Boolean(row)),
    [ids],
  );

  return (
    <main>
      <h1>Side-by-side</h1>
      <p className="lede">
        Compare foods without collapsing classes. A lentil column will not grow a B12 value
        because the UI wants balance.
      </p>
      <div className="toolbar">
        {ids.map((id, index) => (
          <label key={index}>
            Food {index + 1}
            <select
              value={id}
              onChange={(event) => {
                const next: [string, string, string] = [ids[0], ids[1], ids[2]];
                next[index] = event.target.value;
                setIds(next);
              }}
            >
              {FOODS.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.nameDe} ({CLASS_LABELS[food.class]})
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className={`compare-grid n${selected.length}`}>
        {selected.map(({ food, card }) => (
          <article className="card" key={food.id}>
            <h2>
              <Link to={`/food/${food.id}`}>{food.nameDe}</Link>
            </h2>
            <p className="muted">
              {CLASS_LABELS[food.class]} · tier {card.tier}
            </p>
            <p>
              AAS {card.eaa.aas} · DIAAS {card.eaa.diaas} · limiting {card.eaa.limitingAa.toUpperCase()}
            </p>
            <p>
              Creatine {food.animalCompounds.creatineMg} mg · fibre {food.carbs.fibre} g · B12{" "}
              {card.micro.effectiveB12Ug} µg
            </p>
          </article>
        ))}
      </div>
      <div className="matrix-wrap" style={{ marginTop: "1rem" }}>
        <table className="matrix">
          <thead>
            <tr>
              <th className="sticky">Axis</th>
              {selected.map(({ food }) => (
                <th key={food.id}>{food.nameDe}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AXIS_KEYS.map((axis) => (
              <tr key={axis}>
                <td className="sticky">{AXIS_LABELS[axis]}</td>
                {selected.map(({ food, card }) => (
                  <td key={food.id}>
                    <HeatCell score={axisValue(card, axis)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
