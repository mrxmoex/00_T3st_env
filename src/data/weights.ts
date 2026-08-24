import { assertNever } from "../lib/exhaustive";
import type { AxisWeights, FoodClass } from "./types";

function weights(input: AxisWeights): AxisWeights {
  const sum =
    input.eaa +
    input.fat +
    input.carb +
    input.micro +
    input.fibre +
    input.residue +
    input.degradation;
  if (Math.abs(sum - 1) > 1e-6) {
    throw new Error(`Class weights must sum to 1, got ${sum}`);
  }
  return input;
}

/**
 * Per-class weights. Classes are never collapsed into a shared plant or
 * animal bag. Fibre weight on animal classes is small because those foods
 * are not fibre vehicles — the fibre axis itself remains ~0 and is shown.
 */
export const CLASS_WEIGHTS: Record<FoodClass, AxisWeights> = {
  leafy_salad: weights({
    eaa: 0.08,
    fat: 0.05,
    carb: 0.12,
    micro: 0.23,
    fibre: 0.2,
    residue: 0.16,
    degradation: 0.16,
  }),
  legumes: weights({
    eaa: 0.22,
    fat: 0.08,
    carb: 0.16,
    micro: 0.16,
    fibre: 0.16,
    residue: 0.12,
    degradation: 0.1,
  }),
  sprouts: weights({
    eaa: 0.14,
    fat: 0.06,
    carb: 0.14,
    micro: 0.18,
    fibre: 0.16,
    residue: 0.14,
    degradation: 0.18,
  }),
  cruciferous_kraut: weights({
    eaa: 0.1,
    fat: 0.05,
    carb: 0.14,
    micro: 0.18,
    fibre: 0.2,
    residue: 0.14,
    degradation: 0.19,
  }),
  mushrooms: weights({
    eaa: 0.14,
    fat: 0.06,
    carb: 0.12,
    micro: 0.2,
    fibre: 0.14,
    residue: 0.16,
    degradation: 0.18,
  }),
  algae: weights({
    eaa: 0.12,
    fat: 0.14,
    carb: 0.1,
    micro: 0.24,
    fibre: 0.12,
    residue: 0.16,
    degradation: 0.12,
  }),
  roots_tubers: weights({
    eaa: 0.1,
    fat: 0.05,
    carb: 0.26,
    micro: 0.18,
    fibre: 0.14,
    residue: 0.13,
    degradation: 0.14,
  }),
  other_vegetables: weights({
    eaa: 0.08,
    fat: 0.06,
    carb: 0.16,
    micro: 0.2,
    fibre: 0.16,
    residue: 0.16,
    degradation: 0.18,
  }),
  muscle_ruminant: weights({
    eaa: 0.28,
    fat: 0.18,
    carb: 0.04,
    micro: 0.22,
    fibre: 0.04,
    residue: 0.12,
    degradation: 0.12,
  }),
  muscle_monogastric: weights({
    eaa: 0.28,
    fat: 0.16,
    carb: 0.04,
    micro: 0.22,
    fibre: 0.04,
    residue: 0.14,
    degradation: 0.12,
  }),
  muscle_poultry: weights({
    eaa: 0.28,
    fat: 0.14,
    carb: 0.04,
    micro: 0.24,
    fibre: 0.04,
    residue: 0.14,
    degradation: 0.12,
  }),
  muscle_fish: weights({
    eaa: 0.24,
    fat: 0.22,
    carb: 0.04,
    micro: 0.22,
    fibre: 0.04,
    residue: 0.14,
    degradation: 0.1,
  }),
  organs: weights({
    eaa: 0.22,
    fat: 0.12,
    carb: 0.04,
    micro: 0.34,
    fibre: 0.04,
    residue: 0.12,
    degradation: 0.12,
  }),
  eggs: weights({
    eaa: 0.3,
    fat: 0.16,
    carb: 0.04,
    micro: 0.24,
    fibre: 0.04,
    residue: 0.1,
    degradation: 0.12,
  }),
  dairy: weights({
    eaa: 0.28,
    fat: 0.16,
    carb: 0.08,
    micro: 0.22,
    fibre: 0.04,
    residue: 0.1,
    degradation: 0.12,
  }),
  fermented_animal: weights({
    eaa: 0.26,
    fat: 0.16,
    carb: 0.08,
    micro: 0.2,
    fibre: 0.04,
    residue: 0.1,
    degradation: 0.16,
  }),
};

export function weightsFor(foodClass: FoodClass): AxisWeights {
  switch (foodClass) {
    case "leafy_salad":
    case "legumes":
    case "sprouts":
    case "cruciferous_kraut":
    case "mushrooms":
    case "algae":
    case "roots_tubers":
    case "other_vegetables":
    case "muscle_ruminant":
    case "muscle_monogastric":
    case "muscle_poultry":
    case "muscle_fish":
    case "organs":
    case "eggs":
    case "dairy":
    case "fermented_animal":
      return CLASS_WEIGHTS[foodClass];
    default: {
      const _exhaustive: never = foodClass;
      return assertNever(_exhaustive, "foodClass");
    }
  }
}
