import { writeFileSync } from "node:fs";
import { FOODS, DATA_META } from "../src/data/catalog";
import { matrixToCsv, toMatrixRows } from "../src/export/matrixExport";
import { recommend } from "../src/recommend/engine";
import { scoreCatalog } from "../src/scoring/scoreFood";

const cards = scoreCatalog(FOODS);
const rec = recommend({ pattern: "plant-only", selectedIds: [] });
writeFileSync(
  "/opt/cursor/artifacts/matrix_export.csv",
  matrixToCsv(cards),
);
writeFileSync(
  "/opt/cursor/artifacts/matrix_scores.json",
  JSON.stringify(
    {
      meta: DATA_META,
      plantOnlyHeadline: rec.headline,
      requiredGaps: rec.gaps.filter((gap) => gap.severity === "required").map((gap) => gap.id),
      rows: toMatrixRows(cards),
    },
    null,
    2,
  ),
);
process.stdout.write(`dumped ${cards.length} rows\n`);
