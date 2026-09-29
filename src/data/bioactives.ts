/**
 * Bioactive compounds that the food composition databases do not report, indexed
 * by concentration from published analyses. Shown as content; not part of the score.
 * Missing data stays missing: "no data" is never read as 0.
 */

import type { LocalizedText } from "../i18n/locale";
import { isAnimalClass, type FoodRecord } from "../scoring/types";

export const BIOACTIVE_COMPOUNDS = [
  "creatine",
  "taurine",
  "carnosine",
  "anserine",
  "coq10",
  "carnitine",
  "ergothioneine",
  "glucosinolates",
] as const;
export type BioactiveCompound = (typeof BIOACTIVE_COMPOUNDS)[number];

export interface LiteratureSource {
  citation: string;
  doi?: string;
  url?: string;
}

const SOURCES = {
  balsom1994: {
    citation:
      "Balsom PD, Söderlund K, Ekblom B (1994). Creatine in humans with special reference to creatine supplementation. Sports Med 18(4):268–280",
    doi: "10.2165/00007256-199418040-00005",
  },
  elbir2021: {
    citation:
      "Elbir Z, Oz F (2021). Determination of creatine, creatinine, free amino acid and heterocyclic aromatic amine contents of plain beef and chicken juices. J Food Sci Technol 58(9):3293–3302",
    doi: "10.1007/s13197-020-04875-8",
  },
  kulczynski2019: {
    citation:
      "Kulczyński B, Sidor A, Gramza-Michałowska A (2019). Characteristics of selected antioxidative and bioactive compounds in meat and animal origin products. Antioxidants 8(9):335 (compiled tables)",
    doi: "10.3390/antiox8090335",
  },
  laidlaw1990: {
    citation:
      "Laidlaw SA, Grosvenor M, Kopple JD (1990). The taurine content of common foodstuffs. JPEN J Parenter Enteral Nutr 14(2):183–188",
    doi: "10.1177/0148607190014002183",
  },
  szerdahelyi2020: {
    citation:
      "Szerdahelyi E, Csehi B, Takács K, et al. (2020). Monitoring of imidazole dipeptides in meat products by capillary zone electrophoresis. Czech J Food Sci",
    doi: "10.17221/192/2019-CJFS",
  },
  mori2015: {
    citation:
      "Mori M, Mizuno D, Konoha-Mizuno K, Sadakane Y, Kawahara M (2015). Quantitative analysis of carnosine and anserine in foods by performing high performance liquid chromatography. Biomed Res Trace Elem 26(3):147",
    url: "https://www.jstage.jst.go.jp/article/brte/26/3/26_147/_article/-char/en",
  },
  pravst2010: {
    citation:
      "Pravst I, Žmitek K, Žmitek J (2010). Coenzyme Q10 contents in foods and fortification strategies. Crit Rev Food Sci Nutr 50(4):269–280",
    doi: "10.1080/10408390902773037",
  },
  demarquoy2004: {
    citation:
      "Demarquoy J, Georges B, Rigault C, et al. (2004). Radioisotopic determination of L-carnitine content in foods commonly eaten in Western countries. Food Chem 86(1):137–142 (free L-carnitine)",
    doi: "10.1016/j.foodchem.2003.09.023",
  },
  kalaras2017: {
    citation:
      "Kalaras MD, Richie JP, Calcagnotto A, Beelman RB (2017). Mushrooms: a rich source of the antioxidants ergothioneine and glutathione. Food Chem 233:429–433",
    doi: "10.1016/j.foodchem.2017.04.109",
  },
  mcnaughton2003: {
    citation:
      "McNaughton SA, Marks GC (2003). Development of a food composition database for the estimation of dietary intakes of glucosinolates. Br J Nutr 90(3):687–697 (median across studies)",
    doi: "10.1079/BJN2003917",
  },
} as const satisfies Record<string, LiteratureSource>;
export type BioactiveSourceId = keyof typeof SOURCES;
export const BIOACTIVE_SOURCES: Readonly<Record<BioactiveSourceId, LiteratureSource>> = SOURCES;

