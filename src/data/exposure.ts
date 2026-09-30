/**
 * Environmental exposures and E-numbers. Shown as honorary mentions, not scores.
 * A food is tagged only when a published source ties that exposure to the food
 * class or the preparation. No concentration is invented.
 */

import type { LocalizedText } from "../i18n/locale";
import { isPlantClass, type FoodRecord, type Preparation } from "../scoring/types";
import { PROCESSING_EVIDENCE } from "./processing";

export interface Cited {
  citation: string;
  url: string;
}

export const EXPOSURE_SOURCES = {
  efsaFluoride: {
    citation: "EFSA NDA Panel (2013). Scientific Opinion on Dietary Reference Values for fluoride. EFSA Journal 11(8):3332. Upper level for adults: 7 mg/day (EFSA 2005).",
    url: "https://doi.org/10.2903/j.efsa.2013.3332",
  },
  iarcGlyphosate: {
    citation: "IARC (2017). Some organophosphate insecticides and herbicides, volume 112. Glyphosate classified as Group 2A, probably carcinogenic to humans, in 2015.",
    url: "https://publications.iarc.who.int/549",
  },
  euGlyphosate: {
    citation: "Commission Implementing Regulation (EU) 2023/2660. Renews glyphosate approval for 10 years after the EFSA peer review did not identify a carcinogenic hazard classification.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2660",
  },
  efsaPfas: {
    citation: "EFSA CONTAM Panel (2020). Risk to human health related to the presence of perfluoroalkyl substances in food. EFSA Journal 18(9):6223. Group TWI 4.4 ng/kg body weight per week for the sum of PFOA, PFNA, PFHxS and PFOS.",
    url: "https://doi.org/10.2903/j.efsa.2020.6223",
  },
  efsaAcrylamide: {
    citation: "EFSA CONTAM Panel (2015). Scientific Opinion on acrylamide in food. EFSA Journal 13(6):4104. Acrylamide is genotoxic; it forms when asparagine and reducing sugars are heated dry, as in frying, baking and roasting.",
    url: "https://doi.org/10.2903/j.efsa.2015.4104",
  },
  whoMicroplastics: {
    citation: "WHO (2022). Dietary and inhalation exposure to nano- and microplastic particles and potential implications for human health.",
    url: "https://www.who.int/publications/i/item/9789240054608",
  },
  efsaMercury: {
    citation: "EFSA CONTAM Panel (2012). Scientific Opinion on the risk for public health related to the presence of mercury and methylmercury in food. EFSA Journal 10(12):2985.",
    url: "https://doi.org/10.2903/j.efsa.2012.2985",
  },
  efsaCadmium: {
    citation: "EFSA CONTAM Panel (2009). Cadmium in food. EFSA Journal 7(3):980. Highest levels in offal, seaweed, cocoa and some leafy vegetables and cereals.",
    url: "https://doi.org/10.2903/j.efsa.2009.980",
  },
  efsaLead: {
    citation: "EFSA CONTAM Panel (2010). Scientific Opinion on lead in food. EFSA Journal 8(4):1570. No threshold was identified for the neurodevelopmental effect.",
    url: "https://doi.org/10.2903/j.efsa.2010.1570",
  },
  euTiO2: {
    citation: "Commission Regulation (EU) 2022/63. Bans titanium dioxide (E171) as a food additive because a genotoxic concern could not be excluded.",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R0063",
  },
  iarcAspartame: {
    citation: "IARC (2023). Aspartame classified as Group 2B, possibly carcinogenic. JECFA kept the acceptable daily intake at 0–40 mg/kg body weight.",
    url: "https://www.who.int/news/item/14-07-2023-aspartame-hazard-and-risk-assessment-results-released",
  },
  efsaNitrite: {
    citation: "EFSA ANS Panel (2017). Re-evaluation of potassium nitrite (E249) and sodium nitrite (E250) as food additives. EFSA Journal 15(6):4786. Nitrite can form nitrosamines.",
    url: "https://doi.org/10.2903/j.efsa.2017.4786",
  },
  efsaSulfite: {
    citation: "EFSA ANS Panel (2016). Re-evaluation of sulfur dioxide–sulfites (E220–E228). EFSA Journal 14(4):4438. Sulfites can provoke reactions in sensitive people and destroy thiamin.",
    url: "https://doi.org/10.2903/j.efsa.2016.4438",
  },
  mccann2007: {
    citation: "McCann D, Barrett A, Cooper A, et al. (2007). Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children in the community: a randomised, double-blinded, placebo-controlled trial. Lancet 370:1560–1567.",
    url: "https://doi.org/10.1016/S0140-6736(07)61306-3",
  },
  iarcBha: {
    citation: "IARC lists butylated hydroxyanisole (BHA) as Group 2B, possibly carcinogenic to humans, on the basis of animal experiments.",
    url: "https://monographs.iarc.who.int/list-of-classifications",
  },
} as const;

