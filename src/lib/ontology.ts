import {
  ANIMAL_CATEGORIES,
  FOOD_CATEGORIES,
  PLANT_CATEGORIES,
  type AnimalCategory,
  type FoodCategory,
  type Localized,
  type PlantCategory,
} from "./types";

export function isPlantCategory(category: FoodCategory): category is PlantCategory {
  return (PLANT_CATEGORIES as readonly string[]).includes(category);
}

export function isAnimalCategory(category: FoodCategory): category is AnimalCategory {
  return (ANIMAL_CATEGORIES as readonly string[]).includes(category);
}

export function assertKnownCategory(category: string): FoodCategory {
  if ((FOOD_CATEGORIES as readonly string[]).includes(category)) {
    return category as FoodCategory;
  }
  const _never: never = category as never;
  throw new Error(`Unknown food category: ${_never}`);
}

export const CATEGORY_LABELS: Record<FoodCategory, Localized> = {
  leafy_greens: { de: "Blattsalate / Grünzeug", en: "Leafy salads / greens" },
  legumes: { de: "Hülsenfrüchte / Bohnen", en: "Legumes / beans" },
  sprouts: { de: "Sprossen / Microgreens", en: "Sprouts / microgreens" },
  fermented: { de: "Fermentiertes", en: "Fermented" },
  mushrooms: { de: "Pilze / Fungi", en: "Mushrooms / fungi" },
  algae: { de: "Algen / Seetang", en: "Algae / seaweed" },
  muscle_meat: { de: "Muskelfleisch", en: "Muscle meats" },
  organs: { de: "Innereien", en: "Organs" },
  eggs: { de: "Eier", en: "Eggs" },
  dairy: { de: "Milchprodukte", en: "Dairy" },
  fish_seafood: { de: "Fisch / Meeresfrüchte", en: "Fish / seafood" },
};

export const CATEGORY_BLURB: Record<FoodCategory, Localized> = {
  leafy_greens: {
    de: "Hohe Mikronährstoffdichte pro kcal, variable Oxalat-/Phytatlast, hohe Blattoberfläche für Rückstände.",
    en: "High micronutrient density per kcal, variable oxalate/phytate, high leaf surface for residues.",
  },
  legumes: {
    de: "Protein- und Faserdichte; Lectine/Phytate; erfordern sachgerechte Zubereitung.",
    en: "Protein and fiber density; lectins/phytates; require proper preparation.",
  },
  sprouts: {
    de: "Oft erhöhtes Vitamin C und Bioverfügbarkeit, reduzierte Antinährstoffe — eigene Nische, kein Blattgemüse-Mittelwert.",
    en: "Often elevated vitamin C and bioavailability, reduced antinutrients — a distinct niche, not a leafy-green average.",
  },
  fermented: {
    de: "Probiotisches Potenzial, organische Säuren, mögliches K2, reduzierte Antinährstoffe.",
    en: "Probiotic potential, organic acids, possible K2, reduced antinutrients.",
  },
  mushrooms: {
    de: "Ergothionein, Beta-Glucane, D2 bei UV-Behandlung; eigenes Aminosäure- und Bioaktivprofil.",
    en: "Ergothioneine, beta-glucans, D2 if UV-treated; unique amino-acid and bioactive profile.",
  },
  algae: {
    de: "Mögliche Proteindichte, Mineraldichte, variables echtes B12/EPA — Analoga nicht mit Cobalamin gleichsetzen.",
    en: "Possible protein and mineral density, variable true B12/EPA — analogs are not cobalamin.",
  },
  muscle_meat: {
    de: "Hoher DIAAS, Häm-Eisen, Creatin/Carnosin; kein Ballaststoff, keine pflanzlichen Bioaktive.",
    en: "High DIAAS, heme iron, creatine/carnosine; no fiber, no plant bioactives.",
  },
  organs: {
    de: "Häufig dominant auf Mikronährstoff- und Retinol-Achsen; gleiche Bewertung, kein Sonderstatus.",
    en: "Often dominant on micronutrient and retinol axes; same matrix, no special pleading.",
  },
  eggs: {
    de: "Vollständiges Protein, Cholin, etwas DHA; Matrix mit hoher ilealer Verdaulichkeit.",
    en: "Complete protein, choline, some DHA; high ileal digestibility matrix.",
  },
  dairy: {
    de: "DIAAS oft >1.0, Calcium, vorgeformtes B12/Retinol; kein Ballaststoff.",
    en: "DIAAS often >1.0, calcium, preformed B12/retinol; no fiber.",
  },
  fish_seafood: {
    de: "Vorgeformtes EPA/DHA, B12, Jod/Selen; Achsenführend bei Fettsäurequalität.",
    en: "Preformed EPA/DHA, B12, iodine/selenium; often leads essential-fat quality.",
  },
};

export function kingdomOf(category: FoodCategory): "plant" | "animal" {
  if (isPlantCategory(category)) return "plant";
  if (isAnimalCategory(category)) return "animal";
  const _exhaustive: never = category;
  return _exhaustive;
}
