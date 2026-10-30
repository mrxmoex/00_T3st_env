import type { DegradationProfile, ResidueProfile } from "../../scoring/types";
import { defineFood, plant } from "./helpers";
import {
  BAILEY_STEIN_2020,
  classValue,
  FREITAS_2012,
  LACKEY_FLEMING_2021,
  pigIleal,
  RUTHERFURD_2015,
} from "./proteinDigestibility";

const KERNEL: ResidueProfile = {
  surfaceAreaClass: "low", systemicPesticideLikelihood: 0.25,
  contactPesticideLikelihood: 0.2, typicalMrlProximity: 0.2,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

/** Oilseeds that accumulate cadmium (EFSA 2009, CONTAM opinion on cadmium in food). */
const CADMIUM_SEED: ResidueProfile = { ...KERNEL, heavyMetalClass: "moderate" };

const MONOUNSATURATED_NUT: DegradationProfile = {
  waterSolubleVitaminLoad: 0.25, cutSurfaceSensitivity: 0.4,
  heatSensitivity: 0.45, oxygenLightSensitivity: 0.45,
  perishabilityDays: 180, processingStability: "dried",
};

const POLYUNSATURATED_SEED: DegradationProfile = {
  ...MONOUNSATURATED_NUT,
  oxygenLightSensitivity: 0.7,
  perishabilityDays: 120,
};

const almondsRaw = plant({
  id: "almonds_raw", name: "Almonds, raw", nameDe: "Mandeln, roh",
  class: "nuts_seeds", group: "almond", preparation: "raw",
  ilealDigestibility: 0.723, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: MONOUNSATURATED_NUT,
  phytochemicalIndex: 0.65,
  sources: [pigIleal("Raw almonds, hammer-milled: 72.3 % of nitrogen.")],
  notes: [
    {
      en: "Mostly monounsaturated fat, with about 24 mg vitamin E and 218 mg magnesium per 100 g.",
      de: "Überwiegend einfach ungesättigtes Fett, mit etwa 24 mg Vitamin E und 218 mg Magnesium pro 100 g.",
    },
  ],
});

const walnutsRaw = plant({
  id: "walnuts_raw", name: "Walnuts, raw", nameDe: "Walnüsse, roh",
  class: "nuts_seeds", group: "walnut", preparation: "raw",
  ilealDigestibility: 0.862, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: POLYUNSATURATED_SEED,
  phytochemicalIndex: 0.85,
  sources: [LACKEY_FLEMING_2021],
  notes: [
    {
      en: "Mostly polyunsaturated fat, including about 10 g ALA per 100 g, far more than other common nuts. ALA is not EPA or DHA.",
      de: "Überwiegend mehrfach ungesättigtes Fett, darunter etwa 10 g ALA pro 100 g, weit mehr als andere gängige Nüsse. ALA ist nicht EPA oder DHA.",
    },
  ],
});

const hazelnutsRaw = plant({
  id: "hazelnuts_raw", name: "Hazelnuts, raw", nameDe: "Haselnüsse, roh",
  class: "nuts_seeds", group: "hazelnut", preparation: "raw",
  ilealDigestibility: 0.9, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: MONOUNSATURATED_NUT,
  phytochemicalIndex: 0.65,
  sources: [
    classValue(
      "No measurement of hazelnut was found. Median amino acid digestibility of the four nuts measured in pigs (almonds, cashews, peanuts, peanut butter): 90 %",
    ),
  ],
  notes: [
    {
      en: "Mostly monounsaturated fat and about 22 mg vitamin E per 100 g.",
      de: "Überwiegend einfach ungesättigtes Fett und etwa 22 mg Vitamin E pro 100 g.",
    },
  ],
});

const cashewsRaw = plant({
  id: "cashews_raw", name: "Cashews, raw", nameDe: "Cashewkerne, roh",
  class: "nuts_seeds", group: "cashew", preparation: "raw",
  ilealDigestibility: 0.877, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: MONOUNSATURATED_NUT,
  phytochemicalIndex: 0.4,
  sources: [pigIleal("Raw cashew kernels, hammer-milled: 87.7 % of nitrogen.")],
  notes: [
    {
      en: "More starch than other nuts, about 20 g per 100 g, and little vitamin E.",
      de: "Mehr Stärke als andere Nüsse, etwa 20 g pro 100 g, und wenig Vitamin E.",
    },
  ],
});

const peanutsRoasted = plant({
  id: "peanuts_roasted", name: "Peanuts, roasted", nameDe: "Erdnüsse, geröstet",
  class: "nuts_seeds", group: "peanut", preparation: "roasted",
  ilealDigestibility: 0.909, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: MONOUNSATURATED_NUT,
  phytochemicalIndex: 0.5,
  sources: [RUTHERFURD_2015],
  notes: [
    {
      en: "A legume eaten as a nut: about 29 g protein per 100 g, the most among the nuts here.",
      de: "Eine Hülsenfrucht, die als Nuss gegessen wird: etwa 29 g Protein pro 100 g, das meiste unter den Nüssen hier.",
    },
  ],
});

const pistachiosRaw = plant({
  id: "pistachios_raw", name: "Pistachios, raw", nameDe: "Pistazien, roh",
  class: "nuts_seeds", group: "pistachio", preparation: "raw",
  ilealDigestibility: 0.945, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: MONOUNSATURATED_NUT,
  phytochemicalIndex: 0.7,
  sources: [BAILEY_STEIN_2020],
  notes: [
    {
      en: "Values come from USDA: the BLS entry lists 5.6 mg potassium, which a seed cannot hold. USDA has about 1 g.",
      de: "Die Werte stammen aus USDA: Der BLS-Eintrag nennt 5,6 mg Kalium, so wenig kann ein Samen nicht enthalten. USDA misst etwa 1 g.",
    },
  ],
});

const brazilNutsRaw = plant({
  id: "brazil_nuts_raw", name: "Brazil nuts, raw", nameDe: "Paranüsse, roh",
  class: "nuts_seeds", group: "brazil_nut", preparation: "raw",
  ilealDigestibility: 0.892, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: POLYUNSATURATED_SEED,
  phytochemicalIndex: 0.35,
  sources: [FREITAS_2012],
  notes: [
    {
      en: "About 1,900 µg selenium per 100 g in the USDA analysis: 100 kcal already pass the adult upper limit for a whole day.",
      de: "Etwa 1.900 µg Selen pro 100 g in der USDA-Analyse: 100 kcal überschreiten bereits die Tageshöchstmenge für Erwachsene.",
    },
  ],
});

const sunflowerSeeds = plant({
  id: "sunflower_seeds", name: "Sunflower seeds", nameDe: "Sonnenblumenkerne",
  class: "nuts_seeds", group: "sunflower_seed", preparation: "raw",
  ilealDigestibility: 0.657, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: CADMIUM_SEED,
  degradation: POLYUNSATURATED_SEED,
  phytochemicalIndex: 0.6,
  sources: [pigIleal("Raw sunflower kernels, broken in a food processor: 65.7 % of nitrogen.")],
  notes: [
    {
      en: "About 37 mg vitamin E per 100 g, the most here, with linoleic acid as the main fat.",
      de: "Etwa 37 mg Vitamin E pro 100 g, das meiste hier, mit Linolsäure als Hauptfett.",
    },
  ],
});

const pumpkinSeeds = plant({
  id: "pumpkin_seeds", name: "Pumpkin seeds, dried", nameDe: "Kürbiskerne, getrocknet",
  class: "nuts_seeds", group: "pumpkin_seed", preparation: "dried",
  ilealDigestibility: 0.668, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: POLYUNSATURATED_SEED,
  phytochemicalIndex: 0.5,
  sources: [pigIleal("Heat-treated pumpkin kernels, pulsed in a food processor: 66.8 % of nitrogen.")],
  notes: [
    {
      en: "Values come from USDA: the BLS entry reports folate as exactly 0. About 590 mg magnesium and 7.8 mg zinc per 100 g.",
      de: "Die Werte stammen aus USDA: Der BLS-Eintrag gibt Folat mit genau 0 an. Etwa 590 mg Magnesium und 7,8 mg Zink pro 100 g.",
    },
  ],
});

const flaxseed = plant({
  id: "flaxseed", name: "Flaxseed (linseed)", nameDe: "Leinsamen",
  class: "nuts_seeds", group: "flaxseed", preparation: "raw",
  ilealDigestibility: 0.603, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: CADMIUM_SEED,
  degradation: { ...POLYUNSATURATED_SEED, oxygenLightSensitivity: 0.6, perishabilityDays: 180 },
  phytochemicalIndex: 0.85,
  sources: [pigIleal("Broken raw linseed: 60.3 % of nitrogen.")],
  notes: [
    {
      en: "About 20 g ALA and 23 g fibre per 100 g. ALA is not EPA or DHA.",
      de: "Etwa 20 g ALA und 23 g Ballaststoffe pro 100 g. ALA ist nicht EPA oder DHA.",
    },
  ],
});

const chiaSeeds = plant({
  id: "chia_seeds", name: "Chia seeds", nameDe: "Chiasamen",
  class: "nuts_seeds", group: "chia", preparation: "raw",
  ilealDigestibility: 0.286, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: { ...POLYUNSATURATED_SEED, oxygenLightSensitivity: 0.5, perishabilityDays: 180 },
  phytochemicalIndex: 0.6,
  sources: [pigIleal("Whole black chia seeds, soaked in water overnight: 28.6 % of nitrogen. No value for ground chia was found.")],
  notes: [
    {
      en: "About 40 g fibre and 19 g ALA per 100 g. No human absorption study covers chia calcium here, so it counts like milk calcium.",
      de: "Etwa 40 g Ballaststoffe und 19 g ALA pro 100 g. Keine Humanstudie hier erfasst die Calciumaufnahme aus Chia, deshalb zählt es wie Milchcalcium.",
    },
  ],
});

const sesameSeeds = plant({
  id: "sesame_seeds", name: "Sesame seeds", nameDe: "Sesam",
  class: "nuts_seeds", group: "sesame", preparation: "raw",
  ilealDigestibility: 0.64, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: KERNEL,
  degradation: POLYUNSATURATED_SEED,
  phytochemicalIndex: 0.7,
  sources: [
    classValue(
      "No measurement of sesame was found. Median amino acid digestibility of the four seeds measured in pigs (chia, linseed, pumpkin, sunflower): 64 %; the authors call seed medians indicative only",
    ),
  ],
  notes: [
    {
      en: "About 780 mg calcium and 10 mg iron per 100 g of whole seed. No human absorption study covers sesame calcium here, so it counts like milk calcium.",
      de: "Etwa 780 mg Calcium und 10 mg Eisen pro 100 g ganzer Samen. Keine Humanstudie hier erfasst die Calciumaufnahme aus Sesam, deshalb zählt es wie Milchcalcium.",
    },
  ],
});

export const NUT_SEED_FOODS = [
  almondsRaw,
  walnutsRaw,
  hazelnutsRaw,
  cashewsRaw,
  peanutsRoasted,
  pistachiosRaw,
  brazilNutsRaw,
  sunflowerSeeds,
  pumpkinSeeds,
  flaxseed,
  chiaSeeds,
  sesameSeeds,
].map(defineFood);
