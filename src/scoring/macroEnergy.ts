import { activeCarbsG } from "./carbs";
import type { FoodRecord } from "./types";

export const KCAL_PER_G = { protein: 4, fat: 9, carb: 4 } as const;

export interface MacroEnergyShares {
  protein: number;
  fat: number;
  carb: number;
  /** Fibre energy and the rest the database counts (organic acids, alcohol, rounding). */
  other: number;
}

/**
 * Energy the shares are taken from: the database value, or the 4 / 9 / 4 sum of protein, fat, and
 * available carbohydrate where that sum is larger (USDA uses food-specific factors), so no share passes 100 %.
 */
export function energyDenominatorKcal(food: FoodRecord): number {
  const macro = food.proteinG * KCAL_PER_G.protein + food.fatG * KCAL_PER_G.fat + activeCarbsG(food) * KCAL_PER_G.carb;
  return Math.max(food.kcalPer100g, macro);
}

/** Share of the food's energy by source; the four parts sum to 100 %. A share does not depend on the serving basis. Display only. */
export function macroEnergyShares(food: FoodRecord): MacroEnergyShares {
  const protein = food.proteinG * KCAL_PER_G.protein;
  const fat = food.fatG * KCAL_PER_G.fat;
  const carb = activeCarbsG(food) * KCAL_PER_G.carb;
  const total = energyDenominatorKcal(food);
  if (total <= 0) {
    return { protein: 0, fat: 0, carb: 0, other: 0 };
  }
  return {
    protein: (protein / total) * 100,
    fat: (fat / total) * 100,
    carb: (carb / total) * 100,
    other: ((total - protein - fat - carb) / total) * 100,
  };
}
