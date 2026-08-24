import type {
  AntiNutrientLoad,
  Bioactive,
  Localized,
  NutrientPanel,
  PracticalProfile,
  ResidueProfile,
  SeedFood,
} from "@/types/catalog";

export function L(en: string, de: string): Localized {
  return { en, de };
}

export function panel(partial: Partial<NutrientPanel> & Pick<NutrientPanel, "energyKcal" | "proteinG" | "fatG" | "carbG">): NutrientPanel {
  return {
    fiberG: null,
    sugarsG: null,
    starchG: null,
    resistantStarchG: null,
    waterG: null,
    naMg: null,
    caMg: null,
    feMg: null,
    znMg: null,
    mgMg: null,
    kMg: null,
    vitCMg: null,
    thiaminMg: null,
    folateUg: null,
    vitB12Ug: null,
    vitARaeUg: null,
    retinolUg: null,
    betaCaroteneUg: null,
    vitKUg: null,
    vitDUg: null,
    alaG: null,
    epaG: null,
    dhaG: null,
    omega6G: null,
    ...partial,
  };
}

export function anti(
  phytate: AntiNutrientLoad["phytate"],
  oxalate: AntiNutrientLoad["oxalate"],
  lectin: AntiNutrientLoad["lectin"],
  poly: AntiNutrientLoad["polyphenolMineralBind"],
  mitigation: Localized,
  sourceIds: string[] = ["nih-iron"],
): AntiNutrientLoad {
  return { phytate, oxalate, lectin, polyphenolMineralBind: poly, mitigation, sourceIds };
}

export function residue(
  surfaceClass: ResidueProfile["surfaceClass"],
  typicalLoad: ResidueProfile["typicalLoad"],
  note: Localized,
): ResidueProfile {
  return {
    surfaceClass,
    typicalLoad,
    note,
    sourceIds: typicalLoad === "not-applicable" ? ["usda-pdp-2024"] : ["usda-pdp-2024", "efsa-residues-2024"],
  };
}

export function practical(
  prepBurden: PracticalProfile["prepBurden"],
  storageStability: PracticalProfile["storageStability"],
  heatLabileLoss: PracticalProfile["heatLabileLoss"],
  note: Localized,
): PracticalProfile {
  return { prepBurden, storageStability, heatLabileLoss, note };
}

export function bio(
  id: string,
  name: Localized,
  presence: Bioactive["presence"],
  note: Localized,
  sourceIds: string[],
): Bioactive {
  return { id, name, presence, note, sourceIds };
}

export function food(seed: SeedFood): SeedFood {
  return seed;
}
