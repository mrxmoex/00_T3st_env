import { describe, expect, it } from "vitest";
import { FOODS } from "@/data/foods";
import { assertStrictOntology } from "@/lib/ontology";
import { FOOD_CATEGORIES } from "@/lib/types";

describe("food ontology", () => {
  it("keeps eleven unequal categories and no vegetable average", () => {
    expect(FOOD_CATEGORIES).toHaveLength(11);
    expect(FOOD_CATEGORIES).not.toContain("vegetable");
    expect(FOOD_CATEGORIES).not.toContain("vegetables");
  });

  it("rejects collapsed plant aliases", () => {
    expect(() => assertStrictOntology("vegetable")).toThrow(/Collapsed category/);
    expect(() => assertStrictOntology("gemüse")).toThrow(/Collapsed category/);
  });

  it("seeds every ontology category with at least one food", () => {
    for (const category of FOOD_CATEGORIES) {
      expect(FOODS.some((food) => food.category === category)).toBe(true);
    }
  });

  it("does not treat sauerkraut and spinach as the same class", () => {
    const spinach = FOODS.find((food) => food.id === "spinach-raw");
    const kraut = FOODS.find((food) => food.id === "sauerkraut");
    expect(spinach?.category).toBe("leafy_greens");
    expect(kraut?.category).toBe("fermented");
  });
});
