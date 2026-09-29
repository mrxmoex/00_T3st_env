import {
  ALA_TO_DHA_EFFICIENCY,
  ALA_TO_EPA_EFFICIENCY,
} from "../data/coefficients";
import type { LocalizedText } from "../i18n/locale";
import { clamp, clamp01, round1, round2, safeDiv } from "./math";
import { kingdomOf, type AxisBreakdown, type FoodRecord } from "./types";

export function longChainN3G(food: FoodRecord): number {
  return food.fattyAcids.omega3Epa + food.fattyAcids.omega3Dha;
}

/** DHA-equivalent after applying documented ALA conversion inefficiency. */
export function effectiveLongChainN3G(food: FoodRecord): number {
  const fa = food.fattyAcids;
  return (
    fa.omega3Epa +
    fa.omega3Dha +
    fa.omega3Ala * ALA_TO_DHA_EFFICIENCY
  );
}

export function n6ToN3Ratio(food: FoodRecord): number {
  const fa = food.fattyAcids;
  const n3 = fa.omega3Ala + fa.omega3Epa + fa.omega3Dha;
  const n6 = fa.omega6La + fa.omega6Aa;
  return safeDiv(n6, Math.max(n3, 0.01));
}

/**
 * EFA / glyceride axis.
 * Long-chain EPA/DHA dominate. ALA is credited only at conversion efficiency
 * (1% to DHA). Plant oils are not treated as marine-fat equivalents.
 * Odd-chain FA and CLA (ruminant) are a documented bonus, not a requirement.
 */
export function scoreEfa(food: FoodRecord): AxisBreakdown {
  const fa = food.fattyAcids;
  const totalFat = Math.max(food.fatG, fa.sfa + fa.mufa + fa.pufa);
  const flags: LocalizedText[] = [];

  const lc = effectiveLongChainN3G(food);
  const lcScore = clamp01(lc / 0.5);

  const n3 = fa.omega3Ala + fa.omega3Epa + fa.omega3Dha;
  const n6 = fa.omega6La + fa.omega6Aa;
  const ratio = n6ToN3Ratio(food);

  let ratioScore: number;
  if (n6 + n3 < 0.2) {
    ratioScore = 0.7;
    flags.push({
      en: "Very low fat: n-6/n-3 ratio is not informative",
      de: "Sehr fettarm: Das n-6/n-3-Verhältnis ist nicht aussagekräftig",
    });
  } else {
    ratioScore = clamp01(1 - (ratio - 2) / 20);
    flags.push({
      en: `n-6:n-3 ≈ ${round1(ratio)}:1 (better near ≤4:1, not a health claim)`,
      de: `n-6:n-3 ≈ ${round1(ratio)}:1 (besser nahe ≤4:1, keine Gesundheitsaussage)`,
    });
  }

  const mufaFrac = safeDiv(fa.mufa, Math.max(totalFat, 0.01));
  const sfaFrac = safeDiv(fa.sfa, Math.max(totalFat, 0.01));
  const quality = clamp01(0.45 + 0.35 * mufaFrac + 0.1 * (1 - Math.abs(sfaFrac - 0.35)));

  const oddBonus = clamp(((fa.oddChain ?? 0) + (fa.cla ?? 0)) / 2, 0, 0.1);

  let score: number;
  if (totalFat < 0.5) {
    score = 45;
    flags.push({
      en: "Essentially fat-free: no essential-fat contribution, not a fat-quality failure",
      de: "Praktisch fettfrei: kein Beitrag essentieller Fette, aber kein Mangel an Fettqualität",
    });
  } else {
    score = 100 * (0.45 * lcScore + 0.35 * ratioScore + 0.2 * quality) + 100 * oddBonus;
  }

  if (fa.omega3Epa + fa.omega3Dha < 0.02 && fa.omega3Ala > 0.05) {
    flags.push({
      en: `ALA-only n-3. Conversion coefficients: EPA ${ALA_TO_EPA_EFFICIENCY}, DHA ${ALA_TO_DHA_EFFICIENCY}. Not equivalent to preformed EPA/DHA.`,
      de: `Nur ALA als n-3. Umwandlungskoeffizienten: EPA ${ALA_TO_EPA_EFFICIENCY}, DHA ${ALA_TO_DHA_EFFICIENCY}. Nicht gleichwertig mit vorgeformtem EPA/DHA.`,
    });
  }
  if (fa.omega3Epa + fa.omega3Dha >= 0.3) {
    flags.push({
      en: "Contains preformed long-chain EPA/DHA",
      de: "Enthält vorgeformtes langkettiges EPA/DHA",
    });
  }
  if ((fa.oddChain ?? 0) + (fa.cla ?? 0) > 0.05) {
    flags.push({
      en: "Ruminant odd-chain / conjugated fatty acids present",
      de: "Ungeradzahlige / konjugierte Fettsäuren von Wiederkäuern vorhanden",
    });
  }
  if (kingdomOf(food.class) === "animal" && (fa.oddChain === null || fa.cla === null)) {
    flags.push({
      en: "Source does not report odd-chain fatty acids or CLA; the bonus counts only what is reported",
      de: "Die Quelle nennt keine ungeradzahligen Fettsäuren oder kein CLA; der Bonus zählt nur Berichtetes",
    });
  }

  return {
    score: round1(clamp(score, 0, 100)),
    parts: {
      longChainScore: round2(lcScore),
      ratioScore: round2(ratioScore),
      glycerideQuality: round2(quality),
      oddChainClaBonus: round2(oddBonus),
      effectiveDhaEqG: round2(lc),
    },
    flags,
  };
}
