import { ALA_TO_LC_N3 } from "../data/coefficients";
import type { AxisBreakdown, Food } from "../data/types";
import { clamp, safeDiv } from "../lib/math";

export function scoreFattyAcids(food: Food): AxisBreakdown {
  const fa = food.fattyAcids;
  const flags = [
    {
      key: "ala_to_lc_n3",
      applied: fa.ala > 0,
      value: ALA_TO_LC_N3,
      reason: "ALA counted at 8% long-chain n-3 equivalent (conversion is inefficient)",
    },
  ];

  if (food.fatG < 1) {
    return {
      score: 48,
      flags,
      notes: [
        "Fat < 1 g/100 g — not a fatty-acid vehicle. Neutral 48, not a penalty.",
      ],
    };
  }

  const n3Long = fa.epa + fa.dha;
  const n3Effective = n3Long + fa.ala * ALA_TO_LC_N3;
  const n6 = fa.la + fa.aa;
  const ratio = safeDiv(n6, Math.max(n3Effective, 0.001), 99);
  const pufaLoad = n6 + n3Effective;

  const lcScore = n3Long > 0 ? clamp(20 + n3Long * 45, 0, 100) : 12;
  const alaCredit = clamp(fa.ala * ALA_TO_LC_N3 * 80, 0, 22);
  let ratioScore = 64;
  if (pufaLoad < 0.4) {
    ratioScore = 64;
  } else if (ratio <= 4) {
    ratioScore = 92;
  } else if (ratio <= 10) {
    ratioScore = 72;
  } else if (ratio <= 15) {
    ratioScore = 48;
  } else {
    ratioScore = 30;
  }

  const totalFa = fa.sfa + fa.mufa + fa.pufa;
  const mufaShare = safeDiv(fa.mufa, totalFa, 0);
  const pufaShare = safeDiv(fa.pufa, totalFa, 0);
  const glyceride =
    58 +
    clamp((mufaShare - 0.2) * 40, -8, 16) -
    (pufaShare > 0.45 ? (pufaShare - 0.45) * 40 : 0);

  const oddCla = clamp(fa.oddChain * 80 + fa.cla * 90, 0, 18);
  const efaPresent = fa.la >= 0.1 || fa.ala >= 0.05 || n3Long >= 0.02;
  const efaBonus = efaPresent ? 8 : 0;

  const raw =
    0.26 * lcScore +
    0.1 * alaCredit * (100 / 22) +
    0.2 * ratioScore +
    0.3 * clamp(glyceride, 0, 100) +
    0.14 * (48 + oddCla + efaBonus);

  const notes = [
    `EPA+DHA ${n3Long.toFixed(3)} g; ALA ${fa.ala.toFixed(3)} g → effective n-3 ${n3Effective.toFixed(3)} g.`,
    `n-6/n-3 effective ratio ${ratio.toFixed(1)}.`,
  ];
  if (fa.oddChain > 0 || fa.cla > 0) {
    notes.push(
      `Ruminant markers: odd-chain ${fa.oddChain.toFixed(2)} g, CLA ${fa.cla.toFixed(2)} g.`,
    );
  }
  if (n3Long === 0 && fa.ala > 0) {
    notes.push(
      "No preformed EPA/DHA. ALA conversion is a coefficient, not dietary equivalence.",
    );
  }

  return {
    score: clamp(raw, 0, 100),
    flags,
    notes,
  };
}
