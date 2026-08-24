import { COEFFICIENTS } from "../catalog/coefficients.ts";
import { WHO_FAO_ADULT_MG_PER_G_PROTEIN } from "../catalog/who-fao-pattern.ts";
import type { EaaResult, Food } from "../types/domain.ts";
import { clamp, safeDiv } from "./scale.ts";

export type AminoScoreKey = keyof typeof WHO_FAO_ADULT_MG_PER_G_PROTEIN;

function mgPerGProtein(gramsPer100g: number, proteinG: number): number {
  return safeDiv(gramsPer100g * 1000, proteinG);
}

export function aminoAcidScores(food: Food): Record<AminoScoreKey, number> {
  const protein = food.proteinG;
  const aa = food.aminoAcids;
  const foodMg = {
    his: mgPerGProtein(aa.his, protein),
    ile: mgPerGProtein(aa.ile, protein),
    leu: mgPerGProtein(aa.leu, protein),
    lys: mgPerGProtein(aa.lys, protein),
    saa: mgPerGProtein(aa.met + aa.cys, protein),
    aaa: mgPerGProtein(aa.phe + aa.tyr, protein),
    thr: mgPerGProtein(aa.thr, protein),
    trp: mgPerGProtein(aa.trp, protein),
    val: mgPerGProtein(aa.val, protein),
  } as const;

  return {
    his: safeDiv(foodMg.his, WHO_FAO_ADULT_MG_PER_G_PROTEIN.his),
    ile: safeDiv(foodMg.ile, WHO_FAO_ADULT_MG_PER_G_PROTEIN.ile),
    leu: safeDiv(foodMg.leu, WHO_FAO_ADULT_MG_PER_G_PROTEIN.leu),
    lys: safeDiv(foodMg.lys, WHO_FAO_ADULT_MG_PER_G_PROTEIN.lys),
    saa: safeDiv(foodMg.saa, WHO_FAO_ADULT_MG_PER_G_PROTEIN.saa),
    aaa: safeDiv(foodMg.aaa, WHO_FAO_ADULT_MG_PER_G_PROTEIN.aaa),
    thr: safeDiv(foodMg.thr, WHO_FAO_ADULT_MG_PER_G_PROTEIN.thr),
    trp: safeDiv(foodMg.trp, WHO_FAO_ADULT_MG_PER_G_PROTEIN.trp),
    val: safeDiv(foodMg.val, WHO_FAO_ADULT_MG_PER_G_PROTEIN.val),
  };
}

export function limitingAminoAcid(scores: Record<AminoScoreKey, number>): AminoScoreKey {
  const keys = Object.keys(scores) as AminoScoreKey[];
  let limiting: AminoScoreKey = keys[0] ?? "lys";
  let min = Number.POSITIVE_INFINITY;
  for (const key of keys) {
    if (scores[key] < min) {
      min = scores[key];
      limiting = key;
    }
  }
  return limiting;
}

export function scoreEaa(food: Food): EaaResult {
  const scores = aminoAcidScores(food);
  const limiting = limitingAminoAcid(scores);
  const chemicalScore = Math.min(scores[limiting], COEFFICIENTS.aminoAcidScoreCap);
  const digestibility = food.quality.ilealDigestibility;
  const computedDiaasLike = chemicalScore * digestibility;
  const usedPublishedDiaas = food.quality.publishedDiaas !== null;
  const diaasLike = food.quality.publishedDiaas ?? computedDiaasLike;

  const allMeetPattern = (Object.keys(scores) as AminoScoreKey[]).every(
    (key) => scores[key] >= 1,
  );
  const publishedComplete =
    food.quality.publishedDiaas !== null &&
    food.quality.publishedDiaas >= COEFFICIENTS.completeDiaasFloor;

  // Hard biological constraint: plant proteins are not labelled complete.
  // Animal proteins are complete if digestibility is high and either the FDC
  // amino-acid panel meets the adult pattern or a published DIAAS is ≥ 1.00.
  const completeness =
    food.kingdom === "animal" &&
    digestibility >= COEFFICIENTS.completeDigestibilityFloor &&
    (allMeetPattern || publishedComplete)
      ? "complete"
      : "incomplete";

  return {
    completeness,
    limitingAminoAcid: limiting,
    aminoAcidScores: scores,
    chemicalScore,
    digestibility,
    diaasLike,
    usedPublishedDiaas,
    score: clamp(diaasLike * 100, 0, COEFFICIENTS.scoreCap),
  };
}
