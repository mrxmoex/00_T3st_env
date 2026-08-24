import { FOODS } from "../data/catalog";
import { MANIFEST } from "../data/manifest";
import type { Food, FoodScores } from "../data/types";
import { scoreCatalog } from "../scoring";

export const SCORED_FOODS: FoodScores[] = scoreCatalog(FOODS);

export const SCORE_BY_ID = new Map(SCORED_FOODS.map((row) => [row.foodId, row]));

export function requireFood(id: string): Food {
  const food = FOODS.find((item) => item.id === id);
  if (!food) throw new Error(`Unknown food ${id}`);
  return food;
}

export function requireScore(id: string): FoodScores {
  const score = SCORE_BY_ID.get(id);
  if (!score) throw new Error(`Missing score ${id}`);
  return score;
}

export { FOODS, MANIFEST };
