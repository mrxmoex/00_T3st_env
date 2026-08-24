import {
  CAROTENOID_RAE_UNCERTAINTY,
  DENSITY_REFS,
  IRON_HEME_ABSORPTION,
  IRON_NONHEME_ABSORPTION_BASE,
} from "./constants.js";
import { clamp, num, round } from "./math.js";

function zincAbsorptionCoeff(zincMg, phytateMg) {
  const molarPhytate = num(phytateMg) / 660.04;
  const molarZn = Math.max(num(zincMg) / 65.38, 1e-9);
  const ratio = molarPhytate / molarZn;
  let coeff;
  if (ratio > 15) coeff = 0.35;
  else if (ratio > 5) coeff = 0.5;
  else coeff = 0.85;
  return { coeff, phytateZincMolarRatio: round(ratio, 2) };
}

function ironAbsorption(micros, phytateMg) {
  const heme = num(micros.hemeIronMg);
  const nonheme = num(micros.nonhemeIronMg, Math.max(0, num(micros.ironMg) - heme));
  const total = Math.max(heme + nonheme, num(micros.ironMg));
  let nonhemeAbs = IRON_NONHEME_ABSORPTION_BASE;
  if (num(phytateMg) > 100) nonhemeAbs *= 0.6;
  if (num(micros.vitaminCMg) >= 25) nonhemeAbs = Math.min(0.16, nonhemeAbs * 1.4);
  const bioavailable = heme * IRON_HEME_ABSORPTION + nonheme * nonhemeAbs;
  const coeff = total > 0 ? bioavailable / total : 0;
  return {
    bioavailableIronMg: round(bioavailable, 3),
    ironAbsorptionCoeff: round(coeff, 4),
    ironMg: round(total, 3),
    hemeIronMg: heme,
    nonhemeIronMg: nonheme,
  };
}

export function scoreMicros(food) {
  const micros = food.micros ?? {};
  const phytateMg = num(food.antinutrients?.phytateMg);
  const iron = ironAbsorption(micros, phytateMg);
  const zinc = zincAbsorptionCoeff(num(micros.zincMg), phytateMg);
  const retinol = num(micros.retinolUg);
  const rae = num(micros.vitaminARaeUg);
  const carotenoidRae = Math.max(0, rae - retinol);
  const effectiveVitaminARaeUg = round(retinol + carotenoidRae * CAROTENOID_RAE_UNCERTAINTY, 2);

  const bioZn = num(micros.zincMg) * zinc.coeff;
  const kcal = Math.max(num(food.serving?.kcal, 50), 1);

  const coverages = [
    [iron.bioavailableIronMg / DENSITY_REFS.ironMg, 1.3],
    [bioZn / DENSITY_REFS.zincMg, 1.1],
    [effectiveVitaminARaeUg / DENSITY_REFS.vitaminARaeUg, 1.0],
    [num(micros.b12Ug) / DENSITY_REFS.b12Ug, 1.4],
    [num(micros.folateUg) / DENSITY_REFS.folateUg, 0.8],
    [num(micros.vitaminCMg) / DENSITY_REFS.vitaminCMg, 0.6],
    [num(micros.vitaminDUg) / DENSITY_REFS.vitaminDUg, 0.8],
    [num(micros.calciumMg) / DENSITY_REFS.calciumMg, 0.7],
    [num(micros.seleniumUg) / DENSITY_REFS.seleniumUg, 0.7],
    [num(micros.iodineUg) / DENSITY_REFS.iodineUg, 0.8],
    [num(micros.cholineMg) / DENSITY_REFS.cholineMg, 0.6],
    [num(micros.creatineG) > 0 ? 1 : 0, 0.35],
    [num(micros.taurineMg) > 0 ? 1 : 0, 0.25],
    [num(micros.carnosineMg) > 0 ? 1 : 0, 0.25],
  ];

  let weighted = 0;
  let weightSum = 0;
  for (const [coverage, weight] of coverages) {
    weighted += clamp(coverage, 0, 1.6) * weight;
    weightSum += weight;
  }
  const density = weighted / weightSum;
  const per100Kcal = density / (kcal / 100);
  const score = clamp((100 * Math.log(1 + per100Kcal * 1.8)) / Math.log(1 + 4.2), 0, 100);

  return {
    ...iron,
    zincAbsorptionCoeff: zinc.coeff,
    phytateZincMolarRatio: zinc.phytateZincMolarRatio,
    bioavailableZincMg: round(bioZn, 3),
    effectiveVitaminARaeUg,
    carotenoidUncertainty: CAROTENOID_RAE_UNCERTAINTY,
    densityPer100Kcal: round(per100Kcal, 4),
    score: round(score, 2),
    formula:
      "bio_iron = 0.25×heme + (0.08×phytate/vitC_adj)×non-heme; zinc coeff from phytate:Zn molar ratio; effective VA = retinol + 0.5×carotenoid RAE. Density is bioavailability-adjusted coverage per 100 kcal.",
  };
}
