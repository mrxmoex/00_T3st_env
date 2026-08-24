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

  it("does not grant a DIAAS surplus to an incomplete protein", () => {
    const spirulina = foodById("spirulina");
    const egg = foodById("egg-whole");
    expect(spirulina && egg).toBeTruthy();
    if (!spirulina || !egg) return;
    const inflated = {
      ...spirulina,
      proteinQuality: { ...spirulina.proteinQuality, method: "DIAAS" as const, value: 1.18 },
    };
    const ratios = aminoAcidRatios(spirulina.aminoAcids);
    const boosted = scoreEaa(inflated);
    const surplus = boosted.flags.find((flag) => flag.key === "diaas_surplus");
    expect(ratios.completeness).toBeLessThan(1);
    expect(surplus?.applied).toBe(false);
    expect(boosted.score).toBeCloseTo(100 * ratios.completeness, 5);
    expect(boosted.score).toBeLessThan(scoreEaa(egg).score);
  });

  it("scores every catalog food in 0–100", () => {
    for (const food of FOODS) {
      const score = scoreEaa(food).score;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});
