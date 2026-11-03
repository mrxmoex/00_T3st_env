import { describe, expect, it } from "vitest";
import { DENSITY_SATURATION_PCT_DV } from "../data/coefficients";
import { FOODS } from "../data/catalog";
import { scoreCatalog } from "./scoreFood";
import { needFacts } from "./needFacts";

const cards = scoreCatalog(FOODS);

function factsFor(id: string) {
  const food = FOODS.find((item) => item.id === id);
  const card = cards.find((item) => item.foodId === id);
  if (!food || !card) throw new Error(`missing ${id}`);
  return { food, card, facts: needFacts(food, card) };
}

describe("need and impact facts", () => {
  it("counts a nutrient covered only at the Daily Value bar the score uses", () => {
    const { card, facts } = factsFor("egg_boiled");
    expect(facts.reported).toBeGreaterThan(0);
    expect(facts.covered.length).toBeLessThanOrEqual(facts.reported);
    for (const nutrient of facts.covered) {
      expect(card.micro.nutrients[nutrient].pctDvPer100kcal).toBeGreaterThanOrEqual(DENSITY_SATURATION_PCT_DV);
    }
    const below = Object.entries(card.micro.nutrients).filter(
      ([, density]) => density.pctDvPer100kcal !== null && density.pctDvPer100kcal < DENSITY_SATURATION_PCT_DV,
    );
    for (const [nutrient] of below) {
      expect(facts.covered).not.toContain(nutrient);
    }
  });

  it("lists long body stores only among covered nutrients", () => {
    const { facts } = factsFor("egg_boiled");
    expect(facts.stored.length).toBeGreaterThan(0);
    expect(facts.stored.every((nutrient) => facts.covered.includes(nutrient))).toBe(true);
    expect(facts.stored).toContain("vitaminB12");
  });

  it("keeps the adult upper limit on the nutrient that passes it", () => {
    expect(factsFor("brazil_nuts_raw").facts.upperLimits).toContain("selenium");
    expect(factsFor("apple_raw").facts.upperLimits).toEqual([]);
  });

  it("shows class exposure notes and stays quiet where none apply", () => {
    expect(factsFor("lentils_boiled").facts.exposure).toContain("glyphosate");
    expect(factsFor("milk_whole").facts.exposure).toEqual([]);
  });
});
