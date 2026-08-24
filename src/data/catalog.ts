import { ANIMAL_CLASSES, PLANT_CLASSES } from "./labels";
import type { Food, FoodClass } from "./types";
import { ANIMAL_FOODS } from "./foods/animals";
import { PLANT_FOODS } from "./foods/plants";

export const FOODS: Food[] = [...PLANT_FOODS, ...ANIMAL_FOODS];

export function foodById(id: string): Food | undefined {
  return FOODS.find((food) => food.id === id);
}

export function foodsInClass(foodClass: FoodClass): Food[] {
  return FOODS.filter((food) => food.foodClass === foodClass);
}

export function assertCatalogCoverage(): void {
  const missing: FoodClass[] = [];
  for (const foodClass of [...PLANT_CLASSES, ...ANIMAL_CLASSES]) {
    const count = foodsInClass(foodClass).length;
    if (count < 2) missing.push(foodClass);
  }
  if (missing.length > 0) {
    throw new Error(`Catalog missing coverage for: ${missing.join(", ")}`);
  }
}
