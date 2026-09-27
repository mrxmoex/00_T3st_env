import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AxisRadar } from "../components/AxisRadar";
import { HeatCell } from "../components/HeatCell";
import { FOODS } from "../data/catalog";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { scoreCatalog } from "../scoring/scoreFood";
import { AXIS_KEYS } from "../scoring/types";
import { axisValue } from "../components/MatrixTable";

const cards = scoreCatalog(FOODS);

export function ComparePage() {
  const { t, locale } = useLocale();
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
      <h1>{t.compare.title}</h1>
      <p className="lede">{t.compare.lede}</p>
      <div className="toolbar">
        {ids.map((id, index) => (
          <label key={index}>
            {t.compare.slot(index + 1)}
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
                  {foodName(food, locale)} ({t.classes[food.class]})
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
              <Link to={`/food/${food.id}`}>{foodName(food, locale)}</Link>
            </h2>
            <p className="muted">{t.compare.classTier(t.classes[food.class], card.tier)}</p>
            <p>
              {t.compare.eaaLine({
                aas: card.eaa.aas,
                diaas: card.eaa.diaas,
                limiting: card.eaa.limitingAa.toUpperCase(),
              })}
            </p>
            <p>
              {t.compare.compoundLine({
                creatineMg: food.animalCompounds.creatineMg,
                fibreG: food.carbs.fibre,
                b12Ug: card.micro.effectiveB12Ug,
              })}
            </p>
          </article>
        ))}
      </div>
      <section className="panel">
        <h2>{t.compare.radarHeading}</h2>
        <AxisRadar
          title={t.compare.radarTitle}
          entries={selected.map(({ food, card }, index) => ({
            id: `${index}-${food.id}`,
            label: foodName(food, locale),
            card,
          }))}
        />
      </section>
      <div className="matrix-wrap" style={{ marginTop: "1rem" }}>
        <table className="matrix">
          <thead>
            <tr>
              <th className="sticky">{t.table.axis}</th>
              {selected.map(({ food }) => (
                <th key={food.id}>{foodName(food, locale)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AXIS_KEYS.map((axis) => (
              <tr key={axis}>
                <td className="sticky">{t.axes[axis]}</td>
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
