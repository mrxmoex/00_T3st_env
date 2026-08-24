import { AXES, FOOD_CATEGORIES, type AxisId, type FoodCategory, type Locale } from "@/lib/types";

export const DICT = {
  en: {
    brand: "Du bist was du isst",
    tagline: "Quantity without bioavailability is noise.",
    subtitle: "A public multi-axis food matrix. No login. No average vegetable.",
    nav: {
      matrix: "Matrix",
      tiers: "Tiers",
      compare: "Compare",
      invariants: "Invariants",
      sources: "Sources",
    },
    homeLead:
      "Eleven food classes, seven axes, explicit penalties. Completeness and absorption are applied before ranking. The system does not advocate a diet. It surfaces trade-offs.",
    openMatrix: "Open the matrix",
    openCompare: "Compare foods",
    search: "Search foods",
    allCategories: "All classes",
    sortBy: "Sort by",
    combined: "Combined (adjusted)",
    withinClass: "Within class",
    acrossClasses: "Across classes",
    selectFood: "Select a food",
    versus: "versus",
    raw: "Raw",
    adjusted: "Adjusted",
    sources: "Sources",
    year: "Year",
    fdc: "USDA FDC",
    flags: "Flags",
    tradeoffs: "Trade-off",
    prep: "Preparation",
    residues: "Residues",
    limiting: "Limiting amino acid",
    diaas: "DIAAS",
    pdcaas: "PDCAAS fallback",
    per100g: "per 100 g edible",
    noLogin: "Core functions require no account.",
    methodology: "Scoring applies completeness and bioavailability multipliers before the geometric mean. No single number is sufficient.",
    sparse: "Sparse or contested data is marked on the value.",
  },
  de: {
    brand: "Du bist was du isst",
    tagline: "Menge ohne Bioverfügbarkeit ist Rauschen.",
    subtitle: "Öffentliche Mehrachsen-Lebensmittelmatrix. Kein Login. Kein Gemüsedurchschnitt.",
    nav: {
      matrix: "Matrix",
      tiers: "Stufen",
      compare: "Vergleich",
      invariants: "Invarianten",
      sources: "Quellen",
    },
    homeLead:
      "Elf Lebensmittelklassen, sieben Achsen, explizite Abzüge. Vollständigkeit und Absorption wirken vor dem Ranking. Das System wirbt für keine Diät. Es zeigt Zielkonflikte.",
    openMatrix: "Matrix öffnen",
    openCompare: "Lebensmittel vergleichen",
    search: "Lebensmittel suchen",
    allCategories: "Alle Klassen",
    sortBy: "Sortieren nach",
    combined: "Kombiniert (adjustiert)",
    withinClass: "Innerhalb der Klasse",
    acrossClasses: "Über Klassen",
    selectFood: "Lebensmittel wählen",
    versus: "gegen",
    raw: "Roh",
    adjusted: "Adjustiert",
    sources: "Quellen",
    year: "Jahr",
    fdc: "USDA FDC",
    flags: "Markierungen",
    tradeoffs: "Zielkonflikt",
    prep: "Zubereitung",
    residues: "Rückstände",
    limiting: "Limitierende Aminosäure",
    diaas: "DIAAS",
    pdcaas: "PDCAAS-Rückfall",
    per100g: "je 100 g essbarer Anteil",
    noLogin: "Kernfunktionen brauchen kein Konto.",
    methodology:
      "Das Scoring wendet Vollständigkeits- und Bioverfügbarkeitsfaktoren vor dem geometrischen Mittel an. Eine Zahl reicht nicht.",
    sparse: "Dünne oder umstrittene Daten sind am Wert markiert.",
  },
} as const;

export const AXIS_LABEL: Record<Locale, Record<AxisId, string>> = {
  en: {
    nutrientDensity: "Nutrient density",
    proteinQuality: "Protein quality",
    efaProfile: "Fatty-acid profile",
    carbohydrateQuality: "Carbohydrate quality",
    bioavailability: "Bioavailability",
    uniqueBioactives: "Unique bioactives",
    practicalEfficiency: "Practical efficiency",
  },
  de: {
    nutrientDensity: "Nährstoffdichte",
    proteinQuality: "Proteinqualität",
    efaProfile: "Fettsäureprofil",
    carbohydrateQuality: "Kohlenhydratqualität",
    bioavailability: "Bioverfügbarkeit",
    uniqueBioactives: "Eigene Bioaktive",
    practicalEfficiency: "Praktische Effizienz",
  },
};

export const CATEGORY_LABEL: Record<Locale, Record<FoodCategory, string>> = {
  en: {
    leafy_greens: "Leafy greens",
    legumes: "Legumes",
    sprouts: "Sprouts / microgreens",
    fermented: "Fermented plants",
    mushrooms: "Mushrooms / fungi",
    algae: "Algae / seaweed",
    muscle_meats: "Muscle meats",
    organs: "Organs",
    eggs: "Eggs",
    dairy: "Dairy",
    fish_seafood: "Fish / seafood",
  },
  de: {
    leafy_greens: "Blattgemüse / Salate",
    legumes: "Hülsenfrüchte",
    sprouts: "Sprossen / Microgreens",
    fermented: "Fermentierte Pflanzen",
    mushrooms: "Pilze / Fungi",
    algae: "Algen",
    muscle_meats: "Muskelfleisch",
    organs: "Innereien",
    eggs: "Eier",
    dairy: "Milchprodukte",
    fish_seafood: "Fisch / Meeresfrüchte",
  },
};

export function t(locale: Locale) {
  return DICT[locale];
}

export function axisName(locale: Locale, axis: AxisId): string {
  return AXIS_LABEL[locale][axis];
}

export function categoryName(locale: Locale, category: FoodCategory): string {
  return CATEGORY_LABEL[locale][category];
}

export const ALL_AXES = [...AXES];
export const ALL_CATEGORIES = [...FOOD_CATEGORIES];
