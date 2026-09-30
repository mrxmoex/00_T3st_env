/**
 * Digestion as a mechanical process: what ferments, what raises glucose,
 * and which companions the meal needs before a nutrient is absorbed.
 * Shown, not scored. Every claim cites a source.
 */

import type { LocalizedText } from "../i18n/locale";
import { isAnimalClass, type FoodRecord } from "../scoring/types";
import { COOLED_POTATO_GI, GLYCEMIC_SOURCES, glycemicAssessment } from "./glycemic";

export const DIGESTION_SOURCES = {
  ...GLYCEMIC_SOURCES,
  olsson1970: {
    citation:
      "Olsson KE, Saltin B (1970). Variation in total body water with muscle glycogen changes in man. Acta Physiol Scand 80(1):11–18.",
    doi: "10.1111/j.1748-1716.1970.tb04764.x",
  },
  parada2007: {
    citation:
      "Parada J, Aguilera JM (2007). Food microstructure affects the bioavailability of several nutrients. J Food Sci 72(2):R21–R32.",
    doi: "10.1111/j.1750-3841.2007.00274.x",
  },
  jenkins1981: {
    citation:
      "Jenkins DJ, Wolever TM, Taylor RH, et al. (1981). Glycemic index of foods: a physiological basis for carbohydrate exchange. Am J Clin Nutr 34(3):362–366.",
    doi: "10.1093/ajcn/34.3.362",
  },
  iomFolate: {
    citation:
      "Institute of Medicine (1998). Dietary Reference Intakes for thiamin, riboflavin, niacin, vitamin B6, folate, vitamin B12, pantothenic acid, biotin, and choline. Folate: 1 µg folic acid from a supplement counts as 1.7 µg dietary folate equivalents.",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK114318/",
  },
  monash: {
    citation:
      "Monash University. FODMAPs and IBS. High and low FODMAP foods. Laboratory values are in the Monash app and are not copied here.",
    url: "https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/",
  },
  enattah2002: {
    citation:
      "Enattah NS, Sahi T, Savilahti E, et al. (2002). Identification of a variant associated with adult-type hypolactasia. Nat Genet 30(2):233–237.",
    doi: "10.1038/ng826",
  },
  perry2007: {
    citation:
      "Perry GH, Dominy NJ, Claw KG, et al. (2007). Diet and the evolution of human amylase gene copy number variation. Nat Genet 39(10):1256–1260.",
    doi: "10.1038/ng2123",
  },
  celis2017: {
    citation:
      "Celis-Morales C, Livingstone KM, Marsaux CF, et al. (2017). Effect of personalized nutrition on health-related behaviour change: evidence from the Food4Me European randomized controlled trial. Int J Epidemiol 46(2):578–588.",
    doi: "10.1093/ije/dyw186",
  },
} as const;

export type DigestionSourceId = keyof typeof DIGESTION_SOURCES;

export type FermentableKind = "lactose" | "gos" | "mannitol" | "fructan";

export type FermentableAssessment =
  | { status: "measured"; kind: "lactose"; gPer100g: number }
  | { status: "class"; kind: FermentableKind; level: "high" | "low"; compound: LocalizedText; source: DigestionSourceId }
  | { status: "notExpected"; reason: LocalizedText }
  | { status: "noData" };

const GOS_HIGH: LocalizedText = {
  en: "Galacto-oligosaccharides. Boiled legumes are a high-GOS class. The gram amount per 100 g eaten is not copied from a proprietary assay.",
  de: "Galacto-Oligosaccharide. Gekochte Hülsenfrüchte sind eine GOS-reiche Klasse. Die Grammzahl pro 100 g verzehrt wird nicht aus einem kostenpflichtigen Test übernommen.",
};

const GOS_LOW_TOFU: LocalizedText = {
  en: "Firm tofu is low in GOS; the oligosaccharides go out with the whey. Silken tofu is not the same food.",
  de: "Fester Tofu ist GOS-arm; die Oligosaccharide gehen mit der Molke verloren. Seidentofu ist nicht dasselbe Lebensmittel.",
};

const MANNITOL: LocalizedText = {
  en: "Mannitol, a sugar alcohol. Mushrooms are a rich class. No gram value is stored, because the open tables do not give one for this mushroom.",
  de: "Mannit, ein Zuckeralkohol. Pilze sind eine reiche Klasse. Es ist kein Grammwert gespeichert, weil die offenen Tabellen für diesen Pilz keinen nennen.",
};

