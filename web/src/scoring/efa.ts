import { COEFFICIENTS } from "../catalog/coefficients.ts";
import type { AxisBreakdown, Food } from "../types/domain.ts";
import { clamp, safeDiv } from "./scale.ts";

function n3Quality(food: Food): number {
  const { epa, dha, ala } = food.fattyAcids;
  const longChain = epa + dha;
  if (longChain >= 0.5) {
    return 1;
  }
  if (longChain >= 0.1) {
    return 0.75;
  }
  if (longChain >= 0.05) {
    return 0.55;
  }
  // ALA is not equivalent to EPA/DHA; conversion is explicitly inefficient.
  const impliedEpa = ala * COEFFICIENTS.alaToEpa;
  if (impliedEpa >= 0.03 || ala >= 0.3) {
    return 0.32;
  }
  if (ala >= 0.05) {
    return 0.18;
  }
  if (food.fatG < 0.5) {
    return 0.22;
  }
  return 0.08;
}

function ratioScore(food: Food): number {
  const n3 = food.fattyAcids.ala + food.fattyAcids.epa + food.fattyAcids.dha;
  const n6 = Math.max(food.fattyAcids.linoleic, 0);
  if (n3 + n6 < 0.04) {
    return 0.42;
  }
  const ratio = safeDiv(n6, Math.max(n3, 0.001));
  if (ratio <= 4) {
    return 1;
  }
  if (ratio <= 8) {
    return 0.7;
  }
  if (ratio <= 15) {
    return 0.4;
  }
  return 0.18;
}

function glycerideScore(food: Food): number {
  if (food.fatG < 0.5) {
    return 0.48;
  }
  const mufaShare = safeDiv(food.fattyAcids.mufa, food.fatG);
  const sfaShare = safeDiv(food.fattyAcids.sfa, food.fatG);
  const mufaTerm = clamp(mufaShare / 0.4, 0, 1);
  const sfaTerm = 1 - clamp((sfaShare - 0.42) / 0.5, 0, 1);
  return clamp(0.55 * mufaTerm + 0.45 * sfaTerm, 0, 1);
}

function specialFaScore(food: Food): number {
  const cla = clamp(food.fattyAcids.cla / 0.08, 0, 1);
  const odd = clamp(food.fattyAcids.oddChain / 0.15, 0, 1);
  return clamp(0.6 * cla + 0.4 * odd, 0, 1);
}

function stabilityScore(food: Food): number {
  if (food.fatG < 0.5) {
    return 0.7;
  }
  const pufaShare = safeDiv(food.fattyAcids.pufa, food.fatG);
  return clamp(1 - pufaShare * 0.65, 0.2, 1);
}

export function scoreEfa(food: Food): AxisBreakdown {
  const n3 = n3Quality(food);
  const ratio = ratioScore(food);
  const glyceride = glycerideScore(food);
  const special = specialFaScore(food);
  const stability = stabilityScore(food);
  const raw = 0.35 * n3 + 0.25 * ratio + 0.2 * glyceride + 0.1 * special + 0.1 * stability;
  return {
    axis: "efa_glyceride",
    score: clamp(raw * 100, 0, COEFFICIENTS.scoreCap),
    formulaId: "efa.v1",
    inputs: { n3, ratio, glyceride, special, stability },
    notes: [
      "Long-chain EPA/DHA outrank ALA. ALA is converted with published inefficiency coefficients.",
      "CLA and odd-chain fatty acids are ruminant/dairy bonuses and are flagged when estimated.",
    ],
  };
}
