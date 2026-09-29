import { describe, expect, it } from "vitest";
import { BODY_STORAGE, CALCIUM_TABLE_GROUPS, calciumAbsorption } from "../data/absorption";
import {
  BIOACTIVE_COMPOUNDS,
  BIOACTIVE_SOURCES,
  BIOACTIVE_TABLE_KEYS,
  bioactiveMg,
  bioactiveValue,
} from "../data/bioactives";
import { FOODS, requireFood } from "../data/catalog";
import { DV_REFERENCE_ABSORPTION } from "../data/coefficients";
import { PROCESSING_EVIDENCE, classifiedProducts } from "../data/processing";
import { absorbableCalciumMg, absorbableIronMg, absorbableZincMg, microAmounts } from "./micros";
import { labileRetention, perGramDryMatter } from "./retention";
import { scoreFood } from "./scoreFood";
import { ULTRA_PROCESSED_CEILING, tierFromScore } from "./tiers";
import { MICRO_NUTRIENTS, isAnimalClass, isPlantClass } from "./types";

describe("bioactive compound index", () => {
  it("only names groups and foods that exist in the catalog", () => {
    const groups = new Set(FOODS.map((food) => food.group));
    const ids = new Set(FOODS.map((food) => food.id));
    for (const group of BIOACTIVE_TABLE_KEYS.groups) expect(groups.has(group), group).toBe(true);
    for (const id of BIOACTIVE_TABLE_KEYS.foods) expect(ids.has(id), id).toBe(true);
  });

  it("cites a known source for every value and every negative finding", () => {
    for (const food of FOODS) {
      for (const compound of BIOACTIVE_COMPOUNDS) {
        const value = bioactiveValue(food, compound);
        if (value.status === "value" || value.status === "notDetected") {
          expect(BIOACTIVE_SOURCES[value.source], `${food.id} ${compound}`).toBeDefined();
        }
        if (value.status === "value") {
          expect(value.mgPer100g, `${food.id} ${compound}`).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("does not expect muscle compounds in plants and fungi", () => {
    for (const food of FOODS.filter((item) => isPlantClass(item.class))) {
      for (const compound of ["creatine", "carnosine", "anserine"] as const) {
        expect(bioactiveValue(food, compound).status, `${food.id} ${compound}`).toBe("notExpected");
      }
    }
  });

  it("reports taurine as not detected in analysed plant groups, but has no data for fungi and algae", () => {
    expect(bioactiveValue(requireFood("lentils_boiled"), "taurine").status).toBe("notDetected");
    expect(bioactiveValue(requireFood("spinach_raw"), "taurine").status).toBe("notDetected");
    expect(bioactiveValue(requireFood("shiitake_raw"), "taurine").status).toBe("noData");
    expect(bioactiveValue(requireFood("nori_roasted"), "taurine").status).toBe("noData");
  });

  it("keeps glucosinolates to the cabbage family, including kale and rocket outside the cruciferous classes", () => {
    expect(bioactiveValue(requireFood("beef_mince_raw"), "glucosinolates").status).toBe("notExpected");
    expect(bioactiveValue(requireFood("spinach_raw"), "glucosinolates").status).toBe("notExpected");
    expect(bioactiveValue(requireFood("kale_raw"), "glucosinolates").status).toBe("value");
    expect(bioactiveValue(requireFood("rocket_raw"), "glucosinolates").status).toBe("noData");
    expect(bioactiveValue(requireFood("sauerkraut"), "glucosinolates").status).toBe("noData");
  });

  it("uses cooked measurements where the source has them and marks raw values on cooked foods", () => {
    const braised = bioactiveValue(requireFood("beef_mince_braised"), "taurine");
    expect(braised.status === "value" && braised.state).toBe("cooked");
    expect(bioactiveMg(requireFood("brussels_sprouts_boiled"), "glucosinolates")).toBeLessThan(
      bioactiveMg(requireFood("brussels_sprouts_raw"), "glucosinolates") ?? 0,
    );
    const friedChicken = bioactiveValue(requireFood("chicken_breast_fried"), "creatine");
    expect(friedChicken.status === "value" && friedChicken.rawValueForPreparedFood).toBe(true);
    const rawChicken = bioactiveValue(requireFood("chicken_breast_raw"), "creatine");
    expect(rawChicken.status === "value" && rawChicken.rawValueForPreparedFood).toBe(false);
  });

  it("scales ergothioneine from dry weight with each food's own water content", () => {
    const fresh = requireFood("shiitake_raw");
    const dried = requireFood("shiitake_dried");
    expect(bioactiveMg(fresh, "ergothioneine")).toBeCloseTo(0.92 * (100 - fresh.composition.waterG), 0);
    expect(bioactiveMg(dried, "ergothioneine") ?? 0).toBeGreaterThan(5 * (bioactiveMg(fresh, "ergothioneine") ?? 0));
  });

  it("indexes creatine for muscle and organ foods from sources, leaving gaps as no data", () => {
    expect(bioactiveMg(requireFood("herring_poached"), "creatine")).toBeGreaterThan(
      bioactiveMg(requireFood("cod_poached"), "creatine") ?? 0,
    );
    expect(bioactiveMg(requireFood("beef_liver_raw"), "creatine")).toBeLessThan(
      bioactiveMg(requireFood("beef_heart_braised"), "creatine") ?? 0,
    );
    expect(bioactiveValue(requireFood("turkey_breast_raw"), "creatine").status).toBe("noData");
    expect(bioactiveValue(requireFood("egg_boiled"), "creatine").status).toBe("noData");
  });
});

describe("availability instead of label amount", () => {
  it("names only calcium groups that exist in the catalog", () => {
    const groups = new Set(FOODS.map((food) => food.group));
    for (const group of CALCIUM_TABLE_GROUPS) expect(groups.has(group), group).toBe(true);
  });

  it("absorbs spinach calcium far worse than milk, kale, or broccoli calcium", () => {
    const spinach = requireFood("spinach_raw");
    const milk = requireFood("milk_whole");
    expect(absorbableCalciumMg(spinach)).toBeCloseTo(spinach.micros.calciumMg * 0.051, 5);
    expect(absorbableCalciumMg(milk)).toBeCloseTo(milk.micros.calciumMg * 0.321, 5);
    expect(calciumAbsorption(requireFood("kale_raw"))?.fraction).toBe(0.493);
    expect(calciumAbsorption(requireFood("broccoli_raw"))?.fraction).toBe(0.613);
    expect(calciumAbsorption(requireFood("chard_raw"))?.carriedOver).toBe(true);
    expect(absorbableCalciumMg(requireFood("potato_boiled"))).toBeNull();
  });

  it("counts iron, zinc, and calcium in Daily Value units of available nutrient", () => {
    const beef = requireFood("beef_mince_braised");
    const spinach = requireFood("spinach_raw");
    const beefAmounts = microAmounts(beef);
    expect(beefAmounts.iron).toBeCloseTo(absorbableIronMg(beef) / DV_REFERENCE_ABSORPTION.iron, 5);
    expect(beefAmounts.zinc).toBeCloseTo(absorbableZincMg(beef) / DV_REFERENCE_ABSORPTION.zinc, 5);
    expect(microAmounts(spinach).calcium).toBeLessThan(spinach.micros.calciumMg * 0.2);
    expect(microAmounts(requireFood("potato_boiled")).calcium).toBe(requireFood("potato_boiled").micros.calciumMg);
  });

  it("describes a body store for every scored micronutrient", () => {
    for (const nutrient of MICRO_NUTRIENTS) {
      expect(BODY_STORAGE[nutrient].site.en.length, nutrient).toBeGreaterThan(0);
    }
    expect(BODY_STORAGE.vitaminB12.store).toBe("years");
    expect(BODY_STORAGE.iron.store).toBe("years");
    expect(BODY_STORAGE.zinc.store).toBe("none");
    expect(BODY_STORAGE.thiamin.store).toBe("weeks");
  });
});

describe("processing burden", () => {
  it("keeps home preparations in NOVA 1 and marks canned, smoked, cheese, kraut, and tofu as NOVA 3", () => {
    for (const id of ["potato_boiled", "potato_mash", "sardine_grilled", "salmon_raw", "milk_whole", "egg_fried"]) {
      expect(requireFood(id).processing.nova, id).toBe(1);
    }
    for (const id of ["potato_canned", "salmon_smoked", "sardine_canned", "cheddar", "sauerkraut_stewed", "tofu"]) {
      expect(requireFood(id).processing.nova, id).toBe(3);
    }
    expect(requireFood("potato_mash_instant").processing.nova).toBe(4);
  });

  it("measures processing loss per gram of dry matter against the home-prepared form", () => {
    const canned = requireFood("potato_canned");
    const boiled = requireFood("potato_boiled");
    expect(perGramDryMatter(canned, "vitaminC") ?? 1).toBeLessThan(perGramDryMatter(boiled, "vitaminC") ?? 0);
    expect(canned.composition.sodiumMg).toBeGreaterThan(50 * boiled.composition.sodiumMg);
    expect(canned.processing.retention?.reference).toBe("potato_boiled");
    expect(canned.processing.retention?.fraction).toBeLessThan(0.5);
    expect(requireFood("potato_mash_instant").processing.retention?.reference).toBe("potato_mash");
    expect(requireFood("sardine_canned").processing.retention?.reference).toBe("sardine_grilled");
    expect(boiled.processing.retention).toBeUndefined();
  });

  it("uses the median so one outlying vitamin does not decide the retention", () => {
    const smoked = requireFood("salmon_smoked");
    const retention = labileRetention(smoked, requireFood("salmon_raw"));
    expect(retention).not.toBeNull();
    const ratios = Object.values(retention?.nutrients ?? {});
    expect(Math.min(...ratios)).toBeLessThan(0.5);
    expect(retention?.fraction).toBe(1);
  });

  it("scales the stability axis by retention, so canned potatoes rank below freshly boiled ones", () => {
    const canned = scoreFood(requireFood("potato_canned"));
    const boiled = scoreFood(requireFood("potato_boiled"));
    expect(canned.degradation.score).toBeLessThan(boiled.degradation.score * 0.5);
    expect(canned.composite).toBeLessThan(boiled.composite - 3);
    expect(canned.degradation.flags.some((flag) => flag.en.includes("Industrial processing kept"))).toBe(true);
  });

  it("caps ultra-processed foods in tier D whatever their nutrients", () => {
    const instant = scoreFood(requireFood("potato_mash_instant"));
    expect(instant.processing.nova).toBe(4);
    expect(instant.composite).toBeLessThanOrEqual(ULTRA_PROCESSED_CEILING);
    expect(instant.tier).toBe("D");
    expect(tierFromScore(ULTRA_PROCESSED_CEILING)).toBe("D");

    const egg = requireFood("egg_boiled");
    const asUltraProcessed = scoreFood({ ...egg, processing: { nova: 4 } });
    expect(scoreFood(egg).composite).toBeGreaterThan(ULTRA_PROCESSED_CEILING);
    expect(asUltraProcessed.processing.capped).toBe(true);
    expect(asUltraProcessed.processing.uncappedComposite).toBe(scoreFood(egg).composite);
    expect(asUltraProcessed.composite).toBe(ULTRA_PROCESSED_CEILING);
  });

  it("backs product-dependent NOVA groups with stored market counts", () => {
    expect(PROCESSING_EVIDENCE.retrieved).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const food of FOODS.filter((item) => item.processing.evidence)) {
      const category = food.processing.evidence;
      expect(category, food.id).toBeDefined();
      if (!category) continue;
      const stats = PROCESSING_EVIDENCE.categories[category].all;
      expect(classifiedProducts(stats), food.id).toBeGreaterThan(0);
      const majority = Math.max(stats.nova["1"], stats.nova["2"], stats.nova["3"], stats.nova["4"]);
      expect(stats.nova[`${food.processing.nova}`], `${food.id} follows the category majority`).toBe(majority);
    }
  });

  it("only applies retention to industrially processed foods", () => {
    for (const food of FOODS) {
      if (food.processing.retention) expect(food.processing.nova, food.id).toBeGreaterThanOrEqual(3);
      if (isAnimalClass(food.class) && food.processing.nova === 1) expect(food.processing.retention).toBeUndefined();
    }
  });
});
