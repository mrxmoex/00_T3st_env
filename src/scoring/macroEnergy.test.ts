import { describe, expect, it } from "vitest";
import { FOODS } from "../data/catalog";
import { macroEnergyShares } from "./macroEnergy";

describe("macroEnergyShares", () => {
  it("sums to ~100% for salmon", () => {
    const salmon = FOODS.find((f) => f.id === "salmon_raw");
    expect(salmon).toBeDefined();
    const shares = macroEnergyShares(salmon!);
    expect(shares.protein + shares.fat + shares.carb).toBeCloseTo(100, 0);
    expect(shares.protein).toBeGreaterThan(shares.carb);
  });

  it("splits 100% of macro energy for every food in the catalog", () => {
    for (const food of FOODS) {
      const shares = macroEnergyShares(food);
      expect(shares.protein + shares.fat + shares.carb, food.id).toBeCloseTo(100, 6);
    }
  });

  it("leaves fibre out of the carbohydrate share", () => {
    const lentils = FOODS.find((f) => f.id === "lentils_boiled");
    expect(lentils).toBeDefined();
    const withMoreFibre = { ...lentils!, carbs: { ...lentils!.carbs, fibre: lentils!.carbs.fibre + 10 } };
    expect(macroEnergyShares(withMoreFibre)).toEqual(macroEnergyShares(lentils!));
  });
});
