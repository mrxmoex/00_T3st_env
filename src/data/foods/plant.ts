import type { FoodRecord, ResidueProfile } from "../../scoring/types";
import { defineFood, plant, prepared } from "./helpers";

const FAO_PULSES = { label: "FAO 2013 / DIAAS literature", note: "Pulse DIAAS typically 0.5–0.8; SAA limiting" };
const ALGAL_B12 = { label: "Watanabe et al. algal corrinoids", note: "B12 analogues — not counted as B12" };

const LEAFY_HIGH_SURFACE: ResidueProfile = {
  surfaceAreaClass: "high", systemicPesticideLikelihood: 0.45,
  contactPesticideLikelihood: 0.7, typicalMrlProximity: 0.4,
  heavyMetalClass: "low", veterinaryResidueClass: "none",
};

const spinachRaw = plant({
  id: "spinach_raw", name: "Spinach, raw", nameDe: "Spinat, roh",
  class: "leafy_salad", group: "spinach", preparation: "raw",
  ilealDigestibility: 0.76, zincBoundByPhytate: true, resistantStarchG: 0.1,
  residue: LEAFY_HIGH_SURFACE,
  degradation: {
    waterSolubleVitaminLoad: 0.85, cutSurfaceSensitivity: 0.9,
    heatSensitivity: 0.8, oxygenLightSensitivity: 0.85,
    perishabilityDays: 5, processingStability: "fresh",
  },
  phytochemicalIndex: 0.82,
  sources: [{ label: "IOM vitamin A RAE food factors", note: "β-carotene µg / 12" }],
  notes: [
    {
      en: "High folate and K. Non-heme iron + oxalate/phytate. Balanced but very dilute protein.",
      de: "Viel Folat und Vitamin K. Nicht-Hämeisen + Oxalat/Phytat. Ausgewogenes, aber sehr verdünntes Protein.",
    },
  ],
});

const kaleRaw = plant({
  id: "kale_raw", name: "Kale, raw", nameDe: "Grünkohl, roh",
  class: "leafy_salad", group: "kale", preparation: "raw",
  ilealDigestibility: 0.75, zincBoundByPhytate: true, resistantStarchG: 0.1,
  residue: {
    surfaceAreaClass: "high", systemicPesticideLikelihood: 0.4,
    contactPesticideLikelihood: 0.65, typicalMrlProximity: 0.38,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.8, cutSurfaceSensitivity: 0.75,
    heatSensitivity: 0.7, oxygenLightSensitivity: 0.75,
    perishabilityDays: 7, processingStability: "fresh",
  },
  phytochemicalIndex: 0.88,
  notes: [
    {
      en: "Glucosinolates + carotenoids. Still no retinol, B12, or complete dense protein.",
      de: "Glucosinolate + Carotinoide. Trotzdem kein Retinol, kein B12 und kein vollständiges, dichtes Protein.",
    },
  ],
});

const romaineRaw = plant({
  id: "romaine_raw", name: "Romaine lettuce, raw", nameDe: "Römersalat, roh",
  class: "leafy_salad", group: "romaine", preparation: "raw",
  ilealDigestibility: 0.72, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "high", systemicPesticideLikelihood: 0.5,
    contactPesticideLikelihood: 0.75, typicalMrlProximity: 0.45,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.7, cutSurfaceSensitivity: 0.95,
    heatSensitivity: 0.6, oxygenLightSensitivity: 0.8,
    perishabilityDays: 6, processingStability: "fresh",
  },
  phytochemicalIndex: 0.55,
  notes: [
    {
      en: "High surface area: residue and pathogen risk are material. Protein is nutritionally trivial.",
      de: "Große Oberfläche: Rückstands- und Keimrisiko sind erheblich. Protein ist ernährungsphysiologisch unbedeutend.",
    },
  ],
});

const lentilsBoiled = plant({
  id: "lentils_boiled", name: "Lentils, boiled", nameDe: "Linsen, gekocht",
  class: "legumes", group: "lentils", preparation: "boiled",
  ilealDigestibility: 0.8, zincBoundByPhytate: true, resistantStarchG: 2,
  residue: {
    surfaceAreaClass: "low", systemicPesticideLikelihood: 0.25,
    contactPesticideLikelihood: 0.15, typicalMrlProximity: 0.2,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.45, cutSurfaceSensitivity: 0.1,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.25,
    perishabilityDays: 4, processingStability: "cooked",
  },
  phytochemicalIndex: 0.7,
  sources: [FAO_PULSES],
  notes: [
    {
      en: "Lysine-rich, SAA-limited. Phytate binds Fe/Zn. Not a complete protein food.",
      de: "Lysinreich, SAA-limitiert. Phytat bindet Fe/Zn. Kein vollständiges Proteinlebensmittel.",
    },
  ],
});

