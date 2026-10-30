import { Fragment, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CARB_PIE_FULL_G, CarbTypePie } from "../components/CarbTypePie";
import { CompareAxisRadar } from "../components/CompareAxisRadar";
import { CompareBioactivesPanel } from "../components/CompareBioactivesPanel";
import { NovaMarker } from "../components/NovaMarker";
import { formatAmount } from "../components/format";
import { HeatCell } from "../components/HeatCell";
import { axisValue } from "../components/MatrixTable";
import { NutrientRadar } from "../components/NutrientRadar";
import { FOODS, foodsByClass } from "../data/catalog";
import { DENSITY_SATURATION_PCT_DV } from "../data/coefficients";
import { MICRO_LABELS, MICRO_ROW_HINTS, NOVA_LABELS } from "../i18n/labels";
import { foodName, type LocalizedText } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import type { Messages } from "../i18n/messages";
import { energyKj, generalNutrientGrams, GENERAL_NUTRIENT_KEYS } from "../scoring/generalNutrients";
import { upperLimitExceedances } from "../scoring/micros";
import { scoreCatalog } from "../scoring/scoreFood";
import {
  FOOD_CLASSES,
  MICRO_NUTRIENTS,
  type AxisKey,
  type FoodRecord,
  type MicroNutrient,
  type ScoreCard,
} from "../scoring/types";
import {
  COMPARE_GROUP_ORDER,
  DIGESTIBILITY_AXES,
  IMPORTANCE_AXES,
  KIND_AXES,
  SOURCING_AXES,
  type CompareGroup,
} from "./compareAxisGroups";
import { FoodHonorsList } from "../components/FoodHonorsList";

type ComparedFood = { food: FoodRecord; card: ScoreCard };

const cards = scoreCatalog(FOODS);

function GroupLabel({ label, span, link }: { label: string; span: number; link?: ReactNode }) {
  return (
    <tr className="group-row">
      <th scope="colgroup" colSpan={span}>
        <span className="group-label">
          {label}
          {link}
        </span>
      </th>
    </tr>
  );
}

function axisLabelCell(axis: AxisKey, t: Messages): ReactNode {
  if (axis === "carb") {
    return (
      <>
        {t.compare.carbRowLabel}
        <CarbTypeKey t={t} />
      </>
    );
  }
  if (axis === "degradation") {
    return (
      <>
        {t.axes.degradation}
        <span className="axis-row-sub">{t.compare.degradationRowHint}</span>
      </>
    );
  }
  return t.axes[axis];
}

function microLabelCell(nutrient: MicroNutrient, localize: (text: LocalizedText) => string): ReactNode {
  return (
    <>
      {localize(MICRO_LABELS[nutrient])}
      <span className="axis-row-sub">{localize(MICRO_ROW_HINTS[nutrient])}</span>
    </>
  );
}

function CarbTypeKey({ t }: { t: Messages }) {
  return (
    <ul className="carb-type-key" aria-label={t.compare.carbLegendHeading}>
      <li>
        <span className="carb-key-swatch carb-seg-sugar" aria-hidden="true" />
        {t.compare.carbLegend.sugar}
      </li>
      <li>
        <span className="carb-key-swatch carb-seg-starch" aria-hidden="true" />
        {t.compare.carbLegend.starch}
      </li>
      <li>
        <span className="carb-key-swatch carb-seg-passive" aria-hidden="true" />
        {t.compare.carbLegend.passive}
      </li>
      <li>
        <span className="carb-key-none mono" aria-hidden="true">
          {t.compare.carbPie.noneSymbol}
        </span>
        {t.compare.carbLegend.none}
      </li>
      <li>{t.compare.carbLegend.size(CARB_PIE_FULL_G)}</li>
    </ul>
  );
}

function scoreRows(axes: readonly AxisKey[], selected: readonly ComparedFood[], t: Messages): ReactNode[] {
  return axes.map((axis) => (
    <tr key={axis}>
      <td className="sticky">{axisLabelCell(axis, t)}</td>
      {selected.map(({ food, card }, index) => (
        <td key={`${index}-${food.id}`}>
          {axis === "carb" ? (
            <span className="carb-cell">
              <CarbTypePie food={food} carb={card.carb} />
              <HeatCell
                score={axisValue(card, axis)}
                title={card.carb.activeG + card.carb.passiveG < 0.5 ? t.compare.carbQuietScore : undefined}
              />
            </span>
          ) : (
            <HeatCell score={axisValue(card, axis)} />
          )}
        </td>
      ))}
    </tr>
  ));
}

