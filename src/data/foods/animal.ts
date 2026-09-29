import type { DegradationProfile, FoodRecord, ResidueProfile } from "../../scoring/types";
import { animal, defineFood, prepared } from "./helpers";

const FAO_ANIMAL = "FAO 2013 dietary protein quality / DIAAS literature";
const EVENEPOEL = {
  label: "Evenepoel et al. 1998, J Nutr 128:1716–1722",
  note: "Human ileal digestibility of egg protein: 90.9 % cooked vs 51.3 % raw; raw value scaled by that ratio",
};

/** Raw muscle and organ meat: refrigerated shelf life before cooking. */
const RAW_MEAT_DAYS = 2;

const beefMinceBraised = animal({
  id: "beef_mince_braised", name: "Beef mince, braised", nameDe: "Rinderhackfleisch, geschmort",
  class: "muscle_ruminant", group: "beef_mince", preparation: "braised",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "none", systemicPesticideLikelihood: 0.05,
    contactPesticideLikelihood: 0.02, typicalMrlProximity: 0.1,
    heavyMetalClass: "low", veterinaryResidueClass: "low",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.25, cutSurfaceSensitivity: 0.3,
    heatSensitivity: 0.35, oxygenLightSensitivity: 0.4,
    perishabilityDays: 3, processingStability: "cooked",
  },
  phytochemicalIndex: 0,
  sources: [{ label: FAO_ANIMAL, note: "Beef DIAAS commonly ≥1.0; complete EAA pattern" }],
  notes: [
    {
      en: "Complete protein, heme iron, creatine/carnosine/taurine. No fibre. Fat is ruminant, not seed oil.",
      de: "Vollständiges Protein, Hämeisen, Kreatin/Carnosin/Taurin. Keine Ballaststoffe. Wiederkäuerfett, kein Samenöl.",
    },
  ],
});

const lambFlankRoasted = animal({
  id: "lamb_flank_roasted", name: "Lamb thick flank, roasted", nameDe: "Lammnuss, im Ofen gebraten",
  class: "muscle_ruminant", group: "lamb_flank", preparation: "roasted",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "none", systemicPesticideLikelihood: 0.04,
    contactPesticideLikelihood: 0.02, typicalMrlProximity: 0.08,
    heavyMetalClass: "low", veterinaryResidueClass: "low",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.22, cutSurfaceSensitivity: 0.3,
    heatSensitivity: 0.35, oxygenLightSensitivity: 0.4,
    perishabilityDays: 3, processingStability: "cooked",
  },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Pasture-associated CLA/odd-chain fat is a composition note, not a marketing halo.",
      de: "Weidebedingtes CLA/ungeradzahliges Fett ist ein Hinweis zur Zusammensetzung, kein Marketing-Heiligenschein.",
    },
  ],
});

const porkTenderloinRoasted = animal({
  id: "pork_tenderloin_roasted", name: "Pork tenderloin, roasted", nameDe: "Schweinefilet, im Ofen gebraten",
  class: "muscle_monogastric", group: "pork_tenderloin", preparation: "roasted",
  ilealDigestibility: 0.94, ironForm: "mixed", resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "none", systemicPesticideLikelihood: 0.06,
    contactPesticideLikelihood: 0.02, typicalMrlProximity: 0.12,
    heavyMetalClass: "low", veterinaryResidueClass: "moderate",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.28, cutSurfaceSensitivity: 0.3,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.4,
    perishabilityDays: 3, processingStability: "cooked",
  },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Complete protein. Higher n-6 than ruminant. Thiamin-rich.",
      de: "Vollständiges Protein. Mehr n-6 als Wiederkäuer. Thiaminreich.",
    },
  ],
});

const POULTRY_RESIDUE: ResidueProfile = {
  surfaceAreaClass: "none", systemicPesticideLikelihood: 0.08,
  contactPesticideLikelihood: 0.03, typicalMrlProximity: 0.14,
  heavyMetalClass: "low", veterinaryResidueClass: "moderate",
};
const POULTRY_DEGRADATION: DegradationProfile = {
  waterSolubleVitaminLoad: 0.25, cutSurfaceSensitivity: 0.35,
  heatSensitivity: 0.4, oxygenLightSensitivity: 0.35,
  perishabilityDays: 3, processingStability: "cooked",
};

