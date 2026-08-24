import type { Invariant } from "@/lib/schema";

export const INVARIANTS: readonly Invariant[] = [
  {
    id: "eaa-diaas",
    title: {
      de: "Neun unentbehrliche Aminosäuren, DIAAS vor Mittelwert",
      en: "Nine indispensable amino acids; DIAAS before averages",
    },
    body: {
      de: "Der Mensch kann 9 unentbehrliche Aminosäuren nicht selbst synthetisieren. Die meisten Pflanzenproteine sind unvollständig oder haben niedrigen DIAAS. Getreide ist typischerweise lysinlimitiert; Hülsenfrüchte methionin-/cysteinlimitiert. Echter DIAAS >1,0 ist in unaugmentierten Pflanzen selten. Komplementarität verbessert das Profil, gleicht aber nicht die ileale Verdaulichkeit und Vollständigkeit der meisten tierischen Proteine aus.",
      en: "Humans cannot synthesize 9 indispensable amino acids. Most plant proteins are incomplete or have low DIAAS. Cereals are typically lysine-limited; legumes methionine/cysteine-limited. True DIAAS >1.0 is rare in unaugmented plants. Complementarity improves the profile but does not equal the ileal digestibility and completeness of most animal proteins.",
    },
    sourceIds: ["fao-diaas-2013", "herreman-2020", "mathai-2017", "moughan-2024"],
  },
  {
    id: "heme-iron",
    title: {
      de: "Häm-Eisen ist nicht austauschbar gegen Nicht-Häm-Milligramm",
      en: "Heme iron is not interchangeable with non-heme milligrams",
    },
    body: {
      de: "Häm-Eisen (tierisch) hat deutlich höhere Bioverfügbarkeit als Nicht-Häm-Eisen (pflanzlich). Phytate, Oxalate und Polyphenole in vielen Pflanzen senken zusätzlich die Absorption von Fe, Zn und Ca. Kochen, Einweichen, Keimen und Fermentation mindern die Lücke teilweise, schließen sie nicht.",
      en: "Heme iron (animal) has significantly higher bioavailability than non-heme iron (plant). Phytates, oxalates, and polyphenols in many plants further reduce Fe, Zn, and Ca absorption. Cooking, soaking, sprouting, and fermentation partially mitigate but do not eliminate the gap.",
    },
    sourceIds: ["efsa-iron-2015", "hurrell-egli-2010", "milman-2020", "dge-eisen-2024", "nih-iron-2025"],
  },
  {
    id: "absent-compounds",
    title: {
      de: "B12, EPA/DHA, Kreatin, Carnosin, Retinol fehlen in unaugmentierten Pflanzen",
      en: "B12, EPA/DHA, creatine, carnosine, and retinol are absent from unaugmented plants",
    },
    body: {
      de: "Präformiertes Vitamin B12, langkettige Omega-3-Fettsäuren (EPA/DHA), Kreatin, Carnosin und Retinol fehlen in unaugmentierten Pflanzen praktisch vollständig. Bestimmte Algen enthalten echtes B12 oder EPA/DHA; das „B12“ in Spirulina ist überwiegend inaktives Analogon. ALA wird nur zu ≤5–15 % (oft weniger) in EPA/DHA umgewandelt.",
      en: "Preformed vitamin B12, long-chain omega-3s (EPA/DHA), creatine, carnosine, and retinol are essentially absent from unaugmented plant foods. Certain algae contain true B12 or EPA/DHA; most “B12” in spirulina is inactive analog. ALA converts to EPA/DHA at low efficiency (typically ≤5–15%, often lower).",
    },
    sourceIds: [
      "nih-b12-2025",
      "nih-n3-2025",
      "nih-vita-2025",
      "watanabe-2002",
      "wells-2017",
      "grosshagauer-2022",
      "brosnan-2007",
      "boldyrev-2013",
    ],
  },
  {
    id: "fiber-passive-carb",
    title: {
      de: "Ballaststoffe sind der strukturelle Vorteil der Pflanze",
      en: "Fibre is the structural advantage of plants",
    },
    body: {
      de: "Lösliche und unlösliche Ballaststoffe plus resistente Stärke sind ein einzigartiger struktureller Vorteil von Pflanzen. Sie sind „passive“ Kohlenhydrate: sie treiben die Mikrobiomfermentation zu kurzkettigen Fettsäuren (Butyrat u. a.), verbessern Sättigung und glykämische Kontrolle und fehlen in tierischen Produkten weitgehend. Freie Zucker und schnell verdauliche Stärken sind „aktive“ Kohlenhydrate.",
      en: "Soluble and insoluble fibre plus resistant starch are a unique structural advantage of plants. They are “passive” carbohydrate: they drive microbiome fermentation to short-chain fatty acids (butyrate and others), improve satiety and glycemic control, and are largely absent from animal products. Free sugars and rapidly digestible starches are “active” carbohydrates.",
    },
    sourceIds: ["efsa-fiber-2010", "dge-ref-2025"],
  },
  {
    id: "vitamin-lability",
    title: {
      de: "Wasserlösliche Vitamine sind labil; Matrix entscheidet über Carotinoide",
      en: "Water-soluble vitamins are labile; matrix decides carotenoid yield",
    },
    body: {
      de: "Wasserlösliche Vitamine (besonders C, Thiamin, Folat) sind hoch labil gegenüber Hitze, Sauerstoff, Licht, Auslaugung und Zeit. Fettlösliche Vitamine und Carotinoide sind hitzestabiler, oxidieren aber mit Sauerstoff und Licht. Matrixzerstörung (Schneiden, Kochen) kann die Carotinoid-Bioverfügbarkeit erhöhen und andere Vitamine zerstören.",
      en: "Water-soluble vitamins (especially C, thiamin, folate) are highly labile to heat, oxygen, light, leaching, and time. Fat-soluble vitamins and carotenoids are more heat-stable but oxidize with oxygen and light. Matrix disruption (cutting, cooking) can increase carotenoid bioavailability while destroying others.",
    },
    sourceIds: ["nih-vita-2025", "dge-ref-2025"],
  },
  {
    id: "surface-residues",
    title: {
      de: "Oberfläche und Morphologie steuern Rückstandslast",
      en: "Surface area and morphology govern residue load",
    },
    body: {
      de: "Blattgemüse trägt typischerweise höhere Pestizid-/Fungizidlasten als Wurzeln oder dickschaliges Obst/Gemüse. Fermentation und gründliches Kochen können einige Rückstände und Antinährstoffe reduzieren; systemische Verbindungen sind schwerer zu entfernen. EU- und US-Monitoring (EFSA, USDA PDP) bleiben die quantitativen Quellen — nicht Marketinglisten.",
      en: "Leafy greens typically carry higher pesticide/fungicide loads than roots or thick-skinned produce. Fermentation and thorough cooking can reduce some residues and anti-nutrients; systemic compounds are harder to remove. EU and US monitoring (EFSA, USDA PDP) remain the quantitative sources — not marketing lists.",
    },
    sourceIds: ["efsa-pesticide-2023", "efsa-pesticide-2024", "usda-pdp"],
  },
  {
    id: "niche-foods",
    title: {
      de: "Fermente, Sprossen, UV-Pilze und Algen sind keine „Gemüse“-Mittelwerte",
      en: "Ferments, sprouts, UV mushrooms, and algae are not “vegetable” averages",
    },
    body: {
      de: "Fermentierte Lebensmittel (Kraut u. a.), Sprossen, UV-exponierte Pilze und bestimmte Algen besetzen eigene biochemische Nischen. Einfaches Mittelwertbilden über „Gemüse“ löscht Probiotika-Potenzial, organisches Säureprofil, mögliches K2, reduziertes Antinährstoffniveau, Ergothionein, D2 nach UV und variables echtes B12/EPA.",
      en: "Fermented foods (kraut and others), sprouts, UV-exposed mushrooms, and certain algae occupy distinct biochemical niches. Averaging them as “vegetables” erases probiotic potential, organic-acid profiles, possible K2, reduced anti-nutrients, ergothioneine, UV-derived D2, and variable true B12/EPA status.",
    },
    sourceIds: ["watanabe-2002", "wells-2017", "halliwell-2018", "usda-fdc"],
  },
];
