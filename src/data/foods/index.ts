import { FOOD_CATEGORIES, type Food, type FoodCategory } from "@/lib/types";
import { ANIMAL_FOODS } from "./animal";
import { PLANT_FOODS } from "./plant";

export const FOODS: readonly Food[] = [...PLANT_FOODS, ...ANIMAL_FOODS];

const FOOD_BY_ID = new Map(FOODS.map((food) => [food.id, food]));

export function getFood(id: string): Food | undefined {
  return FOOD_BY_ID.get(id);
}

export function foodsByCategory(category: FoodCategory): readonly Food[] {
  return FOODS.filter((food) => food.category === category);
}

export function assertAllCategoriesSeeded(): FoodCategory[] {
  const missing = FOOD_CATEGORIES.filter((category) => foodsByCategory(category).length === 0);
  if (missing.length > 0) {
    throw new Error(`Unseeded categories: ${missing.join(", ")}`);
  }
  return [...FOOD_CATEGORIES];
}
