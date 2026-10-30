import { activeCarbsG, passiveCarbsG } from "./carbs";
import { energyDenominatorKcal, KCAL_PER_G } from "./macroEnergy";
import type { FoodRecord } from "./types";
import { clamp01 } from "./math";

export type NutrientBasis = "per100g" | "per100kcal";

/**
 * One scale per basis, shared by every spoke, so the ring labels hold on all three. Per 100 g the
 * heaviest catalog value is walnut fat (70.6 g); per 100 kcal a spoke counts kcal from that nutrient.
 */
export const NUTRIENT_RADAR_FULL = { per100g: 80, per100kcal: 100 } as const;

/** Thermochemical calorie. EU labels use their own factors (17 / 37 / 17 kJ per g), so a database kJ value can differ by up to 2 %. */
export const KJ_PER_KCAL = 4.184;

/** The three energy-giving macronutrients; carbs means available carbohydrate (sugars plus starch). */
export const GENERAL_NUTRIENT_KEYS = ["protein", "fat", "carbs"] as const;
export type GeneralNutrientKey = (typeof GENERAL_NUTRIENT_KEYS)[number];

const SPOKE_KCAL_PER_G: Record<GeneralNutrientKey, number> = {
  protein: KCAL_PER_G.protein,
  fat: KCAL_PER_G.fat,
  carbs: KCAL_PER_G.carb,
};

export function energyKj(kcal: number): number {
  return Math.round(kcal * KJ_PER_KCAL);
}

export function generalNutrientGrams(food: FoodRecord): Record<GeneralNutrientKey, number> {
  return {
    protein: food.proteinG,
    fat: food.fatG,
    carbs: activeCarbsG(food),
  };
}

/** Scale gram amounts to a per-100-kcal basis for display. */
export function scaleGramsForBasis(grams: number, food: FoodRecord, basis: NutrientBasis): number {
  if (basis === "per100g") return grams;
  const kcal = Math.max(food.kcalPer100g, 1);
  return grams * (100 / kcal);
}

/**
 * What a spoke measures: grams per 100 g, or kcal from the nutrient in 100 kcal of the food. The kcal
 * share uses the same energy as the legend's energy split, so the two always agree.
 */
export function nutrientRadarAmounts(food: FoodRecord, basis: NutrientBasis): Record<GeneralNutrientKey, number> {
  const grams = generalNutrientGrams(food);
  if (basis === "per100g") return grams;
  const total = energyDenominatorKcal(food);
  const kcalPer100 = (key: GeneralNutrientKey) => (total > 0 ? (grams[key] * SPOKE_KCAL_PER_G[key] * 100) / total : 0);
  return { protein: kcalPer100("protein"), fat: kcalPer100("fat"), carbs: kcalPer100("carbs") };
}

/** 0–100 spoke lengths on the shared scale of the basis. Display only; not a score axis. */
export function nutrientRadarSpokes(food: FoodRecord, basis: NutrientBasis): Record<GeneralNutrientKey, number> {
  const amounts = nutrientRadarAmounts(food, basis);
  const full = NUTRIENT_RADAR_FULL[basis];
  return {
    protein: 100 * clamp01(amounts.protein / full),
    fat: 100 * clamp01(amounts.fat / full),
    carbs: 100 * clamp01(amounts.carbs / full),
  };
}

export interface MassCompositionPct {
  water: number;
  protein: number;
  fat: number;
  carbs: number;
  other: number;
}

/** Share of edible mass (g per 100 g) for composition context on the compare radar. Display only. */
export function massCompositionPercent(food: FoodRecord): MassCompositionPct {
  const water = Math.max(0, food.composition.waterG);
  const protein = Math.max(0, food.proteinG);
  const fat = Math.max(0, food.fatG);
  const carbs = Math.max(0, activeCarbsG(food) + passiveCarbsG(food));
  const accounted = water + protein + fat + carbs;
  const other = Math.max(0, 100 - accounted);
  const total = accounted + other || 1;
  return {
    water: (water / total) * 100,
    protein: (protein / total) * 100,
    fat: (fat / total) * 100,
    carbs: (carbs / total) * 100,
    other: (other / total) * 100,
  };
}
