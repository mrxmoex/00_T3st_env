import { SURFACE_RISK } from "../data/coefficients";
import type { AxisBreakdown, Food, SurfaceAreaClass } from "../data/types";
import { assertNever } from "../lib/exhaustive";
import { clamp } from "../lib/math";

function surfaceRisk(level: SurfaceAreaClass): number {
  switch (level) {
    case "low":
      return SURFACE_RISK.low;
    case "medium":
      return SURFACE_RISK.medium;
    case "high":
      return SURFACE_RISK.high;
    default: {
      const _exhaustive: never = level;
      return assertNever(_exhaustive, "surfaceAreaClass");
    }
  }
}

export function scoreResidues(food: Food): AxisBreakdown {
  const r = food.residues;
  const surface = surfaceRisk(r.surfaceAreaClass);
  const risk =
    0.34 * surface +
    0.24 * r.systemicRisk +
    0.18 * r.contactRisk +
    0.24 * r.mrlExceedanceRate +
    0.35 * r.aquaticMercuryRisk;
  const notes = [
    `Surface class ${r.surfaceAreaClass} (factor ${surface}).`,
    `Systemic ${r.systemicRisk.toFixed(2)}, contact ${r.contactRisk.toFixed(2)}, monitoring ${r.mrlExceedanceRate.toFixed(2)}.`,
  ];
  if (r.aquaticMercuryRisk > 0) {
    notes.push(
      `Aquatic mercury risk factor ${r.aquaticMercuryRisk.toFixed(2)} (large predatory fish rise; small pelagics stay low).`,
    );
  }
  return {
    score: clamp(100 * (1 - risk), 0, 100),
    flags: [
      {
        key: "surface_area",
        applied: true,
        value: surface,
        reason: "Crop surface area class → residue intercept probability",
      },
      {
        key: "aquatic_mercury",
        applied: r.aquaticMercuryRisk > 0,
        value: r.aquaticMercuryRisk,
        reason: "Fish/seafood methylmercury overlay",
      },
    ],
    notes,
  };
}
