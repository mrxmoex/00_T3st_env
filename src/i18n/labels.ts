import type { BodyStore } from "../data/absorption";
import type { BioactiveCompound, MeasuredState } from "../data/bioactives";
import type { NutrientKey, ProvenanceCategory } from "../data/sources/snapshot";
import type { MicroNutrient, NovaGroup, Preparation } from "../scoring/types";
import type { LocalizedText } from "./locale";

export const BIOACTIVE_LABELS: Readonly<Record<BioactiveCompound, LocalizedText>> = {
  creatine: { en: "Creatine", de: "Kreatin" },
  taurine: { en: "Taurine", de: "Taurin" },
  carnosine: { en: "Carnosine", de: "Carnosin" },
  anserine: { en: "Anserine", de: "Anserin" },
  coq10: { en: "Coenzyme Q10", de: "Coenzym Q10" },
  carnitine: { en: "L-carnitine", de: "L-Carnitin" },
  ergothioneine: { en: "Ergothioneine", de: "Ergothionein" },
  glucosinolates: { en: "Glucosinolates", de: "Glucosinolate" },
};

export const BIOACTIVE_ROLES: Readonly<Record<BioactiveCompound, LocalizedText>> = {
  creatine: {
    en: "Phosphocreatine energy buffer in muscle and brain. The body makes about half of what it turns over; heat converts part of it to creatinine.",
    de: "Energiepuffer (Phosphokreatin) in Muskel und Gehirn. Der Körper bildet etwa die Hälfte des Umsatzes selbst; Hitze wandelt einen Teil in Kreatinin um.",
  },
  taurine: {
    en: "Bile acid conjugation, cell volume, and calcium handling in heart, retina, and muscle.",
    de: "Bindung der Gallensäuren, Zellvolumen und Calciumhaushalt in Herz, Netzhaut und Muskel.",
  },
  carnosine: {
    en: "β-Alanyl-histidine: pH buffer and antioxidant in muscle and brain.",
    de: "β-Alanyl-Histidin: pH-Puffer und Antioxidans in Muskel und Gehirn.",
  },
  anserine: {
    en: "Methylated carnosine with the same buffer role; dominant in poultry and many fish.",
    de: "Methyliertes Carnosin mit derselben Pufferfunktion; überwiegt bei Geflügel und vielen Fischen.",
  },
  coq10: {
    en: "Electron carrier in the mitochondria and fat-soluble antioxidant; also made by the body.",
    de: "Elektronenüberträger in den Mitochondrien und fettlösliches Antioxidans; wird auch selbst gebildet.",
  },
  carnitine: {
    en: "Carries long-chain fatty acids into the mitochondria; also made by the body from lysine and methionine.",
    de: "Transportiert langkettige Fettsäuren in die Mitochondrien; wird auch aus Lysin und Methionin gebildet.",
  },
  ergothioneine: {
    en: "Antioxidant with its own transporter (OCTN1). Humans cannot make it; mushrooms are the richest source.",
    de: "Antioxidans mit eigenem Transporter (OCTN1). Der Mensch kann es nicht bilden; Pilze sind die reichste Quelle.",
  },
  glucosinolates: {
    en: "Precursors of isothiocyanates such as sulforaphane. Conversion needs the plant enzyme myrosinase, which cooking destroys.",
    de: "Vorstufen von Isothiocyanaten wie Sulforaphan. Die Umwandlung braucht das Pflanzenenzym Myrosinase, das beim Kochen zerstört wird.",
  },
};

export const MEASURED_STATE_LABELS: Readonly<Record<MeasuredState, LocalizedText>> = {
  raw: { en: "raw", de: "roh" },
  cooked: { en: "cooked", de: "gegart" },
  unspecified: { en: "state not given", de: "Zustand nicht angegeben" },
};

export const NOVA_LABELS: Readonly<Record<NovaGroup, LocalizedText>> = {
  1: { en: "unprocessed or minimally processed", de: "unverarbeitet oder minimal verarbeitet" },
  2: { en: "processed culinary ingredient", de: "verarbeitete Küchenzutat" },
  3: { en: "processed food", de: "verarbeitetes Lebensmittel" },
  4: { en: "ultra-processed", de: "hochverarbeitet" },
};

export const BODY_STORE_LABELS: Readonly<Record<BodyStore, LocalizedText>> = {
  years: { en: "years", de: "Jahre" },
  months: { en: "months", de: "Monate" },
  weeks: { en: "weeks", de: "Wochen" },
  none: { en: "none", de: "keiner" },
};

