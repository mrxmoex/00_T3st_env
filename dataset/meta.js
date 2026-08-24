export const datasetMeta = {
  id: "dbwdi-core",
  title: "Du bist was du isst",
  version: "1.0.0",
  verifiedAt: "2026-08-24",
  engineVersion: "1.0.0",
  locale: "de-en",
  license: "Public domain data interpretations; app code MIT",
  description:
    "Versioned nutrient matrix for class-honest scoring. Values are per 100 g edible portion unless noted.",
  primaryStandards: [
    {
      id: "usda-fdc",
      name: "USDA FoodData Central",
      url: "https://fdc.nal.usda.gov/",
      role: "Proximate, vitamin, mineral, and many amino-acid values",
    },
    {
      id: "fao-2013-diaas",
      name: "FAO Expert Consultation 2013 — Dietary protein quality evaluation in human nutrition",
      url: "https://www.fao.org/ag/humannutrition/35978-02317b979a686a57aa4593304ffc17f06.pdf",
      role: "DIAAS reference pattern and digestibility framing",
    },
    {
      id: "who-fao-ununu-protein",
      name: "WHO/FAO/UNU protein and amino acid requirements",
      url: "https://www.who.int/publications/i/item/9241209356",
      role: "EAA requirement context",
    },
    {
      id: "efsa-drv",
      name: "EFSA Dietary Reference Values",
      url: "https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values",
      role: "Micronutrient reference densities used only for scoring, not medical advice",
    },
    {
      id: "iom-vitamina",
      name: "IOM/NASEM vitamin A RAE conversion",
      url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
      role: "12:1 / 24:1 carotenoid RAE plus extra engine uncertainty haircut",
    },
    {
      id: "hurrell-egli-iron",
      name: "Hurrell & Egli iron bioavailability reviews",
      url: "https://pubmed.ncbi.nlm.nih.gov/20200263/",
      role: "Heme vs non-heme absorption coefficients",
    },
    {
      id: "iZiNCG-zinc",
      name: "IZiNCG / WHO phytate:zinc molar ratio guidance",
      url: "https://www.izincg.org/",
      role: "Zinc bioavailability bands",
    },
    {
      id: "eu-mrl",
      name: "EU pesticide MRL database / US EPA tolerances",
      url: "https://ec.europa.eu/food/plant/pesticides/eu-pesticides-database/start/screen/mrls",
      role: "Residue risk is a class-typical index, not a lot-specific lab result",
    },
  ],
  flaggedAsEstimated: [
    "Most EAA profiles not published as complete FDC panels are marked estimated",
    "Residue indices are class-typical, not batch measurements",
    "Degradation indices are biochemical heuristics (water-soluble vitamins, cut surface, heat, PUFA)",
    "Creatine, taurine, carnosine, odd-chain fats, and CLA are literature-typical where FDC is silent",
  ],
  futureExtensions: ["supplements", "processedFood", "bloodworkOverlay"],
};
