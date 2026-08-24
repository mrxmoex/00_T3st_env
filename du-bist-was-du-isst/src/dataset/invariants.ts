import type { Invariant } from "@/lib/types";

/** Hard biochemical constraints — not opinions */
export const BIOCHEMICAL_INVARIANTS: Invariant[] = [
  {
    id: "essential_amino_acids",
    title: {
      de: "Essenzielle Aminosäuren & DIAAS",
      en: "Essential Amino Acids & DIAAS",
    },
    body: {
      de: "Menschen benötigen 9 essenzielle Aminosäuren. Die meisten Pflanzenproteine sind unvollständig oder haben niedrige DIAAS-Werte. Getreide ist typischerweise lysin-limitiert; Hülsenfrüchte methionin/cystein-limitiert. Echte hohe DIAAS (>1,0) sind in unangereicherten Pflanzen selten. Komplementarität verbessert das Profil, erreicht aber nicht die ileale Verdaulichkeit und Vollständigkeit der meisten tierischen Proteine.",
      en: "Humans require 9 essential amino acids that cannot be synthesized. Most plant proteins are incomplete or have low DIAAS scores. Cereals are typically lysine-limited; legumes are methionine/cysteine-limited. True high DIAAS (>1.0) is rare in unaugmented plants. Complementarity improves the profile but does not equal the ileal digestibility and completeness of most animal proteins.",
    },
    sourceIds: ["fao_diaas", "fao_diaas_2019", "dge_referenz"],
  },
  {
    id: "iron_bioavailability",
    title: {
      de: "Eisen-Bioverfügbarkeit",
      en: "Iron Bioavailability",
    },
    body: {
      de: "Häm-Eisen (tierisch) hat deutlich höhere Bioverfügbarkeit als Nicht-Häm-Eisen (pflanzlich). Phytate, Oxalate und Polyphenole in vielen Pflanzen reduzieren die Mineralaufnahme (Fe, Zn, Ca). Kochen, Einweichen, Keimen und Fermentation mildern teilweise, eliminieren die Lücke aber nicht.",
      en: "Heme iron (animal) has significantly higher bioavailability than non-heme iron (plant). Phytates, oxalates, and polyphenols in many plants further reduce mineral absorption (Fe, Zn, Ca). Cooking, soaking, sprouting, and fermentation partially mitigate but do not eliminate the gap.",
    },
    sourceIds: ["nih_iron", "hallberg_iron", "hurrell_phytate"],
  },
  {
    id: "animal_only_nutrients",
    title: {
      de: "Praktisch pflanzenfreie Nährstoffe",
      en: "Nutrients Essentially Absent from Unaugmented Plants",
    },
    body: {
      de: "Präformiertes Vitamin B12, langkettige Omega-3 (EPA/DHA), Kreatin, Carnosin und Retinol (präformiertes Vitamin A) fehlen in unangereicherten Pflanzen nahezu vollständig. Bestimmte Algen enthalten echtes B12 oder EPA/DHA; das meiste 'B12' in Spirulina sind inaktive Analoga. ALA (pflanzliches Omega-3) wird zu EPA/DHA mit niedriger Effizienz umgewandelt (typisch ≤5–10 %, oft weniger).",
      en: "Preformed vitamin B12, long-chain omega-3 fatty acids (EPA/DHA), creatine, carnosine, and retinol (preformed vitamin A) are essentially absent from unaugmented plant foods. Certain algae contain true B12 or EPA/DHA; most \"B12\" in common algae/spirulina is inactive analogs. ALA (plant omega-3) converts to EPA/DHA at low efficiency (typically ≤5–10%, often lower).",
    },
    sourceIds: ["nih_b12", "nih_omega3", "nih_vitamin_a", "watanabe_b12_algae", "burdge_ala_conversion"],
  },
  {
    id: "fiber_advantage",
    title: {
      de: "Ballaststoff-Vorteil der Pflanzen",
      en: "Fiber as a Unique Plant Structural Advantage",
    },
    body: {
      de: "Lösliche + unlösliche Ballaststoffe und resistente Stärke sind einzigartige Vorteile von Pflanzen. Sie sind 'passive' Kohlenhydrate: Mikrobiom-Fermentation zu kurzkettigen Fettsäuren (Butyrat etc.), Sättigung und glykämische Kontrolle. Tierische Produkte enthalten sie kaum. Freie Zucker und schnell verdauliche Stärken sind 'aktive' Kohlenhydrate.",
      en: "Fiber (soluble + insoluble + resistant starch) is a unique structural advantage of plants. It is \"passive\" carbohydrate: drives microbiome fermentation to short-chain fatty acids (butyrate etc.), improves satiety and glycemic control, and is largely absent from animal products. Free sugars and rapidly digestible starches are \"active\" carbohydrates.",
    },
    sourceIds: ["ruxton_fiber", "efsa_drv", "dge_referenz"],
  },
  {
    id: "vitamin_lability",
    title: {
      de: "Vitamin-Stabilität & Matrixeffekte",
      en: "Vitamin Lability & Matrix Effects",
    },
    body: {
      de: "Wasserlösliche Vitamine (v.a. C, Thiamin, Folat) sind hitze-, sauerstoff-, licht- und zeitempfindlich. Fettlösliche Vitamine und Carotinoide sind hitzestabiler, oxidieren aber. Matrixzerstörung (Schneiden, Kochen) kann Carotinoid-Bioverfügbarkeit erhöhen, während andere Vitamine zerstört werden.",
      en: "Water-soluble vitamins (especially C, thiamin, folate) are highly labile to heat, oxygen, light, leaching, and time. Fat-soluble vitamins and carotenoids are more heat-stable but oxidize with oxygen and light. Matrix disruption (cutting, cooking) can increase carotenoid bioavailability while destroying others.",
    },
    sourceIds: ["efsa_drv", "dge_referenz"],
  },
  {
    id: "residue_morphology",
    title: {
      de: "Rückstände & Oberflächenmorphologie",
      en: "Residue Load & Surface Morphology",
    },
    body: {
      de: "Oberfläche und Morphologie bestimmen Rückstandslasten: Blattgemüse trägt typischerweise höhere Pestizid-/Fungizidlasten als Wurzeln oder dickhäutige Früchte. Fermentation und gründliches Kochen reduzieren einige Rückstände und Antinährstoffe; systemische Verbindungen sind schwerer zu entfernen.",
      en: "Surface-area and morphology matter for residues: leafy greens typically carry higher pesticide/fungicide loads than roots or thick-skinned produce. Fermentation and thorough cooking can reduce some residues and anti-nutrients; systemic compounds are harder to remove.",
    },
    sourceIds: ["efsa_pdp", "usda_pdp"],
  },
  {
    id: "niche_categories",
    title: {
      de: "Biochemische Nischenkategorien",
      en: "Distinct Biochemical Niches",
    },
    body: {
      de: "Fermentierte Lebensmittel, Sprossen, UV-behandelte Pilze und bestimmte Algen besetzen biochemische Nischen, die einfaches 'Gemüse'-Mitteln verwischt. Jede Kategorie wird in diesem System separat bewertet.",
      en: "Fermented foods, sprouts, UV-exposed mushrooms, and certain algae occupy distinct biochemical niches that simple \"vegetable\" averaging erases. Each category is evaluated separately in this system.",
    },
    sourceIds: ["dge_referenz", "efsa_drv"],
  },
];
