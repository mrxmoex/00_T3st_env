import type { AxisScores, DivisionWeights, Tier } from "../types.js";
export declare function computeComposite(axes: Omit<AxisScores, "composite" | "tier">, weights: DivisionWeights): number;
export declare function tierFromComposite(composite: number): Tier;