export type ExposureSourceId = keyof typeof EXPOSURE_SOURCES;

export const EXPOSURE_IDS = [
  "fluoride",
  "glyphosate",
  "pfas",
  "microplastics",
  "acrylamide",
  "methylmercury",
  "cadmium",
  "lead",
] as const;
export type ExposureId = (typeof EXPOSURE_IDS)[number];

export interface ExposureCard {
  id: ExposureId;
  title: LocalizedText;
  body: LocalizedText;
  /** Where it turns up. Not a concentration. */
  where: LocalizedText;
  sources: readonly ExposureSourceId[];
}

export const EXPOSURE_CARDS: Readonly<Record<ExposureId, ExposureCard>> = {
  fluoride: {
    id: "fluoride",
    title: { en: "Fluoride", de: "Fluorid" },
    where: {
      en: "Drinking water and tea dominate intake. This catalog does not measure fluoride in foods.",
      de: "Trinkwasser und Tee bestimmen die Aufnahme. Dieser Katalog misst kein Fluorid in Lebensmitteln.",
    },
    body: {
      en: "Fluoride is built into tooth and bone mineral. That is useful at a low intake and damaging when the intake stays high: dental fluorosis, then skeletal fluorosis. The adult upper level is 7 mg/day. It is not stored in fat.",
      de: "Fluorid wird in Zahn- und Knochenmineral eingebaut. Das ist bei niedriger Aufnahme nützlich und schädlich, wenn die Aufnahme hoch bleibt: Zahnfluorose, dann Skelettfluorose. Die Höchstmenge für Erwachsene liegt bei 7 mg/Tag. Es wird nicht im Fett gespeichert.",
    },
    sources: ["efsaFluoride"],
  },
  glyphosate: {
    id: "glyphosate",
    title: { en: "Glyphosate", de: "Glyphosat" },
    where: {
      en: "A herbicide used on many field crops. The nutrient databases do not report a residue for this food.",
      de: "Ein Herbizid, das auf vielen Feldfrüchten eingesetzt wird. Die Nährwertdatenbanken nennen für dieses Lebensmittel keinen Rückstand.",
    },
    body: {
      en: "IARC classes glyphosate as Group 2A, probably carcinogenic to humans. The EU renewed its approval for ten years in 2023 after EFSA did not identify a carcinogenic hazard classification. Both statements are published. Washing does not remove a systemic herbicide from inside the tissue. This app does not invent a milligram value.",
      de: "Die IARC stuft Glyphosat als Gruppe 2A ein, wahrscheinlich krebserregend für den Menschen. Die EU hat die Zulassung 2023 für zehn Jahre verlängert, nachdem die EFSA keine krebserregende Gefahreneinstufung festgestellt hat. Beide Aussagen sind veröffentlicht. Waschen entfernt ein systemisches Herbizid nicht aus dem Gewebe. Diese App erfindet keinen Milligrammwert.",
    },
    sources: ["iarcGlyphosate", "euGlyphosate"],
  },
  pfas: {
    id: "pfas",
    title: { en: "PFAS, including Teflon-adjacent chemistry", de: "PFAS, einschließlich Teflon-naher Chemie" },
    where: {
      en: "EFSA finds the largest food contributions in fish, eggs, fruit and drinking water, plus greaseproof packaging and some processing equipment. PTFE (Teflon) is a polymer; PFOA was a processing aid, not the polymer itself.",
      de: "Die EFSA findet die größten Beiträge über Lebensmittel bei Fisch, Eiern, Obst und Trinkwasser, dazu fettabweisende Verpackungen und manche Verarbeitungsanlagen. PTFE (Teflon) ist ein Polymer; PFOA war ein Herstellungshilfsstoff, nicht das Polymer selbst.",
    },
    body: {
      en: "The long-chain PFAS EFSA assessed (PFOA, PFNA, PFHxS, PFOS) bind to albumin in blood. They are not metabolised. Half-lives of PFOS and PFOA are mostly 2–6 years, and several of the longer chains can exceed 3 years, because the kidney reabsorbs them. The group tolerable weekly intake is 4.4 ng per kg body weight. Short-chain PFAS leave in days to about a month. This is protein binding and slow excretion, not storage in fat.",
      de: "Die langkettigen PFAS, die die EFSA bewertet hat (PFOA, PFNA, PFHxS, PFOS), binden an Albumin im Blut. Sie werden nicht verstoffwechselt. Die Halbwertszeiten von PFOS und PFOA liegen meist bei 2–6 Jahren, und mehrere der längeren Ketten können 3 Jahre überschreiten, weil die Niere sie rückresorbiert. Die gruppenbezogene duldbare wöchentliche Aufnahmemenge liegt bei 4,4 ng je kg Körpergewicht. Kurzkettige PFAS gehen in Tagen bis etwa einem Monat. Das ist Proteinbindung und langsame Ausscheidung, keine Speicherung im Fett.",
    },
    sources: ["efsaPfas"],
  },
  microplastics: {
    id: "microplastics",
    title: { en: "Microplastics and nonpolar storage", de: "Mikroplastik und unpolare Speicherung" },
    where: {
      en: "Seafood and packaged foods are the routes discussed. This catalog does not count plastic particles.",
      de: "Meeresfrüchte und verpackte Lebensmittel sind die diskutierten Wege. Dieser Katalog zählt keine Plastikteilchen.",
    },
    body: {
      en: "Hydrophobic substances partition into nonpolar phases. Body fat is such a phase, which is why dioxins and PCBs stay there for years. Plastic particles are another nonpolar surface, so the same substances can adsorb onto them. WHO reviewed dietary microplastics in 2022 and did not find a measured health risk at the exposures then estimated. The plastic is not a second body store of known size.",
      de: "Wasserabweisende Stoffe verteilen sich in unpolare Phasen. Körperfett ist so eine Phase, deshalb bleiben Dioxine und PCB dort über Jahre. Plastikteilchen sind eine weitere unpolare Oberfläche, deshalb können dieselben Stoffe daran haften. Die WHO hat Mikroplastik in der Nahrung 2022 geprüft und bei den damals geschätzten Aufnahmen kein gemessenes Gesundheitsrisiko gefunden. Das Plastik ist kein zweiter Körperspeicher mit bekannter Größe.",
    },
    sources: ["whoMicroplastics"],
  },
  acrylamide: {
    id: "acrylamide",
    title: { en: "Acrylamide", de: "Acrylamid" },
    where: {
      en: "Dry, hot cooking of starch with the amino acid asparagine: frying, baking, roasting. Boiling and steaming hardly form it.",
      de: "Trockenes, heißes Garen von Stärke mit der Aminosäure Asparagin: Frittieren, Backen, Rösten. Kochen und Dämpfen bilden kaum welches.",
    },
    body: {
      en: "Acrylamide is genotoxic. EFSA did not set a tolerable intake, because a threshold for that effect is not assumed. It is a product of the cooking, not an ingredient, and it is not in the nutrient row.",
      de: "Acrylamid ist genotoxisch. Die EFSA hat keine duldbare Aufnahme festgelegt, weil für diese Wirkung keine Schwelle angenommen wird. Es entsteht beim Garen, es ist keine Zutat, und es steht nicht in der Nährwertzeile.",
    },
    sources: ["efsaAcrylamide"],
  },
  methylmercury: {
    id: "methylmercury",
    title: { en: "Methylmercury", de: "Methylquecksilber" },
    where: {
      en: "Fish. Larger, older predatory fish carry more. This row is not a mercury test of this fillet.",
      de: "Fisch. Größere, ältere Raubfische tragen mehr. Diese Zeile ist kein Quecksilbertest dieses Filets.",
    },
    body: {
      en: "Methylmercury crosses into the brain. The biological half-life is about two months, so regular intake of large predatory fish builds it up. EFSA's concern is neurodevelopment.",
      de: "Methylquecksilber gelangt ins Gehirn. Die biologische Halbwertszeit liegt bei etwa zwei Monaten, deshalb baut regelmäßiger Verzehr großer Raubfische es auf. Die Sorge der EFSA gilt der Entwicklung des Nervensystems.",
    },
    sources: ["efsaMercury"],
  },
  cadmium: {
    id: "cadmium",
    title: { en: "Cadmium", de: "Cadmium" },
    where: {
      en: "Offal, some seaweeds, and some leafy crops and cereals. Not a measurement of this sample.",
      de: "Innereien, manche Algen und manche Blattgemüse und Getreide. Keine Messung dieser Probe.",
    },
    body: {
      en: "Cadmium accumulates in the kidney. The biological half-life is 10–30 years. It is a metal store, not a fat store.",
      de: "Cadmium reichert sich in der Niere an. Die biologische Halbwertszeit liegt bei 10–30 Jahren. Das ist ein Metallspeicher, kein Fettspeicher.",
    },
    sources: ["efsaCadmium"],
  },
  lead: {
    id: "lead",
    title: { en: "Lead", de: "Blei" },
    where: {
      en: "A general contaminant of food and water. Offal and foods grown on contaminated soil contribute. Not measured here.",
      de: "Ein allgemeiner Kontaminant von Lebensmitteln und Wasser. Innereien und Lebensmittel von belasteten Böden tragen bei. Hier nicht gemessen.",
    },
    body: {
      en: "Lead is stored in bone for decades. EFSA identified no threshold for the effect on neurodevelopment. That is why a small, repeated intake is the problem, not one meal.",
      de: "Blei wird über Jahrzehnte im Knochen gespeichert. Die EFSA hat keine Schwelle für die Wirkung auf die Entwicklung des Nervensystems gefunden. Deshalb ist die kleine, wiederholte Aufnahme das Problem, nicht eine Mahlzeit.",
    },
    sources: ["efsaLead"],
  },
};

