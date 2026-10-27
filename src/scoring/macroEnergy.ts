import { activeCarbsG } from "./carbs";
import type { FoodRecord } from "./types";

const KCAL_PER_G = { protein: 4, fat: 9, carb: 4 } as const;

export interface MacroEnergyShares {
  protein: number;
  fat: number;
  carb: number;
}

/** Share of metabolizable energy from protein, fat, and available carbohydrate. Display only. */
export function macroEnergyShares(food: FoodRecord, basis: "per100g" | "per100kcal" = "per100g"): MacroEnergyShares {
  const proteinKcal = food.proteinG * KCAL_PER_G.protein;
  const fatKcal = food.fatG * KCAL_PER_G.fat;
  const carbKcal = activeCarbsG(food) * KCAL_PER_G.carb;
  let p = proteinKcal;
  let f = fatKcal;
  let c = carbKcal;

  if (basis === "per100kcal") {
    const kcal = Math.max(food.kcalPer100g, 1);
    const scale = 100 / kcal;
    p *= scale;
    f *= scale;
    c *= scale;
  }

  const total = p + f + c;
  if (total <= 0) {
    return { protein: 0, fat: 0, carb: 0 };
  }
  return {
    protein: (p / total) * 100,
    fat: (f / total) * 100,
    carb: (c / total) * 100,
  };
}
