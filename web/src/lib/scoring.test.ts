import { describe, expect, it } from "vitest";
import { FOODS } from "@/data/foods";
import { INVARIANTS } from "@/data/invariants";
import { SOURCES } from "@/data/sources";
import { FOOD_CATEGORIES, type FoodCategory } from "@/lib/schema";
import { ALA_CONVERSION_EFFICIENCY, scoreCatalog, scoreFood } from "@/lib/scoring";

const catalog = scoreCatalog(FOODS);

function scored(id: string) {
  const item = catalog.find((entry) => entry.food.id === id);
  if (!item) {
    throw new Error(`missing ${id}`);
  }
  return item;
}

function axis(id: string, axisId: string): number {
  const item = scored(id);
  const found = item.axes.find((entry) => entry.axis === axisId);
  if (!found) {
    throw new Error(`missing axis ${axisId}`);
  }
  return found.score;
}

describe("ontology", () => {
  it("never collapses plants into a single vegetable category", () => {
    const plantCategories = new Set(
      FOODS.filter((food) => food.kingdom === "plant").map((food) => food.category),
    );
    expect(plantCategories.has("leafy_greens")).toBe(true);
    expect(plantCategories.has("legumes")).toBe(true);
    expect(plantCategories.has("sprouts")).toBe(true);
    expect(plantCategories.has("fermented")).toBe(true);
    expect(plantCategories.size).toBeGreaterThanOrEqual(4);
  });

  it("seeds every ontology class including animal sides", () => {
    const present = new Set(FOODS.map((food) => food.category));
    const required: FoodCategory[] = FOOD_CATEGORIES.filter(
      (category) => category !== "cereals_reference",
    );
    for (const category of required) {
      expect(present.has(category), category).toBe(true);
    }
  });

  it("keeps cereals as an explicit reference class", () => {
    const wheat = FOODS.find((food) => food.id === "whole-wheat-bread");
    expect(wheat?.referenceOnly).toBe(true);
    expect(wheat?.category).toBe("cereals_reference");
    expect(wheat?.proteinQuality.limitingAA).toBe("lys");
  });
});

describe("protein quality multipliers", () => {
  it("applies completeness before ranking so incomplete proteins cannot outrank complete ones on that axis", () => {
    const wheat = axis("whole-wheat-bread", "protein_quality");
    const egg = axis("egg-whole", "protein_quality");
    const milk = axis("milk-whole", "protein_quality");
    const lentils = axis("lentils-cooked", "protein_quality");
    expect(egg).toBeGreaterThan(wheat);
    expect(milk).toBeGreaterThan(lentils);
    expect(wheat).toBeLessThan(50);
  });

  it("marks cereals lysine-limited and legumes methionine/cysteine-limited", () => {
    expect(scored("whole-wheat-bread").food.proteinQuality.limitingAA).toBe("lys");
    expect(scored("lentils-cooked").food.proteinQuality.limitingAA).toBe("met_cys");
    expect(scored("soybeans-cooked").food.proteinQuality.limitingAA).toBe("met_cys");
    expect(scored("egg-whole").food.proteinQuality.limitingAA).toBeUndefined();
  });

  it("keeps unaugmented plant DIAAS below 1.0 except flagged proxies", () => {
    const plants = FOODS.filter(
      (food) => food.kingdom === "plant" && !food.referenceOnly,
    );
    for (const food of plants) {
      expect(food.proteinQuality.score.value).toBeLessThanOrEqual(0.91);
    }
  });
});

describe("bioavailability and absences", () => {
  it("scores heme matrices above high-phytate legumes on bioavailability", () => {
    expect(axis("beef-liver", "bioavailability")).toBeGreaterThan(
      axis("lentils-cooked", "bioavailability"),
    );
    expect(axis("beef-ground", "bioavailability")).toBeGreaterThan(
      axis("spinach-raw", "bioavailability"),
    );
  });

  it("does not credit spirulina analog B12 as preformed active", () => {
    expect(scored("spirulina").food.b12.status).toBe("analog_dominant");
    expect(
      scored("spirulina").food.absences.find((item) => item.compound === "b12")?.present,
    ).toBe(false);
    expect(scored("nori").food.b12.status).toBe("variable_true");
  });

  it("uses a conservative ALA conversion of 5%", () => {
    expect(ALA_CONVERSION_EFFICIENCY).toBe(0.05);
    expect(axis("salmon-atlantic", "efa_profile")).toBeGreaterThan(
      axis("soybeans-cooked", "efa_profile"),
    );
    expect(axis("wakame", "efa_profile")).toBeGreaterThan(axis("spinach-raw", "efa_profile"));
  });

  it("gives plants the fibre asset and animals a visible fibre gap", () => {
    expect(axis("lentils-cooked", "carbohydrate_quality")).toBeGreaterThan(
      axis("beef-ground", "carbohydrate_quality"),
    );
    expect(
      scored("beef-ground").food.absences.find((item) => item.compound === "fiber")?.present,
    ).toBe(false);
  });
});

describe("trade-offs remain visible", () => {
  it("does not let a single composite hide opposing axes", () => {
    const spinach = scored("spinach-raw");
    const liver = scored("beef-liver");
    expect(axis("spinach-raw", "nutrient_density")).toBeGreaterThan(50);
    expect(axis("beef-liver", "protein_quality")).toBeGreaterThan(
      axis("spinach-raw", "protein_quality"),
    );
    expect(axis("spinach-raw", "carbohydrate_quality")).toBeGreaterThan(
      axis("beef-liver", "carbohydrate_quality"),
    );
    expect(spinach.food.tradeoffs.de.length).toBeGreaterThan(20);
    expect(liver.food.tradeoffs.en.length).toBeGreaterThan(20);
  });

  it("keeps mushrooms, ferments, sprouts, and algae off a vegetable mean", () => {
    const ids = ["sauerkraut", "natto", "broccoli-sprouts", "uv-mushroom", "nori", "spirulina"];
    const categories = new Set(ids.map((id) => scored(id).food.category));
    expect(categories.size).toBe(4);
  });
});

describe("sources and invariants", () => {
  it("registers a source for every food claim id", () => {
    const ids = new Set(SOURCES.map((source) => source.id));
    for (const food of FOODS) {
      expect(ids.has(food.composition.energyKcal.sourceId)).toBe(true);
      expect(ids.has(food.proteinQuality.score.sourceId)).toBe(true);
      expect(food.composition.energyKcal.year).toBeGreaterThanOrEqual(2010);
    }
  });

  it("encodes all seven biochemical invariants with sources", () => {
    expect(INVARIANTS).toHaveLength(7);
    for (const invariant of INVARIANTS) {
      expect(invariant.sourceIds.length).toBeGreaterThan(0);
      expect(invariant.body.de.length).toBeGreaterThan(40);
    }
  });
});

describe("scoreFood totality", () => {
  it("emits seven axes for every food", () => {
    for (const food of FOODS) {
      const result = scoreFood(food);
      expect(result.axes).toHaveLength(7);
    }
  });
});