const chickpeasBoiled = plant({
  id: "chickpeas_boiled", name: "Chickpeas, boiled", nameDe: "Kichererbsen, gekocht",
  class: "legumes", group: "chickpeas", preparation: "boiled",
  ilealDigestibility: 0.78, zincBoundByPhytate: true, resistantStarchG: 1.5,
  residue: {
    surfaceAreaClass: "low", systemicPesticideLikelihood: 0.22,
    contactPesticideLikelihood: 0.12, typicalMrlProximity: 0.18,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.4, cutSurfaceSensitivity: 0.1,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.2,
    perishabilityDays: 4, processingStability: "cooked",
  },
  phytochemicalIndex: 0.65,
  notes: [
    {
      en: "Better SAA than lentils, still incomplete vs FAO pattern after digestibility.",
      de: "Mehr SAA als Linsen, nach Verdaulichkeit aber weiterhin unvollständig gemessen am FAO-Muster.",
    },
  ],
});

const blackBeansBoiled = plant({
  id: "black_beans_boiled", name: "Black beans, boiled", nameDe: "Schwarze Bohnen, gekocht",
  class: "legumes", group: "black_beans", preparation: "boiled",
  ilealDigestibility: 0.77, zincBoundByPhytate: true, resistantStarchG: 2.4,
  residue: {
    surfaceAreaClass: "low", systemicPesticideLikelihood: 0.2,
    contactPesticideLikelihood: 0.12, typicalMrlProximity: 0.16,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.1,
    heatSensitivity: 0.35, oxygenLightSensitivity: 0.2,
    perishabilityDays: 4, processingStability: "cooked",
  },
  phytochemicalIndex: 0.72,
  notes: [
    {
      en: "Anthocyanins + fibre. Iron remains non-heme and phytate-bound.",
      de: "Anthocyane + Ballaststoffe. Eisen bleibt Nicht-Hämeisen und phytatgebunden.",
    },
  ],
});

const alfalfaSprouts = plant({
  id: "alfalfa_sprouts", name: "Alfalfa sprouts, raw", nameDe: "Alfalfasprossen, roh",
  class: "sprouts", group: "alfalfa_sprouts", preparation: "raw",
  ilealDigestibility: 0.73, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "high", systemicPesticideLikelihood: 0.12,
    contactPesticideLikelihood: 0.18, typicalMrlProximity: 0.12,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.8, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.7, oxygenLightSensitivity: 0.85,
    perishabilityDays: 3, processingStability: "fresh",
  },
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Historical Salmonella/E. coli outbreaks matter. Raw sprouts are a pathogen-risk class.",
      de: "Frühere Salmonellen- und E.-coli-Ausbrüche sind relevant. Rohe Sprossen sind eine Risikoklasse für Keime.",
    },
  ],
});

const broccoliRaw = plant({
  id: "broccoli_raw", name: "Broccoli, raw", nameDe: "Brokkoli, roh",
  class: "cruciferous_fresh", group: "broccoli", preparation: "raw",
  ilealDigestibility: 0.76, resistantStarchG: 0.2,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.3,
    contactPesticideLikelihood: 0.45, typicalMrlProximity: 0.28,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.85, cutSurfaceSensitivity: 0.7,
    heatSensitivity: 0.75, oxygenLightSensitivity: 0.7,
    perishabilityDays: 6, processingStability: "fresh",
  },
  phytochemicalIndex: 0.86,
  notes: [
    {
      en: "Fresh crucifer ≠ sauerkraut. Heat destroys myrosinase; vitamin C is labile.",
      de: "Frischer Kreuzblütler ≠ Sauerkraut. Hitze zerstört Myrosinase; Vitamin C ist labil.",
    },
  ],
});

const cabbageRaw = plant({
  id: "cabbage_raw", name: "White cabbage, raw", nameDe: "Weißkohl, roh",
  class: "cruciferous_fresh", group: "white_cabbage", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0.1,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.28,
    contactPesticideLikelihood: 0.4, typicalMrlProximity: 0.25,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.7, cutSurfaceSensitivity: 0.65,
    heatSensitivity: 0.65, oxygenLightSensitivity: 0.6,
    perishabilityDays: 14, processingStability: "fresh",
  },
  phytochemicalIndex: 0.7,
  notes: [
    {
      en: "Storage cabbage is more stable than salad greens; still no animal-exclusive nutrients.",
      de: "Lagerkohl ist stabiler als Blattsalat; trotzdem keine ausschließlich tierischen Nährstoffe.",
    },
  ],
});

const sauerkraut = plant({
  id: "sauerkraut", name: "Sauerkraut, drained", nameDe: "Sauerkraut, abgetropft",
  class: "cruciferous_fermented", group: "sauerkraut", preparation: "fermented",
  processing: { nova: 3 },
  ilealDigestibility: 0.78, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.15,
    contactPesticideLikelihood: 0.2, typicalMrlProximity: 0.15,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.55, cutSurfaceSensitivity: 0.2,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.35,
    perishabilityDays: 60, processingStability: "fermented",
  },
  phytochemicalIndex: 0.75,
  notes: [
    {
      en: "Fermentation ≠ fresh cabbage. Organic acids improve stability; sodium is high. Not a probiotic medicine.",
      de: "Fermentation ≠ frischer Kohl. Organische Säuren verbessern die Stabilität; Natrium ist hoch. Kein probiotisches Arzneimittel.",
    },
  ],
});

