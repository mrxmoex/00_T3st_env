import { BODY_STORAGE } from "../data/absorption";
import { foodById } from "../data/catalog";
import { NUTRIENT_UNITS, type NutrientKey } from "../data/sources/snapshot";
import { BODY_STORE_LABELS, NUTRIENT_LABELS, PROVENANCE_LABELS } from "../i18n/labels";
import { foodName } from "../i18n/locale";
import { useLocale } from "../i18n/LocaleContext";
import type { Messages } from "../i18n/messages";
import type { FoodRecord, MicroNutrient, ScoreCard } from "../scoring/types";
import { formatAmount } from "./format";

const MICRO_FOR_KEY: Partial<Record<NutrientKey, MicroNutrient>> = {
  vitaminARae: "vitaminA",
  vitaminB12: "vitaminB12",
  folate: "folate",
  vitaminC: "vitaminC",
  vitaminD: "vitaminD",
  vitaminE: "vitaminE",
  vitaminK: "vitaminK",
  thiamin: "thiamin",
  riboflavin: "riboflavin",
  niacin: "niacin",
  vitaminB6: "vitaminB6",
  choline: "choline",
  calcium: "calcium",
  magnesium: "magnesium",
  potassium: "potassium",
  iron: "iron",
  zinc: "zinc",
  copper: "copper",
  selenium: "selenium",
  iodine: "iodine",
};

/** Absorbed or bioactive amount per 100 g, in the row's unit, where the scoring estimates one. */
function availableAmount(key: NutrientKey, card: ScoreCard): number | null {
  switch (key) {
    case "iron":
      return card.micro.absorbableIronMg;
    case "zinc":
      return card.micro.absorbableZincMg;
    case "calcium":
      return card.micro.absorbableCalciumMg;
    case "vitaminARae":
      return card.micro.raeUg;
    case "vitaminB12":
      return card.micro.effectiveB12Ug;
    default:
      return null;
  }
}

type GroupId = keyof Messages["food"]["nutrientGroups"];

const GROUPS: readonly { id: GroupId; open: boolean; keys: readonly NutrientKey[] }[] = [
  { id: "macros", open: true, keys: ["kcal", "water", "protein", "fat", "carbsAvailable", "sugars", "starch", "fibre"] },
  {
    id: "diet",
    open: true,
    keys: ["sodium", "potassium", "phosphorus", "protein", "lactose", "carbsAvailable", "cholesterol", "phe"],
  },
  {
    id: "vitamins",
    open: false,
    keys: [
      "retinol",
      "betaCarotene",
      "vitaminARae",
      "vitaminD",
      "vitaminE",
      "vitaminK",
      "thiamin",
      "riboflavin",
      "niacin",
      "vitaminB6",
      "folate",
      "vitaminB12",
      "vitaminC",
      "choline",
    ],
  },
  {
    id: "minerals",
    open: false,
    keys: ["calcium", "magnesium", "potassium", "phosphorus", "sodium", "iron", "zinc", "copper", "iodine", "selenium"],
  },
  { id: "aminoAcids", open: false, keys: ["his", "ile", "leu", "lys", "met", "cys", "phe", "tyr", "thr", "trp", "val"] },
  {
    id: "fattyAcids",
    open: false,
    keys: ["sfa", "mufa", "pufa", "la", "ala", "epa", "dpa", "dha", "aa", "c15", "c17", "cla"],
  },
];

export function NutrientTable({ food, card }: { food: FoodRecord; card: ScoreCard }) {
  const { t, locale, localize } = useLocale();
  const pattern = food.aminoAcidPattern ? foodById(food.aminoAcidPattern) : undefined;

  return (
    <section className="panel">
      <h2>{t.food.nutrientsHeading}</h2>
      <p className="muted">{t.food.nutrientsHint}</p>
      {GROUPS.map((group) => (
        <details key={group.id} className="nutrient-group" open={group.open}>
          <summary>{t.food.nutrientGroups[group.id]}</summary>
          {group.id === "diet" ? <p className="muted">{t.food.dietHint}</p> : null}
          {group.id === "aminoAcids" && pattern ? (
            <p className="muted">{t.food.patternNote(foodName(pattern, locale))}</p>
          ) : null}
          <div className="matrix-wrap">
            <table className="matrix nutrient-table">
              <thead>
                <tr>
                  <th>{t.food.columns.nutrient}</th>
                  <th>{t.food.columns.per100g}</th>
                  <th>{t.food.columns.available}</th>
                  <th>{t.food.columns.pctDv}</th>
                  <th>{t.food.columns.store}</th>
                  <th>{t.food.columns.source}</th>
                </tr>
              </thead>
              <tbody>
                {group.keys.map((key) => {
                  const value = food.nutrients[key];
                  const provenance = food.provenance[key];
                  const micro = MICRO_FOR_KEY[key];
                  const pct = micro ? card.micro.nutrients[micro].pctDvPer100kcal : null;
                  const available = value === null ? null : availableAmount(key, card);
                  const storage = micro ? BODY_STORAGE[micro] : undefined;
                  return (
                    <tr key={key}>
                      <td>{localize(NUTRIENT_LABELS[key])}</td>
                      <td className="mono">
                        {value === null ? (
                          <span className="muted">— {t.food.notReported}</span>
                        ) : (
                          `${formatAmount(value)} ${NUTRIENT_UNITS[key]}`
                        )}
                      </td>
                      <td className="mono">
                        {available === null ? "" : `${formatAmount(available)} ${NUTRIENT_UNITS[key]}`}
                      </td>
                      <td className="mono">{pct === null ? "" : `${formatAmount(pct)} %`}</td>
                      <td>
                        {storage ? (
                          <span title={localize(storage.site)}>{localize(BODY_STORE_LABELS[storage.store])}</span>
                        ) : null}
                      </td>
                      <td className="muted">
                        {provenance ? `${provenance.db} · ${localize(PROVENANCE_LABELS[provenance.category])}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </section>
  );
}
