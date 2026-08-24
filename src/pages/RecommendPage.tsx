import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FOODS } from "../data/catalog";
import { recommend } from "../recommend/engine";
import { DIETARY_PATTERNS, type DietaryPattern } from "../scoring/types";
import { CLASS_LABELS, PATTERN_LABELS } from "../ui/labels";

export function RecommendPage() {
  const [pattern, setPattern] = useState<DietaryPattern>("plant-only");
  const [selected, setSelected] = useState<string[]>(["kale_raw", "lentils_boiled", "nori_dried"]);
  const rec = useMemo(
    () => recommend({ pattern, selectedIds: selected }),
    [pattern, selected],
  );

  function toggle(id: string): void {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <main>
      <h1>Best-practice engine</h1>
      <p className="lede">
        Recommendations track gaps. They do not flatter the plate. A plant-only pattern is
        never described as complete without fortification or supplementation.
      </p>
      <div className="toolbar">
        <label>
          Pattern
          <select
            value={pattern}
            onChange={(event) => setPattern(event.target.value as DietaryPattern)}
          >
            {DIETARY_PATTERNS.map((item) => (
              <option key={item} value={item}>
                {PATTERN_LABELS[item]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <section className="panel">
        <h2>{rec.headline}</h2>
        <div className="cards">
          {rec.gaps.map((gap) => (
            <article key={gap.id} className={`card gap-${gap.severity}`}>
              <h3>
                {gap.title}{" "}
                <span className="muted mono">{gap.severity}</span>
              </h3>
              <p>{gap.detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>Practices</h2>
        <ul>
          {rec.practices.map((practice) => (
            <li key={practice}>{practice}</li>
          ))}
        </ul>
        <p>
          Suggested foods:{" "}
          {rec.suggestedFoodIds.map((id) => (
            <Link key={id} to={`/food/${id}`} className="btn" style={{ marginRight: 8 }}>
              {FOODS.find((food) => food.id === id)?.nameDe ?? id}
            </Link>
          ))}
        </p>
      </section>
      <section className="panel">
        <h2>Current plate</h2>
        <p className="muted">Toggle foods to see which gaps remain on this plate.</p>
        <div className="cards">
          {FOODS.map((food) => (
            <label key={food.id} className="card">
              <input
                type="checkbox"
                checked={selected.includes(food.id)}
                onChange={() => toggle(food.id)}
              />{" "}
              {food.nameDe}{" "}
              <span className="muted">{CLASS_LABELS[food.class]}</span>
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}
