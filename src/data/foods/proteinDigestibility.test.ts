import { describe, expect, it } from "vitest";
import { FRUIT_FOODS } from "./fruits";
import { GRAIN_FOODS } from "./grains";
import { NUT_SEED_FOODS } from "./nutsSeeds";
import { VEGETABLE_FOODS } from "./vegetables";

const SOURCED = [...FRUIT_FOODS, ...NUT_SEED_FOODS, ...GRAIN_FOODS, ...VEGETABLE_FOODS];

function percentages(text: string): number[] {
  return [...text.matchAll(/(\d+(?:\.\d+)?) %/g)].map((match) => Number(match[1]));
}

describe("protein digestibility sources", () => {
  it("links a study for every sourced food", () => {
    for (const food of SOURCED) {
      expect(food.sources.some((source) => source.url), `${food.id} links no study`).toBe(true);
    }
  });

  it("uses a percentage its source states", () => {
    for (const food of SOURCED) {
      const stated = food.sources.flatMap((source) => percentages(source.note ?? ""));
      const used = food.ilealDigestibility * 100;
      expect(
        stated.some((pct) => Math.abs(pct - used) < 0.06),
        `${food.id}: ${used.toFixed(1)} % is not in its sources (${stated.join(", ")})`,
      ).toBe(true);
    }
  });
});
