import { FOODS } from "@/data/foods";
import { scoreCatalog } from "@/lib/scoring";
import type { AxisId, FoodCategory, ScoredFood } from "@/lib/schema";

let cached: ScoredFood[] | undefined;

export function getCatalog(): ScoredFood[] {
  cached ??= scoreCatalog(FOODS);
  return cached;
}

export function getFood(id: string): ScoredFood {
  const found = getCatalog().find((item) => item.food.id === id);
  if (!found) {
    throw new Error(`Unknown food: ${id}`);
  }
  return found;
}

export function sortCatalog(
  items: readonly ScoredFood[],
  axis: AxisId | "composite",
): ScoredFood[] {
  return [...items].sort((a, b) => {
    const left = axis === "composite" ? a.composite : axisValue(a, axis);
    const right = axis === "composite" ? b.composite : axisValue(b, axis);
    return right - left;
  });
}

function axisValue(item: ScoredFood, axis: AxisId): number {
  const found = item.axes.find((entry) => entry.axis === axis);
  return found?.score ?? 0;
}

export function filterCatalog(options: {
  categories?: readonly FoodCategory[];
  includeReference?: boolean;
  query?: string;
}): ScoredFood[] {
  const query = options.query?.trim().toLowerCase() ?? "";
  return getCatalog().filter((item) => {
    if (!options.includeReference && item.food.referenceOnly) {
      return false;
    }
    if (options.categories && options.categories.length > 0) {
      if (!options.categories.includes(item.food.category)) {
        return false;
      }
    }
    if (!query) {
      return true;
    }
    return (
      item.food.names.de.toLowerCase().includes(query) ||
      item.food.names.en.toLowerCase().includes(query) ||
      item.food.id.includes(query)
    );
  });
}
