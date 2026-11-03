import { describe, expect, it } from "vitest";
import { AXIS_KEYS } from "../scoring/types";
import { AXIS_METHOD_ANCHOR, DIGESTIBILITY_AXES, IMPORTANCE_AXES, KIND_AXES, SOURCING_AXES } from "./compareAxisGroups";

describe("compare axis groups", () => {
  it("places every score axis in exactly one group", () => {
    const grouped = [...KIND_AXES, ...IMPORTANCE_AXES, ...SOURCING_AXES, ...DIGESTIBILITY_AXES];
    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual([...AXIS_KEYS].sort());
  });

  it("sends every scored axis to a method section", () => {
    expect(Object.keys(AXIS_METHOD_ANCHOR).sort()).toEqual([...AXIS_KEYS].sort());
    for (const href of Object.values(AXIS_METHOD_ANCHOR)) {
      expect(href.startsWith("/method#")).toBe(true);
    }
  });
});
