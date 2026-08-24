import {
  FAO_2013_ADULT_MG_PER_G,
} from "../data/coefficients";
import { clamp01, round1, round2, round3, safeDiv } from "./math";
import type { EaaBreakdown, FoodRecord } from "./types";

export type EaaKey =
  | "his"
  | "ile"
  | "leu"
  | "lys"
  | "saa"
  | "aaa"
  | "thr"
  | "trp"
  | "val";

export const EAA_KEYS: readonly EaaKey[] = [
  "his",
  "ile",
  "leu",
  "lys",
  "saa",
  "aaa",
  "thr",
  "trp",
  "val",
];

export function aminoAcidAmounts(food: FoodRecord): Record<EaaKey, number> {
  const aa = food.aminoAcids;
  return {
    his: aa.his,
    ile: aa.ile,
    leu: aa.leu,
    lys: aa.lys,
    saa: aa.met + aa.cys,
    aaa: aa.phe + aa.tyr,
    thr: aa.thr,
    trp: aa.trp,
    val: aa.val,
  };
}

export function aminoAcidRatios(food: FoodRecord): Record<EaaKey, number> {
  const amounts = aminoAcidAmounts(food);
  const ref = FAO_2013_ADULT_MG_PER_G;
  return {
    his: safeDiv(amounts.his, ref.his),
    ile: safeDiv(amounts.ile, ref.ile),
    leu: safeDiv(amounts.leu, ref.leu),
    lys: safeDiv(amounts.lys, ref.lys),
    saa: safeDiv(amounts.saa, ref.saa),
    aaa: safeDiv(amounts.aaa, ref.aaa),
    thr: safeDiv(amounts.thr, ref.thr),
    trp: safeDiv(amounts.trp, ref.trp),
    val: safeDiv(amounts.val, ref.val),
  };
}

export function limitingAminoAcid(ratios: Record<EaaKey, number>): EaaKey {
  let worst: EaaKey = "his";
  let worstValue = Number.POSITIVE_INFINITY;
  for (const key of EAA_KEYS) {
    const value = ratios[key];
    if (value < worstValue) {
      worst = key;
      worstValue = value;
    }
  }
  return worst;
}

/**
 * Amino acid score = minimum untruncated ratio vs FAO 2013 adult pattern.
 * Plant proteins are typically < 1. This is never forced to 1.
 */
export function aminoAcidScore(food: FoodRecord): number {
  const ratios = aminoAcidRatios(food);
  return Math.min(...EAA_KEYS.map((key) => ratios[key]));
}

/**
 * DIAAS = AAS × true ileal digestibility. May exceed 1.0 for high-quality
 * animal proteins. Not truncated.
 */
export function diaas(food: FoodRecord): number {
  return aminoAcidScore(food) * clamp01(food.ilealDigestibility);
}

/**
 * PDCAAS-style: truncate AAS at 1.0, then apply digestibility.
 * Shown for comparison; the axis uses DIAAS + density, not PDCAAS alone.
 */
export function pdcaas(food: FoodRecord): number {
  return Math.min(1, aminoAcidScore(food)) * clamp01(food.ilealDigestibility);
}

/**
 * Protein density index: 20 g protein / 100 g food = 1.0.
 * Prevents low-protein plants with a decent AA pattern from ranking as
 * protein sources.
 */
export function proteinDensityIndex(food: FoodRecord): number {
  return clamp01(food.proteinG / 20);
}

/**
 * EAA axis:
 *   0.55 × min(1, AAS) + 0.30 × digestibility + 0.15 × proteinDensity
 * DIAAS is reported raw and is not capped to manufacture plant–animal
 * equivalence.
 */
export function scoreEaa(food: FoodRecord): EaaBreakdown {
  const ratios = aminoAcidRatios(food);
  const aas = aminoAcidScore(food);
  const diaasValue = diaas(food);
  const pdcaasValue = pdcaas(food);
  const limiting = limitingAminoAcid(ratios);
  const density = proteinDensityIndex(food);
  const completeness = Math.min(1, aas);
  const digestibility = clamp01(food.ilealDigestibility);
  const score = 100 * (0.55 * completeness + 0.3 * digestibility + 0.15 * density);

  const flags: string[] = [];
  if (aas < 1) {
    flags.push(`Incomplete protein: limiting ${limiting.toUpperCase()} (AAS ${round3(aas)})`);
  } else {
    flags.push("Complete protein versus FAO 2013 adult pattern");
  }
  if (diaasValue < 1 && aas >= 1) {
    flags.push("Complete pattern but digestibility < 1.0");
  }
  if (density < 0.25) {
    flags.push("Low protein density — completeness describes the protein that exists, not a useful protein serving");
  }

  return {
    score: round1(score),
    aas: round3(aas),
    diaas: round3(diaasValue),
    pdcaas: round3(pdcaasValue),
    limitingAa: limiting,
    ratios: Object.fromEntries(
      EAA_KEYS.map((key) => [key, round3(ratios[key])]),
    ),
    parts: {
      completeness: round2(completeness),
      digestibility: round2(digestibility),
      proteinDensity: round2(density),
    },
    flags,
  };
}
