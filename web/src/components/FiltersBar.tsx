import {
  ANIMAL_CLASSES,
  PLANT_CLASSES,
  SCORE_AXES,
  axisLabel,
  foodClassLabel,
  patternLabel,
} from "../catalog/labels.ts";
import type { DietaryPattern, FoodClass, Kingdom, ScoreAxis } from "../types/domain.ts";

export interface FilterState {
  kingdom: Kingdom | "all";
  foodClass: FoodClass | "all";
  axis: ScoreAxis;
  pattern: DietaryPattern | "all";
  query: string;
}

export const DEFAULT_FILTERS: FilterState = {
  kingdom: "all",
  foodClass: "all",
  axis: "composite",
  pattern: "all",
  query: "",
};

export function FiltersBar({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
}) {
  return (
    <div className="filters" role="search">
      <label>
        Search
        <input
          type="search"
          value={value.query}
          placeholder="Spinach, Lachs…"
          onChange={(event) => onChange({ ...value, query: event.target.value })}
        />
      </label>
      <label>
        Kingdom
        <select
          value={value.kingdom}
          onChange={(event) =>
            onChange({
              ...value,
              kingdom: event.target.value as FilterState["kingdom"],
              foodClass: "all",
            })
          }
        >
          <option value="all">All</option>
          <option value="plant">Plant</option>
          <option value="animal">Animal</option>
        </select>
      </label>
      <label>
        Class
        <select
          value={value.foodClass}
          onChange={(event) =>
            onChange({ ...value, foodClass: event.target.value as FilterState["foodClass"] })
          }
        >
          <option value="all">All classes</option>
          <optgroup label="Plant">
            {PLANT_CLASSES.map((foodClass) => (
              <option key={foodClass} value={foodClass}>
                {foodClassLabel(foodClass)}
              </option>
            ))}
          </optgroup>
          <optgroup label="Animal">
            {ANIMAL_CLASSES.map((foodClass) => (
              <option key={foodClass} value={foodClass}>
                {foodClassLabel(foodClass)}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
      <label>
        Sort axis
        <select
          value={value.axis}
          onChange={(event) =>
            onChange({ ...value, axis: event.target.value as ScoreAxis })
          }
        >
          {SCORE_AXES.map((axis) => (
            <option key={axis} value={axis}>
              {axisLabel(axis)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Dietary pattern
        <select
          value={value.pattern}
          onChange={(event) =>
            onChange({ ...value, pattern: event.target.value as FilterState["pattern"] })
          }
        >
          <option value="all">No pattern filter</option>
          <option value="plant_only">{patternLabel("plant_only")}</option>
          <option value="animal_inclusive">{patternLabel("animal_inclusive")}</option>
          <option value="hybrid">{patternLabel("hybrid")}</option>
        </select>
      </label>
    </div>
  );
}

export function matchesPattern(
  kingdom: Kingdom,
  pattern: DietaryPattern | "all",
): boolean {
  switch (pattern) {
    case "all":
    case "hybrid":
    case "animal_inclusive":
      return true;
    case "plant_only":
      return kingdom === "plant";
    default: {
      const _exhaustive: never = pattern;
      return _exhaustive;
    }
  }
}
