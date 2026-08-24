import { FOODS } from "@/data/foods";
import { scoreCatalog } from "@/lib/scoring";
import { AXES, FOOD_CATEGORIES, type AxisId, type Food, type FoodCategory, type FoodScore } from "@/lib/types";

export type ScoredFood = {
  food: Food;
  score: FoodScore;
};

export function scoredFoods(): ScoredFood[] {
  const scores = scoreCatalog(FOODS);
  return scores.map((score) => ({
    food: FOODS.find((food) => food.id === score.foodId) as Food,
    score,
  }));
}

export function filterFoods(options: {
  categories?: FoodCategory[];
  axis?: AxisId;
  query?: string;
}): ScoredFood[] {
  const rows = scoredFoods();
  return rows
    .filter((row) => {
      if (options.categories && options.categories.length > 0) {
        if (!options.categories.includes(row.food.category)) return false;
      }
      if (options.query) {
        const q = options.query.toLowerCase();
        const hay = `${row.food.name.en} ${row.food.name.de} ${row.food.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (!options.axis) return b.score.combined - a.score.combined;
      return b.score.axes[options.axis].adjusted - a.score.axes[options.axis].adjusted;
    });
}

export function axisList(): AxisId[] {
  return [...AXES];
}

export function categoryList(): FoodCategory[] {
  return [...FOOD_CATEGORIES];
}
