import {
  BETA_CAROTENE_TO_RAE,
  DENSITY_REFS,
  IRON_ABSORPTION,
  OTHER_CAROTENOID_TO_RAE,
  VITAMIN_C_IRON_ENHANCER_MG,
  ZINC_ABSORPTION,
} from "../data/coefficients";
import { clamp01, mean, round1, round2 } from "./math";
import type { FoodRecord, IronForm, MicroBreakdown } from "./types";

function ironAbsorptionCoefficient(form: IronForm, vitaminCMg: number, phytate: boolean): number {
  switch (form) {
    case "heme":
      return IRON_ABSORPTION.heme;
    case "mixed":
      return 0.6 * IRON_ABSORPTION.heme + 0.4 * IRON_ABSORPTION.nonhemeBase;
    case "nonheme":
      if (phytate) return IRON_ABSORPTION.nonhemeHighPhytate;
      if (vitaminCMg >= VITAMIN_C_IRON_ENHANCER_MG) return IRON_ABSORPTION.nonhemeWithVitaminC;
      return IRON_ABSORPTION.nonhemeBase;
    default: {
      const _exhaustive: never = form;
      return _exhaustive;
    }
  }
}

function zincAbsorptionCoefficient(animal: boolean, phytate: boolean): number {
  if (animal) return ZINC_ABSORPTION.animal;
  if (phytate) return ZINC_ABSORPTION.phytateBound;
  return ZINC_ABSORPTION.lowPhytatePlant;
}

export function retinolActivityEquivalentsUg(food: FoodRecord): number {
  const m = food.micros;
  return (
    m.vitaminARetinolUg +
    m.vitaminABetaCaroteneUg * BETA_CAROTENE_TO_RAE +
    m.vitaminAOtherCarotenoidsUg * OTHER_CAROTENOID_TO_RAE
  );
}

export function absorbableIronMg(food: FoodRecord): number {
  const coeff = ironAbsorptionCoefficient(
    food.micros.ironForm,
    food.micros.vitaminCMg,
    food.micros.zincBoundByPhytate,
  );
  return food.micros.ironMg * coeff;
}

export function absorbableZincMg(food: FoodRecord): number {
  const animal = food.micros.ironForm === "heme" || food.micros.ironForm === "mixed";
  const coeff = zincAbsorptionCoefficient(animal, food.micros.zincBoundByPhytate);
  return food.micros.zincMg * coeff;
}

export function effectiveB12Ug(food: FoodRecord): number {
  if (food.micros.b12IsAnalogue) return 0;
  return food.micros.vitaminB12Ug;
}

function densityContribution(absorbedAmount: number, ref: number, kcal: number): number {
  const per100kcal = (absorbedAmount / Math.max(kcal, 1)) * 100;
  const pctDvPer100kcal = (per100kcal / ref) * 100;
  return clamp01(pctDvPer100kcal / 20);
}

/**
 * Micronutrient density per calorie after bioavailability adjustment.
 * Non-heme iron, phytate-bound zinc, and carotenoid-A are not treated as
 * equal to heme iron, animal zinc, or preformed retinol.
 * Algal B12 analogues contribute 0.
 */
export function scoreMicros(food: FoodRecord): MicroBreakdown {
  const kcal = food.kcalPer100g;
  const rae = retinolActivityEquivalentsUg(food);
  const iron = absorbableIronMg(food);
  const zinc = absorbableZincMg(food);
  const b12 = effectiveB12Ug(food);
  const flags: string[] = [];

  const contributions = [
    densityContribution(iron, DENSITY_REFS.ironMg, kcal),
    densityContribution(zinc, DENSITY_REFS.zincMg, kcal),
    densityContribution(rae, DENSITY_REFS.vitaminARaeUg, kcal),
    densityContribution(b12, DENSITY_REFS.vitaminB12Ug, kcal),
    densityContribution(food.micros.folateUg, DENSITY_REFS.folateUg, kcal),
    densityContribution(food.micros.vitaminCMg, DENSITY_REFS.vitaminCMg, kcal),
    densityContribution(food.micros.vitaminDUg, DENSITY_REFS.vitaminDUg, kcal),
    densityContribution(food.micros.vitaminKUg, DENSITY_REFS.vitaminKUg, kcal),
    densityContribution(food.micros.calciumMg, DENSITY_REFS.calciumMg, kcal),
    densityContribution(food.micros.seleniumUg, DENSITY_REFS.seleniumUg, kcal),
    densityContribution(food.micros.iodineUg, DENSITY_REFS.iodineUg, kcal),
    densityContribution(food.micros.cholineMg, DENSITY_REFS.cholineMg, kcal),
    densityContribution(food.micros.magnesiumMg, DENSITY_REFS.magnesiumMg, kcal),
  ];

  const score = 100 * mean(contributions);

  switch (food.micros.ironForm) {
    case "heme":
      flags.push(`Heme iron ${food.micros.ironMg} mg × absorption ${IRON_ABSORPTION.heme}`);
      break;
    case "mixed":
      flags.push("Mixed heme/non-heme iron; weighted absorption applied");
      break;
    case "nonheme":
      flags.push(
        `Non-heme iron ${food.micros.ironMg} mg. Not equivalent to heme. Phytate=${food.micros.zincBoundByPhytate}`,
      );
      break;
    default: {
      const _exhaustive: never = food.micros.ironForm;
      throw new Error(`Unhandled iron form: ${_exhaustive}`);
    }
  }

  if (food.micros.vitaminARetinolUg <= 0 && food.micros.vitaminABetaCaroteneUg > 0) {
    flags.push(
      `No preformed retinol. β-carotene ${food.micros.vitaminABetaCaroteneUg} µg × ${BETA_CAROTENE_TO_RAE} (1/12 food RAE)`,
    );
  }
  if (food.micros.zincBoundByPhytate) {
    flags.push(`Phytate-bound zinc: absorption ${ZINC_ABSORPTION.phytateBound} vs animal ${ZINC_ABSORPTION.animal}`);
  }
  if (food.micros.b12IsAnalogue) {
    flags.push("Measured corrinoids treated as inactive B12 analogues (0 contribution)");
  } else if (b12 <= 0) {
    flags.push("No bioavailable vitamin B12");
  }

  return {
    score: round1(score),
    raeUg: round1(rae),
    absorbableIronMg: round2(iron),
    absorbableZincMg: round2(zinc),
    effectiveB12Ug: round2(b12),
    parts: {
      meanCappedDensity: round2(mean(contributions)),
    },
    flags,
  };
}
