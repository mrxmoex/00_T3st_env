import { describe, expect, it } from "vitest";
import { radarViewBox } from "./RadarChart";

function box(count: number): { width: number; height: number } {
  const parts = radarViewBox(count).split(" ").map(Number);
  return { width: parts[2] ?? 0, height: parts[3] ?? 0 };
}

describe("radar view box", () => {
  it("crops a three-spoke chart below the old 340 px square", () => {
    const three = box(3);
    expect(three.height).toBeLessThan(300);
    expect(three.width).toBeGreaterThan(240);
  });

  it("gives a seven-spoke chart more height than a triangle", () => {
    expect(box(7).height).toBeGreaterThan(box(3).height);
  });
});