const chickenBreastFried = animal({
  id: "chicken_breast_fried", name: "Chicken breast, pan-fried", nameDe: "Hähnchenbrust, in der Pfanne gebraten",
  class: "muscle_poultry", group: "chicken_breast", preparation: "fried",
  ilealDigestibility: 0.94, ironForm: "mixed", resistantStarchG: 0,
  residue: POULTRY_RESIDUE,
  degradation: POULTRY_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "High EAA density, lean. Lower heme/zinc/B12 than ruminant. Not a fish-fat substitute.",
      de: "Hohe EAA-Dichte, mager. Weniger Häm/Zink/B12 als Wiederkäuer. Kein Ersatz für Fischfett.",
    },
  ],
});

const turkeyBreastRaw = animal({
  id: "turkey_breast_raw", name: "Turkey breast, raw", nameDe: "Putenbrust, roh",
  class: "muscle_poultry", group: "turkey_breast", preparation: "raw",
  ilealDigestibility: 0.94, ironForm: "mixed", resistantStarchG: 0,
  residue: POULTRY_RESIDUE,
  degradation: { ...POULTRY_DEGRADATION, perishabilityDays: RAW_MEAT_DAYS, processingStability: "fresh" },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Very lean poultry muscle: dense complete protein, modest heme iron.",
      de: "Sehr mageres Geflügelfleisch: dichtes vollständiges Protein, mäßig Hämeisen.",
    },
  ],
});

const FISH_DEGRADATION: DegradationProfile = {
  waterSolubleVitaminLoad: 0.2, cutSurfaceSensitivity: 0.35,
  heatSensitivity: 0.35, oxygenLightSensitivity: 0.55,
  perishabilityDays: 2, processingStability: "cooked",
};

const salmonRoasted = animal({
  id: "salmon_roasted", name: "Salmon, oven-roasted", nameDe: "Lachs, im Ofen gegart",
  class: "muscle_fish", group: "salmon", preparation: "roasted",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "none", systemicPesticideLikelihood: 0.05,
    contactPesticideLikelihood: 0.02, typicalMrlProximity: 0.15,
    heavyMetalClass: "moderate", veterinaryResidueClass: "low",
  },
  degradation: FISH_DEGRADATION,
  phytochemicalIndex: 0,
  sources: [{ label: "EFSA n-3 LC-PUFA", note: "Preformed EPA+DHA; ALA conversion is not a substitute" }],
  notes: [
    {
      en: "Preformed EPA/DHA. Farmed vs wild fat and contaminant profiles differ; metals are not zero.",
      de: "Vorgeformtes EPA/DHA. Zucht- und Wildlachs unterscheiden sich in Fett- und Schadstoffprofil; Metalle sind nicht null.",
    },
  ],
});

const sardineCanned = animal({
  id: "sardine_canned", name: "Sardines in oil, drained", nameDe: "Sardinen in Öl, abgetropft",
  class: "muscle_fish", group: "sardine", preparation: "canned",
  processing: { nova: 3 },
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "none", systemicPesticideLikelihood: 0.04,
    contactPesticideLikelihood: 0.02, typicalMrlProximity: 0.12,
    heavyMetalClass: "moderate", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.15, cutSurfaceSensitivity: 0.05,
    heatSensitivity: 0.2, oxygenLightSensitivity: 0.35,
    perishabilityDays: 365, processingStability: "cooked",
  },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Bones raise calcium. Oil pack raises n-6. Small pelagics: lower mercury than large predators.",
      de: "Gräten erhöhen Calcium. Ölaufguss erhöht n-6. Kleine Schwarmfische: weniger Quecksilber als große Raubfische.",
    },
  ],
});

const herringPoached = animal({
  id: "herring_poached", name: "Herring, poached", nameDe: "Hering, pochiert",
  class: "muscle_fish", group: "herring", preparation: "poached",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: sardineCanned.residue,
  degradation: FISH_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Oily fish: preformed EPA/DHA and vitamin D.",
      de: "Fetter Fisch: vorgeformtes EPA/DHA und Vitamin D.",
    },
  ],
});

