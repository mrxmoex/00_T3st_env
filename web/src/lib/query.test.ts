import { describe, expect, it } from "vitest";
import { sourceTooltip } from "@/data/sources";
import { filterCatalog, getFood, sortCatalog } from "@/lib/catalog";
import {
  compareHref,
  matrixHref,
  parseCompareQuery,
  parseMatrixQuery,
} from "@/lib/query";

describe("matrix query parsing", () => {
  it("keeps plant classes as separate filters", () => {
    const query = parseMatrixQuery({ klasse: ["legumes", "sprouts"] });
    expect(query.categories).toEqual(["legumes", "sprouts"]);
    expect(query.categories).not.toContain("leafy_greens");
  });

  it("ignores collapsed vegetable aliases", () => {
    const query = parseMatrixQuery({ klasse: "vegetable,legumes" });
    expect(query.categories).toEqual(["legumes"]);
  });

  it("round-trips search, sort, and cereal reference", () => {
    const href = matrixHref({
      q: "leber",
      categories: ["organs"],
      includeReference: true,
      sort: "protein_quality",
      selectedId: "beef-liver",
      lang: "en",
    });
    expect(href).toContain("q=leber");
    expect(href).toContain("klasse=organs");
    expect(href).toContain("ref=1");
    expect(href).toContain("achse=protein_quality");
    expect(href).toContain("lang=en");
    const parsed = parseMatrixQuery({
      q: "leber",
      klasse: "organs",
      ref: "1",
      achse: "protein_quality",
      id: "beef-liver",
      lang: "en",
    });
    expect(parsed.sort).toBe("protein_quality");
    expect(parsed.includeReference).toBe(true);
  });
});

describe("catalog filters used by the URL matrix", () => {
  it("filters legumes without collapsing other plant classes", () => {
    const rows = filterCatalog({ categories: ["legumes"] });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((item) => item.food.category === "legumes")).toBe(true);
    expect(rows.some((item) => item.food.id === "lentils-cooked")).toBe(true);
    expect(rows.some((item) => item.food.category === "leafy_greens")).toBe(false);
  });

  it("searches liver across locales", () => {
    const rows = filterCatalog({ query: "leber" });
    expect(rows.every((item) => /leber|liver/i.test(item.food.names.de + item.food.names.en + item.food.id))).toBe(true);
    expect(rows.some((item) => item.food.id === "beef-liver")).toBe(true);
  });

  it("sorts protein quality with complete animal proteins first", () => {
    const rows = sortCatalog(filterCatalog({}), "protein_quality");
    expect(rows[0]?.food.category).toMatch(/eggs|dairy|muscle_meat|organs|fish_seafood/);
    const lentilIndex = rows.findIndex((item) => item.food.id === "lentils-cooked");
    const milkIndex = rows.findIndex((item) => item.food.id === "milk-whole");
    expect(milkIndex).toBeGreaterThanOrEqual(0);
    expect(lentilIndex).toBeGreaterThan(milkIndex);
  });

  it("hides cereal reference unless asked", () => {
    expect(filterCatalog({}).some((item) => item.food.id === "whole-wheat-bread")).toBe(false);
    expect(
      filterCatalog({ includeReference: true }).some((item) => item.food.id === "whole-wheat-bread"),
    ).toBe(true);
  });
});

describe("source tooltips", () => {
  it("attaches organization and year to every axis score", () => {
    const liver = getFood("beef-liver");
    for (const axis of liver.axes) {
      const tip = sourceTooltip(axis.sourceIds);
      expect(tip).toMatch(/20\d{2}/);
      expect(tip.length).toBeGreaterThan(8);
    }
  });
});

describe("compare query", () => {
  it("defaults to the liver vs lentil trade-off", () => {
    const query = parseCompareQuery({});
    expect(query.a).toBe("beef-liver");
    expect(query.b).toBe("lentils-cooked");
    expect(compareHref({ a: "beef-liver", b: "lentils-cooked", lang: "de" })).toBe(
      "/compare?a=beef-liver&b=lentils-cooked&lang=de",
    );
  });
});
