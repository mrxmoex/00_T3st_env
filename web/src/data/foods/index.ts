import { ANIMAL_FOODS } from "@/data/foods/animal";
import { FUNGI_ALGAE_FOODS } from "@/data/foods/fungi-algae";
import { PLANT_FOODS } from "@/data/foods/plant";
import { categoryKingdom, type FoodRecord } from "@/lib/schema";

export const FOODS: readonly FoodRecord[] = [
  ...PLANT_FOODS,
  ...FUNGI_ALGAE_FOODS,
  ...ANIMAL_FOODS,
];

export function foodById(id: string): FoodRecord {
  const food = FOODS.find((item) => item.id === id);
  if (!food) {
    throw new Error(`Unknown food id: ${id}`);
  }
  return food;
}

export function assertOntologyCoverage(foods: readonly FoodRecord[]): void {
  for (const food of foods) {
    if (food.kingdom !== categoryKingdom(food.category)) {
      throw new Error(
        `Kingdom mismatch on ${food.id}: ${food.kingdom} vs ${food.category}`,
      );
    }
  }
}

assertOntologyCoverage(FOODS);
