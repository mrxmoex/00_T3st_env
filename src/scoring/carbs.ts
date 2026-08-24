import type { AxisBreakdown, Food } from "../data/types";
import { clamp } from "../lib/math";

export function activeCarbs(food: Food): number {
  return food.carbs.sugars + Math.max(0, food.carbs.starch - food.carbs.resistantStarch);
}

export function passiveCarbs(food: Food): number {
  return food.carbs.fibre + food.carbs.resistantStarch;
}

export function scoreCarbs(food: Food): AxisBreakdown {
  const active = activeCarbs(food);
  const passive = passiveCarbs(food);
  const total = active + passive;

  if (total < 1) {
    return {
      score: 50,
      flags: [
        {
          key: "carb_neutral_non_vehicle",
          applied: true,
          value: 50,
          reason: "Not a carbohydrate food; axis held at neutral 50",
        },
      ],
      notes: [
        "Active and passive carbohydrate both near zero. Neutral — not a hidden virtue.",
      ],
    };
  }

  const passiveShare = passive / total;
  const raw = 28 + 4.2 * passive + 22 * passiveShare - 0.85 * active;
  return {
    score: clamp(raw, 0, 100),
    flags: [
      {
        key: "active_vs_passive_split",
        applied: true,
        value: passiveShare,
        reason: "Sugars + digestible starch vs fibre + resistant starch",
      },
    ],
    notes: [
      `Active ${active.toFixed(1)} g (sugars + digestible starch).`,
      `Passive ${passive.toFixed(1)} g (fibre + resistant starch).`,
      `Passive share ${(passiveShare * 100).toFixed(0)}%.`,
    ],
  };
}
