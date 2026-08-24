import { COEFFICIENTS } from "../catalog/coefficients.ts";
import type { AxisBreakdown, Food } from "../types/domain.ts";
import { clamp, safeDiv } from "./scale.ts";

/** Target amounts per 100 kcal, from adult RDA-like anchors / 20 (2000 kcal). */
const TARGET_PER_100_KCAL = {
  ironMg: 0.8,
  zincMg: 0.55,
  vitaminARaeUg: 45,
  vitaminCMg: 4.5,
  b12Ug: 0.12,
  folateUg: 20,
  cholineMg: 27,
  vitaminDUg: 0.75,
} as const;

function density(amount: number, kcal: number): number {
  return safeDiv(amount, Math.max(kcal, 1)) * 100;
}

function ironCoefficient(food: Food): number {
  const heme = food.micros.hemeFraction;
  const nonHeme = 1 - heme;
  const phytate =
    food.micros.zincBoundToPhytate || (food.quality.phytateMg ?? 0) > 50
      ? COEFFICIENTS.phytateIronFactor
      : 1;
  return heme * 1 + nonHeme * COEFFICIENTS.nonHemeIronVsHeme * phytate;
}

function zincCoefficient(food: Food): number {
  return food.micros.zincBoundToPhytate ? COEFFICIENTS.phytateZincVsAnimal : 1;
}

function vitaminACoefficient(food: Food): number {
  if (food.micros.vitaminAForm === "retinol") {
    return 1;
  }
  if (food.micros.vitaminAForm === "carotenoid") {
    return COEFFICIENTS.carotenoidMatrixCaution;
  }
  return (
    (1 - food.micros.carotenoidFraction) * 1 +
    food.micros.carotenoidFraction * COEFFICIENTS.carotenoidMatrixCaution
  );
}

function b12Coefficient(food: Food): number {
  switch (food.micros.b12Form) {
    case "active":
      return 1;
    case "absent":
      return 0;
    case "analog":
      return 0;
    default: {
      const _exhaustive: never = food.micros.b12Form;
      return _exhaustive;
    }
  }
}

function term(adjustedDensity: number, target: number): number {
  return clamp(safeDiv(adjustedDensity, target), 0, 1.4);
}

export function scoreMicros(food: Food): AxisBreakdown {
  const kcal = food.energyKcal;
  const iron = term(density(food.micros.ironMg, kcal) * ironCoefficient(food), TARGET_PER_100_KCAL.ironMg);
  const zinc = term(density(food.micros.zincMg, kcal) * zincCoefficient(food), TARGET_PER_100_KCAL.zincMg);
  const vitA = term(
    density(food.micros.vitaminARaeUg, kcal) * vitaminACoefficient(food),
    TARGET_PER_100_KCAL.vitaminARaeUg,
  );
  const vitC = term(density(food.micros.vitaminCMg, kcal), TARGET_PER_100_KCAL.vitaminCMg);
  const b12 = term(density(food.micros.b12Ug, kcal) * b12Coefficient(food), TARGET_PER_100_KCAL.b12Ug);
  const folate = term(density(food.micros.folateUg, kcal), TARGET_PER_100_KCAL.folateUg);
  const choline = term(density(food.micros.cholineMg, kcal), TARGET_PER_100_KCAL.cholineMg);
  const vitD = term(density(food.micros.vitaminDUg, kcal), TARGET_PER_100_KCAL.vitaminDUg);

  const raw = (iron + zinc + vitA + vitC + b12 + folate + choline + vitD) / 8;

  return {
    axis: "micronutrient_bioavail",
    score: clamp(raw * (100 / 1.4), 0, COEFFICIENTS.scoreCap),
    formulaId: "micro.v1",
    inputs: { iron, zinc, vitA, vitC, b12, folate, choline, vitD },
    notes: [
      "Density is amount per 100 kcal. Bioavailability coefficients are applied before the target ratio.",
      "B12 analogs score 0. Carotenoid vitamin A keeps the IOM RAE conversion plus a matrix caution.",
    ],
  };
}
