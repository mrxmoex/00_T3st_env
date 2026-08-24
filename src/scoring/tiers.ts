import type { Food, FoodClass, FoodScores, Tier } from "../data/types";

function absoluteTier(score: number): Tier {
  if (score >= 82) return "S";
  if (score >= 70) return "A";
  if (score >= 58) return "B";
  if (score >= 46) return "C";
  return "D";
}

function percentileTier(rankFromTop: number, n: number): Tier {
  const pct = rankFromTop / n;
  if (pct <= 0.15) return "S";
  if (pct <= 0.35) return "A";
  if (pct <= 0.6) return "B";
  if (pct <= 0.8) return "C";
  return "D";
}

export function assignTiersWithinClasses(
  foods: Food[],
  scores: FoodScores[],
): FoodScores[] {
  const foodById = new Map(foods.map((food) => [food.id, food]));
  const grouped = new Map<FoodClass, FoodScores[]>();
  for (const score of scores) {
    const food = foodById.get(score.foodId);
    if (!food) continue;
    const list = grouped.get(food.foodClass) ?? [];
    list.push(score);
    grouped.set(food.foodClass, list);
  }

  const tierById = new Map<string, Tier>();
  for (const [, list] of grouped) {
    const sorted = [...list].sort((a, b) => b.composite - a.composite);
    sorted.forEach((row, index) => {
      const tier =
        sorted.length >= 4
          ? percentileTier(index + 1, sorted.length)
          : absoluteTier(row.composite);
      tierById.set(row.foodId, tier);
    });
  }

  return scores.map((row) => ({
    ...row,
    tier: tierById.get(row.foodId) ?? absoluteTier(row.composite),
  }));
}

export function describeTierRule(n: number): string {
  if (n >= 4) {
    return "Within-class percentile: S top 15%, A 15–35%, B 35–60%, C 60–80%, D remainder.";
  }
  return "Absolute gates (n<4): S≥82, A≥70, B≥58, C≥46, D below.";
}
