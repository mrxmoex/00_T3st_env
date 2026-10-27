import { activeCarbsG } from "./carbs";
import type { FoodRecord } from "./types";

const KCAL_PER_G = { protein: 4, fat: 9, carb: 4 } as const;

export interface MacroEnergyShares {
  protein: number;
  fat: number;
  carb: number;
}

/**
 * Split of the energy from protein, fat, and available carbohydrate (4 / 9 / 4 kcal per g), relative to
 * their sum; fibre energy is not counted. A share does not depend on the serving basis. Display only.
 */
export function macroEnergyShares(food: FoodRecord): MacroEnergyShares {
  const protein = food.proteinG * KCAL_PER_G.protein;
  const fat = food.fatG * KCAL_PER_G.fat;
  const carb = activeCarbsG(food) * KCAL_PER_G.carb;
  const total = protein + fat + carb;
  if (total <= 0) {
    return { protein: 0, fat: 0, carb: 0 };
  }
  return {
    protein: (protein / total) * 100,
    fat: (fat / total) * 100,
    carb: (carb / total) * 100,
  };
}
