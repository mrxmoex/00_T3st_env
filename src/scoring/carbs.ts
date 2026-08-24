import { clamp01, round1, round2, safeDiv } from "./math";
import type { CarbBreakdown, FoodRecord } from "./types";

export function activeCarbsG(food: FoodRecord): number {
  return food.carbs.sugars + food.carbs.starch;
}

export function passiveCarbsG(food: FoodRecord): number {
  return food.carbs.fibre + food.carbs.resistantStarch;
}

/**
 * Active carbohydrates (sugars + digestible starch) and passive/structural
 * carbohydrates (fibre + resistant starch) occupy different metabolic
 * positions and are scored separately, then combined.
 *
 * Near-zero carb animal foods are metabolically quiet (not a fibre source).
 * They receive a mid-high "quiet" score, not a fibre-equivalence bonus.
 */
export function scoreCarbs(food: FoodRecord): CarbBreakdown {
  const activeG = activeCarbsG(food);
  const passiveG = passiveCarbsG(food);
  const total = activeG + passiveG;
  const kcal = Math.max(food.kcalPer100g, 1);
  const flags: string[] = [];

  const activePer100kcal = (activeG / kcal) * 100;
  const passivePer100kcal = (passiveG / kcal) * 100;

  const activeScore = 100 * (1 - clamp01(activePer100kcal / 15));
  const passiveScore = 100 * clamp01(passivePer100kcal / 8);

  let score: number;
  if (total < 0.5) {
    score = 70;
    flags.push("Negligible carbohydrate. Fibre is absent — this is not a plant-fibre equivalent.");
  } else {
    const passiveFrac = safeDiv(passiveG, total);
    const sugarFrac = safeDiv(food.carbs.sugars, total);
    score = 100 * (0.55 * passiveFrac + 0.25 * (activeScore / 100) + 0.2 * (1 - sugarFrac));
    flags.push(
      `Active (sugars+starch) ${round1(activeG)} g; passive (fibre+RS) ${round1(passiveG)} g per 100 g`,
    );
    if (sugarFrac > 0.45) {
      flags.push("Sugar-dominant carbohydrate profile");
    }
    if (food.carbs.resistantStarch >= 1) {
      flags.push("Meaningful resistant starch (passive)");
    }
  }

  return {
    score: round1(score),
    activeG: round2(activeG),
    passiveG: round2(passiveG),
    activeScore: round1(activeScore),
    passiveScore: round1(passiveScore),
    parts: {
      activePer100kcal: round2(activePer100kcal),
      passivePer100kcal: round2(passivePer100kcal),
    },
    flags,
  };
}
