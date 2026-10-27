import { describe, expect, it } from "vitest";
import { FOODS, requireFood } from "../data/catalog";
import {
  energyKj,
  GENERAL_NUTRIENT_FULL_G,
  GENERAL_NUTRIENT_KEYS,
  generalNutrientGrams,
  generalNutrientScores,
} from "./generalNutrients";

describe("general nutrients", () => {
  it("converts kcal to kJ with the EU labelling factor", () => {
    expect(energyKj(100)).toBe(418);
    expect(energyKj(0)).toBe(0);
  });

  it("draws a full spoke at the stated grams and clamps above them", () => {
    const egg = requireFood("egg_boiled");
    const potato = requireFood("potato_boiled");
    const eggScores = generalNutrientScores(egg);
    const potatoScores = generalNutrientScores(potato);

    expect(egg.proteinG).toBeGreaterThan(potato.proteinG);
    expect(eggScores.protein).toBeGreaterThan(potatoScores.protein);
    expect(eggScores.protein).toBeCloseTo((egg.proteinG / GENERAL_NUTRIENT_FULL_G.protein) * 100, 5);
    expect(eggScores.sugar).toBeCloseTo(
      Math.min(100, (egg.carbs.sugars / GENERAL_NUTRIENT_FULL_G.sugar) * 100),
      5,
    );
    expect(GENERAL_NUTRIENT_FULL_G).toEqual({ protein: 25, fat: 20, sugar: 10 });
  });

  it("clamps every catalog food onto a 0–100 spoke", () => {
    const overFull = { protein: false, fat: false, sugar: false };
    for (const food of FOODS) {
      const grams = generalNutrientGrams(food);
      const scores = generalNutrientScores(food);
      for (const key of GENERAL_NUTRIENT_KEYS) {
        expect(scores[key]).toBeGreaterThanOrEqual(0);
        expect(scores[key]).toBeLessThanOrEqual(100);
        if (grams[key] > GENERAL_NUTRIENT_FULL_G[key]) {
          overFull[key] = true;
          expect(scores[key]).toBe(100);
        }
      }
    }
    expect(overFull).toEqual({ protein: true, fat: true, sugar: true });
  });
});
