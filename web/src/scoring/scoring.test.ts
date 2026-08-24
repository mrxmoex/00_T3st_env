import { describe, expect, it } from "vitest";
import { FOODS, foodById } from "../catalog/foods.ts";
import { classWeights } from "../catalog/class-weights.ts";
import { ANIMAL_CLASSES, PLANT_CLASSES, SCORE_AXES } from "../catalog/labels.ts";
import { recommend } from "../recommend/engine.ts";
import { toCsvExport, toJsonExport } from "../export/serialize.ts";
import { evaluateAll, evaluateFood } from "./evaluate.ts";
import { scoreEaa } from "./eaa.ts";

const EVALUATIONS = evaluateAll(FOODS);

function mustFood(id: string) {
  const food = foodById(id);
  if (!food) {
    throw new Error(`Missing food ${id}`);
  }
  return food;
}

describe("catalog coverage", () => {
  it("includes every required plant and animal class", () => {
    const present = new Set(FOODS.map((food) => food.foodClass));
    for (const foodClass of PLANT_CLASSES) {
      expect(present.has(foodClass), foodClass).toBe(true);
    }
    for (const foodClass of ANIMAL_CLASSES) {
      expect(present.has(foodClass), foodClass).toBe(true);
    }
  });

  it("keeps class weights summing to 1", () => {
    for (const foodClass of [...PLANT_CLASSES, ...ANIMAL_CLASSES]) {
      const weights = classWeights(foodClass);
      const sum = SCORE_AXES.filter((axis) => axis !== "composite").reduce(
        (total, axis) => total + weights[axis],
        0,
      );
      expect(sum).toBeCloseTo(1, 9);
    }
  });
});

describe("deterministic scoring", () => {
  it("returns identical scores on two full passes", () => {
    const first = evaluateAll(FOODS);
    const second = evaluateAll(FOODS);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it("is a pure function of the food record", () => {
    const food = mustFood("lentils-boiled");
    expect(evaluateFood(food).scores).toEqual(evaluateFood(food).scores);
  });
});

describe("plant proteins are never complete", () => {
  it("labels every plant food incomplete", () => {
    const plants = FOODS.filter((food) => food.kingdom === "plant");
    expect(plants.length).toBeGreaterThanOrEqual(8);
    for (const food of plants) {
      const result = scoreEaa(food);
      expect(result.completeness, food.id).toBe("incomplete");
    }
  });

  it("does not complete tofu even with a high published DIAAS", () => {
    const tofu = scoreEaa(mustFood("tofu-calcium"));
    expect(tofu.usedPublishedDiaas).toBe(true);
    expect(tofu.diaasLike).toBeCloseTo(0.91, 5);
    expect(tofu.completeness).toBe("incomplete");
  });

  it("labels reference animal foods complete", () => {
    for (const id of ["beef-85-broiled", "egg-boiled", "salmon-atlantic-raw", "milk-whole"]) {
      expect(scoreEaa(mustFood(id)).completeness, id).toBe("complete");
    }
  });

  it("does not force plant and animal EAA scores to equivalence", () => {
    const lentil = scoreEaa(mustFood("lentils-boiled")).score;
    const beef = scoreEaa(mustFood("beef-85-broiled")).score;
    expect(beef).toBeGreaterThan(lentil);
    expect(beef).toBeGreaterThanOrEqual(99);
    expect(lentil).toBeLessThan(90);
  });
});

describe("axis biology", () => {
  it("scores fibre near zero on muscle meat and high on legumes", () => {
    const beef = EVALUATIONS.find((item) => item.foodId === "beef-85-broiled");
    const lentils = EVALUATIONS.find((item) => item.foodId === "lentils-boiled");
    expect(beef?.scores.fibre_phyto).toBeLessThan(10);
    expect(lentils?.scores.fibre_phyto).toBeGreaterThan(50);
  });

  it("gives salmon a higher EFA score than tofu ALA", () => {
    const salmon = EVALUATIONS.find((item) => item.foodId === "salmon-atlantic-raw");
    const tofu = EVALUATIONS.find((item) => item.foodId === "tofu-calcium");
    expect(salmon && tofu).toBeTruthy();
    expect(salmon!.scores.efa_glyceride).toBeGreaterThan(tofu!.scores.efa_glyceride);
  });

  it("treats liver retinol as a micronutrient outlier versus spinach carotenoids", () => {
    const liver = EVALUATIONS.find((item) => item.foodId === "beef-liver-braised");
    const spinach = EVALUATIONS.find((item) => item.foodId === "spinach-raw");
    expect(liver!.scores.micronutrient_bioavail).toBeGreaterThan(
      spinach!.scores.micronutrient_bioavail,
    );
  });

  it("keeps algae, mushrooms, sprouts, and kraut as separate classes", () => {
    expect(mustFood("nori-laver").foodClass).toBe("algae_seaweed");
    expect(mustFood("white-mushroom").foodClass).toBe("mushrooms");
    expect(mustFood("mung-sprouts").foodClass).toBe("sprouts");
    expect(mustFood("sauerkraut").foodClass).toBe("cruciferous_kraut");
    expect(mustFood("spinach-raw").foodClass).toBe("leafy_salad");
  });
});

describe("recommendations", () => {
  it("requires B12 fortification on plant-only and never calls the pattern complete", () => {
    const report = recommend({
      pattern: "plant_only",
      foods: FOODS,
      evaluations: EVALUATIONS,
    });
    const text = `${report.cannotClaim.join(" ")} ${report.items.map((item) => item.body).join(" ")}`;
    expect(text.toLowerCase()).toContain("b12");
    expect(text.toLowerCase()).not.toMatch(/plant-only pattern is complete/);
    expect(report.items.some((item) => item.id === "b12-required")).toBe(true);
    expect(report.cannotClaim.some((item) => item.includes("not nutritionally complete"))).toBe(
      true,
    );
  });
});

describe("export", () => {
  it("emits CSV and JSON with completeness and every axis", () => {
    const csv = toCsvExport(FOODS, EVALUATIONS);
    const json = JSON.parse(toJsonExport(FOODS, EVALUATIONS)) as {
      rows: Array<{ completeness: string; id: string }>;
    };
    expect(csv).toContain("protein_completeness");
    expect(csv).toContain("eaa_digestibility_score");
    expect(json.rows.length).toBe(FOODS.length);
    expect(json.rows.every((row) => row.id && row.completeness)).toBe(true);
    expect(json.rows.filter((row) => row.id === "spinach-raw")[0]?.completeness).toBe(
      "incomplete",
    );
  });
});
