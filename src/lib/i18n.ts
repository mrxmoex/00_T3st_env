import type { AxisId, FoodCategory, Locale, Localized } from "./types";

export function t(text: Localized, locale: Locale): string {
  return text[locale];
}

export const UI = {
  appTitle: { de: "Du bist was du isst", en: "You are what you eat" },
  appName: { de: "Was du isst", en: "Was du isst" },
  tagline: {
    de: "Eine öffentliche Bewertungsmatrix. Keine Erzählung. Keine Paywall.",
    en: "A public evaluation matrix. No narrative. No paywall.",
  },
  navMatrix: { de: "Matrix", en: "Matrix" },
  navTiers: { de: "Stufen", en: "Tiers" },
  navCompare: { de: "Vergleich", en: "Compare" },
  navInvariants: { de: "Invarianten", en: "Invariants" },
  navSources: { de: "Quellen", en: "Sources" },
  filterAll: { de: "Alle Kategorien", en: "All categories" },
  filterPlant: { de: "Pflanzlich (unvermischt)", en: "Plant (unmerged)" },
  filterAnimal: { de: "Tierisch", en: "Animal" },
  sortCombined: { de: "Kombinierter Score", en: "Combined score" },
  raw: { de: "Roh", en: "Raw" },
  adjusted: { de: "Angepasst", en: "Adjusted" },
  compareHint: {
    de: "Zwei Lebensmittel. Dieselben Achsen. Trade-offs bleiben sichtbar.",
    en: "Two foods. The same axes. Trade-offs stay visible.",
  },
  pickA: { de: "Lebensmittel A", en: "Food A" },
  pickB: { de: "Lebensmittel B", en: "Food B" },
  multipliers: { de: "Multiplikatoren vor dem Ranking", en: "Multipliers before ranking" },
  completeness: { de: "Vollständigkeit", en: "Completeness" },
  bioavailability: { de: "Bioverfügbarkeit", en: "Bioavailability" },
  antinutrient: { de: "Antinährstoff-Penalty", en: "Anti-nutrient penalty" },
  residue: { de: "Rückstands-Penalty", en: "Residue penalty" },
  sourcesOnClaim: { de: "Quellen an diesem Claim", en: "Sources on this claim" },
  sparse: { de: "Daten dünn", en: "Data sparse" },
  contested: { de: "Umstritten", en: "Contested" },
  estimated: { de: "Geschätzt", en: "Estimated" },
  prepDep: { de: "Zubereitungsabhängig", en: "Preparation-dependent" },
  noLogin: {
    de: "Kernfunktionen ohne Konto. Keine Werbung für Extreme.",
    en: "Core functions without an account. No advocacy for extremes.",
  },
  tradeoffs: { de: "Trade-offs", en: "Trade-offs" },
  withinClass: { de: "in der Klasse", en: "in class" },
  acrossClasses: { de: "über Klassen", en: "across classes" },
  per100g: { de: "pro 100 g essbar", en: "per 100 g edible" },
  limiting: { de: "Limitierende AS", en: "Limiting AA" },
  method: { de: "Methode", en: "Method" },
  fdc: { de: "USDA FDC", en: "USDA FDC" },
  educational: {
    de: "Harte biochemische Invarianten — keine Meinungen.",
    en: "Hard biochemical invariants — not opinions.",
  },
  emptyCompare: {
    de: "Zwei Zeilen wählen.",
    en: "Choose two rows.",
  },
  heroBody: {
    de: "Interaktive Bewertung ungleicher Pflanzenkategorien und tierischer Lebensmittel auf sieben Achsen. Vollständigkeit und Bioverfügbarkeit greifen vor dem Ranking. Jeder Claim trägt eine Jahreszahl und eine Quelle.",
    en: "Interactive evaluation of unequal plant categories and animal foods on seven axes. Completeness and bioavailability apply before ranking. Every claim carries a year-stamped source.",
  },
  axisNote: {
    de: "Keine Einzelzahl reicht. Rohwerte und angepasste Werte stehen nebeneinander.",
    en: "No single number is enough. Raw and adjusted scores sit side by side.",
  },
} as const satisfies Record<string, Localized>;

export const AXIS_LABELS: Record<AxisId, Localized> = {
  nutrient_density: { de: "Nährstoffdichte", en: "Nutrient density" },
  protein_quality: { de: "Proteinqualität", en: "Protein quality" },
  efa_profile: { de: "Essenzielle Fettsäuren", en: "Essential fats" },
  carb_quality: { de: "Kohlenhydratqualität", en: "Carbohydrate quality" },
  bioavailability: { de: "Bioverfügbarkeit", en: "Bioavailability" },
  bioactives: { de: "Einzigartige Bioaktive", en: "Unique bioactives" },
  practical_efficiency: { de: "Praktische Effizienz", en: "Practical efficiency" },
};

export const AXIS_SHORT: Record<AxisId, Localized> = {
  nutrient_density: { de: "Dichte", en: "Density" },
  protein_quality: { de: "Protein", en: "Protein" },
  efa_profile: { de: "EFA", en: "EFA" },
  carb_quality: { de: "KH", en: "Carb" },
  bioavailability: { de: "BV", en: "BV" },
  bioactives: { de: "Bioaktiv", en: "Bioactive" },
  practical_efficiency: { de: "Praxis", en: "Practice" },
};

export function categoryFilterLabel(category: FoodCategory | "all" | "plant" | "animal", locale: Locale): string {
  switch (category) {
    case "all":
      return t(UI.filterAll, locale);
    case "plant":
      return t(UI.filterPlant, locale);
    case "animal":
      return t(UI.filterAnimal, locale);
    default:
      return category;
  }
}
