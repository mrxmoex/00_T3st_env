import {
  B12_ANALOG_OR_ABSENT,
  B12_BIOACTIVE,
  IRON_HEME,
  IRON_MIXED,
  IRON_NONHEME,
  MICRO_REFS,
  MICRO_WEIGHTS,
  VITAMIN_A_CAROTENOID,
  VITAMIN_A_MIXED,
  VITAMIN_A_RETINOL,
  ZINC_ANIMAL,
  ZINC_PHYTATE,
} from "../data/coefficients";
import type { AxisBreakdown, Food, IronForm, VitaminAForm } from "../data/types";
import { assertNever } from "../lib/exhaustive";
import { clamp } from "../lib/math";

export function ironCoefficient(form: IronForm): number {
  switch (form) {
    case "heme":
      return IRON_HEME;
    case "nonheme":
      return IRON_NONHEME;
    case "mixed":
      return IRON_MIXED;
    default: {
      const _exhaustive: never = form;
      return assertNever(_exhaustive, "ironForm");
    }
  }
}

export function vitaminACoefficient(form: VitaminAForm): number {
  switch (form) {
    case "retinol":
      return VITAMIN_A_RETINOL;
    case "carotenoid":
      return VITAMIN_A_CAROTENOID;
    case "mixed":
      return VITAMIN_A_MIXED;
    default: {
      const _exhaustive: never = form;
      return assertNever(_exhaustive, "vitaminAForm");
    }
  }
}

export function scoreMicros(food: Food): AxisBreakdown {
  const kcal = Math.max(food.kcalPer100g, 1);
  const scale = 200 / kcal;
  const ironC = ironCoefficient(food.micros.ironForm);
  const zincC = food.micros.zincPhytateBound ? ZINC_PHYTATE : ZINC_ANIMAL;
  const vaC = vitaminACoefficient(food.micros.vitaminAForm);
  const b12C = food.micros.b12Bioactive ? B12_BIOACTIVE : B12_ANALOG_OR_ABSENT;

  const adjusted = {
    ironMg: food.micros.ironMg * ironC,
    zincMg: food.micros.zincMg * zincC,
    vitaminARae: food.micros.vitaminARae * vaC,
    b12Ug: food.micros.b12Ug * b12C,
    folateUg: food.micros.folateUg,
    vitaminCMg: food.micros.vitaminCMg,
    vitaminDUg: food.micros.vitaminDUg,
    calciumMg: food.micros.calciumMg,
    seleniumUg: food.micros.seleniumUg,
    iodineUg: food.micros.iodineUg,
  };

  let weighted = 0;
  let weightSum = 0;
  (Object.keys(MICRO_REFS) as (keyof typeof MICRO_REFS)[]).forEach((key) => {
    const coverage = Math.min(1.25, (adjusted[key] * scale) / MICRO_REFS[key]);
    weighted += coverage * MICRO_WEIGHTS[key];
    weightSum += MICRO_WEIGHTS[key];
  });

  const score = clamp((100 * weighted) / weightSum, 0, 100);
  return {
    score,
    flags: [
      {
        key: "iron_bioavailability",
        applied: true,
        value: ironC,
        reason: `Iron form ${food.micros.ironForm}`,
      },
      {
        key: "zinc_phytate",
        applied: food.micros.zincPhytateBound,
        value: zincC,
        reason: food.micros.zincPhytateBound
          ? "Phytate-bound zinc × 0.40"
          : "Low-phytate / animal zinc × 1.00",
      },
      {
        key: "vitamin_a_form",
        applied: food.micros.vitaminAForm !== "retinol",
        value: vaC,
        reason:
          food.micros.vitaminAForm === "carotenoid"
            ? "Carotenoid RAE × 0.70 additional conversion-variance factor"
            : "Vitamin A form coefficient",
      },
      {
        key: "b12_bioactivity",
        applied: !food.micros.b12Bioactive,
        value: b12C,
        reason: food.micros.b12Bioactive
          ? "Bioactive cobalamin"
          : "B12 absent or algal analog scored 0",
      },
    ],
    notes: [
      `Density basis: 200 kcal (food is ${food.kcalPer100g} kcal/100 g).`,
      "Iron, zinc, vitamin A, B12, and iodine are up-weighted because form differs by kingdom.",
    ],
  };
}
