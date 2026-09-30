import { FOODS } from "../data/catalog";
import type { LocalizedText } from "../i18n/locale";
import { scoreCatalog } from "../scoring/scoreFood";
import type { DietaryPattern, FoodRecord, ScoreCard } from "../scoring/types";
import { kingdomOf } from "../scoring/types";

export interface Gap {
  id: string;
  severity: "required" | "material" | "contextual";
  title: LocalizedText;
  detail: LocalizedText;
}

export interface Recommendation {
  pattern: DietaryPattern;
  headline: LocalizedText;
  gaps: Gap[];
  practices: LocalizedText[];
  suggestedFoodIds: string[];
}

export interface RecommendationInput {
  pattern: DietaryPattern;
  selectedIds: string[];
}

function selectedFoods(ids: string[]): FoodRecord[] {
  const set = new Set(ids);
  return FOODS.filter((food) => set.has(food.id));
}

function hasAnimal(foods: readonly FoodRecord[]): boolean {
  return foods.some((food) => kingdomOf(food.class) === "animal");
}

function hasClass(foods: readonly FoodRecord[], prefix: string): boolean {
  return foods.some((food) => food.class.startsWith(prefix) || food.class === prefix);
}

export function recommend(input: RecommendationInput): Recommendation {
  const foods = selectedFoods(input.selectedIds);
  switch (input.pattern) {
    case "plant-only":
      return plantOnly(foods);
    case "animal-inclusive":
      return animalInclusive(foods);
    case "hybrid":
      return hybrid(foods);
    default: {
      const _exhaustive: never = input.pattern;
      return _exhaustive;
    }
  }
}

