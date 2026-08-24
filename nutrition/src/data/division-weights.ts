import type { Division, DivisionWeights } from "../types.js";

const DEFAULT: DivisionWeights = {
  eaaCompletenessDigestibility: 0.18,
  efaGlycerideProfile: 0.12,
  carbohydrateType: 0.1,
  micronutrientDensity: 0.22,
  fibrePhytochemical: 0.12,
  residueRisk: 0.12,
  degradationSensitivity: 0.08,
};

const WEIGHTS: Partial<Record<Division, DivisionWeights>> = {
  leafy_greens: {
    eaaCompletenessDigestibility: 0.08,
    efaGlycerideProfile: 0.1,
    carbohydrateType: 0.12,
    micronutrientDensity: 0.25,
    fibrePhytochemical: 0.2,
    residueRisk: 0.15,
    degradationSensitivity: 0.1,
  },
  legumes: {
    eaaCompletenessDigestibility: 0.14,
    efaGlycerideProfile: 0.1,
    carbohydrateType: 0.14,
    micronutrientDensity: 0.2,
    fibrePhytochemical: 0.16,
    residueRisk: 0.15,
    degradationSensitivity: 0.11,
  },
  sprouts: {
    eaaCompletenessDigestibility: 0.1,
    efaGlycerideProfile: 0.1,
    carbohydrateType: 0.1,
    micronutrientDensity: 0.22,
    fibrePhytochemical: 0.22,
    residueRisk: 0.14,
    degradationSensitivity: 0.14,
  },
  cruciferous_kraut: {
    eaaCompletenessDigestibility: 0.08,
    efaGlycerideProfile: 0.08,
    carbohydrateType: 0.1,
    micronutrientDensity: 0.2,
    fibrePhytochemical: 0.22,
    residueRisk: 0.16,
    degradationSensitivity: 0.16,
  },
  muscle_fish: {
    eaaCompletenessDigestibility: 0.2,
    efaGlycerideProfile: 0.22,
    carbohydrateType: 0.06,
    micronutrientDensity: 0.2,
    fibrePhytochemical: 0.04,
    residueRisk: 0.14,
    degradationSensitivity: 0.12,
  },
  organs: {
    eaaCompletenessDigestibility: 0.22,
    efaGlycerideProfile: 0.1,
    carbohydrateType: 0.06,
    micronutrientDensity: 0.3,
    fibrePhytochemical: 0.04,
    residueRisk: 0.12,
    degradationSensitivity: 0.1,
  },
  eggs: {
    eaaCompletenessDigestibility: 0.24,
    efaGlycerideProfile: 0.12,
    carbohydrateType: 0.08,
    micronutrientDensity: 0.22,
    fibrePhytochemical: 0.04,
    residueRisk: 0.14,
    degradationSensitivity: 0.12,
  },
};

export function getDivisionWeights(division: Division): DivisionWeights {
  const raw = WEIGHTS[division] ?? DEFAULT;
  const sum =
    raw.eaaCompletenessDigestibility +
    raw.efaGlycerideProfile +
    raw.carbohydrateType +
    raw.micronutrientDensity +
    raw.fibrePhytochemical +
    raw.residueRisk +
    raw.degradationSensitivity;
  if (Math.abs(sum - 1) < 0.001) return raw;
  return {
    eaaCompletenessDigestibility: raw.eaaCompletenessDigestibility / sum,
    efaGlycerideProfile: raw.efaGlycerideProfile / sum,
    carbohydrateType: raw.carbohydrateType / sum,
    micronutrientDensity: raw.micronutrientDensity / sum,
    fibrePhytochemical: raw.fibrePhytochemical / sum,
    residueRisk: raw.residueRisk / sum,
    degradationSensitivity: raw.degradationSensitivity / sum,
  };
}
