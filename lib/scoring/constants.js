/**
 * Auditable constants for the Efficiency-Value-Nutrition engine.
 * Every magic number here is cited in docs/scoring-formulas.md.
 */

/** FAO 2013 DIAAS amino-acid scoring pattern, mg / g protein. */
export const FAO_2013_DIAAS_REF_MG_PER_G = Object.freeze({
  his: 16,
  ile: 30,
  leu: 61,
  lys: 48,
  saa: 23,
  aaa: 41,
  thr: 25,
  trp: 6.6,
  val: 40,
});

/**
 * Combined ALA → EPA+DHA conversion efficiency used for scoring.
 * Typical human conversion is ~5–10% to EPA and <1% to DHA.
 * We use 0.08 and never treat ALA as interchangeable with preformed LC n-3.
 */
export const ALA_TO_EPA_DHA_CONVERSION = 0.08;

/** Extra haircut on carotenoid-derived RAE vs preformed retinol. */
export const CAROTENOID_RAE_UNCERTAINTY = 0.5;

/** Typical fractional absorption coefficients. */
export const IRON_HEME_ABSORPTION = 0.25;
export const IRON_NONHEME_ABSORPTION_BASE = 0.08;

export const AXIS_KEYS = Object.freeze([
  "eaa",
  "efa",
  "carbs",
  "micros",
  "fibrePhyto",
  "residue",
  "degradation",
]);

export const CLASS_IDS = Object.freeze([
  "leafy_salad",
  "legumes",
  "sprouts",
  "cruciferous_kraut",
  "mushrooms",
  "algae",
  "roots_tubers",
  "other_vegetables",
  "muscle_ruminant",
  "muscle_monogastric",
  "muscle_poultry",
  "muscle_fish",
  "organs",
  "eggs",
  "dairy",
  "fermented_animal",
]);

/**
 * Class-specific composite weights. Each row sums to 1.
 * Animal classes keep fibre/phytochemical weight tiny so a real biochemical
 * absence is visible on that axis without tanking the food's job.
 */
export const CLASS_WEIGHTS = Object.freeze({
  leafy_salad: Object.freeze({
    eaa: 0.08,
    efa: 0.05,
    carbs: 0.1,
    micros: 0.22,
    fibrePhyto: 0.2,
    residue: 0.15,
    degradation: 0.2,
  }),
  legumes: Object.freeze({
    eaa: 0.22,
    efa: 0.06,
    carbs: 0.12,
    micros: 0.15,
    fibrePhyto: 0.18,
    residue: 0.12,
    degradation: 0.15,
  }),
  sprouts: Object.freeze({
    eaa: 0.12,
    efa: 0.08,
    carbs: 0.12,
    micros: 0.18,
    fibrePhyto: 0.18,
    residue: 0.14,
    degradation: 0.18,
  }),
  cruciferous_kraut: Object.freeze({
    eaa: 0.08,
    efa: 0.1,
    carbs: 0.14,
    micros: 0.16,
    fibrePhyto: 0.24,
    residue: 0.14,
    degradation: 0.14,
  }),
  mushrooms: Object.freeze({
    eaa: 0.14,
    efa: 0.08,
    carbs: 0.12,
    micros: 0.2,
    fibrePhyto: 0.16,
    residue: 0.14,
    degradation: 0.16,
  }),
  algae: Object.freeze({
    eaa: 0.1,
    efa: 0.2,
    carbs: 0.08,
    micros: 0.22,
    fibrePhyto: 0.12,
    residue: 0.16,
    degradation: 0.12,
  }),
  roots_tubers: Object.freeze({
    eaa: 0.1,
    efa: 0.12,
    carbs: 0.2,
    micros: 0.16,
    fibrePhyto: 0.14,
    residue: 0.12,
    degradation: 0.16,
  }),
  other_vegetables: Object.freeze({
    eaa: 0.1,
    efa: 0.08,
    carbs: 0.14,
    micros: 0.18,
    fibrePhyto: 0.18,
    residue: 0.14,
    degradation: 0.18,
  }),
  muscle_ruminant: Object.freeze({
    eaa: 0.28,
    efa: 0.22,
    carbs: 0.04,
    micros: 0.18,
    fibrePhyto: 0.04,
    residue: 0.12,
    degradation: 0.12,
  }),
  muscle_monogastric: Object.freeze({
    eaa: 0.28,
    efa: 0.2,
    carbs: 0.04,
    micros: 0.18,
    fibrePhyto: 0.04,
    residue: 0.14,
    degradation: 0.12,
  }),
  muscle_poultry: Object.freeze({
    eaa: 0.3,
    efa: 0.16,
    carbs: 0.04,
    micros: 0.18,
    fibrePhyto: 0.04,
    residue: 0.14,
    degradation: 0.14,
  }),
  muscle_fish: Object.freeze({
    eaa: 0.24,
    efa: 0.28,
    carbs: 0.04,
    micros: 0.18,
    fibrePhyto: 0.04,
    residue: 0.12,
    degradation: 0.1,
  }),
  organs: Object.freeze({
    eaa: 0.24,
    efa: 0.14,
    carbs: 0.04,
    micros: 0.32,
    fibrePhyto: 0.04,
    residue: 0.12,
    degradation: 0.1,
  }),
  eggs: Object.freeze({
    eaa: 0.28,
    efa: 0.2,
    carbs: 0.04,
    micros: 0.2,
    fibrePhyto: 0.04,
    residue: 0.1,
    degradation: 0.14,
  }),
  dairy: Object.freeze({
    eaa: 0.24,
    efa: 0.16,
    carbs: 0.08,
    micros: 0.2,
    fibrePhyto: 0.04,
    residue: 0.12,
    degradation: 0.16,
  }),
  fermented_animal: Object.freeze({
    eaa: 0.24,
    efa: 0.16,
    carbs: 0.08,
    micros: 0.2,
    fibrePhyto: 0.04,
    residue: 0.1,
    degradation: 0.18,
  }),
});

