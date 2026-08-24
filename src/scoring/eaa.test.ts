import { describe, expect, it } from "vitest";
import { FOODS, foodById } from "../data/catalog";
import { aminoAcidRatios, scoreEaa } from "./eaa";

describe("EAA completeness + digestibility", () => {
  it("marks egg and milk protein complete against FAO 2007", () => {
    const egg = foodById("egg-whole");
    const milk = foodById("milk-whole");
    expect(egg).toBeDefined();
    expect(milk).toBeDefined();
    if (!egg || !milk) return;
    expect(aminoAcidRatios(egg.aminoAcids).completeness).toBe(1);
    expect(aminoAcidRatios(milk.aminoAcids).completeness).toBe(1);
    expect(scoreEaa(egg).score).toBeGreaterThan(90);
    expect(scoreEaa(milk).score).toBeGreaterThan(90);
  });

  it("does not treat spirulina as complete — lysine is limiting", () => {
    const spirulina = foodById("spirulina");
    expect(spirulina).toBeDefined();
    if (!spirulina) return;
    const ratios = aminoAcidRatios(spirulina.aminoAcids);
    expect(ratios.limiting).toBe("lys");
    expect(ratios.completeness).toBeLessThan(1);
    expect(scoreEaa(spirulina).score).toBeLessThan(70);
  });

  it("does not equate tofu to egg", () => {
    const tofu = foodById("tofu-firm");
    const egg = foodById("egg-whole");
    expect(tofu && egg).toBeTruthy();
    if (!tofu || !egg) return;
    expect(scoreEaa(tofu).score).toBeLessThan(scoreEaa(egg).score);
  });

  it("refuses to rescue an incomplete protein with high digestibility", () => {
    const lentils = foodById("lentils-boiled");
    expect(lentils).toBeDefined();
    if (!lentils) return;
    const inflated = {
      ...lentils,
      proteinQuality: { ...lentils.proteinQuality, method: "DIAAS" as const, value: 1.18 },
    };
    const natural = scoreEaa(lentils);
    const boosted = scoreEaa(inflated);
    expect(aminoAcidRatios(lentils.aminoAcids).completeness).toBeLessThan(1);
    expect(boosted.score).toBeLessThanOrEqual(natural.score + 0.01);
    expect(boosted.score).toBeLessThan(90);
  });

  it("scores every catalog food in 0–100", () => {
    for (const food of FOODS) {
      const score = scoreEaa(food).score;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});
