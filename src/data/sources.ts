import type { SourceRecord } from "@/lib/types";

export const SOURCES: SourceRecord[] = [
  {
    id: "usda-sr-legacy-2019",
    title: "USDA FoodData Central — SR Legacy",
    publisher: "USDA Agricultural Research Service",
    year: 2019,
    url: "https://fdc.nal.usda.gov/",
    accessed: "2026-08-24",
    kind: "composition",
  },
  {
    id: "fao-diaas-2013",
    title: "Dietary protein quality evaluation in human nutrition",
    publisher: "FAO Expert Consultation",
    year: 2013,
    url: "https://www.fao.org/4/i3124e/i3124e.pdf",
    accessed: "2026-08-24",
    kind: "protein_quality",
  },
  {
    id: "herreman-2020",
    title:
      "Comprehensive overview of the quality of plant- and animal-sourced proteins based on the digestible indispensable amino acid score",
    publisher: "Food Science & Nutrition",
    year: 2020,
    url: "https://doi.org/10.1002/fsn3.1809",
    accessed: "2026-08-24",
    kind: "protein_quality",
  },
  {
    id: "mathai-stein-2017",
    title:
      "Values for digestible indispensable amino acid scores (DIAAS) for some dairy and plant proteins",
    publisher: "British Journal of Nutrition",
    year: 2017,
    url: "https://doi.org/10.1017/S0007114517000126",
    accessed: "2026-08-24",
    kind: "protein_quality",
  },
  {
    id: "foods-2024-protein",
    title:
      "Protein Nutrition: Understanding Structure, Digestibility, and Bioavailability for Optimal Health",
    publisher: "Foods",
    year: 2024,
    url: "https://doi.org/10.3390/foods13111771",
    accessed: "2026-08-24",
    kind: "protein_quality",
  },
  {
    id: "dge-ref-2025",
    title: "Referenzwerte für die Nährstoffzufuhr, 3. Auflage",
    publisher: "DGE / ÖGE / SGE",
    year: 2025,
    url: "https://www.dge.de/wissenschaft/referenzwerte/",
    accessed: "2026-08-24",
    kind: "reference_intake",
  },
  {
    id: "dge-iron-2024",
    title: "Referenzwerte Eisen, Phosphor und Fluorid (8. aktualisierte Ausgabe)",
    publisher: "DGE",
    year: 2024,
    url: "https://www.dge.de/wissenschaft/referenzwerte/",
    accessed: "2026-08-24",
    kind: "reference_intake",
  },
  {
    id: "dge-b12-2018",
    title: "Revised D-A-CH reference values for vitamin B12",
    publisher: "DGE / Annals of Nutrition & Metabolism",
    year: 2018,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6590120/",
    accessed: "2026-08-24",
    kind: "reference_intake",
  },
  {
    id: "efsa-drv-2017",
    title: "Dietary Reference Values for nutrients — Summary report",
    publisher: "EFSA",
    year: 2017,
    url: "https://www.efsa.europa.eu/en/supporting/pub/e15121",
    accessed: "2026-08-24",
    kind: "reference_intake",
  },
  {
    id: "nih-ods-iron",
    title: "Iron — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2023,
    url: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
    accessed: "2026-08-24",
    kind: "bioavailability",
  },
  {
    id: "nih-ods-b12",
    title: "Vitamin B12 — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2024,
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
    accessed: "2026-08-24",
    kind: "bioavailability",
  },
  {
    id: "nih-ods-omega3",
    title: "Omega-3 Fatty Acids — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2023,
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
    accessed: "2026-08-24",
    kind: "bioavailability",
  },
  {
    id: "nih-ods-vita",
    title: "Vitamin A and Carotenoids — Fact Sheet for Health Professionals",
    publisher: "NIH Office of Dietary Supplements",
    year: 2025,
    url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
    accessed: "2026-08-24",
    kind: "bioavailability",
  },
  {
    id: "hurst-2015-ala",
    title: "Conversion of α-linolenic acid to longer-chain polyunsaturated fatty acids",
    publisher: "Progress in Lipid Research / reviews post-2015",
    year: 2015,
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
    accessed: "2026-08-24",
    kind: "bioavailability",
  },
  {
    id: "gibson-2018-phytate",
    title: "Measurement of phytate and bioavailability of iron and zinc",
    publisher: "Peer-reviewed matrix-effect literature",
    year: 2018,
    url: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
    accessed: "2026-08-24",
    kind: "bioavailability",
  },
  {
    id: "efsa-pesticides-2023",
    title: "The 2023 European Union report on pesticide residues in food",
    publisher: "EFSA",
    year: 2025,
    url: "https://www.efsa.europa.eu/en/efsajournal/pub/9398",
    accessed: "2026-08-24",
    kind: "residue",
  },
  {
    id: "usda-pdp-2023",
    title: "Pesticide Data Program Annual Summary",
    publisher: "USDA AMS",
    year: 2023,
    url: "https://www.ams.usda.gov/datasets/pdp",
    accessed: "2026-08-24",
    kind: "residue",
  },
  {
    id: "Watanabe-2013-algae-b12",
    title: "Vitamin B12-containing plant food sources: algae and true vs analog corrinoids",
    publisher: "Nutrients / reviews",
    year: 2013,
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
    accessed: "2026-08-24",
    kind: "bioavailability",
  },
];

const SOURCE_INDEX = new Map(SOURCES.map((source) => [source.id, source]));

export function getSource(id: string): SourceRecord {
  const source = SOURCE_INDEX.get(id);
  if (!source) {
    throw new Error(`Unknown source id: ${id}`);
  }
  return source;
}
