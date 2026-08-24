import type { ClassWeights, FoodClass } from "../scoring/types";

/**
 * Class-specific composite weights. Each row sums to 1.00.
 * Fibre is down-weighted for animal classes because absence is expected,
 * not a quality failure — the fibre axis itself still scores 0 honestly.
 */
export const CLASS_WEIGHTS: Record<FoodClass, ClassWeights> = {
  leafy_salad: {
    eaa: 0.08,
    efa: 0.06,
    carb: 0.1,
    micro: 0.22,
    fibre: 0.16,
    residue: 0.18,
    degradation: 0.2,
  },
  legumes: {
    eaa: 0.22,
    efa: 0.08,
    carb: 0.14,
    micro: 0.14,
    fibre: 0.16,
    residue: 0.14,
    degradation: 0.12,
  },
  sprouts: {
    eaa: 0.12,
    efa: 0.06,
    carb: 0.1,
    micro: 0.18,
    fibre: 0.14,
    residue: 0.16,
    degradation: 0.24,
  },
  cruciferous_fresh: {
    eaa: 0.1,
    efa: 0.06,
    carb: 0.12,
    micro: 0.2,
    fibre: 0.18,
    residue: 0.16,
    degradation: 0.18,
  },
  cruciferous_fermented: {
    eaa: 0.1,
    efa: 0.06,
    carb: 0.12,
    micro: 0.16,
    fibre: 0.16,
    residue: 0.14,
    degradation: 0.26,
  },
  mushrooms: {
    eaa: 0.16,
    efa: 0.08,
    carb: 0.1,
    micro: 0.2,
    fibre: 0.12,
    residue: 0.16,
    degradation: 0.18,
  },
  algae: {
    eaa: 0.12,
    efa: 0.16,
    carb: 0.08,
    micro: 0.22,
    fibre: 0.1,
    residue: 0.2,
    degradation: 0.12,
  },
  roots_tubers: {
    eaa: 0.1,
    efa: 0.08,
    carb: 0.22,
    micro: 0.18,
    fibre: 0.14,
    residue: 0.14,
    degradation: 0.14,
  },
  other_vegetables: {
    eaa: 0.1,
    efa: 0.08,
    carb: 0.14,
    micro: 0.2,
    fibre: 0.16,
    residue: 0.16,
    degradation: 0.16,
  },
  muscle_ruminant: {
    eaa: 0.26,
    efa: 0.18,
    carb: 0.06,
    micro: 0.22,
    fibre: 0.04,
    residue: 0.14,
    degradation: 0.1,
  },
  muscle_monogastric: {
    eaa: 0.26,
    efa: 0.16,
    carb: 0.06,
    micro: 0.22,
    fibre: 0.04,
    residue: 0.16,
    degradation: 0.1,
  },
  muscle_poultry: {
    eaa: 0.26,
    efa: 0.14,
    carb: 0.06,
    micro: 0.24,
    fibre: 0.04,
    residue: 0.16,
    degradation: 0.1,
  },
  muscle_fish: {
    eaa: 0.22,
    efa: 0.24,
    carb: 0.06,
    micro: 0.2,
    fibre: 0.04,
    residue: 0.16,
    degradation: 0.08,
  },
  organs: {
    eaa: 0.2,
    efa: 0.12,
    carb: 0.06,
    micro: 0.32,
    fibre: 0.04,
    residue: 0.16,
    degradation: 0.1,
  },
  eggs: {
    eaa: 0.28,
    efa: 0.16,
    carb: 0.06,
    micro: 0.24,
    fibre: 0.04,
    residue: 0.12,
    degradation: 0.1,
  },
  dairy: {
    eaa: 0.24,
    efa: 0.14,
    carb: 0.1,
    micro: 0.22,
    fibre: 0.04,
    residue: 0.14,
    degradation: 0.12,
  },
  fermented_animal: {
    eaa: 0.22,
    efa: 0.16,
    carb: 0.1,
    micro: 0.2,
    fibre: 0.04,
    residue: 0.12,
    degradation: 0.16,
  },
};

export function weightsFor(foodClass: FoodClass): ClassWeights {
  return CLASS_WEIGHTS[foodClass];
}

export function assertWeightsSumToOne(): void {
  const keys = Object.keys(CLASS_WEIGHTS) as FoodClass[];
  for (const key of keys) {
    const row = CLASS_WEIGHTS[key];
    const sum =
      row.eaa +
      row.efa +
      row.carb +
      row.micro +
      row.fibre +
      row.residue +
      row.degradation;
    if (Math.abs(sum - 1) > 1e-9) {
      throw new Error(`Class weights for ${key} sum to ${sum}, not 1`);
    }
  }
}
