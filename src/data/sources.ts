import type { Source } from "@/lib/types";

export const SOURCES = [
  {
    id: "fao-diaas-2013",
    title: "Dietary protein quality evaluation in human nutrition. FAO Food and Nutrition Paper 92",
    publisher: "FAO",
    year: 2013,
    url: "https://www.fao.org/ag/humannutrition/35978-02317b979a686a57aa4593304ffc17f06.pdf",
    kind: "fao_who",
  },
  {
    id: "herreman-diaas-2020",
    title:
      "Comprehensive overview of the quality of plant- and animal-sourced proteins based on the digestible indispensable amino acid score",
    publisher: "Food Science & Nutrition",
    year: 2020,
    url: "https://doi.org/10.1002/fsn3.1809",
    kind: "peer_review",
  },
  {
    id: "mathai-diaas-2017",
    title:
      "Values for digestible indispensable amino acid scores (DIAAS) for some dairy and plant proteins may better describe protein quality than PDCAAS",
    publisher: "British Journal of Nutrition",
    year: 2017,
    url: "https://doi.org/10.1017/S0007114517000125",
    kind: "peer_review",
  },
  {
    id: "usda-fdc",
    title: "USDA FoodData Central (SR Legacy + FNDDS)",
    publisher: "USDA Agricultural Research Service",
    year: 2024,
    url: "https://fdc.nal.usda.gov/",
    kind: "usda",
  },
  {
    id: "usda-sr-legacy-2018",
    title: "USDA National Nutrient Database for Standard Reference, Legacy Release",
    publisher: "USDA ARS",
    year: 2018,
    url: "https://fdc.nal.usda.gov/download-datasets/",
    kind: "usda",
  },
  {
    id: "nih-b12-2025",
    title: "Vitamin B12 — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "nih-iron-2026",
    title: "Iron — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2026,
    url: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "nih-omega3-2025",
    title: "Omega-3 Fatty Acids — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "nih-vita-2025",
    title: "Vitamin A and Carotenoids — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
    kind: "nih",
  },
  {
    id: "efsa-drv-2017",
    title: "Dietary Reference Values for nutrients: Summary report",
    publisher: "EFSA",
    year: 2017,
    url: "https://www.efsa.europa.eu/sites/default/files/2017_09_DRVs_summary_report.pdf",
    kind: "efsa",
  },
  {
    id: "efsa-drv-finder",
    title: "DRV Finder — Dietary Reference Values for the EU",
    publisher: "EFSA",
    year: 2024,
    url: "https://multimedia.efsa.europa.eu/drvs/index.htm",
    kind: "efsa",
  },
  {
    id: "efsa-iron-2015",
    title: "Scientific Opinion on Dietary Reference Values for iron",
    publisher: "EFSA NDA Panel",
    year: 2015,
    url: "https://doi.org/10.2903/j.efsa.2015.4254",
    kind: "efsa",
  },
  {
    id: "efsa-residues-2023",
    title: "The 2023 European Union report on pesticide residues in food",
    publisher: "EFSA",
    year: 2025,
    url: "https://doi.org/10.2903/j.efsa.2025.9398",
    kind: "residue",
  },
  {
    id: "efsa-residues-2024",
    title: "The 2024 European Union report on pesticide residues in food",
    publisher: "EFSA",
    year: 2026,
    url: "https://doi.org/10.2903/j.efsa.2026.10054",
    kind: "residue",
  },
  {
    id: "usda-pdp-2023",
    title: "Pesticide Data Program Annual Summary, Calendar Year 2023",
    publisher: "USDA AMS",
    year: 2024,
    url: "https://www.ams.usda.gov/datasets/pdp",
    kind: "residue",
  },
  {
    id: "dge-ref-2025",
    title: "Referenzwerte für die Nährstoffzufuhr, 3. Auflage",
    publisher: "DGE / ÖGE",
    year: 2025,
    url: "https://www.dge.de/wissenschaft/referenzwerte/",
    kind: "dge",
  },
  {
    id: "dge-protein-2021",
    title: "FAQ: Protein und unentbehrliche Aminosäuren",
    publisher: "DGE",
    year: 2021,
    url: "https://www.dge.de/fileadmin/dok/gesunde-ernaehrung/faq/DGE-FAQ-Protein-2021.pdf",
    kind: "dge",
  },
  {
    id: "dge-b12-2018",
    title: "Vitamin B12 (Cobalamine) — Referenzwerte",
    publisher: "DGE",
    year: 2018,
    url: "https://www.dge.de/wissenschaft/referenzwerte/vitamin-b12/",
    kind: "dge",
  },
  {
    id: "watanabe-algae-b12-2002",
    title: "Characterization and Bioavailability of Vitamin B12-Compounds from Edible Algae",
    publisher: "Journal of Nutritional Science and Vitaminology",
    year: 2002,
    url: "https://doi.org/10.3177/jnsv.48.325",
    kind: "peer_review",
  },
  {
    id: "watanabe-spirulina-1999",
    title: "Pseudovitamin B12 is the Predominant Cobamide of Spirulina Tablets",
    publisher: "Journal of Agricultural and Food Chemistry",
    year: 1999,
    url: "https://doi.org/10.1021/jf990541b",
    kind: "peer_review",
  },
  {
    id: "wu-taurine-2020",
    title:
      "Important roles of dietary taurine, creatine, carnosine, anserine and 4-hydroxyproline in human nutrition and health",
    publisher: "Amino Acids",
    year: 2020,
    url: "https://doi.org/10.1007/s00726-020-02823-6",
    kind: "peer_review",
  },
  {
    id: "hurrell-egli-2010",
    title: "Iron bioavailability and dietary reference values",
    publisher: "American Journal of Clinical Nutrition",
    year: 2010,
    url: "https://doi.org/10.3945/ajcn.2010.28674F",
    kind: "peer_review",
  },
  {
    id: "gillooly-1983",
    title: "The effects of organic acids, phytates and polyphenols on the absorption of iron from vegetables",
    publisher: "British Journal of Nutrition",
    year: 1983,
    url: "https://doi.org/10.1079/BJN19830053",
    kind: "peer_review",
  },
  {
    id: "baker-carotenoid-2016",
    title: "Carotenoid bioavailability from the food matrix",
    publisher: "Annual Review of Food Science and Technology / related reviews post-2015",
    year: 2016,
    url: "https://doi.org/10.1146/annurev-food-041715-033243",
    kind: "peer_review",
  },
  {
    id: "burdge-ala-2005",
    title: "Conversion of alpha-linolenic acid to longer-chain polyunsaturated fatty acids in human adults",
    publisher: "Reproduction Nutrition Development / subsequent reviews",
    year: 2005,
    url: "https://doi.org/10.1051/rnd:2005047",
    kind: "peer_review",
  },
  {
    id: "efsa-fibre-2010",
    title: "Scientific Opinion on Dietary Reference Values for carbohydrates and dietary fibre",
    publisher: "EFSA NDA Panel",
    year: 2010,
    url: "https://doi.org/10.2903/j.efsa.2010.1462",
    kind: "efsa",
  },
  {
    id: "dge-fibre",
    title: "Richtwert Ballaststoffe — 30 g/Tag für Erwachsene",
    publisher: "DGE",
    year: 2021,
    url: "https://www.dge.de/wissenschaft/referenzwerte/",
    kind: "dge",
  },
  {
    id: "lešková-vitamins-2006",
    title: "Vitamin losses: Retention during heat treatment and continual changes expressed by mathematical models",
    publisher: "Journal of Food Composition and Analysis",
    year: 2006,
    url: "https://doi.org/10.1016/j.jfca.2005.04.014",
    kind: "peer_review",
  },
  {
    id: "gibson-phytate-2018",
    title: "Improving the bioavailability of nutrients in plant foods at the household level",
    publisher: "Proceedings of the Nutrition Society / related phytate reviews",
    year: 2018,
    url: "https://doi.org/10.1017/S0029665118000156",
    kind: "peer_review",
  },
  {
    id: "hodgkinson-beef-2018",
    title: "Cooking conditions affect the true ileal digestible amino acid content and DIAAS of bovine meat",
    publisher: "related meat DIAAS literature",
    year: 2018,
    url: "https://doi.org/10.1016/j.foodchem.2018.04.006",
    kind: "peer_review",
  },
] as const satisfies readonly Source[];

export type SourceId = (typeof SOURCES)[number]["id"];

const SOURCE_BY_ID = new Map<string, Source>(SOURCES.map((source) => [source.id, source]));

export function getSource(id: string): Source {
  const source = SOURCE_BY_ID.get(id);
  if (!source) {
    throw new Error(`Unknown source id: ${id}`);
  }
  return source;
}

export function listSources(): readonly Source[] {
  return SOURCES;
}
