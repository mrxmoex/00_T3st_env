/**
 * How much of a nutrient the body can take up, and which nutrients it stores.
 * Availability, not the label amount, is what the micronutrient axis counts.
 */

import type { LocalizedText } from "../i18n/locale";
import type { FoodClass, FoodRecord, MicroNutrient } from "../scoring/types";

export const WEAVER_1999 = {
  citation:
    "Weaver CM, Proulx WR, Heaney R (1999). Choices for achieving adequate dietary calcium with a vegetarian diet. Am J Clin Nutr 70(3 Suppl):543S–548S, Table 2",
  doi: "10.1093/ajcn/70.3.543s",
} as const;

/** Fractional calcium absorption measured in humans, adjusted to the same calcium load. */
const CALCIUM_STUDIES = {
  milk: { fraction: 0.321, food: { en: "milk, yogurt, cheddar", de: "Milch, Joghurt, Cheddar" } },
  spinach: { fraction: 0.051, food: { en: "spinach (oxalate-bound)", de: "Spinat (oxalatgebunden)" } },
  kale: { fraction: 0.493, food: { en: "kale", de: "Grünkohl" } },
  broccoli: { fraction: 0.613, food: { en: "broccoli", de: "Brokkoli" } },
  lowOxalateBrassica: {
    fraction: 0.548,
    food: { en: "mean of kale, broccoli, bok choy (low-oxalate brassicas)", de: "Mittel aus Grünkohl, Brokkoli, Pak Choi (oxalatarme Kohlarten)" },
  },
  redBeans: { fraction: 0.244, food: { en: "red beans (phytate)", de: "rote Bohnen (Phytat)" } },
  beans: { fraction: 0.243, food: { en: "mean of pinto, red, white beans (phytate)", de: "Mittel aus Pinto-, roten und weißen Bohnen (Phytat)" } },
  tofu: { fraction: 0.31, food: { en: "calcium-set tofu", de: "mit Calcium gefällter Tofu" } },
  sweetPotato: { fraction: 0.222, food: { en: "sweet potato", de: "Süßkartoffel" } },
} as const satisfies Record<string, { fraction: number; food: LocalizedText }>;
type CalciumStudy = keyof typeof CALCIUM_STUDIES;

interface CalciumAssignment {
  study: CalciumStudy;
  /** True when the study measured a related food, not this one. */
  carriedOver: boolean;
}

const CALCIUM_BY_GROUP: Readonly<Record<string, CalciumAssignment>> = {
  spinach: { study: "spinach", carriedOver: false },
  chard: { study: "spinach", carriedOver: true },
  kale: { study: "kale", carriedOver: false },
  broccoli: { study: "broccoli", carriedOver: false },
  white_cabbage: { study: "lowOxalateBrassica", carriedOver: true },
  cauliflower: { study: "lowOxalateBrassica", carriedOver: true },
  brussels_sprouts: { study: "lowOxalateBrassica", carriedOver: true },
  chinese_cabbage: { study: "lowOxalateBrassica", carriedOver: true },
  rocket: { study: "lowOxalateBrassica", carriedOver: true },
  sauerkraut: { study: "lowOxalateBrassica", carriedOver: true },
  kimchi: { study: "lowOxalateBrassica", carriedOver: true },
  kidney_beans: { study: "redBeans", carriedOver: false },
  black_beans: { study: "beans", carriedOver: true },
  lentils: { study: "beans", carriedOver: true },
  red_lentils: { study: "beans", carriedOver: true },
  chickpeas: { study: "beans", carriedOver: true },
  mung_beans: { study: "beans", carriedOver: true },
  tofu: { study: "tofu", carriedOver: false },
  soybeans: { study: "tofu", carriedOver: true },
  sweet_potato: { study: "sweetPotato", carriedOver: false },
};

/** Dairy calcium is absorbed like milk calcium (Weaver et al. 1999, citing dairy studies). */
const DAIRY_CLASSES: readonly FoodClass[] = ["dairy", "fermented_animal"];
const DAIRY_GROUPS_MEASURED: ReadonlySet<string> = new Set(["milk", "yogurt", "cheddar"]);

/** Groups the calcium table names; the test suite checks them against the catalog. */
export const CALCIUM_TABLE_GROUPS: readonly string[] = Object.keys(CALCIUM_BY_GROUP);

