import { ANIMAL_FOODS } from "./foods/animal";
import { PLANT_FOODS } from "./foods/plant";
import { DATASET_VERSION, LAST_VERIFIED } from "./coefficients";
import type { FoodClass, FoodRecord } from "../scoring/types";

export const FOODS: FoodRecord[] = [...PLANT_FOODS, ...ANIMAL_FOODS];

export const DATA_META = {
  version: DATASET_VERSION,
  lastVerified: LAST_VERIFIED,
  foodCount: FOODS.length,
  updatePath:
    "Replace values in src/data/foods/*.ts, bump DATASET_VERSION and LAST_VERIFIED in coefficients.ts, re-run tests.",
} as const;

export function foodById(id: string): FoodRecord | undefined {
  return FOODS.find((food) => food.id === id);
}

export function foodsByClass(foodClass: FoodClass): FoodRecord[] {
  return FOODS.filter((food) => food.class === foodClass);
}

export function requireFood(id: string): FoodRecord {
  const food = foodById(id);
  if (!food) {
    throw new Error(`Unknown food id: ${id}`);
  }
  return food;
}
