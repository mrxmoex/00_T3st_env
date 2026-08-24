import { COEFFICIENTS } from "../catalog/coefficients.ts";
import type { AxisBreakdown, Food } from "../types/domain.ts";
import { clamp, safeDiv } from "./scale.ts";

export function activeCarbsG(food: Food): number {
  return food.carbs.sugars + Math.max(0, food.carbs.starch - food.carbs.resistantStarch);
}

export function passiveCarbsG(food: Food): number {
  return food.carbs.fiber + food.carbs.resistantStarch;
}

export function scoreCarbs(food: Food): AxisBreakdown {
  const active = activeCarbsG(food);
  const passive = passiveCarbsG(food);
  const total = food.carbs.total;

  if (total <= 0.2 && food.kingdom === "animal") {
    return {
      axis: "carb_type",
      score: 64,
      formulaId: "carb.v1",
      inputs: { active, passive, total, mode: 1 },
      notes: [
        "Animal muscle/egg/most dairy contribute negligible digestible carbohydrate and no fibre.",
        "This axis does not treat the absence of fibre as a defect of an animal food.",
      ],
    };
  }

  const activePenalty = clamp(safeDiv(active, COEFFICIENTS.activeCarbSatG), 0, 1);
  const passiveBonus = clamp(safeDiv(passive, COEFFICIENTS.passiveCarbSatG), 0, 1);
  const raw = 0.55 * (1 - activePenalty) + 0.45 * passiveBonus;

  return {
    axis: "carb_type",
    score: clamp(raw * 100, 0, COEFFICIENTS.scoreCap),
    formulaId: "carb.v1",
    inputs: { active, passive, total, activePenalty, passiveBonus },
    notes: [
      "Active = sugars + (starch − resistant starch).",
      "Passive = fibre + resistant starch. The two are never collapsed.",
    ],
  };
}
