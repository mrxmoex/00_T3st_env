import { afterEach, describe, expect, it, vi } from "vitest";
import { BODY_STORAGE, calciumStudyRows } from "../data/absorption";
import { BIOACTIVE_COMPOUNDS, bioactiveValue } from "../data/bioactives";
import { FOODS } from "../data/catalog";
import { recommend } from "../recommend/engine";
import { classExtraColumns } from "../scoring/extras";
import { scoreCatalog } from "../scoring/scoreFood";
import { DIETARY_PATTERNS, FOOD_CLASSES, kingdomOf } from "../scoring/types";
import { de } from "./de";
import { en } from "./en";
import {
  ADDITIVE_LABELS,
  BIOACTIVE_LABELS,
  BIOACTIVE_ROLES,
  BODY_STORE_LABELS,
  MICRO_LABELS,
  NOVA_LABELS,
  NUTRIENT_LABELS,
  PREPARATION_LABELS,
  PROVENANCE_LABELS,
} from "./labels";
import { LOCALES, isLocale, readLocale, type Locale, type LocalizedText } from "./locale";
import type { Messages } from "./messages";

const MESSAGES: Record<Locale, Messages> = { de, en };

/** Short strings such as "Vitamin C" are legitimately identical in both languages. */
const UNTRANSLATED_THRESHOLD = 24;

function expectTranslated(text: LocalizedText, context: string): void {
  for (const locale of LOCALES) {
    expect(text[locale].trim(), `${context} [${locale}] is empty`).not.toBe("");
  }
  if (text.en.length > UNTRANSLATED_THRESHOLD) {
    expect(text.de, `${context} looks untranslated`).not.toBe(text.en);
  }
}

describe("UI messages", () => {
  it("labels every class-specific matrix column in every language", () => {
    for (const foodClass of FOOD_CLASSES) {
      for (const column of classExtraColumns(foodClass)) {
        for (const locale of LOCALES) {
          expect(MESSAGES[locale].extras[column], `${column} [${locale}]`).toBeTruthy();
        }
      }
    }
  });

  it("keeps the German and English extra-column keys in sync", () => {
    expect(Object.keys(de.extras).sort()).toEqual(Object.keys(en.extras).sort());
  });

  it("labels every nutrient, provenance category, and preparation in both languages", () => {
    const tables = { MICRO_LABELS, NUTRIENT_LABELS, PROVENANCE_LABELS, PREPARATION_LABELS };
    for (const [table, labels] of Object.entries(tables)) {
      for (const [key, label] of Object.entries(labels)) {
        for (const locale of LOCALES) {
          expect(label[locale].trim(), `${table}.${key} [${locale}]`).not.toBe("");
        }
      }
    }
  });

  it("translates list content item by item", () => {
    expect(de.limits.nonClaims).toHaveLength(en.limits.nonClaims.length);
    expect(de.limits.willDo).toHaveLength(en.limits.willDo.length);
    expect(de.source.general).toHaveLength(en.source.general.length);
    expect(de.method.storageContaminants).toHaveLength(en.method.storageContaminants.length);
  });

  it("labels compounds, NOVA groups, body stores, and additives in both languages", () => {
    const tables = { BIOACTIVE_LABELS, BIOACTIVE_ROLES, NOVA_LABELS, BODY_STORE_LABELS, ADDITIVE_LABELS };
    for (const [table, labels] of Object.entries(tables)) {
      for (const [key, label] of Object.entries(labels)) {
        expectTranslated(label, `${table}.${key}`);
      }
    }
  });
});

describe("bilingual data and engine output", () => {
  it("ships every food's notes in both languages", () => {
    for (const food of FOODS) {
      for (const note of food.notes) {
        expectTranslated(note, `${food.id} note`);
      }
    }
  });

  it("describes every compound value, body store, and calcium study in both languages", () => {
    for (const food of FOODS) {
      for (const compound of BIOACTIVE_COMPOUNDS) {
        const value = bioactiveValue(food, compound);
        if (value.status === "value" || value.status === "notDetected") {
          expectTranslated(value.measured, `${food.id} ${compound} measured`);
        }
        if (value.status === "notExpected") expectTranslated(value.reason, `${food.id} ${compound} reason`);
      }
    }
    for (const [nutrient, storage] of Object.entries(BODY_STORAGE)) {
      expectTranslated(storage.site, `BODY_STORAGE.${nutrient}`);
    }
    for (const row of calciumStudyRows()) expectTranslated(row.studiedFood, "calcium study");
  });

  it("emits every scoring flag in both languages", () => {
    for (const card of scoreCatalog(FOODS)) {
      const axes = [card.eaa, card.efa, card.carb, card.micro, card.fibre, card.residue, card.degradation];
      for (const axis of axes) {
        for (const flag of axis.flags) {
          expectTranslated(flag, `${card.foodId} flag "${flag.en}"`);
        }
      }
    }
  });

  it("emits every recommendation text in both languages", () => {
    const plates = [
      [],
      FOODS.map((food) => food.id),
      FOODS.filter((food) => kingdomOf(food.class) === "plant").map((food) => food.id),
      FOODS.filter((food) => kingdomOf(food.class) === "animal").map((food) => food.id),
    ];
    for (const pattern of DIETARY_PATTERNS) {
      for (const selectedIds of plates) {
        const rec = recommend({ pattern, selectedIds });
        expectTranslated(rec.headline, `${pattern} headline`);
        for (const gap of rec.gaps) {
          expectTranslated(gap.title, `${pattern} gap ${gap.id} title`);
          expectTranslated(gap.detail, `${pattern} gap ${gap.id} detail`);
        }
        for (const practice of rec.practices) {
          expectTranslated(practice, `${pattern} practice`);
        }
      }
    }
  });
});

describe("locale selection", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubBrowser(languages: string[], stored: string | null = null): void {
    vi.stubGlobal("localStorage", { getItem: () => stored, setItem: () => undefined });
    vi.stubGlobal("navigator", { languages, language: languages[0] ?? "" });
  }

  it("follows the browser language on first visit", () => {
    stubBrowser(["de-AT", "en"]);
    expect(readLocale()).toBe("de");
    stubBrowser(["en-US", "de"]);
    expect(readLocale()).toBe("en");
    stubBrowser(["fr-FR"]);
    expect(readLocale()).toBe("en");
  });

  it("prefers a stored choice over the browser language", () => {
    stubBrowser(["en-US"], "de");
    expect(readLocale()).toBe("de");
  });

  it("ignores stored values that are not supported locales", () => {
    stubBrowser(["en-US"], "fr");
    expect(readLocale()).toBe("en");
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("de")).toBe(true);
  });
});
