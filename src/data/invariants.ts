import type { Invariant } from "@/lib/types";

export const INVARIANTS: Invariant[] = [
  {
    id: "eaa-diaas",
    title: {
      en: "Nine indispensable amino acids are not optional",
      de: "Neun unentbehrliche Aminosäuren sind nicht optional",
    },
    body: {
      en: "Humans cannot synthesize nine indispensable amino acids. DIAAS scores ileal digestibility of each one and does not truncate above 1.0. Cereals are typically lysine-limited; legumes are typically methionine/cysteine-limited. True DIAAS > 1.0 is common in unaugmented animal proteins and rare in unaugmented plants. Mixing cereals with legumes improves the amino-acid pattern; it does not automatically equal the ileal digestibility of milk, egg, or meat.",
      de: "Der Mensch kann neun unentbehrliche Aminosäuren nicht selbst bilden. DIAAS bewertet die ileale Verdaulichkeit jeder einzelnen und wird oberhalb von 1,0 nicht gekappt. Getreide ist typisch lysinlimitiert, Hülsenfrüchte typisch methionin-/cysteinlimitiert. Ein DIAAS > 1,0 ist bei unverstärkten tierischen Proteinen häufig und bei unverstärkten Pflanzen selten. Komplementierung verbessert das Muster; sie gleicht die ileale Verdaulichkeit von Milch, Ei oder Fleisch nicht automatisch aus.",
    },
    implication: {
      en: "Protein quantity without a limiting-amino-acid and digestibility score is noise.",
      de: "Proteinmenge ohne limitierende Aminosäure und Verdaulichkeit ist Rauschen.",
    },
    sourceIds: ["fao-diaas-2013", "herreman-2020", "mathai-stein-2017"],
  },
  {
    id: "heme-minerals",
    title: {
      en: "Heme iron is not interchangeable with plant iron",
      de: "Häm-Eisen ist kein Austauschstoff für Pflanzeneisen",
    },
    body: {
      en: "Heme iron from animal tissue is absorbed at a markedly higher fractional rate than non-heme iron. Phytate, oxalate, and polyphenols in many plants further suppress Fe, Zn, and Ca absorption. Soaking, sprouting, fermentation, and cooking reduce but do not erase the gap.",
      de: "Häm-Eisen aus tierischem Gewebe wird deutlich effizienter absorbiert als Nicht-Häm-Eisen. Phytat, Oxalat und Polyphenole in vielen Pflanzen senken zusätzlich die Aufnahme von Fe, Zn und Ca. Einweichen, Keimen, Fermentieren und Kochen verringern die Lücke, schließen sie aber nicht.",
    },
    implication: {
      en: "Milligrams of iron on a label are not milligrams absorbed.",
      de: "Milligramm Eisen auf dem Etikett sind nicht Milligramm resorbiertes Eisen.",
    },
    sourceIds: ["nih-ods-iron", "gibson-2018-phytate", "dge-iron-2024"],
  },
  {
    id: "absent-compounds",
    title: {
      en: "Some compounds are essentially absent from unaugmented plants",
      de: "Einige Verbindungen fehlen in unverstärkten Pflanzen praktisch",
    },
    body: {
      en: "Preformed vitamin B12, long-chain EPA/DHA, creatine, carnosine, and retinol are essentially absent from unaugmented plant foods. Some algae contain true B12 or EPA/DHA; common spirulina “B12” is largely inactive analogs. Plant ALA converts to EPA/DHA at low efficiency, typically ≤5–10% and often lower.",
      de: "Präformiertes Vitamin B12, langkettiges EPA/DHA, Kreatin, Carnosin und Retinol fehlen in unverstärkten Pflanzen praktisch. Manche Algen enthalten echtes B12 oder EPA/DHA; das „B12“ in gängiger Spirulina sind überwiegend inaktive Analoga. Pflanzliches ALA wird nur mit geringer Effizienz zu EPA/DHA umgewandelt, typisch ≤5–10 %, oft niedriger.",
    },
    implication: {
      en: "Absence is a structural fact, not a lifestyle preference.",
      de: "Abwesenheit ist eine strukturelle Tatsache, keine Lifestyle-Präferenz.",
    },
    sourceIds: ["nih-ods-b12", "nih-ods-omega3", "nih-ods-vita", "Watanabe-2013-algae-b12"],
  },
  {
    id: "fiber-passive-carb",
    title: {
      en: "Fiber is a plant structural advantage — and it is not sugar",
      de: "Ballaststoffe sind ein pflanzlicher Strukturvorteil — und kein Zucker",
    },
    body: {
      en: "Soluble fiber, insoluble fiber, and resistant starch are largely absent from animal products. They are passive carbohydrate: they reach the colon, feed butyrate-producing taxa, slow glycemic rise, and increase satiety. Free sugars and rapidly digestible starches are active carbohydrate.",
      de: "Lösliche und unlösliche Ballaststoffe sowie resistente Stärke fehlen in tierischen Produkten weitgehend. Sie sind passive Kohlenhydrate: sie erreichen den Dickdarm, füttern butyratbildende Taxa, dämpfen den glykämischen Anstieg und sättigen. Freie Zucker und schnell verdauliche Stärken sind aktive Kohlenhydrate.",
    },
    implication: {
      en: "A food can win protein quality and lose carbohydrate quality in the same bite.",
      de: "Ein Lebensmittel kann Proteinqualität gewinnen und Kohlenhydratqualität in demselben Bissen verlieren.",
    },
    sourceIds: ["dge-ref-2025", "efsa-drv-2017"],
  },
  {
    id: "lability",
    title: {
      en: "Water-soluble vitamins die in the kitchen; carotenoids can rise",
      de: "Wasserlösliche Vitamine sterben in der Küche; Carotinoide können steigen",
    },
    body: {
      en: "Vitamin C, thiamin, and folate are labile to heat, oxygen, light, leaching, and time. Fat-soluble vitamins and carotenoids are more heat-stable but oxidize. Cutting and cooking can increase carotenoid bioavailability while destroying ascorbate and folate in the same pot.",
      de: "Vitamin C, Thiamin und Folat sind labil gegenüber Hitze, Sauerstoff, Licht, Auslaugung und Zeit. Fettlösliche Vitamine und Carotinoide sind hitzestabiler, oxidieren aber. Schneiden und Garen können die Carotinoid-Bioverfügbarkeit erhöhen und gleichzeitig Ascorbat und Folat zerstören.",
    },
    implication: {
      en: "Raw density is not cooked yield.",
      de: "Rohdichte ist nicht Garausbeute.",
    },
    sourceIds: ["nih-ods-vita", "dge-ref-2025"],
  },
  {
    id: "surface-residues",
    title: {
      en: "Leaf area is a residue surface, not a moral category",
      de: "Blattfläche ist eine Rückstandsfläche, keine Moralkategorie",
    },
    body: {
      en: "Leafy greens typically carry higher pesticide and fungicide loads than roots or thick-skinned produce because of surface area and spray exposure. Fermentation and thorough cooking can reduce some residues and anti-nutrients. Systemic compounds are harder to wash off.",
      de: "Blattgemüse trägt typisch höhere Pestizid- und Fungizidlasten als Wurzeln oder dickschaliges Obst — wegen Oberfläche und Spritzexposition. Fermentation und gründliches Garen können einige Rückstände und Antinährstoffe senken. Systemische Wirkstoffe sind schwerer abzuwaschen.",
    },
    implication: {
      en: "Micronutrient density and residue load can rise together.",
      de: "Mikronährstoffdichte und Rückstandslast können gemeinsam steigen.",
    },
    sourceIds: ["efsa-pesticides-2023", "usda-pdp-2023"],
  },
  {
    id: "niches",
    title: {
      en: "Ferments, sprouts, UV mushrooms, and algae are not “vegetables”",
      de: "Fermente, Sprossen, UV-Pilze und Algen sind keine „Gemüse“",
    },
    body: {
      en: "Sauerkraut, sprouts, UV-exposed mushrooms, and selected algae occupy distinct biochemical niches: organic acids and possible K2, elevated vitamin C with lower anti-nutrients, D2 only after UV, and variable true B12 or EPA. Averaging them into a vegetable mean erases the only information that matters.",
      de: "Sauerkraut, Sprossen, UV-behandelte Pilze und bestimmte Algen besetzen eigene biochemische Nischen: organische Säuren und mögliches K2, mehr Vitamin C bei weniger Antinährstoffen, D2 nur nach UV, variables echtes B12 oder EPA. Ein Gemüsedurchschnitt löscht genau diese Information.",
    },
    implication: {
      en: "This system never collapses plant categories.",
      de: "Dieses System bricht Pflanzenkategorien niemals zusammen.",
    },
    sourceIds: ["usda-sr-legacy-2019", "Watanabe-2013-algae-b12", "dge-ref-2025"],
  },
];