/** "Pravst 2010" from "Pravst I, Žmitek K, Žmitek J (2010). …". */
export function shortCitation(source: LiteratureSource): string {
  const author = source.citation.split(/[ ,]/)[0] ?? source.citation;
  const year = /\((\d{4})\)/.exec(source.citation)?.[1];
  return year ? `${author} ${year}` : author;
}

export function sourceLink(source: LiteratureSource): string | undefined {
  return source.doi ? `https://doi.org/${source.doi}` : source.url;
}

/** State of the tissue the source analysed. */
export type MeasuredState = "raw" | "cooked" | "unspecified";

interface Measured {
  kind: "measured";
  mgPer100g: number;
  /** Spread across the source's samples or studies. */
  range?: readonly [number, number];
  measured: LocalizedText;
  state: MeasuredState;
  source: BioactiveSourceId;
}

/** Dry-weight concentration of a heat-stable compound, scaled by each food's own dry matter. */
interface DryWeight {
  kind: "dryWeight";
  mgPerGDry: number;
  measured: LocalizedText;
  source: BioactiveSourceId;
}

interface NotDetected {
  kind: "notDetected";
  measured: LocalizedText;
  source: BioactiveSourceId;
}

interface NotExpected {
  kind: "notExpected";
  reason: LocalizedText;
}

type BioactiveEntry = Measured | DryWeight | NotDetected | NotExpected;
type EntryTable = Readonly<Record<string, Partial<Record<BioactiveCompound, BioactiveEntry>>>>;

export type BioactiveValue =
  | {
      status: "value";
      mgPer100g: number;
      range?: readonly [number, number];
      measured: LocalizedText;
      state: MeasuredState;
      source: BioactiveSourceId;
      /** Scaled from a dry-weight concentration with this food's water content. */
      fromDryWeight: boolean;
      /** A raw-tissue value shown for a cooked or processed food. */
      rawValueForPreparedFood: boolean;
    }
  | { status: "notDetected"; measured: LocalizedText; source: BioactiveSourceId }
  | { status: "notExpected"; reason: LocalizedText }
  | { status: "noData" };

function measured(
  mgPer100g: number,
  source: BioactiveSourceId,
  what: LocalizedText,
  state: MeasuredState,
  range?: readonly [number, number],
): Measured {
  return { kind: "measured", mgPer100g, source, measured: what, state, range };
}

function notDetected(source: BioactiveSourceId, what: LocalizedText): NotDetected {
  return { kind: "notDetected", source, measured: what };
}

function dryWeight(mgPerGDry: number, source: BioactiveSourceId, what: LocalizedText): DryWeight {
  return { kind: "dryWeight", mgPerGDry, source, measured: what };
}

const MUSCLE_COMPOUND: NotExpected = {
  kind: "notExpected",
  reason: {
    en: "Formed in vertebrate muscle; plant and fungal foods contain none or traces",
    de: "Wird im Muskel von Wirbeltieren gebildet; Pflanzen und Pilze enthalten keines oder nur Spuren",
  },
};

const GLUCOSINOLATE_FREE: NotExpected = {
  kind: "notExpected",
  reason: {
    en: "Occurs almost only in cabbage-family plants (Brassicales)",
    de: "Kommt fast nur in Kohlgewächsen und Verwandten (Brassicales) vor",
  },
};

const TAURINE_PLANTS = notDetected("laidlaw1990", {
  en: "48 plant foods: vegetables, legumes, nuts, seeds, fruit",
  de: "48 pflanzliche Lebensmittel: Gemüse, Hülsenfrüchte, Nüsse, Samen, Obst",
});

/** Groups outside the cruciferous classes that still belong to the cabbage family. */
const BRASSICALES_GROUPS: ReadonlySet<string> = new Set(["kale", "rocket"]);

