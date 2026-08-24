import type {
  DietaryPattern,
  FoodClass,
  Kingdom,
  ScoreAxis,
  Tier,
  ValueFlag,
} from "../types/domain.ts";

export function foodClassLabel(foodClass: FoodClass): string {
  switch (foodClass) {
    case "leafy_salad":
      return "Leafy / Salad";
    case "legumes_beans":
      return "Legumes / Beans";
    case "sprouts":
      return "Sprouts";
    case "cruciferous_kraut":
      return "Cruciferous / Kraut";
    case "mushrooms":
      return "Mushrooms";
    case "algae_seaweed":
      return "Algae / Seaweed";
    case "roots_tubers":
      return "Roots & Tubers";
    case "other_vegetables":
      return "Other vegetables";
    case "muscle_ruminant":
      return "Muscle — ruminant";
    case "muscle_monogastric":
      return "Muscle — monogastric";
    case "muscle_poultry":
      return "Muscle — poultry";
    case "muscle_fish":
      return "Muscle — fish";
    case "organs":
      return "Organs";
    case "eggs":
      return "Eggs";
    case "dairy":
      return "Dairy";
    case "fermented_animal":
      return "Fermented animal";
    default: {
      const _exhaustive: never = foodClass;
      return _exhaustive;
    }
  }
}

export function kingdomLabel(kingdom: Kingdom): string {
  switch (kingdom) {
    case "plant":
      return "Plant";
    case "animal":
      return "Animal";
    default: {
      const _exhaustive: never = kingdom;
      return _exhaustive;
    }
  }
}

export function axisLabel(axis: ScoreAxis): string {
  switch (axis) {
    case "eaa_digestibility":
      return "EAA + digestibility";
    case "efa_glyceride":
      return "EFA / glyceride";
    case "carb_type":
      return "Carb type";
    case "micronutrient_bioavail":
      return "Micros + bioavailability";
    case "fibre_phyto":
      return "Fibre / phytochemicals";
    case "residue_risk":
      return "Residue / contaminant";
    case "degradation":
      return "Degradation stability";
    case "composite":
      return "EVN composite";
    default: {
      const _exhaustive: never = axis;
      return _exhaustive;
    }
  }
}

export function axisShort(axis: ScoreAxis): string {
  switch (axis) {
    case "eaa_digestibility":
      return "EAA";
    case "efa_glyceride":
      return "EFA";
    case "carb_type":
      return "Carb";
    case "micronutrient_bioavail":
      return "Micro";
    case "fibre_phyto":
      return "Phyto";
    case "residue_risk":
      return "Residue";
    case "degradation":
      return "Stable";
    case "composite":
      return "EVN";
    default: {
      const _exhaustive: never = axis;
      return _exhaustive;
    }
  }
}

export function patternLabel(pattern: DietaryPattern): string {
  switch (pattern) {
    case "plant_only":
      return "Plant-only";
    case "animal_inclusive":
      return "Animal-inclusive";
    case "hybrid":
      return "Hybrid";
    default: {
      const _exhaustive: never = pattern;
      return _exhaustive;
    }
  }
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case "S":
    case "A":
    case "B":
    case "C":
    case "D":
      return tier;
    default: {
      const _exhaustive: never = tier;
      return _exhaustive;
    }
  }
}

export function valueFlagLabel(flag: ValueFlag): string {
  switch (flag) {
    case "measured":
      return "Measured (FDC / table)";
    case "derived":
      return "Derived from measured fields";
    case "estimate":
      return "Estimate — not a lab value";
    case "literature":
      return "Literature coefficient";
    default: {
      const _exhaustive: never = flag;
      return _exhaustive;
    }
  }
}

export const SCORE_AXES: readonly ScoreAxis[] = [
  "eaa_digestibility",
  "efa_glyceride",
  "carb_type",
  "micronutrient_bioavail",
  "fibre_phyto",
  "residue_risk",
  "degradation",
  "composite",
];

export const PLANT_CLASSES: readonly FoodClass[] = [
  "leafy_salad",
  "legumes_beans",
  "sprouts",
  "cruciferous_kraut",
  "mushrooms",
  "algae_seaweed",
  "roots_tubers",
  "other_vegetables",
];

export const ANIMAL_CLASSES: readonly FoodClass[] = [
  "muscle_ruminant",
  "muscle_monogastric",
  "muscle_poultry",
  "muscle_fish",
  "organs",
  "eggs",
  "dairy",
  "fermented_animal",
];