const mackerelGrilled = animal({
  id: "mackerel_grilled", name: "Mackerel, grilled", nameDe: "Makrele, gegrillt",
  class: "muscle_fish", group: "mackerel", preparation: "grilled",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: sardineCanned.residue,
  degradation: FISH_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Oily fish: preformed EPA/DHA; metals lower than in large predators.",
      de: "Fetter Fisch: vorgeformtes EPA/DHA; weniger Metalle als große Raubfische.",
    },
  ],
});

const codPoached = animal({
  id: "cod_poached", name: "Cod, poached", nameDe: "Kabeljau, pochiert",
  class: "muscle_fish", group: "cod", preparation: "poached",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: { ...sardineCanned.residue, heavyMetalClass: "low" },
  degradation: FISH_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Lean white fish: complete protein and iodine, little EPA/DHA per gram.",
      de: "Magerer Weißfisch: vollständiges Protein und Jod, pro Gramm wenig EPA/DHA.",
    },
  ],
});

const ORGAN_RESIDUE: ResidueProfile = {
  surfaceAreaClass: "none", systemicPesticideLikelihood: 0.08,
  contactPesticideLikelihood: 0.02, typicalMrlProximity: 0.2,
  heavyMetalClass: "moderate", veterinaryResidueClass: "moderate",
};
const ORGAN_DEGRADATION: DegradationProfile = {
  waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.4,
  heatSensitivity: 0.45, oxygenLightSensitivity: 0.4,
  perishabilityDays: 2, processingStability: "cooked",
};

const beefLiverFried = animal({
  id: "beef_liver_fried", name: "Beef liver, pan-fried", nameDe: "Rinderleber, in der Pfanne gebraten",
  class: "organs", group: "beef_liver", preparation: "fried",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: ORGAN_RESIDUE,
  degradation: ORGAN_DEGRADATION,
  phytochemicalIndex: 0,
  sources: [{ label: "EFSA vitamin A UL", note: "Preformed retinol is potent; chronic excess is a real toxicity risk" }],
  notes: [
    {
      en: "Muscle meat is not an organ. Retinol here is preformed — not carotenoid-A. UL matters.",
      de: "Muskelfleisch ist kein Organ. Retinol ist hier vorgeformt — kein Carotinoid-A. Die Obergrenze (UL) zählt.",
    },
  ],
});

const chickenLiverFried = animal({
  id: "chicken_liver_fried", name: "Chicken liver, pan-fried", nameDe: "Hähnchenleber, in der Pfanne gebraten",
  class: "organs", group: "chicken_liver", preparation: "fried",
  ilealDigestibility: 0.94, ironForm: "mixed", resistantStarchG: 0,
  residue: { ...ORGAN_RESIDUE, systemicPesticideLikelihood: 0.1, contactPesticideLikelihood: 0.03, typicalMrlProximity: 0.22 },
  degradation: { ...ORGAN_DEGRADATION, waterSolubleVitaminLoad: 0.45, cutSurfaceSensitivity: 0.45, heatSensitivity: 0.5 },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Exceptional folate + heme + retinol. Organ, not muscle. Residue/metal sequestration is real.",
      de: "Außergewöhnlich viel Folat + Häm + Retinol. Organ, kein Muskel. Rückstands- und Metallanreicherung ist real.",
    },
  ],
});

const porkLiverFried = animal({
  id: "pork_liver_fried", name: "Pork liver, pan-fried", nameDe: "Schweineleber, in der Pfanne gebraten",
  class: "organs", group: "pork_liver", preparation: "fried",
  ilealDigestibility: 0.94, ironForm: "mixed", resistantStarchG: 0,
  residue: ORGAN_RESIDUE,
  degradation: ORGAN_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Organ with very high iron, vitamin A and B12; the retinol upper limit applies.",
      de: "Organ mit sehr viel Eisen, Vitamin A und B12; die Retinol-Obergrenze gilt.",
    },
  ],
});

const beefHeartBraised = animal({
  id: "beef_heart_braised", name: "Beef heart, braised", nameDe: "Rinderherz, geschmort",
  class: "organs", group: "beef_heart", preparation: "braised",
  ilealDigestibility: 0.95, ironForm: "mixed", resistantStarchG: 0,
  residue: ORGAN_RESIDUE,
  degradation: { ...ORGAN_DEGRADATION, perishabilityDays: 3 },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "A muscle organ: complete protein with B12 and iron well above muscle meat.",
      de: "Ein Muskelorgan: vollständiges Protein mit deutlich mehr B12 und Eisen als Muskelfleisch.",
    },
  ],
});

