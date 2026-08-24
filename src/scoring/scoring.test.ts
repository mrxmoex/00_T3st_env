import { describe, expect, it } from "vitest";
import { FOODS, assertCatalogCoverage, foodById } from "../data/catalog";
import { ANIMAL_CLASSES, PLANT_CLASSES } from "../data/labels";
import { CLASS_WEIGHTS } from "../data/weights";
import { scoreCarbs } from "./carbs";
import { scoreComposite } from "./composite";
import { scoreFattyAcids } from "./fattyAcids";
import { scoreFibre } from "./fibre";
import { ironCoefficient, scoreMicros } from "./micros";
import { scoreCatalog, scoreFood } from "./index";

describe("catalog contract", () => {
  it("covers every required class with at least two foods", () => {
    expect(() => assertCatalogCoverage()).not.toThrow();
    for (const foodClass of [...PLANT_CLASSES, ...ANIMAL_CLASSES]) {
      const n = FOODS.filter((food) => food.foodClass === foodClass).length;
      expect(n, foodClass).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps class weights summing to 1", () => {
    for (const [foodClass, weights] of Object.entries(CLASS_WEIGHTS)) {
      const sum = Object.values(weights).reduce((acc, value) => acc + value, 0);
      expect(sum, foodClass).toBeCloseTo(1, 6);
    }
  });
});

describe("bioavailability", () => {
  it("gives heme iron a higher coefficient than non-heme", () => {
    expect(ironCoefficient("heme")).toBeGreaterThan(ironCoefficient("nonheme"));
  });

  it("does not credit algal B12 analogs", () => {
    const nori = foodById("nori");
    const sardine = foodById("sardines-canned");
    expect(nori && sardine).toBeTruthy();
    if (!nori || !sardine) return;
    expect(nori.micros.b12Ug).toBeGreaterThan(0);
    expect(nori.micros.b12Bioactive).toBe(false);
    const noriFlags = scoreMicros(nori).flags;
    const analog = noriFlags.find((flag) => flag.key === "b12_bioactivity");
    expect(analog?.applied).toBe(true);
    expect(analog?.value).toBe(0);
    expect(scoreMicros(sardine).score).toBeGreaterThan(scoreMicros(nori).score);
  });

  it("applies the carotenoid variance factor on sweet potato", () => {
    const sweet = foodById("sweet-potato");
    expect(sweet).toBeDefined();
    if (!sweet) return;
    const flag = scoreMicros(sweet).flags.find((item) => item.key === "vitamin_a_form");
    expect(flag?.applied).toBe(true);
    expect(flag?.value).toBe(0.7);
  });
});

describe("carbohydrate split", () => {
  it("scores leafy passive carbs above boiled potato active starch", () => {
    const kale = foodById("kale-raw");
    const potato = foodById("potato-boiled");
    expect(kale && potato).toBeTruthy();
    if (!kale || !potato) return;
    expect(scoreCarbs(kale).score).toBeGreaterThan(scoreCarbs(potato).score);
  });

  it("holds animal foods at a neutral 50 instead of inventing fibre virtue", () => {
    const beef = foodById("beef-sirloin");
    expect(beef).toBeDefined();
    if (!beef) return;
    expect(scoreCarbs(beef).score).toBe(50);
  });
});

describe("fibre and fat", () => {
  it("records fibre as a plant advantage, not an animal defect to hide", () => {
    const kale = foodById("kale-raw");
    const beef = foodById("beef-sirloin");
    expect(kale && beef).toBeTruthy();
    if (!kale || !beef) return;
    expect(scoreFibre(kale).score).toBeGreaterThan(50);
    expect(scoreFibre(beef).score).toBeLessThan(5);
  });

  it("credits preformed EPA/DHA above ALA-only fat", () => {
    const salmon = foodById("salmon-atlantic");
    const tofu = foodById("tofu-firm");
    expect(salmon && tofu).toBeTruthy();
    if (!salmon || !tofu) return;
    const salmonFat = scoreFattyAcids(salmon);
    const tofuFat = scoreFattyAcids(tofu);
    expect(salmonFat.score).toBeGreaterThan(tofuFat.score);
    expect(tofuFat.flags.some((flag) => flag.key === "ala_to_lc_n3" && flag.applied)).toBe(true);
  });
});

describe("composite and tiers", () => {
  it("uses class weights rather than a global average", () => {
    const liver = foodById("beef-liver");
    expect(liver).toBeDefined();
    if (!liver) return;
    const scored = scoreFood(liver);
    const equal = scoreComposite(liver, {
      eaa: scored.eaa,
      fat: scored.fat,
      carb: scored.carb,
      micro: scored.micro,
      fibre: scored.fibre,
      residue: scored.residue,
      degradation: scored.degradation,
    });
    expect(scored.composite).toBeCloseTo(equal, 5);
    expect(CLASS_WEIGHTS.organs.micro).toBeGreaterThan(CLASS_WEIGHTS.organs.fibre);
  });

  it("assigns tiers within class, not across kingdoms", () => {
    const scored = scoreCatalog(FOODS);
    const leafTiers = FOODS.filter((food) => food.foodClass === "leafy_salad").map((food) => {
      const row = scored.find((item) => item.foodId === food.id);
      return row?.tier;
    });
    expect(leafTiers.every((tier) => tier)).toBe(true);
    const hasSOrA = leafTiers.some((tier) => tier === "S" || tier === "A");
    expect(hasSOrA).toBe(true);
  });
});