const kimchi = plant({
  id: "kimchi", name: "Kimchi (cabbage)", nameDe: "Kimchi (Kohl)",
  class: "cruciferous_fermented", group: "kimchi", preparation: "fermented",
  processing: { nova: 3 },
  ilealDigestibility: 0.78, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.18,
    contactPesticideLikelihood: 0.22, typicalMrlProximity: 0.16,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.5, cutSurfaceSensitivity: 0.2,
    heatSensitivity: 0.35, oxygenLightSensitivity: 0.3,
    perishabilityDays: 45, processingStability: "fermented",
  },
  phytochemicalIndex: 0.8,
  notes: [
    {
      en: "Not interchangeable with sauerkraut or fresh cabbage. Some recipes include fish sauce (not assumed here).",
      de: "Nicht austauschbar mit Sauerkraut oder frischem Kohl. Manche Rezepte enthalten Fischsauce (hier nicht angenommen).",
    },
  ],
});

const whiteMushroomRaw = plant({
  id: "white_mushroom_raw", name: "Button mushroom, raw", nameDe: "Champignon, roh",
  class: "mushrooms", group: "button_mushroom", preparation: "raw",
  ilealDigestibility: 0.7, b12IsAnalogue: true, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.2,
    contactPesticideLikelihood: 0.25, typicalMrlProximity: 0.2,
    heavyMetalClass: "moderate", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.55, cutSurfaceSensitivity: 0.7,
    heatSensitivity: 0.45, oxygenLightSensitivity: 0.5,
    perishabilityDays: 5, processingStability: "fresh",
  },
  phytochemicalIndex: 0.5,
  sources: [{ label: "Fungal B12", note: "Trace corrinoids are not reliable B12" }],
  notes: [
    {
      en: "Fungi are not plants. Chitin lowers digestibility. Ergothioneine ≠ polyphenol load.",
      de: "Pilze sind keine Pflanzen. Chitin senkt die Verdaulichkeit. Ergothionein ≠ Polyphenolgehalt.",
    },
  ],
});

const shiitakeRaw = plant({
  id: "shiitake_raw", name: "Shiitake, raw", nameDe: "Shiitake, roh",
  class: "mushrooms", group: "shiitake", preparation: "raw",
  ilealDigestibility: 0.72, resistantStarchG: 0.2,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.18,
    contactPesticideLikelihood: 0.2, typicalMrlProximity: 0.18,
    heavyMetalClass: "moderate", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.5, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.45,
    perishabilityDays: 7, processingStability: "fresh",
  },
  phytochemicalIndex: 0.62,
  notes: [
    {
      en: "UV-exposed mushrooms can raise vitamin D2; D2 ≠ D3 equivalence assumed here.",
      de: "UV-belichtete Pilze können Vitamin D2 erhöhen; D2 wird hier nicht mit D3 gleichgesetzt.",
    },
  ],
});

const noriRoasted = plant({
  id: "nori_roasted", name: "Nori sheet, roasted", nameDe: "Nori-Blatt, geröstet",
  class: "algae", group: "nori", preparation: "roasted",
  ilealDigestibility: 0.72, b12IsAnalogue: true, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "high", systemicPesticideLikelihood: 0.05,
    contactPesticideLikelihood: 0.05, typicalMrlProximity: 0.1,
    heavyMetalClass: "moderate", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.4, cutSurfaceSensitivity: 0.1,
    heatSensitivity: 0.35, oxygenLightSensitivity: 0.45,
    perishabilityDays: 180, processingStability: "dried",
  },
  phytochemicalIndex: 0.55,
  sources: [ALGAL_B12],
  notes: [
    {
      en: "Algae ≠ leafy greens ≠ mushrooms. Iodine can be excessive. B12 analogues score 0.",
      de: "Algen ≠ Blattgemüse ≠ Pilze. Jod kann übermäßig sein. B12-Analoga zählen 0.",
    },
  ],
});

const wakameRaw = plant({
  id: "wakame_raw", name: "Wakame, raw", nameDe: "Wakame, roh",
  class: "algae", group: "wakame", preparation: "raw",
  ilealDigestibility: 0.7, b12IsAnalogue: true, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "high", systemicPesticideLikelihood: 0.05,
    contactPesticideLikelihood: 0.05, typicalMrlProximity: 0.1,
    heavyMetalClass: "elevated", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.2,
    heatSensitivity: 0.3, oxygenLightSensitivity: 0.35,
    perishabilityDays: 14, processingStability: "fresh",
  },
  phytochemicalIndex: 0.5,
  sources: [ALGAL_B12],
  notes: [
    {
      en: "Some EPA, no DHA to speak of. Iodine and metals dominate risk. Not a salad green.",
      de: "Etwas EPA, kaum DHA. Jod und Metalle dominieren das Risiko. Kein Blattsalat.",
    },
  ],
});

