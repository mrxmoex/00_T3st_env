import type { Locale } from "@/lib/types";

export const defaultLocale: Locale = "de";
export const locales: Locale[] = ["de", "en"];

export const translations = {
  app: {
    title: {
      de: "Du bist was du isst",
      en: "You are what you eat",
    },
    subtitle: {
      de: "Multi-Achsen-Bewertungsmatrix für Lebensmittel — evidenzbasiert, ohne Ideologie",
      en: "Multi-axis food evaluation matrix — evidence-based, ideology-free",
    },
    tagline: {
      de: "Menge ohne Bioverfügbarkeit ist Rauschen. Vollständigkeit ohne Verdaulichkeit ist unvollständig.",
      en: "Quantity without bioavailability is noise. Completeness without digestibility is incomplete.",
    },
  },
  nav: {
    matrix: { de: "Matrix", en: "Matrix" },
    tiers: { de: "Tier-Listen", en: "Tier Lists" },
    compare: { de: "Vergleich", en: "Compare" },
    invariants: { de: "Invarianten", en: "Invariants" },
  },
  axes: {
    nutrient_density: { de: "Nährstoffdichte", en: "Nutrient Density" },
    protein_quality: { de: "Proteinqualität", en: "Protein Quality" },
    essential_fatty_acids: { de: "Essentielle Fettsäuren", en: "Essential Fatty Acids" },
    carbohydrate_quality: { de: "Kohlenhydratqualität", en: "Carbohydrate Quality" },
    bioavailability_antinutrients: { de: "Bioverfügbarkeit & Antinährstoffe", en: "Bioavailability & Anti-nutrients" },
    unique_bioactives: { de: "Einzigartige Bioaktive", en: "Unique Bioactives" },
    practical_efficiency: { de: "Praktische Effizienz", en: "Practical Efficiency" },
  },
  categories: {
    leafy_greens: { de: "Blattgemüse / Salate", en: "Leafy Greens / Salads" },
    legumes: { de: "Hülsenfrüchte / Bohnen", en: "Legumes / Beans" },
    sprouts_microgreens: { de: "Sprossen / Microgreens", en: "Sprouts / Microgreens" },
    fermented: { de: "Fermentiert", en: "Fermented" },
    mushrooms_fungi: { de: "Pilze / Fungi", en: "Mushrooms / Fungi" },
    algae_seaweed: { de: "Algen / Seetang", en: "Algae / Seaweed" },
    muscle_meat: { de: "Muskelfleisch", en: "Muscle Meat" },
    organs: { de: "Innereien", en: "Organs" },
    eggs: { de: "Eier", en: "Eggs" },
    dairy: { de: "Milchprodukte", en: "Dairy" },
    fish_seafood: { de: "Fisch / Meeresfrüchte", en: "Fish / Seafood" },
  },
  tiers: {
    S: { de: "S — Exzellent", en: "S — Excellent" },
    A: { de: "A — Sehr gut", en: "A — Very Good" },
    B: { de: "B — Gut", en: "B — Good" },
    C: { de: "C — Mäßig", en: "C — Moderate" },
    D: { de: "D — Schwach", en: "D — Weak" },
  },
  ui: {
    filterCategory: { de: "Kategorie filtern", en: "Filter category" },
    filterAxis: { de: "Achse sortieren", en: "Sort by axis" },
    allCategories: { de: "Alle Kategorien", en: "All categories" },
    allKingdoms: { de: "Alle", en: "All" },
    plant: { de: "Pflanzlich", en: "Plant" },
    animal: { de: "Tierisch", en: "Animal" },
    compareSelect: { de: "Lebensmittel zum Vergleich wählen", en: "Select foods to compare" },
    source: { de: "Quelle", en: "Source" },
    sources: { de: "Quellen", en: "Sources" },
    rawScore: { de: "Rohwert", en: "Raw" },
    adjustedScore: { de: "Angepasst", en: "Adjusted" },
    classTier: { de: "Klassen-Tier", en: "Class Tier" },
    globalTier: { de: "Global-Tier", en: "Global Tier" },
    tradeoffs: { de: "Trade-offs", en: "Trade-offs" },
    dataFlag: { de: "Datenqualität", en: "Data quality" },
    sparse: { de: "Spärlich", en: "Sparse" },
    contested: { de: "Umstritten", en: "Contested" },
    estimated: { de: "Geschätzt", en: "Estimated" },
    per100g: { de: "pro 100 g", en: "per 100 g" },
    noLogin: { de: "Kostenlos · Kein Login erforderlich", en: "Free · No login required" },
  },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(
  section: keyof typeof translations,
  key: string,
  locale: Locale,
): string {
  const group = translations[section] as Record<string, Record<Locale, string>>;
  return group[key]?.[locale] ?? key;
}

export function getAxisLabel(axis: string, locale: Locale): string {
  return t("axes", axis, locale);
}

export function getCategoryLabel(category: string, locale: Locale): string {
  return t("categories", category, locale);
}
