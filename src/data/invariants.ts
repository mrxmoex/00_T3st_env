import type { Invariant } from "@/lib/types";

export const INVARIANTS: readonly Invariant[] = [
  {
    id: "eaa-diaas",
    title: {
      de: "Neun unentbehrliche Aminosäuren · DIAAS vor Mittelwerten",
      en: "Nine indispensable amino acids · DIAAS before averages",
    },
    body: {
      de: "Der Mensch synthetisiert 9 unentbehrliche Aminosäuren nicht. Die FAO (2013) ersetzt PDCAAS durch DIAAS: ileale Verdaulichkeit je Aminosäure, ohne Truncation >1.0. Getreide ist typischerweise lysinlimitiert, Hülsenfrüchte methionin/cystein-limitiert. Komplementarität verbessert das Profil, gleicht aber nicht die ileale Verdaulichkeit der meisten tierischen Proteine aus. Echter DIAAS >1.0 ist in unbehandelten Pflanzen selten.",
      en: "Humans do not synthesize 9 indispensable amino acids. FAO (2013) replaces PDCAAS with DIAAS: ileal digestibility per amino acid, untruncated above 1.0. Cereals are typically lysine-limited; legumes methionine/cysteine-limited. Complementarity improves the profile but does not equal the ileal digestibility of most animal proteins. True DIAAS >1.0 is rare in unaugmented plants.",
    },
    sourceIds: ["fao-diaas-2013", "herreman-diaas-2020", "mathai-diaas-2017", "dge-protein-2021"],
  },
  {
    id: "heme-iron",
    title: {
      de: "Häm-Eisen ist nicht Non-Häm-Eisen",
      en: "Heme iron is not non-heme iron",
    },
    body: {
      de: "Pflanzen liefern nur Non-Häm-Eisen. NIH: Absorption aus Mischkost mit Fleisch etwa 14–18 %, aus vegetarischer Kost 5–12 %; der Bedarf Vegetarisch Ernährender wird mit Faktor 1,8 angesetzt. Phytate, Oxalate und Polyphenole senken Fe, Zn und Ca zusätzlich. Kochen, Einweichen, Keimen und Fermentation mildern — sie tilgen die Lücke nicht.",
      en: "Plants supply only non-heme iron. NIH: absorption from mixed diets with meat is about 14–18 %, from vegetarian diets 5–12 %; vegetarian iron requirement is set 1.8×. Phytates, oxalates and polyphenols further cut Fe, Zn and Ca. Cooking, soaking, sprouting and fermentation mitigate — they do not erase the gap.",
    },
    sourceIds: ["nih-iron-2026", "hurrell-egli-2010", "gillooly-1983", "gibson-phytate-2018"],
  },
  {
    id: "absent-from-plants",
    title: {
      de: "B12, EPA/DHA, Creatin, Carnosin, Retinol — nicht in unbehandelten Pflanzen",
      en: "B12, EPA/DHA, creatine, carnosine, retinol — not in unaugmented plants",
    },
    body: {
      de: "NIH: Vitamin B12 kommt natürlich in Lebensmitteln tierischen Ursprungs vor, nicht in Pflanzen. Die meisten Spirulina-„B12“-Signale sind inaktive Analoga (Watanabe). ALA wird laut NIH zu <15 % in EPA/DHA umgewandelt, oft deutlich weniger. Creatin und Carnosin fehlen in Pflanzenmatrizen. Retinol ist vorgeformtes Vitamin A; Pflanzen liefern Provitamin-Carotinoide mit variabler Umwandlung.",
      en: "NIH: vitamin B12 is naturally present in foods of animal origin, not in plants. Most spirulina “B12” signals are inactive analogs (Watanabe). NIH: ALA conversion to EPA/DHA is <15 %, often much lower. Creatine and carnosine are absent from plant matrices. Retinol is preformed vitamin A; plants supply provitamin carotenoids with variable conversion.",
    },
    sourceIds: [
      "nih-b12-2025",
      "nih-omega3-2025",
      "nih-vita-2025",
      "watanabe-algae-b12-2002",
      "watanabe-spirulina-1999",
      "wu-taurine-2020",
    ],
  },
  {
    id: "fiber-passive-carb",
    title: {
      de: "Faser ist passives Kohlenhydrat — ein pflanzlicher Strukturvorteil",
      en: "Fiber is passive carbohydrate — a plant structural advantage",
    },
    body: {
      de: "Lösliche und unlösliche Faser plus Resistente Stärke treiben die Mikrobiom-Fermentation zu kurzkettigen Fettsäuren (u. a. Butyrat), sättigen und dämpfen die Glykämie. Sie fehlen in tierischen Produkten weitgehend. Freie Zucker und schnell verdauliche Stärken sind aktive Kohlenhydrate. Die Achse bestraft Fleisch nicht für fehlende Faser — sie macht den Trade-off sichtbar.",
      en: "Soluble and insoluble fiber plus resistant starch drive microbiome fermentation to short-chain fatty acids (including butyrate), satiety and glycemic control. They are largely absent from animal products. Free sugars and rapidly digestible starches are active carbohydrates. This axis does not punish meat for lacking fiber — it makes the trade-off visible.",
    },
    sourceIds: ["efsa-fibre-2010", "dge-fibre", "efsa-drv-2017"],
  },
  {
    id: "vitamin-lability",
    title: {
      de: "Wasserlösliche Vitamine sind labil; Matrix entscheidet über Carotinoide",
      en: "Water-soluble vitamins are labile; matrix decides carotenoids",
    },
    body: {
      de: "Vitamin C, Thiamin und Folat gehen durch Hitze, Sauerstoff, Licht, Auslaugen und Zeit verloren. Fettlösliche Vitamine und Carotinoide sind hitzestabiler, oxidieren aber. Zerkleinern und Garen kann die Carotinoid-Bioverfügbarkeit erhöhen und gleichzeitig C/Folat zerstören. Menge auf dem Etikett ist nicht Menge nach Zubereitung.",
      en: "Vitamin C, thiamin and folate are lost to heat, oxygen, light, leaching and time. Fat-soluble vitamins and carotenoids are more heat-stable but oxidize. Cutting and cooking can raise carotenoid bioavailability while destroying C/folate. Label quantity is not post-prep quantity.",
    },
    sourceIds: ["lešková-vitamins-2006", "baker-carotenoid-2016", "nih-vita-2025"],
  },
  {
    id: "surface-residues",
    title: {
      de: "Oberfläche und Morphologie steuern Rückstandslast",
      en: "Surface area and morphology drive residue load",
    },
    body: {
      de: "Blattgrün trägt typischerweise höhere Pestizid-/Fungizidlasten als Wurzeln oder dickschaliges Obst — mehr Fläche, mehr Kutikula-Kontakt. EFSA- und USDA-PDP-Monitoring sind die quantitativen Quellen; sie belegen keine ideologische Gefahr, sondern eine Morphologie. Fermentation und gründliches Garen können manche Rückstände und Antinährstoffe senken; systemische Wirkstoffe sind schwerer zu entfernen.",
      en: "Leafy greens typically carry higher pesticide/fungicide loads than roots or thick-skinned produce — more area, more cuticle contact. EFSA and USDA PDP monitoring are the quantitative sources; they document morphology, not a morality play. Fermentation and thorough cooking can reduce some residues and antinutrients; systemic compounds are harder to remove.",
    },
    sourceIds: ["efsa-residues-2023", "efsa-residues-2024", "usda-pdp-2023"],
  },
  {
    id: "distinct-niches",
    title: {
      de: "Fermente, Sprossen, UV-Pilze, Algen sind keine „Gemüse“-Mittelwerte",
      en: "Ferments, sprouts, UV mushrooms, algae are not a “vegetable” average",
    },
    body: {
      de: "Sauerkraut und andere Fermente liefern organische Säuren und potenziell lebende Kulturen. Sprossen verschieben Vitamin-C- und Antinährstoffprofile. UV-exponierte Pilze können relevanes D2 tragen. Bestimmte Algen enthalten echtes B12 oder EPA/DHA; die meisten gängigen „B12“-Algenclaims sind Analoga. Diese Nischen werden in der Ontologie getrennt gehalten.",
      en: "Sauerkraut and other ferments supply organic acids and potentially live cultures. Sprouts shift vitamin-C and antinutrient profiles. UV-exposed mushrooms can carry relevant D2. Certain algae contain true B12 or EPA/DHA; most common “B12” algae claims are analogs. These niches are kept uncollapsed in the ontology.",
    },
    sourceIds: ["watanabe-algae-b12-2002", "nih-b12-2025", "usda-fdc"],
  },
];
