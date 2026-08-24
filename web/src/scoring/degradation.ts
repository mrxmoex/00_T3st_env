import { COEFFICIENTS } from "../catalog/coefficients.ts";
import type { AxisBreakdown, Food } from "../types/domain.ts";
import { clamp } from "./scale.ts";

export function scoreDegradation(food: Food): AxisBreakdown {
  const waterSolubleLoad = clamp(food.micros.vitaminCMg / 40 + food.micros.folateUg / 220, 0, 1);
  const pufaOx = clamp(food.fattyAcids.pufa / 5, 0, 1);
  const carotenoidLight = food.micros.carotenoidFraction * 0.35;
  const water = food.quality.dried ? food.quality.waterActivity * 0.4 : food.quality.waterActivity;
  const fermentAdj = food.quality.fermented ? -0.08 : 0;
  const vulnerability = clamp(
    0.38 * waterSolubleLoad + 0.22 * pufaOx + 0.25 * water + 0.15 * carotenoidLight + fermentAdj,
    0,
    1,
  );

  return {
    axis: "degradation",
    score: clamp((1 - vulnerability) * 100, 0, COEFFICIENTS.scoreCap),
    formulaId: "degrade.v1",
    inputs: { waterSolubleLoad, pufaOx, carotenoidLight, water, vulnerability },
    notes: [
      "Water-soluble vitamins degrade rapidly; fat-soluble vitamins are more storage-stable but PUFAs oxidise.",
      "Dried foods lower water-activity; fermentation slightly offsets some losses and creates others.",
    ],
  };
}
