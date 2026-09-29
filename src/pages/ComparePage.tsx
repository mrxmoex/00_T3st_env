import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AxisRadar } from "../components/AxisRadar";
import { formatAmount } from "../components/format";
import { HeatCell } from "../components/HeatCell";
import { axisValue } from "../components/MatrixTable";
import { BIOACTIVE_COMPOUNDS, bioactiveMg, bioactiveValue, type BioactiveValue } from "../data/bioactives";
import { FOODS, foodsByClass } from "../data/catalog";
import { DENSITY_SATURATION_PCT_DV } from "../data/coefficients";
import { BIOACTIVE_LABELS, MICRO_LABELS, NOVA_LABELS } from "../i18n/labels";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { upperLimitExceedances } from "../scoring/micros";
import { scoreCatalog } from "../scoring/scoreFood";
import { AXIS_KEYS, FOOD_CLASSES, MICRO_NUTRIENTS } from "../scoring/types";

const cards = scoreCatalog(FOODS);

function bioactiveCell(value: BioactiveValue, notDetected: string): string {
  switch (value.status) {
    case "value":
      return `${formatAmount(value.mgPer100g)}${value.rawValueForPreparedFood ? "*" : ""}`;
    case "notDetected":
      return notDetected;
    case "notExpected":
      return "∅";
    case "noData":
      return "—";
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

export function ComparePage() {
  const { t, locale, localize } = useLocale();
  const [params] = useSearchParams();
  const [ids, setIds] = useState<[string, string, string]>([
    params.get("a") ?? "egg_boiled",
    params.get("b") ?? "lentils_boiled",
    params.get("c") ?? "salmon_roasted",
  ]);

  const selected = useMemo(
    () =>
      ids
        .map((id) => {
          const food = FOODS.find((item) => item.id === id);
          const card = cards.find((item) => item.foodId === id);
          return food && card ? { food, card, excess: upperLimitExceedances(food) } : undefined;
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
              {FOOD_CLASSES.map((foodClass) => (
                <optgroup key={foodClass} label={t.classes[foodClass]}>
                  {foodsByClass(foodClass).map((food) => (
                    <option key={food.id} value={food.id}>
                      {foodName(food, locale)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className={`compare-grid n${selected.length}`}>
        {selected.map(({ food, card }, index) => (
          <article className="card" key={`${index}-${food.id}`}>
            <h2>
              <Link to={`/food/${food.id}`}>{foodName(food, locale)}</Link>
            </h2>
            <p className="muted">{t.compare.classTier(t.classes[food.class], card.tier)}</p>
            <p>
              <span className={`nova-badge nova-${food.processing.nova}`}>
                {t.compare.novaLine(food.processing.nova, localize(NOVA_LABELS[food.processing.nova]))}
              </span>
            </p>
            <p>
              {t.compare.eaaLine({
                aas: card.eaa.aas,
                diaas: card.eaa.diaas,
                limiting: card.eaa.limitingAa.toUpperCase(),
              })}
            </p>
            <p>
              {t.compare.compoundLine({
                creatineMg: bioactiveMg(food, "creatine"),
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
              {selected.map(({ food }, index) => (
                <th key={`${index}-${food.id}`}>{foodName(food, locale)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AXIS_KEYS.map((axis) => (
              <tr key={axis}>
                <td className="sticky">{t.axes[axis]}</td>
                {selected.map(({ food, card }, index) => (
                  <td key={`${index}-${food.id}`}>
                    <HeatCell score={axisValue(card, axis)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="panel">
        <h2>{t.compare.microHeading}</h2>
        <p className="muted">{t.compare.microHint}</p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th className="sticky">{t.food.columns.nutrient}</th>
                {selected.map(({ food }, index) => (
                  <th key={`${index}-${food.id}`}>{foodName(food, locale)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MICRO_NUTRIENTS.map((nutrient) => (
                <tr key={nutrient}>
                  <td className="sticky">{localize(MICRO_LABELS[nutrient])}</td>
                  {selected.map(({ food, card, excess }, index) => {
                    const pct = card.micro.nutrients[nutrient].pctDvPer100kcal;
                    return (
                      <td key={`${index}-${food.id}`}>
                        <HeatCell
                          score={pct === null ? null : Math.min(100, (pct / DENSITY_SATURATION_PCT_DV) * 100)}
                          label={pct === null ? undefined : `${formatAmount(pct)} %`}
                          warning={excess.includes(nutrient)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel">
        <h2>{t.compare.bioactivesHeading}</h2>
        <p className="muted">{t.compare.bioactivesHint}</p>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th className="sticky">{t.food.bioactiveColumns.compound}</th>
                {selected.map(({ food }, index) => (
                  <th key={`${index}-${food.id}`}>{foodName(food, locale)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BIOACTIVE_COMPOUNDS.map((compound) => (
                <tr key={compound}>
                  <td className="sticky">{localize(BIOACTIVE_LABELS[compound])}</td>
                  {selected.map(({ food }, index) => (
                    <td key={`${index}-${food.id}`} className="mono">
                      {bioactiveCell(bioactiveValue(food, compound), t.compare.notDetectedShort)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