export const CLASS_META = Object.freeze({
  leafy_salad: Object.freeze({
    label: "Leafy / salad greens",
    kingdom: "plant",
    group: "plant",
  }),
  legumes: Object.freeze({
    label: "Legumes / beans",
    kingdom: "plant",
    group: "plant",
  }),
  sprouts: Object.freeze({
    label: "Sprouts",
    kingdom: "plant",
    group: "plant",
  }),
  cruciferous_kraut: Object.freeze({
    label: "Cruciferous / kraut",
    kingdom: "plant",
    group: "plant",
  }),
  mushrooms: Object.freeze({
    label: "Mushrooms (Schroom)",
    kingdom: "fungi",
    group: "plant",
  }),
  algae: Object.freeze({
    label: "Algae / seaweed",
    kingdom: "algae",
    group: "plant",
  }),
  roots_tubers: Object.freeze({
    label: "Roots & tubers",
    kingdom: "plant",
    group: "plant",
  }),
  other_vegetables: Object.freeze({
    label: "Other vegetables",
    kingdom: "plant",
    group: "plant",
  }),
  muscle_ruminant: Object.freeze({
    label: "Muscle — ruminant",
    kingdom: "animal",
    group: "animal",
  }),
  muscle_monogastric: Object.freeze({
    label: "Muscle — monogastric",
    kingdom: "animal",
    group: "animal",
  }),
  muscle_poultry: Object.freeze({
    label: "Muscle — poultry",
    kingdom: "animal",
    group: "animal",
  }),
  muscle_fish: Object.freeze({
    label: "Muscle — fish",
    kingdom: "animal",
    group: "animal",
  }),
  organs: Object.freeze({
    label: "Organs",
    kingdom: "animal",
    group: "animal",
  }),
  eggs: Object.freeze({
    label: "Eggs",
    kingdom: "animal",
    group: "animal",
  }),
  dairy: Object.freeze({
    label: "Dairy",
    kingdom: "animal",
    group: "animal",
  }),
  fermented_animal: Object.freeze({
    label: "Fermented animal products",
    kingdom: "animal",
    group: "animal",
  }),
});

/** Adult reference intakes used only for density scoring, not as medical RDAs. */
export const DENSITY_REFS = Object.freeze({
  ironMg: 14,
  zincMg: 11,
  vitaminARaeUg: 800,
  b12Ug: 2.4,
  folateUg: 400,
  vitaminCMg: 90,
  vitaminDUg: 15,
  calciumMg: 1000,
  seleniumUg: 55,
  iodineUg: 150,
  cholineMg: 550,
  magnesiumMg: 350,
  potassiumMg: 3500,
});
