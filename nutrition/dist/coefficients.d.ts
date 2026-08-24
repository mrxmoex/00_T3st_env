/**
 * Published bioavailability and reference coefficients.
 * Changelog: v0.1.0 — initial WHO/FAO-aligned defaults.
 */
import type { AminoAcidsMg } from "./types.js";
/** WHO/FAO adult reference pattern (mg/g protein) */
export declare const WHO_REFERENCE_AA: Record<keyof AminoAcidsMg, number>;
export declare const TIER_THRESHOLDS: {
    readonly S: 85;
    readonly A: 70;
    readonly B: 55;
    readonly C: 40;
};
export declare const OMEGA_TARGET_RATIO = 4;
export declare const IRON_BIOAVAILABILITY: {
    readonly heme: 0.25;
    readonly nonHeme: 0.15;
    readonly nonHemeHighPhytate: 0.08;
};
export declare const ZINC_BIOAVAILABILITY: {
    readonly animal: 0.4;
    readonly plant: 0.3;
    readonly plantHighPhytate: 0.2;
};
export declare const VITAMIN_A_BIOAVAILABILITY: {
    readonly retinol: 1;
    readonly carotenoid: 0.12;
};
