import { describe, expect, it } from "vitest";
import { FOODS } from "../data/catalog";
import { scoreCatalog } from "../scoring";
import { recommend } from "./engine";

const scores = scoreCatalog(FOODS);

describe("recommendation engine", () => {
  it("requires B12 for plant-only and never claims completeness", () => {
    const report = recommend({ pattern: "plant-only", foods: FOODS, scores });
    const b12 = report.gaps.find((gap) => gap.id === "b12");
    expect(b12?.severity).toBe("required");
    expect(report.headline.toLowerCase()).toContain("b12");
    expect(report.picks.every((pick) => FOODS.find((food) => food.id === pick.foodId)?.kingdom === "plant")).toBe(
      true,
    );
    expect(report.refusals.some((line) => line.includes("complete without"))).toBe(true);
  });

  it("keeps plant classes uncollapsed in plant-only picks", () => {
    const report = recommend({ pattern: "plant-only", foods: FOODS, scores });
    const classes = new Set(
      report.picks.map((pick) => FOODS.find((food) => food.id === pick.foodId)?.foodClass),
    );
    expect(classes.size).toBeGreaterThanOrEqual(8);
  });

  it("hybrid pairs animal protein with plant fibre without averaging EAA", () => {
    const report = recommend({ pattern: "hybrid", foods: FOODS, scores });
    expect(report.pairings.length).toBeGreaterThan(0);
    expect(report.pairings.some((pair) => pair.note.includes("Do not average") || pair.note.includes("does not complete"))).toBe(
      true,
    );
  });
});
