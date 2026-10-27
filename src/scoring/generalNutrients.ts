import { activeCarbsG, passiveCarbsG } from "./carbs";
import type { FoodRecord } from "./types";
import { clamp01 } from "./math";

export type NutrientBasis = "per100g" | "per100kcal";

/** Grams at which a spoke is drawn full, on either basis. Sugar is scaled tighter because whole foods carry less of it than protein or fat. */
export const GENERAL_NUTRIENT_FULL_G = {
  protein: 25,
  fat: 20,
  sugar: 10,
} as const;

/** Thermochemical calorie. EU labels use their own factors (17 / 37 / 17 kJ per g), so a database kJ value can differ by up to 2 %. */
export const KJ_PER_KCAL = 4.184;

export const GENERAL_NUTRIENT_KEYS = ["protein", "fat", "sugar"] as const;
export type GeneralNutrientKey = (typeof GENERAL_NUTRIENT_KEYS)[number];

export function energyKj(kcal: number): number {
  return Math.round(kcal * KJ_PER_KCAL);
}

export function generalNutrientGrams(food: FoodRecord): Record<GeneralNutrientKey, number> {
  return {
    protein: food.proteinG,
    fat: food.fatG,
    sugar: food.carbs.sugars,
  };
}

/** 0–100 spoke lengths for the general-nutrient radar. Display only; not a score axis. */
export function generalNutrientScores(food: FoodRecord): Record<GeneralNutrientKey, number> {
  const grams = generalNutrientGrams(food);
  return {
    protein: spoke(grams.protein, GENERAL_NUTRIENT_FULL_G.protein),
    fat: spoke(grams.fat, GENERAL_NUTRIENT_FULL_G.fat),
    sugar: spoke(grams.sugar, GENERAL_NUTRIENT_FULL_G.sugar),
  };
}

function spoke(grams: number, fullGrams: number): number {
  return 100 * clamp01(grams / fullGrams);
}

/** Scale gram amounts to a per-100-kcal basis for radar display. */
export function scaleGramsForBasis(grams: number, food: FoodRecord, basis: NutrientBasis): number {
  if (basis === "per100g") return grams;
  const kcal = Math.max(food.kcalPer100g, 1);
  return grams * (100 / kcal);
}

export function generalNutrientGramsForBasis(
  food: FoodRecord,
  basis: NutrientBasis,
): Record<GeneralNutrientKey, number> {
  const raw = generalNutrientGrams(food);
  return {
    protein: scaleGramsForBasis(raw.protein, food, basis),
    fat: scaleGramsForBasis(raw.fat, food, basis),
    sugar: scaleGramsForBasis(raw.sugar, food, basis),
  };
}

/** 0–100 spoke lengths; basis changes density (g per 100 g vs per 100 kcal), not the score engine. */
export function generalNutrientScoresForBasis(
  food: FoodRecord,
  basis: NutrientBasis,
): Record<GeneralNutrientKey, number> {
  const grams = generalNutrientGramsForBasis(food, basis);
  return {
    protein: spoke(grams.protein, GENERAL_NUTRIENT_FULL_G.protein),
    fat: spoke(grams.fat, GENERAL_NUTRIENT_FULL_G.fat),
    sugar: spoke(grams.sugar, GENERAL_NUTRIENT_FULL_G.sugar),
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