const carrotRaw = plant({
  id: "carrot_raw", name: "Carrot, raw", nameDe: "Karotte, roh",
  class: "roots_tubers", group: "carrot", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0.2,
  residue: {
    surfaceAreaClass: "low", systemicPesticideLikelihood: 0.35,
    contactPesticideLikelihood: 0.3, typicalMrlProximity: 0.22,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.35, cutSurfaceSensitivity: 0.55,
    heatSensitivity: 0.35, oxygenLightSensitivity: 0.4,
    perishabilityDays: 21, processingStability: "fresh",
  },
  phytochemicalIndex: 0.55,
  sources: [{ label: "IOM RAE", note: "β-carotene µg / 12 → RAE, not retinol" }],
  notes: [
    {
      en: "Carotenoid-A is not retinol. Conversion is inefficient and genetically variable.",
      de: "Carotinoid-A ist kein Retinol. Die Umwandlung ist ineffizient und genetisch variabel.",
    },
  ],
});

const potatoBoiled = plant({
  id: "potato_boiled", name: "Potato, peeled, boiled", nameDe: "Kartoffel, geschält, gekocht",
  class: "roots_tubers", group: "potato", preparation: "boiled",
  ilealDigestibility: 0.8, resistantStarchG: 1.3,
  residue: {
    surfaceAreaClass: "low", systemicPesticideLikelihood: 0.4,
    contactPesticideLikelihood: 0.25, typicalMrlProximity: 0.3,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.4, cutSurfaceSensitivity: 0.5,
    heatSensitivity: 0.45, oxygenLightSensitivity: 0.3,
    perishabilityDays: 5, processingStability: "cooked",
  },
  phytochemicalIndex: 0.25,
  notes: [
    {
      en: "Active starch dominates. Cooling raises resistant starch; still not a micronutrient-dense food.",
      de: "Aktive Stärke dominiert. Abkühlen erhöht die resistente Stärke; trotzdem kein mikronährstoffdichtes Lebensmittel.",
    },
  ],
});

const SULFITE_RULE = {
  label: "21 CFR 182.3766 (sodium metabisulfite)",
  url: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-182/subpart-D/section-182.3766",
  note: "US rule: not used in meats or in food recognized as a source of vitamin B1, because sulfites destroy thiamin",
};

const potatoMash = prepared(potatoBoiled, {
  id: "potato_mash", name: "Mashed potatoes with whole milk", nameDe: "Kartoffelpüree mit Vollmilch",
  group: "potato_mash", preparation: "mashed",
  notes: [
    {
      en: "Home-made from boiled potatoes and whole milk: the reference for the instant version made with the same milk.",
      de: "Selbst gemacht aus gekochten Kartoffeln und Vollmilch: die Referenz für die Instant-Version mit derselben Milch.",
    },
  ],
});

const sweetPotatoBaked = plant({
  id: "sweet_potato_baked", name: "Sweet potato, baked", nameDe: "Süßkartoffel, gebacken",
  class: "roots_tubers", group: "sweet_potato", preparation: "baked",
  ilealDigestibility: 0.78, resistantStarchG: 0.8,
  residue: {
    surfaceAreaClass: "low", systemicPesticideLikelihood: 0.3,
    contactPesticideLikelihood: 0.2, typicalMrlProximity: 0.2,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.4, cutSurfaceSensitivity: 0.4,
    heatSensitivity: 0.4, oxygenLightSensitivity: 0.35,
    perishabilityDays: 6, processingStability: "cooked",
  },
  phytochemicalIndex: 0.48,
  notes: [
    {
      en: "Orange flesh is carotenoid-A, not retinol. Active sugars are higher than white potato.",
      de: "Oranges Fruchtfleisch liefert Carotinoid-A, kein Retinol. Mehr aktive Zucker als die weiße Kartoffel.",
    },
  ],
});

const tomatoRaw = plant({
  id: "tomato_raw", name: "Tomato, raw", nameDe: "Tomate, roh",
  class: "other_vegetables", group: "tomato", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.4,
    contactPesticideLikelihood: 0.55, typicalMrlProximity: 0.35,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.55, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.45, oxygenLightSensitivity: 0.5,
    perishabilityDays: 8, processingStability: "fresh",
  },
  phytochemicalIndex: 0.58,
  notes: [
    {
      en: "Lycopene is a phytochemical, not vitamin A. Fruiting vegetables ≠ leafy or legume.",
      de: "Lycopin ist ein sekundärer Pflanzenstoff, kein Vitamin A. Fruchtgemüse ≠ Blattgemüse oder Hülsenfrucht.",
    },
  ],
});

const redPepperRaw = plant({
  id: "red_bell_pepper_raw", name: "Red bell pepper, raw", nameDe: "Paprika, rot, roh",
  class: "other_vegetables", group: "red_pepper", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "medium", systemicPesticideLikelihood: 0.42,
    contactPesticideLikelihood: 0.6, typicalMrlProximity: 0.4,
    heavyMetalClass: "low", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.9, cutSurfaceSensitivity: 0.7,
    heatSensitivity: 0.8, oxygenLightSensitivity: 0.75,
    perishabilityDays: 8, processingStability: "fresh",
  },
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Exceptional vitamin C density; C degrades rapidly after cutting.",
      de: "Außergewöhnliche Vitamin-C-Dichte; Vitamin C zerfällt nach dem Schneiden schnell.",
    },
  ],
});