/** Values measured on the food itself or its raw tissue, keyed by preparation group. */
const BY_GROUP: EntryTable = {
  beef_mince: {
    creatine: measured(401, "kulczynski2019", { en: "beef muscle (semitendinosus)", de: "Rindermuskel (Semitendinosus)" }, "unspecified"),
    carnosine: measured(321, "szerdahelyi2020", { en: "beef sirloin, raw", de: "Rinderlende, roh" }, "raw"),
    anserine: measured(29, "szerdahelyi2020", { en: "beef sirloin, raw", de: "Rinderlende, roh" }, "raw"),
    coq10: measured(3.1, "pravst2010", { en: "beef sirloin", de: "Rinderlende" }, "unspecified"),
    carnitine: measured(65, "demarquoy2004", { en: "beefsteak", de: "Rindersteak" }, "unspecified"),
  },
  lamb_flank: {
    creatine: measured(395, "kulczynski2019", { en: "lamb muscle", de: "Lammmuskel" }, "unspecified", [278, 511]),
    taurine: measured(44, "kulczynski2019", { en: "lamb (dark meat), raw", de: "Lamm (dunkles Fleisch), roh" }, "raw"),
    carnosine: measured(122, "mori2015", { en: "lamb leg", de: "Lammkeule" }, "unspecified"),
    anserine: measured(102, "mori2015", { en: "lamb leg", de: "Lammkeule" }, "unspecified"),
    carnitine: measured(40.5, "demarquoy2004", { en: "lamb chop", de: "Lammkotelett" }, "unspecified"),
  },
  pork_tenderloin: {
    creatine: measured(311, "kulczynski2019", { en: "pork ham muscle", de: "Schweineschinken (Muskel)" }, "unspecified", [247, 374]),
    carnosine: measured(496, "szerdahelyi2020", { en: "pork loin, raw", de: "Schweinelachs, roh" }, "raw"),
    anserine: measured(25, "szerdahelyi2020", { en: "pork loin, raw", de: "Schweinelachs, roh" }, "raw"),
    coq10: measured(1.4, "pravst2010", { en: "pork sirloin", de: "Schweinelende" }, "unspecified"),
  },
  chicken_breast: {
    creatine: measured(404, "elbir2021", { en: "boneless chicken meat, raw", de: "Hähnchenfleisch ohne Knochen, roh" }, "raw"),
    carnosine: measured(118, "szerdahelyi2020", { en: "chicken breast, raw", de: "Hähnchenbrust, roh" }, "raw"),
    anserine: measured(462, "szerdahelyi2020", { en: "chicken breast, raw", de: "Hähnchenbrust, roh" }, "raw"),
    coq10: measured(1.2, "pravst2010", { en: "chicken breast", de: "Hähnchenbrust" }, "unspecified", [0.8, 1.7]),
    carnitine: measured(10.4, "demarquoy2004", { en: "chicken meat", de: "Hähnchenfleisch" }, "unspecified"),
  },
  turkey_breast: {
    carnosine: measured(144, "szerdahelyi2020", { en: "turkey breast, raw", de: "Putenbrust, roh" }, "raw"),
    anserine: measured(538, "szerdahelyi2020", { en: "turkey breast, raw", de: "Putenbrust, roh" }, "raw"),
  },
  salmon: {
    creatine: measured(450, "balsom1994", { en: "salmon, raw", de: "Lachs, roh" }, "raw"),
    taurine: measured(130, "kulczynski2019", { en: "Atlantic salmon", de: "Atlantischer Lachs" }, "unspecified"),
    carnosine: measured(0.53, "kulczynski2019", { en: "salmon", de: "Lachs" }, "unspecified"),
    coq10: measured(0.6, "pravst2010", { en: "salmon", de: "Lachs" }, "unspecified", [0.4, 0.8]),
    carnitine: measured(5.8, "demarquoy2004", { en: "salmon", de: "Lachs" }, "unspecified"),
  },
  herring: {
    creatine: measured(825, "balsom1994", { en: "herring, raw", de: "Hering, roh" }, "raw", [650, 1000]),
    coq10: measured(2.1, "pravst2010", { en: "herring flesh", de: "Heringsfleisch" }, "unspecified", [1.5, 2.7]),
  },
  mackerel: {
    coq10: measured(4.3, "pravst2010", { en: "mackerel", de: "Makrele" }, "unspecified"),
  },
  sardine: {
    carnosine: measured(0.1, "kulczynski2019", { en: "sardine", de: "Sardine" }, "unspecified"),
    coq10: measured(3.5, "pravst2010", { en: "sardine", de: "Sardine" }, "unspecified", [0.5, 6.4]),
  },
  cod: {
    creatine: measured(300, "balsom1994", { en: "cod, raw", de: "Kabeljau, roh" }, "raw"),
    taurine: measured(31, "kulczynski2019", { en: "cod, frozen", de: "Kabeljau, tiefgefroren" }, "unspecified"),
    coq10: measured(0.4, "pravst2010", { en: "cod", de: "Kabeljau" }, "unspecified"),
  },
  beef_liver: {
    creatine: measured(16, "kulczynski2019", { en: "beef liver", de: "Rinderleber" }, "unspecified"),
    taurine: measured(69, "kulczynski2019", { en: "beef liver", de: "Rinderleber" }, "unspecified"),
    coq10: measured(4.5, "pravst2010", { en: "beef liver", de: "Rinderleber" }, "unspecified", [3.9, 5.1]),
  },
  chicken_liver: {
    taurine: measured(110, "kulczynski2019", { en: "poultry liver", de: "Geflügelleber" }, "unspecified"),
    carnosine: notDetected("mori2015", { en: "chicken liver", de: "Hühnerleber" }),
    anserine: notDetected("mori2015", { en: "chicken liver", de: "Hühnerleber" }),
    coq10: measured(12.4, "pravst2010", { en: "chicken liver", de: "Hühnerleber" }, "unspecified", [11.6, 13.2]),
  },
  pork_liver: {
    taurine: measured(89, "kulczynski2019", { en: "pork liver", de: "Schweineleber" }, "unspecified"),
    carnosine: notDetected("mori2015", { en: "pork liver", de: "Schweineleber" }),
    anserine: notDetected("mori2015", { en: "pork liver", de: "Schweineleber" }),
    coq10: measured(3.8, "pravst2010", { en: "pork liver", de: "Schweineleber" }, "unspecified", [2.3, 5.4]),
  },
  beef_heart: {
    creatine: measured(298, "kulczynski2019", { en: "beef heart", de: "Rinderherz" }, "unspecified"),
    coq10: measured(11.3, "pravst2010", { en: "beef heart", de: "Rinderherz" }, "unspecified"),
  },
  chicken_heart: {
    carnosine: notDetected("mori2015", { en: "chicken heart", de: "Hühnerherz" }),
    anserine: notDetected("mori2015", { en: "chicken heart", de: "Hühnerherz" }),
    coq10: measured(14.2, "pravst2010", { en: "chicken heart", de: "Hühnerherz" }, "unspecified", [9.2, 19.2]),
  },
  egg: {
    coq10: measured(0.2, "pravst2010", { en: "chicken egg", de: "Hühnerei" }, "unspecified", [0.07, 0.37]),
  },
  milk: {
    taurine: measured(2.4, "laidlaw1990", { en: "cow's milk, whole", de: "Kuhmilch, Vollmilch" }, "unspecified"),
    coq10: measured(0.16, "pravst2010", { en: "cow's milk, 3.5–3.6 % fat", de: "Kuhmilch, 3,5–3,6 % Fett" }, "unspecified", [0.13, 0.19]),
    carnitine: measured(2.3, "demarquoy2004", { en: "milk, 4 % fat", de: "Milch, 4 % Fett" }, "unspecified"),
  },
  yogurt: {
    taurine: measured(3.3, "laidlaw1990", { en: "low-fat plain yogurt", de: "fettarmer Naturjoghurt" }, "unspecified"),
  },
  kefir: {
    coq10: measured(0.09, "pravst2010", { en: "kefir, 3.5 % fat", de: "Kefir, 3,5 % Fett" }, "unspecified"),
  },
  cheddar: {
    coq10: measured(0.18, "pravst2010", { en: "cheese, unspecified", de: "Käse, nicht näher bezeichnet" }, "unspecified", [0.14, 0.21]),
  },
  gouda: {
    coq10: measured(0.18, "pravst2010", { en: "cheese, unspecified", de: "Käse, nicht näher bezeichnet" }, "unspecified", [0.14, 0.21]),
  },
  parmesan: {
    coq10: measured(0.18, "pravst2010", { en: "cheese, unspecified", de: "Käse, nicht näher bezeichnet" }, "unspecified", [0.14, 0.21]),
  },
  emmentaler: {
    coq10: measured(0.13, "pravst2010", { en: "Emmental", de: "Emmentaler" }, "unspecified"),
  },
  soybeans: {
    coq10: measured(1.2, "pravst2010", { en: "soybeans, boiled", de: "Sojabohnen, gekocht" }, "cooked"),
  },
  tofu: {
    coq10: measured(0.29, "pravst2010", { en: "tofu", de: "Tofu" }, "unspecified"),
  },
  black_beans: {
    coq10: measured(0.18, "pravst2010", { en: "beans, unspecified", de: "Bohnen, nicht näher bezeichnet" }, "unspecified"),
  },
  kidney_beans: {
    coq10: measured(0.18, "pravst2010", { en: "beans, unspecified", de: "Bohnen, nicht näher bezeichnet" }, "unspecified"),
  },
  lentils: {
    carnitine: measured(2.1, "demarquoy2004", { en: "lentils", de: "Linsen" }, "unspecified"),
  },
  red_lentils: {
    carnitine: measured(2.1, "demarquoy2004", { en: "lentils", de: "Linsen" }, "unspecified"),
  },
  spinach: {
    coq10: measured(0.49, "pravst2010", { en: "spinach", de: "Spinat" }, "unspecified", [0.04, 1.02]),
  },
  romaine: {
    coq10: notDetected("pravst2010", { en: "lettuce", de: "Blattsalat" }),
  },
  broccoli: {
    coq10: measured(0.7, "pravst2010", { en: "broccoli", de: "Brokkoli" }, "unspecified", [0.59, 0.86]),
    glucosinolates: measured(61.7, "mcnaughton2003", { en: "broccoli, raw (6 studies)", de: "Brokkoli, roh (6 Studien)" }, "raw", [19.3, 127.5]),
  },
  white_cabbage: {
    coq10: measured(0.16, "pravst2010", { en: "cabbage", de: "Kohl" }, "unspecified", [0.1, 0.31]),
    glucosinolates: measured(37.7, "mcnaughton2003", { en: "white cabbage, raw (5 studies)", de: "Weißkohl, roh (5 Studien)" }, "raw", [8.4, 90]),
  },
  cauliflower: {
    coq10: measured(0.38, "pravst2010", { en: "cauliflower", de: "Blumenkohl" }, "unspecified", [0.14, 0.66]),
    glucosinolates: measured(43.2, "mcnaughton2003", { en: "cauliflower, raw (5 studies)", de: "Blumenkohl, roh (5 Studien)" }, "raw", [11.7, 78.6]),
  },
  brussels_sprouts: {
    coq10: measured(0.09, "pravst2010", { en: "Brussels sprouts", de: "Rosenkohl" }, "unspecified"),
    glucosinolates: measured(236.6, "mcnaughton2003", { en: "Brussels sprouts, raw (8 studies)", de: "Rosenkohl, roh (8 Studien)" }, "raw", [80.1, 445.5]),
  },
  chinese_cabbage: {
    coq10: measured(0.27, "pravst2010", { en: "Chinese cabbage", de: "Chinakohl" }, "unspecified", [0.21, 0.45]),
    glucosinolates: measured(20.6, "mcnaughton2003", { en: "Chinese cabbage (pe-tsai), raw", de: "Chinakohl (Pe-tsai), roh" }, "raw", [8.9, 54.1]),
  },
  kale: {
    glucosinolates: measured(89.4, "mcnaughton2003", { en: "curly kale, raw (1 study)", de: "Grünkohl, roh (1 Studie)" }, "raw"),
  },
  potato: {
    coq10: measured(0.1, "pravst2010", { en: "potato", de: "Kartoffel" }, "unspecified", [0.05, 0.11]),
    carnitine: measured(2.4, "demarquoy2004", { en: "potato, raw", de: "Kartoffel, roh" }, "raw"),
  },
  sweet_potato: {
    coq10: measured(0.33, "pravst2010", { en: "sweet potato", de: "Süßkartoffel" }, "unspecified", [0.3, 0.36]),
  },
  carrot: {
    coq10: measured(0.17, "pravst2010", { en: "carrot", de: "Karotte" }, "unspecified", [0.02, 0.22]),
    carnitine: measured(0.3, "demarquoy2004", { en: "carrot", de: "Karotte" }, "unspecified"),
  },
  red_pepper: {
    coq10: measured(0.33, "pravst2010", { en: "sweet pepper", de: "Paprika" }, "unspecified"),
  },
  tomato: {
    coq10: measured(0.02, "pravst2010", { en: "tomato", de: "Tomate" }, "unspecified", [0, 0.09]),
  },
  aubergine: {
    coq10: measured(0.21, "pravst2010", { en: "aubergine", de: "Aubergine" }, "unspecified", [0.1, 0.22]),
  },
  button_mushroom: {
    coq10: notDetected("pravst2010", { en: "button mushroom", de: "Champignon" }),
    ergothioneine: dryWeight(0.41, "kalaras2017", { en: "white button mushroom, 0.41 mg/g dry weight", de: "weißer Champignon, 0,41 mg/g Trockenmasse" }),
  },
  shiitake: {
    ergothioneine: dryWeight(0.92, "kalaras2017", { en: "shiitake, 0.92 mg/g dry weight", de: "Shiitake, 0,92 mg/g Trockenmasse" }),
  },
  oyster_mushroom: {
    ergothioneine: dryWeight(1.21, "kalaras2017", { en: "grey oyster mushroom, 1.21 mg/g dry weight", de: "Austernpilz, 1,21 mg/g Trockenmasse" }),
  },
  chanterelle: {
    ergothioneine: dryWeight(0.2, "kalaras2017", { en: "chanterelle, dried sample, 0.20 mg/g dry weight", de: "Pfifferling, getrocknete Probe, 0,20 mg/g Trockenmasse" }),
  },
};

