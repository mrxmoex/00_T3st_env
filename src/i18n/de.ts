import type { Messages } from "./messages";

export const de: Messages = {
  nav: {
    label: "Hauptnavigation",
    matrix: "Matrix",
    compare: "Vergleich",
    recommend: "Empfehlungen",
    method: "Methodik",
    limits: "Grenzen",
  },
  brandTagline: (version) => `Biochemische Lebensmittelmatrix · v${version}`,
  footer: (lastVerified) =>
    `Frei und öffentlich zugänglich. Deterministische Werte aus Rohtabellen + veröffentlichten Koeffizienten. Zuletzt geprüft am ${lastVerified}. Keine medizinische Beratung.`,
  theme: { toggle: "Farbschema wechseln", light: "Hell", dark: "Dunkel" },
  languageLabel: "Sprache",
  matrix: {
    lede:
      "Eine ehrliche Matrix aus biochemischer Effizienz, Vollständigkeit und praktischem Nutzen. Die meisten pflanzlichen Proteine sind bei einer Aminosäure, bei der Verdaulichkeit oder bei der Dichte im Nachteil. Nicht-Hämeisen ist kein Hämeisen. Algen, Pilze, Sprossen, Kraut, Hülsenfrüchte und Blattsalate sind nicht austauschbar.",
    exportCsv: "CSV exportieren",
    exportJson: "JSON exportieren",
    inView: (count) => `${count} Lebensmittel angezeigt`,
    legend:
      "Die Stufen S–D ergeben sich aus dem klassengewichteten Gesamtwert. Die Farbskala reicht auf jeder Achse von 0 bis 100. Rückstände sind invertiert (höher = geringeres Kontaminationsrisiko).",
    patternNote: (pattern) => `Muster: ${pattern}. Dieses Banner verkauft keine Vollständigkeit.`,
  },
  filters: {
    search: "Suche",
    searchPlaceholder: "Spinat, Leber…",
    kingdom: "Reich",
    allClasses: "Alle Klassen",
    plantOnly: "Nur pflanzliche Klassen",
    animalOnly: "Nur tierische Klassen",
    foodClass: "Lebensmittelklasse",
    all: "Alle",
    pattern: "Ernährungsmuster",
    sortAxis: "Sortierachse",
    preparation: "Zubereitung",
    allPreparations: "Alle Zubereitungen",
  },
  table: { food: "Lebensmittel", class: "Klasse", tier: "Stufe", axis: "Achse" },
  food: {
    unknown: "Unbekanntes Lebensmittel",
    back: "Zurück zur Matrix",
    lede: ({ altName, preparation, source, kcal, tier, rank, size }) =>
      `${altName}. Zubereitung: ${preparation}. Quelle: ${source}. ${kcal} kcal / 100 g. Stufe ${tier} (Platz ${rank} von ${size} in der Klasse).`,
    radarTitle: (name) => `${name}: Achsenprofil`,
    eaaSummary: ({ aas, diaas, pdcaas, limiting, digestibility }) =>
      `AAS ${aas}, DIAAS ${diaas}, PDCAAS ${pdcaas}. Limitierende Aminosäure: ${limiting}. Ileale Verdaulichkeit ${digestibility}.`,
    benefitsHeading: "Nutzen",
    burdensHeading: "Last (höherer Wert = weniger Last)",
    fatsCarbsMicros: "Fette, Kohlenhydrate, Mikronährstoffe",
    microLine: ({ rae, iron, zinc, calcium, b12 }) =>
      `RAE ${rae} µg · res. Fe ${iron} mg · res. Zn ${zinc} mg · res. Ca ${calcium ?? "—"} mg · B12 ${b12 ?? "—"} µg`,
    bioactivesHeading: "Bioaktive Stoffe",
    bioactivesLede:
      "Stoffe, die die Nährstoffdatenbanken nicht angeben, nach Gehalt aus veröffentlichten Analysen erfasst. Gezeigt, nicht bewertet. „Keine Daten“ heißt, dass keine Analyse gefunden wurde, nicht null; „nicht nachgewiesen“ heißt, eine Analyse hat gesucht und nichts gefunden.",
    bioactiveColumns: { compound: "Stoff", content: "mg pro 100 g", measured: "Was gemessen wurde", source: "Quelle" },
    bioactiveStatus: { notDetected: "nicht nachgewiesen", notExpected: "nicht zu erwarten", noData: "keine Daten" },
    bioactiveRawValue: "Wert aus rohem Gewebe; Garen verändert ihn",
    bioactiveDryWeight: "aus der Trockenmasse mit dem Wassergehalt dieses Lebensmittels umgerechnet",
    bioactiveRange: (min, max) => `Spanne ${min}–${max}`,
    burden: {
      heading: "Lasten: Verarbeitung, Rückstände, Speicherung",
      lede: "Was den Nährstoffen gegenübersteht: wie stark das Lebensmittel verarbeitet ist, welche Rückstände es tragen kann und was der Körper davon behält.",
      processingHeading: "Verarbeitung",
      nova: (group, label) => `NOVA ${group}: ${label}`,
      novaMeaning: {
        1: "Ganzes Lebensmittel, eventuell gegart, getrocknet, tiefgekühlt, pasteurisiert oder ohne Zusätze fermentiert.",
        2: "Öl, Butter, Salz oder Zucker: Zutaten zum Kochen, die man nicht allein isst.",
        3: "Ein ganzes Lebensmittel, haltbar gemacht mit Salz, Zucker, Öl, Lake oder Rauch.",
        4: "Industrielle Rezeptur mit Zutaten oder Zusatzstoffen, die in keiner Haushaltsküche vorkommen, etwa Emulgatoren.",
      },
      capped: (from, to) =>
        `Hochverarbeitet: Gesamtwert von ${from} auf ${to} begrenzt, die Obergrenze von Stufe D.`,
      evidence: ({ where, classified, nova4, nova3, retrieved }) =>
        `${where}: Von ${classified} eingestuften Produkten dieser Kategorie sind ${nova4} NOVA 4 und ${nova3} NOVA 3 (Open Food Facts, abgerufen am ${retrieved}).`,
      evidenceAll: "Alle Länder",
      evidenceGermany: "Deutschland",
      additives: (products) => `Häufigste Zusatzstoffe unter den ${products} Produkten der Kategorie:`,
      retention: ({ reference, kept, details }) =>
        `Gegenüber ${reference}: ${kept} % der empfindlichen Vitamine je Gramm Trockenmasse erhalten (${details}). Die Stabilitätsachse wird mit diesem Anteil skaliert.`,
      sodium: ({ reference, from, to }) => `Natrium ${to} mg pro 100 g, gegenüber ${from} mg bei ${reference}.`,
      residuesHeading: "Rückstände und Kontaminanten",
      hormones:
        "Hormonelle Masthilfsmittel sind in der EU-Tierhaltung seit 1988 verboten (heute Richtlinie 96/22/EG). Bei tierischen Lebensmitteln bewertet die Rückstandsachse Tierarzneimittelrückstände.",
      accumulation:
        "Schwermetalle wie Cadmium, Blei und Methylquecksilber werden über Jahre in Niere, Knochen und Gehirn gespeichert; regelmäßige Aufnahme summiert sich, statt durchzulaufen.",
      storageHeading: "Vom Körper gespeichert",
      storage: (nutrients) =>
        `Dieses Lebensmittel liefert Nährstoffe, die der Körper Monate bis Jahre speichert: ${nutrients}. Speicher überbrücken Lücken zwischen Mahlzeiten, lassen aber auch Überschüsse anwachsen.`,
    },
    classColumns: "Klassenspezifische Spalten",
    weights: (classLabel, w) =>
      `Gewichte des Gesamtwerts für ${classLabel}: EAA ${w.eaa}, EFA ${w.efa}, Kohlenhydrate ${w.carb}, Mikro ${w.micro}, Ballaststoffe ${w.fibre}, Rückstände ${w.residue}, Stabilität ${w.degradation}.`,
    notes: "Hinweise",
    compareCta: "Dieses Lebensmittel vergleichen",
    preparationsHeading: "Zubereitungen",
    preparationsLede:
      "Pro 100 g verzehrfertig, jeweils aus dem eigenen Datenbankeintrag. Die %-Änderung vergleicht jede Zubereitung mit der ersten je Gramm Trockenmasse, damit aufgenommenes oder verlorenes Wasser keinen Verlust verdeckt oder vortäuscht; Energie und Wasser ändern sich pro 100 g. Die Verluste stammen aus den Analysen und Rezeptberechnungen der Datenbanken.",
    preparationsProcessing: "Verarbeitung (NOVA)",
    preparationsCompare: "Diese Zubereitungen vergleichen",
    nutrientsHeading: "Nährwerte und Herkunft jedes Werts",
    nutrientsHint:
      "Pro 100 g essbarem Anteil. „Verfügbar“ ist die geschätzte aufgenommene Menge, wo Resorptionsstudien vorliegen; %DV pro 100 kcal zählt die verfügbare Menge. „Körperspeicher“ sagt, wie lange der Körper einen Nährstoff hält. — heißt: Keine Datenbank nennt den Wert; er wird nicht als null gezählt.",
    nutrientGroups: {
      macros: "Energie und Makronährstoffe",
      diet: "Relevant für spezielle und medizinische Kostformen",
      vitamins: "Vitamine",
      minerals: "Mineralstoffe",
      aminoAcids: "Essentielle Aminosäuren",
      fattyAcids: "Fettsäuren",
    },
    dietHint:
      "Zusammensetzungswerte, auf die nierengerechte, natriumarme, laktosefreie, PKU- oder kohlenhydratberechnete Kostformen achten. Sie werden gezeigt, nicht bewertet, und sind keine Verordnung.",
    columns: {
      nutrient: "Nährstoff",
      per100g: "pro 100 g",
      available: "verfügbar",
      pctDv: "%DV / 100 kcal",
      store: "Körperspeicher",
      source: "Quelle und Herkunft",
    },
    notReported: "nicht angegeben",
    patternNote: (foodName) =>
      `Aminosäuren, die die Datenbanken nicht nennen, wurden aus dem Muster von ${foodName} ergänzt und auf das Protein dieses Lebensmittels skaliert.`,
    sourcingHeading: "Herkunft und Zubereitung",
    sourcingPreparation: "Zubereitung",
    sourcingResidues: "Was Waschen nicht richtet",
    qualityHeading: "Was die Nährwerttabelle nicht sieht",
    treatBadge: "Leckerli",
    treatNote:
      "Mehr als drei Zutaten heißt eine Rezeptur, keine Hausmannskost. Ein Essen zu Hause kann viele ganze Lebensmittel verwenden und bleibt unverarbeitet. Eine Rezeptur ist als Leckerli in Ordnung. Als regelmäßiges Essen wird der Rest dieser Matrix bedeutungslos: das ist die Leberwurst, die der Hund jeden Tag bekommt.",
    treatIngredients: ({ median, over, known }) =>
      `In dieser Produktkategorie hat die Zutatenliste im Median ${median} Einträge; ${over} von ${known} Listen gehen über drei hinaus.`,
    digestionHeading: "Verdauung",
    digestionGi: "Glykämischer Index",
    digestionLoad: (load) => `Glykämische Last ${load} pro 100 g`,
    digestionBands: { low: "niedrig", medium: "mittel", high: "hoch" },
    digestionTooLittle: (carbG) =>
      `Nicht gemessen. Verfügbare Kohlenhydrate liegen bei ${carbG} g pro 100 g, unter der Menge, mit der die Tabellen testen.`,
    digestionNoGi: "Kein Mittelwert in den ISO-Tabellen von 2021 für dieses Lebensmittel und diese Zubereitung.",
    digestionCarried: "Gemessen an einer nahen Zubereitung, nicht an dieser.",
    digestionFerment: "Fermentierbares Kohlenhydrat",
    digestionLactose: (g) =>
      `Laktose ${g} g pro 100 g, aus der Nährwertdatenbank. Sie fermentiert nur, wenn die Laktase niedrig ist.`,
    digestionNoFermentData:
      "Kein offener Grammwert für die fermentierbaren Kohlenhydrate in diesem Lebensmittel. Das ist keine Behauptung, dass keine vorhanden sind.",
    digestionSpongy: "Was sich schwer oder schwammig anfühlen kann",
    digestionMatrix: "Mahlzeit und Matrix",
    digestionMilieu: "Milieu, keine Regel natürlich gegen künstlich",
    digestionMetabolism: "Enzyme unterscheiden sich. Ein aus einem DNA-Abstrich verkaufter Stoffwechseltyp nicht.",
    digestionSources: "Quellen",
  },
  person: {
    heading: "Diese Person",
    lede: "Mengen gehören zu einer Person. Wer groß ist und schwer arbeitet, verliert mehr Natrium über den Schweiß als jemand Kleines, der den Tag sitzend verbringt. Diese Zahlen sind Schätzverfahren, keine Zufuhrempfehlung und kein Rat.",
    sex: "Geschlecht",
    female: "Weiblich",
    male: "Männlich",
    age: "Alter",
    weight: "Gewicht, kg",
    height: "Größe, cm",
    activity: "Tag",
    activities: {
      seated: "Überwiegend sitzend",
      active: "Auf den Beinen",
      heavy: "Schwere Arbeit",
    },
    sweat: "Schweiß",
    sweatLevels: { little: "Wenig", some: "Etwas", aLot: "Viel" },
    apply: "Diesen Kontext verwenden",
    clear: "Zurücksetzen",
    summary: ({ energy, protein, sodiumLow, sodiumHigh }) =>
      `Geschätzte Energie ${energy} kcal/Tag. Protein-Referenzpunkt ${protein} g/Tag. Natrium über den beschriebenen Schweiß etwa ${sodiumLow}–${sodiumHigh} mg.`,
    coverageHeading: "Gelesen für diese Person",
    coverage: ({ energyPct, proteinG, proteinRef, sodiumMg, sodiumLow, sodiumHigh }) =>
      `100 g sind ${energyPct} % der geschätzten Tagesenergie und ${proteinG} g des Protein-Referenzpunkts von ${proteinRef} g. Enthalten sind ${sodiumMg} mg Natrium; der beschriebene Schweiß trägt etwa ${sodiumLow}–${sodiumHigh} mg.`,
    notAllowance: "Die Stufe bleibt eine Eigenschaft des Lebensmittels. Die Körpergröße schreibt sie nicht um. Nur der Anteil am Tag dieser Person ändert sich.",
  },
  compare: {
    title: "Direktvergleich",
    lede:
      "Lebensmittel vergleichen, ohne Klassen zu vermischen. Eine Linsenspalte bekommt keinen B12-Wert, nur weil die Oberfläche Ausgewogenheit möchte.",
    slot: (position) => `Lebensmittel ${position}`,
    classTier: (classLabel, tier) => `${classLabel} · Stufe ${tier}`,
    eaaLine: ({ aas, diaas, limiting }) => `AAS ${aas} · DIAAS ${diaas} · limitierend ${limiting}`,
    compoundLine: ({ creatineMg, fibreG, b12Ug }) =>
      `Kreatin ${creatineMg === null ? "—" : `${creatineMg} mg`} · Ballaststoffe ${fibreG} g · B12 ${b12Ug ?? "—"} µg`,
    novaLine: (group, label) => `NOVA ${group} · ${label}`,
    bioactivesHeading: "Bioaktive Stoffe (mg pro 100 g)",
    bioactivesHint:
      "Aus veröffentlichten Analysen; nicht bewertet. * Wert aus rohem Gewebe bei gegartem Lebensmittel · — keine Analyse gefunden · n. n. untersucht, nicht nachgewiesen · ∅ in dieser Art Lebensmittel nicht zu erwarten.",
    notDetectedShort: "n. n.",
    radarHeading: "Achsenprofil",
    radarTitle: "Achsenprofil der gewählten Lebensmittel",
    microHeading: "Mikronährstoff-Vektor (%DV pro 100 kcal)",
    microHint:
      "Die Farbe sättigt bei 20 % DV pro 100 kcal, dem Niveau, das als voll gedeckt zählt. ⚠ markiert einen gespeicherten Nährstoff, dessen Menge in 100 kcal die Höchstmenge für Erwachsene überschreitet. Die Häufigkeit zählt; die Markierung senkt den Wert nicht.",
  },
  recommend: {
    title: "Empfehlungs-Engine",
    lede:
      "Empfehlungen folgen den Lücken. Sie schmeicheln dem Teller nicht. Ein rein pflanzliches Muster wird ohne Anreicherung oder Supplementierung nie als vollständig beschrieben.",
    pattern: "Muster",
    practices: "Praxis",
    suggested: "Vorgeschlagene Lebensmittel:",
    plate: "Aktueller Teller",
    plateHint: "Lebensmittel an- und abwählen, um zu sehen, welche Lücken auf diesem Teller bleiben.",
  },
  severity: { required: "erforderlich", material: "wesentlich", contextual: "kontextabhängig" },
  method: {
    title: "Methodik",
    lede: (version, lastVerified) =>
      `Jeder Wert ist eine dokumentierte Funktion aus Rohtabellen und Koeffizienten. Datensatz ${version}, zuletzt geprüft am ${lastVerified}. Die Formeln sind in \`src/scoring/\` implementiert und durch Unit-Tests abgesichert.`,
    dataHeading: "0. Datenquellen",
    dataPrimary:
      "Die Nährwerte stammen aus der deutschen Nährstoffdatenbank BLS 4.0 (Max Rubner-Institut, CC BY 4.0). Lebensmittel, die der BLS nicht führt, und Nährstoffe, die er nicht angibt (Cholin, Selen), stammen aus USDA FoodData Central SR Legacy (gemeinfrei).",
    dataScript:
      "Ein Skript (`scripts/data/build_snapshot.py`) lädt beide Datenbanken, prüft ihre SHA-256-Prüfsummen und schreibt den Datenstand, den die App ausliefert. Kein Nährwert wird von Hand eingetippt, und jeder Wert behält die Herkunftskategorie seiner Datenbank.",
    dataMissing:
      "Ein Wert, den keine Datenbank nennt, bleibt fehlend: Er wird als — angezeigt, nicht bewertet und in den Hinweisen des Lebensmittels genannt. Fehlende Aminosäuren werden aus dem Muster eines benannten ähnlichen Lebensmittels ergänzt, der Methode, die der BLS Musterberechnung nennt.",
    dataPreparation:
      "Gekochte, gedünstete, gebratene und andere Zubereitungen sind eigene Datenbankeinträge. Ihre Veränderungen, etwa Vitaminverluste oder aufgenommenes und verlorenes Wasser, stammen aus den Analysen und Rezeptberechnungen der Datenbanken, nicht aus einem Faktor dieser App.",
    frameHeading: "Nutzen gegen Last",
    frameBenefits:
      "Nutzen: essentielle Aminosäuren mit ihrer Verdaulichkeit, essentielle Fette mit dem Umwandlungsverlust von ALA, Kohlenhydratart und Ballaststoffe sowie Mikronährstoffe als die Menge, die der Körper aufnehmen kann.",
    frameBurdens:
      "Last: Rückstände von Pestiziden, Metallen und Tierarzneimitteln; Nährstoffverlust durch Lagerung, Garen und industrielle Verarbeitung; Verarbeitungsgrad und Zusatzstoffe (NOVA). Nährstoffe, die der Körper speichert, und Kontaminanten, die er anreichert, werden markiert, weil sich beide aufbauen.",
    frameComposite:
      "Der Gesamtwert gewichtet das je Lebensmittelklasse. Hochverarbeitete Produkte (NOVA 4) bleiben in Stufe D: Zugesetzte oder übrig gebliebene Nährstoffe kaufen die Verarbeitung nicht frei.",
    eaaHeading: "1. Vollständigkeit essentieller Aminosäuren + Verdaulichkeit",
    eaaPattern: "FAO-2013-Referenzmuster für Erwachsene (mg/g Protein):",
    eaaRatios:
      "ratio_i = food_i / ref_i; AAS = min(ratio_i); DIAAS = AAS × ileale Verdaulichkeit; PDCAAS = min(1, AAS) × Verdaulichkeit",
    eaaAxis:
      "EAA_axis = 100 × (0.55 × min(1, AAS) + 0.30 × Verdaulichkeit + 0.15 × clamp(protein_g / 20, 0, 1))",
    eaaNote:
      "Pflanzliche Proteine bleiben unvollständig, wenn ein Verhältnis unter 1 liegt. Die Dichte verhindert, dass Spinatprotein als Proteinlebensmittel eingestuft wird.",
    efaHeading: "2. Essentielle Fettsäuren / Glyceride",
    efaConversion: (alaToDha, alaToEpa) =>
      `effective_LC_n3 = EPA + DHA + ALA × ${alaToDha} (DHA-Äq.). Der ALA→EPA-Koeffizient ${alaToEpa} wird markiert, aber nicht als EPA-Äquivalenz verwendet.`,
    efaAxis:
      "EFA_axis = 100 × (0.45 × clamp(LC / 0.5) + 0.35 × n6/n3_score + 0.20 × glyceride_quality) + bis zu 10 Punkte für ungeradzahlige FS + CLA",
    efaFatFree:
      "Fettfreie Lebensmittel erhalten 45: kein Beitrag zu essentiellen Fettsäuren, aber kein Mangel an Fettqualität.",
    carbHeading: "3. Kohlenhydrattyp",
    carbSplit: "aktiv = Zucker + verdauliche Stärke; passiv = Ballaststoffe + resistente Stärke",
    carbCombined:
      "Kombiniert: 0.55 × passive_fraction + 0.25 × activeScore + 0.20 × (1 − sugar_fraction). Tierische Lebensmittel mit nahezu null Kohlenhydraten erhalten 70 (metabolisch ruhig, ohne Ballaststoffe).",
    microHeading: "4. Mikronährstoffdichte + Bioverfügbarkeit",
    microAbsorption: (v) =>
      `Eisenresorption: Häm ${v.heme}, Nicht-Häm Basis ${v.nonhemeBase}, mit Vitamin C ${v.nonhemeWithVitaminC}, viel Phytat ${v.nonhemeHighPhytate}. Eisen in Fleisch, Fisch und Innereien gilt zu ${v.hemeSharePct} % als Häm; Eisen aus Ei und Milch ist Nicht-Häm. Zink: tierisch ${v.zincAnimal}, phytatgebunden ${v.zincPhytate}, phytatarm pflanzlich ${v.zincLowPhytate}.`,
    microRae: (betaCarotene, otherCarotenoids) =>
      `RAE = Retinol + β-Carotin × ${betaCarotene} (1/12) + andere Carotinoide × ${otherCarotenoids} (1/24). B12-Analoga aus Algen tragen 0 bei.`,
    microDensity: (saturationPct) =>
      `Zwanzig Nährstoffe werden bewertet, jeder als % seines FDA-Tageswerts pro 100 kcal nach den obigen Anpassungen, gedeckelt bei ${saturationPct} % DV / 100 kcal = 1.0, dann gemittelt über die Nährstoffe, die die Datenbanken nennen. Die Werte stehen in \`coefficients.ts\`.`,
    microUpperLimit:
      "Ein gespeicherter Nährstoff über der Höchstmenge für Erwachsene wird markiert, nicht bestraft. Der Körper puffert und scheidet eine seltene Portion ab; täglich gegessen füllt sich der Speicher. Die Vitamin-A-Grenze gilt nur für vorgeformtes Retinol. Wie oft, entscheidet die Person, kein Plan.",
    microAvailability: (v) =>
      `Verfügbarkeit statt Etikettmenge: Eisen, Zink und Calcium zählen als aufgenommene Menge geteilt durch die Resorption, die der Tageswert schon annimmt (Eisen ${v.iron} %, Zink ${v.zinc} %, Calcium ${v.calcium} % wie aus Milch). So wird die Resorption einmal gezählt, nicht doppelt, und oxalatgebundenes Calcium aus Spinat zählt etwa ein Sechstel von Milchcalcium.`,
    calciumTable: { studied: "Untersuchtes Lebensmittel", absorption: "Aufgenommen", usedFor: "Angewendet auf" },
    calciumNote:
      "Beim Menschen gemessener Anteil des aufgenommenen Calciums bei gleicher Calciummenge (Weaver, Proulx & Heaney 1999). Mit * markierte Lebensmittel verwenden den Wert eines verwandten Lebensmittels. Lebensmittel ohne Studie zählen wie Milchcalcium.",
    microTable: { nutrient: "Nährstoff", dailyValue: "Tageswert (DV)", upperLimit: "EFSA-Höchstmenge" },
    storageHeading: "10. Speicherung im Körper",
    storageNutrients:
      "Empfehlungen zur Tageszufuhr behandeln jeden Tag gleich. Der Körper speichert aber manche Nährstoffe: Speicher überbrücken Wochen ohne Zufuhr und lassen ebenso Überschüsse anwachsen. Nährstoffe mit kleinem Vorrat, etwa Thiamin und Vitamin C, müssen regelmäßig kommen.",
    storageTable: { nutrient: "Nährstoff", store: "Gehalten für", site: "Wo" },
    storageContaminantsLead: "Kontaminanten, die der Körper anreichert (Risikobewertungen der EFSA):",
    storageContaminants: [
      "Cadmium: Niere, biologische Halbwertszeit 10–30 Jahre.",
      "Blei: Knochen, Jahrzehnte.",
      "Methylquecksilber: Gehirn und Blut, Halbwertszeit etwa zwei Monate; baut sich bei regelmäßigem Verzehr großer Raubfische auf.",
      "Dioxine und dioxinähnliche PCB: Körperfett, Halbwertszeiten von mehreren Jahren; vor allem über tierisches Fett und fetten Fisch aufgenommen.",
      "Die meisten heutigen Pestizide werden binnen Tagen ausgeschieden; das Problem ist die regelmäßige Belastung, nicht die Speicherung. Ältere Organochlorverbindungen wie DDT bleiben im Körperfett.",
    ],
    bioactivesHeading: "11. Bioaktive Stoffe",
    bioactivesNote:
      "Kreatin, Taurin, Carnosin, Anserin, Coenzym Q10, L-Carnitin, Ergothionein und Glucosinolate stehen weder im BLS noch in FoodData Central. Sie werden nach Gehalt aus den unten genannten Analysen erfasst, jeder Wert mit dem Gewebe und Zustand, der gemessen wurde. Sie werden gezeigt, nicht bewertet, damit Stoffe, die der Körper auch selbst bilden kann, essentielle Nährstoffe nicht überholen. Ergothionein wird mit dem Wassergehalt jedes Lebensmittels aus der Trockenmasse umgerechnet; ein Rohwert bei einem gegarten Lebensmittel ist markiert.",
    processingHeading: "9. Verarbeitung (NOVA)",
    processingGroups:
      "NOVA (Monteiro et al. 2019) ordnet Lebensmittel nach Verarbeitung: 1 ganze Lebensmittel, gegart oder nicht; 2 Küchenzutaten; 3 ganze Lebensmittel, haltbar gemacht mit Salz, Zucker, Öl, Lake oder Rauch; 4 industrielle Rezepturen mit Zutaten oder Zusatzstoffen, die beim Kochen zu Hause nicht vorkommen. Selbst Gekochtes bleibt Gruppe 1; Konserven und Geräuchertes sind Gruppe 3.",
    processingCap: (ceiling) =>
      `Bei NOVA-4-Lebensmitteln wird der Gesamtwert auf ${ceiling} begrenzt, die Obergrenze von Stufe D. Ihre Nährstoffe sind die Verarbeitung nicht wert, solange Nahrung nicht knapp ist.`,
    processingEvidence:
      "Wo die Gruppe vom Produkt abhängt, nutzt die Matrix Marktdaten: Open Food Facts (ODbL) zählt, wie die Produkte einer Kategorie eingestuft sind und welche Zusatzstoffe ihre Zutatenlisten nennen. Die Zahlen liegen mit Abrufdatum in `src/data/sources/processing-evidence.json`.",
    processingSulfite:
      "Schwefeldioxid und Sulfite (E220–E228), in Kartoffelprodukten verbreitet, zerstören Thiamin. Das US-Recht schließt sie deshalb für Lebensmittel aus, die als Vitamin-B1-Quelle gelten (21 CFR 182.3766).",
    hormonesNote:
      "Hormone: Hormonelle Masthilfsmittel sind in der EU-Tierhaltung seit 1988 verboten (heute Richtlinie 96/22/EG), und die deutschen Lebensmittel im BLS stammen aus diesem System. Tierarzneimittelrückstände werden als Rückstandsklasse bewertet. Natürliche Hormone in Milch und pflanzliche Isoflavone werden nicht bewertet.",
    fibreHeading: "5. Ballaststoffe / sekundäre Pflanzenstoffe",
    fibreNote: "Tierische Klassen haben die Basis 0. Das ist Zusammensetzung, keine Abwertung.",
    residueHeading: "6. Rückstands- / Kontaminationsrisiko",
    residueNote:
      "Höherer Wert = geringeres Risiko. Blattgemüse mit großer Oberfläche wird nicht wie eine Knolle bewertet. Metalle in Fisch/Algen und Tierarzneimittelrückstände sind vollwertige Faktoren, keine Fußnoten.",
    degradationHeading: "7. Stabilität und Nährstoffverlust",
    degradationNote:
      "Boni: gegart +0.08, fermentiert +0.22, getrocknet +0.28. Frisches Blattgemüse bleibt labil. Ein industriell verarbeitetes Lebensmittel (NOVA 3–4) wird mit dem Anteil an Vitamin C, Thiamin, Folat und B6 je Gramm Trockenmasse skaliert, den es gegenüber der selbst zubereiteten Form desselben Lebensmittels behalten hat. Eine lange Haltbarkeit, erkauft mit zerstörten Vitaminen, zählt nicht als Stabilität.",
    compositeHeading: "8. Gesamtwert und Stufen",
    compositeNote:
      "Die Gewichte sind klassenspezifisch und summieren sich zu 1. Ballaststoffe werden bei tierischen Klassen geringer gewichtet, weil ihr Fehlen erwartet wird — die Ballaststoffachse selbst zeigt trotzdem 0.",
  },
  limits: {
    title: "Was dieses System nicht behauptet",
    lede:
      "Ehrlichkeit ist das Produkt. Die Matrix misst biochemische Achsen. Sie verkauft keine Diät, keinen Stamm und keine Persönlichkeit.",
    nonClaimsHeading: "Nicht-Behauptungen",
    nonClaims: [
      "Es behauptet nicht, dass pflanzliche und tierische Proteine gleichwertig sind.",
      "Es behauptet nicht, dass Nicht-Hämeisen, phytatgebundenes Zink oder Carotinoid-A mit Hämeisen, tierischem Zink oder Retinol gleichzusetzen sind.",
      "Es behauptet nicht, dass ALA gleich EPA/DHA ist.",
      "Es behauptet nicht, dass B12-Analoga aus Algen Vitamin B12 sind.",
      "Es behauptet nicht, dass eine rein pflanzliche Ernährung ohne Anreicherung oder Supplementierung vollständig ist.",
      "Es behauptet nicht, dass fehlende Ballaststoffe Fleisch „ungesund“ machen oder dass Ballaststoffe eine Pflanze vollständig machen.",
      "Es behandelt Blattsalate, Hülsenfrüchte, Sprossen, Kraut, Pilze und Algen nicht als eine Klasse.",
      "Es behandelt Muskelfleisch, Innereien, Eier, Milchprodukte und fermentierte tierische Lebensmittel nicht als eine Klasse.",
      "Es stellt keine medizinischen Diagnosen, keine personalisierten Verordnungen und keine Blutwert-Interpretationen (das Datenmodell erlaubt spätere Erweiterungen; sie sind nicht vorhanden).",
      "Es behandelt Rückstandswerte nicht als Laborzertifikate für einen bestimmten Hof oder eine bestimmte Charge.",
      "Es verschweigt keine Agrarchemikalien, Metalle oder Tierarzneimittelrückstände.",
      "Es erzeugt keinen Blackbox-„KI-Ernährungsscore“.",
      "Es stellt die Matrix nicht hinter eine Bezahlschranke.",
      "Es füllt keinen Wert, den keine Datenbank nennt, mit null auf und verschweigt nicht, aus welcher Datenbank ein Wert stammt.",
      "Es gibt einen von einem ähnlichen Lebensmittel übernommenen Wert nicht als gemessen aus.",
      "Es zählt die Menge auf dem Etikett nicht als die Menge, die der Körper aufnimmt.",
      "Es lässt Nährstoffe ein hochverarbeitetes Produkt nicht aus Stufe D heben.",
      "Es gibt einen in einem Gewebe oder einer Zubereitung gemessenen Stoffgehalt nicht als in einem anderen gemessen aus.",
    ],
    willDoHeading: "Was es tut",
    willDo: [
      "Lebensmittel innerhalb einer Klasse auf dokumentierten Achsen einordnen.",
      "Die limitierende Aminosäure, Umrechnungsfaktoren und Resorptionskoeffizienten zeigen.",
      "Für jeden Nährwert zeigen, aus welcher Datenbank er stammt und wie diese ihn ermittelt hat.",
      "Zeigen, wie die Zubereitung ein Lebensmittel verändert, anhand der gegarten Einträge der Datenbanken.",
      "Zeigen, was industrielle Verarbeitung kostet: Nährstoffverlust je Gramm Trockenmasse, Salz, Verarbeitungsgrad und typische Zusatzstoffe.",
      "Kreatin, Taurin, Carnosin, Coenzym Q10, Ergothionein und ähnliche Stoffe nach gemessenem Gehalt erfassen, mit der Studie hinter jedem Wert.",
      "Zeigen, welche Nährstoffe der Körper speichert und welche Kontaminanten er anreichert.",
      "Den Datensatz versionieren und das Datum der letzten Prüfung anzeigen.",
      "Die Matrix als CSV und JSON exportieren.",
      "Erforderliche Lücken rein pflanzlicher Muster klar benennen.",
    ],
  },
  source: {
    summary: "Quelle & Methode",
    dataset: (version, lastVerified) =>
      `Datensatz ${version}, zuletzt geprüft am ${lastVerified}. Die Nährwerte werden per Skript aus den unten genannten Datenbanken übernommen; die Bewertungen berechnet der Browser aus diesen Werten und dokumentierten Koeffizienten. Es gibt kein Blackbox-Modell.`,
    updatePath:
      "Neues Lebensmittel: in src/data/sources/manifest.json seinem BLS- oder FDC-Eintrag zuordnen, scripts/data/build_snapshot.py ausführen, die kuratierten Angaben in src/data/foods/*.ts ergänzen, Tests erneut ausführen.",
    general: [
      "BLS 4.0, Max Rubner-Institut (CC BY 4.0): primäre Nährwertquelle",
      "USDA FoodData Central SR Legacy (gemeinfrei): im BLS fehlende Lebensmittel, Cholin, Selen",
      "FAO-2013-Aminosäure-Referenzmuster für Erwachsene + DIAAS/PDCAAS-Literatur",
      "IOM/EFSA-RAE-Umrechnung (β-Carotin /12, andere Carotinoide /24)",
      "FDA-Tageswerte; tolerierbare EFSA-Höchstmengen",
      "Eisen-/Zink-Resorptionsmittelwerte aus Bioverfügbarkeits-Metaanalysen",
      "Calciumresorption je Lebensmittel: Weaver, Proulx & Heaney 1999",
      "Gehalte bioaktiver Stoffe: veröffentlichte Analysen, je Wert zitiert",
      "Open Food Facts (ODbL): NOVA-Gruppen und Zusatzstoffe je Produktkategorie",
      "EU/US-Rückstandshöchstgehalte (MRL) als Risikoklasse, kein Laborzertifikat",
    ],
    link: "Link",
    entriesHeading: "Datenbankeinträge",
    primary: "primär",
    matchSame: "gleiches Lebensmittel, gleiche Zubereitung",
    matchSimilar: "ähnliches Lebensmittel als Ersatz",
    fills: (nutrients) => `ergänzt: ${nutrients}`,
    datasetsHeading: "Datenbanken und Lizenzen",
    curatedHeading: "Kuratierte Literatur",
    cardLine: ({ aas, diaas, pdcaas, limiting, rae, iron }) =>
      `AAS ${aas} · DIAAS ${diaas} · PDCAAS ${pdcaas} · limitierend ${limiting} · RAE ${rae} µg · resorbierbares Fe ${iron} mg`,
  },
  classes: {
    leafy_salad: "Blattgemüse / Salate",
    legumes: "Hülsenfrüchte / Bohnen",
    sprouts: "Sprossen",
    cruciferous_fresh: "Kreuzblütler — frisch",
    cruciferous_fermented: "Kreuzblütler — fermentiert (Kraut)",
    mushrooms: "Pilze",
    algae: "Algen / Seetang",
    roots_tubers: "Wurzeln & Knollen",
    other_vegetables: "Sonstiges Gemüse",
    muscle_ruminant: "Muskelfleisch — Wiederkäuer",
    muscle_monogastric: "Muskelfleisch — Monogastrier",
    muscle_poultry: "Muskelfleisch — Geflügel",
    muscle_fish: "Muskelfleisch — Fisch",
    organs: "Innereien",
    eggs: "Eier",
    dairy: "Milchprodukte",
    fermented_animal: "Fermentiert — tierisch",
  },
  axes: {
    eaa: "EAA + Verdaulichkeit",
    efa: "EFA / Glyceride",
    carb: "Kohlenhydrattyp",
    micro: "Mikros + Bioverfügbarkeit",
    fibre: "Ballaststoffe / Pflanzenstoffe",
    residue: "Rückstände / Kontaminanten",
    degradation: "Stabilität / Nährstoffverlust",
    composite: "Gesamtwert",
  },
  axesShort: {
    eaa: "EAA",
    efa: "EFA",
    carb: "KH",
    micro: "Mikro",
    fibre: "Ballast",
    residue: "Rückst.",
    degradation: "Stabil",
    composite: "Σ",
  },
  patterns: {
    "plant-only": "Rein pflanzlich",
    "animal-inclusive": "Mit tierischen Lebensmitteln",
    hybrid: "Hybrid",
  },
  kingdoms: { plant: "Pflanzlich", animal: "Tierisch" },
  tiers: {
    S: "S — klassenführende Effizienz",
    A: "A — stark innerhalb der Klasse",
    B: "B — Klassenmittelfeld",
    C: "C — schwach auf gewichteten Achsen",
    D: "D — schwach nach Klassengewichtung",
  },
  extras: {
    folateDensity: "Folatdichte",
    vitaminKDensity: "Vitamin-K-Dichte",
    nitrateProxy: "Nitrat-Proxy",
    surfaceResidue: "Oberflächenrückstände",
    lysineAdequacy: "Lysin vs. FAO",
    saaAdequacy: "SAA vs. FAO",
    phytatePenalty: "Phytat (höher = besser)",
    resistantStarch: "Resistente Stärke",
    livingTissueLability: "Labilität lebenden Gewebes",
    pathogenProxy: "Keimrisiko-Proxy (Sprossen)",
    glucosinolates: "Glucosinolate (gemessen)",
    goitrogenProxy: "Goitrogen-Hinweis",
    vitaminCRetention: "Vitamin C",
    organicAcidStability: "Stabilität durch organische Säuren",
    sodiumNote: "Natrium (höher = weniger Na)",
    ergothioneine: "Ergothionein (gemessen)",
    vitaminDPotential: "Vitamin-D-Potenzial",
    chitinDigestPenalty: "Chitin-Verdaulichkeit",
    iodineDensity: "Joddichte",
    preformedN3: "Vorgeformte n-3",
    inactiveB12Flag: "Aktives B12 (0 bei Analoga)",
    metalLoad: "Metallbelastung (höher = sauberer)",
    starchActivity: "Geringe Stärkeaktivität",
    carotenoidOnlyA: "Retinol vs. Carotinoid-A",
    vitaminCDensity: "Vitamin-C-Dichte",
    waterWeight: "Geringe Energiedichte",
    eaaCompleteness: "EAA-Vollständigkeit",
    oddChainCla: "Ungeradzahlige FS + CLA",
    creatine: "Kreatin",
    hemeIron: "Hämeisen",
    n6Load: "Geringe n-6-Last",
    leanness: "Magerkeit",
    epaDha: "EPA+DHA",
    iodineSelenium: "Jod + Selen",
    retinolDensity: "Retinoldichte",
    b12Density: "B12-Dichte",
    copperDensity: "Kupfer",
    cholineDensity: "Cholin",
    yolkFatQuality: "Eigelb-Fettqualität",
    calciumDensity: "Calciumdichte",
    lactoseLoad: "Wenig Laktose",
    fermentationStability: "Fermentationsstabilität",
  },
};
