import { bioactiveMg, bioactiveValue } from "../data/bioactives";
import type { Messages } from "../i18n/messages";
import type { Locale } from "../i18n/locale";
import type { FoodRecord, ScoreCard } from "../scoring/types";
import { formatAmount } from "./format";

export interface FoodHonor {
  key: string;
  text: string;
  stamp?: "fibre";
}

const FIBRE_STAMP_G = 3;

/** Highlights worth naming on cards — positives only, no zero padding. */
export function foodHonors(food: FoodRecord, card: ScoreCard, t: Messages, _locale: Locale): FoodHonor[] {
  const honors: FoodHonor[] = [];

  const creatine = bioactiveMg(food, "creatine");
  if (creatine !== null && creatine > 0) {
    honors.push({ key: "creatine", text: t.compare.honors.creatine(formatAmount(creatine)) });
  }

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

  const taurine = bioactiveValue(food, "taurine");
  if (taurine.status === "value" && taurine.mgPer100g >= 20) {
    honors.push({ key: "taurine", text: t.compare.honors.taurine(formatAmount(taurine.mgPer100g)) });
  }

  const gluco = bioactiveValue(food, "glucosinolates");
  if (gluco.status === "value" && gluco.mgPer100g >= 10) {
    honors.push({ key: "glucosinolates", text: t.compare.honors.glucosinolates(formatAmount(gluco.mgPer100g)) });
  }

  return honors;
}
