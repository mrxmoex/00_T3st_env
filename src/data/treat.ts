import type { FoodRecord } from "../scoring/types";
import { PROCESSING_EVIDENCE } from "./processing";

/**
 * A home-cooked meal can use many whole foods and stay unprocessed.
 * An industrial product whose ingredient list runs past three entries is a formulation:
 * good ingredients do not need a longer list. Such products, and every ultra-processed
 * product, are a treat. Eaten daily they stop being food and become the liverwurst
 * the dog gets every day.
 */
export const INGREDIENT_LIMIT = 3;

export function ingredientListExceedsLimit(food: FoodRecord): boolean {
  const category = food.processing.evidence;
  if (!category) return false;
  const stats = PROCESSING_EVIDENCE.categories[category].all;
  if (stats.ingredientsKnown === 0 || stats.ingredientsMedian === null) return false;
  return stats.ingredientsMedian > INGREDIENT_LIMIT;
}

/** Home cooking is never a treat. A formulation is. */
export function isTreat(food: FoodRecord): boolean {
  if (food.processing.nova === 1) return false;
  return food.processing.nova === 4 || ingredientListExceedsLimit(food);
}
