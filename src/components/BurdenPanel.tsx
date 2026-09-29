import { BODY_STORAGE } from "../data/absorption";
import { foodById } from "../data/catalog";
import { PROCESSING_EVIDENCE, classifiedProducts, type CategoryStats } from "../data/processing";
import type { NutrientKey } from "../data/sources/snapshot";
import { ADDITIVE_LABELS, MICRO_LABELS, NOVA_LABELS, NUTRIENT_LABELS } from "../i18n/labels";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import { isAnimalClass, MICRO_NUTRIENTS, type FoodRecord, type ScoreCard } from "../scoring/types";
import { formatAmount } from "./format";

/** %DV per 100 kcal from which a stored nutrient is named as supplied by the food. */
const STORED_SUPPLY_PCT_DV = 10;
/** Minimum classified products before a country subset is reported. */
const MIN_CLASSIFIED = 20;

export function BurdenPanel({ food, card }: { food: FoodRecord; card: ScoreCard }) {
  const { t, locale, localize } = useLocale();
  const b = t.food.burden;
  const nova = food.processing.nova;
  const evidence = food.processing.evidence ? PROCESSING_EVIDENCE.categories[food.processing.evidence] : undefined;
  const retention = food.processing.retention;
  const reference = retention ? foodById(retention.reference) : undefined;

  const evidenceLine = (where: string, stats: CategoryStats) =>
    b.evidence({
      where,
      classified: classifiedProducts(stats),
      nova4: stats.nova["4"],
      nova3: stats.nova["3"],
      retrieved: PROCESSING_EVIDENCE.retrieved,
    });

  const stored = MICRO_NUTRIENTS.filter((nutrient) => {
    const pct = card.micro.nutrients[nutrient].pctDvPer100kcal;
    const store = BODY_STORAGE[nutrient].store;
    return pct !== null && pct >= STORED_SUPPLY_PCT_DV && (store === "years" || store === "months");
  });

  return (
    <section className="panel">
      <h2>{b.heading}</h2>
      <p className="muted">{b.lede}</p>
      <div className="grid-2">
        <div>
          <h3>{b.processingHeading}</h3>
          <p>
            <span className={`nova-badge nova-${nova}`}>NOVA {nova}</span> {localize(NOVA_LABELS[nova])}
          </p>
          <p className="muted">{b.novaMeaning[nova]}</p>
          {retention && reference ? (
            <>
              <p>
                {b.retention({
                  reference: foodName(reference, locale),
                  kept: Math.round(retention.fraction * 100),
                  details: Object.entries(retention.nutrients)
                    .map(([key, ratio]) => `${localize(NUTRIENT_LABELS[key as NutrientKey])} ${Math.round(ratio * 100)} %`)
                    .join(", "),
                })}
              </p>
              <p>
                {b.sodium({
                  reference: foodName(reference, locale),
                  from: formatAmount(reference.composition.sodiumMg),
                  to: formatAmount(food.composition.sodiumMg),
                })}
              </p>
            </>
          ) : null}
          {card.processing.capped ? (
            <p className="callout-warning">
              {b.capped(card.processing.uncappedComposite.toFixed(1), card.composite.toFixed(1))}
            </p>
          ) : null}
          {evidence ? (
            <>
              {classifiedProducts(evidence.germany) >= MIN_CLASSIFIED ? (
                <p>{evidenceLine(b.evidenceGermany, evidence.germany)}</p>
              ) : null}
              <p>{evidenceLine(b.evidenceAll, evidence.all)}</p>
              <p className="muted">{b.additives(evidence.all.products)}</p>
              <ul>
                {evidence.all.additives.map((additive) => {
                  const label = ADDITIVE_LABELS[additive.code];
                  const share = Math.round((additive.products / evidence.all.products) * 100);
                  return (
                    <li key={additive.code}>
                      <span className="mono">{additive.code}</span> {label ? localize(label) : null}:{" "}
                      <span className="mono">
                        {additive.products} ({share} %)
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </div>
        <div>
          <h3>{b.residuesHeading}</h3>
          <ul>
            {[...card.residue.flags, ...card.degradation.flags].map((flag) => (
              <li key={flag.en}>{localize(flag)}</li>
            ))}
          </ul>
          {isAnimalClass(food.class) ? <p className="muted">{b.hormones}</p> : null}
          {food.residue.heavyMetalClass !== "low" ? <p className="muted">{b.accumulation}</p> : null}
          {stored.length > 0 ? (
            <>
              <h3>{b.storageHeading}</h3>
              <p>{b.storage(stored.map((nutrient) => localize(MICRO_LABELS[nutrient])).join(", "))}</p>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
