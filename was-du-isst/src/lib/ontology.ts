import type { CategoryId, Kingdom, PlantCategoryId } from "@/types/catalog";

export const PLANT_CATEGORY_IDS = [
  "leafy-greens",
  "legumes",
  "sprouts-microgreens",
  "fermented-plant",
  "mushrooms-fungi",
  "algae-seaweed",
] as const satisfies readonly PlantCategoryId[];

export const ANIMAL_CATEGORY_IDS = [
  "muscle-meats",
  "organs",
  "eggs",
  "dairy",
  "fish-seafood",
] as const;

export const ALL_CATEGORY_IDS = [
  ...PLANT_CATEGORY_IDS,
  ...ANIMAL_CATEGORY_IDS,
] as const satisfies readonly CategoryId[];

export function kingdomOf(category: CategoryId): Kingdom {
  switch (category) {
    case "leafy-greens":
    case "legumes":
    case "sprouts-microgreens":
    case "fermented-plant":
      return "plant";
    case "mushrooms-fungi":
      return "fungi";
    case "algae-seaweed":
      return "algae";
    case "muscle-meats":
    case "organs":
    case "eggs":
    case "dairy":
    case "fish-seafood":
      return "animal";
    default: {
      const exhaustive: never = category;
      return exhaustive;
    }
  }
}

export function isPlantSide(category: CategoryId): boolean {
  const kingdom = kingdomOf(category);
  return kingdom === "plant" || kingdom === "fungi" || kingdom === "algae";
}

export const AXIS_IDS = [
  "nutrientDensity",
  "proteinQuality",
  "efaProfile",
  "carbQuality",
  "bioavailability",
  "uniqueBioactives",
  "practicalEfficiency",
] as const;
