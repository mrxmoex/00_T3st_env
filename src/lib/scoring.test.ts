import { describe, expect, it } from "vitest";
import { foodById, FOODS } from "@/data/foods";
import {
  bioavailabilityMultiplier,
  completenessMultiplier,
  rawBioavailability,
  rawCarbohydrateQuality,
  rawEfaProfile,
  rawNutrientDensity,
  rawProteinQuality,
  scoreCatalog,
  scoreFood,
} from "@/lib/scoring";

describe("multipliers before ranking", () => {
  it("gives completeness 1.0 only when DIAAS is at least 1.0", () => {
    expect(completenessMultiplier(foodById("egg-whole"))).toBe(1);
    expect(completenessMultiplier(foodById("milk-whole"))).toBe(1);
    expect(completenessMultiplier(foodById("lentils-cooked"))).toBeLessThan(0.9);
    expect(completenessMultiplier(foodById("spinach-raw"))).toBeLessThan(
      completenessMultiplier(foodById("soybeans-cooked")),
    );
  });

  it("applies the completeness cut to protein quality before ranking", () => {
    const lentils = scoreFood(foodById("lentils-cooked"));
    expect(lentils.axes.proteinQuality.adjusted).toBeLessThan(lentils.axes.proteinQuality.raw);
    expect(lentils.completenessMultiplier).toBeLessThan(1);
  });

  it("keeps heme bioavailability above high-phytate non-heme even when total Fe is similar", () => {
    const spinach = foodById("spinach-raw");
    const beef = foodById("beef-85-cooked");
    expect(spinach.composition.ironMg.value).toBeGreaterThanOrEqual(beef.composition.ironMg.value - 0.05);
    expect(rawBioavailability(beef)).toBeGreaterThan(rawBioavailability(spinach));
    expect(bioavailabilityMultiplier(beef)).toBeGreaterThan(bioavailabilityMultiplier(spinach));
  });
});

describe("axis trade-offs", () => {
  it("ranks egg and beef above lentils on protein quality after multipliers", () => {
    const egg = scoreFood(foodById("egg-whole"));
    const beef = scoreFood(foodById("beef-85-cooked"));
    const lentils = scoreFood(foodById("lentils-cooked"));
    expect(egg.axes.proteinQuality.adjusted).toBeGreaterThan(lentils.axes.proteinQuality.adjusted);
    expect(beef.axes.proteinQuality.adjusted).toBeGreaterThan(lentils.axes.proteinQuality.adjusted);
  });

  it("ranks lentils above beef on carbohydrate quality because fiber is passive carbohydrate", () => {
    expect(rawCarbohydrateQuality(foodById("lentils-cooked"))).toBeGreaterThan(
      rawCarbohydrateQuality(foodById("beef-85-cooked")),
    );
  });

  it("does not let kale ALA outrank salmon EPA/DHA", () => {
    expect(rawEfaProfile(foodById("salmon-farmed-cooked"))).toBeGreaterThan(
      rawEfaProfile(foodById("kale-raw")),
    );
    expect(rawEfaProfile(foodById("kale-raw"))).toBeLessThanOrEqual(42);
  });

  it("lets liver dominate nutrient density versus chicken breast", () => {
    expect(rawNutrientDensity(foodById("beef-liver-braised"))).toBeGreaterThan(70);
    expect(rawNutrientDensity(foodById("beef-liver-braised"))).toBeGreaterThan(
      rawNutrientDensity(foodById("chicken-breast-cooked")),
    );
  });

  it("gives leafy greens a high per-kcal density without treating them as complete protein", () => {
    expect(rawNutrientDensity(foodById("spinach-raw"))).toBeGreaterThan(
      rawNutrientDensity(foodById("chicken-breast-cooked")),
    );
    expect(foodById("spinach-raw").proteinQuality.complete).toBe(false);
  });

  it("keeps soy as the best unaugmented plant protein in the seed without calling it complete", () => {
    const soy = foodById("soybeans-cooked");
    expect(soy.proteinQuality.complete).toBe(false);
    expect(rawProteinQuality(soy)).toBeGreaterThan(rawProteinQuality(foodById("lentils-cooked")));
    expect(rawProteinQuality(soy)).toBeLessThan(rawProteinQuality(foodById("egg-whole")));
  });
});

describe("catalog ranking", () => {
  it("never emits a single vegetable average", () => {
    const scores = scoreCatalog(FOODS);
    expect(scores).toHaveLength(FOODS.length);
    expect(new Set(FOODS.map((food) => food.category)).size).toBe(11);
  });

  it("assigns S-A-B-C-D tiers from the adjusted combined score", () => {
    const liver = scoreFood(foodById("beef-liver-braised"));
    expect(liver.tierAcross).toBe(liver.combined >= 50 ? "B" : liver.combined >= 35 ? "C" : "D");
    expect(liver.combined).toBeGreaterThan(50);
    expect(scoreFood(foodById("oysters-raw")).tierAcross).toBe("A");
  });
});
