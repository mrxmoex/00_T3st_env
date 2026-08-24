import { assertNever } from "../lib/exhaustive";
import type { DietaryPattern, FoodClass, Kingdom, ScoreAxis, Tier } from "./types";

export function kingdomLabel(kingdom: Kingdom): string {
  switch (kingdom) {
    case "plant":
      return "Plant";
    case "animal":
      return "Animal";
    default: {
      const _exhaustive: never = kingdom;
      return assertNever(_exhaustive, "kingdom");
    }
  }
}

export function classLabel(foodClass: FoodClass): string {
  switch (foodClass) {
    case "leafy_salad":
      return "Leafy / salad greens";
    case "legumes":
      return "Legumes / beans";
    case "sprouts":
      return "Sprouts";
    case "cruciferous_kraut":
      return "Cruciferous / kraut";
    case "mushrooms":
      return "Mushrooms (Schroom)";
    case "algae":
      return "Algae / seaweed";
    case "roots_tubers":
      return "Roots & tubers";
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
      return assertNever(_exhaustive, "foodClass");
    }
  }
}

export function classShort(foodClass: FoodClass): string {
  switch (foodClass) {
    case "leafy_salad":
      return "Leafy";
    case "legumes":
      return "Legume";
    case "sprouts":
      return "Sprout";
    case "cruciferous_kraut":
      return "Crucifer";
    case "mushrooms":
      return "Schroom";
    case "algae":
      return "Algae";
    case "roots_tubers":
      return "Root";
    case "other_vegetables":
      return "Other veg";
    case "muscle_ruminant":
      return "Ruminant";
    case "muscle_monogastric":
      return "Monogastric";
    case "muscle_poultry":
      return "Poultry";
    case "muscle_fish":
      return "Fish";
    case "organs":
      return "Organ";
    case "eggs":
      return "Egg";
    case "dairy":
      return "Dairy";
    case "fermented_animal":
      return "Ferm. animal";
    default: {
      const _exhaustive: never = foodClass;
      return assertNever(_exhaustive, "foodClass");
    }
  }
}

export function axisLabel(axis: ScoreAxis): string {
  switch (axis) {
    case "eaa":
      return "EAA + digestibility";
    case "fat":
      return "Fatty acid / glyceride";
    case "carb":
      return "Carbohydrate type";
    case "micro":
      return "Micro density × bioavail.";
    case "fibre":
      return "Fibre / phytochemical";
    case "residue":
      return "Residue / contaminant";
    case "degradation":
      return "Post-harvest stability";
    case "composite":
      return "Composite";
    default: {
      const _exhaustive: never = axis;
      return assertNever(_exhaustive, "axis");
    }
  }
}

export function axisHint(axis: ScoreAxis): string {
  switch (axis) {
    case "eaa":
      return "Limiting amino acid × DIAAS/PDCAAS. Incomplete proteins stay incomplete.";
    case "fat":
      return "EPA/DHA, ALA conversion haircut, n-6/n-3, SFA/MUFA/PUFA, odd-chain/CLA.";
    case "carb":
      return "Active sugars/starches vs passive fibre/resistant starch. Not one number.";
    case "micro":
      return "Per-calorie density after heme, phytate-zinc, retinol vs carotenoid, B12 form.";
    case "fibre":
      return "Plant advantage. Animal foods score near zero — that is not a defect to hide.";
    case "residue":
      return "Surface area, systemic vs contact chemistry, monitoring rates, aquatic mercury.";
    case "degradation":
      return "Water-soluble vitamin loss, PUFA oxidation, cutting, heat, time.";
    case "composite":
      return "Class-weighted sum. Tiers are within-class, not across kingdoms.";
    default: {
      const _exhaustive: never = axis;
      return assertNever(_exhaustive, "axis");
    }
  }
}

export function patternLabel(pattern: DietaryPattern): string {
  switch (pattern) {
    case "plant-only":
      return "Plant-only";
    case "animal-inclusive":
      return "Animal-inclusive";
    case "hybrid":
      return "Hybrid";
    default: {
      const _exhaustive: never = pattern;
      return assertNever(_exhaustive, "pattern");
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
      return assertNever(_exhaustive, "tier");
    }
  }
}

export const PLANT_CLASSES: FoodClass[] = [
  "leafy_salad",
  "legumes",
  "sprouts",
  "cruciferous_kraut",
  "mushrooms",
  "algae",
  "roots_tubers",
  "other_vegetables",
];

export const ANIMAL_CLASSES: FoodClass[] = [
  "muscle_ruminant",
  "muscle_monogastric",
  "muscle_poultry",
  "muscle_fish",
  "organs",
  "eggs",
  "dairy",
  "fermented_animal",
];
