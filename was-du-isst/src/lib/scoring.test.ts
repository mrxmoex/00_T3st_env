import { describe, expect, it } from "vitest";
import { SEED_FOODS } from "@/data/foods";
import { ALL_CATEGORY_IDS, isPlantSide, kingdomOf } from "@/lib/ontology";
import {
  assertNoVegetableAverage,
  completenessMultiplier,
  evaluateFoods,
  faoQualityBand,
  scoreFood,
} from "@/lib/scoring";

const evaluated = evaluateFoods(SEED_FOODS);

function food(id: string) {
  const row = evaluated.find((item) => item.food.id === id);
  if (!row) throw new Error(id);
  return row;
}

describe("ontology", () => {
  it("keeps all eleven categories and never collapses plants into one vegetable class", () => {
    assertNoVegetableAverage(SEED_FOODS);
    for (const id of ALL_CATEGORY_IDS) {
      expect(SEED_FOODS.some((item) => item.category === id)).toBe(true);
    }
    const plantCategories = new Set(
      SEED_FOODS.filter((item) => isPlantSide(item.category)).map((item) => item.category),
    );
    expect(plantCategories.size).toBe(6);
    expect(plantCategories.has("leafy-greens")).toBe(true);
    expect(plantCategories.has("legumes")).toBe(true);
  });

  it("assigns fungi and algae outside both vegetable-average and animal muscle", () => {
    expect(kingdomOf("mushrooms-fungi")).toBe("fungi");
    expect(kingdomOf("algae-seaweed")).toBe("algae");
    expect(kingdomOf("organs")).toBe("animal");
  });
});

describe("protein completeness before ranking", () => {
  it("applies completeness multipliers before comparing protein quality", () => {
    expect(completenessMultiplier(1.17)).toBe(1);
    expect(completenessMultiplier(0.91)).toBe(0.9);
    expect(completenessMultiplier(0.7)).toBe(0.75);
    expect(faoQualityBand(1.01)).toBe("excellent");
    expect(faoQualityBand(0.91)).toBe("high");
    expect(faoQualityBand(0.7)).toBe("no-claim");

    const soy = scoreFood(food("soybeans-boiled").food);
    const milk = scoreFood(food("milk-whole").food);
    const egg = scoreFood(food("egg-whole").food);
    expect(soy.proteinQuality.adjusted).toBeLessThan(soy.proteinQuality.raw);
    expect(milk.proteinQuality.adjusted).toBe(milk.proteinQuality.raw);
    expect(egg.proteinQuality.adjusted).toBeGreaterThan(soy.proteinQuality.adjusted);
    expect(milk.proteinQuality.adjusted).toBeGreaterThan(soy.proteinQuality.adjusted);
  });

  it("does not invent DIAAS > 1.0 for unaugmented plants in the seed", () => {
    const plantDiaas = SEED_FOODS.filter((item) => isPlantSide(item.category)).map(
      (item) => item.proteinQuality.diaas,
    );
    expect(Math.max(...plantDiaas)).toBeLessThan(1);
  });
});

describe("trade-offs stay visible", () => {
  it("gives spinach high density relative to its protein quality", () => {
    const spinach = food("spinach-raw");
    expect(spinach.scores.nutrientDensity.adjusted).toBeGreaterThan(
      spinach.scores.proteinQuality.adjusted,
    );
    expect(spinach.scores.carbQuality.adjusted).toBeGreaterThan(60);
  });

  it("lets liver dominate density and salmon dominate EFA", () => {
    const byDensity = [...evaluated].sort(
      (a, b) => b.scores.nutrientDensity.adjusted - a.scores.nutrientDensity.adjusted,
    );
    expect(byDensity[0].food.category).toBe("organs");
    const byEfa = [...evaluated].sort(
      (a, b) => b.scores.efaProfile.adjusted - a.scores.efaProfile.adjusted,
    );
    expect(byEfa[0].food.category).toBe("fish-seafood");
  });

  it("scores animal muscle as carb-neutral, not high-fiber", () => {
    const beef = food("beef-ground-85");
    expect(beef.scores.carbQuality.adjusted).toBeGreaterThan(40);
    expect(beef.scores.carbQuality.adjusted).toBeLessThan(60);
    expect(food("lentils-boiled").scores.carbQuality.adjusted).toBeGreaterThan(
      beef.scores.carbQuality.adjusted,
    );
  });

  it("penalizes leafy residue surface versus cooked seeds", () => {
    expect(food("spinach-raw").scores.bioavailability.adjusted).toBeLessThan(
      food("lentils-boiled").scores.bioavailability.adjusted,
    );
    expect(food("beef-liver").scores.bioavailability.adjusted).toBeGreaterThan(
      food("spinach-raw").scores.bioavailability.adjusted,
    );
  });

  it("treats spirulina B12 as analog-only, not a B12 win", () => {
    const analog = food("spirulina").food.bioactives.find((item) => item.id === "b12-analog");
    expect(analog?.presence).toBe("analog-only");
    expect(food("spirulina").scores.uniqueBioactives.adjusted).toBeLessThan(
      food("salmon-atlantic").scores.uniqueBioactives.adjusted,
    );
  });
});

describe("combined score is not a verdict", () => {
  it("keeps seven independent axes on every food", () => {
    for (const row of evaluated) {
      expect(Object.keys(row.scores)).toHaveLength(7);
      expect(row.combined).toBeGreaterThan(0);
      expect(row.combined).toBeLessThanOrEqual(100);
    }
  });
});
