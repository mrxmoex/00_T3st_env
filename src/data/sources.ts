import type { SourceRef } from "./types";

export const SOURCES: Record<string, SourceRef> = {
  fdc: {
    id: "fdc",
    label: "USDA FoodData Central",
    url: "https://fdc.nal.usda.gov/",
    retrieved: "2026-08-24",
    notes: "Primary proximate, amino-acid, fatty-acid, and micronutrient tables.",
  },
  fao2007: {
    id: "fao2007",
    label: "WHO/FAO/UNU 2007 protein and amino acid requirements",
    url: "https://www.who.int/publications/i/item/9241209356",
    retrieved: "2026-08-24",
  },
  fao2013: {
    id: "fao2013",
    label: "FAO 2013 Dietary protein quality evaluation (DIAAS)",
    url: "https://www.fao.org/ag/humannutrition/35978-02317b979a686a57aa4593304ffc17f06.pdf",
    retrieved: "2026-08-24",
  },
  efsaIron: {
    id: "efsaIron",
    label: "EFSA iron dietary reference values / bioavailability",
    url: "https://www.efsa.europa.eu/en/efsajournal/pub/4254",
    retrieved: "2026-08-24",
  },
  efsaZinc: {
    id: "efsaZinc",
    label: "EFSA zinc dietary reference values (phytate)",
    url: "https://www.efsa.europa.eu/en/efsajournal/pub/3844",
    retrieved: "2026-08-24",
  },
  whoVitamins: {
    id: "whoVitamins",
    label: "WHO/FAO vitamin and mineral requirements",
    url: "https://www.who.int/publications/i/item/9241546123",
    retrieved: "2026-08-24",
  },
  efsaResidue: {
    id: "efsaResidue",
    label: "EFSA annual pesticide residue report",
    url: "https://www.efsa.europa.eu/en/topics/topic/pesticides",
    retrieved: "2026-08-24",
  },
  pdp: {
    id: "pdp",
    label: "USDA Pesticide Data Program",
    url: "https://www.ams.usda.gov/datasets/pdp",
    retrieved: "2026-08-24",
  },
  hurrell: {
    id: "hurrell",
    label: "Hurrell & Egli 2010 iron bioavailability review",
    url: "https://pubmed.ncbi.nlm.nih.gov/20200263/",
    retrieved: "2026-08-24",
  },
  burdge: {
    id: "burdge",
    label: "Burdge ALA conversion reviews",
    url: "https://pubmed.ncbi.nlm.nih.gov/16188209/",
    retrieved: "2026-08-24",
  },
  diaasLit: {
    id: "diaasLit",
    label: "Published DIAAS/PDCAAS compilations (milk, egg, meat, soy, pulses)",
    url: "https://www.fao.org/ag/humannutrition/35978-02317b979a686a57aa4593304ffc17f06.pdf",
    retrieved: "2026-08-24",
  },
};

export function cite(...ids: (keyof typeof SOURCES)[]): SourceRef[] {
  return ids.map((id) => {
    const source = SOURCES[id];
    if (!source) {
      throw new Error(`Unknown source ${id}`);
    }
    return source;
  });
}
