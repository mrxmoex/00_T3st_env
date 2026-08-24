import { ALA_TO_EPA_DHA_CONVERSION } from "./constants.js";
import { clamp, num, round } from "./math.js";

export function scoreLipids(food) {
  const lipids = food.lipids ?? {};
  const ala = num(lipids.alaG);
  const epa = num(lipids.epaG);
  const dha = num(lipids.dhaG);
  const effectiveLongChainN3G = round(epa + dha + ALA_TO_EPA_DHA_CONVERSION * ala, 4);
  const total = Math.max(num(lipids.totalG), 0);
  const omega3 = Math.max(num(lipids.omega3G), 0.0001);
  const omega6 = Math.max(num(lipids.omega6G), 0);
  const n6n3 = omega6 / omega3;
  const oddChain = num(lipids.oddChainG);
  const cla = num(lipids.claG);

  const n3Quality = clamp(effectiveLongChainN3G / 0.5, 0, 1) * 40;
  let ratioScore;
  if (n6n3 <= 4) ratioScore = 25;
  else if (n6n3 <= 10) ratioScore = 18;
  else ratioScore = clamp(25 - (n6n3 - 4) * 1.2, 4, 17);

  const oddClaBonus = clamp((oddChain + cla) * 50, 0, 12);
  const mufa = num(lipids.mufaG);
  const pufa = num(lipids.pufaG);
  const sfa = num(lipids.sfaG);
  const balance =
    total < 1
      ? 18
      : clamp(22 - Math.max(0, pufa / Math.max(total, 0.01) - 0.35) * 20, 8, 22) +
        clamp(mufa / Math.max(total, 0.01), 0, 0.5) * 6;

  let score;
  if (total < 1) {
    score = 50 + n3Quality * 0.25 + oddClaBonus * 0.2;
  } else {
    score = n3Quality + ratioScore + oddClaBonus + balance * 0.55;
  }

  return {
    effectiveLongChainN3G,
    n6n3: round(n6n3, 3),
    alaConversionUsed: ALA_TO_EPA_DHA_CONVERSION,
    oddChainG: oddChain,
    claG: cla,
    sfaG: sfa,
    mufaG: mufa,
    pufaG: pufa,
    score: round(clamp(score, 0, 100), 2),
    formula:
      "effective_LC_n3 = EPA + DHA + 0.08×ALA; score credits LC n-3, n-6/n-3, MUFA/SFA balance, and ruminant odd-chain + CLA. ALA is never treated as EPA/DHA.",
  };
}
