import type { LocalizedText } from "../../i18n/locale";
import type { DegradationProfile, ResidueProfile } from "../../scoring/types";
import { defineFood, plant, prepared } from "./helpers";
import { pigIleal, proxy, WALTHER_2019 } from "./proteinDigestibility";

const OATMEAL = pigIleal("Oatmeal simmered in water for 15 min: 82.8 % of nitrogen.");
const WHOLE_WHEAT_BREAD = pigIleal("Whole wheat bread from a US bakery: 70.7 % of nitrogen.");

const FIELD_GRAIN: ResidueProfile = {
  surfaceAreaClass: "low", systemicPesticideLikelihood: 0.35,
  contactPesticideLikelihood: 0.2, typicalMrlProximity: 0.25,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

const BREAD: DegradationProfile = {
  waterSolubleVitaminLoad: 0.3, cutSurfaceSensitivity: 0.3,
  heatSensitivity: 0.4, oxygenLightSensitivity: 0.3,
  perishabilityDays: 5, processingStability: "cooked",
};

const BOILED_GRAIN: DegradationProfile = {
  waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.1,
  heatSensitivity: 0.35, oxygenLightSensitivity: 0.2,
  perishabilityDays: 3, processingStability: "cooked",
};

const BREAD_NOVA: LocalizedText = {
  en: "Bread from flour, water, salt, and yeast is processed food (NOVA 3); packaged bread with emulsifiers or preservatives would be ultra-processed (NOVA 4).",
  de: "Brot aus Mehl, Wasser, Salz und Hefe ist ein verarbeitetes Lebensmittel (NOVA 3); abgepacktes Brot mit Emulgatoren oder Konservierungsstoffen wäre hochverarbeitet (NOVA 4).",
};

const oatFlakes = plant({
  id: "oat_flakes", name: "Oat flakes", nameDe: "Haferflocken",
  class: "grains", group: "oats", preparation: "raw",
  ilealDigestibility: 0.828, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: FIELD_GRAIN,
  degradation: {
    waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.3,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.35,
    perishabilityDays: 180, processingStability: "dried",
  },
  phytochemicalIndex: 0.6,
  sources: [OATMEAL, proxy("Measured on cooked oatmeal; no value for uncooked flakes was found.")],
  notes: [
    {
      en: "Rolled whole oats: about 11 g fibre and 13 g protein per 100 g as bought.",
      de: "Gewalzter ganzer Hafer: etwa 11 g Ballaststoffe und 13 g Protein pro 100 g im Kaufzustand.",
    },
  ],
});

const ryeBreadWholemeal = plant({
  id: "rye_bread_wholemeal", name: "Wholemeal rye bread", nameDe: "Roggenvollkornbrot",
  class: "grains", group: "rye_bread", preparation: "baked",
  processing: { nova: 3 },
  ilealDigestibility: 0.456, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: FIELD_GRAIN,
  degradation: { ...BREAD, perishabilityDays: 7 },
  phytochemicalIndex: 0.6,
  sources: [pigIleal("Friesian-style wholeseed rye bread: 45.6 % of nitrogen.")],
  notes: [
    {
      en: "About 10 g fibre per 100 g, with about 440 mg sodium from the salt in the dough.",
      de: "Etwa 10 g Ballaststoffe pro 100 g, mit etwa 440 mg Natrium aus dem Salz im Teig.",
    },
    BREAD_NOVA,
  ],
});

const wheatBreadWholemeal = plant({
  id: "wheat_bread_wholemeal", name: "Wholemeal wheat bread", nameDe: "Weizenvollkornbrot",
  class: "grains", group: "wheat_bread_wholemeal", preparation: "baked",
  processing: { nova: 3 },
  ilealDigestibility: 0.707, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: FIELD_GRAIN,
  degradation: BREAD,
  phytochemicalIndex: 0.55,
  sources: [WHOLE_WHEAT_BREAD],
  notes: [
    {
      en: "About 7 g fibre per 100 g against 4 g in white bread, and nearly three times its magnesium.",
      de: "Etwa 7 g Ballaststoffe pro 100 g gegenüber 4 g im Weißbrot und fast dreimal so viel Magnesium.",
    },
    BREAD_NOVA,
  ],
});

const wheatBreadWhite = plant({
  id: "wheat_bread_white", name: "White wheat bread", nameDe: "Weizenbrot, Weißbrot",
  class: "grains", group: "wheat_bread_white", preparation: "baked",
  processing: { nova: 3 },
  ilealDigestibility: 0.903, resistantStarchG: 0,
  residue: FIELD_GRAIN,
  degradation: BREAD,
  phytochemicalIndex: 0.15,
  sources: [WALTHER_2019],
  notes: [
    {
      en: "Refined flour: bran and germ are milled off, and with them most of the fibre and magnesium.",
      de: "Auszugsmehl: Kleie und Keim werden abgemahlen und mit ihnen der größte Teil der Ballaststoffe und des Magnesiums.",
    },
    BREAD_NOVA,
  ],
});

const riceBrownBoiled = plant({
  id: "rice_brown_boiled", name: "Brown rice, boiled", nameDe: "Naturreis, gekocht",
  class: "grains", group: "rice_brown", preparation: "boiled",
  ilealDigestibility: 0.899, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: { ...FIELD_GRAIN, heavyMetalClass: "moderate" },
  degradation: BOILED_GRAIN,
  phytochemicalIndex: 0.4,
  sources: [pigIleal("Long-grain brown jasmine rice, cooked in a rice cooker: 89.9 % of nitrogen.")],
  notes: [
    {
      en: "The bran stays on: about three times the magnesium and twice the fibre of boiled white rice.",
      de: "Die Kleie bleibt dran: etwa dreimal so viel Magnesium und doppelt so viel Ballaststoffe wie gekochter weißer Reis.",
    },
  ],
});

const riceWhiteBoiled = plant({
  id: "rice_white_boiled", name: "White rice, boiled", nameDe: "Weißer Reis, gekocht",
  class: "grains", group: "rice_white", preparation: "boiled",
  ilealDigestibility: 0.951, resistantStarchG: 0,
  residue: { ...FIELD_GRAIN, heavyMetalClass: "moderate" },
  degradation: BOILED_GRAIN,
  phytochemicalIndex: 0.1,
  sources: [pigIleal("Thai Hom Mali white rice, cooked in a rice cooker: 95.1 % of nitrogen.")],
  notes: [
    {
      en: "Polished rice: bran and germ are removed, leaving mostly starch.",
      de: "Polierter Reis: Kleie und Keim sind entfernt, übrig bleibt vor allem Stärke.",
    },
  ],
});

const pastaBoiled = plant({
  id: "pasta_boiled", name: "Pasta, egg-free, boiled", nameDe: "Teigwaren, eifrei, gekocht",
  class: "grains", group: "pasta", preparation: "boiled",
  ilealDigestibility: 0.852, resistantStarchG: 0,
  residue: FIELD_GRAIN,
  degradation: BOILED_GRAIN,
  phytochemicalIndex: 0.15,
  sources: [pigIleal("Dried durum wheat fettuccine, simmered: 85.2 % of nitrogen.")],
  notes: [
    {
      en: "Refined wheat pasta. Amino acids BLS does not report come from the USDA entry.",
      de: "Teigwaren aus Auszugsmehl. Aminosäuren, die der BLS nicht angibt, stammen aus dem USDA-Eintrag.",
    },
  ],
});

const pastaWholemealBoiled = plant({
  id: "pasta_wholemeal_boiled", name: "Wholemeal pasta, egg-free, boiled", nameDe: "Vollkornteigwaren, eifrei, gekocht",
  class: "grains", group: "pasta_wholemeal", preparation: "boiled",
  ilealDigestibility: 0.707, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: FIELD_GRAIN,
  degradation: BOILED_GRAIN,
  phytochemicalIndex: 0.45,
  sources: [
    WHOLE_WHEAT_BREAD,
    proxy("No value for wholemeal pasta was found; the whole wheat bread value is used. Refined durum pasta measured 85.2 %."),
  ],
  notes: [
    {
      en: "About 2.5 times the fibre of refined pasta per 100 g.",
      de: "Etwa das 2,5-Fache an Ballaststoffen von Teigwaren aus Auszugsmehl pro 100 g.",
    },
  ],
});

const quinoaBoiled = plant({
  id: "quinoa_boiled", name: "Quinoa, boiled", nameDe: "Quinoa, gekocht",
  class: "grains", group: "quinoa", preparation: "boiled",
  ilealDigestibility: 0.854, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: FIELD_GRAIN,
  degradation: BOILED_GRAIN,
  phytochemicalIndex: 0.55,
  sources: [pigIleal("White quinoa, soaked 10 min, cooked in a rice cooker: 85.4 % of nitrogen.")],
  notes: [
    {
      en: "A seed cooked like a grain (a pseudocereal). Unlike wheat and rice, its amino acid pattern is complete against FAO 2013.",
      de: "Ein Samen, der wie Getreide gekocht wird (ein Pseudogetreide). Anders als bei Weizen und Reis ist sein Aminosäuremuster gemessen an FAO 2013 vollständig.",
    },
  ],
});

export const GRAIN_FOODS = [
  oatFlakes,
  prepared(oatFlakes, {
    id: "oat_porridge", name: "Oat porridge, boiled in water", nameDe: "Haferbrei, in Wasser gekocht",
    preparation: "boiled",
    sources: [OATMEAL],
    notes: [
      {
        en: "Oat flakes boiled in water: the same food, about five times more dilute per 100 g.",
        de: "In Wasser gekochte Haferflocken: dasselbe Lebensmittel, pro 100 g etwa fünfmal verdünnter.",
      },
    ],
  }),
  ryeBreadWholemeal,
  wheatBreadWholemeal,
  wheatBreadWhite,
  riceBrownBoiled,
  riceWhiteBoiled,
  pastaBoiled,
  pastaWholemealBoiled,
  quinoaBoiled,
].map(defineFood);
