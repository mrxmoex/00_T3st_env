export const LOCALES = ["de", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Prose that ships in every UI language, e.g. engine flags and food notes. */
export type LocalizedText = Readonly<Record<Locale, string>>;

const STORAGE_KEY = "dbwdi-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function readLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;
  const preferred = navigator.languages[0] ?? navigator.language;
  return preferred.toLowerCase().startsWith("de") ? "de" : "en";
}

export function applyLocale(locale: Locale): void {
  document.documentElement.lang = locale;
  localStorage.setItem(STORAGE_KEY, locale);
}

export function foodName(food: { name: string; nameDe: string }, locale: Locale): string {
  return locale === "de" ? food.nameDe : food.name;
}

/** The food's name in the language that is not currently shown. */
export function altFoodName(food: { name: string; nameDe: string }, locale: Locale): string {
  return locale === "de" ? food.name : food.nameDe;
}
