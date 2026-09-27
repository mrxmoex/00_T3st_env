import { clamp01, round1, round2 } from "./math";
import type { AxisBreakdown, FoodRecord, ProcessingStability } from "./types";

const STABILITY_DE: Record<ProcessingStability, string> = {
  fresh: "frisch",
  fermented: "fermentiert",
  dried: "getrocknet",
  cooked: "gegart",
};

function stabilityBonus(value: ProcessingStability): number {
  switch (value) {
    case "fresh":
      return 0;
    case "cooked":
      return 0.08;
    case "fermented":
      return 0.22;
    case "dried":
      return 0.28;
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

/**
 * Post-harvest stability. Higher score = more stable.
 * Water-soluble vitamins degrade with time, oxygen, light, cutting, and heat.
 * Fat-soluble vitamins are more stable but oxidise.
 */
export function scoreDegradation(food: FoodRecord): AxisBreakdown {
  const d = food.degradation;
  const perish = clamp01(1 - d.perishabilityDays / 21);
  const sensitivity =
    0.28 * clamp01(d.waterSolubleVitaminLoad) +
    0.18 * clamp01(d.cutSurfaceSensitivity) +
    0.18 * clamp01(d.heatSensitivity) +
    0.18 * clamp01(d.oxygenLightSensitivity) +
    0.18 * perish;

  const score = 100 * clamp01(1 - sensitivity + stabilityBonus(d.processingStability));
  return {
    score: round1(score),
    parts: {
      sensitivity: round2(sensitivity),
      stabilityBonus: stabilityBonus(d.processingStability),
      perishabilityDays: d.perishabilityDays,
    },
    flags: [
      {
        en: `Processing stability: ${d.processingStability}`,
        de: `Verarbeitungsstabilität: ${STABILITY_DE[d.processingStability]}`,
      },
      {
        en: `Water-soluble vitamin load ${d.waterSolubleVitaminLoad}`,
        de: `Last wasserlöslicher Vitamine ${d.waterSolubleVitaminLoad}`,
      },
      {
        en: `Typical perishability ${d.perishabilityDays} days under ordinary refrigeration/pantry`,
        de: `Typische Haltbarkeit ${d.perishabilityDays} Tage bei normaler Kühlung/Lagerung`,
      },
    ],
  };
}
