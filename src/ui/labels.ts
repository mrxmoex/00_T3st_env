import type { AxisKey, DietaryPattern, FoodClass, Kingdom, Tier } from "../scoring/types";

export const CLASS_LABELS: Record<FoodClass, string> = {
  leafy_salad: "Leafy / salad greens",
  legumes: "Legumes / beans",
  sprouts: "Sprouts",
  cruciferous_fresh: "Cruciferous — fresh",
  cruciferous_fermented: "Cruciferous — fermented (kraut)",
  mushrooms: "Mushrooms (Schroom)",
  algae: "Algae / seaweed",
  roots_tubers: "Roots & tubers",
  other_vegetables: "Other vegetables",
  muscle_ruminant: "Muscle — ruminant",
  muscle_monogastric: "Muscle — monogastric",
  muscle_poultry: "Muscle — poultry",
  muscle_fish: "Muscle — fish",
  organs: "Organs",
  eggs: "Eggs",
  dairy: "Dairy",
  fermented_animal: "Fermented animal",
};

export const AXIS_LABELS: Record<AxisKey, string> = {
  eaa: "EAA + digestibility",
  efa: "EFA / glycerides",
  carb: "Carbohydrate type",
  micro: "Micros + bioavailability",
  fibre: "Fibre / phytochemicals",
  residue: "Residue / contaminants",
  degradation: "Post-harvest stability",
  composite: "Composite",
};

export const AXIS_SHORT: Record<AxisKey, string> = {
  eaa: "EAA",
  efa: "EFA",
  carb: "Carb",
  micro: "Micro",
  fibre: "Fibre",
  residue: "Residue",
  degradation: "Stable",
  composite: "Σ",
};

export const PATTERN_LABELS: Record<DietaryPattern, string> = {
  "plant-only": "Plant-only",
  "animal-inclusive": "Animal-inclusive",
  hybrid: "Hybrid",
};

export const KINGDOM_LABELS: Record<Kingdom, string> = {
  plant: "Plant",
  animal: "Animal",
};

export const TIER_LABELS: Record<Tier, string> = {
  S: "S — class-leading efficiency",
  A: "A — strong within class",
  B: "B — mid class",
  C: "C — weak on weighted axes",
  D: "D — poor within class weights",
};

export const EXTRA_LABELS: Record<string, string> = {
  folateDensity: "Folate density",
  vitaminKDensity: "Vitamin K density",
  nitrateProxy: "Nitrate proxy",
  surfaceResidue: "Surface residue load",
  lysineAdequacy: "Lysine vs FAO",
  saaAdequacy: "SAA vs FAO",
  phytatePenalty: "Phytate (higher=better)",
  resistantStarch: "Resistant starch",
  livingTissueLability: "Living-tissue lability",
  pathogenProxy: "Sprout pathogen proxy",
  sulforaphaneProxy: "Sulforaphane proxy",
  glucosinolateProxy: "Glucosinolate proxy",
  goitrogenProxy: "Goitrogen note",
  vitaminCRetention: "Vitamin C",
  organicAcidStability: "Organic-acid stability",
  sodiumNote: "Sodium (higher=better/lower Na)",
  ergothioneineProxy: "Ergothioneine proxy",
  vitaminDPotential: "Vitamin D potential",
  chitinDigestPenalty: "Chitin digestibility",
  iodineDensity: "Iodine density",
  preformedN3: "Preformed n-3",
  inactiveB12Flag: "Active B12 (0 if analogue)",
  metalLoad: "Metal load (higher=cleaner)",
  starchActivity: "Starch quietness",
  carotenoidOnlyA: "Retinol vs carotenoid-A",
  vitaminCDensity: "Vitamin C density",
  waterWeight: "Low energy density",
  eaaCompleteness: "EAA completeness",
  oddChainCla: "Odd-chain + CLA",
  creatine: "Creatine",
  hemeIron: "Heme iron",
  n6Load: "n-6 quietness",
  leanness: "Leanness",
  epaDha: "EPA+DHA",
  iodineSelenium: "Iodine + selenium",
  retinolDensity: "Retinol density",
  b12Density: "B12 density",
  copperProxy: "Copper proxy",
  cholineDensity: "Choline",
  yolkFatQuality: "Yolk fat quality",
  calciumDensity: "Calcium density",
  lactoseLoad: "Low lactose",
  fermentationStability: "Fermentation stability",
};
