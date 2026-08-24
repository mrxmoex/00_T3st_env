import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FOODS } from "@/data/foods";
import { INVARIANTS } from "@/data/invariants";
import { SOURCES } from "@/data/sources";
import { assertAllCategoriesSeeded, foodsByCategory } from "@/data/foods";
import { FOOD_CATEGORIES, PLANT_CATEGORIES } from "./types";
import {
  antinutrientPenalty,
  assignTiers,
  bioavailabilityMultiplier,
  completenessMultiplier,
  evaluateCatalog,
  evaluateFood,
} from "./scoring";

describe("ontology seed", () => {
  it("never collapses plant categories and seeds all eleven classes", () => {
    const seeded = assertAllCategoriesSeeded();
    assert.deepEqual(seeded, [...FOOD_CATEGORIES]);
    for (const category of PLANT_CATEGORIES) {
      assert.ok(foodsByCategory(category).length >= 1, category);
    }
    const ids = new Set(FOODS.map((food) => food.id));
    assert.equal(ids.size, FOODS.length);
  });
});

describe("source protocol", () => {
  it("every invariant and every cited food value points at a known source", () => {
    const sourceIds = new Set<string>(SOURCES.map((source) => source.id));
    for (const invariant of INVARIANTS) {
      for (const id of invariant.sourceIds) {
        assert.ok(sourceIds.has(id), `invariant ${invariant.id} missing ${id}`);
      }
    }
    for (const food of FOODS) {
      assert.ok(sourceIds.has(food.energyKcal.sourceId), food.id);
      assert.ok(sourceIds.has(food.proteinQuality.sourceId), food.id);
      assert.ok(food.compositionYear >= 1999);
    }
  });
});

describe("scoring constraints", () => {
  it("applies completeness and bioavailability multipliers before ranking", () => {
    const catalog = evaluateCatalog(FOODS);
    for (const row of catalog) {
      assert.ok(row.completenessMultiplier <= 1.0);
      assert.ok(row.bioavailabilityMultiplier >= 0.5 && row.bioavailabilityMultiplier <= 1.15);
      const density = row.axes.nutrient_density;
      const protein = row.axes.protein_quality;
      assert.ok(protein.adjusted <= protein.raw * row.completenessMultiplier + 0.01, row.food.id);
      assert.ok(density.adjusted <= density.raw * row.bioavailabilityMultiplier + 0.01, row.food.id);
    }
    const spinach = catalog.find((row) => row.food.id === "spinach-raw");
    assert.ok(spinach);
    assert.ok(spinach.axes.nutrient_density.raw > spinach.axes.nutrient_density.adjusted);
    assert.ok(spinach.axes.nutrient_density.adjusted < spinach.axes.nutrient_density.raw * 0.95);
  });

  it("keeps heme/complete animal protein above incomplete high-oxalate greens on protein+bioavailability", () => {
    const spinach = evaluateFood(FOODS.find((food) => food.id === "spinach-raw")!);
    const beef = evaluateFood(FOODS.find((food) => food.id === "beef-sirloin")!);
    assert.ok(beef.axes.protein_quality.adjusted > spinach.axes.protein_quality.adjusted);
    assert.ok(beef.axes.bioavailability.adjusted > spinach.axes.bioavailability.adjusted);
    assert.ok(spinach.axes.carb_quality.adjusted > beef.axes.carb_quality.adjusted);
    assert.ok(spinach.antinutrientPenalty > beef.antinutrientPenalty);
    assert.ok(spinach.residuePenalty > beef.residuePenalty);
  });

  it("does not treat complementarity as equal to animal DIAAS", () => {
    const lentils = FOODS.find((food) => food.id === "lentils-boiled")!;
    const egg = FOODS.find((food) => food.id === "egg-whole")!;
    assert.ok(lentils.proteinQuality.score < 1);
    assert.ok(egg.proteinQuality.score > 1);
    assert.ok(completenessMultiplier(lentils) < completenessMultiplier(egg));
    assert.ok(bioavailabilityMultiplier(egg) > bioavailabilityMultiplier(lentils));
  });

  it("zeros usable B12 for spirulina analogs and keeps nori contested", () => {
    const spirulina = FOODS.find((food) => food.id === "spirulina")!;
    const nori = FOODS.find((food) => food.id === "nori")!;
    assert.equal(spirulina.micronutrients.b12Status, "inactive_analogs");
    assert.equal(spirulina.micronutrients.b12Ug.amount, 0);
    assert.equal(nori.micronutrients.b12Status, "variable_true");
    assert.equal(nori.micronutrients.b12Ug.flag, "contested");
  });

  it("assigns class tiers without merging plant categories", () => {
    const ranked = assignTiers(FOODS.map(evaluateFood));
    const leafy = ranked.filter((row) => row.food.category === "leafy_greens");
    const legumes = ranked.filter((row) => row.food.category === "legumes");
    assert.ok(leafy.length >= 2);
    assert.ok(legumes.length >= 2);
    assert.notEqual(leafy[0]?.food.category, legumes[0]?.food.category);
    assert.ok(antinutrientPenalty(FOODS.find((food) => food.id === "lentils-boiled")!) > 0);
  });
});