const chickenHeartFried = animal({
  id: "chicken_heart_fried", name: "Chicken heart, pan-fried", nameDe: "Hähnchenherz, in der Pfanne gebraten",
  class: "organs", group: "chicken_heart", preparation: "fried",
  ilealDigestibility: 0.94, ironForm: "mixed", resistantStarchG: 0,
  residue: ORGAN_RESIDUE,
  degradation: ORGAN_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Small organ: B12, iron and zinc denser than in breast meat.",
      de: "Kleines Organ: B12, Eisen und Zink dichter als im Brustfleisch.",
    },
  ],
});

const eggBoiled = animal({
  id: "egg_boiled", name: "Egg, boiled", nameDe: "Hühnerei, gekocht",
  class: "eggs", group: "egg", preparation: "boiled",
  ilealDigestibility: 0.97, ironForm: "nonheme", resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "none", systemicPesticideLikelihood: 0.04,
    contactPesticideLikelihood: 0.02, typicalMrlProximity: 0.08,
    heavyMetalClass: "low", veterinaryResidueClass: "low",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.2, cutSurfaceSensitivity: 0.15,
    heatSensitivity: 0.3, oxygenLightSensitivity: 0.25,
    perishabilityDays: 7, processingStability: "cooked",
  },
  phytochemicalIndex: 0,
  sources: [{ label: FAO_ANIMAL, note: "Egg often used as DIAAS reference; typically >1.0" }],
  notes: [
    {
      en: "Reference-quality protein + choline + retinol. Shell egg ≠ dairy ≠ muscle.",
      de: "Protein in Referenzqualität + Cholin + Retinol. Ei ≠ Milchprodukt ≠ Muskel.",
    },
  ],
});

const DAIRY_RESIDUE: ResidueProfile = {
  surfaceAreaClass: "none", systemicPesticideLikelihood: 0.05,
  contactPesticideLikelihood: 0.01, typicalMrlProximity: 0.09,
  heavyMetalClass: "low", veterinaryResidueClass: "low",
};

const milkWhole = animal({
  id: "milk_whole", name: "Whole milk, 3.5 % fat", nameDe: "Vollmilch, 3,5 % Fett",
  class: "dairy", group: "milk", preparation: "processed",
  ilealDigestibility: 0.96, ironForm: "nonheme", resistantStarchG: 0,
  residue: { ...DAIRY_RESIDUE, systemicPesticideLikelihood: 0.06, typicalMrlProximity: 0.1 },
  degradation: {
    waterSolubleVitaminLoad: 0.25, cutSurfaceSensitivity: 0.05,
    heatSensitivity: 0.3, oxygenLightSensitivity: 0.35,
    perishabilityDays: 8, processingStability: "fresh",
  },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Complete milk proteins + calcium + lactose (active sugar). Not interchangeable with yogurt or cheese.",
      de: "Vollständige Milchproteine + Calcium + Laktose (aktiver Zucker). Nicht austauschbar mit Joghurt oder Käse.",
    },
  ],
});

const yogurtPlainWhole = animal({
  id: "yogurt_plain_whole", name: "Yogurt, plain, 3.5 % fat", nameDe: "Joghurt natur, 3,5 % Fett",
  class: "dairy", group: "yogurt", preparation: "fermented",
  ilealDigestibility: 0.96, ironForm: "nonheme", resistantStarchG: 0,
  residue: DAIRY_RESIDUE,
  degradation: {
    waterSolubleVitaminLoad: 0.22, cutSurfaceSensitivity: 0.05,
    heatSensitivity: 0.25, oxygenLightSensitivity: 0.3,
    perishabilityDays: 14, processingStability: "fermented",
  },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Cultured dairy, still lactose-bearing unless strained. Not a fermented-cabbage analogue.",
      de: "Gesäuertes Milchprodukt, enthält Laktose, sofern nicht abgetropft. Kein Gegenstück zu fermentiertem Kohl.",
    },
  ],
});

