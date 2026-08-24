export type Kingdom = "plant" | "animal";
export type Tier = "S" | "A" | "B" | "C" | "D";
export type DietaryPattern = "omnivore" | "vegan" | "low_residue";

export interface AxisScores {
  eaaCompletenessDigestibility: number;
  efaGlycerideProfile: number;
  carbohydrateType: number;
  micronutrientDensity: number;
  fibrePhytochemical: number;
  residueRisk: number;
  degradationSensitivity: number;
  composite: number;
  tier: Tier;
}

export interface ScoredFood {
  food: {
    id: string;
    name: string;
    kingdom: Kingdom;
    division: string;
    fermented?: boolean;
    sources: Array<{ id: string; name: string; url: string; verifiedAt: string }>;
  };
  scores: AxisScores;
  flags: string[];
}

export interface Meta {
  title: string;
  datasetVersion: string;
  coefficientVersion: string;
  lastVerificationDate: string;
  foodCount: number;
}

export type AxisKey =
  | "eaaCompletenessDigestibility"
  | "efaGlycerideProfile"
  | "carbohydrateType"
  | "micronutrientDensity"
  | "fibrePhytochemical"
  | "residueRisk"
  | "degradationSensitivity"
  | "composite";

export const AXIS_LABELS: Record<AxisKey, string> = {
  eaaCompletenessDigestibility: "EAA + Digestibility",
  efaGlycerideProfile: "EFA / Glyceride",
  carbohydrateType: "Carbs (active/passive)",
  micronutrientDensity: "Micronutrients",
  fibrePhytochemical: "Fibre / Phyto",
  residueRisk: "Residue safety",
  degradationSensitivity: "Stability",
  composite: "Composite",
};