function axisGroup(
  group: CompareGroup,
  selected: readonly ComparedFood[],
  t: Messages,
  localize: (text: LocalizedText) => string,
): ReactNode {
  const span = selected.length + 1;
  switch (group) {
    case "kind":
      return (
        <>
          <GroupLabel label={t.compare.axisGroups.kind} span={span} />
          {scoreRows(KIND_AXES, selected, t)}
        </>
      );
    case "general":
      return (
        <>
          <GroupLabel label={t.compare.axisGroups.general} span={span} />
          {GENERAL_NUTRIENT_KEYS.map((key) => (
            <tr key={key}>
              <td className="sticky">{t.compare.nutrientRows[key]}</td>
              {selected.map(({ food }, index) => (
                <td key={`${index}-${food.id}`} className="mono">
                  {formatAmount(generalNutrientGrams(food)[key])} g
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="sticky">{t.compare.nutrientRows.sugar}</td>
            {selected.map(({ food }, index) => (
              <td key={`${index}-${food.id}`} className="mono">
                {formatAmount(food.carbs.sugars)} g
              </td>
            ))}
          </tr>
          <tr>
            <td className="sticky">{t.compare.nutrientRows.kcal}</td>
            {selected.map(({ food }, index) => (
              <td key={`${index}-${food.id}`} className="mono">
                {Math.round(food.kcalPer100g)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="sticky">{t.compare.nutrientRows.kJ}</td>
            {selected.map(({ food }, index) => (
              <td key={`${index}-${food.id}`} className="mono">
                {energyKj(food.kcalPer100g)}
              </td>
            ))}
          </tr>
        </>
      );
    case "importance":
      return (
        <>
          <GroupLabel label={t.compare.axisGroups.importance} span={span} />
          {scoreRows(IMPORTANCE_AXES, selected, t)}
        </>
      );
    case "necessityImpact":
      return (
        <>
          <GroupLabel
            label={t.compare.axisGroups.necessityImpact}
            span={span}
            link={
              <Link className="group-link" to="/method">
                {t.compare.necessityImpactMethodLink}
              </Link>
            }
          />
          {scoreRows(SOURCING_AXES, selected, t)}
          <tr>
            <td className="sticky">{t.compare.nutrientRows.nova}</td>
            {selected.map(({ food }, index) => (
              <td key={`${index}-${food.id}`}>
                <NovaMarker
                  group={food.processing.nova}
                  fullLabel={t.compare.novaLine(food.processing.nova, localize(NOVA_LABELS[food.processing.nova]))}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td className="sticky">{t.compare.nutrientRows.source}</td>
            {selected.map(({ food }, index) => {
              const primary = food.sourceEntries[0];
              return (
                <td key={`${index}-${food.id}`} className="mono">
                  {primary ? `${primary.db} ${primary.code}` : "—"}
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="sticky">
              <span className="has-tip" title={t.compare.digestibilityDefinition}>
                {t.compare.nutrientRows.digestibility}
              </span>
            </td>
            {selected.map(({ food }, index) => (
              <td key={`${index}-${food.id}`}>
                <HeatCell score={food.ilealDigestibility * 100} label={formatAmount(food.ilealDigestibility)} />
              </td>
            ))}
          </tr>
          <tr>
            <td className="sticky">{t.compare.nutrientRows.diaas}</td>
            {selected.map(({ food, card }, index) => (
              <td key={`${index}-${food.id}`}>
                <HeatCell score={Math.min(100, card.eaa.diaas * 100)} label={formatAmount(card.eaa.diaas)} />
              </td>
            ))}
          </tr>
          {scoreRows(DIGESTIBILITY_AXES, selected, t)}
        </>
      );
    default: {
      const _exhaustive: never = group;
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
              <NovaMarker
                group={food.processing.nova}
                fullLabel={t.compare.novaLine(food.processing.nova, localize(NOVA_LABELS[food.processing.nova]))}
              />
            </p>
            <p>
              {t.compare.eaaLine({
                aas: card.eaa.aas,
                diaas: card.eaa.diaas,
                limiting: card.eaa.limitingAa.toUpperCase(),
              })}
            </p>
            <FoodHonorsList food={food} card={card} />
          </article>
        ))}
      </div>
      <section className="panel">
        <div className="radar-pair">
          <div>
            <h2>{t.compare.radarHeading}</h2>
            <CompareAxisRadar
              title={t.compare.radarTitle}
              showProteinReadout={false}
              entries={selected.map(({ food, card }, index) => ({
                id: `${index}-${food.id}`,
                label: foodName(food, locale),
                food,
                card,
              }))}
            />
          </div>
          <div>
            <h2>{t.compare.nutrientRadarHeading}</h2>
            <NutrientRadar
              entries={selected.map(({ food }, index) => ({
                id: `${index}-${food.id}`,
                label: foodName(food, locale),
                food,
              }))}
            />
          </div>
        </div>
        <div className="matrix-wrap" style={{ marginTop: "1rem" }}>
          <table className="matrix compare-axes">
            <thead>
              <tr>
                <th className="sticky">{t.table.axis}</th>
                {selected.map(({ food }, index) => (
                  <th key={`${index}-${food.id}`}>{foodName(food, locale)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_GROUP_ORDER.map((group) => (
                <Fragment key={group}>{axisGroup(group, selected, t, localize)}</Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel">
        <h2>{t.compare.microHeading}</h2>
        <p className="muted">
          {t.compare.microHint}
          {selected.some(({ excess }) => excess.length > 0) ? ` ${t.compare.microWarningKey}` : null}
        </p>
        <div className="matrix-wrap">
          <table className="matrix compare-micro">
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
                  <td className="sticky">{microLabelCell(nutrient, localize)}</td>
                  {selected.map(({ food, card, excess }, index) => {
                    const pct = card.micro.nutrients[nutrient].pctDvPer100kcal;
                    const pctLabel =
                      pct === null
                        ? undefined
                        : `${pct >= 10 ? Math.round(pct) : formatAmount(pct)}%`;
                    return (
                      <td key={`${index}-${food.id}`}>
                        <HeatCell
                          score={pct === null ? null : Math.min(100, (pct / DENSITY_SATURATION_PCT_DV) * 100)}
                          label={pctLabel}
                          warning={excess.includes(nutrient)}
                          title={excess.includes(nutrient) ? t.compare.microWarningTitle : undefined}
                          className="heat-percent"
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
        <CompareBioactivesPanel foods={selected.map(({ food }) => food)} />
      </section>
    </main>
  );
}