const rocketRaw = plant({
  id: "rocket_raw", name: "Rocket, raw", nameDe: "Rucola, roh",
  class: "leafy_salad", group: "rocket", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0,
  residue: LEAFY_HIGH_SURFACE,
  degradation: { ...spinachRaw.degradation, perishabilityDays: 4 },
  phytochemicalIndex: 0.8,
  notes: [
    {
      en: "A crucifer leaf: glucosinolates and nitrate. Non-heme iron, dilute protein.",
      de: "Ein Kreuzblütler-Blatt: Glucosinolate und Nitrat. Nicht-Hämeisen, verdünntes Protein.",
    },
  ],
});

const lambsLettuceRaw = plant({
  id: "lambs_lettuce_raw", name: "Lamb's lettuce, raw", nameDe: "Feldsalat, roh",
  class: "leafy_salad", group: "lambs_lettuce", preparation: "raw",
  ilealDigestibility: 0.72, resistantStarchG: 0,
  residue: romaineRaw.residue,
  degradation: { ...romaineRaw.degradation, perishabilityDays: 4 },
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Tender leaf with a large surface: folate and provitamin A, still no retinol or B12.",
      de: "Zartes Blatt mit großer Oberfläche: Folat und Provitamin A, trotzdem kein Retinol und kein B12.",
    },
  ],
});

const chardRaw = plant({
  id: "chard_raw", name: "Swiss chard, raw", nameDe: "Mangold, roh",
  class: "leafy_salad", group: "chard", preparation: "raw",
  ilealDigestibility: 0.75, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: LEAFY_HIGH_SURFACE,
  degradation: spinachRaw.degradation,
  phytochemicalIndex: 0.75,
  notes: [
    {
      en: "Betalain pigments and high oxalate; much of the calcium is oxalate-bound.",
      de: "Betalain-Farbstoffe und viel Oxalat; ein großer Teil des Calciums ist oxalatgebunden.",
    },
  ],
});

const redLentilsBoiled = plant({
  id: "red_lentils_boiled", name: "Red lentils, boiled", nameDe: "Rote Linsen, gekocht",
  class: "legumes", group: "red_lentils", preparation: "boiled",
  ilealDigestibility: 0.8, zincBoundByPhytate: true, resistantStarchG: 1.8,
  residue: lentilsBoiled.residue,
  degradation: lentilsBoiled.degradation,
  phytochemicalIndex: 0.55,
  sources: [FAO_PULSES],
  notes: [
    {
      en: "Dehulled lentils: less fibre and polyphenol than whole lentils; still SAA-limited.",
      de: "Geschälte Linsen: weniger Ballaststoffe und Polyphenole als ganze Linsen; weiterhin SAA-limitiert.",
    },
  ],
});

const kidneyBeansBoiled = plant({
  id: "kidney_beans_boiled", name: "Kidney beans, boiled", nameDe: "Kidneybohnen, gekocht",
  class: "legumes", group: "kidney_beans", preparation: "boiled",
  ilealDigestibility: 0.77, zincBoundByPhytate: true, resistantStarchG: 2,
  residue: blackBeansBoiled.residue,
  degradation: blackBeansBoiled.degradation,
  phytochemicalIndex: 0.7,
  notes: [
    {
      en: "Must be boiled: raw kidney beans carry phytohaemagglutinin. Anthocyanins sit in the red coat.",
      de: "Muss gekocht werden: Rohe Kidneybohnen enthalten Phytohämagglutinin. Anthocyane sitzen in der roten Schale.",
    },
  ],
});

const soybeansBoiled = plant({
  id: "soybeans_boiled", name: "Soybeans, boiled", nameDe: "Sojabohnen, gekocht",
  class: "legumes", group: "soybeans", preparation: "boiled",
  ilealDigestibility: 0.85, zincBoundByPhytate: true, resistantStarchG: 0.5,
  residue: chickpeasBoiled.residue,
  degradation: chickpeasBoiled.degradation,
  phytochemicalIndex: 0.75,
  notes: [
    {
      en: "Complete by the FAO adult pattern before digestibility, just under it after; phytate and isoflavones remain.",
      de: "Vor der Verdaulichkeit vollständig nach dem FAO-Muster für Erwachsene, danach knapp darunter; Phytat und Isoflavone bleiben.",
    },
  ],
});

const mungBeansBoiled = plant({
  id: "mung_beans_boiled", name: "Mung beans, boiled", nameDe: "Mungbohnen, gekocht",
  class: "legumes", group: "mung_beans", preparation: "boiled",
  ilealDigestibility: 0.78, zincBoundByPhytate: true, resistantStarchG: 1.5,
  residue: lentilsBoiled.residue,
  degradation: lentilsBoiled.degradation,
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Lysine-rich and SAA-limited like most pulses; phytate binds iron and zinc.",
      de: "Lysinreich und SAA-limitiert wie die meisten Hülsenfrüchte; Phytat bindet Eisen und Zink.",
    },
  ],
});