const HOT_DRY: ReadonlySet<Preparation> = new Set(["fried", "baked", "roasted", "grilled"]);

/** Which honorary mentions apply to this food. Fluoride stays on the exposure page: water and tea, not this catalog. */
export function exposureForFood(food: FoodRecord): ExposureId[] {
  const ids: ExposureId[] = [];
  if (isPlantClass(food.class) && food.class !== "algae" && food.class !== "mushrooms") ids.push("glyphosate");
  if (food.class === "muscle_fish" || food.class === "eggs") ids.push("pfas");
  if (food.processing.nova >= 3) ids.push("pfas");
  if (food.class === "muscle_fish" || food.processing.nova >= 3) ids.push("microplastics");
  if ((food.class === "roots_tubers" || food.group === "potato_mash") && HOT_DRY.has(food.preparation)) ids.push("acrylamide");
  if (food.preparation === "instant") ids.push("acrylamide");
  if (food.class === "muscle_fish") ids.push("methylmercury");
  if (food.class === "organs" || food.class === "leafy_salad" || food.class === "algae") ids.push("cadmium");
  if (food.class === "organs") ids.push("lead");
  return [...new Set(ids)];
}

export interface AdditiveEntry {
  code: string;
  name: LocalizedText;
  role: LocalizedText;
  /** Null when there is no published body-behavior claim worth making. */
  body: LocalizedText | null;
  source: ExposureSourceId | null;
  /** True when this code appeared in the Open Food Facts categories this app counts. */
  inTrackedCategories: boolean;
}