const NOT_CARB: LocalizedText = {
  en: "Negligible fermentable carbohydrate. Gas from this food is not a FODMAP effect.",
  de: "Kaum fermentierbares Kohlenhydrat. Blähungen von diesem Lebensmittel sind kein FODMAP-Effekt.",
};

export function fermentable(food: FoodRecord): FermentableAssessment {
  const lactose = food.composition.lactoseG;
  if (lactose !== null && lactose >= 1) return { status: "measured", kind: "lactose", gPer100g: lactose };
  if ((food.class === "dairy" || food.class === "fermented_animal") && lactose !== null && lactose < 0.5) {
    return {
      status: "class",
      kind: "lactose",
      level: "low",
      compound: {
        en: `Lactose ${lactose} g per 100 g in the nutrient database. Hard cheese and fermented dairy lose most of it.`,
        de: `Laktose ${lactose} g pro 100 g in der Nährwertdatenbank. Hartkäse und fermentierte Milchprodukte verlieren das meiste davon.`,
      },
      source: "monash",
    };
  }
  if (food.class === "legumes" && food.id !== "tofu") {
    return { status: "class", kind: "gos", level: "high", compound: GOS_HIGH, source: "monash" };
  }
  if (food.id === "tofu") {
    return { status: "class", kind: "gos", level: "low", compound: GOS_LOW_TOFU, source: "monash" };
  }
  if (food.class === "mushrooms") {
    return { status: "class", kind: "mannitol", level: "high", compound: MANNITOL, source: "monash" };
  }
  if (isAnimalClass(food.class)) return { status: "notExpected", reason: NOT_CARB };
  if (food.class === "cruciferous_fresh" || food.class === "cruciferous_fermented") {
    return { status: "noData" };
  }
  return { status: "noData" };
}

/** Mechanisms that can make a person feel heavy or spongy. Only the ones this food can trigger. */
export function spongyNotes(food: FoodRecord): LocalizedText[] {
  const notes: LocalizedText[] = [];
  const glycemic = glycemicAssessment(food);
  if (glycemic.status === "value" && glycemic.band === "high") {
    notes.push({
      en: `GI ${glycemic.gi} is high. Gelatinized starch raises glucose quickly, and the glycogen stored afterwards binds water: about 3 g of water per gram of glycogen. That water weight is the spongy feeling after a large starch meal, and it leaves when the glycogen is used. Cooling a cooked potato drops the GI to ${COOLED_POTATO_GI} in the same tables.`,
      de: `GI ${glycemic.gi} ist hoch. Verkleisterte Stärke hebt die Glukose schnell, und das danach gespeicherte Glykogen bindet Wasser: etwa 3 g Wasser je Gramm Glykogen. Dieses Wassergewicht ist das schwammige Gefühl nach einer großen Stärkemahlzeit, und es geht, wenn das Glykogen verbraucht wird. Abkühlen einer gekochten Kartoffel senkt den GI in denselben Tabellen auf ${COOLED_POTATO_GI}.`,
    });
  }
  const gas = fermentable(food);
  if ((gas.status === "measured" && gas.gPer100g >= 2) || (gas.status === "class" && gas.level === "high")) {
    notes.push({
      en: "Fermentable carbohydrate that the small intestine does not absorb reaches the colon. Bacteria make gas. Whether that bloats a person depends on their enzymes and their microbes, not on the food alone.",
      de: "Fermentierbares Kohlenhydrat, das der Dünndarm nicht aufnimmt, erreicht den Dickdarm. Bakterien bilden Gas. Ob das eine Person aufbläht, hängt von ihren Enzymen und ihren Mikroben ab, nicht vom Lebensmittel allein.",
    });
  }
  if (food.composition.sodiumMg >= 200) {
    notes.push({
      en: `Sodium is ${Math.round(food.composition.sodiumMg)} mg per 100 g. A salty portion holds water outside the cells until the kidneys excrete the sodium. That is a different spongy feeling from glycogen or from gas.`,
      de: `Natrium liegt bei ${Math.round(food.composition.sodiumMg)} mg pro 100 g. Eine salzige Portion hält Wasser außerhalb der Zellen, bis die Nieren das Natrium ausscheiden. Das ist ein anderes schwammiges Gefühl als Glykogen oder Gas.`,
    });
  }
  return notes;
}

