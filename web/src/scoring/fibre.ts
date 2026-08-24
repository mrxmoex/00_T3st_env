import { COEFFICIENTS } from "../catalog/coefficients.ts";
import type { AxisBreakdown, Food } from "../types/domain.ts";
import { clamp, safeDiv } from "./scale.ts";

function tagScore(tags: readonly string[]): number {
  if (tags.length === 0) {
    return 0;
  }
  let total = 0;
  for (const tag of tags) {
    switch (tag) {
      case "glucosinolates":
        total += 0.92;
        break;
      case "carotenoids":
        total += 0.72;
        break;
      case "polyphenols":
        total += 0.7;
        break;
      case "nitrate":
        total += 0.55;
        break;
      case "beta_glucan":
      case "ergothioneine":
        total += 0.86;
        break;
      case "algae_pigments":
        total += 0.8;
        break;
      case "isoflavones":
        total += 0.6;
        break;
      case "fermented_acids":
        total += 0.75;
        break;
      default:
        total += 0.4;
        break;
    }
  }
  return clamp(total / tags.length, 0, 1);
}

export function scoreFibrePhyto(food: Food): AxisBreakdown {
  if (food.kingdom === "animal" && food.carbs.fiber <= 0.05) {
    return {
      axis: "fibre_phyto",
      score: 6,
      formulaId: "fibre.v1",
      inputs: { fiber: food.carbs.fiber, phyto: 0, kingdom: 0 },
      notes: [
        "Fibre and phytochemicals are plant advantages. Animal foods score near zero on this axis by design.",
        "The composite weight for this axis is ~0.02 in animal classes so absence is not treated as a failed salad.",
      ],
    };
  }

  const fiberTerm = clamp(safeDiv(food.carbs.fiber, COEFFICIENTS.fibreSatG), 0, 1);
  const phyto = tagScore(food.quality.phytochemicalTags);
  const fermentBonus = food.quality.fermented ? 0.08 : 0;
  const raw = clamp(0.5 * fiberTerm + 0.5 * phyto + fermentBonus, 0, 1);

  return {
    axis: "fibre_phyto",
    score: clamp(raw * 100, 0, COEFFICIENTS.scoreCap),
    formulaId: "fibre.v1",
    inputs: { fiberTerm, phyto, fermentBonus },
    notes: [
      "Phytochemical load is class-tag based (glucosinolates, carotenoids, fungal beta-glucans, algae pigments).",
      "Classes are never collapsed: mushrooms, algae, sprouts, and kraut keep distinct tag sets.",
    ],
  };
}