const quarkLowFat = animal({
  id: "quark_low_fat", name: "Quark, low-fat", nameDe: "Magerquark",
  class: "dairy", group: "quark", preparation: "fermented",
  ilealDigestibility: 0.96, ironForm: "nonheme", resistantStarchG: 0,
  residue: DAIRY_RESIDUE,
  degradation: { ...yogurtPlainWhole.degradation, perishabilityDays: 10 },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Fresh cheese from skimmed milk: casein-rich complete protein, very little fat.",
      de: "Frischkäse aus Magermilch: caseinreiches vollständiges Protein, sehr wenig Fett.",
    },
  ],
});

const CHEESE_RESIDUE: ResidueProfile = {
  surfaceAreaClass: "none", systemicPesticideLikelihood: 0.04,
  contactPesticideLikelihood: 0.01, typicalMrlProximity: 0.08,
  heavyMetalClass: "low", veterinaryResidueClass: "low",
};
const CHEESE_DEGRADATION: DegradationProfile = {
  waterSolubleVitaminLoad: 0.1, cutSurfaceSensitivity: 0.1,
  heatSensitivity: 0.2, oxygenLightSensitivity: 0.35,
  perishabilityDays: 60, processingStability: "fermented",
};

const cheddar = animal({
  id: "cheddar", name: "Cheddar", nameDe: "Cheddar (Chester)",
  class: "fermented_animal", group: "cheddar", preparation: "fermented",
  processing: { nova: 3 },
  ilealDigestibility: 0.97, ironForm: "nonheme", resistantStarchG: 0,
  residue: CHEESE_RESIDUE,
  degradation: CHEESE_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Concentrated milk fat and casein. Calorie-dense. Sodium not scored as a nutrient win.",
      de: "Konzentriertes Milchfett und Casein. Kalorienreich. Natrium zählt nicht als Nährstoffvorteil.",
    },
  ],
});

const gouda = animal({
  id: "gouda", name: "Gouda, 48 % fat i.dm.", nameDe: "Gouda, 48 % Fett i. Tr.",
  class: "fermented_animal", group: "gouda", preparation: "fermented",
  processing: { nova: 3 },
  ilealDigestibility: 0.97, ironForm: "nonheme", resistantStarchG: 0,
  residue: CHEESE_RESIDUE,
  degradation: CHEESE_DEGRADATION,
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Ripened cheese: concentrated casein and calcium; sodium is high.",
      de: "Gereifter Käse: konzentriertes Casein und Calcium; viel Natrium.",
    },
  ],
});

const emmentaler = animal({
  id: "emmentaler", name: "Emmentaler", nameDe: "Emmentaler",
  class: "fermented_animal", group: "emmentaler", preparation: "fermented",
  processing: { nova: 3 },
  ilealDigestibility: 0.97, ironForm: "nonheme", resistantStarchG: 0,
  residue: CHEESE_RESIDUE,
  degradation: { ...CHEESE_DEGRADATION, perishabilityDays: 90 },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Propionic-ripened hard cheese: very high calcium, practically lactose-free.",
      de: "Propionsäuregereifter Hartkäse: sehr viel Calcium, praktisch laktosefrei.",
    },
  ],
});

const parmesan = animal({
  id: "parmesan", name: "Parmesan", nameDe: "Parmesan",
  class: "fermented_animal", group: "parmesan", preparation: "fermented",
  processing: { nova: 3 },
  ilealDigestibility: 0.97, ironForm: "nonheme", resistantStarchG: 0,
  residue: CHEESE_RESIDUE,
  degradation: { ...CHEESE_DEGRADATION, perishabilityDays: 120 },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Long-ripened hard cheese: lactose-free in practice; very high calcium and sodium.",
      de: "Lange gereifter Hartkäse: praktisch laktosefrei; sehr viel Calcium und Natrium.",
    },
  ],
});

const kefirWhole = animal({
  id: "kefir_whole", name: "Kefir, 3.5 % fat", nameDe: "Kefir, 3,5 % Fett",
  class: "fermented_animal", group: "kefir", preparation: "fermented",
  ilealDigestibility: 0.96, ironForm: "nonheme", resistantStarchG: 0,
  residue: DAIRY_RESIDUE,
  degradation: {
    waterSolubleVitaminLoad: 0.22, cutSurfaceSensitivity: 0.05,
    heatSensitivity: 0.25, oxygenLightSensitivity: 0.3,
    perishabilityDays: 18, processingStability: "fermented",
  },
  phytochemicalIndex: 0,
  notes: [
    {
      en: "Fermented animal product ≠ plant kraut. Residual lactose remains unless fully consumed by culture.",
      de: "Fermentiertes tierisches Produkt ≠ pflanzliches Kraut. Restlaktose bleibt, sofern die Kultur sie nicht vollständig abbaut.",
    },
  ],
});