function plantOnly(foods: readonly FoodRecord[]): Recommendation {
  const gaps: Gap[] = [
    {
      id: "b12",
      severity: "required",
      title: { en: "Vitamin B12", de: "Vitamin B12" },
      detail: {
        en: "No plant food in this matrix supplies bioavailable B12. Algal corrinoids are scored as inactive analogues. A plant-only pattern requires fortified food or cyanocobalamin/methylcobalamin supplementation. This is not optional.",
        de: "Kein pflanzliches Lebensmittel in dieser Matrix liefert bioverfügbares B12. Corrinoide aus Algen werden als inaktive Analoga gewertet. Ein rein pflanzliches Muster erfordert angereicherte Lebensmittel oder eine Supplementierung mit Cyanocobalamin/Methylcobalamin. Das ist nicht optional.",
      },
    },
    {
      id: "complete-protein",
      severity: "required",
      title: { en: "Complete, digestible protein", de: "Vollständiges, verdauliches Protein" },
      detail: {
        en: "Most plant proteins are limited in an amino acid or less digestible, so their DIAAS is lower than that of animal proteins; tofu, soy, and some beans come closest. Complementary pairing (legume + cereal) can raise the meal AAS; it does not make a lentil a steak. Isolated protein or a deliberately mixed plate is required if this is the sole pattern.",
        de: "Die meisten pflanzlichen Proteine sind bei einer Aminosäure limitiert oder schlechter verdaulich, daher ist ihr DIAAS niedriger als der tierischer Proteine; Tofu, Soja und manche Bohnen kommen am nächsten. Komplementäre Kombinationen (Hülsenfrucht + Getreide) können den AAS einer Mahlzeit erhöhen; sie machen aus einer Linse kein Steak. Isoliertes Protein oder ein bewusst gemischter Teller ist erforderlich, wenn dies das einzige Muster ist.",
      },
    },
    {
      id: "epa-dha",
      severity: "required",
      title: { en: "Long-chain EPA/DHA", de: "Langkettiges EPA/DHA" },
      detail: {
        en: "ALA conversion is inefficient (documented 8% → EPA, 1% → DHA). Preformed EPA/DHA on a plant-only pattern come from microalgae oil, not from flax, walnut, or leafy ALA. Do not treat ALA foods as marine-fat equivalents.",
        de: "Die ALA-Umwandlung ist ineffizient (dokumentiert 8 % → EPA, 1 % → DHA). Vorgeformtes EPA/DHA stammt bei rein pflanzlicher Ernährung aus Mikroalgenöl, nicht aus Leinsamen, Walnüssen oder ALA aus Blattgemüse. ALA-Lebensmittel sind kein Ersatz für Meeresfette.",
      },
    },
    {
      id: "heme-iron",
      severity: "material",
      title: { en: "Heme iron", de: "Hämeisen" },
      detail: {
        en: "Non-heme iron plus phytate is not heme iron. Vitamin C helps; it does not erase the gap. Ferritin monitoring is the honest control, not a recipe claim.",
        de: "Nicht-Hämeisen plus Phytat ist kein Hämeisen. Vitamin C hilft, schließt die Lücke aber nicht. Die ehrliche Kontrolle ist die Ferritin-Überwachung, nicht ein Rezeptversprechen.",
      },
    },
    {
      id: "retinol",
      severity: "material",
      title: { en: "Preformed retinol", de: "Vorgeformtes Retinol" },
      detail: {
        en: "Carotenoid-derived vitamin A uses 1/12 (β-carotene) and 1/24 (other) food RAE factors. Conversion varies with genetics, fat, and thyroid status. Orange vegetables are not liver.",
        de: "Aus Carotinoiden gebildetes Vitamin A nutzt die RAE-Faktoren 1/12 (β-Carotin) und 1/24 (andere). Die Umwandlung variiert mit Genetik, Fettzufuhr und Schilddrüsenstatus. Orangefarbenes Gemüse ist keine Leber.",
      },
    },
    {
      id: "animal-exclusives",
      severity: "material",
      title: { en: "Creatine, taurine, carnosine", de: "Kreatin, Taurin, Carnosin" },
      detail: {
        en: "These are animal-tissue compounds. A plant-only pattern does not contain them unless they are supplemented. Absence is compositional, not a moral failure.",
        de: "Das sind Verbindungen aus tierischem Gewebe. Ein rein pflanzliches Muster enthält sie nur, wenn sie supplementiert werden. Ihr Fehlen ist eine Frage der Zusammensetzung, kein moralisches Versagen.",
      },
    },
    {
      id: "zinc",
      severity: "material",
      title: { en: "Phytate-bound zinc", de: "Phytatgebundenes Zink" },
      detail: {
        en: "Legume and grain zinc is poorly absorbed relative to animal zinc. Soaking, fermenting, and sprouting reduce phytate; they do not equal meat zinc.",
        de: "Zink aus Hülsenfrüchten und Getreide wird im Vergleich zu tierischem Zink schlecht aufgenommen. Einweichen, Fermentieren und Keimen senken den Phytatgehalt; gleichwertig mit Zink aus Fleisch wird es dadurch nicht.",
      },
    },
  ];

  if (foods.some((food) => food.class === "algae")) {
    gaps.push({
      id: "iodine-excess",
      severity: "contextual",
      title: { en: "Iodine swing from algae", de: "Jodschwankungen durch Algen" },
      detail: {
        en: "Seaweed can cover iodine or overshoot it by an order of magnitude. It does not cover B12.",
        de: "Seetang kann den Jodbedarf decken oder ihn um eine Größenordnung überschreiten. B12 deckt er nicht.",
      },
    });
  }

  return {
    pattern: "plant-only",
    headline: {
      en: "A plant-only pattern is not biochemically complete without fortification or supplementation. The matrix will not pretend otherwise.",
      de: "Ein rein pflanzliches Muster ist ohne Anreicherung oder Supplementierung biochemisch nicht vollständig. Die Matrix tut nicht so, als wäre es anders.",
    },
    gaps,
    practices: [
      {
        en: "Supplement B12. Algae sheets do not count.",
        de: "B12 supplementieren. Algenblätter zählen nicht.",
      },
      {
        en: "If EPA/DHA is desired, use algal oil — not ALA hope.",
        de: "Wenn EPA/DHA gewünscht ist, Algenöl verwenden — nicht auf ALA hoffen.",
      },
      {
        en: "Pair legumes with a complementary cereal if protein completeness is a goal; still expect lower DIAAS than eggs or dairy.",
        de: "Hülsenfrüchte mit einem ergänzenden Getreide kombinieren, wenn Proteinvollständigkeit das Ziel ist; trotzdem einen niedrigeren DIAAS als bei Eiern oder Milchprodukten erwarten.",
      },
      {
        en: "Ferment, soak, or sprout legumes to lower phytate; re-check iron and zinc status rather than assuming adequacy.",
        de: "Hülsenfrüchte fermentieren, einweichen oder keimen lassen, um Phytat zu senken; Eisen- und Zinkstatus kontrollieren, statt eine ausreichende Versorgung anzunehmen.",
      },
      {
        en: "Do not collapse leafy salads, legumes, sprouts, kraut, mushrooms, and algae into one 'plant' score.",
        de: "Blattsalate, Hülsenfrüchte, Sprossen, Kraut, Pilze und Algen nicht zu einem einzigen „Pflanzen“-Wert zusammenfassen.",
      },
    ],
    suggestedFoodIds: [
      "lentils_boiled",
      "sauerkraut",
      "kale_raw",
      "nori_roasted",
      "soybeans_boiled",
    ],
  };
}

