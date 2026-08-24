import { CATEGORIES } from "@/data/categories";
import { SEED_FOODS } from "@/data/foods";
import { INVARIANTS } from "@/data/invariants";
import { SOURCES } from "@/data/sources";
import { evaluateFoods } from "@/lib/scoring";
import type { AxisId, CategoryId, EvaluatedFood } from "@/types/catalog";

const evaluated = evaluateFoods(SEED_FOODS);

export function getEvaluatedFoods(): EvaluatedFood[] {
  return evaluated;
}

export function getFood(id: string): EvaluatedFood | undefined {
  return evaluated.find((item) => item.food.id === id);
}

export function getFoodsByCategory(category: CategoryId): EvaluatedFood[] {
  return evaluated
    .filter((item) => item.food.category === category)
    .sort((a, b) => b.combined - a.combined);
}

export function getRankedByAxis(axis: AxisId): EvaluatedFood[] {
  return [...evaluated].sort((a, b) => b.scores[axis].adjusted - a.scores[axis].adjusted);
}

export function getCategories() {
  return CATEGORIES;
}

export function getInvariants() {
  return INVARIANTS;
}

export function getSources() {
  return SOURCES;
}

export function categoryLabel(id: CategoryId) {
  const meta = CATEGORIES.find((item) => item.id === id);
  if (!meta) throw new Error(`Unknown category ${id}`);
  return meta;
}
