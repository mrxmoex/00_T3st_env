import type { NutrientKey } from "../data/sources/snapshot";
import { round2 } from "./math";
import type { FoodRecord, ProcessingRetention } from "./types";

function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? (sorted[middle] ?? 0) : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
}

/** Vitamins that heat, oxygen, and leaching destroy first; the markers of processing loss. */
export const LABILE_NUTRIENTS = ["vitaminC", "thiamin", "folate", "vitaminB6"] as const satisfies readonly NutrientKey[];

/** Nutrient per gram of dry matter, so water gained or lost neither hides nor fakes a loss. */
export function perGramDryMatter(food: FoodRecord, key: NutrientKey): number | null {
  const value = food.nutrients[key];
  const dryMatter = 100 - food.composition.waterG;
  return value === null || dryMatter <= 0 ? null : value / dryMatter;
}

/**
 * How much of the reference's labile vitamins the food kept, per gram of dry matter:
 * the median of the per-vitamin ratios, each capped at 1. The two entries can come
 * from different analyses, so one outlying vitamin must not decide the result.
 * Null when no labile vitamin is reported with a non-zero reference value.
 */
export function labileRetention(food: FoodRecord, reference: FoodRecord): ProcessingRetention | null {
  const nutrients: Partial<Record<NutrientKey, number>> = {};
  for (const key of LABILE_NUTRIENTS) {
    const value = perGramDryMatter(food, key);
    const base = perGramDryMatter(reference, key);
    if (value !== null && base !== null && base > 0) {
      nutrients[key] = round2(value / base);
    }
  }
  const ratios = Object.values(nutrients);
  if (ratios.length === 0) return null;
  return {
    reference: reference.id,
    fraction: round2(median(ratios.map((ratio) => Math.min(1, ratio)))),
    nutrients,
  };
}
