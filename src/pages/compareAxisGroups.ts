import { BENEFIT_AXES, type AxisKey } from "../scoring/types";

/** Nutrient-class scores. Composite stands alone as the overall row; residue and stability sit in the need group. */
export const KIND_AXES = BENEFIT_AXES;
export const IMPORTANCE_AXES = ["composite"] as const satisfies readonly AxisKey[];
export const SOURCING_AXES = ["residue"] as const satisfies readonly AxisKey[];
export const DIGESTIBILITY_AXES = ["degradation"] as const satisfies readonly AxisKey[];

/** Method section that states how each scored axis is computed. */
export const AXIS_METHOD_ANCHOR: Record<AxisKey, string> = {
  eaa: "/method#eaa",
  efa: "/method#efa",
  carb: "/method#carb",
  micro: "/method#micros",
  fibre: "/method#fibre",
  residue: "/method#residue",
  degradation: "/method#degradation",
  composite: "/method#composite",
};

/**
 * Order of the compare-page axis table, including the gram rows that are not scores.
 * Residue, processing, data source, digestibility, and stability rows share one group: what reaches the body.
 */
export const COMPARE_GROUP_ORDER = ["kind", "general", "importance", "necessityImpact"] as const;
export type CompareGroup = (typeof COMPARE_GROUP_ORDER)[number];
