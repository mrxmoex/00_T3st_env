import type { FoodRecord } from "../../types.js";
import { clamp, per100Kcal } from "../utils.js";

const REFERENCE_MAX = 12;

export function scoreMicronutrients(food: FoodRecord): number {
  const { per100g, bioavailability, kingdom } = food;
  const kcal = per100g.energyKcal;

  let sum = 0;

  sum +=
    per100Kcal(per100g.ironMg, kcal) *
    bioavailability.ironFactor *
    1.2;
  sum +=
    per100Kcal(per100g.zincMg, kcal) *
    bioavailability.zincFactor *
    1.1;
  sum +=
    per100Kcal(per100g.folateUg, kcal) *
    0.08;
  sum +=
    per100Kcal(per100g.vitaminCMg, kcal) *
    0.15;

  const vitA =
    per100g.retinolUg * bioavailability.vitaminAFactor +
    per100g.carotenoidUg * bioavailability.vitaminAFactor;
  sum += per100Kcal(vitA, kcal) * 0.002;

  if (kingdom === "animal") {
    sum += per100Kcal(per100g.vitaminB12Ug, kcal) * 2.5;
    sum += per100Kcal(per100g.creatineMg, kcal) * 0.08;
    sum += per100Kcal(per100g.taurineMg, kcal) * 0.05;
    sum += per100Kcal(per100g.carnosineMg, kcal) * 0.06;
  }

  return clamp((sum / REFERENCE_MAX) * 100);
}
