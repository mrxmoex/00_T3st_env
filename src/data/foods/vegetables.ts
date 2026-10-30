import type { ResidueProfile } from "../../scoring/types";
import { defineFood, plant } from "./helpers";
import { classValue, pigIleal } from "./proteinDigestibility";

const VEGETABLE_CLASS_DIGESTIBILITY = 0.86;
const VEGETABLE_CLASS = classValue(
  "No measurement of this vegetable was found. Median amino acid digestibility of the eight vegetables measured in pigs: 86 %; the authors call vegetable medians indicative only",
);

const BULB: ResidueProfile = {
  surfaceAreaClass: "low", systemicPesticideLikelihood: 0.3,
  contactPesticideLikelihood: 0.25, typicalMrlProximity: 0.2,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

const EDIBLE_PEEL: ResidueProfile = {
  surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.4,
  contactPesticideLikelihood: 0.5, typicalMrlProximity: 0.35,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

const onionRaw = plant({
  id: "onion_raw", name: "Onion, raw", nameDe: "Zwiebel, roh",
  class: "other_vegetables", group: "onion", preparation: "raw",
  ilealDigestibility: VEGETABLE_CLASS_DIGESTIBILITY, resistantStarchG: 0,
  residue: BULB,
  degradation: {
    waterSolubleVitaminLoad: 0.3, cutSurfaceSensitivity: 0.5,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.3,
    perishabilityDays: 30, processingStability: "fresh",
  },
  phytochemicalIndex: 0.75,
  sources: [VEGETABLE_CLASS],
  notes: [
    {
      en: "Mostly water, with about 6 g sugar per 100 g. Amino acids BLS does not report come from the USDA entry.",
      de: "Vor allem Wasser, mit etwa 6 g Zucker pro 100 g. Aminosäuren, die der BLS nicht angibt, stammen aus dem USDA-Eintrag.",
    },
  ],
});

const garlicRaw = plant({
  id: "garlic_raw", name: "Garlic, raw", nameDe: "Knoblauch, roh",
  class: "other_vegetables", group: "garlic", preparation: "raw",
  ilealDigestibility: VEGETABLE_CLASS_DIGESTIBILITY, resistantStarchG: 0,
  residue: BULB,
  degradation: {
    waterSolubleVitaminLoad: 0.3, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.5, oxygenLightSensitivity: 0.3,
    perishabilityDays: 60, processingStability: "fresh",
  },
  phytochemicalIndex: 0.85,
  sources: [VEGETABLE_CLASS],
  notes: [
    {
      en: "BLS lists 28 g fibre and 3 g available carbohydrate per 100 g; USDA lists 2 g fibre and 31 g carbohydrate. The app uses BLS.",
      de: "Der BLS nennt 28 g Ballaststoffe und 3 g verfügbare Kohlenhydrate pro 100 g; USDA nennt 2 g Ballaststoffe und 31 g Kohlenhydrate. Die App verwendet den BLS.",
    },
  ],
});

const leekRaw = plant({
  id: "leek_raw", name: "Leek, raw", nameDe: "Porree, roh",
  class: "other_vegetables", group: "leek", preparation: "raw",
  ilealDigestibility: VEGETABLE_CLASS_DIGESTIBILITY, resistantStarchG: 0,
  residue: { ...EDIBLE_PEEL, systemicPesticideLikelihood: 0.35, contactPesticideLikelihood: 0.45, typicalMrlProximity: 0.3 },
  degradation: {
    waterSolubleVitaminLoad: 0.6, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.55, oxygenLightSensitivity: 0.55,
    perishabilityDays: 10, processingStability: "fresh",
  },
  phytochemicalIndex: 0.6,
  sources: [VEGETABLE_CLASS],
  notes: [
    {
      en: "About 54 µg vitamin K and 64 µg folate per 100 g.",
      de: "Etwa 54 µg Vitamin K und 64 µg Folat pro 100 g.",
    },
  ],
});

const cucumberRaw = plant({
  id: "cucumber_raw", name: "Cucumber, raw", nameDe: "Gurke, roh",
  class: "other_vegetables", group: "cucumber", preparation: "raw",
  ilealDigestibility: VEGETABLE_CLASS_DIGESTIBILITY, resistantStarchG: 0,
  residue: EDIBLE_PEEL,
  degradation: {
    waterSolubleVitaminLoad: 0.45, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.45,
    perishabilityDays: 7, processingStability: "fresh",
  },
  phytochemicalIndex: 0.3,
  sources: [VEGETABLE_CLASS],
  notes: [
    {
      en: "97 % water: 16 kcal per 100 g.",
      de: "97 % Wasser: 16 kcal pro 100 g.",
    },
  ],
});

const asparagusBoiled = plant({
  id: "asparagus_boiled", name: "Asparagus, boiled", nameDe: "Spargel, gekocht",
  class: "other_vegetables", group: "asparagus", preparation: "boiled",
  ilealDigestibility: VEGETABLE_CLASS_DIGESTIBILITY, resistantStarchG: 0,
  residue: { ...BULB, systemicPesticideLikelihood: 0.3, contactPesticideLikelihood: 0.35, typicalMrlProximity: 0.25 },
  degradation: {
    waterSolubleVitaminLoad: 0.6, cutSurfaceSensitivity: 0.4,
    heatSensitivity: 0.6, oxygenLightSensitivity: 0.5,
    perishabilityDays: 3, processingStability: "cooked",
  },
  phytochemicalIndex: 0.6,
  sources: [VEGETABLE_CLASS],
  notes: [
    {
      en: "About 100 µg vitamin K and 56 µg folate per 100 g at 16 kcal.",
      de: "Etwa 100 µg Vitamin K und 56 µg Folat pro 100 g bei 16 kcal.",
    },
  ],
});

const greenBeansBoiled = plant({
  id: "green_beans_boiled", name: "Green beans, boiled", nameDe: "Grüne Bohnen, gekocht",
  class: "other_vegetables", group: "green_beans", preparation: "boiled",
  ilealDigestibility: 0.858, resistantStarchG: 0,
  residue: EDIBLE_PEEL,
  degradation: {
    waterSolubleVitaminLoad: 0.55, cutSurfaceSensitivity: 0.4,
    heatSensitivity: 0.55, oxygenLightSensitivity: 0.45,
    perishabilityDays: 3, processingStability: "cooked",
  },
  phytochemicalIndex: 0.45,
  sources: [pigIleal("Whole green beans, simmered: 85.8 % of nitrogen.")],
  notes: [
    {
      en: "Immature pods: about 3.7 g fibre and 2 g protein per 100 g, far less protein than dried beans.",
      de: "Unreife Hülsen: etwa 3,7 g Ballaststoffe und 2 g Protein pro 100 g, weit weniger Protein als getrocknete Bohnen.",
    },
  ],
});

const greenPeasBoiled = plant({
  id: "green_peas_boiled", name: "Green peas, frozen, boiled", nameDe: "Grüne Erbsen, tiefgefroren, gekocht",
  class: "legumes", group: "green_peas", preparation: "boiled",
  ilealDigestibility: 0.905, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "low", systemicPesticideLikelihood: 0.25,
    contactPesticideLikelihood: 0.15, typicalMrlProximity: 0.2,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.5, cutSurfaceSensitivity: 0.2,
    heatSensitivity: 0.5, oxygenLightSensitivity: 0.35,
    perishabilityDays: 3, processingStability: "cooked",
  },
  phytochemicalIndex: 0.5,
  sources: [pigIleal("Frozen green peas, simmered: 90.5 % of nitrogen.")],
  notes: [
    {
      en: "Peas picked young: about 5 g protein and 5 g fibre per 100 g, with more sugar and less starch than dried pulses.",
      de: "Jung geerntete Erbsen: etwa 5 g Protein und 5 g Ballaststoffe pro 100 g, mit mehr Zucker und weniger Stärke als getrocknete Hülsenfrüchte.",
    },
  ],
});

export const VEGETABLE_FOODS = [
  onionRaw,
  garlicRaw,
  leekRaw,
  cucumberRaw,
  asparagusBoiled,
  greenBeansBoiled,
  greenPeasBoiled,
].map(defineFood);
