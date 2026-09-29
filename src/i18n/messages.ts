import type { Gap } from "../recommend/engine";
import type { AxisKey, ClassWeights, DietaryPattern, FoodClass, Kingdom, Tier } from "../scoring/types";

export interface Messages {
  nav: {
    label: string;
    matrix: string;
    compare: string;
    recommend: string;
    method: string;
    limits: string;
  };
  brandTagline: (version: string) => string;
  footer: (lastVerified: string) => string;
  theme: { toggle: string; light: string; dark: string };
  languageLabel: string;
  matrix: {
    lede: string;
    exportCsv: string;
    exportJson: string;
    inView: (count: number) => string;
    legend: string;
    patternNote: (pattern: string) => string;
  };
  filters: {
    search: string;
    searchPlaceholder: string;
    kingdom: string;
    allClasses: string;
    plantOnly: string;
    animalOnly: string;
    foodClass: string;
    all: string;
    pattern: string;
    sortAxis: string;
    preparation: string;
    allPreparations: string;
  };
  table: { food: string; class: string; tier: string; axis: string };
  food: {
    unknown: string;
    back: string;
    lede: (info: {
      altName: string;
      preparation: string;
      source: string;
      kcal: number;
      tier: Tier;
      rank: number;
      size: number;
    }) => string;
    radarTitle: (name: string) => string;
    eaaSummary: (info: {
      aas: number;
      diaas: number;
      pdcaas: number;
      limiting: string;
      digestibility: number;
    }) => string;
    fatsCarbsMicros: string;
    microLine: (info: { rae: number; iron: number; zinc: number; b12: number | null }) => string;
    classColumns: string;
    weights: (classLabel: string, weights: ClassWeights) => string;
    notes: string;
    compareCta: string;
    preparationsHeading: string;
    preparationsLede: string;
    preparationsCompare: string;
    nutrientsHeading: string;
    nutrientsHint: string;
    nutrientGroups: {
      macros: string;
      diet: string;
      vitamins: string;
      minerals: string;
      aminoAcids: string;
      fattyAcids: string;
    };
    dietHint: string;
    columns: { nutrient: string; per100g: string; pctDv: string; source: string };
    notReported: string;
    patternNote: (foodName: string) => string;
  };
  compare: {
    title: string;
    lede: string;
    slot: (position: number) => string;
    classTier: (classLabel: string, tier: Tier) => string;
    eaaLine: (info: { aas: number; diaas: number; limiting: string }) => string;
    compoundLine: (info: { creatineMg: number; fibreG: number; b12Ug: number | null }) => string;
    radarHeading: string;
    radarTitle: string;
    microHeading: string;
    microHint: string;
  };
  recommend: {
    title: string;
    lede: string;
    pattern: string;
    practices: string;
    suggested: string;
    plate: string;
    plateHint: string;
  };
  severity: Record<Gap["severity"], string>;
  method: {
    title: string;
    /** Backticked spans render as code. */
    lede: (version: string, lastVerified: string) => string;
    dataHeading: string;
    dataPrimary: string;
    /** Backticked spans render as code. */
    dataScript: string;
    dataMissing: string;
    dataPreparation: string;
    eaaHeading: string;
    eaaPattern: string;
    eaaRatios: string;
    eaaAxis: string;
    eaaNote: string;
    efaHeading: string;
    efaConversion: (alaToDha: string, alaToEpa: string) => string;
    efaAxis: string;
    efaFatFree: string;
    carbHeading: string;
    carbSplit: string;
    carbCombined: string;
    microHeading: string;
    microAbsorption: (values: {
      heme: number;
      nonhemeBase: number;
      nonhemeWithVitaminC: number;
      nonhemeHighPhytate: number;
      zincAnimal: number;
      zincPhytate: number;
      zincLowPhytate: number;
      hemeSharePct: number;
    }) => string;
    microRae: (betaCarotene: string, otherCarotenoids: string) => string;
    /** Backticked spans render as code. */
    microDensity: (saturationPct: number) => string;
    microUpperLimit: string;
    microTable: { nutrient: string; dailyValue: string; upperLimit: string };
    fibreHeading: string;
    fibreNote: string;
    residueHeading: string;
    residueNote: string;
    degradationHeading: string;
    degradationNote: string;
    compositeHeading: string;
    compositeNote: string;
  };
  limits: {
    title: string;
    lede: string;
    nonClaimsHeading: string;
    nonClaims: readonly string[];
    willDoHeading: string;
    willDo: readonly string[];
  };
  source: {
    summary: string;
    dataset: (version: string, lastVerified: string) => string;
    updatePath: string;
    general: readonly string[];
    link: string;
    entriesHeading: string;
    primary: string;
    matchSame: string;
    matchSimilar: string;
    fills: (nutrients: string) => string;
    datasetsHeading: string;
    curatedHeading: string;
    cardLine: (info: {
      aas: number;
      diaas: number;
      pdcaas: number;
      limiting: string;
      rae: number;
      iron: number;
    }) => string;
  };
  classes: Record<FoodClass, string>;
  axes: Record<AxisKey, string>;
  axesShort: Record<AxisKey, string>;
  patterns: Record<DietaryPattern, string>;
  kingdoms: Record<Kingdom, string>;
  tiers: Record<Tier, string>;
  /** Keyed by the column ids returned from `classExtraColumns`. */
  extras: Readonly<Record<string, string>>;
}