const TRACKED = new Set(
  Object.values(PROCESSING_EVIDENCE.categories).flatMap((category) =>
    category.all.additives.map((item) => item.code),
  ),
);

function entry(
  code: string,
  name: LocalizedText,
  role: LocalizedText,
  body: LocalizedText | null,
  source: ExposureSourceId | null,
): AdditiveEntry {
  return { code, name, role, body, source, inTrackedCategories: TRACKED.has(code) };
}

export const ADDITIVE_ENTRIES: readonly AdditiveEntry[] = [
  entry("E100", { en: "Curcumin", de: "Kurkumin" }, { en: "Colour", de: "Farbstoff" }, null, null),
  entry(
    "E102",
    { en: "Tartrazine", de: "Tartrazin" },
    { en: "Colour", de: "Farbstoff" },
    {
      en: "A Southampton study linked mixtures of certain colours, including tartrazine, with increased hyperactivity in some children. EFSA kept an acceptable daily intake. Not seen in the categories counted here.",
      de: "Eine Southampton-Studie verband Mischungen bestimmter Farbstoffe, darunter Tartrazin, mit mehr Hyperaktivität bei manchen Kindern. Die EFSA behielt eine duldbare tägliche Aufnahmemenge. In den hier gezählten Kategorien nicht gesehen.",
    },
    "mccann2007",
  ),
  entry(
    "E171",
    { en: "Titanium dioxide", de: "Titandioxid" },
    { en: "Colour, banned as a food additive in the EU since 2022", de: "Farbstoff, seit 2022 als Lebensmittelzusatzstoff in der EU verboten" },
    {
      en: "The EU ban followed an opinion that a genotoxic concern could not be excluded. It is not an E-number still in use in EU food. Not seen in the categories counted here.",
      de: "Das EU-Verbot folgte einer Stellungnahme, nach der eine genotoxische Besorgnis nicht ausgeschlossen werden konnte. Es ist kein E-Nummer, die in EU-Lebensmitteln noch verwendet wird. In den hier gezählten Kategorien nicht gesehen.",
    },
    "euTiO2",
  ),
  entry(
    "E220",
    { en: "Sulfur dioxide", de: "Schwefeldioxid" },
    { en: "Preservative", de: "Konservierungsstoff" },
    {
      en: "Sulfites destroy thiamin and can provoke reactions in sensitive people, including some with asthma. The same applies to E221–E228.",
      de: "Sulfite zerstören Thiamin und können bei empfindlichen Menschen Reaktionen auslösen, auch bei manchen mit Asthma. Dasselbe gilt für E221–E228.",
    },
    "efsaSulfite",
  ),
  entry("E221", { en: "Sodium sulfite", de: "Natriumsulfit" }, { en: "Preservative", de: "Konservierungsstoff" }, {
    en: "A sulfite. It destroys thiamin and can provoke reactions in sensitive people.",
    de: "Ein Sulfit. Es zerstört Thiamin und kann bei empfindlichen Menschen Reaktionen auslösen.",
  }, "efsaSulfite"),
  entry("E223", { en: "Sodium metabisulfite", de: "Natriummetabisulfit" }, { en: "Preservative", de: "Konservierungsstoff" }, {
    en: "A sulfite, common in potato products. It destroys thiamin. US law bars sulfites from foods recognised as a source of vitamin B1.",
    de: "Ein Sulfit, in Kartoffelprodukten verbreitet. Es zerstört Thiamin. Das US-Recht schließt Sulfite für Lebensmittel aus, die als Vitamin-B1-Quelle gelten.",
  }, "efsaSulfite"),
  entry("E250", { en: "Sodium nitrite", de: "Natriumnitrit" }, { en: "Preservative in cured meat", de: "Konservierungsstoff in Pökelfleisch" }, {
    en: "Nitrite preserves cured meat and can form nitrosamines, which are genotoxic. Not seen in the categories counted here.",
    de: "Nitrit konserviert Pökelfleisch und kann Nitrosamine bilden, die genotoxisch sind. In den hier gezählten Kategorien nicht gesehen.",
  }, "efsaNitrite"),
  entry("E300", { en: "Ascorbic acid", de: "Ascorbinsäure" }, { en: "Antioxidant", de: "Antioxidationsmittel" }, {
    en: "This is vitamin C. The isolated acid is the same molecule as the vitamin in food.",
    de: "Das ist Vitamin C. Die isolierte Säure ist dasselbe Molekül wie das Vitamin im Lebensmittel.",
  }, null),
  entry("E304", { en: "Ascorbyl palmitate", de: "Ascorbylpalmitat" }, { en: "Antioxidant", de: "Antioxidationsmittel" }, {
    en: "A fat-soluble ester of vitamin C, used to protect oils. It is not a persistent contaminant.",
    de: "Ein fettlöslicher Ester von Vitamin C, zum Schutz von Ölen. Es ist kein persistenter Kontaminant.",
  }, null),
  entry("E320", { en: "BHA, butylated hydroxyanisole", de: "BHA, Butylhydroxyanisol" }, { en: "Antioxidant", de: "Antioxidationsmittel" }, {
    en: "IARC classes BHA as Group 2B, possibly carcinogenic, on animal evidence. Not seen in the categories counted here.",
    de: "Die IARC stuft BHA als Gruppe 2B ein, möglicherweise krebserregend, auf Grundlage von Tierversuchen. In den hier gezählten Kategorien nicht gesehen.",
  }, "iarcBha"),
  entry("E330", { en: "Citric acid", de: "Citronensäure" }, { en: "Acidity regulator", de: "Säureregulator" }, {
    en: "A normal human metabolite. The E-number does not make the molecule a poison.",
    de: "Ein normaler menschlicher Metabolit. Die E-Nummer macht das Molekül nicht zum Gift.",
  }, null),
  entry("E385", { en: "Calcium disodium EDTA", de: "Calciumdinatrium-EDTA" }, { en: "Sequestrant", de: "Komplexbildner" }, {
    en: "Binds metal ions so they do not catalyse oxidation. At high doses it can also bind minerals the meal was meant to provide.",
    de: "Bindet Metallionen, damit sie keine Oxidation katalysieren. In hohen Dosen kann es auch Mineralstoffe binden, die die Mahlzeit liefern sollte.",
  }, null),
  entry("E392", { en: "Rosemary extract", de: "Rosmarinextrakt" }, { en: "Antioxidant", de: "Antioxidationsmittel" }, null, null),
  entry("E450", { en: "Diphosphates", de: "Diphosphate" }, { en: "Stabiliser", de: "Stabilisator" }, {
    en: "Phosphate additives add to the day's phosphate load. That matters most when the kidneys cannot excrete phosphate. They are not stored like a fat-soluble poison.",
    de: "Phosphatzusätze erhöhen die Phosphatlast des Tages. Das zählt vor allem, wenn die Nieren Phosphat nicht ausscheiden können. Sie werden nicht wie ein fettlösliches Gift gespeichert.",
  }, null),
  entry("E471", { en: "Mono- and diglycerides of fatty acids", de: "Mono- und Diglyceride von Speisefettsäuren" }, { en: "Emulsifier", de: "Emulgator" }, {
    en: "Digested to fatty acids and glycerol, the same end products as ordinary fat. Their presence is a marker of a formulation, which is why they count toward the treat label. They are not a persistent store.",
    de: "Werden zu Fettsäuren und Glycerin verdaut, denselben Endprodukten wie gewöhnliches Fett. Ihre Anwesenheit markiert eine Rezeptur, deshalb zählen sie zum Leckerli. Sie sind kein persistenter Speicher.",
  }, null),
  entry("E509", { en: "Calcium chloride", de: "Calciumchlorid" }, { en: "Firming agent", de: "Festigungsmittel" }, {
    en: "Dissociates into calcium and chloride. It is a salt used to keep canned vegetables firm, not a fluorinated substance.",
    de: "Dissoziiert in Calcium und Chlorid. Es ist ein Salz, das Dosengemüse fest hält, kein fluorierter Stoff.",
  }, null),
  entry("E621", { en: "Monosodium glutamate", de: "Mononatriumglutamat" }, { en: "Flavour enhancer", de: "Geschmacksverstärker" }, {
    en: "Glutamate is an amino acid already present in food protein. The added salt is the same molecule. Some people report a sensitivity. It is not stored as a contaminant.",
    de: "Glutamat ist eine Aminosäure, die in Lebensmittelprotein schon vorkommt. Das zugesetzte Salz ist dasselbe Molekül. Manche Menschen berichten eine Empfindlichkeit. Es wird nicht als Kontaminant gespeichert.",
  }, null),
  entry("E951", { en: "Aspartame", de: "Aspartam" }, { en: "Sweetener", de: "Süßungsmittel" }, {
    en: "IARC classes aspartame as Group 2B, possibly carcinogenic. JECFA kept the acceptable daily intake at 0–40 mg/kg body weight. Not seen in the categories counted here.",
    de: "Die IARC stuft Aspartam als Gruppe 2B ein, möglicherweise krebserregend. Der JECFA behielt die duldbare tägliche Aufnahme bei 0–40 mg/kg Körpergewicht. In den hier gezählten Kategorien nicht gesehen.",
  }, "iarcAspartame"),
];

const BY_CODE = new Map(ADDITIVE_ENTRIES.map((item) => [item.code, item]));

export function additiveEntry(code: string): AdditiveEntry | undefined {
  return BY_CODE.get(code);
}

/** E-numbers named in the Open Food Facts categories stored for this food. */
export function additivesForFood(food: FoodRecord): AdditiveEntry[] {
  const category = food.processing.evidence;
  if (!category) return [];
  return PROCESSING_EVIDENCE.categories[category].all.additives.flatMap((item) => {
    const known = additiveEntry(item.code);
    return known ? [known] : [];
  });
}

export function trackedAdditiveCodes(): string[] {
  return [...TRACKED].sort();
}
