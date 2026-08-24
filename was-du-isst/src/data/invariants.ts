import type { Invariant } from "@/types/catalog";

export const INVARIANTS: Invariant[] = [
  {
    id: "eaa-diaas",
    number: 1,
    title: {
      en: "Nine indispensable amino acids and ileal digestibility",
      de: "Neun unentbehrliche Aminosäuren und ileale Verdaulichkeit",
    },
    body: {
      en: "Humans cannot synthesize nine indispensable amino acids in sufficient amounts. FAO (2013) therefore scores protein by DIAAS using true ileal digestibility of each amino acid, not a single fecal protein digestibility factor. Cereal proteins are typically lysine-limited; legumes are typically methionine+cysteine-limited. True DIAAS ≥1.0 is uncommon in unaugmented plant foods. Complementary mixing raises the score but does not erase the ileal-digestibility gap versus most animal proteins.",
      de: "Menschen können neun unentbehrliche Aminosäuren nicht in ausreichender Menge synthetisieren. Die FAO (2013) bewertet Protein daher per DIAAS über die wahre ileale Verdaulichkeit jeder Aminosäure, nicht über einen einzelnen fäkalen Proteinverdaulichkeitsfaktor. Getreide ist typischerweise lysinlimitiert, Hülsenfrüchte methionin+cysteinlimitiert. Ein DIAAS ≥1,0 ist in unbehandelten Pflanzen selten. Komplementierung hebt das Profil, gleicht aber nicht die ileale Verdaulichkeit der meisten tierischen Proteine an.",
    },
    sourceIds: ["fao-diaas-2013", "herreman-2020", "mathai-2017", "who-protein-2007", "moughan-2024"],
  },
  {
    id: "heme-minerals",
    number: 2,
    title: {
      en: "Heme iron versus inhibitor-bound nonheme minerals",
      de: "Häm-Eisen versus inhibitorgebundenes Nicht-Häm-Mineral",
    },
    body: {
      en: "Dietary iron exists as heme and nonheme. Heme iron, found with meat, poultry, and seafood, is absorbed more efficiently and is less affected by meal inhibitors. Nonheme iron (plants, fortified foods, and part of animal muscle) is suppressed by phytates, some polyphenols, and oxalates. NIH estimates ~14–18% iron absorption from mixed diets versus ~5–12% from vegetarian diets. Cooking, soaking, sprouting, and fermentation reduce—not erase—the gap.",
      de: "NahrungsEisen existiert als Häm- und Nicht-Häm-Eisen. Häm-Eisen aus Fleisch, Geflügel und Fisch wird effizienter absorbiert und ist weniger inhibitoranfällig. Nicht-Häm-Eisen (Pflanzen, angereicherte Lebensmittel, Anteil im Muskel) wird durch Phytate, einige Polyphenole und Oxalate gehemmt. NIH: ~14–18 % Absorption bei Mischkost vs. ~5–12 % bei vegetarischer Kost. Garen, Einweichen, Keimen und Fermentieren verringern die Lücke, tilgen sie nicht.",
    },
    sourceIds: ["nih-iron", "efsa-iron-2015", "dge-ref-2025"],
  },
  {
    id: "absent-compounds",
    number: 3,
    title: {
      en: "Compounds essentially absent from unaugmented plants",
      de: "Stoffe, die in unbehandelten Pflanzen im Wesentlichen fehlen",
    },
    body: {
      en: "Preformed vitamin B12, long-chain EPA/DHA, creatine, carnosine, and retinol are essentially absent from unaugmented plant foods. Some algae supply true B12 or EPA/DHA; common spirulina “B12” is typically inactive analogs. ALA converts to EPA/DHA at low efficiency (NIH: reported rates <15%; often cited dietary planning figures are ≤5–10%). Direct EPA/DHA intake is the practical route to raise tissue long-chain omega-3.",
      de: "Präformiertes Vitamin B12, langkettiges EPA/DHA, Kreatin, Carnosin und Retinol fehlen in unbehandelten Pflanzen praktisch. Manche Algen liefern echtes B12 oder EPA/DHA; das „B12“ gängiger Spirulina ist meist inaktive Analoga. ALA wird nur schlecht zu EPA/DHA umgewandelt (NIH: berichtete Raten <15 %; oft ≤5–10 %). Direkte EPA/DHA-Zufuhr ist der praktische Weg.",
    },
    sourceIds: ["nih-b12", "nih-omega3", "nih-vita", "nih-creatine", "nih-carnitine"],
  },
  {
    id: "fiber-passive-carb",
    number: 4,
    title: {
      en: "Fiber is a plant structural advantage, not a moral category",
      de: "Ballaststoffe sind ein pflanzlicher Strukturvorteil, keine Moralkategorie",
    },
    body: {
      en: "Soluble fiber, insoluble fiber, and resistant starch are largely unique to plant (and some fungal) matrices. They are passive carbohydrate: they reach the colon, feed fermentation to short-chain fatty acids such as butyrate, and slow glycemic appearance. Free sugars and rapidly digestible starches are active carbohydrate. Animal products typically contribute neither fiber nor active starch; that is a quantified trade-off, not a verdict.",
      de: "Lösliche und unlösliche Ballaststoffe sowie resistente Stärke sind weitgehend an pflanzliche (und manche fungale) Matrizes gebunden. Sie sind passives Kohlenhydrat: sie erreichen das Kolon, treiben die Fermentation zu kurzkettigen Fettsäuren wie Butyrat und dämpfen die glykämische Antwort. Freie Zucker und schnell verdauliche Stärken sind aktives Kohlenhydrat. Tierische Produkte liefern typischerweise weder Ballaststoffe noch aktive Stärke — ein quantifizierter Trade-off, kein Urteil.",
    },
    sourceIds: ["efsa-drv", "dge-ref-2025", "usda-fdc"],
  },
  {
    id: "vitamin-lability",
    number: 5,
    title: {
      en: "Water-soluble vitamins are labile; carotenoids trade heat for matrix release",
      de: "Wasserlösliche Vitamine sind labil; Carotinoide tauschen Hitze gegen Matrixfreisetzung",
    },
    body: {
      en: "Vitamin C, thiamin, and folate degrade with heat, oxygen, light, leaching into cooking water, and time. Fat-soluble vitamins and carotenoids are more heat-stable but oxidize with oxygen and light. Cutting and cooking can increase carotenoid bioavailability by disrupting the food matrix while destroying more labile vitamins. Quantity on a raw label is not the quantity absorbed after storage and preparation.",
      de: "Vitamin C, Thiamin und Folat zerfallen durch Hitze, Sauerstoff, Licht, Auslaugen ins Kochwasser und Zeit. Fettlösliche Vitamine und Carotinoide sind hitzestabiler, oxidieren aber mit Sauerstoff und Licht. Schneiden und Garen können die Carotinoid-Bioverfügbarkeit durch Matrixstörung erhöhen und zugleich labilere Vitamine zerstören. Die Rohwertangabe ist nicht die absorbierte Menge nach Lagerung und Zubereitung.",
    },
    sourceIds: ["nih-vita", "dge-ref-2025", "usda-fdc"],
  },
  {
    id: "surface-residues",
    number: 6,
    title: {
      en: "Surface area and morphology govern residue load",
      de: "Oberfläche und Morphologie steuern die Rückstandslast",
    },
    body: {
      en: "Leafy greens typically carry higher measured pesticide/fungicide detections than roots or thick-skinned produce because of high surface-to-mass ratio and foliar spraying. USDA PDP and EFSA residue reports monitor these commodities on rotation. Fermentation and thorough cooking can reduce some surface residues and anti-nutrients; systemic compounds are harder to remove. Detection below a legal tolerance is not the same as zero residue.",
      de: "Blattgemüse trägt typischerweise höhere gemessene Pestizid-/Fungizidnachweise als Wurzeln oder dickschaliges Obst, wegen des hohen Oberfläche-zu-Masse-Verhältnisses und Blattbehandlungen. USDA PDP und EFSA überwachen diese Waren rotierend. Fermentation und gründliches Garen können Oberflächenrückstände und Antinährstoffe mindern; systemische Stoffe sind schwerer zu entfernen. Nachweis unter der Toleranz ist nicht Null.",
    },
    sourceIds: ["usda-pdp-2024", "efsa-residues-2024"],
  },
  {
    id: "unequal-niches",
    number: 7,
    title: {
      en: "Ferments, sprouts, UV fungi, and algae are not “vegetables”",
      de: "Fermente, Sprossen, UV-Pilze und Algen sind keine „Gemüse“-Mittelwerte",
    },
    body: {
      en: "Sauerkraut and tempeh occupy an organic-acid / microbial-metabolite niche. Sprouts often raise vitamin C and lower some anti-nutrients relative to the dry seed. UV-exposed mushrooms can form vitamin D2. Some seaweeds are iodine- and EPA-dense; spirulina protein is dense but its cobalamin is usually analog. Averaging these into a vegetable mean erases the biochemistry the matrix is built to show.",
      de: "Sauerkraut und Tempeh besetzen eine Nische aus organischen Säuren und mikrobiellen Metaboliten. Sprossen erhöhen oft Vitamin C und senken manche Antinährstoffe gegenüber der trockenen Saat. UV-exponierte Pilze können Vitamin D2 bilden. Manche Algen sind iod- und EPA-dicht; Spirulina ist proteindicht, ihr Cobalamin meist analog. Der Gemüse-Mittelwert löscht genau die Biochemie, die diese Matrix zeigen soll.",
    },
    sourceIds: ["usda-fdc", "nih-b12", "nih-omega3", "dge-ref-2025"],
  },
];
