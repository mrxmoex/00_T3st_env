import { describe, expect, it } from "vitest";
import { filterCatalog, getFood, sortCatalog } from "@/lib/catalog";
import { AXIS_LABELS, CATEGORY_LABELS, UI, t } from "@/lib/i18n";

describe("locale surface", () => {
  it("exposes German and English labels for every class and axis", () => {
    expect(t(UI.title, "de")).toBe("Du bist was du isst");
    expect(t(UI.compare, "en")).toBe("Compare");
    expect(t(CATEGORY_LABELS.legumes, "de")).toBe("Hülsenfrüchte");
    expect(t(CATEGORY_LABELS.leafy_greens, "de")).toBe("Blatt / Salat");
    expect(t(AXIS_LABELS.protein_quality, "en")).toBe("Protein quality");
    expect(t(UI.emptyS, "en")).toMatch(/S stays empty/);
  });
});

describe("visible trade-offs", () => {
  it("keeps liver protein/bioavailability above lentils and fibre the other way", () => {
    const liver = getFood("beef-liver");
    const lentils = getFood("lentils-cooked");
    const liverProtein = liver.axes.find((axis) => axis.axis === "protein_quality")?.score ?? 0;
    const lentilProtein = lentils.axes.find((axis) => axis.axis === "protein_quality")?.score ?? 0;
    const liverBio = liver.axes.find((axis) => axis.axis === "bioavailability")?.score ?? 0;
    const lentilBio = lentils.axes.find((axis) => axis.axis === "bioavailability")?.score ?? 0;
    const liverCarb = liver.axes.find((axis) => axis.axis === "carbohydrate_quality")?.score ?? 0;
    const lentilCarb = lentils.axes.find((axis) => axis.axis === "carbohydrate_quality")?.score ?? 0;
    expect(liverProtein).toBeGreaterThan(lentilProtein);
    expect(liverBio).toBeGreaterThan(lentilBio);
    expect(lentilCarb).toBeGreaterThan(liverCarb);
  });

  it("does not award an overall S-tier because no food wins every axis", () => {
    const rows = sortCatalog(filterCatalog({ includeReference: true }), "composite");
    expect(rows.every((item) => item.tierOverall !== "S")).toBe(true);
  });
});

describe("live HTML matrix", () => {
  it("serves filterable SSR HTML when a server is running", async () => {
    const base = process.env.SMOKE_URL ?? "http://127.0.0.1:3000";
    let home: Response;
    try {
      home = await fetch(base, { signal: AbortSignal.timeout(2000) });
    } catch {
      return;
    }
    if (!home.ok) {
      return;
    }

    const legumes = await (await fetch(`${base}/?klasse=legumes`)).text();
    expect(legumes).toContain("data-category=\"legumes\"");
    expect(legumes).toContain("Linsen");
    expect(legumes).not.toContain("data-food-id=\"spinach-raw\"");
    expect(legumes).toContain("data-radar=\"1\"");

    const search = await (await fetch(`${base}/?q=leber`)).text();
    expect(search).toContain("Rinderleber");
    expect(search).toContain("data-food-id=\"beef-liver\"");
    expect(search).not.toContain("data-food-id=\"lentils-cooked\"");

    const english = await (await fetch(`${base}/?lang=en`)).text();
    expect(english).toContain("Compare");
    expect(english).toContain("Nutrient density");
    expect(english).toContain('lang="en"');

    const compare = await (
      await fetch(`${base}/compare?a=beef-liver&b=lentils-cooked`)
    ).text();
    expect(compare).toContain("Rinderleber");
    expect(compare).toContain("Linsen");
    expect(compare).toContain("data-radar=\"1\"");
    expect(compare).toContain("data-axis=\"protein_quality\"");
    expect(compare).toContain("data-axis=\"bioavailability\"");
    expect(compare).toContain("data-axis=\"carbohydrate_quality\"");
  });
});
