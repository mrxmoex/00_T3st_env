import type {
  AnimalExclusiveCompounds,
  CarbsGPer100g,
  FattyAcidsGPer100g,
  FoodRecord,
} from "../../scoring/types";

export const ZERO_ANIMAL: AnimalExclusiveCompounds = {
  creatineMg: 0,
  taurineMg: 0,
  carnosineMg: 0,
};

export const NEGLIGIBLE_FAT: FattyAcidsGPer100g = {
  sfa: 0.05,
  mufa: 0.02,
  pufa: 0.08,
  omega3Ala: 0.05,
  omega3Epa: 0,
  omega3Dha: 0,
  omega6La: 0.04,
  omega6Aa: 0,
  oddChain: 0,
  cla: 0,
};

export function defineFood(food: FoodRecord): FoodRecord {
  return food;
}

export function carbs(parts: CarbsGPer100g): CarbsGPer100g {
  return parts;
}
