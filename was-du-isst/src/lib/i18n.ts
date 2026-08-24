import type { Locale, Localized } from "@/types/catalog";

export const LOCALES: Locale[] = ["de", "en"];
export const DEFAULT_LOCALE: Locale = "de";

export function t(text: Localized, locale: Locale): string {
  return text[locale];
}

export const UI = {
  de: {
    title: "Was du isst",
    tagline: "Du bist was du isst — ohne Mittelwert, ohne Moral.",
    subtitle:
      "Eine öffentliche Multi-Achsen-Matrix. Pflanzenkategorien bleiben ungleich. Bioverfügbarkeit vor Ranking. Jede Zahl trägt Quelle und Jahr.",
    nav: {
      matrix: "Matrix",
      tiers: "Stufen",
      compare: "Vergleich",
      invariants: "Invarianten",
      sources: "Quellen",
    },
    axes: {
      nutrientDensity: "Nährstoffdichte",
      proteinQuality: "Proteinqualität",
      efaProfile: "Essenzielle Fettsäuren",
      carbQuality: "Kohlenhydratqualität",
      bioavailability: "Bioverfügbarkeit",
      uniqueBioactives: "Einzigartige Bioaktive",
      practicalEfficiency: "Praktische Effizienz",
    },
    axisHint: {
      nutrientDensity: "Mikronährstoffe + Ballaststoffe je kcal und je 100 g, nach Absorptionsfaktoren.",
      proteinQuality: "DIAAS bevorzugt; Vollständigkeitsfaktor vor dem Ranking.",
      efaProfile: "Präformiertes EPA/DHA zählt voll; ALA mit ≤10 % Konversion.",
      carbQuality: "Passiv (Ballast/RS) gegen aktiv (Zucker/Stärke). Neutral ohne beides.",
      bioavailability: "Häm, Phytat, Oxalat, Lektin, Rückstandsfläche — explizite Abzüge.",
      uniqueBioactives: "Nur dokumentierte Nischenstoffe, keine Superfood-Rhetorik.",
      practicalEfficiency: "Zubereitungsaufwand, Stabilität, Ausbeute nach typischer Zubereitung.",
    },
    free: "Frei · ohne Konto · ohne Paywall",
    compareSelect: "Zwei Lebensmittel",
    allCategories: "Alle Kategorien",
    sortBy: "Sortieren nach",
    combined: "Kombiniert (nicht hinreichend)",
    combinedNote:
      "Keine Einzelzahl reicht. Der Kombinationswert ist ein ungewichtetes Mittel der sieben justierten Achsen — nur zum Sortieren.",
    withinClass: "Stufe in der Klasse",
    acrossClass: "Stufe über Klassen",
    tradeoffs: "Trade-offs",
    sourcesOnClaim: "Quellen",
    year: "Jahr",
    confidence: "Datenlage",
    confidenceMap: {
      high: "hoch",
      moderate: "mittel",
      sparse: "dünn",
      contested: "umstritten",
    },
    limiting: "Limitierende Aminosäure",
    diaas: "DIAAS",
    per100g: "je 100 g essbarer Anteil",
    emptyCompare: "Zwei verschiedene Lebensmittel wählen.",
    ontology: "Ontologie — nicht zusammenlegen",
    seedNote: "Seed aus USDA SR Legacy + FAO/DIAAS + NIH/EFSA/DGE. Lücken sind sichtbar.",
  },
  en: {
    title: "Was du isst",
    tagline: "You are what you eat — no average, no sermon.",
    subtitle:
      "A public multi-axis matrix. Plant categories stay unequal. Bioavailability before ranking. Every number carries a source and year.",
    nav: {
      matrix: "Matrix",
      tiers: "Tiers",
      compare: "Compare",
      invariants: "Invariants",
      sources: "Sources",
    },
    axes: {
      nutrientDensity: "Nutrient density",
      proteinQuality: "Protein quality",
      efaProfile: "Essential fatty acids",
      carbQuality: "Carbohydrate quality",
      bioavailability: "Bioavailability",
      uniqueBioactives: "Unique bioactives",
      practicalEfficiency: "Practical efficiency",
    },
    axisHint: {
      nutrientDensity: "Micronutrients + fiber per kcal and per 100 g, after absorption factors.",
      proteinQuality: "DIAAS preferred; completeness multiplier applied before ranking.",
      efaProfile: "Preformed EPA/DHA counts fully; ALA at ≤10% conversion.",
      carbQuality: "Passive (fiber/RS) versus active (sugars/starch). Neutral when neither.",
      bioavailability: "Heme, phytate, oxalate, lectin, residue surface — explicit penalties.",
      uniqueBioactives: "Documented niche compounds only. No superfood rhetoric.",
      practicalEfficiency: "Prep burden, stability, yield after typical preparation.",
    },
    free: "Free · no account · no paywall",
    compareSelect: "Two foods",
    allCategories: "All categories",
    sortBy: "Sort by",
    combined: "Combined (not sufficient)",
    combinedNote:
      "No single number is enough. Combined is an unweighted mean of the seven adjusted axes — sort key only.",
    withinClass: "Tier within class",
    acrossClass: "Tier across classes",
    tradeoffs: "Trade-offs",
    sourcesOnClaim: "Sources",
    year: "Year",
    confidence: "Evidence",
    confidenceMap: {
      high: "high",
      moderate: "moderate",
      sparse: "sparse",
      contested: "contested",
    },
    limiting: "Limiting amino acid",
    diaas: "DIAAS",
    per100g: "per 100 g edible portion",
    emptyCompare: "Pick two different foods.",
    ontology: "Ontology — do not collapse",
    seedNote: "Seed from USDA SR Legacy + FAO/DIAAS + NIH/EFSA/DGE. Gaps stay visible.",
  },
} as const;

export type UiCopy = (typeof UI)[Locale];
