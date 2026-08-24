import { clamp01, round1, round2 } from "./math";
import type { AxisBreakdown, FoodClass, FoodRecord } from "./types";

function classPhytoBaseline(foodClass: FoodClass): number {
  switch (foodClass) {
    case "leafy_salad":
      return 0.85;
    case "legumes":
      return 0.7;
    case "sprouts":
      return 0.8;
    case "cruciferous_fresh":
      return 0.9;
    case "cruciferous_fermented":
      return 0.88;
    case "mushrooms":
      return 0.55;
    case "algae":
      return 0.6;
    case "roots_tubers":
      return 0.4;
    case "other_vegetables":
      return 0.5;
    case "muscle_ruminant":
    case "muscle_monogastric":
    case "muscle_poultry":
    case "muscle_fish":
    case "organs":
    case "eggs":
    case "dairy":
    case "fermented_animal":
      return 0;
    default: {
      const _exhaustive: never = foodClass;
      return _exhaustive;
    }
  }
}

/**
 * Fibre and phytochemicals are plant advantages. Animal foods score 0
 * on this axis. That is a fact about composition, not a moral ranking.
 */
export function scoreFibre(food: FoodRecord): AxisBreakdown {
  const kcal = Math.max(food.kcalPer100g, 1);
  const fibrePer100kcal = (food.carbs.fibre / kcal) * 100;
  const fibreScore = clamp01(fibrePer100kcal / 4);
  const phyto = clamp01(0.65 * classPhytoBaseline(food.class) + 0.35 * food.phytochemicalIndex);
  const score = 100 * (0.6 * fibreScore + 0.4 * phyto);
  const flags: string[] = [];

  if (classPhytoBaseline(food.class) === 0) {
    flags.push("No dietary fibre or plant phytochemicals. Animal advantage axes are scored elsewhere.");
  } else {
    flags.push(`Fibre ${food.carbs.fibre} g/100 g; phytochemical index ${food.phytochemicalIndex}`);
  }

  return {
    score: round1(score),
    parts: {
      fibreScore: round2(fibreScore),
      phytoScore: round2(phyto),
      fibrePer100kcal: round2(fibrePer100kcal),
    },
    flags,
  };
}
