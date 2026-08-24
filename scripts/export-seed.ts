import { writeFileSync } from "node:fs";
import { FOODS } from "../src/data/foods";
import { SOURCES } from "../src/data/sources";
import { INVARIANTS } from "../src/data/invariants";
import { CATALOG } from "../src/lib/catalog";

const payload = {
  generatedFrom: "src/data/* + src/lib/scoring.ts",
  foods: FOODS,
  sources: SOURCES,
  invariants: INVARIANTS,
  evaluated: CATALOG.map((row) => ({
    id: row.food.id,
    category: row.food.category,
    combined: Number(row.combined.toFixed(2)),
    globalTier: row.globalTier,
    classTier: row.classTier,
    completenessMultiplier: Number(row.completenessMultiplier.toFixed(3)),
    bioavailabilityMultiplier: Number(row.bioavailabilityMultiplier.toFixed(3)),
    antinutrientPenalty: Number(row.antinutrientPenalty.toFixed(3)),
    residuePenalty: Number(row.residuePenalty.toFixed(3)),
    axes: Object.fromEntries(
      Object.values(row.axes).map((axis) => [
        axis.axis,
        { raw: Number(axis.raw.toFixed(1)), adjusted: Number(axis.adjusted.toFixed(1)) },
      ]),
    ),
  })),
};

writeFileSync("public/data/seed.json", `${JSON.stringify(payload, null, 2)}\n`);
console.log(`wrote public/data/seed.json (${FOODS.length} foods, ${SOURCES.length} sources)`);
