import type { DegradationProfile, ResidueProfile, SourceRef } from "../../scoring/types";
import { defineFood, plant, prepared } from "./helpers";

/** No ileal digestibility study of fruit protein was found; fruit sits with the vegetable estimates (0.72–0.80). */
const FRUIT_DIGESTIBILITY = 0.75;
const FRUIT_PROTEIN: SourceRef = {
  label: "Class estimate",
  note: "No ileal digestibility study of fruit protein; set with the vegetable estimates. Fruit carries under 1.5 g protein per 100 g.",
};

const BERRY: ResidueProfile = {
  surfaceAreaClass: "high", systemicPesticideLikelihood: 0.45,
  contactPesticideLikelihood: 0.65, typicalMrlProximity: 0.4,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

const EDIBLE_SKIN: ResidueProfile = {
  surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.45,
  contactPesticideLikelihood: 0.6, typicalMrlProximity: 0.35,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

const PEELED: ResidueProfile = {
  surfaceAreaClass: "low", systemicPesticideLikelihood: 0.3,
  contactPesticideLikelihood: 0.2, typicalMrlProximity: 0.25,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

const VITAMIN_C_FRUIT: DegradationProfile = {
  waterSolubleVitaminLoad: 0.8, cutSurfaceSensitivity: 0.6,
  heatSensitivity: 0.75, oxygenLightSensitivity: 0.6,
  perishabilityDays: 21, processingStability: "fresh",
};

const SOFT_BERRY: DegradationProfile = {
  waterSolubleVitaminLoad: 0.7, cutSurfaceSensitivity: 0.7,
  heatSensitivity: 0.65, oxygenLightSensitivity: 0.65,
  perishabilityDays: 4, processingStability: "fresh",
};

const appleRaw = plant({
  id: "apple_raw", name: "Apple, raw, with skin", nameDe: "Apfel, roh, mit Schale",
  class: "fruits", group: "apple", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: EDIBLE_SKIN,
  degradation: {
    waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.45,
    perishabilityDays: 30, processingStability: "fresh",
  },
  phytochemicalIndex: 0.7,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "Database entry with the skin. Per 100 g mostly water and about 10 g sugar, with modest fibre and vitamin C.",
      de: "Datenbankeintrag mit Schale. Pro 100 g vor allem Wasser und etwa 10 g Zucker, mit mäßig Ballaststoffen und Vitamin C.",
    },
  ],
});

const pearRaw = plant({
  id: "pear_raw", name: "Pear, raw", nameDe: "Birne, roh",
  class: "fruits", group: "pear", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: EDIBLE_SKIN,
  degradation: { ...appleRaw.degradation, perishabilityDays: 10 },
  phytochemicalIndex: 0.5,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "About as much sugar as apple, a little more fibre, and little vitamin C.",
      de: "Etwa so viel Zucker wie der Apfel, etwas mehr Ballaststoffe und wenig Vitamin C.",
    },
  ],
});

const bananaRaw = plant({
  id: "banana_raw", name: "Banana, raw", nameDe: "Banane, roh",
  class: "fruits", group: "banana", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: PEELED,
  degradation: {
    waterSolubleVitaminLoad: 0.4, cutSurfaceSensitivity: 0.7,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.5,
    perishabilityDays: 6, processingStability: "fresh",
  },
  phytochemicalIndex: 0.35,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "More sugar and some starch than most fruit here, and one of the higher potassium values among the fresh fruit.",
      de: "Mehr Zucker und etwas Stärke als das meiste Obst hier und einer der höheren Kaliumwerte unter dem frischen Obst.",
    },
  ],
});

const orangeRaw = plant({
  id: "orange_raw", name: "Orange, raw", nameDe: "Orange, roh",
  class: "fruits", group: "orange", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: PEELED,
  degradation: VITAMIN_C_FRUIT,
  phytochemicalIndex: 0.65,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "Vitamin C about 60 mg per 100 g of flesh. The peel is not part of the entry.",
      de: "Vitamin C etwa 60 mg pro 100 g Fruchtfleisch. Die Schale gehört nicht zum Eintrag.",
    },
  ],
});

const kiwiRaw = plant({
  id: "kiwi_raw", name: "Kiwi, raw", nameDe: "Kiwi, roh",
  class: "fruits", group: "kiwi", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: PEELED,
  degradation: VITAMIN_C_FRUIT,
  phytochemicalIndex: 0.6,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "Vitamin C about 70 mg per 100 g, and more vitamin K than most fruit. Amino acids BLS does not report come from the USDA entry.",
      de: "Vitamin C etwa 70 mg pro 100 g und mehr Vitamin K als das meiste Obst. Aminosäuren, die der BLS nicht angibt, stammen aus dem USDA-Eintrag.",
    },
  ],
});

const strawberriesRaw = plant({
  id: "strawberries_raw", name: "Strawberries, raw", nameDe: "Erdbeeren, roh",
  class: "fruits", group: "strawberry", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: BERRY,
  degradation: { ...SOFT_BERRY, waterSolubleVitaminLoad: 0.8, heatSensitivity: 0.75 },
  phytochemicalIndex: 0.8,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "Vitamin C near 57 mg per 100 g at under 40 kcal, and the most folate among the fruit here.",
      de: "Vitamin C nahe 57 mg pro 100 g bei unter 40 kcal und das meiste Folat unter dem Obst hier.",
    },
  ],
});

