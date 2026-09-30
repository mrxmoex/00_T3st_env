import type { Tier } from "./types";

export const TIER_THRESHOLDS = { S: 80, A: 65, B: 50, C: 35 } as const;

/**
 * Ultra-processed foods (NOVA 4) stay in tier D whatever their nutrient values:
 * their nutrients are not worth the processing unless food is scarce.
 */
export const ULTRA_PROCESSED_CEILING = TIER_THRESHOLDS.C - 0.1;

/**
 * S/A/B/C/D from the composite score. Applied within a class so a
 * high leafy composite is not compared as if it were a steak.
 */
export function tierFromScore(score: number): Tier {
  if (score >= TIER_THRESHOLDS.S) return "S";
  if (score >= TIER_THRESHOLDS.A) return "A";
  if (score >= TIER_THRESHOLDS.B) return "B";
  if (score >= TIER_THRESHOLDS.C) return "C";
  return "D";
}

export function compareByCompositeDesc(a: number, b: number): number {
  return b - a;
}