function animalInclusive(foods: readonly FoodRecord[]): Recommendation {
  const gaps: Gap[] = [];
  if (!hasAnimal(foods) && foods.length > 0) {
    gaps.push({
      id: "no-animal-selected",
      severity: "contextual",
      title: { en: "No animal food selected", de: "Kein tierisches Lebensmittel gewählt" },
      detail: {
        en: "The filter is animal-inclusive but the current plate is not. Animal-inclusive advantages do not apply until an animal food is present.",
        de: "Der Filter schließt tierische Lebensmittel ein, der aktuelle Teller aber nicht. Die Vorteile tierischer Lebensmittel greifen erst, wenn eines auf dem Teller ist.",
      },
    });
  }
  gaps.push({
    id: "fibre",
    severity: "material",
    title: { en: "Fibre and phytochemicals", de: "Ballaststoffe und sekundäre Pflanzenstoffe" },
    detail: {
      en: "Muscle, organs, eggs, and dairy score 0 on fibre/phytochemicals. That is compositionally true. An animal-only plate is not a plant plate and does not inherit plant axes.",
      de: "Muskelfleisch, Innereien, Eier und Milchprodukte erhalten 0 bei Ballaststoffen/Pflanzenstoffen. Das stimmt kompositorisch. Ein rein tierischer Teller ist kein Pflanzenteller und erbt keine pflanzlichen Achsen.",
    },
  });
  gaps.push({
    id: "vitamin-c",
    severity: "contextual",
    title: { en: "Vitamin C", de: "Vitamin C" },
    detail: {
      en: "Most muscle meats have none. Organs and a few animal foods have little. If the plate is animal-only, C is a real gap unless organs or another source is included.",
      de: "Die meisten Muskelfleischsorten enthalten keins. Innereien und einige tierische Lebensmittel enthalten wenig. Bei einem rein tierischen Teller ist Vitamin C eine echte Lücke, sofern keine Innereien oder andere Quellen dabei sind.",
    },
  });
  if (hasClass(foods, "organs")) {
    gaps.push({
      id: "retinol-ul",
      severity: "contextual",
      title: { en: "Preformed retinol upper limit", de: "Obergrenze für vorgeformtes Retinol" },
      detail: {
        en: "One portion of liver fills the vitamin A store for days. The body buffers and excretes a spaced-out portion; eating it every day is where storage becomes the problem. Frequency is the person's, not a schedule.",
        de: "Eine Portion Leber füllt den Vitamin-A-Speicher für Tage. Der Körper puffert und scheidet eine seltene Portion ab; täglich gegessen wird die Speicherung zum Problem. Die Häufigkeit bestimmt die Person, kein Plan.",
      },
    });
  }

  return {
    pattern: "animal-inclusive",
    headline: {
      en: "Animal foods close B12, complete protein, heme iron, retinol, and EPA/DHA gaps that plants cannot. They do not supply fibre.",
      de: "Tierische Lebensmittel schließen Lücken bei B12, vollständigem Protein, Hämeisen, Retinol und EPA/DHA, die Pflanzen nicht schließen können. Ballaststoffe liefern sie nicht.",
    },
    gaps,
    practices: [
      {
        en: "Prefer ruminant or fish when heme iron, zinc, or long-chain n-3 is the axis of interest.",
        de: "Wiederkäuer oder Fisch bevorzugen, wenn Hämeisen, Zink oder langkettige n-3 im Fokus stehen.",
      },
      {
        en: "Organs are a different class from muscle — do not hide liver inside a 'meat' average.",
        de: "Innereien sind eine andere Klasse als Muskelfleisch — Leber nicht in einem „Fleisch“-Durchschnitt verstecken.",
      },
      {
        en: "Eggs remain a protein-quality reference; they are not a fibre food.",
        de: "Eier bleiben eine Referenz für Proteinqualität; sie sind kein Ballaststofflieferant.",
      },
      {
        en: "If the plate is only muscle, add a plant class for fibre/phytochemicals or accept that axis as empty.",
        de: "Besteht der Teller nur aus Muskelfleisch, eine pflanzliche Klasse für Ballaststoffe/Pflanzenstoffe ergänzen oder diese Achse als leer akzeptieren.",
      },
    ],
    suggestedFoodIds: [
      "egg_boiled",
      "beef_liver_fried",
      "salmon_roasted",
      "beef_mince_braised",
      "kefir_whole",
    ],
  };
}