const tofu = plant({
  id: "tofu", name: "Tofu", nameDe: "Tofu",
  class: "legumes", group: "tofu", preparation: "processed",
  processing: { nova: 3 },
  ilealDigestibility: 0.9, zincBoundByPhytate: true, resistantStarchG: 0,
  residue: chickpeasBoiled.residue,
  degradation: {
    waterSolubleVitaminLoad: 0.3, cutSurfaceSensitivity: 0.3,
    heatSensitivity: 0.3, oxygenLightSensitivity: 0.3,
    perishabilityDays: 7, processingStability: "cooked",
  },
  phytochemicalIndex: 0.5,
  notes: [
    {
      en: "Soy curd: coagulation raises protein digestibility. Calcium depends on the coagulant.",
      de: "Sojaquark: Die Gerinnung verbessert die Proteinverdaulichkeit. Der Calciumgehalt hängt vom Gerinnungsmittel ab.",
    },
  ],
});

const mungBeanSprouts = plant({
  id: "mung_bean_sprouts", name: "Mung bean sprouts, raw", nameDe: "Mungbohnensprossen, roh",
  class: "sprouts", group: "mung_bean_sprouts", preparation: "raw",
  ilealDigestibility: 0.75, resistantStarchG: 0,
  residue: alfalfaSprouts.residue,
  degradation: alfalfaSprouts.degradation,
  phytochemicalIndex: 0.55,
  notes: [
    {
      en: "Sprouting lowers phytate; very watery and dilute in protein.",
      de: "Keimen senkt den Phytatgehalt; sehr wasserreich und proteinarm.",
    },
  ],
});

const lentilSprouts = plant({
  id: "lentil_sprouts", name: "Lentil sprouts, raw", nameDe: "Linsensprossen, roh",
  class: "sprouts", group: "lentil_sprouts", preparation: "raw",
  ilealDigestibility: 0.78, resistantStarchG: 0,
  residue: alfalfaSprouts.residue,
  degradation: alfalfaSprouts.degradation,
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Sprouting lowers phytate and raises vitamin C; pathogen risk as for all raw sprouts.",
      de: "Keimen senkt Phytat und erhöht Vitamin C; Keimrisiko wie bei allen rohen Sprossen.",
    },
  ],
});

const cauliflowerRaw = plant({
  id: "cauliflower_raw", name: "Cauliflower, raw", nameDe: "Blumenkohl, roh",
  class: "cruciferous_fresh", group: "cauliflower", preparation: "raw",
  ilealDigestibility: 0.76, resistantStarchG: 0.1,
  residue: broccoliRaw.residue,
  degradation: { ...broccoliRaw.degradation, perishabilityDays: 7 },
  phytochemicalIndex: 0.72,
  notes: [
    {
      en: "Glucosinolate-bearing crucifer with little carotenoid; vitamin C is its main micronutrient.",
      de: "Glucosinolathaltiger Kreuzblütler mit wenig Carotinoiden; Vitamin C ist sein wichtigster Mikronährstoff.",
    },
  ],
});

const brusselsSproutsRaw = plant({
  id: "brussels_sprouts_raw", name: "Brussels sprouts, raw", nameDe: "Rosenkohl, roh",
  class: "cruciferous_fresh", group: "brussels_sprouts", preparation: "raw",
  ilealDigestibility: 0.76, resistantStarchG: 0.1,
  residue: cabbageRaw.residue,
  degradation: { ...broccoliRaw.degradation, perishabilityDays: 7 },
  phytochemicalIndex: 0.88,
  notes: [
    {
      en: "Among the richest crucifers in glucosinolates; boiling leaches part of them.",
      de: "Einer der glucosinolatreichsten Kreuzblütler; Kochen laugt einen Teil davon aus.",
    },
  ],
});

const chineseCabbageRaw = plant({
  id: "chinese_cabbage_raw", name: "Chinese cabbage, raw", nameDe: "Chinakohl, roh",
  class: "cruciferous_fresh", group: "chinese_cabbage", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0,
  residue: cabbageRaw.residue,
  degradation: { ...cabbageRaw.degradation, perishabilityDays: 10 },
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Mild, watery crucifer and the base of kimchi; low in protein.",
      de: "Milder, wasserreicher Kreuzblütler und Grundlage von Kimchi; wenig Protein.",
    },
  ],
});

const oysterMushroomRaw = plant({
  id: "oyster_mushroom_raw", name: "Oyster mushroom, raw", nameDe: "Austernpilz, roh",
  class: "mushrooms", group: "oyster_mushroom", preparation: "raw",
  ilealDigestibility: 0.7, resistantStarchG: 0,
  residue: whiteMushroomRaw.residue,
  degradation: whiteMushroomRaw.degradation,
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Chitin-rich fungus with ergothioneine; no B12, and no vitamin D without UV exposure.",
      de: "Chitinreicher Pilz mit Ergothionein; kein B12 und ohne UV-Belichtung kein Vitamin D.",
    },
  ],
});

