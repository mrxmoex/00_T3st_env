import type { Messages } from "./messages";

export const en: Messages = {
  nav: {
    label: "Primary",
    matrix: "Matrix",
    compare: "Compare",
    recommend: "Best practice",
    method: "Methodology",
    limits: "Non-claims",
  },
  brandTagline: (version) => `Biochemical food matrix · v${version}`,
  footer: (lastVerified) =>
    `Free public access. Deterministic scores from raw tables + published coefficients. Last verified ${lastVerified}. Not medical advice.`,
  theme: { toggle: "Toggle color theme", light: "Light", dark: "Dark" },
  languageLabel: "Language",
  matrix: {
    lede:
      "An honest matrix of biochemical efficiency, completeness, and real-world value. Most plant proteins fall short on an amino acid, on digestibility, or on density. Non-heme iron is not heme iron. Algae, mushrooms, sprouts, kraut, legumes, and leafy salads are not interchangeable.",
    exportCsv: "Export CSV",
    exportJson: "Export JSON",
    inView: (count) => `${count} foods in view`,
    legend:
      "Tiers S–D are assigned from the class-weighted composite. Heat is 0–100 on each axis. Residue is inverted (higher = lower contaminant risk).",
    patternNote: (pattern) => `Pattern: ${pattern}. This banner does not sell completeness.`,
  },
  filters: {
    search: "Search",
    searchPlaceholder: "Spinach, Leber…",
    kingdom: "Kingdom",
    allClasses: "All classes",
    plantOnly: "Plant classes only",
    animalOnly: "Animal classes only",
    foodClass: "Food class",
    all: "All",
    pattern: "Dietary pattern",
    sortAxis: "Sort axis",
    preparation: "Preparation",
    allPreparations: "All preparations",
  },
  table: { food: "Food", class: "Class", tier: "Tier", axis: "Axis" },
  food: {
    unknown: "Unknown food",
    back: "Back to matrix",
    lede: ({ altName, preparation, source, kcal, tier, rank, size }) =>
      `${altName}. Preparation: ${preparation}. Source: ${source}. ${kcal} kcal / 100 g. Tier ${tier} (#${rank} of ${size} in class).`,
    radarTitle: (name) => `${name}: axis profile`,
    eaaSummary: ({ aas, diaas, pdcaas, limiting, digestibility }) =>
      `AAS ${aas}, DIAAS ${diaas}, PDCAAS ${pdcaas}. Limiting amino acid: ${limiting}. Ileal digestibility ${digestibility}.`,
    benefitsHeading: "Benefit",
    burdensHeading: "Burden (higher score = less burden)",
    fatsCarbsMicros: "Fats, carbs, micros",
    microLine: ({ rae, iron, zinc, calcium, b12 }) =>
      `RAE ${rae} µg · abs. Fe ${iron} mg · abs. Zn ${zinc} mg · abs. Ca ${calcium ?? "—"} mg · B12 ${b12 ?? "—"} µg`,
    bioactivesHeading: "Bioactive compounds",
    bioactivesLede:
      "Compounds the nutrient databases do not report, indexed by content from published analyses. Shown, not scored. “No data” means no analysis was found, not zero; “not detected” means an analysis looked and found none.",
    bioactiveColumns: { compound: "Compound", content: "mg per 100 g", measured: "What was measured", source: "Source" },
    bioactiveStatus: { notDetected: "not detected", notExpected: "not expected", noData: "no data" },
    bioactiveRawValue: "raw tissue value; cooking changes it",
    bioactiveDryWeight: "scaled from dry weight with this food's water content",
    bioactiveRange: (min, max) => `range ${min}–${max}`,
    burden: {
      heading: "Burdens: processing, residues, storage",
      lede: "What stands against the nutrients: how far the food is processed, what residues it may carry, and what the body keeps from it.",
      processingHeading: "Processing",
      nova: (group, label) => `NOVA ${group}: ${label}`,
      novaMeaning: {
        1: "Whole food, possibly cooked, dried, frozen, pasteurised, or fermented without additions.",
        2: "Oil, butter, salt, or sugar: ingredients for cooking, not eaten on their own.",
        3: "A whole food preserved with salt, sugar, oil, brine, or smoke.",
        4: "Industrial formulation with ingredients or additives not used in home kitchens, such as emulsifiers.",
      },
      capped: (from, to) => `Ultra-processed: composite capped from ${from} to ${to}, the top of tier D.`,
      evidence: ({ where, classified, nova4, nova3, retrieved }) =>
        `${where}: of ${classified} classified products in this category, ${nova4} are NOVA 4 and ${nova3} NOVA 3 (Open Food Facts, retrieved ${retrieved}).`,
      evidenceAll: "All countries",
      evidenceGermany: "Germany",
      additives: (products) => `Most frequent additives among the ${products} products in the category:`,
      retention: ({ reference, kept, details }) =>
        `Against ${reference}: kept ${kept} % of the labile vitamins per gram of dry matter (${details}). The stability axis is scaled by that share.`,
      sodium: ({ reference, from, to }) => `Sodium ${to} mg per 100 g, against ${from} mg in ${reference}.`,
      residuesHeading: "Residues and contaminants",
      hormones:
        "Hormonal growth promoters have been banned in EU livestock farming since 1988 (now Directive 96/22/EC). For animal foods, the residue axis scores veterinary drug residues.",
      accumulation:
        "Heavy metals such as cadmium, lead, and methylmercury are stored for years in kidney, bone, and brain; regular intake adds up instead of passing through.",
      storageHeading: "Stored by the body",
      storage: (nutrients) =>
        `This food supplies nutrients the body stores for months to years: ${nutrients}. Stores bridge gaps between meals, and they also let excess build up.`,
    },
    classColumns: "Class-specific columns",
    weights: (classLabel, w) =>
      `Composite weights for ${classLabel}: EAA ${w.eaa}, EFA ${w.efa}, carb ${w.carb}, micro ${w.micro}, fibre ${w.fibre}, residue ${w.residue}, stability ${w.degradation}.`,
    notes: "Notes",
    compareCta: "Compare this food",
    preparationsHeading: "Preparations",
    preparationsLede:
      "Per 100 g as eaten, each from its own database entry. The % change compares each preparation with the first per gram of dry matter, so water gained or lost neither hides nor fakes a loss; energy and water change per 100 g. Losses come from the databases' analyses and recipe calculations.",
    preparationsProcessing: "Processing (NOVA)",
    preparationsCompare: "Compare these preparations",
    nutrientsHeading: "Nutrients and where each value comes from",
    nutrientsHint:
      "Per 100 g edible portion. “Available” is the estimated absorbed amount where absorption studies exist; %DV per 100 kcal counts available amounts. “Body store” says how long the body holds a nutrient. — means no database reports the value; it is not counted as zero.",
    nutrientGroups: {
      macros: "Energy and macronutrients",
      diet: "Relevant for specific and medical diets",
      vitamins: "Vitamins",
      minerals: "Minerals",
      aminoAcids: "Essential amino acids",
      fattyAcids: "Fatty acids",
    },
    dietHint:
      "Composition values that renal, low-sodium, lactose-free, PKU, or carbohydrate-counted diets track. They are shown, not scored, and are not a prescription.",
    columns: {
      nutrient: "Nutrient",
      per100g: "per 100 g",
      available: "available",
      pctDv: "%DV / 100 kcal",
      store: "body store",
      source: "Source and provenance",
    },
    notReported: "not reported",
    patternNote: (foodName) =>
      `Amino acids the databases do not report were filled from the pattern of ${foodName}, scaled to this food's protein.`,
    sourcingHeading: "Sourcing and preparation",
    sourcingPreparation: "Preparation",
    sourcingResidues: "What a wash does not fix",
    qualityHeading: "What the nutrient table cannot see",
    treatBadge: "Treat",
    treatNote:
      "More than three ingredients means a formulation, not a home-cooked meal. A home meal can use many whole foods and stay unprocessed. A formulation is fine as a treat. Eaten as the regular food, the rest of this matrix stops meaning much: it is the liverwurst the dog gets every day.",
    treatIngredients: ({ median, over, known }) =>
      `In this product category the median ingredient list has ${median} entries; ${over} of ${known} lists run past three.`,
  },
  person: {
    heading: "This person",
    lede: "Amounts belong to a person. A large person doing heavy work loses more sweat sodium than a small person sitting all day. These figures are estimation methods, not allowances and not advice.",
    sex: "Sex",
    female: "Female",
    male: "Male",
    age: "Age",
    weight: "Weight, kg",
    height: "Height, cm",
    activity: "Day",
    activities: {
      seated: "Mostly seated",
      active: "On your feet",
      heavy: "Heavy work",
    },
    sweat: "Sweat",
    sweatLevels: { little: "Little", some: "Some", aLot: "A lot" },
    apply: "Use this context",
    clear: "Clear",
    summary: ({ energy, protein, sodiumLow, sodiumHigh }) =>
      `Estimated energy ${energy} kcal/day. Protein reference point ${protein} g/day. Sweat sodium about ${sodiumLow}–${sodiumHigh} mg for the sweat described.`,
    coverageHeading: "Read against this person",
    coverage: ({ energyPct, proteinG, proteinRef, sodiumMg, sodiumLow, sodiumHigh }) =>
      `100 g is ${energyPct} % of the estimated daily energy and ${proteinG} g of the ${proteinRef} g protein reference point. It contains ${sodiumMg} mg sodium; the described sweat carries about ${sodiumLow}–${sodiumHigh} mg.`,
    notAllowance: "The tier stays a property of the food. Body size does not rewrite it. Only the share of this person's day changes.",
  },
  compare: {
    title: "Side-by-side",
    lede:
      "Compare foods without collapsing classes. A lentil column will not grow a B12 value because the UI wants balance.",
    slot: (position) => `Food ${position}`,
    classTier: (classLabel, tier) => `${classLabel} · tier ${tier}`,
    eaaLine: ({ aas, diaas, limiting }) => `AAS ${aas} · DIAAS ${diaas} · limiting ${limiting}`,
    compoundLine: ({ creatineMg, fibreG, b12Ug }) =>
      `Creatine ${creatineMg === null ? "—" : `${creatineMg} mg`} · fibre ${fibreG} g · B12 ${b12Ug ?? "—"} µg`,
    novaLine: (group, label) => `NOVA ${group} · ${label}`,
    bioactivesHeading: "Bioactive compounds (mg per 100 g)",
    bioactivesHint:
      "From published analyses; not scored. * raw-tissue value for a cooked food · — no analysis found · n.d. analysed, not detected · ∅ not expected in this kind of food.",
    notDetectedShort: "n.d.",
    radarHeading: "Axis profile",
    radarTitle: "Axis profile of the selected foods",
    microHeading: "Micronutrient vector (%DV per 100 kcal)",
    microHint:
      "Colour saturates at 20 % DV per 100 kcal, the level scored as fully covered. ⚠ marks a stored nutrient whose amount in 100 kcal exceeds the adult upper limit. Frequency matters; the mark does not lower the score.",
  },
  recommend: {
    title: "Best-practice engine",
    lede:
      "Recommendations track gaps. They do not flatter the plate. A plant-only pattern is never described as complete without fortification or supplementation.",
    pattern: "Pattern",
    practices: "Practices",
    suggested: "Suggested foods:",
    plate: "Current plate",
    plateHint: "Toggle foods to see which gaps remain on this plate.",
  },
  severity: { required: "required", material: "material", contextual: "contextual" },
  method: {
    title: "Methodology",
    lede: (version, lastVerified) =>
      `Every score is a documented function of raw tables plus coefficients. Dataset ${version}, last verified ${lastVerified}. Formulas are implemented in \`src/scoring/\` and unit-tested.`,
    dataHeading: "0. Data sources",
    dataPrimary:
      "Nutrient values come from the German national nutrient database BLS 4.0 (Max Rubner-Institut, CC BY 4.0). Foods BLS does not list, and nutrients it does not report (choline, selenium), come from USDA FoodData Central SR Legacy (public domain).",
    dataScript:
      "A script (`scripts/data/build_snapshot.py`) downloads both databases, checks their SHA-256 hashes, and writes the snapshot the app ships. No nutrient value is typed by hand, and every value keeps the database's own provenance category.",
    dataMissing:
      "A value no database reports stays missing: it is shown as —, left out of the score, and named in the food's flags. Amino acids a source lacks are filled from the pattern of a named similar food, the method BLS calls Musterberechnung.",
    dataPreparation:
      "Boiled, stewed, fried, and other preparations are separate database entries. Their changes, such as vitamin losses or water gained and lost, come from the databases' analyses and recipe calculations, not from a factor this app applies.",
    frameHeading: "Benefit against burden",
    frameBenefits:
      "Benefit: essential amino acids with their digestibility, essential fats with the ALA conversion loss, carbohydrate type and fibre, and micronutrients as the amount the body can absorb.",
    frameBurdens:
      "Burden: pesticide, metal, and veterinary drug residues; nutrient loss from storage, cooking, and industrial processing; processing level and additives (NOVA). Nutrients the body stores and contaminants it accumulates are marked, because both build up.",
    frameComposite:
      "The composite weighs these per food class. Ultra-processed products (NOVA 4) stay in tier D: nutrients added or left over do not buy back the processing.",
    eaaHeading: "1. Essential amino acid completeness + digestibility",
    eaaPattern: "FAO 2013 adult scoring pattern (mg/g protein):",
    eaaRatios:
      "ratio_i = food_i / ref_i; AAS = min(ratio_i); DIAAS = AAS × ileal digestibility; PDCAAS = min(1, AAS) × digestibility",
    eaaAxis:
      "EAA_axis = 100 × (0.55 × min(1, AAS) + 0.30 × digestibility + 0.15 × clamp(protein_g / 20, 0, 1))",
    eaaNote:
      "Plant proteins remain incomplete when a ratio is below 1. Density prevents spinach protein from ranking as a protein food.",
    efaHeading: "2. Essential fatty acids / glycerides",
    efaConversion: (alaToDha, alaToEpa) =>
      `effective_LC_n3 = EPA + DHA + ALA × ${alaToDha} (DHA-eq). ALA→EPA coefficient ${alaToEpa} is flagged, not used as EPA equivalence.`,
    efaAxis:
      "EFA_axis = 100 × (0.45 × clamp(LC / 0.5) + 0.35 × n6/n3_score + 0.20 × glyceride_quality) + up to 10 points for odd-chain + CLA",
    efaFatFree: "Fat-free foods score 45: no EFA contribution, not a fat-quality failure.",
    carbHeading: "3. Carbohydrate type",
    carbSplit: "active = sugars + digestible starch; passive = fibre + resistant starch",
    carbCombined:
      "Combined: 0.55 × passive_fraction + 0.25 × activeScore + 0.20 × (1 − sugar_fraction). Near-zero carb animal foods score 70 (metabolically quiet, fibre absent).",
    microHeading: "4. Micronutrient density + bioavailability",
    microAbsorption: (v) =>
      `Iron absorption: heme ${v.heme}, non-heme base ${v.nonhemeBase}, with vitamin C ${v.nonhemeWithVitaminC}, high phytate ${v.nonhemeHighPhytate}. Iron in meat, fish, and organs is treated as ${v.hemeSharePct} % heme; egg and dairy iron is non-heme. Zinc: animal ${v.zincAnimal}, phytate ${v.zincPhytate}, low-phytate plant ${v.zincLowPhytate}.`,
    microRae: (betaCarotene, otherCarotenoids) =>
      `RAE = retinol + β-carotene × ${betaCarotene} (1/12) + other carotenoids × ${otherCarotenoids} (1/24). Algal B12 analogues contribute 0.`,
    microDensity: (saturationPct) =>
      `Twenty nutrients are scored, each as % of its FDA Daily Value per 100 kcal after the adjustments above, capped so ${saturationPct} % DV / 100 kcal = 1.0, then averaged over the nutrients the databases report. Values are in \`coefficients.ts\`.`,
    microUpperLimit:
      "A stored nutrient past the adult upper limit is marked, not penalised. The body buffers and excretes a portion eaten now and then; eating it every day is where the store fills up. The vitamin A limit applies to preformed retinol only. How often is the person's decision, not a schedule.",
    microAvailability: (v) =>
      `Availability, not the label amount: iron, zinc, and calcium count as the absorbed amount divided by the absorption the Daily Value already assumes (iron ${v.iron} %, zinc ${v.zinc} %, calcium ${v.calcium} % as from milk). Absorption is counted once, not twice, and oxalate-bound calcium in spinach counts about a sixth of milk calcium.`,
    calciumTable: { studied: "Food studied", absorption: "Absorbed", usedFor: "Applied to" },
    calciumNote:
      "Fractional calcium absorption measured in humans at the same calcium load (Weaver, Proulx & Heaney 1999). Foods marked * use the value of a related food. Foods without a study count like milk calcium.",
    microTable: { nutrient: "Nutrient", dailyValue: "Daily Value", upperLimit: "EFSA upper limit" },
    storageHeading: "10. Storage in the body",
    storageNutrients:
      "Daily intake recommendations treat every day alike. The body does store some nutrients: stores bridge weeks without intake, and they also let excess accumulate. Nutrients with small pools, such as thiamin and vitamin C, have to come in regularly.",
    storageTable: { nutrient: "Nutrient", store: "Held for", site: "Where" },
    storageContaminantsLead: "Contaminants the body accumulates (EFSA risk assessments):",
    storageContaminants: [
      "Cadmium: kidney, biological half-life 10–30 years.",
      "Lead: bone, decades.",
      "Methylmercury: brain and blood, half-life about two months; builds up with regular intake of large predatory fish.",
      "Dioxins and dioxin-like PCBs: body fat, half-lives of several years; taken in mainly with animal fat and fatty fish.",
      "Most current pesticides are excreted within days, so the concern is regular exposure rather than storage. Older organochlorines such as DDT persist in body fat.",
    ],
    bioactivesHeading: "11. Bioactive compounds",
    bioactivesNote:
      "Creatine, taurine, carnosine, anserine, coenzyme Q10, L-carnitine, ergothioneine, and glucosinolates are not in BLS or FoodData Central. They are indexed by content from the analyses below, each value with the tissue and state that was measured. They are shown, not scored, so compounds the body can also make do not outrank essential nutrients. Ergothioneine is converted from dry weight with each food's water content; a raw-tissue value shown for a cooked food is marked.",
    processingHeading: "9. Processing (NOVA)",
    processingGroups:
      "NOVA (Monteiro et al. 2019) sorts foods by processing: 1 whole foods, cooked or not; 2 culinary ingredients; 3 whole foods preserved with salt, sugar, oil, brine, or smoke; 4 industrial formulations with ingredients or additives not used in home cooking. Home-cooked foods keep group 1; canned and smoked foods are group 3.",
    processingCap: (ceiling) =>
      `NOVA 4 foods have their composite capped at ${ceiling}, the top of tier D. Their nutrients are not worth the processing unless food is scarce.`,
    processingEvidence:
      "Where the group depends on the product, the matrix uses market data: Open Food Facts (ODbL) counts how the products in a category are classified and which additives their ingredient lists name. The counts are stored with their retrieval date in `src/data/sources/processing-evidence.json`.",
    processingSulfite:
      "Sulfur dioxide and sulfites (E220–E228), common in potato products, destroy thiamin. US law therefore bars them from foods recognised as a source of vitamin B1 (21 CFR 182.3766).",
    hormonesNote:
      "Hormones: hormonal growth promoters have been banned in EU livestock farming since 1988 (now Directive 96/22/EC), and the German foods in BLS come from that system. Veterinary drug residues are scored as a residue class. Natural hormones in milk and plant isoflavones are not scored.",
    fibreHeading: "5. Fibre / phytochemicals",
    fibreNote: "Animal classes have baseline 0. That is composition, not a smear.",
    residueHeading: "6. Residue / contaminant risk",
    residueNote:
      "Higher score = lower risk. Leafy high surface area is not scored like a tuber. Fish/algae metals and veterinary residues are first-class, not footnotes.",
    degradationHeading: "7. Stability and nutrient loss",
    degradationNote:
      "Bonuses: cooked +0.08, fermented +0.22, dried +0.28. Fresh leafy stays labile. An industrially processed food (NOVA 3–4) is scaled by the share of vitamin C, thiamin, folate, and B6 per gram of dry matter it kept against the home-prepared form of the same food, so a long shelf life bought by destroying vitamins does not count as stability.",
    compositeHeading: "8. Composite and tiers",
    compositeNote:
      "Weights are class-specific and sum to 1. Fibre is down-weighted for animal classes because absence is expected — the fibre axis itself still reads 0.",
  },
  limits: {
    title: "What this system will not claim",
    lede:
      "Honesty is the product. The matrix measures biochemical axes. It does not sell a diet, a tribe, or a personality.",
    nonClaimsHeading: "Non-claims",
    nonClaims: [
      "It will not claim that plant and animal proteins are equivalent.",
      "It will not claim that non-heme iron, phytate-bound zinc, or carotenoid-A equal heme iron, animal zinc, or retinol.",
      "It will not claim that ALA is EPA/DHA.",
      "It will not claim that algal B12 analogues are vitamin B12.",
      "It will not claim that a plant-only diet is complete without fortification or supplementation.",
      "It will not claim that fibre absence makes meat “unhealthy,” or that fibre presence makes a plant complete.",
      "It will not treat leafy salads, legumes, sprouts, kraut, mushrooms, and algae as one class.",
      "It will not treat muscle, organs, eggs, dairy, and fermented animal foods as one class.",
      "It will not issue medical diagnoses, personalised prescriptions, or bloodwork interpretations (the data model allows future overlays; they are not present).",
      "It will not treat residue scores as laboratory certificates for a named farm or lot.",
      "It will not hide agricultural chemicals, metals, or veterinary residues.",
      "It will not produce a black-box “AI nutrition score.”",
      "It will not put the matrix behind a paywall.",
      "It will not fill a value no database reports with zero, or hide which database a value comes from.",
      "It will not present a value taken from a similar food as if it had been measured.",
      "It will not count the amount on a label as the amount the body absorbs.",
      "It will not let nutrients lift an ultra-processed product out of tier D.",
      "It will not present a compound value measured in one tissue or preparation as if it had been measured in another.",
    ],
    willDoHeading: "What it will do",
    willDo: [
      "Rank foods inside a class on documented axes.",
      "Show the limiting amino acid, conversion factors, and absorption coefficients.",
      "Show for every nutrient value which database it comes from and how that database obtained it.",
      "Show how preparation changes a food, using the databases' own cooked entries.",
      "Show what industrial processing costs: nutrient loss per gram of dry matter, salt, processing level, and typical additives.",
      "Index creatine, taurine, carnosine, coenzyme Q10, ergothioneine, and similar compounds by measured content, with the study behind each value.",
      "Show which nutrients the body stores and which contaminants it accumulates.",
      "Version the dataset and show the last verification date.",
      "Export the matrix as CSV and JSON.",
      "State required gaps for plant-only patterns in plain language.",
    ],
  },
  source: {
    summary: "Source & method",
    dataset: (version, lastVerified) =>
      `Dataset ${version}, last verified ${lastVerified}. Nutrient values are imported by script from the databases below; scores are computed in the browser from those values plus documented coefficients. There is no black-box model.`,
    updatePath:
      "To add a food: map it to its BLS or FDC entry in src/data/sources/manifest.json, run scripts/data/build_snapshot.py, add its curated spec in src/data/foods/*.ts, re-run tests.",
    general: [
      "BLS 4.0, Max Rubner-Institut (CC BY 4.0): primary nutrient source",
      "USDA FoodData Central SR Legacy (public domain): foods BLS lacks, choline, selenium",
      "FAO 2013 adult amino acid scoring pattern + DIAAS/PDCAAS literature",
      "IOM/EFSA RAE conversion (β-carotene /12, other carotenoids /24)",
      "FDA Daily Values; EFSA tolerable upper intake levels",
      "Iron/zinc absorption midpoints from bioavailability meta-analyses",
      "Calcium absorption by food: Weaver, Proulx & Heaney 1999",
      "Bioactive compound contents: published analyses, cited per value",
      "Open Food Facts (ODbL): NOVA groups and additives per product category",
      "EU/US MRL residue logic as classed risk, not a lab certificate",
    ],
    link: "link",
    entriesHeading: "Database entries",
    primary: "primary",
    matchSame: "same food and preparation",
    matchSimilar: "similar food, used as a stand-in",
    fills: (nutrients) => `fills: ${nutrients}`,
    datasetsHeading: "Databases and licences",
    curatedHeading: "Curated literature",
    cardLine: ({ aas, diaas, pdcaas, limiting, rae, iron }) =>
      `AAS ${aas} · DIAAS ${diaas} · PDCAAS ${pdcaas} · limiting ${limiting} · RAE ${rae} µg · absorbable Fe ${iron} mg`,
  },
  classes: {
    leafy_salad: "Leafy / salad greens",
    legumes: "Legumes / beans",
    sprouts: "Sprouts",
    cruciferous_fresh: "Cruciferous — fresh",
    cruciferous_fermented: "Cruciferous — fermented (kraut)",
    mushrooms: "Mushrooms (Schroom)",
    algae: "Algae / seaweed",
    roots_tubers: "Roots & tubers",
    other_vegetables: "Other vegetables",
    muscle_ruminant: "Muscle — ruminant",
    muscle_monogastric: "Muscle — monogastric",
    muscle_poultry: "Muscle — poultry",
    muscle_fish: "Muscle — fish",
    organs: "Organs",
    eggs: "Eggs",
    dairy: "Dairy",
    fermented_animal: "Fermented animal",
  },
  axes: {
    eaa: "EAA + digestibility",
    efa: "EFA / glycerides",
    carb: "Carbohydrate type",
    micro: "Micros + bioavailability",
    fibre: "Fibre / phytochemicals",
    residue: "Residue / contaminants",
    degradation: "Stability / nutrient loss",
    composite: "Composite",
  },
  axesShort: {
    eaa: "EAA",
    efa: "EFA",
    carb: "Carb",
    micro: "Micro",
    fibre: "Fibre",
    residue: "Residue",
    degradation: "Stable",
    composite: "Σ",
  },
  patterns: {
    "plant-only": "Plant-only",
    "animal-inclusive": "Animal-inclusive",
    hybrid: "Hybrid",
  },
  kingdoms: { plant: "Plant", animal: "Animal" },
  tiers: {
    S: "S — class-leading efficiency",
    A: "A — strong within class",
    B: "B — mid class",
    C: "C — weak on weighted axes",
    D: "D — poor within class weights",
  },
  extras: {
    folateDensity: "Folate density",
    vitaminKDensity: "Vitamin K density",
    nitrateProxy: "Nitrate proxy",
    surfaceResidue: "Surface residue load",
    lysineAdequacy: "Lysine vs FAO",
    saaAdequacy: "SAA vs FAO",
    phytatePenalty: "Phytate (higher=better)",
    resistantStarch: "Resistant starch",
    livingTissueLability: "Living-tissue lability",
    pathogenProxy: "Sprout pathogen proxy",
    glucosinolates: "Glucosinolates (measured)",
    goitrogenProxy: "Goitrogen note",
    vitaminCRetention: "Vitamin C",
    organicAcidStability: "Organic-acid stability",
    sodiumNote: "Sodium (higher=better/lower Na)",
    ergothioneine: "Ergothioneine (measured)",
    vitaminDPotential: "Vitamin D potential",
    chitinDigestPenalty: "Chitin digestibility",
    iodineDensity: "Iodine density",
    preformedN3: "Preformed n-3",
    inactiveB12Flag: "Active B12 (0 if analogue)",
    metalLoad: "Metal load (higher=cleaner)",
    starchActivity: "Starch quietness",
    carotenoidOnlyA: "Retinol vs carotenoid-A",
    vitaminCDensity: "Vitamin C density",
    waterWeight: "Low energy density",
    eaaCompleteness: "EAA completeness",
    oddChainCla: "Odd-chain + CLA",
    creatine: "Creatine",
    hemeIron: "Heme iron",
    n6Load: "n-6 quietness",
    leanness: "Leanness",
    epaDha: "EPA+DHA",
    iodineSelenium: "Iodine + selenium",
    retinolDensity: "Retinol density",
    b12Density: "B12 density",
    copperDensity: "Copper",
    cholineDensity: "Choline",
    yolkFatQuality: "Yolk fat quality",
    calciumDensity: "Calcium density",
    lactoseLoad: "Low lactose",
    fermentationStability: "Fermentation stability",
  },
};
