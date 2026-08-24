import type { ReferenceIntake } from "@/lib/types";

export const REFERENCE_INTAKES: ReferenceIntake[] = [
  {
    id: "protein",
    nutrient: "protein",
    amount: 57,
    unit: "g",
    population: {
      en: "Adult, 0.8 g/kg at 71 kg (DGE protein chapter, 2017; reprinted 2025)",
      de: "Erwachsene, 0,8 g/kg bei 71 kg (DGE Protein, 2017; 3. Auflage 2025)",
    },
    sourceId: "dge-ref-2025",
    year: 2017,
  },
  {
    id: "iron",
    nutrient: "iron",
    amount: 11,
    unit: "mg",
    population: {
      en: "Adult men, recommended intake (DGE 2024). Women: 14–16 mg/d.",
      de: "Männer, empfohlene Zufuhr (DGE 2024). Frauen: 14–16 mg/d.",
    },
    sourceId: "dge-iron-2024",
    year: 2024,
  },
  {
    id: "zinc",
    nutrient: "zinc",
    amount: 11,
    unit: "mg",
    population: {
      en: "Adult men at low phytate (DGE 2019). Higher phytate diets raise the value.",
      de: "Männer bei niedriger Phytatzufuhr (DGE 2019). Hohes Phytat erhöht den Wert.",
    },
    sourceId: "dge-ref-2025",
    year: 2019,
  },
  {
    id: "calcium",
    nutrient: "calcium",
    amount: 1000,
    unit: "mg",
    population: {
      en: "Adults (DGE calcium chapter, 2013/2025)",
      de: "Erwachsene (DGE Calcium, 2013/2025)",
    },
    sourceId: "dge-ref-2025",
    year: 2013,
  },
  {
    id: "b12",
    nutrient: "vitaminB12",
    amount: 4,
    unit: "µg",
    population: {
      en: "Adults, estimated value (DGE 2018; aligned with EFSA)",
      de: "Erwachsene, Schätzwert (DGE 2018; analog EFSA)",
    },
    sourceId: "dge-b12-2018",
    year: 2018,
  },
  {
    id: "vitaminA",
    nutrient: "vitaminA",
    amount: 850,
    unit: "µg RAE",
    population: {
      en: "Adult men (DGE vitamin A, 2020/2025). Women typically 700 µg RAE.",
      de: "Männer (DGE Vitamin A, 2020/2025). Frauen typisch 700 µg RAE.",
    },
    sourceId: "dge-ref-2025",
    year: 2020,
  },
  {
    id: "vitaminC",
    nutrient: "vitaminC",
    amount: 110,
    unit: "mg",
    population: {
      en: "Adult men (DGE 2015/2025). Women 95 mg.",
      de: "Männer (DGE 2015/2025). Frauen 95 mg.",
    },
    sourceId: "dge-ref-2025",
    year: 2015,
  },
  {
    id: "folate",
    nutrient: "folate",
    amount: 300,
    unit: "µg",
    population: {
      en: "Adults (DGE folate, 2018/2025)",
      de: "Erwachsene (DGE Folat, 2018/2025)",
    },
    sourceId: "dge-ref-2025",
    year: 2018,
  },
  {
    id: "fiber",
    nutrient: "fiber",
    amount: 30,
    unit: "g",
    population: {
      en: "Adults, guidance value (DGE fiber, 2021/2025)",
      de: "Erwachsene, Richtwert (DGE Ballaststoffe, 2021/2025)",
    },
    sourceId: "dge-ref-2025",
    year: 2021,
  },
  {
    id: "epaDha",
    nutrient: "epaDha",
    amount: 250,
    unit: "mg",
    population: {
      en: "Adults, EFSA adequate intake for EPA+DHA",
      de: "Erwachsene, EFSA Adequate Intake für EPA+DHA",
    },
    sourceId: "efsa-drv-2017",
    year: 2017,
  },
  {
    id: "selenium",
    nutrient: "selenium",
    amount: 70,
    unit: "µg",
    population: {
      en: "Adult men (DGE 2015/2025)",
      de: "Männer (DGE 2015/2025)",
    },
    sourceId: "dge-ref-2025",
    year: 2015,
  },
];

export function intake(id: string): ReferenceIntake {
  const row = REFERENCE_INTAKES.find((item) => item.id === id);
  if (!row) {
    throw new Error(`Unknown reference intake: ${id}`);
  }
  return row;
}