const chanterelleRaw = plant({
  id: "chanterelle_raw", name: "Chanterelle, raw", nameDe: "Pfifferling, roh",
  class: "mushrooms", group: "chanterelle", preparation: "raw",
  ilealDigestibility: 0.68, resistantStarchG: 0,
  residue: { ...whiteMushroomRaw.residue, systemicPesticideLikelihood: 0.05, contactPesticideLikelihood: 0.05 },
  degradation: { ...whiteMushroomRaw.degradation, perishabilityDays: 4 },
  phytochemicalIndex: 0.55,
  notes: [
    {
      en: "Wild mushroom: vitamin D2 from sunlight. Metal and radiocaesium load depend on where it grew.",
      de: "Wildpilz: Vitamin D2 aus Sonnenlicht. Metall- und Radiocäsiumbelastung hängen vom Standort ab.",
    },
  ],
});

const spirulinaDried = plant({
  id: "spirulina_dried", name: "Spirulina, dried", nameDe: "Spirulina, getrocknet",
  class: "algae", group: "spirulina", preparation: "dried",
  ilealDigestibility: 0.8, b12IsAnalogue: true, resistantStarchG: 0,
  residue: {
    surfaceAreaClass: "none", systemicPesticideLikelihood: 0.05,
    contactPesticideLikelihood: 0.05, typicalMrlProximity: 0.1,
    heavyMetalClass: "moderate", veterinaryResidueClass: "none",
  },
  degradation: {
    waterSolubleVitaminLoad: 0.4, cutSurfaceSensitivity: 0.1,
    heatSensitivity: 0.35, oxygenLightSensitivity: 0.5,
    perishabilityDays: 365, processingStability: "dried",
  },
  phytochemicalIndex: 0.7,
  sources: [{ label: "Watanabe et al. 1999", note: "Spirulina B12 is predominantly inactive pseudovitamin B12" }],
  notes: [
    {
      en: "A cyanobacterium, not a true alga. Its measured B12 is mostly inactive pseudovitamin B12.",
      de: "Ein Cyanobakterium, keine echte Alge. Das gemessene B12 ist größtenteils inaktives Pseudovitamin B12.",
    },
  ],
});

const beetrootRaw = plant({
  id: "beetroot_raw", name: "Beetroot, raw", nameDe: "Rote Bete, roh",
  class: "roots_tubers", group: "beetroot", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0,
  residue: carrotRaw.residue,
  degradation: { ...carrotRaw.degradation, perishabilityDays: 14 },
  phytochemicalIndex: 0.8,
  notes: [
    {
      en: "Betalains and nitrate; for a root, the carbohydrate is sugar-dominant.",
      de: "Betalaine und Nitrat; für eine Wurzel sind die Kohlenhydrate zuckerdominiert.",
    },
  ],
});

const zucchiniRaw = plant({
  id: "zucchini_raw", name: "Zucchini, raw", nameDe: "Zucchini, roh",
  class: "other_vegetables", group: "zucchini", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0,
  residue: tomatoRaw.residue,
  degradation: {
    waterSolubleVitaminLoad: 0.6, cutSurfaceSensitivity: 0.6,
    heatSensitivity: 0.5, oxygenLightSensitivity: 0.5,
    perishabilityDays: 7, processingStability: "fresh",
  },
  phytochemicalIndex: 0.4,
  notes: [
    {
      en: "Very watery: little of anything per gram, moderate density per calorie.",
      de: "Sehr wasserreich: pro Gramm von allem wenig, pro Kalorie mäßige Dichte.",
    },
  ],
});

const aubergineRaw = plant({
  id: "aubergine_raw", name: "Aubergine, raw", nameDe: "Aubergine, roh",
  class: "other_vegetables", group: "aubergine", preparation: "raw",
  ilealDigestibility: 0.74, resistantStarchG: 0,
  residue: tomatoRaw.residue,
  degradation: {
    waterSolubleVitaminLoad: 0.5, cutSurfaceSensitivity: 0.7,
    heatSensitivity: 0.5, oxygenLightSensitivity: 0.6,
    perishabilityDays: 7, processingStability: "fresh",
  },
  phytochemicalIndex: 0.6,
  notes: [
    {
      en: "Nasunin anthocyanin in the skin; low micronutrient density.",
      de: "Nasunin-Anthocyan in der Schale; geringe Mikronährstoffdichte.",
    },
  ],
});

