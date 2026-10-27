import type { FoodRecord } from "./types";
import { clamp01 } from "./math";

/** Grams per 100 g at which a spoke is drawn full. Sugar is scaled tighter because whole foods carry less of it than protein or fat. */
export const GENERAL_NUTRIENT_FULL_G = {
  protein: 25,
  fat: 20,
  sugar: 10,
} as const;

/** EU food-labelling conversion. */
export const KJ_PER_KCAL = 4.184;

export const GENERAL_NUTRIENT_KEYS = ["protein", "fat", "sugar"] as const;
export type GeneralNutrientKey = (typeof GENERAL_NUTRIENT_KEYS)[number];

export function energyKj(kcal: number): number {
  return Math.round(kcal * KJ_PER_KCAL);
}

export function generalNutrientGrams(food: FoodRecord): Record<GeneralNutrientKey, number> {
  return {
    protein: food.proteinG,
    fat: food.fatG,
    sugar: food.carbs.sugars,
  };
}

/** 0–100 spoke lengths for the general-nutrient radar. Display only; not a score axis. */
export function generalNutrientScores(food: FoodRecord): Record<GeneralNutrientKey, number> {
  const grams = generalNutrientGrams(food);
  return {
    protein: spoke(grams.protein, GENERAL_NUTRIENT_FULL_G.protein),
    fat: spoke(grams.fat, GENERAL_NUTRIENT_FULL_G.fat),
    sugar: spoke(grams.sugar, GENERAL_NUTRIENT_FULL_G.sugar),
  };
}

function spoke(grams: number, fullGrams: number): number {
  return 100 * clamp01(grams / fullGrams);
}
