import { bioactiveValue, type BioactiveCompound } from "../data/bioactives";
import type { Messages } from "../i18n/messages";
import type { Locale } from "../i18n/locale";
import type { FoodRecord, ScoreCard } from "../scoring/types";
import { formatAmount } from "./format";

export interface FoodHonor {
  key: string;
  text: string;
  stamp?: "fibre";
  /** Explains a marker in `text`, such as `*` for a raw-tissue value shown for a prepared food. */
  note?: string;
}

const FIBRE_STAMP_G = 3;

function compoundHonor(
  food: FoodRecord,
  compound: BioactiveCompound,
  minMg: number,
  label: (mg: string) => string,
  t: Messages,
): FoodHonor[] {
  const value = bioactiveValue(food, compound);
  if (value.status !== "value" || value.mgPer100g <= 0 || value.mgPer100g < minMg) return [];
  if (!value.rawValueForPreparedFood) {
    return [{ key: compound, text: label(formatAmount(value.mgPer100g)) }];
  }
  return [{ key: compound, text: `${label(formatAmount(value.mgPer100g))}*`, note: t.food.bioactiveRawValue }];
}

/** Highlights worth naming on cards — positives only, no zero padding. */
export function foodHonors(food: FoodRecord, card: ScoreCard, t: Messages, _locale: Locale): FoodHonor[] {
  const honors: FoodHonor[] = [];

  honors.push(...compoundHonor(food, "creatine", 0, t.compare.honors.creatine, t));

  const fibreG = food.carbs.fibre;
  if (fibreG >= FIBRE_STAMP_G) {
    honors.push({
      key: "fibre",
      text: t.compare.honors.fibre(formatAmount(fibreG)),
      stamp: "fibre",
    });
  } else if (fibreG >= 1.5 && card.fibre.score >= 55) {
    honors.push({ key: "fibre", text: t.compare.honors.fibre(formatAmount(fibreG)), stamp: "fibre" });
  }

  const b12 = card.micro.effectiveB12Ug;
  if (b12 !== null && b12 >= 0.3) {
    honors.push({ key: "b12", text: t.compare.honors.b12(formatAmount(b12)) });
  }

  honors.push(...compoundHonor(food, "taurine", 20, t.compare.honors.taurine, t));
  honors.push(...compoundHonor(food, "glucosinolates", 10, t.compare.honors.glucosinolates, t));

  return honors;
}