/** Additives found in the processing evidence; other codes are shown as the bare E number. */
export const ADDITIVE_LABELS: Readonly<Record<string, LocalizedText>> = {
  E100: { en: "curcumin (colour)", de: "Kurkumin (Farbstoff)" },
  E221: { en: "sodium sulfite (preservative)", de: "Natriumsulfit (Konservierungsstoff)" },
  E223: { en: "sodium metabisulfite (preservative)", de: "Natriummetabisulfit (Konservierungsstoff)" },
  E300: { en: "ascorbic acid (antioxidant)", de: "Ascorbinsäure (Antioxidationsmittel)" },
  E304: { en: "ascorbyl palmitate (antioxidant)", de: "Ascorbylpalmitat (Antioxidationsmittel)" },
  E330: { en: "citric acid (acidity regulator)", de: "Citronensäure (Säuerungsmittel)" },
  E385: { en: "calcium disodium EDTA (sequestrant)", de: "Calciumdinatrium-EDTA (Komplexbildner)" },
  E392: { en: "rosemary extract (antioxidant)", de: "Rosmarinextrakt (Antioxidationsmittel)" },
  E450: { en: "diphosphates (stabiliser)", de: "Diphosphate (Stabilisator)" },
  E471: { en: "mono- and diglycerides of fatty acids (emulsifier)", de: "Mono- und Diglyceride von Speisefettsäuren (Emulgator)" },
  E509: { en: "calcium chloride (firming agent)", de: "Calciumchlorid (Festigungsmittel)" },
  E621: { en: "monosodium glutamate (flavour enhancer)", de: "Mononatriumglutamat (Geschmacksverstärker)" },
};

export const MICRO_LABELS: Readonly<Record<MicroNutrient, LocalizedText>> = {
  iron: { en: "Iron", de: "Eisen" },
  zinc: { en: "Zinc", de: "Zink" },
  vitaminA: { en: "Vitamin A", de: "Vitamin A" },
  vitaminB12: { en: "Vitamin B12", de: "Vitamin B12" },
  folate: { en: "Folate", de: "Folat" },
  vitaminC: { en: "Vitamin C", de: "Vitamin C" },
  vitaminD: { en: "Vitamin D", de: "Vitamin D" },
  vitaminE: { en: "Vitamin E", de: "Vitamin E" },
  vitaminK: { en: "Vitamin K", de: "Vitamin K" },
  thiamin: { en: "Thiamin", de: "Thiamin" },
  riboflavin: { en: "Riboflavin", de: "Riboflavin" },
  niacin: { en: "Niacin", de: "Niacin" },
  vitaminB6: { en: "Vitamin B6", de: "Vitamin B6" },
  choline: { en: "Choline", de: "Cholin" },
  calcium: { en: "Calcium", de: "Calcium" },
  magnesium: { en: "Magnesium", de: "Magnesium" },
  potassium: { en: "Potassium", de: "Kalium" },
  copper: { en: "Copper", de: "Kupfer" },
  selenium: { en: "Selenium", de: "Selen" },
  iodine: { en: "Iodine", de: "Jod" },
};

