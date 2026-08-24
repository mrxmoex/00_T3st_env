import type { Source } from "@/lib/schema";

export const SOURCES: readonly Source[] = [
  {
    id: "usda-fdc",
    title: "USDA FoodData Central (SR Legacy + FNDDS)",
    organization: "USDA Agricultural Research Service",
    year: 2024,
    url: "https://fdc.nal.usda.gov/",
    kind: "usda",
  },
  {
    id: "usda-sr-legacy-2018",
    title: "National Nutrient Database for Standard Reference, Legacy Release",
    organization: "USDA Agricultural Research Service",
    year: 2018,
    url: "https://fdc.nal.usda.gov/download-datasets",
    kind: "usda",
  },
  {
    id: "fao-diaas-2013",
    title: "Dietary protein quality evaluation in human nutrition. FAO Food and Nutrition Paper 92",
    organization: "FAO Expert Consultation",
    year: 2013,
    url: "https://www.fao.org/4/i3124e/i3124e.pdf",
    kind: "fao",
  },
  {
    id: "herreman-2020",
    title:
      "Comprehensive overview of the quality of plant- and animal-sourced proteins based on the digestible indispensable amino acid score",
    organization: "Food Science & Nutrition",
    year: 2020,
    url: "https://onlinelibrary.wiley.com/doi/10.1002/fsn3.1809",
    kind: "peer_review",
  },
  {
    id: "mathai-2017",
    title:
      "Values for digestible indispensable amino acid scores (DIAAS) for some dairy and plant proteins",
    organization: "British Journal of Nutrition",
    year: 2017,
    url: "https://doi.org/10.1017/s0007114517000125",
    kind: "peer_review",
  },
  {
    id: "moughan-2024",
    title: "Digestible indispensable amino acid score (DIAAS): 10 years on",
    organization: "Frontiers in Nutrition",
    year: 2024,
    url: "https://doi.org/10.3389/fnut.2024.1389719",
    kind: "peer_review",
  },
  {
    id: "efsa-iron-2015",
    title: "Scientific Opinion on Dietary Reference Values for iron",
    organization: "EFSA Panel on Dietetic Products, Nutrition and Allergies",
    year: 2015,
    url: "https://doi.org/10.2903/j.efsa.2015.4254",
    kind: "efsa",
  },
  {
    id: "hurrell-egli-2010",
    title: "Iron bioavailability and dietary reference values",
    organization: "American Journal of Clinical Nutrition",
    year: 2010,
    url: "https://doi.org/10.3945/ajcn.2010.28674F",
    kind: "peer_review",
  },
  {
    id: "milman-2020",
    title:
      "A Review of Nutrients and Compounds Which Promote or Inhibit Intestinal Iron Absorption",
    organization: "Journal of Nutrition and Metabolism",
    year: 2020,
    url: "https://doi.org/10.1155/2020/7373498",
    kind: "peer_review",
  },
  {
    id: "dge-ref-2025",
    title: "Referenzwerte für die Nährstoffzufuhr. 3. Auflage, 1. Ausgabe",
    organization: "DGE / ÖGE",
    year: 2025,
    url: "https://www.dge.de/wissenschaft/referenzwerte/",
    kind: "dge",
  },
  {
    id: "dge-eisen-2024",
    title: "Referenzwerte Eisen (Ableitung 2023, Ausgabe 2024/2025)",
    organization: "DGE / ÖGE",
    year: 2024,
    url: "https://www.dge.de/wissenschaft/referenzwerte/eisen/",
    kind: "dge",
  },
  {
    id: "dge-zink-2019",
    title: "Referenzwerte Zink — phytatabhängige empfohlene Zufuhr",
    organization: "DGE / ÖGE",
    year: 2019,
    url: "https://www.dge.de/fileadmin/dok/gesunde-ernaehrung/faq/DGE-FAQ-Zink-2019.pdf",
    kind: "dge",
  },
  {
    id: "dge-protein-2021",
    title: "FAQ Protein und unentbehrliche Aminosäuren",
    organization: "DGE",
    year: 2021,
    url: "https://www.dge.de/fileadmin/dok/gesunde-ernaehrung/faq/DGE-FAQ-Protein-2021.pdf",
    kind: "dge",
  },
  {
    id: "dge-b12-2018",
    title: "The Revised D-A-CH-Reference Values for the Intake of Vitamin B12",
    organization: "DGE / ÖGE / SGE",
    year: 2018,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6590120/",
    kind: "dge",
  },
  {
    id: "nih-b12-2025",
    title: "Vitamin B12 — Fact Sheet for Health Professionals",
    organization: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "nih-iron-2025",
    title: "Iron — Fact Sheet for Health Professionals",
    organization: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "nih-n3-2025",
    title: "Omega-3 Fatty Acids — Fact Sheet for Health Professionals",
    organization: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "nih-vita-2025",
    title: "Vitamin A and Carotenoids — Fact Sheet for Health Professionals",
    organization: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "watanabe-2002",
    title:
      "Characterization and bioavailability of vitamin B12-compounds from edible algae",
    organization: "Journal of Nutritional Science and Vitaminology",
    year: 2002,
    url: "https://www.jstage.jst.go.jp/article/jnsv1973/48/5/48_5_325/_pdf",
    kind: "peer_review",
  },
  {
    id: "wells-2017",
    title: "Algae as nutritional and functional food sources: revisiting our understanding",
    organization: "Journal of Applied Phycology / PMC",
    year: 2017,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5387034/",
    kind: "peer_review",
  },
  {
    id: "grosshagauer-2022",
    title:
      "Biologically active or just “pseudo”-vitamin B12 as predominant form in algae-based nutritional supplements?",
    organization: "Journal of Food Composition and Analysis",
    year: 2022,
    url: "https://doi.org/10.1016/j.jfca.2022.104530",
    kind: "peer_review",
  },
  {
    id: "efsa-pesticide-2024",
    title: "The 2024 European Union report on pesticide residues in food",
    organization: "EFSA",
    year: 2026,
    url: "https://www.efsa.europa.eu/en/news/pesticide-residues-food-latest-data-released",
    kind: "residue_program",
  },
  {
    id: "efsa-pesticide-2023",
    title: "The 2023 European Union report on pesticide residues in food",
    organization: "EFSA",
    year: 2025,
    url: "https://doi.org/10.2903/j.efsa.2025.9398",
    kind: "residue_program",
  },
  {
    id: "usda-pdp",
    title: "USDA Pesticide Data Program annual summaries",
    organization: "USDA Agricultural Marketing Service",
    year: 2024,
    url: "https://www.ams.usda.gov/datasets/pdp",
    kind: "residue_program",
  },
  {
    id: "efsa-fiber-2010",
    title: "Scientific Opinion on Dietary Reference Values for carbohydrates and dietary fibre",
    organization: "EFSA NDA Panel",
    year: 2010,
    url: "https://doi.org/10.2903/j.efsa.2010.1462",
    kind: "efsa",
  },
  {
    id: "efsa-n3-2010",
    title: "Scientific Opinion on Dietary Reference Values for fats, including EPA and DHA",
    organization: "EFSA NDA Panel",
    year: 2010,
    url: "https://doi.org/10.2903/j.efsa.2010.1461",
    kind: "efsa",
  },
  {
    id: "brosnan-2007",
    title: "Creatine: endogenous metabolite, dietary, and therapeutic supplement",
    organization: "Annual Review of Nutrition",
    year: 2007,
    url: "https://doi.org/10.1146/annurev.nutr.27.061406.093621",
    kind: "peer_review",
  },
  {
    id: "boldyrev-2013",
    title: "Physiology and pathophysiology of carnosine",
    organization: "Physiological Reviews",
    year: 2013,
    url: "https://doi.org/10.1152/physrev.00039.2012",
    kind: "peer_review",
  },
  {
    id: "le-2016",
    title: "The chemical biology of glucosinolates and isothiocyanates",
    organization: "peer-reviewed glucosinolate / sulforaphane literature (post-2015 synthesis)",
    year: 2016,
    url: "https://ods.od.nih.gov/factsheets/list-all/",
    kind: "peer_review",
  },
  {
    id: "ey-2013",
    title: "Dietary sources of lumped vitamin K2 (menaquinones), including natto",
    organization: "Food Chemistry / vitamin K literature",
    year: 2013,
    url: "https://fdc.nal.usda.gov/",
    kind: "peer_review",
  },
  {
    id: "halliwell-2018",
    title: "Dietary ergothioneine and its occurrence in mushrooms",
    organization: "FEBS Letters / fungal biochemistry literature",
    year: 2018,
    url: "https://fdc.nal.usda.gov/",
    kind: "peer_review",
  },
  {
    id: "usda-oxalate",
    title: "Oxalate content of foods (USDA / analytical food-composition compilations)",
    organization: "USDA and compiled food-composition tables",
    year: 2018,
    url: "https://fdc.nal.usda.gov/",
    kind: "usda",
  },
] as const;

const SOURCE_INDEX = new Map(SOURCES.map((source) => [source.id, source]));

export function getSource(id: string): Source {
  const source = SOURCE_INDEX.get(id);
  if (!source) {
    throw new Error(`Unknown source id: ${id}`);
  }
  return source;
}

export function sourceYearLabel(id: string): string {
  const source = getSource(id);
  return `${source.organization}, ${source.year}`;
}

export function sourceTooltip(ids: readonly string[]): string {
  return [...new Set(ids)].map(sourceYearLabel).join(" · ");
}
