import type { AxisBreakdown, Food } from "../data/types";
import { clamp } from "../lib/math";

export function scoreFibre(food: Food): AxisBreakdown {
  const fibrePart = Math.min(100, food.carbs.fibre * 8);
  const phytoPart = clamp(food.phytochemicalLoad, 0, 100);
  const score = 0.62 * fibrePart + 0.38 * phytoPart;
  const notes = [
    `Fibre ${food.carbs.fibre.toFixed(1)} g/100 g.`,
    `Phytochemical index ${phytoPart} (ordinal, not a mass assay).`,
  ];
  if (food.kingdom === "animal") {
    notes.push(
      "Animal foods are not fibre/phytochemical vehicles. Near-zero here is expected, not a scoring error.",
    );
  }
  return {
    score: clamp(score, 0, 100),
    flags: [
      {
        key: "phytochemical_index",
        applied: true,
        value: phytoPart,
        reason: "Literature-informed ordinal index (glucosinolates, polyphenols, ergothioneine, …)",
      },
    ],
    notes,
  };
}
