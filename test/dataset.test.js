import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { foods } from "../dataset/foods.js";
import { datasetMeta } from "../dataset/meta.js";
import { CLASS_IDS, assignTiers, scoreDataset } from "../lib/scoring/index.js";

describe("versioned dataset", () => {
  test("has a verification date and mapped primary standards", () => {
    assert.match(datasetMeta.version, /^\d+\.\d+\.\d+$/);
    assert.match(datasetMeta.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(datasetMeta.primaryStandards.length >= 6);
    const ids = datasetMeta.primaryStandards.map((s) => s.id);
    assert.ok(ids.includes("usda-fdc"));
    assert.ok(ids.includes("fao-2013-diaas"));
    assert.ok(ids.includes("eu-mrl"));
  });

  test("covers every biochemical class with at least one food", () => {
    const present = new Set(foods.map((f) => f.classId));
    for (const id of CLASS_IDS) {
      assert.ok(present.has(id), `missing class ${id}`);
    }
    assert.ok(foods.length >= 24);
  });

  test("keeps sprouts, kraut, mushrooms, and algae as distinct classes", () => {
    const byClass = Object.fromEntries(CLASS_IDS.map((id) => [id, foods.filter((f) => f.classId === id)]));
    assert.ok(byClass.sprouts.length >= 2);
    assert.ok(byClass.cruciferous_kraut.some((f) => f.fermented));
    assert.ok(byClass.cruciferous_kraut.some((f) => !f.fermented));
    assert.ok(byClass.mushrooms.every((f) => f.kingdom === "fungi"));
    assert.ok(byClass.algae.every((f) => f.kingdom === "algae"));
  });

  test("scores the whole dataset and never equates plant to animal protein", () => {
    const scored = assignTiers(scoreDataset(foods));
    assert.equal(scored.length, foods.length);
    for (const food of scored) {
      assert.equal(food.claims.proteinEquivalentToAnimal, false);
      assert.match(food.tier, /^[SABCD]$/);
      if (food.kingdom === "animal") {
        assert.equal(food.protein.kind === "complete_animal" || food.protein.kind === "incomplete_animal", true);
      } else {
        assert.equal(food.protein.kind, "incomplete_plant");
        assert.equal(food.protein.complete, false);
      }
    }
    const plantClasses = scored.filter((f) => f.kingdom !== "animal").map((f) => f.classId);
    const animalClasses = scored.filter((f) => f.kingdom === "animal").map((f) => f.classId);
    assert.ok(new Set(plantClasses).size >= 3);
    assert.ok(new Set(animalClasses).size >= 2);
  });

  test("flags estimated fields instead of hiding conversion factors", () => {
    const estimated = foods.filter((f) => f.flags.estimatedFields.length > 0);
    assert.ok(estimated.length > 10);
    assert.ok(foods.every((f) => Array.isArray(f.extensions.future ? [] : f.extensions ? Object.keys(f.extensions) : [])));
    assert.ok(foods.every((f) => f.extensions && "supplements" in f.extensions));
  });
});
