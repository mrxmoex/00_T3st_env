import { classWeights } from "../catalog/class-weights.ts";
import { COEFFICIENTS } from "../catalog/coefficients.ts";
import type { AxisBreakdown, Food, ScoreAxis } from "../types/domain.ts";
import { clamp } from "./scale.ts";

export function scoreComposite(
  food: Food,
  parts: Readonly<Record<Exclude<ScoreAxis, "composite">, number>>,
): AxisBreakdown {
  const w = classWeights(food.foodClass);
  const raw =
    w.eaa_digestibility * parts.eaa_digestibility +
    w.efa_glyceride * parts.efa_glyceride +
    w.carb_type * parts.carb_type +
    w.micronutrient_bioavail * parts.micronutrient_bioavail +
    w.fibre_phyto * parts.fibre_phyto +
    w.residue_risk * parts.residue_risk +
    w.degradation * parts.degradation;

  return {
    axis: "composite",
    score: clamp(raw, 0, COEFFICIENTS.scoreCap),
    formulaId: "composite.v1",
    inputs: { ...w, raw },
    notes: [
      "Composite is a class-weighted sum. Plant and animal classes do not share one weight vector.",
      "Fibre weight is ~0.02 in animal classes so missing fibre is not scored as a failed vegetable.",
    ],
  };
}
