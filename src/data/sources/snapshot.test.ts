import { describe, expect, it } from "vitest";
import { FOODS, foodsInGroup, requireFood } from "../catalog";
import type { Preparation } from "../../scoring/types";
import manifest from "./manifest.json";
import { NUTRIENT_KEYS, PROVENANCE_CATEGORIES, SNAPSHOT } from "./snapshot";

interface ManifestItem {
  id: string;
  bls?: string;
  fdc?: string;
  fdcMatch?: "same" | "similar";
  aaPattern?: string;
}

const ITEMS = manifest.foods as ManifestItem[];

/** Words the primary database entry's name must contain for each preparation. */
const PREPARATION_WORDS: Partial<Record<Preparation, readonly string[]>> = {
  raw: ["roh", "raw"],
  boiled: ["gekocht", "boiled"],
  steamed: ["gedämpft", "steamed"],
  stewed: ["gedünstet", "stewed"],
  fried: ["gebraten", "fried"],
  roasted: ["Ofen", "geröstet", "roasted"],
  baked: ["gebacken", "baked"],
  grilled: ["gegrillt", "grilled"],
  braised: ["geschmort", "braised"],
  poached: ["pochiert", "poached"],
  smoked: ["geräuchert", "smoked"],
  dried: ["getrocknet", "dried"],
  canned: ["Konserve", "canned"],
  mashed: ["püree", "mashed"],
  instant: ["Instant", "instant"],
};

describe("manifest, snapshot, and catalog", () => {
  it("map one-to-one", () => {
    const manifestIds = ITEMS.map((item) => item.id).sort();
    expect(Object.keys(SNAPSHOT.foods).sort()).toEqual(manifestIds);
    expect(FOODS.map((food) => food.id).sort()).toEqual(manifestIds);
  });

  it("uses BLS as the primary entry whenever the manifest lists one", () => {
    for (const item of ITEMS) {
      const [primary] = requireFood(item.id).sourceEntries;
      expect(primary?.db, item.id).toBe(item.bls ? "BLS" : "FDC");
      expect(primary?.code, item.id).toBe(item.bls ?? item.fdc);
    }
  });

  it("stores every nutrient key with a known provenance category", () => {
    for (const [id, food] of Object.entries(SNAPSHOT.foods)) {
      expect(Object.keys(food.values).sort(), id).toEqual([...NUTRIENT_KEYS].sort());
      for (const value of Object.values(food.values)) {
        if (value === null) continue;
        expect(PROVENANCE_CATEGORIES, id).toContain(value[1]);
        expect(Number.isFinite(value[0]), id).toBe(true);
      }
    }
  });
});

describe("imported values", () => {
  it("stay in plausible unit ranges", () => {
    for (const food of FOODS) {
      const n = food.nutrients;
      expect(n.copper ?? 0, `${food.id} copper mg`).toBeLessThan(20);
      expect(n.vitaminB6 ?? 0, `${food.id} B6 mg`).toBeLessThan(5);
      expect(n.protein ?? 0, `${food.id} protein g`).toBeLessThanOrEqual(100);
      expect(n.water ?? 0, `${food.id} water g`).toBeLessThanOrEqual(100);
    }
  });

  it("roughly agree with the energy of their macronutrients", () => {
    for (const food of FOODS) {
      const n = food.nutrients;
      const estimate = 4 * (n.protein ?? 0) + 9 * (n.fat ?? 0) + 4 * (n.carbsAvailable ?? 0) + 2 * (n.fibre ?? 0);
      expect(Math.abs(estimate - food.kcalPer100g) / food.kcalPer100g, food.id).toBeLessThan(0.4);
    }
  });

  it("come from an entry whose name matches the food's preparation", () => {
    for (const food of FOODS) {
      const words = PREPARATION_WORDS[food.preparation];
      if (!words) continue;
      const [primary] = food.sourceEntries;
      const name = `${primary?.name.de ?? ""} ${primary?.name.en ?? ""}`;
      expect(
        words.some((word) => name.includes(word)),
        `${food.id} (${food.preparation}) vs "${name}"`,
      ).toBe(true);
    }
  });

  it("carries the databases' cooking losses through", () => {
    const spinachRaw = requireFood("spinach_raw").nutrients;
    const spinachBoiled = requireFood("spinach_boiled").nutrients;
    expect(spinachBoiled.vitaminC ?? 0).toBeLessThan(spinachRaw.vitaminC ?? 0);
    expect(spinachBoiled.folate ?? 0).toBeLessThan(spinachRaw.folate ?? 0);
    const broccoliRaw = requireFood("broccoli_raw").nutrients;
    const broccoliBoiled = requireFood("broccoli_boiled").nutrients;
    expect(broccoliBoiled.folate ?? 0).toBeLessThan(broccoliRaw.folate ?? 0);
  });
});

describe("preparation groups", () => {
  it("keep every preparation of a food in one class", () => {
    const groups = new Set(FOODS.map((food) => food.group));
    for (const group of groups) {
      const classes = new Set(foodsInGroup(group).map((food) => food.class));
      expect(classes.size, group).toBe(1);
    }
  });

  it("digest raw egg protein far worse than cooked", () => {
    expect(requireFood("egg_raw").ilealDigestibility).toBeLessThan(requireFood("egg_boiled").ilealDigestibility * 0.7);
  });
});
