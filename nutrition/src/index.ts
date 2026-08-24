import { SAMPLE_FOODS } from "./data/sample-foods.js";
import { scoreAllFoods, scoreFood } from "./scoring/engine.js";
import {
  DATASET_VERSION,
  LAST_VERIFICATION_DATE,
  COEFFICIENT_VERSION,
} from "./data/version.js";

export {
  SAMPLE_FOODS,
  getFoodById,
} from "./data/sample-foods.js";
export { scoreFood, scoreAllFoods, applyDietaryFlags } from "./scoring/engine.js";
export { getDivisionWeights } from "./data/division-weights.js";
export * from "./types.js";
export {
  DATASET_VERSION,
  LAST_VERIFICATION_DATE,
  COEFFICIENT_VERSION,
} from "./data/version.js";

export function getNutritionMeta() {
  return {
    title: "Du bist was du isst",
    datasetVersion: DATASET_VERSION,
    coefficientVersion: COEFFICIENT_VERSION,
    lastVerificationDate: LAST_VERIFICATION_DATE,
    foodCount: SAMPLE_FOODS.length,
  };
}

export function getAllScored(pattern: "omnivore" | "vegan" | "low_residue" = "omnivore") {
  return scoreAllFoods(SAMPLE_FOODS, pattern);
}