const rawMeat = { perishabilityDays: RAW_MEAT_DAYS, processingStability: "fresh" } as const;

export const ANIMAL_FOODS: FoodRecord[] = [
  prepared(beefMinceBraised, {
    id: "beef_mince_raw", name: "Beef mince, raw", nameDe: "Rinderhackfleisch, roh", preparation: "raw",
    degradation: { ...beefMinceBraised.degradation, perishabilityDays: 1, processingStability: "fresh" },
  }),
  beefMinceBraised,
  lambFlankRoasted,
  prepared(porkTenderloinRoasted, {
    id: "pork_tenderloin_raw", name: "Pork tenderloin, raw", nameDe: "Schweinefilet, roh", preparation: "raw",
    degradation: { ...porkTenderloinRoasted.degradation, ...rawMeat },
  }),
  porkTenderloinRoasted,
  prepared(chickenBreastFried, {
    id: "chicken_breast_raw", name: "Chicken breast, raw", nameDe: "Hähnchenbrust, roh", preparation: "raw",
    degradation: { ...chickenBreastFried.degradation, ...rawMeat },
  }),
  chickenBreastFried,
  turkeyBreastRaw,
  prepared(turkeyBreastRaw, {
    id: "turkey_breast_fried", name: "Turkey breast, pan-fried", nameDe: "Putenbrust, in der Pfanne gebraten", preparation: "fried",
  }),
  prepared(salmonRoasted, {
    id: "salmon_raw", name: "Salmon, raw", nameDe: "Lachs, roh", preparation: "raw",
    degradation: { ...salmonRoasted.degradation, ...rawMeat },
  }),
  salmonRoasted,
  prepared(salmonRoasted, { id: "salmon_smoked", name: "Salmon, smoked", nameDe: "Lachs, geräuchert", preparation: "smoked" }),
  sardineCanned,
  prepared(sardineCanned, {
    id: "sardine_grilled", name: "Sardine, grilled", nameDe: "Sardine, gegrillt", preparation: "grilled",
    processing: { nova: 1 },
  }),
  herringPoached,
  mackerelGrilled,
  codPoached,
  prepared(beefLiverFried, {
    id: "beef_liver_raw", name: "Beef liver, raw", nameDe: "Rinderleber, roh", preparation: "raw",
    degradation: { ...beefLiverFried.degradation, perishabilityDays: 1, processingStability: "fresh" },
  }),
  beefLiverFried,
  prepared(chickenLiverFried, {
    id: "chicken_liver_raw", name: "Chicken liver, raw", nameDe: "Hähnchenleber, roh", preparation: "raw",
    degradation: { ...chickenLiverFried.degradation, perishabilityDays: 1, processingStability: "fresh" },
  }),
  chickenLiverFried,
  porkLiverFried,
  beefHeartBraised,
  chickenHeartFried,
  prepared(eggBoiled, {
    id: "egg_raw", name: "Egg, raw", nameDe: "Hühnerei, roh", preparation: "raw",
    ilealDigestibility: 0.55,
    degradation: { ...eggBoiled.degradation, perishabilityDays: 21, processingStability: "fresh" },
    sources: [...eggBoiled.sources, EVENEPOEL],
    notes: [
      {
        en: "Raw egg protein is poorly digested (51 % vs 91 % cooked in humans), and avidin binds biotin.",
        de: "Rohes Eiprotein wird schlecht verdaut (51 % statt 91 % gekocht beim Menschen), und Avidin bindet Biotin.",
      },
    ],
  }),
  eggBoiled,
  prepared(eggBoiled, { id: "egg_fried", name: "Egg, fried without fat", nameDe: "Hühnerei, ohne Fett gebraten", preparation: "fried" }),
  prepared(eggBoiled, { id: "egg_poached", name: "Egg, poached", nameDe: "Hühnerei, pochiert", preparation: "poached" }),
  milkWhole,
  yogurtPlainWhole,
  quarkLowFat,
  cheddar,
  gouda,
  emmentaler,
  parmesan,
  kefirWhole,
].map(defineFood);
