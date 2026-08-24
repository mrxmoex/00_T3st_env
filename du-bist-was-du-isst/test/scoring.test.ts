import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getAllFoods, getFoodById } from "../src/lib/foods.ts";
import { PLANT_CATEGORIES, ANIMAL_CATEGORIES } from "../src/lib/types/index.ts";
import { computeCompositeScore } from "../src/lib/scoring/engine.ts";

describe("food ontology", () => {
  it("never collapses plant categories into a single bucket", () => {
    const foods = getAllFoods();
    const plantCategories = new Set(
      foods.filter((f) => f.kingdom === "plant").map((f) => f.category),
    );
    assert.ok(plantCategories.size >= 5, "expected multiple distinct plant categories");
    for (const cat of PLANT_CATEGORIES) {
      assert.ok(
        foods.some((f) => f.category === cat),
        `missing seed food for plant category: ${cat}`,
      );
    }
  });

  it("includes all animal categories", () => {
    const foods = getAllFoods();
    for (const cat of ANIMAL_CATEGORIES) {
      assert.ok(
        foods.some((f) => f.category === cat),
        `missing seed food for animal category: ${cat}`,
      );
    }
  });
});

describe("scoring engine", () => {
  it("applies bioavailability — liver outscores spinach on protein axis", () => {
    const liver = getFoodById("beef-liver")!;
    const spinach = getFoodById("spinach-raw")!;
    assert.ok(
      liver.axisScores.protein_quality.adjusted >
        spinach.axisScores.protein_quality.adjusted,
    );
  });

  it("flags spirulina B12 as contested/inactive analog", () => {
    const spirulina = getFoodById("spirulina-dried")!;
    assert.equal(spirulina.bioavailability.b12Status, "inactive_analog");
    assert.ok(spirulina.dataFlags.includes("contested"));
  });

  it("assigns tier rankings", () => {
    const foods = getAllFoods();
    for (const food of foods) {
      assert.ok(["S", "A", "B", "C", "D"].includes(food.classTier));
      assert.ok(["S", "A", "B", "C", "D"].includes(food.globalTier));
      assert.ok(computeCompositeScore(food.axisScores) >= 0);
    }
  });

  it("every food has source references", () => {
    const foods = getAllFoods();
    for (const food of foods) {
      assert.ok(food.sourceIds.length > 0, `${food.id} missing sources`);
    }
  });
});
