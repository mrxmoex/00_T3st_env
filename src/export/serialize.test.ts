import { describe, expect, it } from "vitest";
import { FOODS } from "../data/catalog";
import { MANIFEST } from "../data/manifest";
import { scoreCatalog } from "../scoring";
import { toCsv, toExportRows, toJsonPayload } from "./serialize";

const scores = scoreCatalog(FOODS);

describe("export", () => {
  it("emits one row per food with versions", () => {
    const rows = toExportRows(FOODS, scores);
    expect(rows).toHaveLength(FOODS.length);
    expect(rows[0]?.formulaVersion).toBe(MANIFEST.formulaVersion);
    expect(rows[0]?.dataVersion).toBe(MANIFEST.dataVersion);
  });

  it("writes CSV and JSON that stay auditable", () => {
    const csv = toCsv(FOODS, scores);
    expect(csv.startsWith("id,name,kingdom,foodClass")).toBe(true);
    expect(csv.split("\n").length).toBe(FOODS.length + 1);
    const json = JSON.parse(toJsonPayload(FOODS, scores)) as {
      manifest: { formulaVersion: string };
      foods: unknown[];
    };
    expect(json.manifest.formulaVersion).toBe(MANIFEST.formulaVersion);
    expect(json.foods).toHaveLength(FOODS.length);
  });
});
