import type { ReferenceValue } from "@/lib/schema";

/** Adult DGE/ÖGE and EFSA anchors used to normalize nutrient-density scores. */
export const REFERENCE_VALUES: readonly ReferenceValue[] = [
  {
    id: "protein",
    names: { de: "Protein", en: "Protein" },
    unit: "g/d",
    adultMale: {
      value: 57,
      unit: "g/d",
      sourceId: "dge-protein-2021",
      year: 2021,
      confidence: "high",
      note: {
        de: "0,8 g/kg; 57 g bei männlichem Referenzgewicht <65 J.",
        en: "0.8 g/kg; 57 g at male reference weight, age <65.",
      },
    },
    adultFemale: {
      value: 48,
      unit: "g/d",
      sourceId: "dge-protein-2021",
      year: 2021,
      confidence: "high",
      note: {
        de: "0,8 g/kg; ca. 48 g bei weiblichem Referenzgewicht <65 J.",
        en: "0.8 g/kg; ~48 g at female reference weight, age <65.",
      },
    },
  },
  {
    id: "fiber",
    names: { de: "Ballaststoffe", en: "Dietary fibre" },
    unit: "g/d",
    adultMale: {
      value: 30,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
      note: {
        de: "DGE-Richtwert ≥30 g/d; EFSA AI 25 g/d.",
        en: "DGE guideline ≥30 g/d; EFSA AI 25 g/d.",
      },
    },
    adultFemale: {
      value: 30,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
    },
  },
  {
    id: "vitamin_c",
    names: { de: "Vitamin C", en: "Vitamin C" },
    unit: "mg/d",
    adultMale: {
      value: 110,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
    },
    adultFemale: {
      value: 95,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
    },
  },
  {
    id: "folate",
    names: { de: "Folat", en: "Folate" },
    unit: "µg/d",
    adultMale: {
      value: 300,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
      note: {
        de: "Folat-Äquivalente; NRV auf Verpackungen oft 200 µg.",
        en: "Folate equivalents; packaged NRV is often 200 µg.",
      },
    },
    adultFemale: {
      value: 300,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
    },
  },
  {
    id: "b12",
    names: { de: "Vitamin B12", en: "Vitamin B12" },
    unit: "µg/d",
    adultMale: {
      value: 4,
      sourceId: "dge-b12-2018",
      year: 2018,
      confidence: "high",
      note: {
        de: "Schätzwert 4,0 µg/d (2018), übernommen in DGE 2025.",
        en: "Estimated value 4.0 µg/d (2018), retained in DGE 2025.",
      },
    },
    adultFemale: {
      value: 4,
      sourceId: "dge-b12-2018",
      year: 2018,
      confidence: "high",
    },
  },
  {
    id: "vitamin_a",
    names: { de: "Vitamin A (RAE)", en: "Vitamin A (RAE)" },
    unit: "µg RAE/d",
    adultMale: {
      value: 850,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
      note: {
        de: "DGE-Überarbeitung Vitamin A 2020, Ausgabe 2025.",
        en: "DGE vitamin A revision 2020, 2025 edition.",
      },
    },
    adultFemale: {
      value: 700,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
    },
  },
  {
    id: "iron",
    names: { de: "Eisen", en: "Iron" },
    unit: "mg/d",
    adultMale: {
      value: 11,
      sourceId: "dge-eisen-2024",
      year: 2024,
      confidence: "high",
    },
    adultFemale: {
      value: 16,
      sourceId: "dge-eisen-2024",
      year: 2024,
      confidence: "high",
      note: {
        de: "Prämenopausal 16 mg; postmenopausal 14 mg; ohne Menstruation 11 mg.",
        en: "Premenopausal 16 mg; postmenopausal 14 mg; non-menstruating 11 mg.",
      },
    },
  },
  {
    id: "zinc",
    names: { de: "Zink", en: "Zinc" },
    unit: "mg/d",
    adultMale: {
      value: 14,
      sourceId: "dge-zink-2019",
      year: 2019,
      confidence: "high",
      note: {
        de: "Mittlere Phytatzufuhr: 14 mg (m), 8 mg (w). Hoch: 16 / 10 mg.",
        en: "Medium phytate: 14 mg (m), 8 mg (f). High phytate: 16 / 10 mg.",
      },
    },
    adultFemale: {
      value: 8,
      sourceId: "dge-zink-2019",
      year: 2019,
      confidence: "high",
    },
  },
  {
    id: "calcium",
    names: { de: "Calcium", en: "Calcium" },
    unit: "mg/d",
    adultMale: {
      value: 1000,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
    },
    adultFemale: {
      value: 1000,
      sourceId: "dge-ref-2025",
      year: 2025,
      confidence: "high",
    },
  },
  {
    id: "epa_dha",
    names: { de: "EPA + DHA", en: "EPA + DHA" },
    unit: "mg/d",
    adultMale: {
      value: 250,
      sourceId: "efsa-n3-2010",
      year: 2010,
      confidence: "moderate",
      note: {
        de: "EFSA AI 250 mg EPA+DHA/d für Erwachsene.",
        en: "EFSA AI 250 mg EPA+DHA/d for adults.",
      },
    },
    adultFemale: {
      value: 250,
      sourceId: "efsa-n3-2010",
      year: 2010,
      confidence: "moderate",
    },
  },
];
