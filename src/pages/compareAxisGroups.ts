import { BENEFIT_AXES, type AxisKey } from "../scoring/types";

/** Nutrient-class scores. Composite is importance, residue is sourcing, stability is digestibility. */
export const KIND_AXES = BENEFIT_AXES;
export const IMPORTANCE_AXES = ["composite"] as const satisfies readonly AxisKey[];
export const SOURCING_AXES = ["residue"] as const satisfies readonly AxisKey[];
export const DIGESTIBILITY_AXES = ["degradation"] as const satisfies readonly AxisKey[];

/**
 * Order of the compare-page axis table, including the gram rows that are not scores.
 * Sourcing and digestibility/stability rows share one group: necessity, exposure, and what the body keeps.
 */
export const COMPARE_GROUP_ORDER = ["kind", "general", "importance", "necessityImpact"] as const;
export type CompareGroup = (typeof COMPARE_GROUP_ORDER)[number];
