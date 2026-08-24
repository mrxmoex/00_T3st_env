import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Localized, Locale, SourcedValue } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function loc(value: Localized, locale: Locale): string {
  return value[locale];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function geometricMean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const logs = values.map((value) => Math.log(Math.max(value, 12)));
  return Math.exp(logs.reduce((sum, value) => sum + value, 0) / logs.length);
}

export function kcalFromKj(kj: number): number {
  return Math.round(kj / 4.184);
}

export function gramsToMg(grams: number): number {
  return grams * 1000;
}

export function sourcedNote(value: SourcedValue, locale: Locale): string | undefined {
  return value.note ? loc(value.note, locale) : undefined;
}
