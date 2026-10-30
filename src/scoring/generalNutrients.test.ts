import { describe, expect, it } from "vitest";
import { FOODS, requireFood } from "../data/catalog";
import {
  energyKj,
  GENERAL_NUTRIENT_KEYS,
  generalNutrientGrams,
  massCompositionPercent,
  NUTRIENT_RADAR_FULL,
  nutrientRadarAmounts,
  nutrientRadarSpokes,
} from "./generalNutrients";
import { macroEnergyShares } from "./macroEnergy";

describe("general nutrients", () => {
  it("converts kcal to kJ with the thermochemical factor", () => {
    expect(energyKj(100)).toBe(418);
    expect(energyKj(0)).toBe(0);
  });

  it("keeps every catalog food inside the shared per-100-g scale", () => {
    for (const food of FOODS) {
      const grams = generalNutrientGrams(food);
      for (const key of GENERAL_NUTRIENT_KEYS) {
        expect(grams[key], `${food.id} ${key}`).toBeLessThanOrEqual(NUTRIENT_RADAR_FULL.per100g);
      }
    }
  });

  it("draws per-100-g spokes in grams on one scale", () => {
    const egg = requireFood("egg_boiled");
    const spokes = nutrientRadarSpokes(egg, "per100g");
    expect(spokes.protein).toBeCloseTo((egg.proteinG / NUTRIENT_RADAR_FULL.per100g) * 100, 5);
    expect(spokes.fat).toBeCloseTo((egg.fatG / NUTRIENT_RADAR_FULL.per100g) * 100, 5);
  });

  it("counts kcal per 100 kcal that match the legend's energy split", () => {
    for (const food of FOODS) {
      const kcal = nutrientRadarAmounts(food, "per100kcal");
      const shares = macroEnergyShares(food);
      expect(kcal.protein, food.id).toBeCloseTo(shares.protein, 6);
      expect(kcal.fat, food.id).toBeCloseTo(shares.fat, 6);
      expect(kcal.carbs, food.id).toBeCloseTo(shares.carb, 6);
      for (const key of GENERAL_NUTRIENT_KEYS) {
        expect(nutrientRadarSpokes(food, "per100kcal")[key], `${food.id} ${key}`).toBeLessThanOrEqual(100);
      }
    }
  });

  it("mass composition percentages sum to about 100", () => {
    for (const food of FOODS) {
      const pct = massCompositionPercent(food);
      const sum = pct.water + pct.protein + pct.fat + pct.carbs + pct.other;
      expect(sum).toBeGreaterThan(99);
      expect(sum).toBeLessThanOrEqual(100.01);
    }
  });
});
