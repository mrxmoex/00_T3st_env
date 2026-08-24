import type { Tier } from "./types";

/**
 * S/A/B/C/D from the composite score. Applied within a class so a
 * high leafy composite is not compared as if it were a steak.
 */
export function tierFromScore(score: number): Tier {
  if (score >= 80) return "S";
  if (score >= 65) return "A";
  if (score >= 50) return "B";
  if (score >= 35) return "C";
  return "D";
}

export function compareByCompositeDesc(a: number, b: number): number {
  return b - a;
}
