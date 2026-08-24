import type {
  AminoAcidProfile,
  AnimalClass,
  AnimalFood,
  ExclusiveCompounds,
  FattyAcidProfile,
  PlantClass,
  PlantFood,
} from "../types";

export const ZERO_EXCLUSIVE: ExclusiveCompounds = {
  creatineMg: 0,
  taurineMg: 0,
  carnosineMg: 0,
};

export const ZERO_FAT: FattyAcidProfile = {
  sfa: 0,
  mufa: 0,
  pufa: 0,
  ala: 0,
  epa: 0,
  dha: 0,
  la: 0,
  aa: 0,
  oddChain: 0,
  cla: 0,
};

export function aa(
  his: number,
  ile: number,
  leu: number,
  lys: number,
  met: number,
  cys: number,
  phe: number,
  tyr: number,
  thr: number,
  trp: number,
  val: number,
): AminoAcidProfile {
  return { his, ile, leu, lys, met, cys, phe, tyr, thr, trp, val };
}

export function plantFood(
  foodClass: PlantClass,
  rest: Omit<PlantFood, "kingdom" | "foodClass" | "exclusive"> & {
    exclusive?: ExclusiveCompounds;
  },
): PlantFood {
  const { exclusive, ...base } = rest;
  return {
    kingdom: "plant",
    foodClass,
    exclusive: exclusive ?? ZERO_EXCLUSIVE,
    ...base,
  };
}

export function animalFood(
  foodClass: AnimalClass,
  rest: Omit<AnimalFood, "kingdom" | "foodClass">,
): AnimalFood {
  return {
    kingdom: "animal",
    foodClass,
    ...rest,
  };
}