export interface CalciumStudyRow {
  studiedFood: LocalizedText;
  fraction: number;
  classes: readonly FoodClass[];
  groups: readonly { group: string; carriedOver: boolean }[];
}

export function calciumStudyRows(): CalciumStudyRow[] {
  return (Object.keys(CALCIUM_STUDIES) as CalciumStudy[]).map((study) => ({
    studiedFood: CALCIUM_STUDIES[study].food,
    fraction: CALCIUM_STUDIES[study].fraction,
    classes: study === "milk" ? DAIRY_CLASSES : [],
    groups: Object.entries(CALCIUM_BY_GROUP)
      .filter(([, assignment]) => assignment.study === study)
      .map(([group, assignment]) => ({ group, carriedOver: assignment.carriedOver })),
  }));
}

export interface CalciumAbsorption {
  fraction: number;
  studiedFood: LocalizedText;
  carriedOver: boolean;
}

/** Null when no human absorption study covers this food or a close relative. */
export function calciumAbsorption(food: FoodRecord): CalciumAbsorption | null {
  const assignment: CalciumAssignment | undefined = DAIRY_CLASSES.includes(food.class)
    ? { study: "milk", carriedOver: !DAIRY_GROUPS_MEASURED.has(food.group) }
    : CALCIUM_BY_GROUP[food.group];
  if (!assignment) return null;
  const study = CALCIUM_STUDIES[assignment.study];
  return { fraction: study.fraction, studiedFood: study.food, carriedOver: assignment.carriedOver };
}

/**
 * How long the body holds a nutrient. Long stores buffer weeks without intake, and
 * also let excess build up; nutrients without a store have to come in regularly.
 */
export type BodyStore = "years" | "months" | "weeks" | "none";

export const BODY_STORAGE: Readonly<Record<MicroNutrient, { store: BodyStore; site: LocalizedText }>> = {
  vitaminA: { store: "years", site: { en: "liver", de: "Leber" } },
  vitaminB12: { store: "years", site: { en: "liver", de: "Leber" } },
  iron: { store: "years", site: { en: "liver, spleen, marrow; no regulated excretion", de: "Leber, Milz, Knochenmark; keine geregelte Ausscheidung" } },
  vitaminD: { store: "months", site: { en: "fat tissue, liver", de: "Fettgewebe, Leber" } },
  vitaminE: { store: "months", site: { en: "fat tissue", de: "Fettgewebe" } },
  folate: { store: "months", site: { en: "liver", de: "Leber" } },
  iodine: { store: "months", site: { en: "thyroid", de: "Schilddrüse" } },
  copper: { store: "months", site: { en: "liver", de: "Leber" } },
  selenium: { store: "months", site: { en: "muscle proteins", de: "Muskelproteine" } },
  calcium: { store: "years", site: { en: "skeleton, drawn on at the bone's expense", de: "Skelett, wird auf Kosten der Knochen abgebaut" } },
  magnesium: { store: "months", site: { en: "bone, partly mobilised", de: "Knochen, teilweise mobilisierbar" } },
  vitaminB6: { store: "weeks", site: { en: "muscle", de: "Muskel" } },
  vitaminC: { store: "weeks", site: { en: "small body pool", de: "kleiner Körpervorrat" } },
  thiamin: { store: "weeks", site: { en: "small body pool, depleted in 2–3 weeks", de: "kleiner Vorrat, nach 2–3 Wochen erschöpft" } },
  vitaminK: { store: "none", site: { en: "liver, turned over within days", de: "Leber, Umsatz innerhalb von Tagen" } },
  riboflavin: { store: "none", site: { en: "no relevant store", de: "kein nennenswerter Speicher" } },
  niacin: { store: "none", site: { en: "no relevant store", de: "kein nennenswerter Speicher" } },
  choline: { store: "none", site: { en: "no relevant store", de: "kein nennenswerter Speicher" } },
  zinc: { store: "none", site: { en: "no dedicated store", de: "kein eigener Speicher" } },
  potassium: { store: "none", site: { en: "no store; kidneys adjust excretion", de: "kein Speicher; die Niere regelt die Ausscheidung" } },
};
