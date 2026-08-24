import { FOODS } from "@/data/foods";
import { evaluateCatalog } from "./scoring";
import type { EvaluatedFood, FoodCategory } from "./types";
import { isAnimalCategory, isPlantCategory } from "./ontology";

export const CATALOG: readonly EvaluatedFood[] = evaluateCatalog(FOODS);

export type CategoryFilter = FoodCategory | "all" | "plant" | "animal";

export function filterCatalog(
  rows: readonly EvaluatedFood[],
  filter: CategoryFilter,
): EvaluatedFood[] {
  switch (filter) {
    case "all":
      return [...rows];
    case "plant":
      return rows.filter((row) => isPlantCategory(row.food.category));
    case "animal":
      return rows.filter((row) => isAnimalCategory(row.food.category));
    default:
      return rows.filter((row) => row.food.category === filter);
  }
}
