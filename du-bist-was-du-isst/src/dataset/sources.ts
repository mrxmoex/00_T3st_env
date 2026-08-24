import type { SourceReference } from "@/lib/types";

/** Ordered-priority verified sources for all displayed claims */
export const SOURCES: Record<string, SourceReference> = {
  usda_fdc: {
    id: "usda_fdc",
    title: "USDA FoodData Central",
    url: "https://fdc.nal.usda.gov/",
    year: 2024,
    organization: "USDA ARS",
  },
  fao_diaas: {
    id: "fao_diaas",
    title: "Dietary protein quality evaluation in human nutrition (DIAAS)",
    url: "https://www.fao.org/3/i3514e/i3514e.pdf",
    year: 2013,
    organization: "FAO/WHO",
  },
  fao_diaas_2019: {
    id: "fao_diaas_2019",
    title: "FAO Expert Consultation on Protein Quality Evaluation",
    url: "https://www.fao.org/nutrition/requirements/proteins/en/",
    year: 2019,
    organization: "FAO",
  },
  efsa_drv: {
    id: "efsa_drv",
    title: "EFSA Dietary Reference Values for nutrients",
    url: "https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values",
    year: 2017,
    organization: "EFSA",
  },
  dge_referenz: {
    id: "dge_referenz",
    title: "DGE Referenzwerte für die Nährstoffzufuhr",
    url: "https://www.dge.de/wissenschaft/referenzwerte/",
    year: 2024,
    organization: "DGE",
  },
  nih_iron: {
    id: "nih_iron",
    title: "NIH ODS — Iron Fact Sheet for Health Professionals",
    url: "https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/",
    year: 2024,
    organization: "NIH ODS",
  },
  nih_b12: {
    id: "nih_b12",
    title: "NIH ODS — Vitamin B12 Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/",
    year: 2024,
    organization: "NIH ODS",
  },
  nih_omega3: {
    id: "nih_omega3",
    title: "NIH ODS — Omega-3 Fatty Acids Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/",
    year: 2024,
    organization: "NIH ODS",
  },
  nih_vitamin_a: {
    id: "nih_vitamin_a",
    title: "NIH ODS — Vitamin A Fact Sheet",
    url: "https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/",
    year: 2024,
    organization: "NIH ODS",
  },
  hallberg_iron: {
    id: "hallberg_iron",
    title: "Iron absorption from plant vs animal foods — meta-analysis",
    url: "https://pubmed.ncbi.nlm.nih.gov/6940487/",
    year: 1981,
    organization: "Am J Clin Nutr",
  },
  hurrell_phytate: {
    id: "hurrell_phytate",
    title: "Phytate and mineral bioavailability — review",
    url: "https://pubmed.ncbi.nlm.nih.gov/16522951/",
    year: 2003,
    organization: "Int J Food Sci Nutr",
  },
  efsa_pdp: {
    id: "efsa_pdp",
    title: "EFSA Annual Report on Pesticide Residues",
    url: "https://www.efsa.europa.eu/en/topics/topic/pesticide-residues",
    year: 2023,
    organization: "EFSA",
  },
  usda_pdp: {
    id: "usda_pdp",
    title: "USDA Pesticide Data Program Annual Summary",
    url: "https://www.ams.usda.gov/datasets/pdp",
    year: 2023,
    organization: "USDA AMS",
  },
  young_soy_diaas: {
    id: "young_soy_diaas",
    title: "Soy protein DIAAS values",
    url: "https://pubmed.ncbi.nlm.nih.gov/24607341/",
    year: 2014,
    organization: "Br J Nutr",
  },
  ruxton_fiber: {
    id: "ruxton_fiber",
    title: "Dietary fibre and metabolic health — review",
    url: "https://pubmed.ncbi.nlm.nih.gov/22780564/",
    year: 2012,
    organization: "Nutr Bull",
  },
  watanabe_b12_algae: {
    id: "watanabe_b12_algae",
    title: "Vitamin B12 in algae — active vs inactive analogs",
    url: "https://pubmed.ncbi.nlm.nih.gov/17959839/",
    year: 2007,
    organization: "J Agric Food Chem",
  },
  burdge_ala_conversion: {
    id: "burdge_ala_conversion",
    title: "ALA to EPA/DHA conversion efficiency in humans",
    url: "https://pubmed.ncbi.nlm.nih.gov/12936959/",
    year: 2003,
    organization: "Br J Nutr",
  },
};

export function getSource(id: string): SourceReference | undefined {
  return SOURCES[id];
}

export function getSources(ids: string[]): SourceReference[] {
  return ids.map((id) => SOURCES[id]).filter(Boolean);
}