/** Cooked-food measurements that replace the group's raw value for one preparation. */
const BY_FOOD: EntryTable = {
  beef_mince_raw: { taurine: measured(43, "laidlaw1990", { en: "beef, raw", de: "Rind, roh" }, "raw") },
  beef_mince_braised: { taurine: measured(38, "laidlaw1990", { en: "beef, broiled", de: "Rind, gegrillt" }, "cooked") },
  pork_tenderloin_raw: { taurine: measured(61, "laidlaw1990", { en: "pork loin, raw", de: "Schweinelachs, roh" }, "raw") },
  pork_tenderloin_roasted: { taurine: measured(57, "laidlaw1990", { en: "pork loin, roasted", de: "Schweinelachs, gebraten" }, "cooked") },
  chicken_breast_raw: { taurine: measured(18, "laidlaw1990", { en: "chicken light meat, raw", de: "Hähnchen, helles Fleisch, roh" }, "raw") },
  chicken_breast_fried: { taurine: measured(15, "laidlaw1990", { en: "chicken light meat, broiled", de: "Hähnchen, helles Fleisch, gegrillt" }, "cooked") },
  turkey_breast_raw: { taurine: measured(30, "laidlaw1990", { en: "turkey light meat, raw", de: "Pute, helles Fleisch, roh" }, "raw") },
  turkey_breast_fried: { taurine: measured(11, "laidlaw1990", { en: "turkey light meat, roasted", de: "Pute, helles Fleisch, gebraten" }, "cooked") },
  broccoli_boiled: { glucosinolates: measured(37.2, "mcnaughton2003", { en: "broccoli, cooked (1 study)", de: "Brokkoli, gegart (1 Studie)" }, "cooked") },
  broccoli_stewed: { glucosinolates: measured(37.2, "mcnaughton2003", { en: "broccoli, cooked (1 study)", de: "Brokkoli, gegart (1 Studie)" }, "cooked") },
  brussels_sprouts_boiled: {
    glucosinolates: measured(135.9, "mcnaughton2003", { en: "Brussels sprouts, boiled (2 studies)", de: "Rosenkohl, gekocht (2 Studien)" }, "cooked"),
  },
  kale_boiled: { glucosinolates: measured(69.1, "mcnaughton2003", { en: "curly kale, cooked (1 study)", de: "Grünkohl, gegart (1 Studie)" }, "cooked") },
  kale_steamed: { glucosinolates: measured(69.1, "mcnaughton2003", { en: "curly kale, cooked (1 study)", de: "Grünkohl, gegart (1 Studie)" }, "cooked") },
};

