import { ANIMAL_FOODS } from "./foods/animal";
import { PLANT_FOODS } from "./foods/plant";
import { DATASET_VERSION, LAST_VERIFIED } from "./coefficients";
import { PREPARATIONS, type FoodClass, type FoodRecord } from "../scoring/types";

export const FOODS: FoodRecord[] = [...PLANT_FOODS, ...ANIMAL_FOODS];

export const DATA_META = {
  version: DATASET_VERSION,
  lastVerified: LAST_VERIFIED,
  foodCount: FOODS.length,
  updatePath:
    "Map a food to its BLS/FDC entry in src/data/sources/manifest.json, run scripts/data/build_snapshot.py, add its curated spec in src/data/foods/*.ts, bump DATASET_VERSION and LAST_VERIFIED, re-run tests.",
} as const;

export function foodById(id: string): FoodRecord | undefined {
  return FOODS.find((food) => food.id === id);
}

export function foodsByClass(foodClass: FoodClass): FoodRecord[] {
  return FOODS.filter((food) => food.class === foodClass);
}

/** All preparations of the same food, raw first, in the order of PREPARATIONS. */
export function foodsInGroup(group: string): FoodRecord[] {
  return FOODS.filter((food) => food.group === group).sort(
    (a, b) => PREPARATIONS.indexOf(a.preparation) - PREPARATIONS.indexOf(b.preparation),
  );
}

export function requireFood(id: string): FoodRecord {
  const food = foodById(id);
  if (!food) {
    throw new Error(`Unknown food id: ${id}`);
  }
  return food;
}
