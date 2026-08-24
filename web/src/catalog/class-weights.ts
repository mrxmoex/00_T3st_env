import type { FoodClass, ScoreAxis } from "../types/domain.ts";

export type ClassWeights = Readonly<Record<Exclude<ScoreAxis, "composite">, number>>;

function weights(input: ClassWeights): ClassWeights {
  const sum =
    input.eaa_digestibility +
    input.efa_glyceride +
    input.carb_type +
    input.micronutrient_bioavail +
    input.fibre_phyto +
    input.residue_risk +
    input.degradation;
  if (Math.abs(sum - 1) > 1e-9) {
    throw new Error(`Class weights must sum to 1, got ${sum}`);
  }
  return input;
}

const PLANT_LEAFY = weights({
  eaa_digestibility: 0.08,
  efa_glyceride: 0.06,
  carb_type: 0.1,
  micronutrient_bioavail: 0.22,
  fibre_phyto: 0.2,
  residue_risk: 0.18,
  degradation: 0.16,
});

const PLANT_LEGUME = weights({
  eaa_digestibility: 0.22,
  efa_glyceride: 0.06,
  carb_type: 0.16,
  micronutrient_bioavail: 0.16,
  fibre_phyto: 0.16,
  residue_risk: 0.12,
  degradation: 0.12,
});

const PLANT_SPROUT = weights({
  eaa_digestibility: 0.12,
  efa_glyceride: 0.06,
  carb_type: 0.1,
  micronutrient_bioavail: 0.22,
  fibre_phyto: 0.14,
  residue_risk: 0.1,
  degradation: 0.26,
});

const PLANT_KRAUT = weights({
  eaa_digestibility: 0.06,
  efa_glyceride: 0.05,
  carb_type: 0.12,
  micronutrient_bioavail: 0.18,
  fibre_phyto: 0.22,
  residue_risk: 0.15,
  degradation: 0.22,
});

const PLANT_MUSHROOM = weights({
  eaa_digestibility: 0.12,
  efa_glyceride: 0.06,
  carb_type: 0.1,
  micronutrient_bioavail: 0.22,
  fibre_phyto: 0.16,
  residue_risk: 0.16,
  degradation: 0.18,
});

const PLANT_ALGAE = weights({
  eaa_digestibility: 0.12,
  efa_glyceride: 0.18,
  carb_type: 0.08,
  micronutrient_bioavail: 0.2,
  fibre_phyto: 0.1,
  residue_risk: 0.2,
  degradation: 0.12,
});

const PLANT_ROOT = weights({
  eaa_digestibility: 0.08,
  efa_glyceride: 0.06,
  carb_type: 0.28,
  micronutrient_bioavail: 0.18,
  fibre_phyto: 0.14,
  residue_risk: 0.14,
  degradation: 0.12,
});

const PLANT_OTHER = weights({
  eaa_digestibility: 0.08,
  efa_glyceride: 0.08,
  carb_type: 0.14,
  micronutrient_bioavail: 0.22,
  fibre_phyto: 0.16,
  residue_risk: 0.16,
  degradation: 0.16,
});

const ANIMAL_MUSCLE = weights({
  eaa_digestibility: 0.28,
  efa_glyceride: 0.22,
  carb_type: 0.08,
  micronutrient_bioavail: 0.18,
  fibre_phyto: 0.02,
  residue_risk: 0.12,
  degradation: 0.1,
});

const ANIMAL_ORGAN = weights({
  eaa_digestibility: 0.22,
  efa_glyceride: 0.12,
  carb_type: 0.06,
  micronutrient_bioavail: 0.32,
  fibre_phyto: 0.02,
  residue_risk: 0.16,
  degradation: 0.1,
});

const ANIMAL_EGG = weights({
  eaa_digestibility: 0.28,
  efa_glyceride: 0.18,
  carb_type: 0.08,
  micronutrient_bioavail: 0.22,
  fibre_phyto: 0.02,
  residue_risk: 0.1,
  degradation: 0.12,
});

const ANIMAL_DAIRY = weights({
  eaa_digestibility: 0.26,
  efa_glyceride: 0.16,
  carb_type: 0.1,
  micronutrient_bioavail: 0.22,
  fibre_phyto: 0.02,
  residue_risk: 0.12,
  degradation: 0.12,
});

const ANIMAL_FERMENTED = weights({
  eaa_digestibility: 0.24,
  efa_glyceride: 0.14,
  carb_type: 0.1,
  micronutrient_bioavail: 0.22,
  fibre_phyto: 0.04,
  residue_risk: 0.12,
  degradation: 0.14,
});

export function classWeights(foodClass: FoodClass): ClassWeights {
  switch (foodClass) {
    case "leafy_salad":
      return PLANT_LEAFY;
    case "legumes_beans":
      return PLANT_LEGUME;
    case "sprouts":
      return PLANT_SPROUT;
    case "cruciferous_kraut":
      return PLANT_KRAUT;
    case "mushrooms":
      return PLANT_MUSHROOM;
    case "algae_seaweed":
      return PLANT_ALGAE;
    case "roots_tubers":
      return PLANT_ROOT;
    case "other_vegetables":
      return PLANT_OTHER;
    case "muscle_ruminant":
    case "muscle_monogastric":
    case "muscle_poultry":
    case "muscle_fish":
      return ANIMAL_MUSCLE;
    case "organs":
      return ANIMAL_ORGAN;
    case "eggs":
      return ANIMAL_EGG;
    case "dairy":
      return ANIMAL_DAIRY;
    case "fermented_animal":
      return ANIMAL_FERMENTED;
    default: {
      const _exhaustive: never = foodClass;
      return _exhaustive;
    }
  }
}