function hybrid(foods: readonly FoodRecord[]): Recommendation {
  const plant = foods.filter((food) => kingdomOf(food.class) === "plant");
  const animal = foods.filter((food) => kingdomOf(food.class) === "animal");
  const gaps: Gap[] = [];

  if (animal.length === 0) {
    gaps.push({
      id: "hybrid-no-animal",
      severity: "required",
      title: { en: "Hybrid plate missing animal foods", de: "Hybrider Teller ohne tierische Lebensmittel" },
      detail: {
        en: "A hybrid pattern without animal foods collapses to plant-only, including the B12/EPA/heme/retinol gaps.",
        de: "Ein hybrides Muster ohne tierische Lebensmittel fällt auf rein pflanzlich zurück, einschließlich der Lücken bei B12/EPA/Häm/Retinol.",
      },
    });
  }
  if (plant.length === 0) {
    gaps.push({
      id: "hybrid-no-plant",
      severity: "material",
      title: { en: "Hybrid plate missing plants", de: "Hybrider Teller ohne Pflanzen" },
      detail: {
        en: "A hybrid pattern without plants has no fibre/phytochemical axis.",
        de: "Ein hybrides Muster ohne Pflanzen hat keine Ballaststoff-/Pflanzenstoffachse.",
      },
    });
  }

  return {
    pattern: "hybrid",
    headline: {
      en: "Hybrid is the only pattern that can cover plant axes and animal-exclusive compounds without mandatory fortification — if both kingdoms are actually on the plate.",
      de: "Hybrid ist das einzige Muster, das pflanzliche Achsen und ausschließlich tierische Verbindungen ohne zwingende Anreicherung abdecken kann — sofern beide Reiche tatsächlich auf dem Teller sind.",
    },
    gaps,
    practices: [
      {
        en: "Pair heme iron with a vitamin-C plant if non-heme plant iron is also being counted. Do not reverse the implication: plants do not create heme.",
        de: "Hämeisen mit einer Vitamin-C-reichen Pflanze kombinieren, wenn auch pflanzliches Nicht-Hämeisen mitgezählt wird. Den Schluss nicht umkehren: Pflanzen erzeugen kein Häm.",
      },
      {
        en: "Use oily fish or algal oil for EPA/DHA; use ruminant fat if odd-chain/CLA composition is the question.",
        de: "Für EPA/DHA fetten Fisch oder Algenöl nutzen; Wiederkäuerfett, wenn es um ungeradzahlige Fettsäuren/CLA geht.",
      },
      {
        en: "Keep fermented kraut and fermented dairy in separate columns. Shared fermentation is not shared biochemistry.",
        de: "Fermentiertes Kraut und fermentierte Milchprodukte in getrennten Spalten halten. Gemeinsame Fermentation ist keine gemeinsame Biochemie.",
      },
      {
        en: "Organs cover retinol/B12/choline at low mass; muscle covers creatine/carnosine; legumes cover fibre and incomplete protein.",
        de: "Innereien decken Retinol/B12/Cholin mit wenig Masse; Muskelfleisch deckt Kreatin/Carnosin; Hülsenfrüchte decken Ballaststoffe und unvollständiges Protein.",
      },
    ],
    suggestedFoodIds: [
      "egg_boiled",
      "salmon_roasted",
      "lentils_boiled",
      "sauerkraut",
      "kale_raw",
    ],
  };
}

export function topInClass(cards: readonly ScoreCard[], foodClass: string, n = 3): ScoreCard[] {
  return cards
    .filter((card) => {
      const food = FOODS.find((item) => item.id === card.foodId);
      return food?.class === foodClass;
    })
    .sort((a, b) => a.classRank - b.classRank)
    .slice(0, n);
}

export function scoredSuggestions(pattern: DietaryPattern): ScoreCard[] {
  const rec = recommend({ pattern, selectedIds: [] });
  const cards = scoreCatalog(FOODS);
  return rec.suggestedFoodIds
    .map((id) => cards.find((card) => card.foodId === id))
    .filter((card): card is ScoreCard => Boolean(card));
}
