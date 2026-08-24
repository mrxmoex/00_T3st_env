import { COEFFICIENTS } from "../catalog/coefficients.ts";
import type { AxisBreakdown, Food } from "../types/domain.ts";
import { clamp } from "./scale.ts";

export function scoreResidue(food: Food): AxisBreakdown {
  const r = food.quality.residue;
  const risk = clamp(
    0.45 * r.pdpDetectRate + 0.25 * r.heavyMetalRisk + 0.2 * r.mercuryRisk + 0.1 * r.iodineExcessRisk,
    0,
    1,
  );
  return {
    axis: "residue_risk",
    score: clamp((1 - risk) * 100, 0, COEFFICIENTS.scoreCap),
    formulaId: "residue.v1",
    inputs: {
      pdpDetectRate: r.pdpDetectRate,
      heavyMetalRisk: r.heavyMetalRisk,
      mercuryRisk: r.mercuryRisk,
      iodineExcessRisk: r.iodineExcessRisk,
      risk,
    },
    notes: [
      "Higher score = lower residue/contaminant burden.",
      "PDP detect-rate is a commodity-class band, not a claim that a serving exceeds an MRL.",
    ],
  };
}
