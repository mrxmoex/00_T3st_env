/**
 * Published bioavailability and reference coefficients.
 * Changelog: v0.1.0 — initial WHO/FAO-aligned defaults.
 */
import type { AminoAcidsMg } from "./types.js";

/** WHO/FAO adult reference pattern (mg/g protein) */
export const WHO_REFERENCE_AA: Record<keyof AminoAcidsMg, number> = {
  histidine: 15,
  isoleucine: 30,
  leucine: 59,
  lysine: 45,
  methionine: 22,
  phenylalanine: 38,
  threonine: 23,
  tryptophan: 6,
  valine: 39,
};

export const TIER_THRESHOLDS = {
  S: 85,
  A: 70,
  B: 55,
  C: 40,
} as const;

export const OMEGA_TARGET_RATIO = 4;

export const IRON_BIOAVAILABILITY = {
  heme: 0.25,
  nonHeme: 0.15,
  nonHemeHighPhytate: 0.08,
} as const;

export const ZINC_BIOAVAILABILITY = {
  animal: 0.4,
  plant: 0.3,
  plantHighPhytate: 0.2,
} as const;

export const VITAMIN_A_BIOAVAILABILITY = {
  retinol: 1.0,
  carotenoid: 0.12,
} as const;
