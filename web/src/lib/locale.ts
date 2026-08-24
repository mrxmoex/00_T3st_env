import { headers } from "next/headers";
import type { LocaleCode } from "@/lib/schema";

export async function getLocale(): Promise<LocaleCode> {
  const headerList = await headers();
  return headerList.get("x-nahrung-locale") === "en" ? "en" : "de";
}

export function withLang(href: string, locale: LocaleCode): string {
  const url = new URL(href, "https://nahrung.local");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}${url.hash}`;
}
