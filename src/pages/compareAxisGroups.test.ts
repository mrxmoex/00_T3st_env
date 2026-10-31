import { describe, expect, it } from "vitest";
import { AXIS_KEYS } from "../scoring/types";
import { DIGESTIBILITY_AXES, IMPORTANCE_AXES, KIND_AXES, SOURCING_AXES } from "./compareAxisGroups";

describe("compare axis groups", () => {
  it("places every score axis in exactly one group", () => {
    const grouped = [...KIND_AXES, ...IMPORTANCE_AXES, ...SOURCING_AXES, ...DIGESTIBILITY_AXES];
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual([...AXIS_KEYS].sort());
  });
});
