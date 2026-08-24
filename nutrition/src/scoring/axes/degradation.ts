import type { FoodRecord } from "../../types.js";
import { clamp } from "../utils.js";

export function scoreDegradation(food: FoodRecord): number {
  const { per100g, degradation } = food;
  const wsRisk =
    (per100g.vitaminCMg * 0.15 +
      per100g.folateUg * 0.002 +
      per100g.thiaminMg * 2) *
    degradation.cookingLossFactor;
  const pufa = food.per100g.fattyAcids.omega6 + food.per100g.fattyAcids.omega3;
  const fsRisk = pufa * degradation.oxidationFactor * 8;
  return clamp(100 - wsRisk - fsRisk);
}
