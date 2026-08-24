import type { SourceRef } from "../types/domain.ts";

export const SOURCES: readonly SourceRef[] = [
  {
    id: "usda-fdc-sr",
    title: "USDA FoodData Central, SR Legacy",
    publisher: "USDA Agricultural Research Service",
    url: "https://fdc.nal.usda.gov/",
    accessed: "2026-08-24",
    notes: "Primary nutrient table. Each food stores its FDC ID.",
  },
  {
    id: "who-fao-2013",
    title:
      "Dietary protein quality evaluation in human nutrition — FAO Food and Nutrition Paper 92",
    publisher: "FAO / WHO",
    url: "https://www.fao.org/ag/humannutrition/35978-02317b979a686a57aa4593304c17f127.pdf",
    accessed: "2026-08-24",
    notes: "Adult amino-acid scoring pattern and DIAAS definition.",
  },
  {
    id: "who-fao-2007",
    title: "Protein and amino acid requirements in human nutrition",
    publisher: "WHO / FAO / UNU",
    url: "https://iris.who.int/handle/10665/43411",
    accessed: "2026-08-24",
  },
  {
    id: "hurrell-egli-2010",
    title: "Iron bioavailability and dietary reference values",
    publisher: "American Journal of Clinical Nutrition",
    url: "https://doi.org/10.3945/ajcn.2010.28674F",
    accessed: "2026-08-24",
    notes: "Heme vs non-heme absorption ranges used for the 0.30 relative coefficient.",
  },
  {
    id: "who-zinc-bioavail",
    title: "Vitamin and mineral requirements in human nutrition, 2nd ed. — zinc",
    publisher: "WHO / FAO",
    url: "https://www.who.int/publications/i/item/9241546123",
    accessed: "2026-08-24",
    notes: "Phytate-bound zinc has substantially lower absorption than animal zinc.",
  },
  {
    id: "iom-vitamina",
    title: "Dietary Reference Intakes for Vitamin A, Vitamin K, …",
    publisher: "Institute of Medicine / National Academies",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK222318/",
    accessed: "2026-08-24",
    notes: "RAE conversion: 12 µg food β-carotene = 1 µg retinol.",
  },
  {
    id: "burdge-2006",
    title: "Metabolism of α-linolenic acid in humans",
    publisher: "Prostaglandins, Leukotrienes and Essential Fatty Acids",
    url: "https://doi.org/10.1016/j.plefa.2006.05.013",
    accessed: "2026-08-24",
    notes: "ALA conversion to EPA/DHA is inefficient; DHA conversion is typically <1%.",
  },
  {
    id: "phillips-2017-diaas",
    title: "Current Concepts and Unresolved Questions in Dietary Protein Requirements",
    publisher: "Literature synthesis of published DIAAS values",
    url: "https://doi.org/10.1093/jn/nxx027",
    accessed: "2026-08-24",
    notes: "Used for published DIAAS anchors (milk, egg, beef, soy isolate ranges).",
  },
  {
    id: "usda-pdp",
    title: "USDA Pesticide Data Program annual summaries",
    publisher: "USDA Agricultural Marketing Service",
    url: "https://www.ams.usda.gov/datasets/pdp",
    accessed: "2026-08-24",
    notes: "Residue detect-rate bands by commodity class, not legal-limit exceedance claims.",
  },
  {
    id: "efsa-mrl",
    title: "EU pesticide maximum residue levels",
    publisher: "European Commission / EFSA",
    url: "https://ec.europa.eu/food/plants/pesticides/max-residue-levels_en",
    accessed: "2026-08-24",
  },
  {
    id: "fda-mercury-fish",
    title: "Advice about eating fish — mercury",
    publisher: "US FDA / EPA",
    url: "https://www.fda.gov/food/consumers/advice-about-eating-fish",
    accessed: "2026-08-24",
    notes: "Atlantic salmon is a lower-mercury species relative to large predators.",
  },
  {
    id: "who-b12",
    title: "Vitamin B12 — fact sheet and dietary sources",
    publisher: "NIH ODS / WHO micronutrient guidance",
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
    accessed: "2026-08-24",
    notes: "Active B12 is an animal-food (or fortified/supplement) nutrient. Algal analogs are not assumed active.",
  },
  {
    id: "iodine-seaweed",
    title: "Iodine concentration in seaweed and related foods",
    publisher: "Literature range (Teas / FAO iodine reviews)",
    url: "https://www.who.int/data/gho/indicator-metadata-registry/imr-details/24",
    accessed: "2026-08-24",
    notes: "Iodine in nori/wakame is estimated; excess risk is scored on the residue axis.",
  },
  {
    id: "rs-legumes",
    title: "Resistant starch in cooked pulses",
    publisher: "Literature estimates",
    url: "https://doi.org/10.1016/j.foodchem.2016.09.009",
    accessed: "2026-08-24",
    notes: "Resistant starch is rarely in FDC; values are flagged estimate.",
  },
  {
    id: "cla-ruminant",
    title: "Conjugated linoleic acid and odd-chain fatty acids in ruminant fat",
    publisher: "Literature estimates",
    url: "https://doi.org/10.3168/jds.S0022-0302(99)75312-X",
    accessed: "2026-08-24",
    notes: "Placeholder DOI cluster — CLA/OCFA amounts are estimates, not FDC fields.",
  },
];

const SOURCE_BY_ID = new Map(SOURCES.map((source) => [source.id, source]));

export function sourceById(id: string): SourceRef | undefined {
  return SOURCE_BY_ID.get(id);
}
