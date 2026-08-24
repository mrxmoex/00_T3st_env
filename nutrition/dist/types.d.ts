/** Kingdom — plant vs animal biochemical baseline */
export type Kingdom = "plant" | "animal";
/** Plant divisions — NOT interchangeable */
export type PlantDivision = "leafy_greens" | "legumes" | "sprouts" | "cruciferous_kraut" | "mushrooms" | "algae_seaweed" | "roots_tubers" | "other_vegetables";
/** Animal divisions */
export type AnimalDivision = "muscle_ruminant" | "muscle_monogastric" | "muscle_poultry" | "muscle_fish" | "organs" | "eggs" | "dairy" | "fermented_animal";
export type Division = PlantDivision | AnimalDivision;
export type Tier = "S" | "A" | "B" | "C" | "D";
export type DietaryPattern = "omnivore" | "vegan" | "low_residue";
export interface SourceRef {
    id: string;
    name: string;
    url: string;
    verifiedAt: string;
}
export interface AminoAcidsMg {
    histidine: number;
    isoleucine: number;
    leucine: number;
    lysine: number;
    methionine: number;
    phenylalanine: number;
    threonine: number;
    tryptophan: number;
    valine: number;
}
export interface FattyAcidsG {
    saturated: number;
    monounsaturated: number;
    omega6: number;
    omega3: number;
    ala: number;
    epa: number;
    dha: number;
}
export interface Per100g {
    energyKcal: number;
    proteinG: number;
    starchG: number;
    sugarsG: number;
    fibreG: number;
    ironMg: number;
    zincMg: number;
    vitaminB12Ug: number;
    folateUg: number;
    vitaminCMg: number;
    thiaminMg: number;
    retinolUg: number;
    carotenoidUg: number;
    creatineMg: number;
    taurineMg: number;
    carnosineMg: number;
    aminoAcids: AminoAcidsMg;
    fattyAcids: FattyAcidsG;
}
export interface BioavailabilityFlags {
    /** PDCAAS 0–1 for plants */
    pdcaas?: number;
    /** DIAAS 0–1 for animals */
    diaas?: number;
    /** Protein completeness 0–1 (1 = complete) */
    completeness?: number;
    ironFactor: number;
    zincFactor: number;
    vitaminAFactor: number;
    highPhytate?: boolean;
}
export interface ResidueProfile {
    pesticideTier: number;
    heavyMetalTier: number;
    dioxinTier: number;
}
export interface DegradationProfile {
    cookingLossFactor: number;
    oxidationFactor: number;
}
export interface FoodRecord {
    id: string;
    name: string;
    kingdom: Kingdom;
    division: Division;
    fermented?: boolean;
    per100g: Per100g;
    bioavailability: BioavailabilityFlags;
    phytochemicalIndex: number;
    residue: ResidueProfile;
    degradation: DegradationProfile;
    sources: SourceRef[];
}
export interface AxisScores {
    eaaCompletenessDigestibility: number;
    efaGlycerideProfile: number;
    carbohydrateType: number;
    micronutrientDensity: number;
    fibrePhytochemical: number;
    residueRisk: number;
    degradationSensitivity: number;
    composite: number;
    tier: Tier;
}
export interface ScoredFood {
    food: FoodRecord;
    scores: AxisScores;
    flags: string[];
}
export type AxisKey = "eaaCompletenessDigestibility" | "efaGlycerideProfile" | "carbohydrateType" | "micronutrientDensity" | "fibrePhytochemical" | "residueRisk" | "degradationSensitivity" | "composite";
export interface DivisionWeights {
    eaaCompletenessDigestibility: number;
    efaGlycerideProfile: number;
    carbohydrateType: number;
    micronutrientDensity: number;
    fibrePhytochemical: number;
    residueRisk: number;
    degradationSensitivity: number;
}
