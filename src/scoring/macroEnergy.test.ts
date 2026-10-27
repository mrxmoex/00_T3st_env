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
});
