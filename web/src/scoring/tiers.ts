import type { Food, FoodClass, ScoreAxis, Tier } from "../types/domain.ts";

function absoluteFloor(score: number, proposed: Tier): Tier {
  if (score < 40) {
    return "D";
  }
  if (score < 55) {
    return proposed === "D" ? "D" : "C";
  }
  if (score < 70 && proposed === "S") {
    return "A";
  }
  return proposed;
}

function percentileTier(rankFromTop: number, n: number): Tier {
  if (n <= 1) {
    return "A";
  }
  const pctFromTop = rankFromTop / (n - 1);
  if (pctFromTop <= 0.15) {
    return "S";
  }
  if (pctFromTop <= 0.35) {
    return "A";
  }
  if (pctFromTop <= 0.6) {
    return "B";
  }
  if (pctFromTop <= 0.8) {
    return "C";
  }
  return "D";
}

export function classTiers(
  foods: readonly Food[],
  scoresById: Readonly<Record<string, Readonly<Record<ScoreAxis, number>>>>,
  axis: ScoreAxis,
): Readonly<Record<string, Tier>> {
  const byClass = new Map<FoodClass, Food[]>();
  for (const food of foods) {
    const list = byClass.get(food.foodClass) ?? [];
    list.push(food);
    byClass.set(food.foodClass, list);
  }

  const result: Record<string, Tier> = {};
  for (const group of byClass.values()) {
    const sorted = [...group].sort((a, b) => {
      const diff = (scoresById[b.id]?.[axis] ?? 0) - (scoresById[a.id]?.[axis] ?? 0);
      if (diff !== 0) {
        return diff;
      }
      return a.id.localeCompare(b.id);
    });
    sorted.forEach((food, index) => {
      const score = scoresById[food.id]?.[axis] ?? 0;
      result[food.id] = absoluteFloor(score, percentileTier(index, sorted.length));
    });
  }
  return result;
}
