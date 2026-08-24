import { describe, expect, it } from "vitest";
import { FOODS } from "@/data/foods";
import { INVARIANTS } from "@/data/invariants";
import { getSource, SOURCES } from "@/data/sources";
import { CONFIDENCE } from "@/lib/types";

function walkSourced(value: unknown, path: string[] = []): Array<{ path: string; year: number; sourceId: string }> {
  if (value === null || value === undefined) return [];
  if (typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  if (
    typeof record.value === "number" &&
    typeof record.unit === "string" &&
    typeof record.sourceId === "string" &&
    typeof record.year === "number"
  ) {
    return [{ path: path.join("."), year: record.year, sourceId: record.sourceId }];
  }
  return Object.entries(record).flatMap(([key, child]) =>
    Array.isArray(child)
      ? child.flatMap((item, index) => walkSourced(item, [...path, `${key}[${index}]`]))
      : walkSourced(child, [...path, key]),
  );
}

describe("sourced schema", () => {
  it("gives every composition and quality number a source id and year", () => {
    for (const food of FOODS) {
      const values = walkSourced(food);
      expect(values.length).toBeGreaterThan(10);
      for (const item of values) {
        expect(item.year).toBeGreaterThanOrEqual(2013);
        expect(getSource(item.sourceId).id).toBe(item.sourceId);
      }
    }
  });

  it("flags spirulina B12 as analog, not true cobalamin", () => {
    const spirulina = FOODS.find((food) => food.id === "spirulina-dried");
    expect(spirulina?.flags).toContain("b12_analog");
    expect(spirulina?.composition.vitaminB12Ug.value).toBe(0);
  });

  it("keeps confidence inside the closed set", () => {
    for (const food of FOODS) {
      for (const item of walkSourced(food)) {
        const source = getSource(item.sourceId);
        expect(source.year).toBeGreaterThanOrEqual(2013);
      }
      expect(CONFIDENCE).toContain(food.composition.energyKcal.confidence);
    }
  });

  it("links every invariant to published sources", () => {
    expect(INVARIANTS).toHaveLength(7);
    for (const invariant of INVARIANTS) {
      expect(invariant.sourceIds.length).toBeGreaterThan(0);
      for (const id of invariant.sourceIds) {
        expect(SOURCES.some((source) => source.id === id)).toBe(true);
      }
    }
  });
});