/** Group and food keys the tables use; the test suite checks them against the catalog. */
export const BIOACTIVE_TABLE_KEYS = { groups: Object.keys(BY_GROUP), foods: Object.keys(BY_FOOD) } as const;

function isBrassicales(food: FoodRecord): boolean {
  return food.class === "cruciferous_fresh" || food.class === "cruciferous_fermented" || BRASSICALES_GROUPS.has(food.group);
}

function defaultEntry(food: FoodRecord, compound: BioactiveCompound): BioactiveEntry | undefined {
  const animal = isAnimalClass(food.class);
  switch (compound) {
    case "creatine":
    case "carnosine":
    case "anserine":
      return animal ? undefined : MUSCLE_COMPOUND;
    case "taurine":
      return animal || food.class === "mushrooms" || food.class === "algae" ? undefined : TAURINE_PLANTS;
    case "glucosinolates":
      return animal || !isBrassicales(food) ? GLUCOSINOLATE_FREE : undefined;
    case "coq10":
    case "carnitine":
    case "ergothioneine":
      return undefined;
    default: {
      const _exhaustive: never = compound;
      return _exhaustive;
    }
  }
}

function resolve(food: FoodRecord, entry: BioactiveEntry | undefined): BioactiveValue {
  if (!entry) return { status: "noData" };
  switch (entry.kind) {
    case "measured":
      return {
        status: "value",
        mgPer100g: entry.mgPer100g,
        range: entry.range,
        measured: entry.measured,
        state: entry.state,
        source: entry.source,
        fromDryWeight: false,
        rawValueForPreparedFood: entry.state === "raw" && food.preparation !== "raw",
      };
    case "dryWeight":
      return {
        status: "value",
        mgPer100g: Math.round(entry.mgPerGDry * (100 - food.composition.waterG) * 10) / 10,
        measured: entry.measured,
        state: "raw",
        source: entry.source,
        fromDryWeight: true,
        rawValueForPreparedFood: false,
      };
    case "notDetected":
      return { status: "notDetected", measured: entry.measured, source: entry.source };
    case "notExpected":
      return { status: "notExpected", reason: entry.reason };
    default: {
      const _exhaustive: never = entry;
      return _exhaustive;
    }
  }
}

export function bioactiveValue(food: FoodRecord, compound: BioactiveCompound): BioactiveValue {
  const entry = BY_FOOD[food.id]?.[compound] ?? BY_GROUP[food.group]?.[compound] ?? defaultEntry(food, compound);
  return resolve(food, entry);
}

export function bioactiveProfile(food: FoodRecord): Record<BioactiveCompound, BioactiveValue> {
  return Object.fromEntries(
    BIOACTIVE_COMPOUNDS.map((compound) => [compound, bioactiveValue(food, compound)]),
  ) as Record<BioactiveCompound, BioactiveValue>;
}

/** mg per 100 g when a source reports a value, 0 when it found none, null otherwise. */
export function bioactiveMg(food: FoodRecord, compound: BioactiveCompound): number | null {
  const value = bioactiveValue(food, compound);
  switch (value.status) {
    case "value":
      return value.mgPer100g;
    case "notDetected":
    case "notExpected":
      return 0;
    case "noData":
      return null;
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}
