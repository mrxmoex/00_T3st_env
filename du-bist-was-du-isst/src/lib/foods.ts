import type { FoodItem } from "@/lib/types";
import {
  assignGlobalTiers,
  finalizeFoodScores,
  rankFoodsInClass,
} from "@/lib/scoring/engine";
import { rawFoods } from "@/dataset/foods/raw";

let cachedFoods: FoodItem[] | null = null;

export function getAllFoods(): FoodItem[] {
  if (!cachedFoods) {
    const finalized = rawFoods.map((f) => finalizeFoodScores(f));
    const withClassTiers = rankFoodsInClass(finalized);
    cachedFoods = assignGlobalTiers(withClassTiers);
  }
  return cachedFoods;
}

export function getFoodById(id: string): FoodItem | undefined {
  return getAllFoods().find((f) => f.id === id);
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return getAllFoods().filter((f) => f.category === category);
}

export function getFoodsByKingdom(kingdom: "plant" | "animal"): FoodItem[] {
  return getAllFoods().filter((f) => f.kingdom === kingdom);
}
