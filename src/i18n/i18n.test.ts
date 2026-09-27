import { afterEach, describe, expect, it, vi } from "vitest";
import { FOODS } from "../data/catalog";
import { recommend } from "../recommend/engine";
import { classExtraColumns } from "../scoring/extras";
import { scoreCatalog } from "../scoring/scoreFood";
import { DIETARY_PATTERNS, FOOD_CLASSES, kingdomOf } from "../scoring/types";
import { de } from "./de";
import { en } from "./en";
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

  it("translates list content item by item", () => {
    expect(de.limits.nonClaims).toHaveLength(en.limits.nonClaims.length);
    expect(de.limits.willDo).toHaveLength(en.limits.willDo.length);
    expect(de.source.general).toHaveLength(en.source.general.length);
  });
});

describe("bilingual data and engine output", () => {
  it("ships every food's state and notes in both languages", () => {
    for (const food of FOODS) {
      expectTranslated(food.edibleState, `${food.id} edibleState`);
      for (const note of food.notes) {
        expectTranslated(note, `${food.id} note`);
      }
    }
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
