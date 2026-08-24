import type { AxisId, FoodCategory, LocaleCode, LocaleText, Tier } from "@/lib/schema";

export const AXIS_LABELS: Record<AxisId, LocaleText> = {
  nutrient_density: { de: "Nährstoffdichte", en: "Nutrient density" },
  protein_quality: { de: "Proteinqualität", en: "Protein quality" },
  efa_profile: { de: "Essenzielle Fettsäuren", en: "Essential fatty acids" },
  carbohydrate_quality: { de: "Kohlenhydratqualität", en: "Carbohydrate quality" },
  bioavailability: { de: "Bioverfügbarkeit", en: "Bioavailability" },
  unique_bioactives: { de: "Funktionelle Stoffe", en: "Unique bioactives" },
  practical_efficiency: { de: "Praktische Effizienz", en: "Practical efficiency" },
};

export const CATEGORY_LABELS: Record<FoodCategory, LocaleText> = {
  leafy_greens: { de: "Blatt / Salat", en: "Leafy greens" },
  legumes: { de: "Hülsenfrüchte", en: "Legumes" },
  sprouts: { de: "Sprossen / Microgreens", en: "Sprouts / microgreens" },
  fermented: { de: "Fermentiert", en: "Fermented" },
  mushrooms: { de: "Pilze / Fungi", en: "Mushrooms / fungi" },
  algae: { de: "Algen", en: "Algae / seaweed" },
  muscle_meat: { de: "Muskelfleisch", en: "Muscle meats" },
  organs: { de: "Innereien", en: "Organs" },
  eggs: { de: "Eier", en: "Eggs" },
  dairy: { de: "Milchprodukte", en: "Dairy" },
  fish_seafood: { de: "Fisch / Meerestiere", en: "Fish / seafood" },
  cereals_reference: { de: "Getreide (Referenz)", en: "Cereals (reference)" },
};

export const TIER_LABELS: Record<Tier, LocaleText> = {
  S: { de: "S — Spitze der Achse", en: "S — axis peak" },
  A: { de: "A — hoch", en: "A — high" },
  B: { de: "B — mittel", en: "B — mid" },
  C: { de: "C — schwach", en: "C — weak" },
  D: { de: "D — Lücke", en: "D — gap" },
};

export const UI = {
  title: { de: "Du bist was du isst", en: "Du bist was du isst" },
  subtitle: {
    de: "Nahrungsmatrix — Menge ohne Bioverfügbarkeit ist Rauschen.",
    en: "Food matrix — quantity without bioavailability is noise.",
  },
  matrix: { de: "Matrix", en: "Matrix" },
  compare: { de: "Vergleich", en: "Compare" },
  invariants: { de: "Invarianten", en: "Invariants" },
  sources: { de: "Quellen", en: "Sources" },
  food: { de: "Lebensmittel", en: "Food" },
  search: { de: "Suchen…", en: "Search…" },
  allClasses: { de: "Alle Klassen", en: "All classes" },
  includeReference: { de: "Getreide-Referenz", en: "Cereal reference" },
  sortBy: { de: "Sortieren", en: "Sort by" },
  composite: { de: "Ungewichtetes Mittel", en: "Unweighted mean" },
  compositeNote: {
    de: "Keine Einzelzahl reicht. Das Mittel ist nur ein Sortierschlüssel.",
    en: "No single number is sufficient. The mean is only a sort key.",
  },
  tierOverall: { de: "Tier gesamt", en: "Overall tier" },
  tierInClass: { de: "Tier in Klasse", en: "Tier in class" },
  tradeoff: { de: "Zielkonflikt", en: "Trade-off" },
  selectCompare: { de: "Zwei Lebensmittel wählen", en: "Select two foods" },
  vs: { de: "gegen", en: "vs" },
  fdc: { de: "USDA FDC", en: "USDA FDC" },
  sparse: { de: "dünne Daten", en: "sparse data" },
  contested: { de: "umstritten", en: "contested" },
  freeNote: {
    de: "Frei, öffentlich, ohne Konto. Keine Diät-Werbung.",
    en: "Free, public, no account. No diet advocacy.",
  },
  plantSide: { de: "Pflanze / Pilz / Alge", en: "Plant / fungus / alga" },
  animalSide: { de: "Tier", en: "Animal" },
  apply: { de: "Anwenden", en: "Apply" },
  emptyS: {
    de: "S bleibt leer: kein Lebensmittel ist auf allen Achsen vollständig. Das ist die Aussage, nicht ein Fehler.",
    en: "S stays empty: no food is complete on every axis. That is the finding, not a defect.",
  },
  presence: { de: "Anwesenheit / Abwesenheit", en: "Presence / absence" },
} as const;

export function t(text: LocaleText, locale: LocaleCode): string {
  return text[locale];
}

export function otherLocale(locale: LocaleCode): LocaleCode {
  return locale === "de" ? "en" : "de";
}
