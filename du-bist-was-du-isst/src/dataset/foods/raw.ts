import type { FoodItem } from "@/lib/types";

type RawFood = Omit<FoodItem, "axisScores" | "overallTier" | "classTier" | "globalTier">;

/** Seed foods — quantitative values from USDA FDC SR Legacy / FNDDS where noted */
export const rawFoods: RawFood[] = [
  // ─── LEAFY GREENS ───────────────────────────────────────────────
  {
    id: "spinach-raw",
    name: { de: "Spinat, roh", en: "Spinach, raw" },
    kingdom: "plant",
    category: "leafy_greens",
    usdaFdcId: 168462,
    nutrientProfile: {
      energyKcal: 23, proteinG: 2.9, fatG: 0.4, carbsG: 3.6, fiberG: 2.2, sugarsG: 0.4,
      ironMg: 2.7, zincMg: 0.5, calciumMg: 99, magnesiumMg: 79, potassiumMg: 558,
      vitaminCMg: 28.1, vitaminB12Mcg: 0, folateMcg: 194, vitaminAMcgRae: 469,
      vitaminDIu: 0, vitaminEMg: 2.0, vitaminKMcg: 483, omega3AlaG: 0.14, omega3EpaG: 0, omega3DhaG: 0, omega6G: 0.03,
    },
    proteinQuality: { method: "DIAAS", score: 0.73, limitingAminoAcid: "methionine+cysteine", isComplete: false, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.5, phytateLoad: "moderate", oxalateLoad: "high", lectinLoad: "low",
      b12Status: "absent", retinolStatus: "carotenoid_only", epaDhaStatus: "absent", alaConversionEfficiency: 0.08, sourceIds: ["nih_iron", "hurrell_phytate", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Lutein/Zeaxanthin", en: "Lutein/Zeaxanthin" }, presence: "high" },
        { name: { de: "Nitrate", en: "Nitrate" }, presence: "moderate" },
        { name: { de: "Glucosinolate-Vorstufen", en: "Glucosinolate precursors" }, presence: "low" },
      ],
      sourceIds: ["usda_fdc"],
    },
    residues: { pesticideLoad: "high", surfaceAreaRisk: "high", mitigation: { de: "Gründlich waschen; Bio reduziert teilweise", en: "Thorough washing; organic partially reduces load" }, sourceIds: ["efsa_pdp", "usda_pdp"] },
    preparation: {
      requiredSteps: [{ de: "Oxalat-Reduktion durch Blanchieren optional", en: "Optional blanching to reduce oxalates" }],
      stability: "low", heatLability: { de: "Vitamin C und Folat hitzeempfindlich", en: "Vitamin C and folate heat-labile" },
      yieldNotes: { de: "Hohe Nährstoffdichte pro kcal, aber Mineral-Bioverfügbarkeit limitiert", en: "High nutrient density per kcal, but mineral bioavailability limited" },
      sourceIds: ["dge_referenz"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },
  {
    id: "kale-raw",
    name: { de: "Grünkohl, roh", en: "Kale, raw" },
    kingdom: "plant",
    category: "leafy_greens",
    usdaFdcId: 168421,
    nutrientProfile: {
      energyKcal: 35, proteinG: 2.9, fatG: 1.5, carbsG: 4.4, fiberG: 4.1, sugarsG: 0.8,
      ironMg: 1.6, zincMg: 0.4, calciumMg: 254, magnesiumMg: 33, potassiumMg: 348,
      vitaminCMg: 93.4, vitaminB12Mcg: 0, folateMcg: 62, vitaminAMcgRae: 241,
      vitaminDIu: 0, vitaminEMg: 1.5, vitaminKMcg: 390, omega3AlaG: 0.18, omega3EpaG: 0, omega3DhaG: 0, omega6G: 0.13,
    },
    proteinQuality: { method: "DIAAS", score: 0.68, limitingAminoAcid: "methionine+cysteine", isComplete: false, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.55, phytateLoad: "moderate", oxalateLoad: "moderate", lectinLoad: "low",
      b12Status: "absent", retinolStatus: "carotenoid_only", epaDhaStatus: "absent", sourceIds: ["nih_iron", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Glucosinolate (Sulforaphan-Vorstufe)", en: "Glucosinolates (sulforaphane precursor)" }, presence: "high" },
        { name: { de: "Kaempferol", en: "Kaempferol" }, presence: "moderate" },
      ],
      sourceIds: ["usda_fdc"],
    },
    residues: { pesticideLoad: "moderate", surfaceAreaRisk: "high", mitigation: { de: "Kochen reduziert Goitrogene teilweise", en: "Cooking partially reduces goitrogens" }, sourceIds: ["efsa_pdp"] },
    preparation: {
      requiredSteps: [{ de: "Massieren/Blanchieren verbessert Textur und reduziert Oxalate", en: "Massaging/blanching improves texture and reduces oxalates" }],
      stability: "low", heatLability: { de: "Vitamin C stark hitzeempfindlich", en: "Vitamin C highly heat-labile" },
      yieldNotes: { de: "Calcium-Menge hoch, Bioverfügbarkeit durch Oxalate reduziert", en: "High calcium content, bioavailability reduced by oxalates" },
      sourceIds: ["hurrell_phytate"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },

  // ─── LEGUMES ────────────────────────────────────────────────────
  {
    id: "lentils-cooked",
    name: { de: "Linsen, gekocht", en: "Lentils, cooked" },
    kingdom: "plant",
    category: "legumes",
    usdaFdcId: 172420,
    nutrientProfile: {
      energyKcal: 116, proteinG: 9.0, fatG: 0.4, carbsG: 20.1, fiberG: 7.9, sugarsG: 1.8, resistantStarchG: 2.5,
      ironMg: 3.3, zincMg: 1.3, calciumMg: 19, magnesiumMg: 36, potassiumMg: 369,
      vitaminCMg: 1.5, vitaminB12Mcg: 0, folateMcg: 181, vitaminAMcgRae: 2,
      vitaminDIu: 0, vitaminEMg: 0.1, vitaminKMcg: 1.7, omega3AlaG: 0.07, omega3EpaG: 0, omega3DhaG: 0, omega6G: 0.15,
    },
    proteinQuality: { method: "DIAAS", score: 0.63, limitingAminoAcid: "methionine+cysteine", isComplete: false, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.6, phytateLoad: "high", oxalateLoad: "low", lectinLoad: "moderate",
      b12Status: "absent", retinolStatus: "absent", epaDhaStatus: "absent", sourceIds: ["hurrell_phytate", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Resistente Stärke", en: "Resistant starch" }, presence: "moderate" },
        { name: { de: "Polyphenole", en: "Polyphenols" }, presence: "moderate" },
      ],
      sourceIds: ["usda_fdc"],
    },
    preparation: {
      requiredSteps: [
        { de: "Einweichen reduziert Kochzeit und Phytate", en: "Soaking reduces cook time and phytates" },
        { de: "Vollständiges Kochen inaktiviert Lectine", en: "Thorough cooking inactivates lectins" },
      ],
      stability: "high", heatLability: { de: "Folat teilweise hitzeempfindlich", en: "Folate partially heat-labile" },
      yieldNotes: { de: "Protein + Ballaststoff-Dichte hoch; DIAAS moderat", en: "High protein + fiber density; moderate DIAAS" },
      sourceIds: ["fao_diaas", "dge_referenz"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },
  {
    id: "chickpeas-cooked",
    name: { de: "Kichererbsen, gekocht", en: "Chickpeas, cooked" },
    kingdom: "plant",
    category: "legumes",
    usdaFdcId: 173757,
    nutrientProfile: {
      energyKcal: 164, proteinG: 8.9, fatG: 2.6, carbsG: 27.4, fiberG: 7.6, sugarsG: 4.8, resistantStarchG: 2.0,
      ironMg: 2.9, zincMg: 1.5, calciumMg: 49, magnesiumMg: 48, potassiumMg: 291,
      vitaminCMg: 1.3, vitaminB12Mcg: 0, folateMcg: 172, vitaminAMcgRae: 1,
      vitaminDIu: 0, vitaminEMg: 0.4, vitaminKMcg: 4.0, omega3AlaG: 0.04, omega3EpaG: 0, omega3DhaG: 0, omega6G: 1.1,
    },
    proteinQuality: { method: "DIAAS", score: 0.71, limitingAminoAcid: "methionine+cysteine", isComplete: false, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.58, phytateLoad: "high", oxalateLoad: "low", lectinLoad: "moderate",
      b12Status: "absent", retinolStatus: "absent", epaDhaStatus: "absent", sourceIds: ["hurrell_phytate"],
    },
    bioactives: {
      items: [{ name: { de: "Raffinose-Stickstoff", en: "Raffinose oligosaccharides" }, presence: "moderate" }],
      sourceIds: ["usda_fdc"],
    },
    preparation: {
      requiredSteps: [{ de: "Einweichen + Kochen essentiell", en: "Soaking + cooking essential" }],
      stability: "high", heatLability: { de: "Standard-Hitzestabilität", en: "Standard heat stability" },
      yieldNotes: { de: "Gute Ballaststoff-/Protein-Kombination mit Methionin-Limitierung", en: "Good fiber/protein combo with methionine limitation" },
      sourceIds: ["fao_diaas"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },

  // ─── SPROUTS ──────────────────────────────────────────────────────
  {
    id: "broccoli-sprouts",
    name: { de: "Brokkolisprossen", en: "Broccoli sprouts" },
    kingdom: "plant",
    category: "sprouts_microgreens",
    usdaFdcId: 1103176,
    nutrientProfile: {
      energyKcal: 35, proteinG: 3.0, fatG: 0.4, carbsG: 5.6, fiberG: 4.0, sugarsG: 1.0,
      ironMg: 0.7, zincMg: 0.4, calciumMg: 47, magnesiumMg: 21, potassiumMg: 325,
      vitaminCMg: 89, vitaminB12Mcg: 0, folateMcg: 63, vitaminAMcgRae: 31,
      vitaminDIu: 0, vitaminEMg: 0.5, vitaminKMcg: 276, omega3AlaG: 0.1, omega3EpaG: 0, omega3DhaG: 0, omega6G: 0.05,
    },
    proteinQuality: { method: "PDCAAS", score: 0.75, limitingAminoAcid: "methionine+cysteine", isComplete: false, sourceIds: ["usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.7, phytateLoad: "low", oxalateLoad: "low", lectinLoad: "low",
      b12Status: "absent", retinolStatus: "carotenoid_only", epaDhaStatus: "absent", sourceIds: ["usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Sulforaphan (Glucoraphanin)", en: "Sulforaphane (glucoraphanin)" }, presence: "high", note: { de: "10–100× höher als reifer Brokkoli", en: "10–100× higher than mature broccoli" } },
      ],
      sourceIds: ["usda_fdc"],
    },
    preparation: {
      requiredSteps: [{ de: "Roh oder kurz gedünstet für Sulforaphan-Yield", en: "Raw or briefly steamed for sulforaphane yield" }],
      stability: "low", heatLability: { de: "Myrosinase hitzeempfindlich — Rohverzehr optimal", en: "Myrosinase heat-labile — raw consumption optimal" },
      yieldNotes: { de: "Erhöhte Bioverfügbarkeit vs. reife Pflanze", en: "Elevated bioavailability vs. mature plant" },
      sourceIds: ["usda_fdc"],
    },
    dataFlags: ["estimated"], sourceIds: ["usda_fdc"],
  },

  // ─── FERMENTED ──────────────────────────────────────────────────
  {
    id: "sauerkraut-fermented",
    name: { de: "Sauerkraut, fermentiert", en: "Sauerkraut, fermented" },
    kingdom: "plant",
    category: "fermented",
    usdaFdcId: 169975,
    nutrientProfile: {
      energyKcal: 19, proteinG: 0.9, fatG: 0.1, carbsG: 4.3, fiberG: 2.9, sugarsG: 1.8,
      ironMg: 1.5, zincMg: 0.2, calciumMg: 30, magnesiumMg: 13, potassiumMg: 170,
      vitaminCMg: 14.7, vitaminB12Mcg: 0, folateMcg: 24, vitaminAMcgRae: 1,
      vitaminDIu: 0, vitaminEMg: 0.1, vitaminKMcg: 13, omega3AlaG: 0.04, omega3EpaG: 0, omega3DhaG: 0, omega6G: 0.02,
    },
    proteinQuality: { method: "PDCAAS", score: 0.5, isComplete: false, sourceIds: ["usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.75, phytateLoad: "low", oxalateLoad: "low", lectinLoad: "none",
      b12Status: "absent", retinolStatus: "absent", epaDhaStatus: "absent", sourceIds: ["usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Probiotische Laktobazillen", en: "Probiotic lactobacilli" }, presence: "moderate", note: { de: "Nur bei unpasteurisiert", en: "Only if unpasteurized" } },
        { name: { de: "Organische Säuren", en: "Organic acids" }, presence: "high" },
        { name: { de: "Vitamin K2 (variable)", en: "Vitamin K2 (variable)" }, presence: "low" },
      ],
      sourceIds: ["usda_fdc", "dge_referenz"],
    },
    preparation: {
      requiredSteps: [{ de: "Pasteurisierung tötet Probiotika", en: "Pasteurization kills probiotics" }],
      stability: "high", heatLability: { de: "Vitamin C teilweise erhalten", en: "Vitamin C partially preserved" },
      yieldNotes: { de: "Reduzierte Antinährstoffe vs. Rohkohl", en: "Reduced anti-nutrients vs. raw cabbage" },
      sourceIds: ["dge_referenz"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },

  // ─── MUSHROOMS ──────────────────────────────────────────────────
  {
    id: "shiitake-uv",
    name: { de: "Shiitake-Pilze (UV-behandelt)", en: "Shiitake mushrooms (UV-treated)" },
    kingdom: "plant",
    category: "mushrooms_fungi",
    usdaFdcId: 169241,
    nutrientProfile: {
      energyKcal: 34, proteinG: 2.2, fatG: 0.5, carbsG: 6.8, fiberG: 2.5, sugarsG: 2.4,
      ironMg: 0.4, zincMg: 1.0, calciumMg: 2, magnesiumMg: 20, potassiumMg: 304,
      vitaminCMg: 0, vitaminB12Mcg: 0, folateMcg: 13, vitaminAMcgRae: 0,
      vitaminDIu: 1546, vitaminEMg: 0, vitaminKMcg: 0, omega3AlaG: 0, omega3EpaG: 0, omega3DhaG: 0, omega6G: 0.07,
    },
    proteinQuality: { method: "PDCAAS", score: 0.65, isComplete: false, sourceIds: ["usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.65, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "absent", retinolStatus: "absent", epaDhaStatus: "absent", sourceIds: ["usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Beta-Glucane", en: "Beta-glucans" }, presence: "high" },
        { name: { de: "Ergothionein", en: "Ergothioneine" }, presence: "high" },
        { name: { de: "Vitamin D2 (Ergocalciferol)", en: "Vitamin D2 (ergocalciferol)" }, presence: "high", note: { de: "Nur bei UV-Exposition", en: "Only with UV exposure" } },
      ],
      sourceIds: ["usda_fdc", "efsa_drv"],
    },
    preparation: {
      requiredSteps: [{ de: "UV-Exposition oder Sonnenlicht für D2", en: "UV exposure or sunlight for D2" }],
      stability: "moderate", heatLability: { de: "Vitamin D2 relativ stabil", en: "Vitamin D2 relatively stable" },
      yieldNotes: { de: "Einzigartiges Pilz-Bioaktiv-Profil", en: "Unique fungal bioactive profile" },
      sourceIds: ["usda_fdc"],
    },
    dataFlags: ["estimated"], sourceIds: ["usda_fdc"],
  },

  // ─── ALGAE ──────────────────────────────────────────────────────
  {
    id: "nori-dried",
    name: { de: "Nori, getrocknet", en: "Nori, dried" },
    kingdom: "plant",
    category: "algae_seaweed",
    usdaFdcId: 170495,
    nutrientProfile: {
      energyKcal: 35, proteinG: 5.8, fatG: 0.3, carbsG: 5.1, fiberG: 0.5, sugarsG: 0.5,
      ironMg: 1.8, zincMg: 1.0, calciumMg: 70, magnesiumMg: 120, potassiumMg: 356,
      vitaminCMg: 39, vitaminB12Mcg: 2.4, folateMcg: 146, vitaminAMcgRae: 12,
      vitaminDIu: 0, vitaminEMg: 1.0, vitaminKMcg: 4, omega3AlaG: 0, omega3EpaG: 0.05, omega3DhaG: 0, omega6G: 0.02,
    },
    proteinQuality: { method: "PDCAAS", score: 0.78, isComplete: true, sourceIds: ["usda_fdc", "watanabe_b12_algae"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.7, phytateLoad: "none", oxalateLoad: "low", lectinLoad: "none",
      b12Status: "active_algae", retinolStatus: "absent", epaDhaStatus: "algae_source", sourceIds: ["watanabe_b12_algae", "nih_b12"],
    },
    bioactives: {
      items: [
        { name: { de: "Jod", en: "Iodine" }, presence: "high", note: { de: "Überkonsum möglich", en: "Excess consumption possible" } },
        { name: { de: "Fucoxanthin", en: "Fucoxanthin" }, presence: "moderate" },
      ],
      sourceIds: ["usda_fdc", "efsa_drv"],
    },
    preparation: {
      requiredSteps: [{ de: "Portionskontrolle wegen Jod", en: "Portion control due to iodine" }],
      stability: "high", heatLability: { de: "Mineralstoffe stabil", en: "Minerals stable" },
      yieldNotes: { de: "Seltene pflanzliche EPA/B12-Quelle — Dosis beachten", en: "Rare plant EPA/B12 source — mind dose" },
      sourceIds: ["watanabe_b12_algae"],
    },
    dataFlags: ["contested"], sourceIds: ["usda_fdc", "watanabe_b12_algae"],
  },
  {
    id: "spirulina-dried",
    name: { de: "Spirulina, getrocknet", en: "Spirulina, dried" },
    kingdom: "plant",
    category: "algae_seaweed",
    usdaFdcId: 170495,
    nutrientProfile: {
      energyKcal: 290, proteinG: 57.5, fatG: 7.7, carbsG: 24.0, fiberG: 3.6, sugarsG: 3.1,
      ironMg: 28.5, zincMg: 2.0, calciumMg: 120, magnesiumMg: 195, potassiumMg: 1363,
      vitaminCMg: 10.1, vitaminB12Mcg: 0, folateMcg: 94, vitaminAMcgRae: 29,
      vitaminDIu: 0, vitaminEMg: 5.0, vitaminKMcg: 25, omega3AlaG: 0.8, omega3EpaG: 0, omega3DhaG: 0, omega6G: 1.3,
    },
    proteinQuality: { method: "DIAAS", score: 0.75, isComplete: true, sourceIds: ["young_soy_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.4, phytateLoad: "moderate", oxalateLoad: "low", lectinLoad: "none",
      b12Status: "inactive_analog", retinolStatus: "absent", epaDhaStatus: "absent", sourceIds: ["watanabe_b12_algae", "nih_b12"],
    },
    bioactives: {
      items: [
        { name: { de: "Phycocyanin", en: "Phycocyanin" }, presence: "high" },
        { name: { de: "Inaktives B12-Pseudovitamin", en: "Inactive B12 pseudovitamin" }, presence: "high", note: { de: "Nicht als B12-Quelle verwenden", en: "Do not use as B12 source" } },
      ],
      sourceIds: ["watanabe_b12_algae"],
    },
    preparation: {
      requiredSteps: [{ de: "Kontaminationsrisiko — nur geprüfte Quellen", en: "Contamination risk — certified sources only" }],
      stability: "moderate", heatLability: { de: "Empfindlich gegen Oxidation", en: "Sensitive to oxidation" },
      yieldNotes: { de: "Hohe Protein-Dichte, aber B12-Analoga irreführend", en: "High protein density, but B12 analogs misleading" },
      sourceIds: ["watanabe_b12_algae"],
    },
    dataFlags: ["contested"], sourceIds: ["usda_fdc", "watanabe_b12_algae"],
  },

  // ─── MUSCLE MEAT ────────────────────────────────────────────────
  {
    id: "beef-sirloin",
    name: { de: "Rinderfilet/Sirloin", en: "Beef sirloin" },
    kingdom: "animal",
    category: "muscle_meat",
    usdaFdcId: 174032,
    nutrientProfile: {
      energyKcal: 183, proteinG: 26.0, fatG: 8.0, carbsG: 0, fiberG: 0, sugarsG: 0,
      ironMg: 2.5, zincMg: 5.5, calciumMg: 12, magnesiumMg: 25, potassiumMg: 360,
      vitaminCMg: 0, vitaminB12Mcg: 2.5, folateMcg: 9, vitaminAMcgRae: 0,
      vitaminDIu: 0, vitaminEMg: 0.3, vitaminKMcg: 1.5, omega3AlaG: 0.04, omega3EpaG: 0.02, omega3DhaG: 0, omega6G: 0.3,
    },
    proteinQuality: { method: "DIAAS", score: 1.12, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "heme", ironAbsorptionModifier: 1.0, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "absent", epaDhaStatus: "absent", sourceIds: ["nih_iron", "nih_b12", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Kreatin", en: "Creatine" }, presence: "high" },
        { name: { de: "Carnosin", en: "Carnosine" }, presence: "high" },
        { name: { de: "Taurin", en: "Taurine" }, presence: "moderate" },
      ],
      sourceIds: ["usda_fdc", "dge_referenz"],
    },
    preparation: {
      requiredSteps: [{ de: "Kerntemperatur für Sicherheit", en: "Core temperature for safety" }],
      stability: "moderate", heatLability: { de: "B12 hitzeempfindlich bei Überkochen", en: "B12 heat-labile with overcooking" },
      yieldNotes: { de: "Vollständiges Protein, Häm-Eisen, präformiertes B12", en: "Complete protein, heme iron, preformed B12" },
      sourceIds: ["fao_diaas"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },
  {
    id: "chicken-breast",
    name: { de: "Hähnchenbrust", en: "Chicken breast" },
    kingdom: "animal",
    category: "muscle_meat",
    usdaFdcId: 171477,
    nutrientProfile: {
      energyKcal: 165, proteinG: 31.0, fatG: 3.6, carbsG: 0, fiberG: 0, sugarsG: 0,
      ironMg: 1.0, zincMg: 1.0, calciumMg: 11, magnesiumMg: 29, potassiumMg: 256,
      vitaminCMg: 0, vitaminB12Mcg: 0.3, folateMcg: 4, vitaminAMcgRae: 6,
      vitaminDIu: 4, vitaminEMg: 0.3, vitaminKMcg: 0, omega3AlaG: 0.02, omega3EpaG: 0.01, omega3DhaG: 0.01, omega6G: 0.7,
    },
    proteinQuality: { method: "DIAAS", score: 1.08, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "heme", ironAbsorptionModifier: 0.9, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "preformed", epaDhaStatus: "absent", sourceIds: ["nih_iron", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Kreatin", en: "Creatine" }, presence: "moderate" },
        { name: { de: "Carnosin", en: "Carnosine" }, presence: "moderate" },
      ],
      sourceIds: ["usda_fdc"],
    },
    preparation: {
      requiredSteps: [],
      stability: "moderate", heatLability: { de: "Standard", en: "Standard" },
      yieldNotes: { de: "Hohe Protein-Effizienz, wenig Fett", en: "High protein efficiency, low fat" },
      sourceIds: ["fao_diaas"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },

  // ─── ORGANS ─────────────────────────────────────────────────────
  {
    id: "beef-liver",
    name: { de: "Rinderleber", en: "Beef liver" },
    kingdom: "animal",
    category: "organs",
    usdaFdcId: 169451,
    nutrientProfile: {
      energyKcal: 135, proteinG: 20.4, fatG: 3.6, carbsG: 3.9, fiberG: 0, sugarsG: 0,
      ironMg: 6.2, zincMg: 4.0, calciumMg: 5, magnesiumMg: 18, potassiumMg: 313,
      vitaminCMg: 1.3, vitaminB12Mcg: 70.7, folateMcg: 290, vitaminAMcgRae: 9442,
      vitaminDIu: 49, vitaminEMg: 0.4, vitaminKMcg: 3.3, omega3AlaG: 0.03, omega3EpaG: 0.02, omega3DhaG: 0.05, omega6G: 0.4,
    },
    proteinQuality: { method: "DIAAS", score: 1.15, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "heme", ironAbsorptionModifier: 1.0, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "preformed", epaDhaStatus: "preformed", sourceIds: ["nih_b12", "nih_vitamin_a", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Cholin", en: "Choline" }, presence: "high" },
        { name: { de: "Coenzym Q10", en: "Coenzyme Q10" }, presence: "moderate" },
        { name: { de: "Copper/Selen", en: "Copper/Selenium" }, presence: "high" },
      ],
      sourceIds: ["usda_fdc", "efsa_drv"],
    },
    preparation: {
      requiredSteps: [{ de: "Portionskontrolle wegen Vitamin-A-Überdosierung", en: "Portion control due to vitamin A hypervitaminosis risk" }],
      stability: "moderate", heatLability: { de: "Folat hitzeempfindlich", en: "Folate heat-labile" },
      yieldNotes: { de: "Dominant auf fast allen Mikronährstoff-Achsen — Retinol/B12/Folat/Eisen", en: "Dominates most micronutrient axes — retinol/B12/folate/iron" },
      sourceIds: ["nih_vitamin_a", "dge_referenz"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },

  // ─── EGGS ───────────────────────────────────────────────────────
  {
    id: "egg-whole",
    name: { de: "Hühnerei, ganz", en: "Chicken egg, whole" },
    kingdom: "animal",
    category: "eggs",
    usdaFdcId: 171287,
    nutrientProfile: {
      energyKcal: 143, proteinG: 12.6, fatG: 9.5, carbsG: 0.7, fiberG: 0, sugarsG: 0.4,
      ironMg: 1.8, zincMg: 1.3, calciumMg: 56, magnesiumMg: 12, potassiumMg: 138,
      vitaminCMg: 0, vitaminB12Mcg: 0.9, folateMcg: 47, vitaminAMcgRae: 160,
      vitaminDIu: 87, vitaminEMg: 1.1, vitaminKMcg: 0.3, omega3AlaG: 0.04, omega3EpaG: 0, omega3DhaG: 0.11, omega6G: 1.2,
    },
    proteinQuality: { method: "DIAAS", score: 1.13, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.85, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "preformed", epaDhaStatus: "preformed", sourceIds: ["nih_b12", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Cholin", en: "Choline" }, presence: "high" },
        { name: { de: "Lutein/Zeaxanthin", en: "Lutein/Zeaxanthin" }, presence: "moderate" },
        { name: { de: "Kreatin", en: "Creatine" }, presence: "low" },
      ],
      sourceIds: ["usda_fdc"],
    },
    preparation: {
      requiredSteps: [],
      stability: "moderate", heatLability: { de: "Biotin-Avidin-Interaktion bei Rohverzehr", en: "Biotin-avidin interaction if raw" },
      yieldNotes: { de: "Referenz-Proteinqualität (DIAAS ~1.13)", en: "Reference protein quality (DIAAS ~1.13)" },
      sourceIds: ["fao_diaas"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },

  // ─── DAIRY ──────────────────────────────────────────────────────
  {
    id: "greek-yogurt",
    name: { de: "Griechischer Joghurt", en: "Greek yogurt" },
    kingdom: "animal",
    category: "dairy",
    usdaFdcId: 170903,
    nutrientProfile: {
      energyKcal: 97, proteinG: 9.0, fatG: 5.0, carbsG: 3.6, fiberG: 0, sugarsG: 3.2,
      ironMg: 0.1, zincMg: 0.5, calciumMg: 110, magnesiumMg: 11, potassiumMg: 141,
      vitaminCMg: 0, vitaminB12Mcg: 0.5, folateMcg: 7, vitaminAMcgRae: 30,
      vitaminDIu: 0, vitaminEMg: 0.1, vitaminKMcg: 0.2, omega3AlaG: 0.01, omega3EpaG: 0, omega3DhaG: 0, omega6G: 0.1,
    },
    proteinQuality: { method: "DIAAS", score: 1.07, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "none", ironAbsorptionModifier: 1, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "preformed", epaDhaStatus: "absent", sourceIds: ["nih_b12", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Probiotische Kulturen", en: "Probiotic cultures" }, presence: "moderate" },
        { name: { de: "Calcium (hoch bioverfügbar)", en: "Calcium (highly bioavailable)" }, presence: "high" },
      ],
      sourceIds: ["usda_fdc", "efsa_drv"],
    },
    preparation: {
      requiredSteps: [],
      stability: "moderate", heatLability: { de: "Probiotika nicht hitzebehandeln", en: "Do not heat-treat probiotics" },
      yieldNotes: { de: "Hohe Protein-/Calcium-Effizienz", en: "High protein/calcium efficiency" },
      sourceIds: ["fao_diaas"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },

  // ─── FISH / SEAFOOD ─────────────────────────────────────────────
  {
    id: "salmon-atlantic",
    name: { de: "Lachs, Atlantik", en: "Atlantic salmon" },
    kingdom: "animal",
    category: "fish_seafood",
    usdaFdcId: 175168,
    nutrientProfile: {
      energyKcal: 208, proteinG: 20.4, fatG: 13.4, carbsG: 0, fiberG: 0, sugarsG: 0,
      ironMg: 0.3, zincMg: 0.6, calciumMg: 9, magnesiumMg: 27, potassiumMg: 363,
      vitaminCMg: 0, vitaminB12Mcg: 3.2, folateMcg: 25, vitaminAMcgRae: 12,
      vitaminDIu: 685, vitaminEMg: 3.6, vitaminKMcg: 0.1, omega3AlaG: 0.1, omega3EpaG: 0.69, omega3DhaG: 1.14, omega6G: 1.7,
    },
    proteinQuality: { method: "DIAAS", score: 1.09, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.8, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "preformed", epaDhaStatus: "preformed", sourceIds: ["nih_omega3", "nih_b12", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Astaxanthin", en: "Astaxanthin" }, presence: "high" },
        { name: { de: "Selen", en: "Selenium" }, presence: "high" },
      ],
      sourceIds: ["usda_fdc"],
    },
    preparation: {
      requiredSteps: [],
      stability: "low", heatLability: { de: "Omega-3 oxidationsanfällig", en: "Omega-3 oxidation-prone" },
      yieldNotes: { de: "Dominant auf EPA/DHA + Vitamin D Achse", en: "Dominates EPA/DHA + vitamin D axis" },
      sourceIds: ["nih_omega3"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },
  {
    id: "sardines-canned",
    name: { de: "Sardinen, in Dose", en: "Sardines, canned" },
    kingdom: "animal",
    category: "fish_seafood",
    usdaFdcId: 175139,
    nutrientProfile: {
      energyKcal: 208, proteinG: 24.6, fatG: 11.5, carbsG: 0, fiberG: 0, sugarsG: 0,
      ironMg: 2.9, zincMg: 1.3, calciumMg: 382, magnesiumMg: 39, potassiumMg: 397,
      vitaminCMg: 0, vitaminB12Mcg: 8.9, folateMcg: 10, vitaminAMcgRae: 32,
      vitaminDIu: 272, vitaminEMg: 2.0, vitaminKMcg: 2.6, omega3AlaG: 0.1, omega3EpaG: 0.47, omega3DhaG: 0.51, omega6G: 0.4,
    },
    proteinQuality: { method: "DIAAS", score: 1.05, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.85, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "preformed", epaDhaStatus: "preformed", sourceIds: ["nih_omega3", "usda_fdc"],
    },
    bioactives: {
      items: [
        { name: { de: "Knochen-Calcium", en: "Bone calcium" }, presence: "high" },
        { name: { de: "Coenzym Q10", en: "Coenzyme Q10" }, presence: "moderate" },
      ],
      sourceIds: ["usda_fdc"],
    },
    preparation: {
      requiredSteps: [],
      stability: "high", heatLability: { de: "Konserven stabil", en: "Canned product stable" },
      yieldNotes: { de: "Praktische EPA/DHA + Calcium + B12 Kombination", en: "Practical EPA/DHA + calcium + B12 combination" },
      sourceIds: ["nih_omega3", "dge_referenz"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },
  {
    id: "oysters-raw",
    name: { de: "Austern, roh", en: "Oysters, raw" },
    kingdom: "animal",
    category: "fish_seafood",
    usdaFdcId: 15166,
    nutrientProfile: {
      energyKcal: 68, proteinG: 7.0, fatG: 2.5, carbsG: 3.9, fiberG: 0, sugarsG: 0,
      ironMg: 6.0, zincMg: 78.6, calciumMg: 59, magnesiumMg: 26, potassiumMg: 156,
      vitaminCMg: 3.0, vitaminB12Mcg: 16.0, folateMcg: 31, vitaminAMcgRae: 30,
      vitaminDIu: 320, vitaminEMg: 0.9, vitaminKMcg: 0.1, omega3AlaG: 0.05, omega3EpaG: 0.35, omega3DhaG: 0.22, omega6G: 0.05,
    },
    proteinQuality: { method: "DIAAS", score: 0.95, isComplete: true, sourceIds: ["fao_diaas", "usda_fdc"] },
    bioavailability: {
      ironType: "non_heme", ironAbsorptionModifier: 0.9, phytateLoad: "none", oxalateLoad: "none", lectinLoad: "none",
      b12Status: "preformed", retinolStatus: "preformed", epaDhaStatus: "preformed", sourceIds: ["usda_fdc", "nih_b12"],
    },
    bioactives: {
      items: [
        { name: { de: "Zink (extrem hoch)", en: "Zinc (extremely high)" }, presence: "high" },
        { name: { de: "Kupfer", en: "Copper" }, presence: "high" },
      ],
      sourceIds: ["usda_fdc", "efsa_drv"],
    },
    preparation: {
      requiredSteps: [{ de: "Frische/Sicherheit beachten", en: "Mind freshness/safety" }],
      stability: "low", heatLability: { de: "Rohverzehr für Zinkmaximierung", en: "Raw for maximum zinc" },
      yieldNotes: { de: "Zink-Champion unter allen Kategorien", en: "Zinc champion across all categories" },
      sourceIds: ["efsa_drv"],
    },
    dataFlags: [], sourceIds: ["usda_fdc"],
  },
];
