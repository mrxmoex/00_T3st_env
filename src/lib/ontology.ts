import { FOOD_CATEGORIES, type FoodCategory, type Kingdom } from "@/lib/types";

const COLLAPSED_ALIASES = [
  "vegetable",
  "vegetables",
  "gemuese",
  "gemüse",
  "plant",
  "vegan",
] as const;

export const CATEGORY_KINGDOM: Record<FoodCategory, Kingdom> = {
  leafy_greens: "plant",
  legumes: "plant",
  sprouts: "plant",
  fermented: "plant",
  mushrooms: "fungi",
  algae: "algae",
  muscle_meats: "animal",
  organs: "animal",
  eggs: "animal",
  dairy: "animal",
  fish_seafood: "animal",
};

export function isFoodCategory(value: string): value is FoodCategory {
  return (FOOD_CATEGORIES as readonly string[]).includes(value);
}

export function assertStrictOntology(category: string): FoodCategory {
  if (COLLAPSED_ALIASES.includes(category as (typeof COLLAPSED_ALIASES)[number])) {
    throw new Error(
      `Collapsed category "${category}" is not allowed. Plant foods are not a single vegetable average.`,
    );
  }
  if (!isFoodCategory(category)) {
    throw new Error(`Unknown food category: ${category}`);
  }
  return category;
}

export function kingdomOf(category: FoodCategory): Kingdom {
  return CATEGORY_KINGDOM[category];
}
