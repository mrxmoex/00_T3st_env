import { Link } from "react-router-dom";
import { BODY_STORAGE } from "../data/absorption";
import { DENSITY_SATURATION_PCT_DV, HEME_SHARE_OF_MIXED_IRON } from "../data/coefficients";
import { BODY_STORE_LABELS, IRON_FORM_LABELS, MICRO_LABELS } from "../i18n/labels";
import { useLocale } from "../i18n/LocaleContext";
import { needFacts } from "../scoring/needFacts";
import type { FoodRecord, IronForm, ScoreCard } from "../scoring/types";
import { HeatCell } from "./HeatCell";

function ironTitle(form: IronForm, hemeSharePct: number, mixed: (pct: number) => string): string | undefined {
  switch (form) {
    case "mixed":
      return mixed(hemeSharePct);
    case "heme":
    case "nonheme":
      return undefined;
    default: {
      const _exhaustive: never = form;
      return _exhaustive;
    }
  }
}

/** One food's need and storage, as a list. Compare keeps the same facts in its table. */
export function NeedFactsList({ food, card }: { food: FoodRecord; card: ScoreCard }) {
  const { t, localize } = useLocale();
  const facts = needFacts(food, card);
  const coveredNames = facts.covered.map((nutrient) => localize(MICRO_LABELS[nutrient])).join(", ");
  const storeTitle = facts.stored
    .map((nutrient) => `${localize(MICRO_LABELS[nutrient])}: ${localize(BODY_STORAGE[nutrient].site)}`)
    .join("; ");
  const form = food.micros.ironForm;

  return (
    <section className="panel">
      <h2>{t.compare.axisGroups.necessityImpact}</h2>
      <p className="muted">{t.compare.dvCoverageHint(DENSITY_SATURATION_PCT_DV)}</p>
      <dl className="need-facts">
        <div>
          <dt>
            <Link to="/method#micros">{t.compare.dvCoverageLabel}</Link>
          </dt>
          <dd>
            <HeatCell
              score={facts.reported === 0 ? null : (facts.covered.length / facts.reported) * 100}
              label={facts.reported === 0 ? undefined : `${facts.covered.length}/${facts.reported}`}
              title={coveredNames || undefined}
            />
          </dd>
        </div>
        <div>
          <dt>
            <Link to="/method#storage">{t.compare.storeLabel}</Link>
          </dt>
          <dd>
            {facts.stored.length === 0 ? (
              <span className="heat heat-missing">—</span>
            ) : (
              <span className="compare-note" title={storeTitle}>
                {facts.stored.map((nutrient) => (
                  <span key={nutrient}>
                    {localize(MICRO_LABELS[nutrient])} · {localize(BODY_STORE_LABELS[BODY_STORAGE[nutrient].store])}
                  </span>
                ))}
              </span>
            )}
            <span className="muted">{t.compare.storeHint}</span>
          </dd>
        </div>
        <div>
          <dt>
            <Link to="/method#micros">{t.compare.ironLabel}</Link>
          </dt>
          <dd title={ironTitle(form, Math.round(HEME_SHARE_OF_MIXED_IRON * 100), t.compare.ironMixedTitle)}>
            {localize(IRON_FORM_LABELS[form])}
          </dd>
        </div>
        <div>
          <dt>
            <Link to="/method#micros">{t.compare.upperLimitLabel}</Link>
          </dt>
          <dd>
            {facts.upperLimits.length === 0 ? (
              <span className="heat heat-missing">—</span>
            ) : (
              <span className="heat heat-warning" title={t.compare.microWarningTitle}>
                ⚠ {facts.upperLimits.map((nutrient) => localize(MICRO_LABELS[nutrient])).join(", ")}
              </span>
            )}
            <span className="muted">{t.compare.upperLimitHint}</span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