export const PLANT_FOODS: FoodRecord[] = [
  spinachRaw,
  prepared(spinachRaw, { id: "spinach_boiled", name: "Spinach, boiled", nameDe: "Spinat, gekocht", preparation: "boiled" }),
  prepared(spinachRaw, { id: "spinach_stewed", name: "Spinach, stewed", nameDe: "Spinat, gedünstet", preparation: "stewed" }),
  kaleRaw,
  prepared(kaleRaw, { id: "kale_boiled", name: "Kale, boiled", nameDe: "Grünkohl, gekocht", preparation: "boiled" }),
  prepared(kaleRaw, { id: "kale_steamed", name: "Kale, steamed", nameDe: "Grünkohl, gedämpft", preparation: "steamed" }),
  romaineRaw,
  rocketRaw,
  lambsLettuceRaw,
  chardRaw,
  lentilsBoiled,
  redLentilsBoiled,
  chickpeasBoiled,
  blackBeansBoiled,
  kidneyBeansBoiled,
  soybeansBoiled,
  mungBeansBoiled,
  tofu,
  alfalfaSprouts,
  mungBeanSprouts,
  lentilSprouts,
  broccoliRaw,
  prepared(broccoliRaw, { id: "broccoli_boiled", name: "Broccoli, boiled", nameDe: "Brokkoli, gekocht", preparation: "boiled" }),
  prepared(broccoliRaw, { id: "broccoli_stewed", name: "Broccoli, stewed", nameDe: "Brokkoli, gedünstet", preparation: "stewed" }),
  cabbageRaw,
  prepared(cabbageRaw, { id: "cabbage_boiled", name: "White cabbage, boiled", nameDe: "Weißkohl, gekocht", preparation: "boiled" }),
  cauliflowerRaw,
  brusselsSproutsRaw,
  prepared(brusselsSproutsRaw, {
    id: "brussels_sprouts_boiled", name: "Brussels sprouts, boiled", nameDe: "Rosenkohl, gekocht", preparation: "boiled",
  }),
  chineseCabbageRaw,
  sauerkraut,
  prepared(sauerkraut, { id: "sauerkraut_stewed", name: "Sauerkraut, stewed", nameDe: "Sauerkraut, gedünstet", preparation: "stewed" }),
  kimchi,
  whiteMushroomRaw,
  prepared(whiteMushroomRaw, {
    id: "white_mushroom_fried", name: "Button mushroom, pan-fried", nameDe: "Champignon, in der Pfanne gebraten", preparation: "fried",
  }),
  shiitakeRaw,
  prepared(shiitakeRaw, { id: "shiitake_stewed", name: "Shiitake, stewed", nameDe: "Shiitake, gedünstet", preparation: "stewed" }),
  prepared(shiitakeRaw, { id: "shiitake_dried", name: "Shiitake, dried", nameDe: "Shiitake, getrocknet", preparation: "dried" }),
  oysterMushroomRaw,
  chanterelleRaw,
  noriRoasted,
  wakameRaw,
  spirulinaDried,
  carrotRaw,
  prepared(carrotRaw, { id: "carrot_boiled", name: "Carrot, boiled", nameDe: "Karotte, gekocht", preparation: "boiled" }),
  potatoBoiled,
  prepared(potatoBoiled, {
    id: "potato_baked", name: "Potato, unpeeled, baked", nameDe: "Kartoffel, ungeschält, gebacken", preparation: "baked",
  }),
  prepared(potatoBoiled, {
    id: "potato_canned", name: "Potatoes, precooked, canned, drained", nameDe: "Kartoffeln, vorgegart, Konserve, abgetropft",
    preparation: "canned",
    processing: { nova: 3, evidence: "en:canned-potatoes" },
    sources: [SULFITE_RULE],
    notes: [
      {
        en: "Precooked and kept in brine: water-soluble vitamins leach into the liquid that is poured away, salt goes in. Sulfites, common in this category, destroy thiamin.",
        de: "Vorgegart und in Lake gelagert: wasserlösliche Vitamine gehen in die Flüssigkeit, die weggegossen wird, Salz geht hinein. Sulfite, in dieser Kategorie verbreitet, zerstören Thiamin.",
      },
    ],
  }),
  potatoMash,
  prepared(potatoMash, {
    id: "potato_mash_instant", name: "Mashed potatoes from instant powder, with whole milk",
    nameDe: "Kartoffelpüree aus Instantpulver, mit Vollmilch", preparation: "instant",
    processing: { nova: 4, evidence: "en:instant-mashed-potatoes" },
    sources: [SULFITE_RULE],
    notes: [
      {
        en: "Dehydrated flakes: drying and storage leave almost no vitamin C, B6, or folate. Emulsifiers and sulfites keep the powder usable, which is what makes it ultra-processed.",
        de: "Getrocknete Flocken: Trocknung und Lagerung lassen kaum Vitamin C, B6 oder Folat übrig. Emulgatoren und Sulfite halten das Pulver verwendbar, das macht es hochverarbeitet.",
      },
    ],
  }),
  prepared(sweetPotatoBaked, {
    id: "sweet_potato_boiled", name: "Sweet potato, boiled", nameDe: "Süßkartoffel, gekocht", preparation: "boiled",
  }),
  sweetPotatoBaked,
  beetrootRaw,
  prepared(beetrootRaw, { id: "beetroot_boiled", name: "Beetroot, boiled", nameDe: "Rote Bete, gekocht", preparation: "boiled" }),
  tomatoRaw,
  redPepperRaw,
  prepared(redPepperRaw, {
    id: "red_bell_pepper_grilled", name: "Red bell pepper, grilled", nameDe: "Paprika, rot, gegrillt", preparation: "grilled",
  }),
  zucchiniRaw,
  aubergineRaw,
].map(defineFood);
