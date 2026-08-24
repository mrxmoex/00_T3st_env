import type { AxisScores, DivisionWeights, Tier } from "../types.js";
import { TIER_THRESHOLDS } from "../coefficients.js";

export function computeComposite(
  axes: Omit<AxisScores, "composite" | "tier">,
  weights: DivisionWeights
): number {
  return (
    axes.eaaCompletenessDigestibility * weights.eaaCompletenessDigestibility +
    axes.efaGlycerideProfile * weights.efaGlycerideProfile +
    axes.carbohydrateType * weights.carbohydrateType +
    axes.micronutrientDensity * weights.micronutrientDensity +
    axes.fibrePhytochemical * weights.fibrePhytochemical +
    axes.residueRisk * weights.residueRisk +
    axes.degradationSensitivity * weights.degradationSensitivity
  );
}

export function tierFromComposite(composite: number): Tier {
  if (composite >= TIER_THRESHOLDS.S) return "S";
  if (composite >= TIER_THRESHOLDS.A) return "A";
  if (composite >= TIER_THRESHOLDS.B) return "B";
  if (composite >= TIER_THRESHOLDS.C) return "C";
  return "D";
}
