import { describe, expect, it } from "vitest";
import { FOODS, requireFood } from "../data/catalog";
import { macroEnergyShares } from "./macroEnergy";

describe("macroEnergyShares", () => {
  it("splits salmon energy mostly between protein and fat", () => {
    const shares = macroEnergyShares(requireFood("salmon_raw"));
    expect(shares.protein).toBeGreaterThan(shares.carb);
    expect(shares.fat).toBeGreaterThan(shares.carb);
  });

  it("splits 100% of each food's energy into four parts", () => {
    for (const food of FOODS) {
      const shares = macroEnergyShares(food);
      expect(shares.protein + shares.fat + shares.carb + shares.other, food.id).toBeCloseTo(100, 6);
      expect(shares.other, food.id).toBeGreaterThanOrEqual(-1e-9);
    }
  });

  it("puts fibre energy in the remainder, not in the carbohydrate share", () => {
    const lentils = requireFood("lentils_boiled");
    expect(macroEnergyShares(lentils).other).toBeGreaterThan(0);
    const withMoreFibre = { ...lentils, carbs: { ...lentils.carbs, fibre: lentils.carbs.fibre + 10 } };
    expect(macroEnergyShares(withMoreFibre).carb).toBe(macroEnergyShares(lentils).carb);
  });
});
