/**
 * Adult reference intakes used to normalize nutrient density.
 * Values are DGE/ÖGE 2025 where the reference exists; EFSA fills gaps.
 * These are comparison anchors, not personal prescriptions.
 */

export type AdultRef = {
  readonly id: string;
  readonly amount: number;
  readonly unit: string;
  readonly sourceId: string;
  readonly year: number;
  readonly note: string;
};

export const ADULT_REFS = {
  proteinG: {
    id: "proteinG",
    amount: 58,
    unit: "g",
    sourceId: "dge-protein-2021",
    year: 2021,
    note: "0.8 g/kg for a 72 kg adult <65 y (DGE).",
  },
  fiberG: {
    id: "fiberG",
    amount: 30,
    unit: "g",
    sourceId: "dge-fibre",
    year: 2021,
    note: "DGE adult fibre guideline 30 g/d; EFSA AI 25 g/d.",
  },
  ironMg: {
    id: "ironMg",
    amount: 11,
    unit: "mg",
    sourceId: "efsa-iron-2015",
    year: 2015,
    note: "EFSA adult male PRI region; vegetarians need more absorbed iron (NIH 1.8×).",
  },
  zincMg: {
    id: "zincMg",
    amount: 11,
    unit: "mg",
    sourceId: "dge-ref-2025",
    year: 2025,
    note: "DGE zinc depends on phytate; 11 mg used as mixed-diet anchor.",
  },
  calciumMg: {
    id: "calciumMg",
    amount: 1000,
    unit: "mg",
    sourceId: "dge-ref-2025",
    year: 2025,
    note: "DGE adult calcium reference.",
  },
  magnesiumMg: {
    id: "magnesiumMg",
    amount: 350,
    unit: "mg",
    sourceId: "dge-ref-2025",
    year: 2021,
    note: "DGE adult magnesium (male band).",
  },
  potassiumMg: {
    id: "potassiumMg",
    amount: 4000,
    unit: "mg",
    sourceId: "dge-ref-2025",
    year: 2016,
    note: "DGE potassium estimate.",
  },
  vitaminCMg: {
    id: "vitaminCMg",
    amount: 110,
    unit: "mg",
    sourceId: "dge-ref-2025",
    year: 2015,
    note: "DGE adult male vitamin C.",
  },
  thiaminMg: {
    id: "thiaminMg",
    amount: 1.2,
    unit: "mg",
    sourceId: "dge-ref-2025",
    year: 2025,
    note: "DGE/EFSA adult thiamin band.",
  },
  folateUg: {
    id: "folateUg",
    amount: 300,
    unit: "µg",
    sourceId: "dge-ref-2025",
    year: 2018,
    note: "DGE folate 300 µg; EFSA 330 µg DFE.",
  },
  b12Ug: {
    id: "b12Ug",
    amount: 4,
    unit: "µg",
    sourceId: "dge-b12-2018",
    year: 2018,
    note: "DGE adult adequate intake 4.0 µg; EFSA AI 4 µg.",
  },
  vitaminARaeUg: {
    id: "vitaminARaeUg",
    amount: 850,
    unit: "µg RAE",
    sourceId: "dge-ref-2025",
    year: 2020,
    note: "DGE adult male vitamin A band.",
  },
  vitaminDUg: {
    id: "vitaminDUg",
    amount: 20,
    unit: "µg",
    sourceId: "dge-ref-2025",
    year: 2025,
    note: "DGE vitamin D estimate when endogenous synthesis is insufficient.",
  },
  vitaminEMg: {
    id: "vitaminEMg",
    amount: 14,
    unit: "mg",
    sourceId: "dge-ref-2025",
    year: 2025,
    note: "DGE adult vitamin E (3rd ed. 2025 revision).",
  },
  vitaminKUg: {
    id: "vitaminKUg",
    amount: 70,
    unit: "µg",
    sourceId: "efsa-drv-2017",
    year: 2017,
    note: "EFSA vitamin K AI band.",
  },
  seleniumUg: {
    id: "seleniumUg",
    amount: 70,
    unit: "µg",
    sourceId: "dge-ref-2025",
    year: 2015,
    note: "DGE adult selenium.",
  },
  epaDhaMg: {
    id: "epaDhaMg",
    amount: 250,
    unit: "mg",
    sourceId: "efsa-drv-2017",
    year: 2017,
    note: "EFSA adult AI for EPA+DHA 250 mg/d.",
  },
} as const satisfies Record<string, AdultRef>;

/** NIH ODS: ALA → EPA+DHA conversion is very limited, reported <15%. */
export const ALA_TO_LC_OMEGA3_FACTOR = 0.08;

export const AXIS_WEIGHTS = {
  nutrient_density: 0.18,
  protein_quality: 0.18,
  efa_profile: 0.14,
  carb_quality: 0.12,
  bioavailability: 0.16,
  bioactives: 0.12,
  practical_efficiency: 0.1,
} as const;