const blueberriesRaw = plant({
  id: "blueberries_raw", name: "Blueberries, raw", nameDe: "Heidelbeeren, roh",
  class: "fruits", group: "blueberry", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: BERRY,
  degradation: { ...SOFT_BERRY, waterSolubleVitaminLoad: 0.5, cutSurfaceSensitivity: 0.4, perishabilityDays: 10 },
  phytochemicalIndex: 0.9,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "About 5 g fibre with 10 g sugar per 100 g; vitamin C is modest. Amino acids BLS does not report come from the USDA entry.",
      de: "Etwa 5 g Ballaststoffe zu 10 g Zucker pro 100 g; Vitamin C ist mäßig. Aminosäuren, die der BLS nicht angibt, stammen aus dem USDA-Eintrag.",
    },
  ],
});

const raspberriesRaw = plant({
  id: "raspberries_raw", name: "Raspberries, raw", nameDe: "Himbeeren, roh",
  class: "fruits", group: "raspberry", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: BERRY,
  degradation: { ...SOFT_BERRY, perishabilityDays: 3 },
  phytochemicalIndex: 0.85,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "Nearly as much fibre as sugar (4.7 g and 5.2 g per 100 g). Missing amino acids are filled from the strawberry pattern.",
      de: "Fast so viel Ballaststoffe wie Zucker (4,7 g und 5,2 g pro 100 g). Fehlende Aminosäuren werden nach dem Muster der Erdbeere ergänzt.",
    },
  ],
});

const blackcurrantsRaw = plant({
  id: "blackcurrants_raw", name: "Blackcurrants, raw", nameDe: "Schwarze Johannisbeeren, roh",
  class: "fruits", group: "blackcurrant", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: BERRY,
  degradation: { ...SOFT_BERRY, waterSolubleVitaminLoad: 0.85, cutSurfaceSensitivity: 0.5, heatSensitivity: 0.75, perishabilityDays: 5 },
  phytochemicalIndex: 0.9,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "The most vitamin C here, about 177 mg per 100 g. Amino acids are filled from the strawberry pattern.",
      de: "Das meiste Vitamin C hier, etwa 177 mg pro 100 g. Die Aminosäuren werden nach dem Muster der Erdbeere ergänzt.",
    },
  ],
});

const grapesRaw = plant({
  id: "grapes_raw", name: "Grapes, raw", nameDe: "Weintrauben, roh",
  class: "fruits", group: "grape", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: BERRY,
  degradation: {
    waterSolubleVitaminLoad: 0.3, cutSurfaceSensitivity: 0.4,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.45,
    perishabilityDays: 10, processingStability: "fresh",
  },
  phytochemicalIndex: 0.65,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "Mostly water and sugar, with little fibre or vitamin C per 100 g.",
      de: "Vor allem Wasser und Zucker, mit wenig Ballaststoffen oder Vitamin C pro 100 g.",
    },
  ],
});

const avocadoRaw = plant({
  id: "avocado_raw", name: "Avocado, raw", nameDe: "Avocado, roh",
  class: "fruits", group: "avocado", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: PEELED,
  degradation: {
    waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.8,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.6,
    perishabilityDays: 5, processingStability: "fresh",
  },
  phytochemicalIndex: 0.5,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "A fat fruit: 12.5 g fat per 100 g, mostly monounsaturated, little sugar, and the most potassium of the fresh fruit here.",
      de: "Eine fettreiche Frucht: 12,5 g Fett pro 100 g, überwiegend einfach ungesättigt, wenig Zucker und das meiste Kalium unter dem frischen Obst hier.",
    },
  ],
});

const apricotRaw = plant({
  id: "apricot_raw", name: "Apricot, raw", nameDe: "Aprikose, roh",
  class: "fruits", group: "apricot", preparation: "raw",
  ilealDigestibility: FRUIT_DIGESTIBILITY, resistantStarchG: 0,
  residue: EDIBLE_SKIN,
  degradation: {
    waterSolubleVitaminLoad: 0.45, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.5, oxygenLightSensitivity: 0.55,
    perishabilityDays: 5, processingStability: "fresh",
  },
  phytochemicalIndex: 0.6,
  sources: [FRUIT_PROTEIN],
  notes: [
    {
      en: "About 1.6 mg β-carotene per 100 g, counted as provitamin A (RAE), not as retinol.",
      de: "Etwa 1,6 mg β-Carotin pro 100 g, als Provitamin A (RAE) gezählt, nicht als Retinol.",
    },
  ],
});

export const FRUIT_FOODS = [
  appleRaw,
  pearRaw,
  bananaRaw,
  orangeRaw,
  kiwiRaw,
  strawberriesRaw,
  blueberriesRaw,
  raspberriesRaw,
  blackcurrantsRaw,
  grapesRaw,
  avocadoRaw,
  apricotRaw,
  prepared(apricotRaw, {
    id: "apricot_dried", name: "Apricot, dried", nameDe: "Aprikose, getrocknet", preparation: "dried",
    notes: [
      {
        en: "Drying removes water: per 100 g, sugar rises about fivefold and potassium about threefold, while carotene falls.",
        de: "Trocknen entzieht Wasser: Pro 100 g steigt der Zucker etwa auf das Fünffache und Kalium etwa auf das Dreifache, während Carotin sinkt.",
      },
    ],
  }),
].map(defineFood);
