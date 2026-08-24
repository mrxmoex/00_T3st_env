import { test } from "node:test";
import assert from "node:assert/strict";
import { SAMPLE_FOODS } from "../dist/data/sample-foods.js";
import { scoreFood, scoreAllFoods } from "../dist/scoring/engine.js";
import { getDivisionWeights } from "../dist/data/division-weights.js";

test("sample dataset has 3 plant + 2 animal foods", () => {
  const plants = SAMPLE_FOODS.filter((f) => f.kingdom === "plant");
  const animals = SAMPLE_FOODS.filter((f) => f.kingdom === "animal");
  assert.equal(plants.length, 3);
  assert.equal(animals.length, 2);
});

test("plant divisions are distinct", () => {
  const divisions = SAMPLE_FOODS
    .filter((f) => f.kingdom === "plant")
    .map((f) => f.division);
  assert.equal(new Set(divisions).size, divisions.length);
});

test("animal proteins score higher on EAA than leafy greens", () => {
  const salmon = SAMPLE_FOODS.find((f) => f.id === "salmon_atlantic");
  const spinach = SAMPLE_FOODS.find((f) => f.id === "spinach_raw");
  assert.ok(salmon && spinach);
  const salmonScore = scoreFood(salmon);
  const spinachScore = scoreFood(spinach);
  assert.ok(
    salmonScore.scores.eaaCompletenessDigestibility >
      spinachScore.scores.eaaCompletenessDigestibility
  );
});

test("fish scores higher on EFA than plants without EPA/DHA", () => {
  const salmon = scoreFood(
    SAMPLE_FOODS.find((f) => f.id === "salmon_atlantic")
  );
  const spinach = scoreFood(
    SAMPLE_FOODS.find((f) => f.id === "spinach_raw")
  );
  assert.ok(salmon && spinach);
  assert.ok(salmon.scores.efaGlycerideProfile > spinach.scores.efaGlycerideProfile);
});

test("vegan pattern flags B12 gap on plants", () => {
  const scored = scoreAllFoods(SAMPLE_FOODS, "vegan");
  const spinach = scored.find((s) => s.food.id === "spinach_raw");
  assert.ok(spinach);
  assert.ok(spinach.flags.some((f) => f.includes("B12")));
});

test("tier assignment follows thresholds", () => {
  for (const food of SAMPLE_FOODS) {
    const { scores } = scoreFood(food);
    if (scores.composite >= 85) assert.equal(scores.tier, "S");
    else if (scores.composite >= 70) assert.equal(scores.tier, "A");
    else if (scores.composite >= 55) assert.equal(scores.tier, "B");
    else if (scores.composite >= 40) assert.equal(scores.tier, "C");
    else assert.equal(scores.tier, "D");
  }
});

test("division weights sum to approximately 1", () => {
  for (const food of SAMPLE_FOODS) {
    const w = getDivisionWeights(food.division);
    const sum =
      w.eaaCompletenessDigestibility +
      w.efaGlycerideProfile +
      w.carbohydrateType +
      w.micronutrientDensity +
      w.fibrePhytochemical +
      w.residueRisk +
      w.degradationSensitivity;
    assert.ok(Math.abs(sum - 1) < 0.01, `weights sum ${sum} for ${food.division}`);
  }
});