export const NUTRIENT_LABELS: Readonly<Record<NutrientKey, LocalizedText>> = {
  kcal: { en: "Energy", de: "Energie" },
  water: { en: "Water", de: "Wasser" },
  protein: { en: "Protein", de: "Protein" },
  fat: { en: "Fat", de: "Fett" },
  carbsAvailable: { en: "Available carbohydrate", de: "Verfügbare Kohlenhydrate" },
  fibre: { en: "Fibre", de: "Ballaststoffe" },
  sugars: { en: "Sugars", de: "Zucker" },
  starch: { en: "Starch", de: "Stärke" },
  lactose: { en: "Lactose", de: "Laktose" },
  his: { en: "Histidine", de: "Histidin" },
  ile: { en: "Isoleucine", de: "Isoleucin" },
  leu: { en: "Leucine", de: "Leucin" },
  lys: { en: "Lysine", de: "Lysin" },
  met: { en: "Methionine", de: "Methionin" },
  cys: { en: "Cysteine", de: "Cystein" },
  phe: { en: "Phenylalanine", de: "Phenylalanin" },
  tyr: { en: "Tyrosine", de: "Tyrosin" },
  thr: { en: "Threonine", de: "Threonin" },
  trp: { en: "Tryptophan", de: "Tryptophan" },
  val: { en: "Valine", de: "Valin" },
  sfa: { en: "Saturated fat", de: "Gesättigte Fettsäuren" },
  mufa: { en: "Monounsaturated fat", de: "Einfach ungesättigte Fettsäuren" },
  pufa: { en: "Polyunsaturated fat", de: "Mehrfach ungesättigte Fettsäuren" },
  ala: { en: "ALA (18:3 n-3)", de: "ALA (18:3 n-3)" },
  epa: { en: "EPA (20:5 n-3)", de: "EPA (20:5 n-3)" },
  dpa: { en: "DPA (22:5 n-3)", de: "DPA (22:5 n-3)" },
  dha: { en: "DHA (22:6 n-3)", de: "DHA (22:6 n-3)" },
  la: { en: "Linoleic acid (18:2 n-6)", de: "Linolsäure (18:2 n-6)" },
  aa: { en: "Arachidonic acid (20:4 n-6)", de: "Arachidonsäure (20:4 n-6)" },
  c15: { en: "Pentadecanoic acid (15:0)", de: "Pentadecansäure (15:0)" },
  c17: { en: "Heptadecanoic acid (17:0)", de: "Heptadecansäure (17:0)" },
  cla: { en: "CLA (18:2 c9,t11)", de: "CLA (18:2 c9,t11)" },
  retinol: { en: "Retinol", de: "Retinol" },
  betaCarotene: { en: "β-Carotene", de: "β-Carotin" },
  vitaminARae: { en: "Vitamin A (RAE)", de: "Vitamin A (RAE)" },
  vitaminD: { en: "Vitamin D", de: "Vitamin D" },
  vitaminE: { en: "Vitamin E", de: "Vitamin E" },
  vitaminK: { en: "Vitamin K", de: "Vitamin K" },
  thiamin: { en: "Thiamin (B1)", de: "Thiamin (B1)" },
  riboflavin: { en: "Riboflavin (B2)", de: "Riboflavin (B2)" },
  niacin: { en: "Niacin", de: "Niacin" },
  vitaminB6: { en: "Vitamin B6", de: "Vitamin B6" },
  folate: { en: "Folate (DFE)", de: "Folat (DFE)" },
  vitaminB12: { en: "Vitamin B12", de: "Vitamin B12" },
  vitaminC: { en: "Vitamin C", de: "Vitamin C" },
  choline: { en: "Choline", de: "Cholin" },
  sodium: { en: "Sodium", de: "Natrium" },
  potassium: { en: "Potassium", de: "Kalium" },
  calcium: { en: "Calcium", de: "Calcium" },
  magnesium: { en: "Magnesium", de: "Magnesium" },
  phosphorus: { en: "Phosphorus", de: "Phosphor" },
  iron: { en: "Iron", de: "Eisen" },
  zinc: { en: "Zinc", de: "Zink" },
  copper: { en: "Copper", de: "Kupfer" },
  iodine: { en: "Iodine", de: "Jod" },
  selenium: { en: "Selenium", de: "Selen" },
  cholesterol: { en: "Cholesterol", de: "Cholesterin" },
  provitaminAOther: { en: "Other provitamin A carotenoids", de: "Andere Provitamin-A-Carotinoide" },
};

export const PROVENANCE_LABELS: Readonly<Record<ProvenanceCategory, LocalizedText>> = {
  analysis: { en: "Lab analysis", de: "Laboranalyse" },
  literature: { en: "Literature", de: "Literatur" },
  aggregation: { en: "Aggregated literature", de: "Aggregierte Literatur" },
  database: { en: "Other database", de: "Andere Datenbank" },
  recipe: { en: "Recipe calculation (incl. cooking changes)", de: "Rezeptberechnung (inkl. Garveränderungen)" },
  pattern: { en: "Pattern of a similar food", de: "Muster eines ähnlichen Lebensmittels" },
  borrowed: { en: "Taken from a similar food", de: "Von ähnlichem Lebensmittel übernommen" },
  rescaled: { en: "Rescaled (e.g. water content)", de: "Reskaliert (z. B. Wassergehalt)" },
  formula: { en: "Calculated by formula", de: "Formelberechnung" },
  logicalZero: { en: "Logical zero", de: "Logische Null" },
  assumption: { en: "Logical assumption", de: "Logische Annahme" },
  trace: { en: "Trace", de: "Spuren" },
  label: { en: "Label value", de: "Etikettangabe" },
};

export const PREPARATION_LABELS: Readonly<Record<Preparation, LocalizedText>> = {
  raw: { en: "raw", de: "roh" },
  boiled: { en: "boiled", de: "gekocht" },
  steamed: { en: "steamed", de: "gedämpft" },
  stewed: { en: "stewed", de: "gedünstet" },
  fried: { en: "pan-fried", de: "gebraten" },
  roasted: { en: "roasted", de: "geröstet / im Ofen" },
  baked: { en: "baked", de: "gebacken" },
  grilled: { en: "grilled", de: "gegrillt" },
  braised: { en: "braised", de: "geschmort" },
  poached: { en: "poached", de: "pochiert" },
  smoked: { en: "smoked", de: "geräuchert" },
  dried: { en: "dried", de: "getrocknet" },
  canned: { en: "canned", de: "Konserve" },
  fermented: { en: "fermented", de: "fermentiert" },
  mashed: { en: "mashed, home-made", de: "Püree, selbst gemacht" },
  instant: { en: "from instant powder", de: "aus Instantpulver" },
  processed: { en: "processed", de: "verarbeitet" },
};
