import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FOODS } from "@/data/foods";
import { kingdomOf } from "./ontology";
import { ANIMAL_CATEGORIES, PLANT_CATEGORIES } from "./types";

describe("kingdom split", () => {
  it("classifies every seeded food without a vegetable average", () => {
    for (const food of FOODS) {
      const kingdom = kingdomOf(food.category);
      if (kingdom === "plant") {
        assert.ok((PLANT_CATEGORIES as readonly string[]).includes(food.category));
      } else {
        assert.ok((ANIMAL_CATEGORIES as readonly string[]).includes(food.category));
      }
    }
    const plantCats = new Set(FOODS.filter((food) => kingdomOf(food.category) === "plant").map((f) => f.category));
    assert.equal(plantCats.size, PLANT_CATEGORIES.length);
  });
});
