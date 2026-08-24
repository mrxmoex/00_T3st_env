import { AXES, FOOD_CATEGORIES, type AxisId, type FoodCategory } from "@/lib/schema";
import type { LocaleCode } from "@/lib/schema";

export type SortKey = AxisId | "composite";

export type SearchRecord = Record<string, string | string[] | undefined>;

export type MatrixQuery = {
  q: string;
  categories: FoodCategory[];
  includeReference: boolean;
  sort: SortKey;
  selectedId: string;
  lang?: LocaleCode;
};

export type CompareQuery = {
  a: string;
  b: string;
  lang?: LocaleCode;
};

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export function parseList(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  const items = Array.isArray(value) ? value : [value];
  return items.flatMap((item) => item.split(",")).map((item) => item.trim()).filter(Boolean);
}

export function isCategory(value: string): value is FoodCategory {
  return (FOOD_CATEGORIES as readonly string[]).includes(value);
}

export function isSortKey(value: string): value is SortKey {
  return value === "composite" || (AXES as readonly string[]).includes(value);
}

function parseLang(value: string | undefined): LocaleCode | undefined {
  if (value === "de" || value === "en") {
    return value;
  }
  return undefined;
}

export function parseMatrixQuery(params: SearchRecord): MatrixQuery {
  const sortRaw = first(params.achse) ?? "composite";
  return {
    q: first(params.q) ?? "",
    categories: parseList(params.klasse).filter(isCategory),
    includeReference: first(params.ref) === "1",
    sort: isSortKey(sortRaw) ? sortRaw : "composite",
    selectedId: first(params.id) ?? "",
    lang: parseLang(first(params.lang)),
  };
}

export function serializeMatrixQuery(query: MatrixQuery): string {
  const params = new URLSearchParams();
  if (query.q.trim()) {
    params.set("q", query.q.trim());
  }
  for (const category of query.categories) {
    params.append("klasse", category);
  }
  if (query.includeReference) {
    params.set("ref", "1");
  }
  if (query.sort !== "composite") {
    params.set("achse", query.sort);
  }
  if (query.selectedId) {
    params.set("id", query.selectedId);
  }
  if (query.lang) {
    params.set("lang", query.lang);
  }
  return params.toString();
}

export function matrixHref(query: MatrixQuery): string {
  const search = serializeMatrixQuery(query);
  return search.length > 0 ? `/?${search}` : "/";
}

export function parseCompareQuery(params: SearchRecord): CompareQuery {
  return {
    a: first(params.a) ?? "beef-liver",
    b: first(params.b) ?? "lentils-cooked",
    lang: parseLang(first(params.lang)),
  };
}

export function compareHref(query: CompareQuery): string {
  const params = new URLSearchParams();
  params.set("a", query.a);
  params.set("b", query.b);
  if (query.lang) {
    params.set("lang", query.lang);
  }
  return `/compare?${params.toString()}`;
}
