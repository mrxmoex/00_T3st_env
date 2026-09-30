import type { LocalizedText } from "../i18n/locale";
import { isPlantClass, type FoodRecord } from "../scoring/types";

/**
 * Preparation and sourcing notes. They describe what changes a nutrient and what a
 * wash cannot remove. They are not a buying guide and not a claim about one shop.
 */
export function preparationIdeas(food: FoodRecord): LocalizedText[] {
  switch (food.class) {
    case "leafy_salad":
      return [
        {
          en: "A short steam keeps more folate and vitamin C than a long boil, because boiling leaches them into the water. The preparation table shows this food's own database entries.",
          de: "Kurzes Dämpfen hält mehr Folat und Vitamin C als langes Kochen, weil Kochen sie ins Wasser zieht. Die Zubereitungstabelle zeigt die eigenen Datenbankeinträge dieses Lebensmittels.",
        },
      ];
    case "cruciferous_fresh":
    case "cruciferous_fermented":
      return [
        {
          en: "Chopping and waiting lets the plant enzyme myrosinase turn glucosinolates into isothiocyanates. Long boiling destroys that enzyme, so the precursor is still listed while the conversion is gone.",
          de: "Schneiden und Warten lässt das Pflanzenenzym Myrosinase Glucosinolate in Isothiocyanate umwandeln. Langes Kochen zerstört dieses Enzym: die Vorstufe steht noch in der Tabelle, die Umwandlung ist weg.",
        },
      ];
    case "roots_tubers":
      return [
        {
          en: "Steaming or baking a whole tuber keeps more potassium and vitamin C than peeling and boiling, which leach them into the water. Cooling a cooked potato raises resistant starch. Canning and drying do something else again: see the preparations.",
          de: "Dämpfen oder Backen einer ganzen Knolle hält mehr Kalium und Vitamin C als Schälen und Kochen, das sie ins Wasser zieht. Abkühlen einer gegarten Kartoffel hebt die resistente Stärke. Konservieren und Trocknen machen noch einmal etwas anderes: siehe die Zubereitungen.",
        },
      ];
    case "legumes":
      return [
        {
          en: "Boiling is what makes legumes edible. It does not remove phytate, so iron and zinc from them stay less absorbable than the same amounts from meat.",
          de: "Kochen macht Hülsenfrüchte erst essbar. Es entfernt Phytat nicht, deshalb bleiben Eisen und Zink daraus schlechter aufnehmbar als dieselbe Menge aus Fleisch.",
        },
      ];
    case "muscle_fish":
      return [
        {
          en: "Heat converts some creatine to creatinine and drives water-soluble compounds into the cooking liquid. The fat-soluble long-chain omega-3 stays in the flesh if the liquid is not discarded.",
          de: "Hitze wandelt einen Teil des Kreatins in Kreatinin um und treibt wasserlösliche Stoffe in die Garflüssigkeit. Das fettlösliche langkettige Omega-3 bleibt im Fleisch, wenn die Flüssigkeit nicht weggegossen wird.",
        },
      ];
    case "sprouts":
    case "mushrooms":
    case "algae":
    case "other_vegetables":
    case "muscle_ruminant":
    case "muscle_monogastric":
    case "muscle_poultry":
    case "organs":
    case "eggs":
    case "dairy":
    case "fermented_animal":
      return [];
    default: {
      const _exhaustive: never = food.class;
      return _exhaustive;
    }
  }
}

export function residueReality(food: FoodRecord): LocalizedText[] {
  if (!isPlantClass(food.class)) {
    return [
      {
        en: "The nutrient row does not say how the animal was kept. Hormonal growth promoters are banned in EU livestock farming. Veterinary drug residues are a class estimate here, not a test of this piece of meat.",
        de: "Die Nährwertzeile sagt nicht, wie das Tier gehalten wurde. Hormonelle Masthilfsmittel sind in der EU-Tierhaltung verboten. Tierarzneimittelrückstände sind hier eine Klassenschätzung, keine Untersuchung dieses Stücks Fleisch.",
      },
    ];
  }
  const systemic = food.residue.systemicPesticideLikelihood >= 0.35;
  const contact = food.residue.contactPesticideLikelihood >= 0.35 || food.residue.surfaceAreaClass === "high";
  const notes: LocalizedText[] = [];
  if (contact) {
    notes.push({
      en: "Contact residues sit on the surface and bind to the waxy cuticle. Washing and peeling remove part of them. A large surface, as on leaf greens, holds more than a tuber.",
      de: "Kontaktrückstände sitzen auf der Oberfläche und binden an die Wachsschicht. Waschen und Schälen entfernen einen Teil davon. Eine große Oberfläche, wie bei Blattgemüse, hält mehr als eine Knolle.",
    });
  }
  if (systemic) {
    notes.push({
      en: "Systemic plant-protection chemicals move into the tissue with the sap. Washing does not take them back out, and peeling only helps for what stayed in the skin.",
      de: "Systemische Pflanzenschutzmittel wandern mit dem Saft ins Gewebe. Waschen holt sie nicht wieder heraus, und Schälen hilft nur bei dem, was in der Schale geblieben ist.",
    });
  }
  notes.push({
    en: "In the EU 2023 monitoring, 80 % of organic samples had no quantifiable pesticide residues, 19 % were at or below the limit, and 0.9 % were above it (EFSA 2025). Organic is not residue-free: copper, which organic farming may use, was the most frequent finding. The same report found higher quantification rates in conventional food. This score is a class estimate, not a certificate for one bunch.",
    de: "In der EU-Überwachung 2023 hatten 80 % der Bio-Proben keine bestimmbaren Pestizidrückstände, 19 % lagen auf oder unter dem Grenzwert und 0,9 % darüber (EFSA 2025). Bio ist nicht rückstandsfrei: Kupfer, das der Biolandbau verwenden darf, war der häufigste Fund. Dieselbe Untersuchung fand höhere Bestimmungsraten bei konventioneller Ware. Dieser Wert ist eine Klassenschätzung, kein Zertifikat für ein Bund.",
  });
  return notes;
}

/** What a composition table cannot see. Only the potato comparison has a concrete pair of entries. */
export function qualityBeyondTable(food: FoodRecord): LocalizedText | null {
  if (food.group !== "potato" && food.group !== "potato_mash") return null;
  return {
    en: "The table measures amounts, not the condition of the molecules. A potato steamed at home from a whole tuber, a potato boiled and drained, and an industrially dried mash can share a name and not share what digestion gets: leaching, sulfites, salt, and additives change the delivery. Breeding, soil, storage, and light also move the composition, including glycoalkaloids in greened or damaged potatoes, and none of that is in one database average.",
    de: "Die Tabelle misst Mengen, nicht den Zustand der Moleküle. Eine zu Hause aus einer ganzen Knolle gedämpfte Kartoffel, eine gekochte und abgegossene und ein industriell getrocknetes Püree können denselben Namen tragen und trotzdem nicht dasselbe an die Verdauung liefern: Auslaugen, Sulfite, Salz und Zusatzstoffe verändern die Übergabe. Züchtung, Boden, Lagerung und Licht verschieben die Zusammensetzung ebenfalls, darunter die Glykoalkaloide in ergrünten oder beschädigten Kartoffeln, und nichts davon steckt in einem Datenbankmittelwert.",
  };
}
