import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FOODS } from "../data/catalog";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { recommend } from "../recommend/engine";
import { DIETARY_PATTERNS, type DietaryPattern } from "../scoring/types";

export function RecommendPage() {
  const { t, locale, localize } = useLocale();
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
      <h1>{t.recommend.title}</h1>
      <p className="lede">{t.recommend.lede}</p>
      <div className="toolbar">
        <label>
          {t.recommend.pattern}
          <select
            value={pattern}
            onChange={(event) => setPattern(event.target.value as DietaryPattern)}
          >
            {DIETARY_PATTERNS.map((item) => (
              <option key={item} value={item}>
                {t.patterns[item]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <section className="panel">
        <h2>{localize(rec.headline)}</h2>
        <div className="cards">
          {rec.gaps.map((gap) => (
            <article key={gap.id} className={`card gap-${gap.severity}`}>
              <h3>
                {localize(gap.title)}{" "}
                <span className="muted mono">{t.severity[gap.severity]}</span>
              </h3>
              <p>{localize(gap.detail)}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>{t.recommend.practices}</h2>
        <ul>
          {rec.practices.map((practice) => (
            <li key={practice.en}>{localize(practice)}</li>
          ))}
        </ul>
        <p>
          {t.recommend.suggested}{" "}
          {rec.suggestedFoodIds.map((id) => {
            const food = FOODS.find((item) => item.id === id);
            return (
              <Link key={id} to={`/food/${id}`} className="btn" style={{ marginRight: 8 }}>
                {food ? foodName(food, locale) : id}
              </Link>
            );
          })}
        </p>
      </section>
      <section className="panel">
        <h2>{t.recommend.plate}</h2>
        <p className="muted">{t.recommend.plateHint}</p>
        <div className="cards">
          {FOODS.map((food) => (
            <label key={food.id} className="card">
              <input
                type="checkbox"
                checked={selected.includes(food.id)}
                onChange={() => toggle(food.id)}
              />{" "}
              {foodName(food, locale)}{" "}
              <span className="muted">{t.classes[food.class]}</span>
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}
