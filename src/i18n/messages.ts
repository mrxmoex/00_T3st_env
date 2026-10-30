import type { Gap } from "../recommend/engine";
import type { NutrientBasis } from "../scoring/generalNutrients";
import type { Activity, SweatLevel } from "../person/context";
import type {
  AxisKey,
  ClassWeights,
  DietaryPattern,
  FoodClass,
  Kingdom,
  NovaGroup,
  Tier,
} from "../scoring/types";

export interface Messages {
  nav: {
    label: string;
    matrix: string;
    compare: string;
    recommend: string;
    method: string;
    exposure: string;
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
    benefitsHeading: string;
    burdensHeading: string;
    fatsCarbsMicros: string;
    microLine: (info: { rae: number; iron: number; zinc: number; calcium: number | null; b12: number | null }) => string;
    bioactivesHeading: string;
    bioactivesLede: string;
    bioactiveColumns: { compound: string; content: string; measured: string; source: string };
    bioactiveStatus: { notDetected: string; notExpected: string; noData: string };
    bioactiveRawValue: string;
    bioactiveDryWeight: string;
    bioactiveRange: (min: string, max: string) => string;
    burden: {
      heading: string;
      lede: string;
      processingHeading: string;
      nova: (group: NovaGroup, label: string) => string;
      novaMeaning: Record<NovaGroup, string>;
      capped: (from: string, to: string) => string;
      evidence: (info: { where: string; classified: number; nova4: number; nova3: number; retrieved: string }) => string;
      evidenceAll: string;
      evidenceGermany: string;
      additives: (products: number) => string;
      retention: (info: { reference: string; kept: number; details: string }) => string;
      sodium: (info: { reference: string; from: string; to: string }) => string;
      residuesHeading: string;
      hormones: string;
      accumulation: string;
      storageHeading: string;
      storage: (nutrients: string) => string;
    };
    classColumns: string;
    weights: (classLabel: string, weights: ClassWeights) => string;
    notes: string;
    compareCta: string;
    preparationsHeading: string;
    preparationsLede: string;
    preparationsProcessing: string;
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
    columns: { nutrient: string; per100g: string; available: string; pctDv: string; store: string; source: string };
    notReported: string;
    patternNote: (foodName: string) => string;
    sourcingHeading: string;
    sourcingPreparation: string;
    sourcingResidues: string;
    qualityHeading: string;
    treatBadge: string;
    treatNote: string;
    treatIngredients: (info: { median: number; over: number; known: number }) => string;
    digestionHeading: string;
    digestionGi: string;
    digestionLoad: (load: number) => string;
    digestionBands: { low: string; medium: string; high: string };
    digestionTooLittle: (carbG: number) => string;
    digestionNoGi: string;
    digestionCarried: string;
    digestionFerment: string;
    digestionLactose: (g: number) => string;
    digestionNoFermentData: string;
    digestionSpongy: string;
    digestionMatrix: string;
    digestionMilieu: string;
    digestionMetabolism: string;
    digestionSources: string;
  };
  person: {
    heading: string;
    lede: string;
    sex: string;
    female: string;
    male: string;
    age: string;
    weight: string;
    height: string;
    activity: string;
    activities: Record<Activity, string>;
    sweat: string;
    sweatLevels: Record<SweatLevel, string>;
    apply: string;
    clear: string;
    summary: (info: { energy: number; protein: number; sodiumLow: number; sodiumHigh: number }) => string;
    coverageHeading: string;
    coverage: (info: {
      energyPct: number;
      proteinG: number;
      proteinRef: number;
      sodiumMg: number;
      sodiumLow: number;
      sodiumHigh: number;
    }) => string;
    notAllowance: string;
  };
  compare: {
    title: string;
    lede: string;
    slot: (position: number) => string;
    classTier: (classLabel: string, tier: Tier) => string;
    eaaLine: (info: { aas: number; diaas: number; limiting: string }) => string;
    novaLine: (group: NovaGroup, label: string) => string;
    honors: {
      creatine: (mg: string) => string;
      fibre: (g: string) => string;
      b12: (ug: string) => string;
      taurine: (mg: string) => string;
      glucosinolates: (mg: string) => string;
    };
    honorsEmpty: string;
    bioactivesHeading: string;
    bioactivesHint: string;
    /** Keys for the marks on compound amounts; each shows only when its mark is on screen. */
    bioactiveMarkers: { raw: string; notDetected: string };
    bioactivesProfileLede: string;
    bioactivesProfileEmpty: string;
    notDetectedShort: string;
    radarHeading: string;
    radarTitle: string;
    axisRadarHint: string;
    axisRadarMethodLink: string;
    radarProteinShort: { pattern: string; digest: string; density: string };
    radarProteinLabels: { pattern: string; digest: string; density: string };
    radarProteinTips: {
      pattern: (info: { food: string; aas: number; diaas: number }) => string;
      digest: (info: { food: string; digestibility: number; diaas: number }) => string;
      density: (info: { food: string; proteinG: number }) => string;
    };
    radarProteinLegendHeading: string;
    radarProteinLegendLine: (info: { aas: number; diaas: number; limiting: string }) => string;
    nutrientRadarHeading: string;
    nutrientRadarTitle: (basis: string) => string;
    nutrientRadarHint: (info: { basis: NutrientBasis; rings: string }) => string;
    macroShareToggleLabel: string;
    macroShareBasis: { g: string; kcal: string };
    macroShareCaption: (info: { protein: string; fat: string; carb: string; other: string }) => string;
    macroLegendHeading: string;
    macroLegend: { protein: string; fat: string; carb: string; other: string };
    massCompositionHeading: string;
    massCompositionTitle: (info: {
      food: string;
      water: string;
      protein: string;
      fat: string;
      carbs: string;
    }) => string;
    massCompositionLegend: { water: string; protein: string; fat: string; carbs: string; other: string };
    carbRowLabel: string;
    carbLegendHeading: string;
    carbLegend: { sugar: string; starch: string; passive: string; none: string; size: (fullG: number) => string };
    carbQuietScore: string;
    carbPie: {
      quiet: string;
      noneSymbol: string;
      title: (info: { sugar: string; starch: string; passive: string }) => string;
    };
    necessityImpactMethodLink: string;
    digestibilityDefinition: string;
    degradationRowHint: string;
    nutrientShort: Record<"protein" | "fat" | "carbs", string>;
    nutrientRows: {
      protein: string;
      fat: string;
      carbs: string;
      sugar: string;
      kcal: string;
      kJ: string;
      digestibility: string;
      diaas: string;
      source: string;
      nova: string;
    };
    axisGroups: {
      kind: string;
      general: string;
      importance: string;
      necessityImpact: string;
    };
    microHeading: string;
    microHint: string;
    /** Shown only when a ⚠ cell is on screen. */
    microWarningKey: string;
    microWarningTitle: string;
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
    frameHeading: string;
    frameBenefits: string;
    frameBurdens: string;
    frameComposite: string;
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
    microAvailability: (values: { iron: number; zinc: number; calcium: number }) => string;
    calciumTable: { studied: string; absorption: string; usedFor: string };
    calciumNote: string;
    microTable: { nutrient: string; dailyValue: string; upperLimit: string };
    storageHeading: string;
    storageNutrients: string;
    storageTable: { nutrient: string; store: string; site: string };
    storageContaminantsLead: string;
    storageContaminants: readonly string[];
    bioactivesHeading: string;
    bioactivesNote: string;
    processingHeading: string;
    processingGroups: string;
    processingCap: (ceiling: string) => string;
    processingEvidence: string;
    processingSulfite: string;
    hormonesNote: string;
    fibreHeading: string;
    fibreNote: string;
    residueHeading: string;
    residueNote: string;
    degradationHeading: string;
    degradationNote: string;
    compositeHeading: string;
    compositeNote: string;
  };
  exposure: {
    title: string;
    lede: string;
    foodHeading: string;
    foodLede: string;
    enumbersHere: string;
    more: string;
    enumberHeading: string;
    enumberLede: string;
    seenYes: string;
    seenNo: string;
    columns: { code: string; name: string; body: string; seen: string };
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