export function matrixNotes(food: FoodRecord): LocalizedText[] {
  const notes: LocalizedText[] = [
    {
      en: "The GI is measured on the food eaten alone. Fat, protein, and acid in the same meal slow gastric emptying, so the plate is not the number.",
      de: "Der GI wird am allein gegessenen Lebensmittel gemessen. Fett, Protein und Säure in derselben Mahlzeit verlangsamen die Magenentleerung, deshalb ist der Teller nicht die Zahl.",
    },
  ];
  if (food.class === "roots_tubers" || food.class === "legumes") {
    notes.push({
      en: "Cooking bursts starch granules and raises the GI. An intact cell wall, as in a boiled bean, slows the same starch. Cooling retrogrades some of it into resistant starch.",
      de: "Garen sprengt Stärkekörner und hebt den GI. Eine intakte Zellwand, wie in einer gekochten Bohne, bremst dieselbe Stärke. Abkühlen lagert einen Teil zu resistenter Stärke um.",
    });
  }
  if (!isAnimalClass(food.class) && food.class !== "mushrooms") {
    notes.push({
      en: "Carotenoids sit inside plant cells. Chopping, cooking, and some fat in the meal let them out. The isolated pigment without that milieu is a different dose from the vegetable.",
      de: "Carotinoide sitzen in Pflanzenzellen. Schneiden, Garen und etwas Fett in der Mahlzeit lassen sie heraus. Das isolierte Pigment ohne dieses Milieu ist eine andere Dosis als das Gemüse.",
    });
  }
  return notes;
}

/** The limit of "natural is fully used, artificial is wasted." */
export const MILIEU_LIMIT: LocalizedText = {
  en: "The food matrix changes how much of a nutrient is absorbed. It does not make every natural molecule fully used, or every isolated one inert. Folic acid from a supplement is absorbed better than folate in food: 1 µg of folic acid counts as 1.7 µg of dietary folate. Ascorbic acid is the same molecule as vitamin C. An additive that is not a nutrient, such as an emulsifier or a sulfite, is not 'used' as food; sulfites destroy thiamin. What is excreted, stored, or wasted depends on the molecule and the meal, not on a natural-versus-artificial label.",
  de: "Die Lebensmittelmatrix ändert, wie viel von einem Nährstoff aufgenommen wird. Sie macht nicht jedes natürliche Molekül vollständig verwertet und nicht jedes isolierte träge. Folsäure aus einem Präparat wird besser aufgenommen als Folat im Lebensmittel: 1 µg Folsäure zählt als 1,7 µg Folat-Äquivalent. Ascorbinsäure ist dasselbe Molekül wie Vitamin C. Ein Zusatzstoff, der kein Nährstoff ist, etwa ein Emulgator oder ein Sulfit, wird nicht als Lebensmittel verwertet; Sulfite zerstören Thiamin. Was ausgeschieden, gespeichert oder vergeudet wird, hängt vom Molekül und von der Mahlzeit ab, nicht von einem Etikett natürlich gegen künstlich.",
};

export const METABOLISM_NOTES: readonly LocalizedText[] = [
  {
    en: "Lactase. The LCT variant decides whether adult small intestine splits lactose. The same glass of milk is glucose and galactose for one person and a fermentable load for another.",
    de: "Laktase. Die LCT-Variante entscheidet, ob der erwachsene Dünndarm Laktose spaltet. Dasselbe Glas Milch ist für die eine Person Glukose und Galaktose und für die andere eine fermentierbare Last.",
  },
  {
    en: "Salivary amylase. AMY1 copy number changes how much amylase the saliva makes, and with it how fast a starch dose raises glucose. The same potato is not the same curve.",
    de: "Speichelamylase. Die Kopienzahl von AMY1 ändert, wie viel Amylase der Speichel bildet, und damit, wie schnell eine Stärkedosis die Glukose hebt. Dieselbe Kartoffel ist nicht dieselbe Kurve.",
  },
  {
    en: "Companies that read DNA and sell a metabolism type overreach what these variants can say. In the Food4Me trial, advice fitted to the person beat generic advice, and adding the genotype did not clearly beat advice based on diet and phenotype.",
    de: "Firmen, die DNA lesen und einen Stoffwechseltyp verkaufen, behaupten mehr, als diese Varianten hergeben. In der Food4Me-Studie schlug ein auf die Person zugeschnittener Rat den allgemeinen Rat, und der Genotyp schlug den Rat aus Ernährung und Phänotyp nicht klar.",
  },
];
