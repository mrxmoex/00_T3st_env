import { ANIMAL_FOODS } from "@/data/foods/animal";
import { PLANT_FOODS } from "@/data/foods/plant";
import { ALL_CATEGORY_IDS } from "@/lib/ontology";
import { assertNoVegetableAverage } from "@/lib/scoring";
import type { CategoryId, SeedFood } from "@/types/catalog";

export const SEED_FOODS: SeedFood[] = [...PLANT_FOODS, ...ANIMAL_FOODS];

assertNoVegetableAverage(SEED_FOODS);

const missing = ALL_CATEGORY_IDS.filter(
  (id: CategoryId) => !SEED_FOODS.some((food) => food.category === id),
);
if (missing.length > 0) {
  throw new Error(`Seed is missing categories: ${missing.join(", ")}`);
}
