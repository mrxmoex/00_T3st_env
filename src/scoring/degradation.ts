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
 * Stability and nutrient loss. Higher score = more stable, less lost.
 * Water-soluble vitamins degrade with time, oxygen, light, cutting, and heat.
 * Fat-soluble vitamins are more stable but oxidise. An industrially processed food
 * is scaled by the share of labile vitamins it kept against its home-prepared form:
 * a stable shelf life bought by destroying the vitamins does not count as stability.
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

  const retention = food.processing.retention;
  const kept = retention?.fraction ?? 1;
  const score = 100 * clamp01(1 - sensitivity + stabilityBonus(d.processingStability)) * kept;
  const retentionFlags = retention
    ? [
        {
          en: `Industrial processing kept ${Math.round(kept * 100)} % of the labile vitamins (vitamin C, thiamin, folate, B6 per g dry matter) of the home-prepared form; the axis is scaled by that share`,
          de: `Die industrielle Verarbeitung ließ ${Math.round(kept * 100)} % der empfindlichen Vitamine (Vitamin C, Thiamin, Folat, B6 je g Trockenmasse) der selbst zubereiteten Form übrig; die Achse wird mit diesem Anteil skaliert`,
        },
      ]
    : [];
  return {
    score: round1(score),
    parts: {
      sensitivity: round2(sensitivity),
      stabilityBonus: stabilityBonus(d.processingStability),
      perishabilityDays: d.perishabilityDays,
      labileRetention: kept,
    },
    flags: [
      ...retentionFlags,
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
