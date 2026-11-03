import { BODY_STORAGE, type BodyStore } from "../data/absorption";
import { DENSITY_SATURATION_PCT_DV } from "../data/coefficients";
import { exposureForFood, type ExposureId } from "../data/exposure";
import { upperLimitExceedances } from "../scoring/micros";
import { MICRO_NUTRIENTS, type FoodRecord, type MicroNutrient, type ScoreCard } from "../scoring/types";

/** A nutrient counts as covered at the same bar the micronutrient score uses. */
export function isCovered(card: ScoreCard, nutrient: MicroNutrient): boolean {
  const pct = card.micro.nutrients[nutrient].pctDvPer100kcal;
  return pct !== null && pct >= DENSITY_SATURATION_PCT_DV;
}

export interface NeedFacts {
  /** Reported nutrients at or above the Daily Value bar, in catalog order. */
  covered: MicroNutrient[];
  /** Nutrients a source reports, the whole for the covered count. */
  reported: number;
  /** Covered nutrients the body holds for months or years, in catalog order. */
  stored: MicroNutrient[];
  /** Nutrients whose amount in 100 kcal passes the adult whole-day upper limit. */
  upperLimits: MicroNutrient[];
  /** Class exposure notes. These are not measurements of this food. */
  exposure: ExposureId[];
}

export function needFacts(food: FoodRecord, card: ScoreCard): NeedFacts {
  const covered = MICRO_NUTRIENTS.filter((nutrient) => isCovered(card, nutrient));
  const reported = MICRO_NUTRIENTS.filter((nutrient) => card.micro.nutrients[nutrient].pctDvPer100kcal !== null).length;
  const stored = covered.filter((nutrient) => isLongStore(BODY_STORAGE[nutrient].store));
  return {
    covered,
    reported,
    stored,
    upperLimits: upperLimitExceedances(food),
    exposure: exposureForFood(food),
  };
}

function isLongStore(store: BodyStore): boolean {
  switch (store) {
    case "years":
    case "months":
      return true;
    case "weeks":
    case "none":
      return false;
    default: {
      const _exhaustive: never = store;
      return _exhaustive;
    }
  }
}
